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

  const { error } = await supabase
    .from("leads")
    .update({
      status: parsed.data.status,
      admin_memo: parsed.data.adminMemo || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: "저장하지 못했습니다. 다시 시도해주세요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
