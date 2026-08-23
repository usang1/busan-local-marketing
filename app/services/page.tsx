import { FinalCta } from "@/components/sections/final-cta";
import { ServiceCard } from "@/components/sections/service-card";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { processSteps, serviceGroups } from "@/data/services";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "서비스",
  description:
    "네이버 플레이스, 로컬 SEO, 블로그, 숏폼, 샤오홍슈, 전환 최적화까지 부산·경남 로컬 마케팅 서비스를 안내합니다.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeading
            eyebrow="Services"
            title="검색 화면에서 매장 방문까지, 필요한 지점을 나눠서 개선합니다"
            description="고객이 매장을 선택하기 전 보는 것은 순위 하나가 아닙니다. 사진, 리뷰, 메뉴, 소개, 콘텐츠, 예약 동선이 함께 설득해야 합니다."
          />
          <div className="rounded-[8px] border border-line bg-white p-6">
            <p className="text-base leading-8 text-muted">
              서비스 범위는 상담 후 확정합니다. 현재 단계에서는 실제 가격, 성과 보장, 고객 수를
              임의로 제시하지 않고, 진단 결과에 따라 필요한 작업만 분리해 안내합니다.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-pale-blue/50">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceGroups.map((service) => (
            <ServiceCard key={service.slug} {...service} href={service.slug === "naver-place" ? "/services/naver-place" : "/free-audit"} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Working Process"
          title="진행 방식은 처음부터 투명해야 합니다"
          description="무엇을 하는지 모르는 광고비가 되지 않도록 분석, 실행, 확인, 개선 단계를 분리합니다."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <article key={step.step} className="rounded-[8px] border border-line bg-white p-6">
              <p className="text-sm font-extrabold text-accent">{step.step}</p>
              <h2 className="mt-3 text-xl font-bold text-ink">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/free-audit">무료 진단으로 현재 상태 확인</ButtonLink>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
