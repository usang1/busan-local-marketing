import { ArrowRight, ClipboardCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FinalCta } from "@/components/sections/final-cta";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import {
  getServiceBySlug,
  getServiceMetadataDescription,
  serviceDetailSlugs,
  serviceDraftMetadataNote,
} from "@/data/services";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { createPublicMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return serviceDetailSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return createPublicMetadata({
    title: `${service.title} 서비스 안내`,
    description: getServiceMetadataDescription(service),
    path: `/services/${service.slug}`,
    index: !service.draft,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <>
      <Breadcrumbs items={[{ name: "서비스", href: "/services" }, { name: service.title, href: `/services/${service.slug}` }]} />

      <Section className="pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-[6px] bg-soft-beige px-3 py-1 text-sm font-bold text-ink">
              상세 내용 준비 중
            </div>
            <p className="text-sm font-bold text-accent">{service.category}</p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{service.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg" data-analytics-event={ANALYTICS_EVENTS.CLICK_CONTACT} data-analytics-location="service_detail_hero">
                상담 문의하기
                <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/free-audit" variant="outline" size="lg" data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="service_detail_hero">
                <ClipboardCheck size={19} aria-hidden="true" />
                무료 진단 신청
              </ButtonLink>
            </div>
          </div>
          <aside className="rounded-[8px] border border-line bg-white p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-pale-mint text-accent">
              <Icon size={23} aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-accent">Draft Notice</p>
            <p className="mt-3 text-base leading-8 text-muted">
              이 페이지는 서비스 상세 구조를 먼저 제공하기 위한 임시 안내입니다. 실제 범위, 일정,
              표현은 상담 후 확정합니다.
            </p>
            <p className="mt-4 rounded-[8px] bg-ivory p-4 text-sm leading-7 text-muted">{serviceDraftMetadataNote}</p>
          </aside>
        </div>
      </Section>

      <Section className="bg-pale-blue/50">
        <SectionHeading
          eyebrow="Recommended For"
          title="이런 업체에 추천"
          description="세부 조건은 업종, 지역, 현재 채널 상태를 확인한 뒤 조정합니다."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {service.targetCustomers.map((item) => (
            <article key={item} className="rounded-[8px] border border-line bg-white p-5">
              <p className="text-sm font-bold leading-7 text-ink">{item}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Scope"
          title="제공 범위"
          description="현재는 임시 항목입니다. 실제 제공 내용은 상담과 내부 검토 후 교체합니다."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {service.features.map((feature) => (
            <article key={feature} className="rounded-[8px] border border-line bg-white p-5">
              <span className="mb-4 block h-2 w-10 rounded-full bg-accent" />
              <h2 className="text-base font-extrabold leading-7 text-ink">{feature}</h2>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-white/60">
        <SectionHeading
          eyebrow="Process"
          title="진행 절차"
          description="채널별 실행 전에 현재 상태와 운영 가능 범위를 먼저 확인합니다."
        />
        <ol className="grid gap-4 md:grid-cols-5">
          {service.process.map((item, index) => (
            <li key={item} className="rounded-[8px] border border-line bg-white p-5">
              <p className="text-sm font-extrabold text-accent">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-sm font-bold leading-6 text-ink">{item}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-ivory">
        <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" />
        <div className="grid gap-4">
          {service.faq.map((item) => (
            <details key={item.question} className="rounded-[8px] border border-line bg-white p-5">
              <summary className="cursor-pointer text-base font-extrabold text-ink">{item.question}</summary>
              <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
