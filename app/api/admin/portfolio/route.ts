import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { linesToArray, portfolioSchema } from "@/lib/admin/validations";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = portfolioSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해주세요." }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ message: "Supabase 환경변수가 없습니다." }, { status: 500 });

  const { data: duplicate } = await supabase
    .from("portfolios")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (duplicate) {
    return NextResponse.json({ message: "이미 사용 중인 Slug입니다." }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      client_name: parsed.data.clientName,
      industry: parsed.data.industry,
      location: parsed.data.location,
      summary: parsed.data.summary,
      challenge: parsed.data.challenge,
      strategy: linesToArray(parsed.data.strategy),
      execution: linesToArray(parsed.data.execution),
      result: parsed.data.result,
      thumbnail_url: parsed.data.thumbnailUrl || null,
      published: parsed.data.published,
      featured: parsed.data.featured,
      sort_order: parsed.data.sortOrder,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ message: "포트폴리오를 저장하지 못했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
