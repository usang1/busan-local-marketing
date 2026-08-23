"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductValues } from "@/lib/admin/validations";
import type { Product } from "@/types/database";
import { Button } from "@/components/ui/button";

const inputClass = "mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 px-3 text-base";
const textareaClass = "mt-2 min-h-32 w-full rounded-[8px] border border-slate-200 px-3 py-3 text-base leading-7";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price ?? "",
      priceLabel: product?.price_label || "상담 후 안내",
      features: product?.features?.join("\n") || "",
      recommended: product?.recommended || false,
      published: product?.published || false,
      sortOrder: product?.sort_order || 0,
      purchaseType: product?.purchase_type || "consultation_required",
    },
  });

  async function onSubmit(values: ProductValues) {
    setMessage("");
    setError("");
    const response = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!response.ok) {
      setError(body?.message || "저장하지 못했습니다.");
      return;
    }
    setMessage("저장되었습니다.");
    router.push(product ? "/admin/products" : `/admin/products/${body?.id}/edit`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-[8px] border border-slate-200 bg-white p-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">상품명<input className={inputClass} {...register("name")} />{errors.name?.message ? <p className="mt-1 text-rose-700">{errors.name.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">Slug<input className={inputClass} {...register("slug")} />{errors.slug?.message ? <p className="mt-1 text-rose-700">{errors.slug.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">가격 숫자<input className={inputClass} type="number" placeholder="비워두면 상담 후 안내" {...register("price")} />{errors.price?.message ? <p className="mt-1 text-rose-700">{errors.price.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">가격 라벨<input className={inputClass} {...register("priceLabel")} />{errors.priceLabel?.message ? <p className="mt-1 text-rose-700">{errors.priceLabel.message}</p> : null}</label>
        <label className="text-sm font-bold text-slate-700">노출 순서<input className={inputClass} type="number" {...register("sortOrder")} /></label>
        <label className="text-sm font-bold text-slate-700">구매 방식<select className={inputClass} {...register("purchaseType")}><option value="consultation_required">상담 필요</option><option value="direct">직접 결제 예정</option></select></label>
      </div>
      <label className="text-sm font-bold text-slate-700">설명<textarea className={textareaClass} {...register("description")} />{errors.description?.message ? <p className="mt-1 text-rose-700">{errors.description.message}</p> : null}</label>
      <label className="text-sm font-bold text-slate-700">포함 항목<textarea className={textareaClass} placeholder="줄바꿈으로 항목을 구분합니다." {...register("features")} />{errors.features?.message ? <p className="mt-1 text-rose-700">{errors.features.message}</p> : null}</label>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" {...register("published")} /> 공개</label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" {...register("recommended")} /> 추천 상품</label>
      </div>
      {message ? <p className="text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}저장</Button>
    </form>
  );
}
