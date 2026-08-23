"use client";

import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portfolioSchema, type PortfolioValues } from "@/lib/admin/validations";
import type { Portfolio } from "@/types/database";
import { Button } from "@/components/ui/button";

const inputClass = "mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 px-3 text-base";
const textareaClass = "mt-2 min-h-32 w-full rounded-[8px] border border-slate-200 px-3 py-3 text-base leading-7";

export function PortfolioForm({ portfolio }: { portfolio?: Portfolio }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: portfolio?.title || "",
      slug: portfolio?.slug || "",
      clientName: portfolio?.client_name || "",
      industry: portfolio?.industry || "",
      location: portfolio?.location || "",
      summary: portfolio?.summary || "",
      challenge: portfolio?.challenge || "",
      strategy: portfolio?.strategy?.join("\n") || "",
      execution: portfolio?.execution?.join("\n") || "",
      result: portfolio?.result || "",
      thumbnailUrl: portfolio?.thumbnail_url || "",
      published: portfolio?.published || false,
      featured: portfolio?.featured || false,
      sortOrder: portfolio?.sort_order || 0,
    },
  });

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);
    const body = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;
    if (!response.ok || !body?.url) {
      setError(body?.message || "이미지를 업로드하지 못했습니다.");
      return;
    }
    setValue("thumbnailUrl", body.url, { shouldValidate: true });
    setMessage("이미지가 업로드되었습니다.");
  }

  async function onSubmit(values: PortfolioValues) {
    setMessage("");
    setError("");
    const response = await fetch(portfolio ? `/api/admin/portfolio/${portfolio.id}` : "/api/admin/portfolio", {
      method: portfolio ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const body = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!response.ok) {
      setError(body?.message || "저장하지 못했습니다.");
      return;
    }

    setMessage("저장되었습니다.");
    router.push(portfolio ? "/admin/portfolio" : `/admin/portfolio/${body?.id}/edit`);
    router.refresh();
  }

  return (
    <form className="grid gap-5 rounded-[8px] border border-slate-200 bg-white p-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">제목<input className={inputClass} {...register("title")} />{errors.title?.message ? <p className="mt-1 text-rose-700">{errors.title.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">Slug<input className={inputClass} {...register("slug")} />{errors.slug?.message ? <p className="mt-1 text-rose-700">{errors.slug.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">고객명<input className={inputClass} {...register("clientName")} />{errors.clientName?.message ? <p className="mt-1 text-rose-700">{errors.clientName.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">업종<input className={inputClass} {...register("industry")} />{errors.industry?.message ? <p className="mt-1 text-rose-700">{errors.industry.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">지역<input className={inputClass} {...register("location")} />{errors.location?.message ? <p className="mt-1 text-rose-700">{errors.location.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">노출 순서<input className={inputClass} type="number" {...register("sortOrder")} /></label>
      </div>
      <label className="text-sm font-bold text-slate-700">요약<textarea className={textareaClass} {...register("summary")} />{errors.summary?.message ? <p className="mt-1 text-rose-700">{errors.summary.message}</p> : null}</label>
      <label className="text-sm font-bold text-slate-700">문제<textarea className={textareaClass} {...register("challenge")} />{errors.challenge?.message ? <p className="mt-1 text-rose-700">{errors.challenge.message}</p> : null}</label>
      <label className="text-sm font-bold text-slate-700">전략<textarea className={textareaClass} placeholder="줄바꿈으로 항목을 구분합니다." {...register("strategy")} />{errors.strategy?.message ? <p className="mt-1 text-rose-700">{errors.strategy.message}</p> : null}</label>
      <label className="text-sm font-bold text-slate-700">실행<textarea className={textareaClass} placeholder="줄바꿈으로 항목을 구분합니다." {...register("execution")} />{errors.execution?.message ? <p className="mt-1 text-rose-700">{errors.execution.message}</p> : null}</label>
      <label className="text-sm font-bold text-slate-700">결과<textarea className={textareaClass} {...register("result")} />{errors.result?.message ? <p className="mt-1 text-rose-700">{errors.result.message}</p> : null}</label>
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <label className="text-sm font-bold text-slate-700">대표 이미지 URL<input className={inputClass} {...register("thumbnailUrl")} />{errors.thumbnailUrl?.message ? <p className="mt-1 text-rose-700">{errors.thumbnailUrl.message}</p> : null}</label>
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-4 text-sm font-bold">
          {uploading ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Upload size={17} aria-hidden="true" />}
          이미지 업로드
          <input className="hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => upload(event.target.files?.[0])} />
        </label>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" {...register("published")} /> 공개</label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" {...register("featured")} /> 메인 노출</label>
      </div>
      {message ? <p className="text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting || uploading}>{isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}저장</Button>
    </form>
  );
}
