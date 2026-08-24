const allowedNaverHosts = new Set([
  "naver.com",
  "www.naver.com",
  "map.naver.com",
  "m.map.naver.com",
  "m.place.naver.com",
  "pcmap.place.naver.com",
  "place.map.naver.com",
  "naver.me",
]);

const placePathPatterns = [
  /\/p\/entry\/place\/(\d+)(?:[/?#]|$)/,
  /\/entry\/place\/(\d+)(?:[/?#]|$)/,
  /\/(?:place|restaurant|cafe|hospital|hairshop|beauty|store|business|accommodation|lodging|attraction)\/(\d+)(?:[/?#]|$)/,
];

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
  if (/^(naver\.com|www\.naver\.com|map\.naver\.com|m\.map\.naver\.com|m\.place\.naver\.com|pcmap\.place\.naver\.com|place\.map\.naver\.com|naver\.me)\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function isAllowedNaverHost(hostname: string) {
  return allowedNaverHosts.has(hostname.toLowerCase());
}

export function normalizePlaceHomeUrl(placeId: string) {
  return `https://m.place.naver.com/place/${placeId}/home`;
}

function extractPlaceId(url: URL) {
  const pathname = decodeURIComponent(url.pathname);
  for (const pattern of placePathPatterns) {
    const match = pathname.match(pattern);
    if (match?.[1]) return match[1];
  }

  const placeId = url.searchParams.get("placeId") || url.searchParams.get("place_id");
  return placeId && /^\d+$/.test(placeId) ? placeId : null;
}

export function extractNaverPlaceId(input: string): ParsedNaverPlaceUrl {
  const cleaned = cleanInput(input);
  let url: URL;

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

  const placeId = extractPlaceId(url);
  if (!placeId) {
    return {
      valid: false,
      reason: "missing_place_id",
      message: "올바른 네이버 플레이스 주소를 입력해주세요.",
    };
  }

  return {
    valid: true,
    placeId,
    normalizedUrl: normalizePlaceHomeUrl(placeId),
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
    try {
      const response = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(4000),
      });
      const location = response.headers.get("location");
      if (!location) break;
      const nextUrl = safeRedirectUrl(location, currentUrl);
      if (!nextUrl) break;
      currentUrl = nextUrl;
      const nextParsed = extractNaverPlaceId(currentUrl);
      if (nextParsed.valid) return nextParsed;
    } catch {
      break;
    }
  }

  return {
    valid: false,
    reason: "redirect_failed",
    message: "올바른 네이버 플레이스 주소를 입력해주세요.",
  };
}
