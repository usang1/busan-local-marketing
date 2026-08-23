"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { checkoutSchema, type CheckoutValues } from "@/lib/admin/validations";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import { getStoredAttribution } from "@/lib/analytics/utm";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      payment: (params: { customerKey: string }) => {
        requestPayment: (params: Record<string, unknown>) => Promise<void>;
      };
    };
  }
}

const inputClass = "mt-2 min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-base text-ink";

type OrderResponse = {
  orderId: string;
  orderName: string;
  amount: number;
  customerKey: string;
  successUrl: string;
  failUrl: string;
  provider: string;
  tossClientKey: string;
  message?: string;
};

export function CheckoutForm({
  productSlug,
  productName,
  amount,
}: {
  productSlug: string;
  productName: string;
  amount: number;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const attribution = useMemo(() => getStoredAttribution(), []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      productSlug,
      businessName: "",
      customerName: "",
      phone: "",
      email: "",
      requestNote: "",
      privacyConsent: false,
      termsConsent: false,
      ...attribution,
    },
  });

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.BEGIN_CHECKOUT, {
      product_id: productSlug,
      product_name: productName,
      value: amount,
      currency: "KRW",
    });
  }, [amount, productName, productSlug]);

  async function loadTossScript() {
    if (window.TossPayments) return;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/standard";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Toss Payments SDK를 불러오지 못했습니다."));
      document.head.appendChild(script);
    });
  }

  async function onSubmit(values: CheckoutValues) {
    setError("");
    setLoading(true);

    const response = await fetch("/api/checkout/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, ...attribution, productSlug }),
    });
    const body = (await response.json().catch(() => null)) as OrderResponse | null;

    if (!response.ok || !body) {
      setLoading(false);
      setError(body?.message || "주문을 생성하지 못했습니다.");
      return;
    }

    if (body.provider !== "mock" && body.tossClientKey) {
      try {
        await loadTossScript();
        const tossPayments = window.TossPayments?.(body.tossClientKey);
        const payment = tossPayments?.payment({ customerKey: body.customerKey });
        await payment?.requestPayment({
          method: "CARD",
          amount: { currency: "KRW", value: body.amount },
          orderId: body.orderId,
          orderName: body.orderName,
          successUrl: body.successUrl,
          failUrl: body.failUrl,
        });
        return;
      } catch {
        setLoading(false);
        setError("결제창을 열지 못했습니다. 다시 시도해주세요.");
        trackEvent(ANALYTICS_EVENTS.PAYMENT_FAILED, { product_id: productSlug, product_name: productName });
        return;
      }
    }

    window.location.assign(`/checkout/success?orderId=${encodeURIComponent(body.orderId)}&paymentKey=${encodeURIComponent(`mock_${body.orderId}`)}&amount=${body.amount}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[8px] border border-line bg-white p-5 sm:p-7" noValidate>
      <input type="hidden" {...register("productSlug")} />
      <input type="hidden" {...register("utmSource")} />
      <input type="hidden" {...register("utmMedium")} />
      <input type="hidden" {...register("utmCampaign")} />
      <input type="hidden" {...register("utmContent")} />
      <input type="hidden" {...register("utmTerm")} />
      <input type="hidden" {...register("landingPage")} />
      <input type="hidden" {...register("referrer")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-ink">업체명<input className={inputClass} autoComplete="organization" {...register("businessName")} />{errors.businessName?.message ? <p className="mt-2 text-sm text-rose-700">{errors.businessName.message}</p> : null}</label>
        <label className="text-sm font-bold text-ink">담당자명<input className={inputClass} autoComplete="name" {...register("customerName")} />{errors.customerName?.message ? <p className="mt-2 text-sm text-rose-700">{errors.customerName.message}</p> : null}</label>
        <label className="text-sm font-bold text-ink">연락처<input className={inputClass} inputMode="tel" autoComplete="tel" {...register("phone")} />{errors.phone?.message ? <p className="mt-2 text-sm text-rose-700">{errors.phone.message}</p> : null}</label>
        <label className="text-sm font-bold text-ink">이메일<input className={inputClass} type="email" autoComplete="email" {...register("email")} />{errors.email?.message ? <p className="mt-2 text-sm text-rose-700">{errors.email.message}</p> : null}</label>
      </div>
      <label className="mt-5 block text-sm font-bold text-ink">요청사항<textarea className="mt-2 min-h-28 w-full rounded-[8px] border border-line px-3 py-3 text-base leading-7" {...register("requestNote")} /></label>
      <div className="mt-5 grid gap-3 rounded-[8px] bg-ivory p-4 text-sm leading-6 text-muted">
        <p className="flex gap-2 font-semibold text-ink"><ShieldCheck size={18} aria-hidden="true" /> 카드번호, CVC 등 결제 민감정보는 이 사이트에 저장하지 않습니다.</p>
        <label className="flex gap-2"><input type="checkbox" className="mt-1" {...register("privacyConsent")} /> <span><Link href="/privacy" className="font-bold text-accent underline underline-offset-4">개인정보처리방침</Link>을 확인했고 개인정보 수집 및 결제 진행에 동의합니다.</span></label>
        <label className="flex gap-2"><input type="checkbox" className="mt-1" {...register("termsConsent")} /> <span><Link href="/terms" className="font-bold text-accent underline underline-offset-4">이용약관과 환불 정책</Link>을 확인했습니다.</span></label>
      </div>
      {errors.privacyConsent?.message ? <p className="mt-2 text-sm text-rose-700">{errors.privacyConsent.message}</p> : null}
      {errors.termsConsent?.message ? <p className="mt-2 text-sm text-rose-700">{errors.termsConsent.message}</p> : null}
      {error ? <p className="mt-4 rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800">{error}</p> : null}
      <Button type="submit" className="mt-6 w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
        신청 및 결제
      </Button>
    </form>
  );
}
