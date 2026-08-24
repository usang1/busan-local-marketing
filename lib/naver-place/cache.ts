import type { NaverPlaceData, PlaceAnalysisResult } from "@/lib/naver-place/types";

const cacheTtlMs = 60 * 60 * 1000;
const rateLimitWindowMs = 60 * 1000;
const maxRequestsPerWindow = 8;

type CachedAnalysis = {
  place: NaverPlaceData;
  analysis: PlaceAnalysisResult;
  expiresAt: number;
};

type RateBucket = {
  count: number;
  resetAt: number;
};

const analysisCache = new Map<string, CachedAnalysis>();
const rateBuckets = new Map<string, RateBucket>();

export function getCachedPlaceAnalysis(placeId: string) {
  const cached = analysisCache.get(placeId);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    analysisCache.delete(placeId);
    return null;
  }
  return cached;
}

export function setCachedPlaceAnalysis(placeId: string, place: NaverPlaceData, analysis: PlaceAnalysisResult) {
  analysisCache.set(placeId, {
    place,
    analysis,
    expiresAt: Date.now() + cacheTtlMs,
  });
}

export function checkPlaceAnalyzeRateLimit(key: string) {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= maxRequestsPerWindow) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
