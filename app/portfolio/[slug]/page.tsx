import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FinalCta } from "@/components/sections/final-cta";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { portfolioCases } from "@/data/portfolio";
import { createMetadata } from "@/lib/seo";
import { getPublicPortfolioBySlug } from "@/lib/public/content";

export function generateStaticParams() {
  return portfolioCases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicPortfolioBySlug(slug);

  if (!item) {
    return {};
  }

  return createMetadata({
    title: `${item.client} 사례`,
    description: `${item.industry} 업종의 로컬 마케팅 사례 구조입니다. 실제 성과 데이터는 확인 후 반영합니다.`,
    path: `/portfolio/${item.slug}`,
  });
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicPortfolioBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs items={[{ name: "포트폴리오", href: "/portfolio" }, { name: item.title, href: `/portfolio/${item.slug}` }]} />
      <Section className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <div className="mb-4 inline-flex rounded-[6px] bg-soft-beige px-3 py-1 text-sm font-bold text-ink">
              {item.status === "placeholder" ? "실제 사례 입력 예정" : "Case Study"}
            </div>
            <SectionHeading
              eyebrow={`${item.industry} · ${item.location}`}
              title={item.title}
              description={item.summary}
            />
            <ButtonLink href="/free-audit">우리 매장도 무료 진단받기</ButtonLink>
          </div>
          <div className="rounded-[8px] border border-line bg-white p-6">
            <dl className="grid gap-5 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold text-muted">CLIENT</dt>
                <dd className="mt-2 font-bold text-ink">{item.client}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted">INDUSTRY</dt>
                <dd className="mt-2 font-bold text-ink">{item.industry}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted">LOCATION</dt>
                <dd className="mt-2 font-bold text-ink">{item.location}</dd>
              </div>
            </dl>
            <div className="mt-8 rounded-[8px] bg-pale-blue p-5">
              <p className="text-sm font-bold text-accent">RESULT</p>
              <p className="mt-2 text-base leading-8 text-ink">{item.result}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white/60">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[8px] border border-line bg-white p-6">
            <p className="text-sm font-bold text-accent">CHALLENGE</p>
            <h2 className="mt-3 text-xl font-bold text-ink">문제</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{item.challenge}</p>
          </article>
          <article className="rounded-[8px] border border-line bg-white p-6">
            <p className="text-sm font-bold text-accent">STRATEGY</p>
            <h2 className="mt-3 text-xl font-bold text-ink">전략</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-7 text-muted">
              {item.strategy.map((entry) => (
                <li key={entry}>· {entry}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[8px] border border-line bg-white p-6">
            <p className="text-sm font-bold text-accent">EXECUTION</p>
            <h2 className="mt-3 text-xl font-bold text-ink">실행</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-7 text-muted">
              {item.execution.map((entry) => (
                <li key={entry}>· {entry}</li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
