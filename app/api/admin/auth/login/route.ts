import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from "@/lib/admin/auth";
import { adminLoginSchema } from "@/lib/admin/validations";
import { getSupabaseAuthClient, getSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "이메일과 비밀번호를 확인해주세요." }, { status: 400 });
  }

  const authClient = await getSupabaseAuthClient();
  const serviceClient = await getSupabaseServerClient();

  if (!authClient || !serviceClient) {
    return NextResponse.json({ message: "Supabase 인증 환경변수가 설정되지 않았습니다." }, { status: 500 });
  }

  const { data, error } = await authClient.auth.signInWithPassword(parsed.data);

  if (error || !data.session || !data.user) {
    return NextResponse.json({ message: "로그인 정보가 올바르지 않습니다." }, { status: 401 });
  }

  const { data: adminUser, error: roleError } = await serviceClient
    .from("admin_users")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (roleError || !adminUser || adminUser.role !== "admin") {
    return NextResponse.json({ message: "관리자 권한이 없습니다." }, { status: 403 });
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(ADMIN_ACCESS_COOKIE, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: data.session.expires_in,
  });
  cookieStore.set(ADMIN_REFRESH_COOKIE, data.session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true });
}
