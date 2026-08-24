import { analyzePlace } from "@/lib/naver-place/analyzer";
import { checkPlaceAnalyzeRateLimit, getCachedPlaceAnalysis, setCachedPlaceAnalysis } from "@/lib/naver-place/cache";
import { createNaverPlaceProvider } from "@/lib/naver-place/provider";
import { resolveNaverPlaceUrl } from "@/lib/naver-place/parse-url";
import type { NaverPlaceData, PlaceAnalysisResult, PlaceAnalyzeResponse } from "@/lib/naver-place/types";
import { encodeSelfPlaceAuditSnapshot } from "@/lib/audit/shareable";
import { getSupabaseServerClient } from "@/lib/supabase";

type CreateAuditOptions = {
  clientIp?: string;
};

function regionFromPlace(place: NaverPlaceData) {
  const address = place.roadAddress || place.address;
  if (!address) return "확인 불가";
  return address.split(/\s+/).slice(0, 2).join(" ") || "확인 불가";
}

function auditRow(place: NaverPlaceData, analysis: PlaceAnalysisResult) {
  return {
    business_name: place.name || `네이버 플레이스 ${place.placeId}`,
    industry: place.category || "확인 불가",
    region: regionFromPlace(place),
    place_url: place.normalizedUrl,
    input_data: {
      mode: "naver_place_url",
      placeUrl: place.sourceUrl,
      normalizedUrl: place.normalizedUrl,
      placeId: place.placeId,
    },
    result_data: analysis,
    status: "completed",
  };
}

async function saveAudit(place: NaverPlaceData, analysis: PlaceAnalysisResult) {
  const supabase = await getSupabaseServerClient();
  const fallbackId = encodeSelfPlaceAuditSnapshot({ mode: "naver_place_url", place, analysis });

  if (!supabase) {
    console.warn("[place-audit] Supabase client unavailable. Using self-contained result.");
    return { id: fallbackId, stored: false };
  }

  const baseRow = auditRow(place, analysis);
  const extendedRow = {
    ...baseRow,
    place_id: place.placeId,
    place_name: place.name,
    raw_place_data: place,
    analysis_result: analysis,
    score: analysis.score,
    fetched_at: place.fetchedAt,
  };

  const { data, error } = await supabase.from("audits").insert(extendedRow).select("id").single();
  if (!error && data?.id) return { id: data.id as string, stored: true };

  const legacyResult = await supabase.from("audits").insert(baseRow).select("id").single();
  if (!legacyResult.error && legacyResult.data?.id) {
    console.warn("[place-audit] Extended audit columns unavailable. Saved audit with legacy columns.");
    return { id: legacyResult.data.id as string, stored: true };
  }

  console.warn("[place-audit] Failed to save audit. Using self-contained result.");
  return { id: fallbackId, stored: false };
}

export function getClientIpFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

export async function createPlaceAuditFromUrl(placeUrl: string, options: CreateAuditOptions = {}): Promise<PlaceAnalyzeResponse> {
  const parsed = await resolveNaverPlaceUrl(placeUrl);
  if (!parsed.valid) {
    return {
      success: false,
      code: "INVALID_PLACE_URL",
      message: parsed.message,
    };
  }

  const rateKey = `${options.clientIp || "unknown"}:${parsed.placeId}`;
  const rateLimit = checkPlaceAnalyzeRateLimit(rateKey);
  if (!rateLimit.allowed && !getCachedPlaceAnalysis(parsed.placeId)) {
    return {
      success: false,
      code: "RATE_LIMITED",
      message: "요청이 잠시 많습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  const cached = getCachedPlaceAnalysis(parsed.placeId);
  let place: NaverPlaceData;
  let analysis: PlaceAnalysisResult;
  let usedCache = Boolean(cached);

  if (cached) {
    place = cached.place;
    analysis = cached.analysis;
  } else {
    const provider = createNaverPlaceProvider();
    const result = await provider.getPlace({
      placeId: parsed.placeId,
      sourceUrl: parsed.inputUrl,
      normalizedUrl: parsed.normalizedUrl,
    });

    if (!result.success) {
      return {
        success: false,
        code: result.code,
        message: result.message,
      };
    }

    place = result.place;
    analysis = analyzePlace(place);
    if (analysis.maxScore > 0) {
      setCachedPlaceAnalysis(parsed.placeId, place, analysis);
    }
    usedCache = false;
  }

  const saved = await saveAudit(place, analysis);
  return {
    success: true,
    id: saved.id,
    stored: saved.stored,
    cached: usedCache,
    place,
    analysis,
  };
}
