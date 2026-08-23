import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { orderStatusLabels } from "@/lib/admin/constants";
import { formatPrice } from "@/lib/admin/format";
import { confirmOrderPayment } from "@/lib/payment/orders";

export const metadata: Metadata = {
  title: "결제 완료",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;
  const paymentKey = params.paymentKey;
  const amount = Number(params.amount);
  const result =
    orderId && paymentKey && Number.isFinite(amount)
      ? await confirmOrderPayment({ orderId, paymentKey, amount })
      : { ok: false, message: "결제 검증 정보가 없습니다.", order: null };

  return (
    <Section className="pt-12 sm:pt-16">
      <div className="mx-auto max-w-2xl rounded-[8px] border border-line bg-white p-6 text-center sm:p-8">
        {result.ok && result.order ? (
          <>
            <CheckCircle2 className="mx-auto text-accent" size={42} aria-hidden="true" />
            <h1 className="mt-4 text-3xl font-extrabold text-ink">결제가 완료되었습니다.</h1>
            <p className="mt-3 text-base leading-8 text-muted">담당자가 신청 내용을 확인한 뒤 서비스 진행을 안내드립니다.</p>
            <dl className="mt-6 grid gap-3 rounded-[8px] bg-ivory p-5 text-left text-sm">
              <div className="flex justify-between gap-4"><dt className="font-bold text-muted">주문번호</dt><dd className="font-bold text-ink">{result.order.order_id}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-muted">상품</dt><dd className="font-bold text-ink">{result.order.products?.name || "-"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-muted">결제금액</dt><dd className="font-bold text-ink">{formatPrice(result.order.amount, "")}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-muted">상태</dt><dd className="font-bold text-ink">{orderStatusLabels[result.order.status]}</dd></div>
            </dl>
            <script
              type="application/json"
              data-purchase-event
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  order_id: result.order.order_id,
                  value: result.order.amount,
                  currency: "KRW",
                  product_name: result.order.products?.name,
                }),
              }}
            />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-ink">결제를 확인하지 못했습니다.</h1>
            <p className="mt-3 text-base leading-8 text-muted">{result.message || "주문 검증에 실패했습니다."}</p>
            <div className="mt-6 flex justify-center gap-3">
              <ButtonLink href="/pricing">상품으로 돌아가기</ButtonLink>
              <Link href="/contact" className="inline-flex min-h-11 items-center rounded-[8px] border border-line px-4 text-sm font-bold" data-analytics-event={ANALYTICS_EVENTS.CLICK_CONTACT} data-analytics-location="checkout_success_error">상담 문의</Link>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
