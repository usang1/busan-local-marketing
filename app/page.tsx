import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, ListChecks, MapPin, MousePointerClick, PhoneCall, Search, SearchCheck, Star } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { Section, SectionHeading } from "@/components/ui/section";
import { ServiceCard } from "@/components/sections/service-card";
import { PortfolioCard } from "@/components/sections/portfolio-card";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { createPublicMetadata } from "@/lib/seo";
import { marketingIndustryPages } from "@/data/marketing-industries";
import { processSteps, serviceGroups } from "@/data/services";
import { getFeaturedPublicPortfolios } from "@/lib/public/content";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function generateMetadata() {
  return createPublicMetadata({
    title: "부산·경남 네이버 플레이스 광고대행",
    description:
      "부산·경남 자영업자와 로컬 비즈니스를 위한 네이버 플레이스 진단, 로컬 SEO, 블로그, 숏폼 콘텐츠 마케팅 상담 페이지입니다.",
  });
}

const problems = [
  "플레이스 순위가 계속 떨어진다.",
  "광고비는 나가는데 예약이 늘지 않는다.",
  "경쟁 매장만 검색 상단에 보인다.",
  "블로그를 꾸준히 해도 방문자가 늘지 않는다.",
  "리뷰는 많은데 신규 고객이 없다.",
  "마케팅을 어디서부터 손대야 할지 모르겠다.",
];

const funnel = [
  { label: "검색", icon: Search },
  { label: "클릭", icon: MousePointerClick },
  { label: "플레이스 확인", icon: MapPin },
  { label: "사진·리뷰·메뉴", icon: Star },
  { label: "전화·예약·길찾기", icon: PhoneCall },
];

export default async function Home() {
  const [{ brand, site }, featuredPortfolios] = await Promise.all([getPublicSiteProfile(), getFeaturedPublicPortfolios()]);

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-12 sm:pb-20 lg:pt-16">
        <div className="container-page grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="fade-up">
            <p className="mb-4 inline-flex rounded-[6px] bg-pale-mint px-3 py-1 text-sm font-bold text-accent">
              {brand.region} 로컬 비즈니스 대상
            </p>
            <div className="mb-5 flex w-fit items-center gap-3 rounded-[8px] border border-line bg-white px-3 py-2 shadow-[0_12px_34px_rgba(31,42,46,0.07)]">
              <BrandLogo brand={brand} />
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
              검색 노출이 아니라
              <br />
              매출까지 연결되는 로컬 마케팅
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
              {brand.name}는 marketing과 evolution을 결합한 로컬 마케팅 브랜드입니다.
              네이버 플레이스에서 고객이 검색하고, 클릭하고, 신뢰하고, 전화·예약·방문까지
              이어지는 과정을 함께 점검합니다. 광고 계약 전에 현재 플레이스 상태부터
              확인하세요.
            </p>
            <div className="mt-7 rounded-[8px] border border-accent/30 bg-ink p-5 text-white shadow-[0_22px_55px_rgba(31,42,46,0.18)] sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-[6px] bg-white/10 px-3 py-1 text-sm font-bold text-pale-mint">
                    <SearchCheck size={16} aria-hidden="true" />
                    네이버 플레이스 자동진단
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
                    지금 입력하고 바로 기본 결과를 확인하세요
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
                    업체명, 지역, 사진·메뉴·리뷰 상태를 입력하면 우선 개선할 부분을 먼저 정리합니다.
                  </p>
                </div>
                <ButtonLink
                  href="/free-audit"
                  size="lg"
                  className="w-full shrink-0 border-white bg-white text-ink hover:bg-pale-mint sm:w-fit"
                  data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT}
                  data-analytics-location="hero_audit_panel"
                >
                  <ListChecks size={19} aria-hidden="true" />
                  자동진단 시작
                </ButtonLink>
              </div>
              <div className="mt-5 grid gap-2 text-sm font-bold text-white/82 sm:grid-cols-3">
                {["사진·메뉴 상태", "리뷰·답변 상태", "전화·예약 동선"].map((item) => (
                  <span key={item} className="rounded-[6px] border border-white/12 bg-white/8 px-3 py-2">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:flex">
              <ButtonLink href="/free-audit" size="lg" data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="hero">
                <ClipboardCheck size={19} aria-hidden="true" />
                무료 자동진단 받기
              </ButtonLink>
              <KakaoCta size="lg" location="hero" kakaoChatUrl={site.kakaoChatUrl} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              자동진단은 사용자가 입력한 정보만 기준으로 하며, 필요하면 담당자가 상세 상담으로 이어서 확인합니다.
            </p>
          </div>
          <div className="relative fade-up">
            <Image
              src="/placeholders/local-audit-hero.png"
              alt="로컬 플레이스 진단 자료와 상담 화면"
              width={1536}
              height={1024}
              priority
              className="aspect-[4/3] w-full rounded-[8px] border border-white object-cover shadow-[0_30px_80px_rgba(31,42,46,0.12)]"
            />
          </div>
        </div>
      </section>

      <Section className="bg-white/50">
        <SectionHeading eyebrow="Problem" title="혹시 지금 이런 상황인가요?" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <div key={problem} className="rounded-[8px] border border-line bg-white p-5">
              <p className="text-base font-bold leading-7 text-ink">{problem}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Industry"
            title="업종별로 고객이 확인하는 정보가 다릅니다"
            description="음식점, 병원, 카페, 뷰티 업종은 검색 방식과 예약 판단 기준이 다릅니다. 같은 플레이스라도 먼저 고쳐야 할 요소를 업종별로 나눠 봅니다."
          />
          <ButtonLink href="/free-audit" variant="outline" className="w-fit">
            업종별 무료진단 시작
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
              <p className="text-xs font-extrabold text-accent">부산·경남 {industry.shortLabel}</p>
              <h2 className="mt-2 text-xl font-bold leading-7 text-ink">{industry.seoTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{industry.heroTitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">
                업종 페이지 보기
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeading
            eyebrow="Conversion Funnel"
            title="플레이스 순위만 올라간다고 손님이 오는 것은 아닙니다"
            description="검색은 되는데 예약이 없다면 노출보다 전환부터 확인해야 합니다. 대표사진 하나가 클릭을 바꾸고, 리뷰 한 줄이 방문 결정을 바꿉니다."
          />
          <div className="rounded-[8px] border border-line bg-white p-5 sm:p-7">
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[8px] bg-soft-beige p-4">
                <p className="text-sm font-bold text-muted">기존 방식</p>
                <p className="mt-2 text-xl font-extrabold text-ink">노출 → 클릭</p>
              </div>
              <div className="rounded-[8px] bg-pale-mint p-4">
                <p className="text-sm font-bold text-accent">필요한 방식</p>
                <p className="mt-2 text-xl font-extrabold text-ink">검색 → 신뢰 → 문의 → 방문</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-5">
              {funnel.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[8px] border border-line bg-ivory p-4 text-center">
                    <Icon className="mx-auto text-accent" size={22} aria-hidden="true" />
                    <p className="mt-3 text-sm font-bold text-ink">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-pale-blue/50">
        <SectionHeading
          eyebrow="Services"
          title="로컬 검색에서 문의까지 필요한 부분을 나눠서 봅니다"
          description="처음부터 모든 채널을 늘리지 않습니다. 업종과 상권에 맞춰 플레이스, 콘텐츠, 리뷰, 전환 동선의 우선순위를 정합니다."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceGroups.slice(0, 6).map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Process"
          title="광고를 맡기면 무엇을 하는지 알 수 있어야 합니다"
          description="진단부터 개선까지의 과정을 작은 단계로 나눠 진행합니다."
        />
        <div className="grid gap-4 lg:grid-cols-7">
          {processSteps.map((step) => (
            <article key={step.step} className="rounded-[8px] border border-line bg-white p-5">
              <p className="text-sm font-extrabold text-accent">{step.step}</p>
              <h3 className="mt-3 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-white/60">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Portfolio"
            title="실제 성과는 확인된 데이터만 공개합니다"
            description="현재는 사례 구조를 먼저 준비한 상태입니다. 실제 고객사, 매출, 순위, 후기 등은 확인된 자료가 생긴 뒤 반영합니다."
          />
          <ButtonLink href="/portfolio" variant="outline" className="w-fit">
            포트폴리오 보기
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredPortfolios.map((item) => (
            <PortfolioCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>

      <FaqSection />
      <FinalCta />
    </>
  );
}
