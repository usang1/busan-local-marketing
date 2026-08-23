import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Section, SectionHeading } from "@/components/ui/section";
import { getPublicProductBySlug } from "@/lib/admin/db";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { formatPrice } from "@/lib/admin/format";
import { isDirectPaymentAvailable } from "@/lib/payment/provider";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const slug = params.product;
  if (!slug) notFound();

  const product = await getPublicProductBySlug(slug);
  if (!product) notFound();

  const canPay = product.purchase_type === "direct" && product.price !== null && isDirectPaymentAvailable();

  return (
    <Section className="pt-12 sm:pt-16">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <SectionHeading
            eyebrow="Checkout"
            title={canPay ? "상품 신청 및 결제" : "상담 후 진행되는 상품입니다"}
            description="결제 금액은 서버에서 상품 정보를 다시 조회해 검증합니다. URL이나 브라우저에서 전달된 가격은 사용하지 않습니다."
          />
          <div className="rounded-[8px] border border-line bg-white p-5">
            <p className="text-sm font-bold text-accent">{product.name}</p>
            <p className="mt-3 text-3xl font-extrabold text-ink">{formatPrice(product.price, product.price_label)}</p>
            <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>
            <ul className="mt-5 grid gap-2 text-sm text-ink">
              {(product.features || []).map((feature) => <li key={feature}>· {feature}</li>)}
            </ul>
          </div>
          {!canPay ? (
            <div className="mt-5 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              이 상품은 온라인 즉시 결제가 아니라 상담 후 범위를 확정하거나, 운영 결제 설정이 완료된 뒤 결제할 수 있습니다. <Link className="font-bold underline" href="/free-audit" data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="checkout_consultation_required">무료 진단</Link> 또는 <Link className="font-bold underline" href="/contact" data-analytics-event={ANALYTICS_EVENTS.CLICK_CONTACT} data-analytics-location="checkout_consultation_required">상담 문의</Link>를 이용해주세요.
            </div>
          ) : null}
        </div>
        {canPay ? <CheckoutForm productSlug={product.slug} productName={product.name} amount={product.price || 0} /> : null}
      </div>
    </Section>
  );
}
