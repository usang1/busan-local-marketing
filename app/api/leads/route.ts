import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendLeadTelegramNotification } from "@/lib/notifications/telegram";
import { leadSchema, toLeadInsert } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "요청 형식을 확인해주세요." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "입력값을 다시 확인해주세요.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const values = parsed.data;

  if (values.companyWebsite) {
    return NextResponse.json({ ok: true, stored: false });
  }

  if (values.formStartedAt) {
    const elapsed = Date.now() - new Date(values.formStartedAt).getTime();
    if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 800) {
      return NextResponse.json(
        { message: "제출 시간이 너무 짧습니다. 내용을 확인한 뒤 다시 시도해주세요." },
        { status: 429 },
      );
    }
  }

  if (values.leadType === "free_audit" && !values.placeUrl) {
    return NextResponse.json(
      { message: "무료 진단은 네이버 플레이스 URL이 필요합니다." },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      stored: false,
      message: "Supabase 환경변수가 없어 개발용 제출 흐름으로 처리되었습니다.",
    });
  }

  const duplicateWindow = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: duplicate } = await supabase
    .from("leads")
    .select("id")
    .eq("lead_type", values.leadType)
    .eq("phone", values.phone)
    .gte("created_at", duplicateWindow)
    .limit(1)
    .maybeSingle();

  if (duplicate) {
    return NextResponse.json({ ok: true, stored: false, duplicate: true });
  }

  const { error } = await supabase.from("leads").insert(toLeadInsert(values));

  if (error) {
    return NextResponse.json(
      { message: "접수 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }

  await sendLeadTelegramNotification(values);

  return NextResponse.json({ ok: true, stored: true });
}
