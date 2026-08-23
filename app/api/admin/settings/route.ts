import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { siteSettingsSchema } from "@/lib/admin/validations";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = siteSettingsSchema.safeParse(body);

  if (!parsed.success) return NextResponse.json({ message: "입력값을 확인해주세요." }, { status: 400 });

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ message: "Supabase 환경변수가 없습니다." }, { status: 500 });

  const { error } = await supabase.from("site_settings").upsert({
    id: "default",
    brand_name: parsed.data.brandName || null,
    tagline: parsed.data.tagline || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    kakao_chat_url: parsed.data.kakaoChatUrl || null,
    service_region: parsed.data.serviceRegion || null,
    business_name: parsed.data.businessName || null,
    address: parsed.data.address || null,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ message: "설정을 저장하지 못했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
