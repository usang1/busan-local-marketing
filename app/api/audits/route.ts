import { NextResponse } from "next/server";
import { placeAuditInputSchema } from "@/lib/audit/schema";
import { runPlaceAudit } from "@/lib/audit/rules";
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

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "자동진단 저장 환경이 설정되지 않았습니다." }, { status: 503 });
  }

  const input = parsed.data;
  const result = runPlaceAudit(input);
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
    return NextResponse.json({ message: "자동진단 결과를 저장하지 못했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
