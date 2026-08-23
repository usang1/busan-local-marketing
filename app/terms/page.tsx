import { FinalCta } from "@/components/sections/final-cta";
import { Section, SectionHeading } from "@/components/ui/section";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "이용약관 및 환불 정책",
  description: "광고대행 상품 결제 전 필요한 이용약관, 결제 안내, 환불 정책 입력 구조를 제공합니다.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="Terms"
          title="이용약관 및 환불 정책"
          description="광고대행 상품은 상담 범위와 실행 내용에 따라 조건이 달라질 수 있습니다. 아래 항목은 운영 전 실제 정책으로 확정해야 하는 영역입니다."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "서비스 이용 조건",
              text: "상품별 제공 범위, 진행 기간, 산출물, 광고비 별도 여부, 자료 제공 책임을 실제 운영 정책에 맞게 입력해야 합니다.",
            },
            {
              title: "결제 안내",
              text: "직접 결제 가능한 상품과 상담 후 결제 상품을 구분하며, 결제 완료 후 담당자가 진행 절차를 안내합니다.",
            },
            {
              title: "환불/취소 정책",
              text: "작업 착수 전·후 환불 가능 범위, 외부 광고비 처리, 콘텐츠 제작 비용 처리 기준은 임의로 확정하지 말고 운영 전 법률 검토 후 입력해야 합니다.",
            },
          ].map((item) => (
            <section key={item.title} className="rounded-[8px] border border-line bg-white p-6">
              <h2 className="text-xl font-extrabold text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{item.text}</p>
            </section>
          ))}
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
