import { FinalCta } from "@/components/sections/final-cta";
import { Section, SectionHeading } from "@/components/ui/section";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { createPublicMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createPublicMetadata({
    title: "개인정보처리방침",
    description: "문의, 무료 진단, 결제 과정에서 수집되는 개인정보 항목과 운영 전 확인이 필요한 내용을 안내합니다.",
    path: "/privacy",
  });
}

const sections = [
  {
    title: "수집 항목",
    items: ["업체명, 담당자명, 연락처, 이메일", "업종, 지역, 네이버 플레이스 URL, 상담 요청 내용", "결제 상품, 주문번호, 결제 상태, PG 결제 식별자", "UTM, 유입 페이지, Referrer 등 광고 성과 분석을 위한 비식별 유입 정보"],
  },
  {
    title: "이용 목적",
    items: ["무료 네이버 플레이스 진단 및 상담 진행", "광고대행 서비스 제안과 계약 전 안내", "상품 결제 처리와 주문 확인", "광고 유입 경로와 전환 성과 분석"],
  },
  {
    title: "저장하지 않는 정보",
    items: ["카드번호, CVC, 카드 비밀번호 등 결제 민감정보", "GA4 등 Analytics 도구로 이름, 전화번호, 이메일, 문의 본문을 전송하지 않습니다."],
  },
  {
    title: "운영 전 확인 필요",
    items: ["실제 사업자명, 대표자, 사업장 주소, 연락처", "개인정보 보유 기간", "위탁 처리 업체와 국외 이전 여부", "법률 검토 후 확정 문구"],
  },
];

export default async function PrivacyPage() {
  const { site } = await getPublicSiteProfile();

  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="Privacy"
          title="개인정보처리방침"
          description="현재 문서는 운영 전 입력이 필요한 영역을 포함한 준비 문서입니다. 실제 서비스 공개 전 사업자 정보와 보유 기간 등 법률 검토가 필요한 항목을 확정해야 합니다."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[8px] border border-line bg-white p-6">
              <h2 className="text-xl font-extrabold text-ink">{section.title}</h2>
              <ul className="mt-4 grid gap-2 text-sm leading-7 text-muted">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {site.businessName || site.address || site.phone || site.email ? (
          <div className="mt-5 rounded-[8px] border border-line bg-white p-6 text-sm leading-7 text-muted">
            <h2 className="text-xl font-extrabold text-ink">운영 정보</h2>
            <div className="mt-4 grid gap-2">
              {site.businessName ? <p>사업자명: {site.businessName}</p> : null}
              {site.address ? <p>사업장 주소: {site.address}</p> : null}
              {site.phone ? <p>대표 전화번호: {site.phone}</p> : null}
              {site.email ? <p>대표 이메일: {site.email}</p> : null}
            </div>
          </div>
        ) : null}
      </Section>
      <FinalCta />
    </>
  );
}
