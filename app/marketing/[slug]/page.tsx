import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardCheck, Compass, FileText, MapPin, Search } from "lucide-react";
import { PortfolioCard } from "@/components/sections/portfolio-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { Section, SectionHeading } from "@/components/ui/section";
import { marketingIndustryPages, getMarketingIndustryPage } from "@/data/marketing-industries";
import { getServiceBySlug } from "@/data/services";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { getPublicPortfolios, type PublicPortfolio } from "@/lib/public/content";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { createPublicMetadata } from "@/lib/seo";
import { serviceJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return marketingIndustryPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getMarketingIndustryPage(slug);

  if (!page) {
    return createPublicMetadata({
      title: "업종별 마케팅",
      description: "부산·경남 업종별 로컬 마케팅 안내 페이지입니다.",
      path: "/marketing",
      index: false,
    });
  }

  return createPublicMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: page.path,
  });
}

function getRelatedPortfolios(portfolios: PublicPortfolio[], keywords: string[]) {
  return portfolios
    .filter((item) => item.status === "ready")
    .filter((item) => {
      const text = [item.title, item.client, item.industry, item.summary].join(" ");
      return keywords.some((keyword) => text.includes(keyword));
    })
    .slice(0, 3);
}

export default async function MarketingIndustryLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getMarketingIndustryPage(slug);

  if (!page) notFound();

  const [{ brand, site }, allPortfolios] = await Promise.all([getPublicSiteProfile(), getPublicPortfolios()]);
  const relatedPortfolios = getRelatedPortfolios(allPortfolios, page.portfolioKeywords);
  const relatedServices = page.relatedServiceSlugs
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      <Breadcrumbs items={[{ name: "서비스", href: "/services" }, { name: `${page.label} 마케팅`, href: page.path }]} />
      <JsonLd
        data={serviceJsonLd({
          name: `${page.label} 로컬 마케팅`,
          description: page.seoDescription,
          path: page.path,
          brand,
          site,
        })}
      />

      <section className="relative overflow-hidden pb-14 pt-10 sm:pb-20 lg:pt-14">
        <div className="container-page grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-[6px] bg-pale-mint px-3 py-1 text-sm font-bold text-accent">
              부산·경남 {page.shortLabel} 마케팅
            </p>
            <h1 className="text-balance text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
              {page.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">{page.heroDescription}</p>
            {page.complianceNote ? (
              <p className="mt-5 rounded-[8px] border border-line bg-white/82 p-4 text-sm leading-7 text-muted">
                {page.complianceNote}
              </p>
            ) : null}
            <div className="mt-8 grid gap-3 sm:flex">
              <ButtonLink
                href="/free-audit"
                size="lg"
                data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT}
                data-analytics-location={`marketing_${page.slug}_hero`}
              >
                <ClipboardCheck size={19} aria-hidden="true" />
                {page.ctaLabel}
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="outline"
                data-analytics-event={ANALYTICS_EVENTS.CLICK_CONTACT}
                data-analytics-location={`marketing_${page.slug}_hero`}
              >
                {page.secondaryCtaLabel}
              </ButtonLink>
              <KakaoCta size="lg" location={`marketing_${page.slug}_hero`} kakaoChatUrl={site.kakaoChatUrl} />
            </div>
          </div>

          <div className="rounded-[8px] border border-line bg-white p-5 shadow-[0_30px_80px_rgba(31,42,46,0.10)]">
            <div className="rounded-[8px] bg-ivory p-5">
              <p className="text-sm font-extrabold text-accent">고객이 비교하는 흐름</p>
              <div className="mt-5 grid gap-3">
                {page.searchIntent.map((intent, index) => (
                  <div key={intent} className="flex gap-3 rounded-[8px] bg-white p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-pale-mint text-sm font-extrabold text-accent">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold leading-7 text-ink">{intent}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white/50">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Business Problem"
            title={`${page.label} 사업자가 자주 놓치는 전환 문제`}
            description="광고비를 늘리기 전에 검색자가 어디에서 비교하고, 어디에서 망설이고, 어떤 정보가 없어 이탈하는지 먼저 봅니다."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {page.ownerProblems.map((problem) => (
              <div key={problem} className="rounded-[8px] border border-line bg-white p-5">
                <p className="text-base font-bold leading-7 text-ink">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Search Journey"
          title={`${page.shortLabel} 고객은 이렇게 비교하고 결정합니다`}
          description="업종마다 예약과 방문을 결정하는 기준이 다릅니다. 같은 플레이스 관리라도 고객 행동에 맞춰 우선순위를 다르게 잡아야 합니다."
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {page.customerJourney.map((step, index) => (
            <article key={step} className="rounded-[8px] border border-line bg-white p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-pale-mint text-accent">
                {index === 0 ? <Search size={20} aria-hidden="true" /> : null}
                {index === 1 ? <MapPin size={20} aria-hidden="true" /> : null}
                {index === 2 ? <FileText size={20} aria-hidden="true" /> : null}
                {index === 3 ? <Compass size={20} aria-hidden="true" /> : null}
              </div>
              <p className="text-sm font-extrabold text-accent">STEP {index + 1}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{step}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-pale-blue/50">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeading
              eyebrow="Missed Elements"
              title="현재 놓치기 쉬운 요소"
              description="노출 자체보다 선택을 막는 정보 공백을 먼저 찾습니다."
            />
          </div>
          <div className="grid gap-3 lg:col-span-2">
            {page.missedElements.map((item) => (
              <div key={item} className="flex gap-3 rounded-[8px] border border-line bg-white p-5">
                <CheckCircle2 className="mt-1 shrink-0 text-accent" size={19} aria-hidden="true" />
                <p className="text-base font-semibold leading-8 text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <StrategyBlock title="플레이스 전략" items={page.placeStrategy} />
          <StrategyBlock title="콘텐츠 전략" items={page.contentStrategy} />
        </div>
      </Section>

      <Section className="bg-white/60">
        <SectionHeading
          eyebrow="Process"
          title={`${page.shortLabel} 마케팅 진행 방식`}
          description="진단 결과를 기준으로 당장 정리할 정보, 콘텐츠로 풀어낼 주제, 상담 후 확정할 실행 범위를 구분합니다."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {page.process.map((step, index) => (
            <article key={step} className="rounded-[8px] border border-line bg-white p-5">
              <p className="text-sm font-extrabold text-accent">0{index + 1}</p>
              <h2 className="mt-3 text-lg font-bold leading-7 text-ink">{step}</h2>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Related Services"
            title={`${page.label} 업종에서 함께 검토할 서비스`}
            description="모든 서비스를 한 번에 진행하지 않습니다. 업종별 고객 행동에 맞는 접점부터 확인합니다."
          />
          <ButtonLink href="/services" variant="outline" className="w-fit">
            전체 서비스 보기
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {relatedServices.map((service) => {
            if (!service) return null;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-[8px] border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-accent/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
              >
                <p className="text-xs font-extrabold text-accent">{service.shortTitle}</p>
                <h3 className="mt-2 text-lg font-bold leading-7 text-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{service.summary}</p>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="bg-pale-blue/40">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Portfolio"
            title={`${page.label} 관련 실제 공개 사례`}
            description="공개 가능한 실제 사례만 보여줍니다. 준비되지 않은 성과 수치나 가짜 사례는 노출하지 않습니다."
          />
          <ButtonLink href="/portfolio" variant="outline" className="w-fit">
            포트폴리오 보기
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
        {relatedPortfolios.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {relatedPortfolios.map((item) => (
              <PortfolioCard key={item.slug} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-line bg-white p-6">
            <p className="text-base font-bold text-ink">아직 공개 가능한 실제 사례가 없습니다.</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              관리자 CMS에 해당 업종의 공개 포트폴리오가 등록되면 이 영역에 자동으로 표시됩니다.
            </p>
          </div>
        )}
      </Section>

      <Section>
        <div className="rounded-[8px] border border-line bg-ink p-6 text-white sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
          <div>
            <p className="text-sm font-extrabold text-pale-mint">{page.label} 무료진단</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">{page.ctaLabel}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
              네이버 데이터를 임의로 수집하지 않고, 입력한 플레이스 상태를 기준으로 기본 개선 포인트를 먼저 확인합니다.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:flex lg:mt-0">
            <ButtonLink
              href="/free-audit"
              size="lg"
              data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT}
              data-analytics-location={`marketing_${page.slug}_final`}
            >
              <ClipboardCheck size={19} aria-hidden="true" />
              {page.ctaLabel}
            </ButtonLink>
            <ButtonLink
              href="/contact"
              size="lg"
              variant="outline"
              data-analytics-event={ANALYTICS_EVENTS.CLICK_CONTACT}
              data-analytics-location={`marketing_${page.slug}_final`}
            >
              {page.secondaryCtaLabel}
            </ButtonLink>
            <KakaoCta size="lg" location={`marketing_${page.slug}_final`} kakaoChatUrl={site.kakaoChatUrl} />
          </div>
        </div>
      </Section>
    </>
  );
}

function StrategyBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-[8px] border border-line bg-white p-6">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <p className="text-sm leading-7 text-muted">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
