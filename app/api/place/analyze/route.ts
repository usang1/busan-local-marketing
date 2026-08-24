import { NextRequest, NextResponse } from "next/server";
import { createPlaceAuditFromUrl, getClientIpFromHeaders } from "@/lib/naver-place/service";

export const runtime = "nodejs";

function responseStatus(code: string) {
  if (code === "INVALID_PLACE_URL") return 400;
  if (code === "PLACE_NOT_FOUND") return 404;
  if (code === "RATE_LIMITED") return 429;
  return 502;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { placeUrl?: unknown } | null;
  const placeUrl = typeof body?.placeUrl === "string" ? body.placeUrl : "";

  const result = await createPlaceAuditFromUrl(placeUrl, {
    clientIp: getClientIpFromHeaders(request.headers),
  });

  if (!result.success) {
    return NextResponse.json(result, { status: responseStatus(result.code) });
  }

  return NextResponse.json(result);
}
