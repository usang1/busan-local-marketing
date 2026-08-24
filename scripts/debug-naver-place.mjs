#!/usr/bin/env node
const placeId = process.argv.find((arg) => /^\d{5,}$/.test(arg)) || "1191127627";
const initialUrl = `https://pcmap.place.naver.com/place/${placeId}`;
const headers = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8",
  referer: "https://map.naver.com/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
};

function stripTags(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMinimalPlace(html) {
  const title = stripTags(html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1])
    .replace(/ : 네이버(?: 지도| 플레이스)?$/, "");

  return {
    name: title || null,
    category: stripTags(html.match(/"category"\s*:\s*"([^"]+)"/)?.[1]) || null,
    address: stripTags(html.match(/도로명(?:주소)?["':\s]*([^"<>{}[\]]{4,80})/)?.[1]) || null,
    visitorReviews: html.match(/방문자\s*리뷰\s*([0-9,]+)/)?.[1] || null,
    blogReviews: html.match(/블로그\s*리뷰\s*([0-9,]+)/)?.[1] || null,
  };
}

function headerSummary() {
  return {
    "User-Agent": Boolean(headers["user-agent"]),
    Accept: Boolean(headers.accept),
    "Accept-Language": Boolean(headers["accept-language"]),
    Referer: Boolean(headers.referer),
    Cookie: false,
  };
}

async function runFetch() {
  let currentUrl = initialUrl;
  let redirectCount = 0;
  let requestCount = 0;

  for (let depth = 0; depth < 4; depth += 1) {
    requestCount += 1;
    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers,
    });

    const location = response.headers.get("location");
    if ([301, 302, 303, 307, 308].includes(response.status) && location) {
      currentUrl = new URL(location, currentUrl).toString();
      redirectCount += 1;
      continue;
    }

    const html = response.status === 429 ? "" : await response.text().catch(() => "");
    return {
      transport: "fetch",
      placeId,
      requestUrl: initialUrl,
      finalUrl: currentUrl,
      method: "GET",
      redirect: "manual",
      redirectCount,
      requestCount,
      requestHeaders: headerSummary(),
      status: response.status,
      retryAfter: response.headers.get("retry-after"),
      contentType: response.headers.get("content-type"),
      contentLength: html.length,
      parsed: parseMinimalPlace(html),
    };
  }

  return {
    transport: "fetch",
    placeId,
    requestUrl: initialUrl,
    finalUrl: currentUrl,
    method: "GET",
    redirect: "manual",
    redirectCount,
    requestCount,
    requestHeaders: headerSummary(),
    status: 0,
    retryAfter: null,
    contentType: null,
    contentLength: 0,
    parsed: parseMinimalPlace(""),
  };
}

try {
  const result = await runFetch();
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.log(
    JSON.stringify(
      {
        transport: "fetch",
        placeId,
        requestUrl: initialUrl,
        method: "GET",
        redirect: "manual",
        requestHeaders: headerSummary(),
        error: error?.message || String(error),
        cause: error?.cause?.message || null,
      },
      null,
      2,
    ),
  );
}
