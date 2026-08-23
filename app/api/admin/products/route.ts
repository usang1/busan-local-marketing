import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { linesToArray, productSchema } from "@/lib/admin/validations";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) return NextResponse.json({ message: "입력값을 확인해주세요." }, { status: 400 });

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ message: "Supabase 환경변수가 없습니다." }, { status: 500 });

  const { data: duplicate } = await supabase
    .from("products")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (duplicate) return NextResponse.json({ message: "이미 사용 중인 Slug입니다." }, { status: 409 });

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      price_label: parsed.data.priceLabel,
      features: linesToArray(parsed.data.features),
      recommended: parsed.data.recommended,
      published: parsed.data.published,
      sort_order: parsed.data.sortOrder,
      purchase_type: parsed.data.purchaseType,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ message: "상품을 저장하지 못했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
