import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAuthClient, getSupabaseServerClient } from "@/lib/supabase";
import type { AdminRole } from "@/types/database";

export const ADMIN_ACCESS_COOKIE = "admin-access-token";
export const ADMIN_REFRESH_COOKIE = "admin-refresh-token";

export type AdminSession = {
  userId: string;
  email: string | null;
  role: AdminRole;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const authClient = await getSupabaseAuthClient();
  const serviceClient = await getSupabaseServerClient();

  if (!authClient || !serviceClient) {
    return null;
  }

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser(accessToken);

  if (userError || !user) {
    return null;
  }

  const { data, error } = await serviceClient
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data || data.role !== "admin") {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    role: data.role,
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
