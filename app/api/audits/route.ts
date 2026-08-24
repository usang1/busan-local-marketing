import { NextResponse } from "next/server";
import { placeAuditInputSchema } from "@/lib/audit/schema";
import { runPlaceAudit } from "@/lib/audit/rules";
import { encodeSelfAuditInput } from "@/lib/audit/shareable";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = placeAuditInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "입력값을 다시 확인해주세요.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const result = runPlaceAudit(input);
  const fallbackId = encodeSelfAuditInput(input);
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    console.warn("[audit] Supabase client unavailable. Using self-contained audit result.");
    return NextResponse.json({ ok: true, id: fallbackId, stored: false });
  }

  const { data, error } = await supabase
    .from("audits")
    .insert({
      business_name: input.businessName,
      industry: input.industry,
      region: input.region,
      place_url: input.placeUrl || null,
      input_data: input,
      result_data: result,
      status: "completed",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.warn("[audit] Failed to store audit result. Using self-contained audit result.");
    return NextResponse.json({ ok: true, id: fallbackId, stored: false });
  }

  return NextResponse.json({ ok: true, id: data.id, stored: true });
}
