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
  imageCount: number | null;
  visitorCount: number | null;
  blogCount: number | null;
  rating: number | null;
  latestReviewDate: string | null;
  menuItems: Array<{ name: string; price: number | null }>;
  booking: boolean | null;
  order: boolean | null;
};

const desktopUserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function categoryFromRecord(record: Record<string, unknown>) {
  const category = getObjectValue(record, ["category", "categoryName", "categoryPath", "businessCategory"]);
  if (Array.isArray(category)) return category.filter((item) => typeof item === "string" && item.trim()).join(" > ") || null;
  return firstText(category);
}

function firstNumber(values: unknown[]) {
  for (const value of values) {
    const number = toNumber(value);
    if (number !== null) return number;
  }
  return null;
}

function collectImages(value: unknown, values: CollectedValues) {
  if (typeof value === "string" && /^https?:\/\//.test(value)) {
    values.imageUrls.add(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectImages(item, values);
    return;
  }

  if (!isRecord(value)) return;
  collectImages(getObjectValue(value, ["url", "origin", "imageUrl", "thumbnail", "thumbnailUrl"]), values);
}

function parseWindowJson(html: string, name: string) {
  const start = html.indexOf(`window.${name}`);
  if (start < 0) return null;
  const equals = html.indexOf("=", start);
  const brace = html.indexOf("{", equals);
  if (equals < 0 || brace < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = brace; index < html.length; index += 1) {
    const char = html[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "\"") inString = false;
      continue;
    }

    if (char === "\"") inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(brace, index + 1)) as Record<string, unknown>;
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

function resolveApolloValue(value: unknown, cache: Record<string, unknown>, seen = new Set<string>()): unknown {
  if (!value) return value;
  if (Array.isArray(value)) return value.map((item) => resolveApolloValue(item, cache, seen));
  if (!isRecord(value)) return value;

  const ref = value.__ref;
  if (typeof ref === "string") {
    if (seen.has(ref)) return null;
    seen.add(ref);
    return resolveApolloValue(cache[ref], cache, seen);
  }

  const resolved: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    resolved[key] = resolveApolloValue(child, cache, seen);
  }
  return resolved;
}

function countApolloTopPhotos(cache: Record<string, unknown>) {
  const photoItems = Object.values(cache).filter((item) => isRecord(item) && item.__typename === "PlaceDetailTopPhotoItem" && item.origin);
  const maxNo = Math.max(
    0,
    ...photoItems
      .map((item) => (isRecord(item) ? Number(item.no || 0) : 0))
      .filter(Number.isFinite),
  );
  return Math.max(photoItems.length, maxNo) || null;
}

function asResolvedRecord(value: unknown, cache: Record<string, unknown>) {
  const resolved = resolveApolloValue(value, cache);
  return isRecord(resolved) ? resolved : null;
}

function collectFromApolloState(html: string, values: CollectedValues) {
  const apollo = parseWindowJson(html, "__APOLLO_STATE__");
  if (!apollo) return;

  const root = isRecord(apollo.ROOT_QUERY) ? apollo.ROOT_QUERY : {};
  const placeEntries = Object.entries(root).filter(([key]) => key.includes("placeDetail"));
  const topPhotoCount = countApolloTopPhotos(apollo);

  for (const [, placeEntry] of placeEntries) {
    const business = asResolvedRecord(placeEntry, apollo);
    if (!business) continue;

    const base = asResolvedRecord(business.base, apollo) || business;
    const fsasReviews = asResolvedRecord(business.fsasReviews, apollo) || {};
    const visitorReviewStats = asResolvedRecord(business.visitorReviewStats, apollo) || {};
    const photoTabInfo = asResolvedRecord(business.photoTabInfo, apollo) || {};
    const cpImages = asResolvedRecord(business.cpImages, apollo) || {};

    values.name ||= firstText(base.name, base.businessName, business.name);
    values.category ||= categoryFromRecord(base) || categoryFromRecord(business);
    values.address ||= firstText(base.address, base.jibunAddress, business.address);
    values.roadAddress ||= firstText(base.roadAddress, base.roadAddr, business.roadAddress);
    values.phone ||= firstText(base.phone, base.telephone, base.virtualPhone, business.phone);
    values.description ||= firstText(base.description, base.microReview, base.intro, business.description);
    values.hours ||= firstText(base.businessHours, base.bizhourInfo, base.businessHoursText, business.businessHours);
    values.visitorCount ??= firstNumber([
      visitorReviewStats.visitorReviewsTotal,
      base.visitorReviewsTotal,
      base.visitorReviewCount,
      base.reviewCount,
      business.visitorReviewCount,
    ]);
    values.blogCount ??= firstNumber([
      fsasReviews.total,
      base.blogCafeReviewCount,
      base.blogReviewCount,
      business.blogReviewCount,
    ]);
    values.rating ??= firstNumber([
      base.visitorReviewScore,
      base.reviewScore,
      base.rating,
      business.rating,
    ]);
    values.imageCount ??= firstNumber([
      photoTabInfo.total,
      photoTabInfo.totalCount,
      cpImages.total,
      cpImages.totalCount,
      Array.isArray(cpImages.items) ? cpImages.items.length : null,
      topPhotoCount,
    ]);

    collectImages(base.image, values);
    collectImages(base.images, values);
    collectImages(base.photo, values);
    collectImages(base.thumbnail, values);
    collectImages(cpImages.items, values);

    const menus = resolveApolloValue(getObjectValue(base, ["menus", "menuList"]) || getObjectValue(business, ["menus", "menuList"]), apollo);
    if (Array.isArray(menus)) {
      for (const menu of menus) {
        if (!isRecord(menu)) continue;
        pushMenuItem(values, getObjectValue(menu, ["name", "menuName", "menuNameKo"]), getObjectValue(menu, ["price", "priceText", "menuPrice"]));
      }
    }

    const bookingValue = getObjectValue(base, ["bookingUrl", "bookingBusinessId", "reservationUrl", "isBooking"]);
    if (bookingValue === true || typeof bookingValue === "string") values.booking = true;
    if (bookingValue === false) values.booking = false;
    const orderValue = getObjectValue(base, ["orderUrl", "baeminUrl", "orderBusinessId", "isOrder"]);
    if (orderValue === true || typeof orderValue === "string") values.order = true;
    if (orderValue === false) values.order = false;
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

function uniqueFetchUrls(placeId: string, normalizedUrl: string) {
  return Array.from(
    new Set([
      `https://pcmap.place.naver.com/place/${placeId}`,
      normalizedUrl,
      `https://m.place.naver.com/place/${placeId}/home`,
    ]),
  );
}

async function fetchAllowedText(initialUrl: string, sourceUrl: string) {
  let currentUrl = initialUrl;

  for (let depth = 0; depth < 4; depth += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8",
        referer: sourceUrl.startsWith("http") ? sourceUrl : "https://map.naver.com/",
        "user-agent": desktopUserAgent,
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
  dataStatus,
}: {
  placeId: string;
  sourceUrl: string;
  normalizedUrl: string;
  finalUrl?: string;
  reason: string;
  dataStatus: NaverPlaceData["dataStatus"];
}): NaverPlaceData {
  return emptyPlaceData({
    placeId,
    sourceUrl,
    normalizedUrl: finalUrl || normalizedUrl,
    dataStatus,
    failureReason: reason,
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
    let fetched: Awaited<ReturnType<typeof fetchAllowedText>> | null = null;
    let fetchError: unknown = null;

    for (const url of uniqueFetchUrls(placeId, normalizedUrl)) {
      try {
        const candidate = await fetchAllowedText(url, sourceUrl);
        if (candidate.status === 404) {
          fetched = candidate;
          break;
        }
        if (candidate.status >= 200 && candidate.status < 400 && candidate.text) {
          fetched = candidate;
          break;
        }
        fetched ||= candidate;
      } catch (error) {
        fetchError = error;
      }
    }

    if (!fetched) {
      return {
        success: true,
        place: limitedPlaceData({
          placeId,
          sourceUrl,
          normalizedUrl,
          reason: "네이버 공개 페이지 요청이 실패해 제한 진단으로 처리했습니다.",
          dataStatus: "fetch_failed",
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
      const failedStatus = fetched.status < 200 || fetched.status >= 400 || fetchError;
      return {
        success: true,
        place: limitedPlaceData({
          placeId,
          sourceUrl,
          normalizedUrl,
          finalUrl: fetched.finalUrl,
          reason: `네이버 공개 페이지 응답을 분석할 수 없어 제한 진단으로 처리했습니다. 응답 상태: ${fetched.status || "확인 불가"}`,
          dataStatus: failedStatus ? "fetch_failed" : "parse_failed",
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
      imageCount: null,
      visitorCount: null,
      blogCount: null,
      rating: null,
      latestReviewDate: null,
      menuItems: [],
      booking: null,
      order: null,
    };

    collectFromApolloState(fetched.text, values);
    collectFromJson(fetched.text, values);
    collectFromHtml(fetched.text, values);

    const coreDataFound = Boolean(values.name || values.category || values.address || values.roadAddress);
    const availableSignals = [
      values.name,
      values.category,
      values.address || values.roadAddress,
      values.phone,
      values.hours,
      values.description,
      values.imageCount ?? (values.imageUrls.size || null),
      values.visitorCount,
      values.blogCount,
      values.rating,
      values.menuItems.length || null,
    ].filter((value) => value !== null && value !== "").length;
    const dataStatus: NaverPlaceData["dataStatus"] = coreDataFound ? (availableSignals >= 5 ? "success" : "partial") : "parse_failed";
    const failureReason = dataStatus === "parse_failed" ? "네이버 응답에서 업체 핵심 정보를 확인하지 못했습니다." : null;
    const place = emptyPlaceData({
      placeId,
      sourceUrl,
      normalizedUrl: fetched.finalUrl || normalizedUrl,
      dataStatus,
      failureReason,
      warnings: [],
    });
    const description = values.description ? stripTags(values.description) : null;
    const imageCount = values.imageCount ?? (values.imageUrls.size || null);

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

    if (place.dataStatus === "parse_failed") {
      place.warnings.push("네이버 플레이스 공개 데이터를 정상적으로 불러오지 못했습니다. 잠시 후 다시 시도하거나 다른 네이버 플레이스 URL을 입력해 주세요.");
    }
    if (!place.availability.reviews) place.warnings.push("리뷰 데이터는 공개 HTML에서 확인되지 않았습니다.");
    if (!place.availability.menu) place.warnings.push("메뉴 데이터는 공개 HTML에서 확인되지 않았습니다.");
    if (!place.availability.businessHours) place.warnings.push("영업시간 데이터는 공개 HTML에서 확인되지 않았습니다.");

    return { success: true, place };
  }
}

export function createNaverPlaceProvider(): NaverPlaceProvider {
  return new PublicNaverPlaceProvider();
}
