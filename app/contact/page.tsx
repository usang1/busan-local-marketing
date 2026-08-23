import { LeadForm } from "@/components/forms/lead-form";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { Section, SectionHeading } from "@/components/ui/section";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "상담 문의",
  description:
    "부산·경남 네이버 플레이스, 블로그, 숏폼, 로컬 마케팅 상담을 신청하세요. 업체 정보 확인 후 연락드립니다.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section className="pt-12 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="바로 상담이 필요하다면 현재 상황부터 남겨주세요"
            description="업체명, 업종, 지역, 가장 큰 고민만 남겨도 상담 준비가 가능합니다. 무료 진단보다 넓은 범위의 문의는 이 페이지에서 접수합니다."
          />
          <div className="rounded-[8px] border border-line bg-white p-6">
            <p className="text-sm font-bold text-ink">카카오톡 상담</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              카카오톡 채널 URL은 아직 설정되지 않았습니다. 설정 후 모든 카카오 CTA가 같은
              링크로 연결됩니다.
            </p>
            <KakaoCta className="mt-5" />
          </div>
        </div>
        <LeadForm type="consultation" />
      </div>
    </Section>
  );
}
