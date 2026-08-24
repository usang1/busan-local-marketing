const allowedNaverHosts = new Set([
  "naver.com",
  "www.naver.com",
  "map.naver.com",
  "m.map.naver.com",
  "m.place.naver.com",
  "place.naver.com",
  "pcmap.place.naver.com",
  "place.map.naver.com",
  "naver.me",
]);

const placePathKinds = [
  "place",
  "restaurant",
  "cafe",
  "hospital",
  "hairshop",
  "beauty",
  "store",
  "business",
  "accommodation",
  "lodging",
  "attraction",
  "shopping",
  "theater",
  "pharmacy",
  "mart",
  "cvs",
  "gas",
  "school",
  "golfcourse",
  "trail",
  "pet",
  "popupstore",
  "pollingplace",
  "evcs",
  "parking",
] as const;

type PlacePathKind = (typeof placePathKinds)[number];

const placePathKindPattern = placePathKinds.join("|");

export type ParsedNaverPlaceUrl =
  | {
      valid: true;
      placeId: string;
      normalizedUrl: string;
      inputUrl: string;
    }
  | {
      valid: false;
      reason: "invalid_url" | "unsupported_host" | "missing_place_id" | "redirect_failed";
      message: string;
    };

function cleanInput(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(naver\.com|www\.naver\.com|map\.naver\.com|m\.map\.naver\.com|m\.place\.naver\.com|place\.naver\.com|pcmap\.place\.naver\.com|place\.map\.naver\.com|naver\.me)\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function isAllowedNaverHost(hostname: string) {
  return allowedNaverHosts.has(hostname.toLowerCase());
}

export function normalizePlaceHomeUrl(placeId: string, pathKind: PlacePathKind = "place") {
  return `https://m.place.naver.com/${pathKind}/${placeId}/home`;
}

function extractPlaceIdentity(url: URL) {
  const pathname = safeDecode(url.pathname);
  const entryMatch = pathname.match(/\/(?:p\/)?entry\/place\/(\d+)(?:[/?#]|$)/);
  if (entryMatch?.[1]) return { placeId: entryMatch[1], pathKind: "place" as const };

  const kindMatch = pathname.match(new RegExp(`/(?:${placePathKindPattern})/(\\d+)(?:[/?#]|$)`));
  if (kindMatch?.[1]) {
    const pathKind = pathname.split("/").find((part): part is PlacePathKind =>
      (placePathKinds as readonly string[]).includes(part),
    );
    return { placeId: kindMatch[1], pathKind: pathKind || "place" };
  }

  const decodedUrl = safeDecode(url.href);
  const fullEntryMatch = decodedUrl.match(/\/(?:p\/)?entry\/place\/(\d{5,})(?:[/?#&]|$)/);
  if (fullEntryMatch?.[1]) return { placeId: fullEntryMatch[1], pathKind: "place" as const };

  const fullKindMatch = decodedUrl.match(new RegExp(`/(?:${placePathKindPattern})/(\\d{5,})(?:[/?#&]|$)`));
  if (fullKindMatch?.[1]) return { placeId: fullKindMatch[1], pathKind: "place" as const };

  const placeId = url.searchParams.get("placeId") || url.searchParams.get("place_id") || url.searchParams.get("id");
  return placeId && /^\d+$/.test(placeId) ? { placeId, pathKind: "place" as const } : null;
}

export function extractNaverPlaceId(input: string): ParsedNaverPlaceUrl {
  const cleaned = cleanInput(input);
  let url: URL;

  if (/^\d{5,}$/.test(cleaned)) {
    return {
      valid: true,
      placeId: cleaned,
      normalizedUrl: normalizePlaceHomeUrl(cleaned),
      inputUrl: cleaned,
    };
  }

  try {
    url = new URL(cleaned);
  } catch {
    return {
      valid: false,
      reason: "invalid_url",
      message: "올바른 네이버 플레이스 주소를 입력해주세요.",
    };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return {
      valid: false,
      reason: "invalid_url",
      message: "올바른 네이버 플레이스 주소를 입력해주세요.",
    };
  }

  if (!isAllowedNaverHost(url.hostname)) {
    return {
      valid: false,
      reason: "unsupported_host",
      message: "올바른 네이버 플레이스 주소를 입력해주세요.",
    };
  }

  const placeIdentity = extractPlaceIdentity(url);
  if (!placeIdentity) {
    return {
      valid: false,
      reason: "missing_place_id",
      message: "올바른 네이버 플레이스 주소를 입력해주세요.",
    };
  }

  return {
    valid: true,
    placeId: placeIdentity.placeId,
    normalizedUrl: normalizePlaceHomeUrl(placeIdentity.placeId, placeIdentity.pathKind),
    inputUrl: url.toString(),
  };
}

function safeRedirectUrl(location: string, baseUrl: string) {
  try {
    const nextUrl = new URL(location, baseUrl);
    if (nextUrl.protocol !== "https:" && nextUrl.protocol !== "http:") return null;
    if (!isAllowedNaverHost(nextUrl.hostname)) return null;
    return nextUrl.toString();
  } catch {
    return null;
  }
}

function findPlaceUrlInHtml(html: string, baseUrl: string) {
  const decoded = html.replaceAll("\\/", "/").replace(/&amp;/g, "&");
  const candidates = [
    ...decoded.matchAll(/https?:\/\/(?:m\.place|place|pcmap\.place|place\.map|map|m\.map)\.naver\.com\/[^"'<>\s)]+/gi),
    ...decoded.matchAll(/(?:href|content)=["']([^"']*(?:\/(?:place|restaurant|cafe|hospital|hairshop|beauty|store|business|accommodation|lodging|attraction)\/|\/entry\/place\/|\/p\/entry\/place\/)\d+[^"']*)["']/gi),
  ];

  for (const match of candidates) {
    const raw = match[1] || match[0];
    const safeUrl = safeRedirectUrl(raw, baseUrl);
    if (!safeUrl) continue;
    const parsed = extractNaverPlaceId(safeUrl);
    if (parsed.valid) return parsed;
  }

  return null;
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function fetchRedirectLocation(url: string, method: "HEAD" | "GET") {
  const response = await fetch(url, {
    method,
    redirect: "manual",
    signal: AbortSignal.timeout(4000),
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "ko-KR,ko;q=0.9,en;q=0.5",
      "user-agent":
        "Mozilla/5.0 (compatible; MarkivoPlaceAudit/1.0; +https://markivo.kr)",
    },
  });

  return {
    location: response.headers.get("location"),
    html: method === "GET" && response.ok ? await response.text() : "",
  };
}

export async function resolveNaverPlaceUrl(input: string): Promise<ParsedNaverPlaceUrl> {
  const parsed = extractNaverPlaceId(input);
  if (parsed.valid || parsed.reason !== "missing_place_id") return parsed;

  let currentUrl: string;
  try {
    const cleaned = cleanInput(input);
    const url = new URL(cleaned);
    if (!isAllowedNaverHost(url.hostname)) return parsed;
    currentUrl = url.toString();
  } catch {
    return parsed;
  }

  for (let depth = 0; depth < 3; depth += 1) {
    let location: string | null = null;

    for (const method of ["HEAD", "GET"] as const) {
      try {
        const result = await fetchRedirectLocation(currentUrl, method);
        location = result.location;

        if (!location && result.html) {
          const htmlParsed = findPlaceUrlInHtml(result.html, currentUrl);
          if (htmlParsed) return htmlParsed;
        }

        if (location || result.html) break;
      } catch {
        continue;
      }
    }

    if (!location) break;
    const nextUrl = safeRedirectUrl(location, currentUrl);
    if (!nextUrl) break;
    currentUrl = nextUrl;
    const nextParsed = extractNaverPlaceId(currentUrl);
    if (nextParsed.valid) return nextParsed;
  }

  return {
    valid: false,
    reason: "redirect_failed",
    message: "올바른 네이버 플레이스 주소를 입력해주세요.",
  };
}
