import { FinalCta } from "@/components/sections/final-cta";
import { PricingCard } from "@/components/sections/pricing-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageEvent } from "@/components/analytics/page-event";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { createPublicMetadata } from "@/lib/seo";
import { getPublicProducts } from "@/lib/public/content";

export function generateMetadata() {
  return createPublicMetadata({
    title: "가격 및 상품",
    description:
      "부산·경남 로컬 마케팅은 업체별 업종, 지역, 경쟁 상황, 진행 범위에 따라 견적이 달라집니다. 카카오톡 문의 상담으로 현재 상황을 남겨주세요.",
    path: "/pricing",
  });
}

export default async function PricingPage() {
  const [{ site }, products] = await Promise.all([getPublicSiteProfile(), getPublicProducts()]);

  return (
    <>
      <PageEvent eventName={ANALYTICS_EVENTS.VIEW_PRICING} />
      <Section className="pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="Pricing"
          title="업체 상황에 따라 견적이 달라집니다"
          description="업종, 지역, 경쟁 강도, 필요한 채널 범위가 모두 다르기 때문에 정해진 단일 가격표보다 현재 상황 확인이 먼저 필요합니다. 카카오톡 문의 상담으로 업체명과 고민을 남겨주시면 가능한 범위와 견적 방향을 안내합니다."
        />
        {products.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
          {products.map((plan) => (
            <PricingCard key={plan.name} plan={plan} kakaoChatUrl={site.kakaoChatUrl} />
          ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-line bg-white p-8 text-muted">
            공개된 상품이 없습니다. 상품이 준비되면 이 영역에 표시됩니다.
          </div>
        )}
        <div className="mt-8 rounded-[8px] border border-line bg-white p-5 text-sm leading-7 text-muted">
          세부 견적은 상담 후 안내합니다. 카카오톡 문의 상담에 업체명, 업종, 지역, 원하는 서비스를 남겨주시면 확인 후 진행 가능 범위와 견적을 안내합니다.
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
