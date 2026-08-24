import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FinalCta } from "@/components/sections/final-cta";
import { ServiceCard } from "@/components/sections/service-card";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { marketingIndustryPages } from "@/data/marketing-industries";
import { getServicesByCategory, processSteps, serviceCategoryDescriptions, serviceCategoryOrder } from "@/data/services";
import { createPublicMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createPublicMetadata({
    title: "서비스",
    description:
      "네이버 플레이스, 로컬 SEO, 블로그, 숏폼, 샤오홍슈, 전환 최적화까지 부산·경남 로컬 마케팅 서비스를 안내합니다.",
    path: "/services",
  });
}

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
        <div className="grid gap-12">
          {serviceCategoryOrder.map((category) => {
            const categoryServices = getServicesByCategory(category);

            return (
              <div key={category}>
                <div className="mb-5 max-w-3xl">
                  <p className="text-sm font-extrabold text-accent">{category}</p>
                  <p className="mt-2 text-base leading-8 text-muted">{serviceCategoryDescriptions[category]}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.slug}
                      title={service.title}
                      eyebrow={service.shortTitle}
                      description={service.summary}
                      items={service.features}
                      icon={service.icon}
                      href={`/services/${service.slug}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Industry Landing"
            title="업종별 검색 의도에 맞춰 다시 확인하세요"
            description="음식점, 병원, 카페, 뷰티 업종은 고객이 비교하는 정보와 전환 동선이 다릅니다. 서비스 선택 전 업종별 우선순위를 먼저 확인할 수 있습니다."
          />
          <ButtonLink href="/free-audit" variant="outline" className="w-fit">
            무료 자동진단 시작
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {marketingIndustryPages.map((industry) => (
            <Link
              key={industry.slug}
              href={industry.path}
              className="rounded-[8px] border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-accent/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
            >
              <p className="text-xs font-extrabold text-accent">{industry.label}</p>
              <h2 className="mt-2 text-lg font-bold leading-7 text-ink">{industry.seoTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{industry.heroTitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">
                업종별 전략 보기
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
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
