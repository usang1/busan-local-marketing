import { ClipboardCheck } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { PlaceAuditForm } from "@/components/forms/place-audit-form";
import { FaqSection } from "@/components/sections/faq-section";
import { Section, SectionHeading } from "@/components/ui/section";
import { auditItems } from "@/data/services";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { createPublicMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createPublicMetadata({
    title: "무료 네이버 플레이스 진단",
    description:
      "부산·경남 매장의 네이버 플레이스 검색 노출, 대표사진, 리뷰, 정보, 경쟁업체, 전환 동선을 담당자가 확인 후 상담합니다.",
    path: "/free-audit",
  });
}

export default async function FreeAuditPage() {
  const { brand, site } = await getPublicSiteProfile();

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
              광고를 시작하기 전에 현재 플레이스 상태부터 확인하세요. 네이버 플레이스 주소를
              입력하면 공개 정보에서 확인 가능한 항목만 기준으로 기본 자동진단 결과를 먼저 보여드립니다.
            </p>
            <div className="mt-7 rounded-[8px] border border-line bg-white p-5">
              <div className="flex gap-3">
                <ClipboardCheck className="mt-1 text-accent" size={22} aria-hidden="true" />
                <p className="text-sm leading-7 text-muted">
                  로그인, CAPTCHA, 비공개 데이터 접근은 하지 않습니다. 네이버 공개 페이지에서 확인되지
                  않는 리뷰·메뉴·영업시간은 추측하지 않고 점수 계산에서 제외합니다.
                </p>
              </div>
            </div>
          </div>
          <PlaceAuditForm brandName={brand.name} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <SectionHeading
            eyebrow="Expert Review"
            title="자동진단 없이 바로 상세 진단을 신청할 수도 있습니다"
            description="기존 무료진단 Funnel은 그대로 유지합니다. 업체 정보와 플레이스 URL을 남겨주시면 담당자가 확인 후 상담합니다."
          />
          <LeadForm type="free_audit" kakaoChatUrl={site.kakaoChatUrl} />
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
