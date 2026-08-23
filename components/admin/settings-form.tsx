"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, type SiteSettingsValues } from "@/lib/admin/validations";
import type { SiteSettings } from "@/types/database";
import { Button } from "@/components/ui/button";

const inputClass = "mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 px-3 text-base";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      brandName: settings?.brand_name || "",
      tagline: settings?.tagline || "",
      phone: settings?.phone || "",
      email: settings?.email || "",
      kakaoChatUrl: settings?.kakao_chat_url || "",
      serviceRegion: settings?.service_region || "",
      businessName: settings?.business_name || "",
      address: settings?.address || "",
    },
  });

  async function onSubmit(values: SiteSettingsValues) {
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    if (!response.ok) {
      setError(body?.message || "설정을 저장하지 못했습니다.");
      return;
    }
    setMessage("저장되었습니다.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-3xl gap-5 rounded-[8px] border border-slate-200 bg-white p-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">브랜드명<input className={inputClass} {...register("brandName")} /></label>
        <label className="text-sm font-bold text-slate-700">서비스 지역<input className={inputClass} {...register("serviceRegion")} /></label>
        <label className="text-sm font-bold text-slate-700">사업자명<input className={inputClass} {...register("businessName")} /></label>
        <label className="text-sm font-bold text-slate-700">사업장 주소<input className={inputClass} {...register("address")} /></label>
        <label className="text-sm font-bold text-slate-700 md:col-span-2">Tagline<input className={inputClass} {...register("tagline")} /></label>
        <label className="text-sm font-bold text-slate-700">대표 전화번호<input className={inputClass} {...register("phone")} /></label>
        <label className="text-sm font-bold text-slate-700">대표 이메일<input className={inputClass} {...register("email")} />{errors.email?.message ? <p className="mt-1 text-rose-700">{errors.email.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700 md:col-span-2">카카오톡 URL<input className={inputClass} {...register("kakaoChatUrl")} />{errors.kakaoChatUrl?.message ? <p className="mt-1 text-rose-700">{errors.kakaoChatUrl.message}</p> : null}</label>
      </div>
      <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Supabase Secret, Service Role Key, 결제 Secret Key는 이 화면에 저장하지 않습니다. 민감한 값은 환경변수로만 관리하세요.
      </div>
      {message ? <p className="text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}설정 저장</Button>
    </form>
  );
}
