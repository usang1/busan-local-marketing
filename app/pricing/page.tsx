import { FinalCta } from "@/components/sections/final-cta";
import { PricingCard } from "@/components/sections/pricing-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageEvent } from "@/components/analytics/page-event";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { createMetadata } from "@/lib/seo";
import { getPublicProducts } from "@/lib/public/content";

export const metadata = createMetadata({
  title: "가격 및 상품",
  description:
    "부산·경남 로컬 마케팅 상품 구조와 결제 가능 여부를 확인하세요. 맞춤형 상품은 무료 진단 또는 상담 후 안내합니다.",
  path: "/pricing",
});

export default async function PricingPage() {
  const products = await getPublicProducts();

  return (
    <>
      <PageEvent eventName={ANALYTICS_EVENTS.VIEW_PRICING} />
      <Section className="pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="Pricing"
          title="가격은 아직 확정하지 않았습니다"
          description="업종, 지역, 경쟁 강도, 필요한 채널 범위가 다르기 때문에 현재 단계에서는 임의 가격을 만들지 않습니다. 상품 구조만 먼저 확인할 수 있습니다."
        />
        {products.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
          {products.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-line bg-white p-8 text-muted">
            공개된 상품이 없습니다. 상품이 준비되면 이 영역에 표시됩니다.
          </div>
        )}
        <div className="mt-8 rounded-[8px] border border-line bg-white p-5 text-sm leading-7 text-muted">
          바로 결제가 가능한 상품은 결제 화면으로 이동합니다. 상담이 필요한 상품은 서비스 범위와 업종 상황을 먼저 확인한 뒤 진행합니다.
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
