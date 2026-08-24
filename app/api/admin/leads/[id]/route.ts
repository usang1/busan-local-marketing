import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { leadUpdateSchema } from "@/lib/admin/validations";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = leadUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해주세요." }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 없습니다." }, { status: 500 });
  }

  const { data: current, error: readError } = await supabase
    .from("leads")
    .select("status, contacted_at, consulted_at, proposed_at, contracted_at")
    .eq("id", id)
    .maybeSingle();

  if (readError || !current) {
    return NextResponse.json({ message: "Lead 정보를 찾지 못했습니다." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const update: Record<string, string | boolean | null> = {
    status: parsed.data.status,
    admin_memo: parsed.data.adminMemo || null,
    is_test: parsed.data.isTest,
    updated_at: now,
  };

  if (parsed.data.status === "contacted" && !current.contacted_at) update.contacted_at = now;
  if (parsed.data.status === "consulting" && !current.consulted_at) update.consulted_at = now;
  if (parsed.data.status === "proposal" && !current.proposed_at) update.proposed_at = now;
  if (parsed.data.status === "contracted" && !current.contracted_at) update.contracted_at = now;

  const { error } = await supabase
    .from("leads")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: "저장하지 못했습니다. 다시 시도해주세요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
