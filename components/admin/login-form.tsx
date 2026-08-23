"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/admin/validations";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 bg-white px-3 text-base text-slate-950 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

export function LoginForm({ nextPath = "/admin" }: { nextPath?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: AdminLoginValues) {
    setError("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "로그인하지 못했습니다.");
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[8px] bg-pale-mint text-accent">
        <LockKeyhole size={22} aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-950">관리자 로그인</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">공개 회원가입은 제공하지 않습니다. Supabase Auth에 생성된 관리자만 접근할 수 있습니다.</p>

      <label className="mt-6 block text-sm font-bold text-slate-900">
        이메일
        <input className={inputClass} type="email" autoComplete="email" {...register("email")} />
        {errors.email?.message ? <p className="mt-2 text-sm text-rose-700">{errors.email.message}</p> : null}
      </label>

      <label className="mt-4 block text-sm font-bold text-slate-900">
        비밀번호
        <input className={inputClass} type="password" autoComplete="current-password" {...register("password")} />
        {errors.password?.message ? <p className="mt-2 text-sm text-rose-700">{errors.password.message}</p> : null}
      </label>

      {error ? <div className="mt-5 rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</div> : null}

      <Button className="mt-6 w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
        로그인
      </Button>
    </form>
  );
}
