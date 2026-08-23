import { ClipboardCheck } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { FaqSection } from "@/components/sections/faq-section";
import { Section, SectionHeading } from "@/components/ui/section";
import { auditItems } from "@/data/services";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "무료 네이버 플레이스 진단",
  description:
    "부산·경남 매장의 네이버 플레이스 검색 노출, 대표사진, 리뷰, 정보, 경쟁업체, 전환 동선을 담당자가 확인 후 상담합니다.",
  path: "/free-audit",
});

export default function FreeAuditPage() {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="mb-4 inline-flex rounded-[6px] bg-pale-mint px-3 py-1 text-sm font-bold text-accent">
              가장 중요한 Lead Magnet
            </p>
            <h1 className="text-balance text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              우리 매장 네이버 플레이스,
              <br />
              어디에서 고객을 놓치고 있을까요?
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted">
              광고를 시작하기 전에 현재 플레이스 상태부터 확인하세요. 검색 노출,
              대표사진, 리뷰, 플레이스 정보, 경쟁업체, 고객 전환 요소를 담당자가 확인한
              뒤 상담으로 안내합니다.
            </p>
            <div className="mt-7 rounded-[8px] border border-line bg-white p-5">
              <div className="flex gap-3">
                <ClipboardCheck className="mt-1 text-accent" size={22} aria-hidden="true" />
                <p className="text-sm leading-7 text-muted">
                  이 페이지는 실시간 자동 분석 결과를 제공하지 않습니다. 입력해주신 정보를
                  바탕으로 담당자가 확인 후 연락드리는 무료 진단 신청입니다.
                </p>
              </div>
            </div>
          </div>
          <LeadForm type="free_audit" />
        </div>
      </Section>

      <Section className="bg-pale-blue/50">
        <SectionHeading
          eyebrow="Audit Scope"
          title="무료 진단에서 확인하는 항목"
          description="순위 하나만 보지 않고, 고객이 매장을 선택하기 전 확인하는 화면 전체를 살펴봅니다."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {auditItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[8px] border border-line bg-white p-6">
                <Icon className="text-accent" size={24} aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-ink">{item.title}</h2>
                <ul className="mt-4 grid gap-2 text-sm leading-7 text-muted">
                  {item.items.map((entry) => (
                    <li key={entry}>· {entry}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Section>

      <FaqSection />
    </>
  );
}
