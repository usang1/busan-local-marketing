import { FinalCta } from "@/components/sections/final-cta";
import { PortfolioCard } from "@/components/sections/portfolio-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { createPublicMetadata } from "@/lib/seo";
import { getPublicPortfolios } from "@/lib/public/content";

export function generateMetadata() {
  return createPublicMetadata({
    title: "포트폴리오",
    description:
      "부산·경남 로컬 비즈니스 네이버 플레이스 마케팅 사례 구조를 Case Study 형식으로 확인하세요. 허위 성과 없이 준비 중인 자료를 명확히 표시합니다.",
    path: "/portfolio",
  });
}

export default async function PortfolioPage() {
  const portfolios = await getPublicPortfolios();

  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="Portfolio"
          title="사례는 문제, 전략, 실행, 결과의 흐름으로 공개합니다"
          description="현재 실제 고객 사례가 없어 placeholder 구조로 표시합니다. 순위, 매출, 고객사명은 확인된 자료가 있을 때만 추가합니다."
        />
        {portfolios.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {portfolios.map((item) => (
              <PortfolioCard key={item.slug} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-line bg-white p-8 text-muted">
            공개 가능한 사례가 준비되면 이 영역에 추가됩니다.
          </div>
        )}
      </Section>
      <FinalCta />
    </>
  );
}
