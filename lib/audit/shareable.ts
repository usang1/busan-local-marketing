import { placeAuditInputSchema, type PlaceAuditInput } from "@/lib/audit/schema";
import type { NaverPlaceData, PlaceAnalysisResult } from "@/lib/naver-place/types";

const selfAuditPrefix = "self-";
const selfPlaceAuditPrefix = "place-self-";

export type SelfPlaceAuditSnapshot = {
  mode: "naver_place_url";
  place: NaverPlaceData;
  analysis: PlaceAnalysisResult;
};

export function encodeSelfAuditInput(input: PlaceAuditInput) {
  const payload = Buffer.from(JSON.stringify(input), "utf8").toString("base64url");
  return `${selfAuditPrefix}${payload}`;
}

export function decodeSelfAuditInput(id: string) {
  if (!id.startsWith(selfAuditPrefix)) return null;

  try {
    const json = Buffer.from(id.slice(selfAuditPrefix.length), "base64url").toString("utf8");
    const parsed = placeAuditInputSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function encodeSelfPlaceAuditSnapshot(snapshot: SelfPlaceAuditSnapshot) {
  const payload = Buffer.from(JSON.stringify(snapshot), "utf8").toString("base64url");
  return `${selfPlaceAuditPrefix}${payload}`;
}

export function decodeSelfPlaceAuditSnapshot(id: string) {
  if (!id.startsWith(selfPlaceAuditPrefix)) return null;

  try {
    const json = Buffer.from(id.slice(selfPlaceAuditPrefix.length), "base64url").toString("utf8");
    const parsed = JSON.parse(json) as SelfPlaceAuditSnapshot;
    if (parsed?.mode !== "naver_place_url" || !parsed.place || !parsed.analysis) return null;
    return parsed;
  } catch {
    return null;
  }
}
