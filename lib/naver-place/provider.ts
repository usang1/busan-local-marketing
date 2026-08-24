import { isAllowedNaverHost } from "@/lib/naver-place/parse-url";
import { emptyPlaceData, firstText, safeDateString, toNumber } from "@/lib/naver-place/normalize";
import type { NaverPlaceData } from "@/lib/naver-place/types";

type ProviderSuccess = {
  success: true;
  place: NaverPlaceData;
};

type ProviderFailure = {
  success: false;
  code: "PLACE_NOT_FOUND" | "PLACE_FETCH_FAILED";
  message: string;
};

export interface NaverPlaceProvider {
  getPlace(input: { placeId: string; sourceUrl: string; normalizedUrl: string }): Promise<ProviderSuccess | ProviderFailure>;
}

type CollectedValues = {
  name: string | null;
  category: string | null;
  address: string | null;
  roadAddress: string | null;
  phone: string | null;
  hours: string | null;
  description: string | null;
  imageUrls: Set<string>;
  visitorCount: number | null;
  blogCount: number | null;
  rating: number | null;
  latestReviewDate: string | null;
  menuItems: Array<{ name: string; price: number | null }>;
  booking: boolean | null;
  order: boolean | null;
};

function decodeHtml(value: string) {
  return value
    .replace(/&quot;/g, "\"")
    .replace(/&#34;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function findMetaContent(html: string, names: string[]) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
    const reversePattern = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i");
    const match = html.match(pattern) || html.match(reversePattern);
    if (match?.[1]) return stripTags(match[1]);
  }
  return null;
}

function extractJsonScripts(html: string) {
  const scripts: unknown[] = [];
  const scriptPattern = /<script[^>]*(?:type=["']application\/ld\+json["']|id=["']__NEXT_DATA__["'])[^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptPattern.exec(html))) {
    const content = decodeHtml(match[1] || "").trim();
    if (!content) continue;
    try {
      scripts.push(JSON.parse(content));
    } catch {
      // Ignore scripts that are not valid JSON in the public HTML.
    }
  }

  return scripts;
}

function getObjectValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return null;
}

function walkJson(value: unknown, visitor: (record: Record<string, unknown>) => void) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) walkJson(item, visitor);
    return;
  }

  const record = value as Record<string, unknown>;
  visitor(record);
  for (const item of Object.values(record)) walkJson(item, visitor);
}

function pushMenuItem(values: CollectedValues, name: unknown, price: unknown) {
  if (typeof name !== "string" || !name.trim()) return;
  const normalizedName = stripTags(name).slice(0, 80);
  if (!normalizedName || values.menuItems.some((item) => item.name === normalizedName)) return;
  values.menuItems.push({
    name: normalizedName,
    price: toNumber(price),
  });
}

function collectFromJson(html: string, values: CollectedValues) {
  for (const script of extractJsonScripts(html)) {
    walkJson(script, (record) => {
      values.name ||= firstText(getObjectValue(record, ["name", "businessName", "placeName"]));
      values.category ||= firstText(getObjectValue(record, ["category", "categoryName", "businessCategory"]));
      values.address ||= firstText(getObjectValue(record, ["address", "jibunAddress"]));
      values.roadAddress ||= firstText(getObjectValue(record, ["roadAddress", "roadAddr", "streetAddress"]));
      values.phone ||= firstText(getObjectValue(record, ["telephone", "phone", "virtualPhone"]));
      values.description ||= firstText(getObjectValue(record, ["description", "microReview", "intro", "businessDescription"]));
      values.hours ||= firstText(getObjectValue(record, ["openingHours", "businessHours", "bizhourInfo", "businessHoursText"]));
      values.visitorCount ??= toNumber(getObjectValue(record, ["visitorReviewCount", "visitorReviewsTotal", "reviewCount"]));
      values.blogCount ??= toNumber(getObjectValue(record, ["blogReviewCount", "blogReviewsTotal"]));
      values.rating ??= toNumber(getObjectValue(record, ["ratingValue", "score", "averageRating"]));
      values.latestReviewDate ||= safeDateString(getObjectValue(record, ["latestReviewDate", "createdDate", "created"]));

      const image = getObjectValue(record, ["image", "imageUrl", "photoUrl", "thumbnail", "thumbnailUrl"]);
      if (typeof image === "string" && image.startsWith("http")) values.imageUrls.add(image);
      if (Array.isArray(image)) {
        for (const item of image) {
          if (typeof item === "string" && item.startsWith("http")) values.imageUrls.add(item);
        }
      }

      const menuName = getObjectValue(record, ["menuName", "menuNameKo"]);
      const menuPrice = getObjectValue(record, ["price", "priceText", "menuPrice"]);
      if (menuName || menuPrice) pushMenuItem(values, menuName || getObjectValue(record, ["name"]), menuPrice);

      const bookingValue = getObjectValue(record, ["bookingUrl", "bookingBusinessId", "reservationUrl", "isBooking"]);
      if (bookingValue === true || typeof bookingValue === "string") values.booking = true;
      const orderValue = getObjectValue(record, ["orderUrl", "baeminUrl", "orderBusinessId", "isOrder"]);
      if (orderValue === true || typeof orderValue === "string") values.order = true;
    });
  }
}

function collectFromHtml(html: string, values: CollectedValues) {
  values.name ||= findMetaContent(html, ["og:title"])?.replace(/ : 네이버(?: 지도| 플레이스)?$/, "") || null;
  values.description ||= findMetaContent(html, ["og:description", "description"]);
  const ogImage = findMetaContent(html, ["og:image"]);
  if (ogImage?.startsWith("http")) values.imageUrls.add(ogImage);

  values.visitorCount ??= toNumber(html.match(/방문자\s*리뷰\s*([0-9,]+)/)?.[1]);
  values.blogCount ??= toNumber(html.match(/블로그\s*리뷰\s*([0-9,]+)/)?.[1]);
  values.rating ??= toNumber(html.match(/(?:평점|별점)\s*([0-9.]+)/)?.[1]);
  values.phone ||= firstText(html.match(/(?:전화번호|phone)["':\s]*([0-9+\-\s().]{8,30})/)?.[1]);
  values.roadAddress ||= firstText(html.match(/도로명(?:주소)?["':\s]*([^"<>{}[\]]{4,80})/)?.[1]);
  values.address ||= firstText(html.match(/지번(?:주소)?["':\s]*([^"<>{}[\]]{4,80})/)?.[1]);

  const latestDate = html.match(/(20\d{2}[.\-/년\s]+\d{1,2}[.\-/월\s]+\d{1,2})/)?.[1];
  values.latestReviewDate ||= safeDateString(latestDate);

  if (/(예약하기|예약\s*가능|bookingUrl|reservationUrl)/i.test(html)) values.booking = true;
  if (/(주문하기|주문\s*가능|orderUrl|배달|포장)/i.test(html)) values.order = true;

  for (const match of html.matchAll(/https?:\\?\/\\?\/[^"'\s<>]+?(?:jpg|jpeg|png|webp)/gi)) {
    const url = match[0].replaceAll("\\/", "/");
    if (url.startsWith("http")) values.imageUrls.add(url);
  }
}

async function fetchAllowedText(initialUrl: string) {
  let currentUrl = initialUrl;

  for (let depth = 0; depth < 4; depth += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "ko-KR,ko;q=0.9,en;q=0.5",
        "user-agent": "Mozilla/5.0 (compatible; MarkivoPlaceAudit/1.0; +https://markivo.kr)",
      },
    });

    if (response.status === 404) return { status: 404, text: "", finalUrl: currentUrl };
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) return { status: response.status, text: "", finalUrl: currentUrl };
      const nextUrl = new URL(location, currentUrl);
      if (!isAllowedNaverHost(nextUrl.hostname)) {
        return { status: 0, text: "", finalUrl: currentUrl };
      }
      currentUrl = nextUrl.toString();
      continue;
    }

    return {
      status: response.status,
      text: await response.text(),
      finalUrl: currentUrl,
    };
  }

  return { status: 0, text: "", finalUrl: currentUrl };
}

function limitedPlaceData({
  placeId,
  sourceUrl,
  normalizedUrl,
  finalUrl,
  reason,
}: {
  placeId: string;
  sourceUrl: string;
  normalizedUrl: string;
  finalUrl?: string;
  reason: string;
}): NaverPlaceData {
  return emptyPlaceData({
    placeId,
    sourceUrl,
    normalizedUrl: finalUrl || normalizedUrl,
    warnings: [
      reason,
      "네이버 공개 페이지에서 확인되지 않은 값은 점수 계산에서 제외했습니다.",
    ],
  });
}

export class PublicNaverPlaceProvider implements NaverPlaceProvider {
  async getPlace({
    placeId,
    sourceUrl,
    normalizedUrl,
  }: {
    placeId: string;
    sourceUrl: string;
    normalizedUrl: string;
  }): Promise<ProviderSuccess | ProviderFailure> {
    let fetched: Awaited<ReturnType<typeof fetchAllowedText>>;

    try {
      fetched = await fetchAllowedText(normalizedUrl);
    } catch {
      return {
        success: true,
        place: limitedPlaceData({
          placeId,
          sourceUrl,
          normalizedUrl,
          reason: "네이버 공개 페이지 요청이 실패해 제한 진단으로 처리했습니다.",
        }),
      };
    }

    if (fetched.status === 404) {
      return {
        success: false,
        code: "PLACE_NOT_FOUND",
        message: "매장 정보를 찾을 수 없습니다.",
      };
    }

    if (fetched.status < 200 || fetched.status >= 400 || !fetched.text) {
      return {
        success: true,
        place: limitedPlaceData({
          placeId,
          sourceUrl,
          normalizedUrl,
          finalUrl: fetched.finalUrl,
          reason: `네이버 공개 페이지 응답을 분석할 수 없어 제한 진단으로 처리했습니다. 응답 상태: ${fetched.status || "확인 불가"}`,
        }),
      };
    }

    const values: CollectedValues = {
      name: null,
      category: null,
      address: null,
      roadAddress: null,
      phone: null,
      hours: null,
      description: null,
      imageUrls: new Set<string>(),
      visitorCount: null,
      blogCount: null,
      rating: null,
      latestReviewDate: null,
      menuItems: [],
      booking: null,
      order: null,
    };

    collectFromJson(fetched.text, values);
    collectFromHtml(fetched.text, values);

    const place = emptyPlaceData({
      placeId,
      sourceUrl,
      normalizedUrl: fetched.finalUrl || normalizedUrl,
      warnings: [],
    });
    const description = values.description ? stripTags(values.description) : null;
    const imageCount = values.imageUrls.size || null;

    place.name = values.name;
    place.category = values.category;
    place.address = values.address;
    place.roadAddress = values.roadAddress;
    place.phone = values.phone;
    place.businessHours = {
      available: Boolean(values.hours),
      text: values.hours,
      openNow: null,
    };
    place.conversion = {
      phone: values.phone ? true : null,
      booking: values.booking,
      order: values.order,
      directions: values.address || values.roadAddress ? true : null,
    };
    place.description = {
      exists: Boolean(description),
      length: description ? description.length : null,
      text: description,
    };
    place.images = {
      representativeExists: imageCount ? true : null,
      count: imageCount,
    };
    place.menu = {
      exists: values.menuItems.length ? true : null,
      count: values.menuItems.length || null,
      items: values.menuItems.slice(0, 10),
    };
    place.reviews = {
      visitorCount: values.visitorCount,
      blogCount: values.blogCount,
      rating: values.rating,
      latestReviewDate: values.latestReviewDate,
      last7DaysCount: null,
      last30DaysCount: null,
    };
    place.availability = {
      reviews: values.visitorCount !== null || values.blogCount !== null || values.rating !== null || values.latestReviewDate !== null,
      images: imageCount !== null,
      menu: values.menuItems.length > 0,
      businessHours: Boolean(values.hours),
    };

    if (!place.availability.reviews) place.warnings.push("리뷰 데이터는 공개 HTML에서 확인되지 않았습니다.");
    if (!place.availability.menu) place.warnings.push("메뉴 데이터는 공개 HTML에서 확인되지 않았습니다.");
    if (!place.availability.businessHours) place.warnings.push("영업시간 데이터는 공개 HTML에서 확인되지 않았습니다.");

    return { success: true, place };
  }
}

export function createNaverPlaceProvider(): NaverPlaceProvider {
  return new PublicNaverPlaceProvider();
}
