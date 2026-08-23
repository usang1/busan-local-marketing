import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseServerClient } from "@/lib/supabase";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 3 * 1024 * 1024;

export async function POST(request: Request) {
  await requireAdmin();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "이미지 파일을 선택해주세요." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ message: "jpg, png, webp, gif 이미지만 업로드할 수 있습니다." }, { status: 400 });
  }

  if (file.size > maxBytes) {
    return NextResponse.json({ message: "이미지는 3MB 이하만 업로드할 수 있습니다." }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ message: "Supabase 환경변수가 없습니다." }, { status: 500 });

  const extension = file.name.split(".").pop()?.toLowerCase() || "image";
  const path = `portfolio/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("portfolio-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ message: "이미지를 업로드하지 못했습니다." }, { status: 500 });

  const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl, path });
}
