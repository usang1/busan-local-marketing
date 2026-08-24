import { ArrowRight, Camera, ClipboardCheck, MapPin, MessageSquareText, Search, Store } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { FinalCta } from "@/components/sections/final-cta";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { createPublicMetadata } from "@/lib/seo";
import { faqJsonLd, serviceJsonLd } from "@/lib/structured-data";

const checkItems = [
  {
    title: "검색 키워드",
    icon: Search,
    text: "고객이 실제로 입력하는 지역명, 업종명, 목적형 키워드를 나눠 현재 노출 화면을 확인합니다.",
  },
  {
    title: "대표사진",
    icon: Camera,
    text: "첫 화면에서 클릭할 이유가 보이는지, 경쟁 매장과 다른 첫인상을 주는지 점검합니다.",
  },
  {
    title: "플레이스 정보",
    icon: Store,
    text: "소개, 메뉴, 카테고리, 편의정보, 전화·예약·길찾기 동선이 방문 결정을 돕는지 봅니다.",
  },
  {
    title: "리뷰 흐름",
    icon: MessageSquareText,
    text: "최근 리뷰에서 고객이 반복해서 말하는 장점과 불안 요소를 구분합니다.",
  },
  {
    title: "경쟁업체",
    icon: MapPin,
    text: "같은 상권에서 함께 비교되는 매장의 사진, 콘텐츠, 리뷰, 이벤트 구성을 비교합니다.",
  },
];

const process = [
  "현재 플레이스와 검색 화면 확인",
  "경쟁 매장과 고객 선택 요소 비교",
  "키워드·사진·리뷰·정보 우선순위 정리",
  "개선 작업 범위와 실행 순서 제안",
  "전화, 예약, 길찾기 등 전환 지표 확인",
];

function getFaqs(region: string) {
  return [
  {
    question: "네이버 플레이스 순위를 보장하나요?",
    answer: "순위 보장은 하지 않습니다. 검색 노출뿐 아니라 클릭, 신뢰, 예약, 방문까지 이어지는 요소를 함께 점검하고 개선합니다.",
  },
  {
    question: "광고를 바로 시작해야 하나요?",
    answer: "바로 광고부터 시작하지 않아도 됩니다. 현재 플레이스 상태와 경쟁 화면을 먼저 확인한 뒤 필요한 작업 범위를 제안합니다.",
  },
  {
    question: "병원이나 의원도 가능한가요?",
    answer: "가능합니다. 다만 의료 광고와 표현에는 제한이 있으므로 업종별로 사용할 수 있는 콘텐츠와 표현을 별도로 검토합니다.",
  },
  {
    question: "부산 외 지역도 상담할 수 있나요?",
    answer: `${region}을 우선으로 하지만, 업종과 목표에 따라 다른 지역도 상담할 수 있습니다.`,
  },
  ];
}

export function generateMetadata() {
  return createPublicMetadata({
    title: "네이버 플레이스 마케팅",
    description:
      "부산·경남 사업자를 위한 네이버 플레이스 마케팅. 검색 노출, 대표사진, 리뷰, 경쟁업체, 예약·전화 동선을 함께 점검합니다.",
    path: "/services/naver-place",
  });
}

export default async function NaverPlaceServicePage() {
  const { brand, site } = await getPublicSiteProfile();
  const faqs = getFaqs(brand.region);

  return (
    <>
      <Breadcrumbs items={[{ name: "서비스", href: "/services" }, { name: "네이버 플레이스", href: "/services/naver-place" }]} />
      <JsonLd
        data={[
          serviceJsonLd({
            name: "네이버 플레이스 마케팅",
            description: "부산·경남 로컬 비즈니스의 네이버 플레이스 검색, 클릭, 신뢰, 문의, 방문 전환 요소를 점검하고 개선합니다.",
            path: "/services/naver-place",
            brand,
            site,
          }),
          faqJsonLd(faqs),
        ]}
      />

      <Section className="pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-accent">Naver Place Marketing</p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              플레이스 순위만 올라간다고 손님이 오는 것은 아닙니다
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              검색 화면에서 클릭되고, 플레이스에서 신뢰를 얻고, 전화·예약·길찾기로 이어지는 흐름을 함께 봐야 합니다.
              {brand.region} 사업자의 현재 플레이스 상태부터 확인합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/free-audit" size="lg" data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="naver_place_hero">
                <ClipboardCheck size={19} aria-hidden="true" />
                무료 플레이스 진단
              </ButtonLink>
              <ButtonLink href="/pricing" variant="outline" size="lg">
                상품 확인
                <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[8px] border border-line bg-white p-6">
            <p className="text-sm font-bold text-accent">먼저 확인할 질문</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-ink">
              {[
                "검색은 되는데 예약이나 전화가 적은가요?",
                "대표사진이 경쟁 매장보다 선택 이유를 만들고 있나요?",
                "리뷰는 많지만 신규 고객에게 신뢰를 주고 있나요?",
                "고객이 보는 메뉴, 가격, 위치, 예약 정보가 충분한가요?",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-pale-blue/50">
        <SectionHeading
          eyebrow="Audit Points"
          title="플레이스에서 고객이 이탈하는 지점을 나눠서 봅니다"
          description="노출, 클릭, 신뢰, 문의, 방문은 서로 다른 문제입니다. 한 지표만 보고 판단하면 실제 매출로 이어지는 병목을 놓치기 쉽습니다."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {checkItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[8px] border border-line bg-white p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-pale-mint text-accent">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h2 className="text-lg font-extrabold text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Process"
          title="광고비를 쓰기 전에 점검 순서를 먼저 잡습니다"
          description="바로 집행보다 현재 화면에서 손실이 생기는 부분을 확인하고, 필요한 작업을 우선순위로 나눕니다."
        />
        <ol className="grid gap-4 md:grid-cols-5">
          {process.map((item, index) => (
            <li key={item} className="rounded-[8px] border border-line bg-white p-5">
              <p className="text-sm font-extrabold text-accent">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-sm font-bold leading-6 text-ink">{item}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-ivory">
        <SectionHeading eyebrow="FAQ" title="플레이스 마케팅을 시작하기 전 자주 묻는 질문" />
        <div className="grid gap-4">
          {faqs.map((item) => (
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
