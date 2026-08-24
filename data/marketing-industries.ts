export type MarketingIndustrySlug = "restaurant" | "hospital" | "cafe" | "beauty";

export type MarketingIndustryPage = {
  slug: MarketingIndustrySlug;
  path: `/marketing/${MarketingIndustrySlug}`;
  label: string;
  shortLabel: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  searchIntent: string[];
  ownerProblems: string[];
  customerJourney: string[];
  missedElements: string[];
  placeStrategy: string[];
  contentStrategy: string[];
  process: string[];
  ctaLabel: string;
  secondaryCtaLabel: string;
  portfolioKeywords: string[];
  relatedServiceSlugs: string[];
  complianceNote?: string;
};

export const marketingIndustryPages: MarketingIndustryPage[] = [
  {
    slug: "restaurant",
    path: "/marketing/restaurant",
    label: "음식점",
    shortLabel: "음식점",
    seoTitle: "부산 음식점 마케팅",
    seoDescription:
      "부산·경남 음식점의 지역+메뉴 검색, 네이버 플레이스, 대표사진, 메뉴정보, 리뷰, 예약·길찾기 전환을 점검하는 음식점 마케팅 랜딩페이지입니다.",
    heroTitle: "검색에는 나오는데 예약과 방문으로 이어지지 않나요?",
    heroDescription:
      "음식점 고객은 지역과 메뉴를 함께 검색한 뒤 사진, 메뉴, 리뷰, 길찾기, 예약 가능 여부를 빠르게 비교합니다. 노출보다 선택되는 화면을 먼저 점검합니다.",
    searchIntent: [
      "지역명+메뉴명으로 가까운 매장을 찾는 고객",
      "대표사진과 메뉴사진을 보고 방문 후보를 줄이는 고객",
      "예약, 웨이팅, 주차, 길찾기 정보를 확인한 뒤 이동하는 고객",
      "여행 중 부산·경남 맛집을 저장하고 동선에 넣는 관광객",
    ],
    ownerProblems: [
      "플레이스 조회는 있는데 전화나 예약이 늘지 않는다.",
      "대표 메뉴가 무엇인지 사진만 봐서는 전달되지 않는다.",
      "블로그와 숏폼을 올려도 플레이스 방문으로 이어지는 흐름이 약하다.",
      "리뷰는 쌓였지만 신규 고객이 비교할 때 선택할 이유가 부족하다.",
    ],
    customerJourney: [
      "검색 결과에서 매장명, 대표사진, 거리, 리뷰 요약을 먼저 비교합니다.",
      "플레이스에 들어와 메뉴, 가격대, 영업시간, 예약 가능 여부를 확인합니다.",
      "블로그, 숏폼, 사진 탭에서 실제 음식과 공간 분위기를 다시 확인합니다.",
      "전화, 예약, 길찾기 중 가장 쉬운 동선으로 전환합니다.",
    ],
    missedElements: [
      "대표사진 첫 화면이 대표 메뉴와 공간의 강점을 설명하지 못하는 경우",
      "메뉴명, 가격대, 구성 정보가 부족해 방문 전 불안을 남기는 경우",
      "웨이팅, 예약, 주차, 브레이크타임 같은 방문 전 정보가 흩어진 경우",
    ],
    placeStrategy: [
      "지역+메뉴 검색 화면에서 비교되는 요소를 먼저 정리합니다.",
      "대표사진, 메뉴사진, 공간사진의 역할을 나눠 첫 인상을 설계합니다.",
      "예약, 전화, 길찾기, 웨이팅 안내가 끊기지 않도록 전환 동선을 점검합니다.",
      "리뷰 요청과 답변 기준을 실제 방문 고객 경험에 맞춰 정리합니다.",
    ],
    contentStrategy: [
      "대표 메뉴를 처음 보는 고객도 이해할 수 있는 사진·문구 소재를 만듭니다.",
      "블로그에서는 메뉴 선택, 방문 동선, 주차, 단체 이용처럼 검색 전 질문을 풀어냅니다.",
      "숏폼은 조리 장면, 한 상 구성, 공간 분위기처럼 저장될 장면을 중심으로 기획합니다.",
    ],
    process: [
      "검색 키워드와 플레이스 첫 화면 점검",
      "사진·메뉴·리뷰·예약 동선 우선순위 정리",
      "블로그·숏폼 소재와 내부 링크 설계",
      "무료진단 결과를 기준으로 실행 범위 협의",
    ],
    ctaLabel: "우리 음식점 플레이스 무료 진단",
    secondaryCtaLabel: "음식점 마케팅 상담하기",
    portfolioKeywords: ["음식점", "식당", "외식", "맛집"],
    relatedServiceSlugs: [
      "naver-place-receipt-review",
      "naver-place-blog-review",
      "instagram-traffic",
      "foodstagram-200k",
    ],
  },
  {
    slug: "hospital",
    path: "/marketing/hospital",
    label: "병원/의원",
    shortLabel: "병원",
    seoTitle: "부산 병원 마케팅",
    seoDescription:
      "부산·경남 병원과 의원의 지역+진료과목 검색, 플레이스 정보 신뢰, 콘텐츠, 예약 접근성을 과장 없이 점검하는 의료 업종 마케팅 랜딩페이지입니다.",
    heroTitle: "환자가 예약하기 전에 확인하는 정보가 충분히 정리되어 있나요?",
    heroDescription:
      "병원·의원 검색은 단순 노출보다 정보 신뢰가 중요합니다. 지역과 진료과목을 찾는 사용자가 진료 범위, 위치, 예약 방법을 오해 없이 확인하도록 구조를 점검합니다.",
    searchIntent: [
      "지역명+진료과목으로 가까운 의료기관을 비교하는 사용자",
      "진료 시간, 위치, 예약 방법을 먼저 확인하는 사용자",
      "진료 정보와 콘텐츠 표현의 신뢰도를 확인하는 사용자",
      "방문 전 FAQ나 안내 글로 불안을 줄이고 싶은 사용자",
    ],
    ownerProblems: [
      "검색은 되지만 어떤 진료를 볼 수 있는지 한눈에 전달되지 않는다.",
      "의료광고 표현이 조심스러워 콘텐츠를 어디까지 써야 할지 어렵다.",
      "예약 접근성이 낮아 문의 전에 이탈하는 사용자가 생긴다.",
      "리뷰나 정보 관리가 민감해 운영 기준이 필요하다.",
    ],
    customerJourney: [
      "지역과 진료과목으로 검색한 뒤 위치, 진료 시간, 기본 정보를 비교합니다.",
      "플레이스와 홈페이지에서 진료 범위와 예약 방법을 확인합니다.",
      "콘텐츠에서 방문 전 궁금한 점이 충분히 설명되는지 확인합니다.",
      "전화 또는 예약 페이지로 이동해 상담 가능 여부를 확인합니다.",
    ],
    missedElements: [
      "진료 범위와 예약 안내가 여러 채널에 흩어져 있는 경우",
      "신뢰를 높여야 하는 정보와 광고성 표현의 경계가 정리되지 않은 경우",
      "환자가 방문 전에 확인하는 준비사항, 위치, 주차 정보가 부족한 경우",
    ],
    placeStrategy: [
      "지역+진료과목 검색에서 기본 정보가 명확히 보이는지 점검합니다.",
      "플레이스 소개, 사진, 진료 정보가 실제 운영 범위와 맞는지 확인합니다.",
      "전화, 예약, 길찾기 동선을 사용자가 헷갈리지 않게 정리합니다.",
      "리뷰와 안내 문구는 의료광고 관련 법률과 플랫폼 정책 검토를 전제로 관리합니다.",
    ],
    contentStrategy: [
      "진료 효과를 보장하지 않고, 확인 가능한 진료 정보와 이용 안내 중심으로 구성합니다.",
      "자주 묻는 질문, 내원 전 준비사항, 위치 안내처럼 환자의 판단을 돕는 콘텐츠를 우선합니다.",
      "운영 전 의료광고 관련 표현은 병원 내부 또는 전문가 검토가 필요하다는 전제를 둡니다.",
    ],
    process: [
      "지역+진료과목 검색 화면과 플레이스 기본 정보 점검",
      "의료광고 표현 리스크가 있는 문구 분리",
      "예약·전화·길찾기 동선 확인",
      "검토가 필요한 콘텐츠와 바로 정리 가능한 정보를 구분",
    ],
    ctaLabel: "우리 병원 검색·플레이스 상태 확인",
    secondaryCtaLabel: "의료 업종 마케팅 상담하기",
    portfolioKeywords: ["병원", "의원", "클리닉", "의료"],
    relatedServiceSlugs: [
      "google-maps-seo",
      "website-production",
      "brand-blog-management",
      "naver-place-blog-review",
    ],
    complianceNote:
      "의료 업종 문구는 의료광고 관련 법률과 플랫폼 정책 검토가 필요합니다. 이 페이지는 치료 효과, 순위, 성과를 보장하지 않습니다.",
  },
  {
    slug: "cafe",
    path: "/marketing/cafe",
    label: "카페",
    shortLabel: "카페",
    seoTitle: "부산 카페 마케팅",
    seoDescription:
      "부산·경남 카페의 대표사진, 공간 분위기, 메뉴·디저트, 지역 검색, 리뷰, SNS 저장·공유 흐름을 점검하는 카페 마케팅 랜딩페이지입니다.",
    heroTitle: "사진은 예쁜데 저장과 방문으로 연결되는 구조가 있나요?",
    heroDescription:
      "카페 고객은 메뉴보다 공간 분위기, 사진, 디저트, 주변 동선을 먼저 보는 경우가 많습니다. 검색과 SNS에서 저장하고 찾아오게 만드는 접점을 정리합니다.",
    searchIntent: [
      "지역명+카페, 지역명+디저트로 방문 후보를 찾는 고객",
      "사진과 분위기를 보고 저장하거나 공유하는 고객",
      "관광지, 전시, 숙소 주변에서 들를 카페를 찾는 고객",
      "SNS에서 본 공간을 네이버 플레이스로 다시 확인하는 고객",
    ],
    ownerProblems: [
      "사진은 올리지만 어떤 장면을 대표로 보여줘야 할지 기준이 없다.",
      "디저트와 시즌 메뉴가 검색 화면에서 충분히 전달되지 않는다.",
      "SNS 반응은 있지만 네이버 저장, 길찾기, 방문으로 이어지는 동선이 약하다.",
      "관광객과 동네 고객에게 보여줘야 할 정보가 다르다.",
    ],
    customerJourney: [
      "검색 또는 SNS에서 공간 분위기와 대표 메뉴를 보고 후보에 저장합니다.",
      "플레이스에서 위치, 영업시간, 메뉴, 리뷰, 사진을 다시 확인합니다.",
      "동행자에게 공유하거나 여행·데이트 동선 안에 넣습니다.",
      "길찾기 또는 전화 문의로 방문 여부를 결정합니다.",
    ],
    missedElements: [
      "대표사진이 공간, 메뉴, 디저트 중 무엇을 먼저 보여줄지 정리되지 않은 경우",
      "시즌 메뉴와 시그니처 메뉴가 검색자가 이해할 수 있게 설명되지 않은 경우",
      "SNS에서 플레이스 또는 상담 동선으로 넘어가는 링크 구조가 약한 경우",
    ],
    placeStrategy: [
      "대표사진과 사진 탭을 공간, 메뉴, 디저트, 외관, 동선으로 나눠 점검합니다.",
      "지역 검색에서 카페의 방문 목적이 드러나도록 소개와 메뉴 정보를 정리합니다.",
      "저장, 공유, 길찾기가 이어지도록 네이버와 SNS 링크 구조를 확인합니다.",
      "리뷰에서 반복되는 장점을 콘텐츠 소재로 바꿉니다.",
    ],
    contentStrategy: [
      "사진 한 장으로 분위기와 대표 메뉴가 함께 전달되는 구성을 우선합니다.",
      "블로그는 좌석, 주차, 콘센트, 단체 이용, 관광 동선 같은 방문 전 질문을 풀어냅니다.",
      "Reels와 Shorts는 공간 전환, 제조 장면, 디저트 컷처럼 저장 가능한 장면을 중심으로 만듭니다.",
    ],
    process: [
      "대표사진과 메뉴·공간 사진 구성 점검",
      "지역 검색 키워드와 방문 목적 분리",
      "SNS 저장·공유 후 플레이스 확인 동선 정리",
      "콘텐츠 소재와 무료진단 기반 실행 범위 협의",
    ],
    ctaLabel: "우리 카페 플레이스 무료 진단",
    secondaryCtaLabel: "카페 마케팅 상담하기",
    portfolioKeywords: ["카페", "디저트", "커피"],
    relatedServiceSlugs: [
      "instagram-traffic",
      "naver-place-blog-review",
      "brand-blog-management",
      "youtube-traffic",
    ],
  },
  {
    slug: "beauty",
    path: "/marketing/beauty",
    label: "미용실/뷰티",
    shortLabel: "뷰티",
    seoTitle: "부산 미용실 마케팅",
    seoDescription:
      "부산·경남 미용실과 뷰티샵의 스타일 사례, 시술사진, 디자이너 정보, 가격, 리뷰, 예약, 인스타그램·숏폼 전환을 점검하는 랜딩페이지입니다.",
    heroTitle: "스타일 사례는 있는데 예약을 결정할 정보까지 이어지나요?",
    heroDescription:
      "미용·뷰티 고객은 지역 검색 후 스타일 사례, 디자이너, 가격 정보, 리뷰, 예약 가능 여부를 함께 확인합니다. 예쁜 사진을 예약 판단 자료로 바꾸는 구조가 필요합니다.",
    searchIntent: [
      "지역명+시술명으로 스타일 사례와 가격대를 비교하는 고객",
      "디자이너 또는 시술자의 작업 결과를 확인하는 고객",
      "인스타그램에서 본 스타일을 네이버 플레이스와 예약으로 다시 확인하는 고객",
      "리뷰와 사진을 통해 실패 가능성을 줄이고 싶은 고객",
    ],
    ownerProblems: [
      "스타일 사진은 많은데 가격, 디자이너, 예약 동선과 연결되지 않는다.",
      "SNS에 올린 결과물이 네이버 검색 고객에게 충분히 닿지 않는다.",
      "리뷰는 있지만 어떤 시술 강점이 있는지 한눈에 전달되지 않는다.",
      "상담 전 필요한 정보가 부족해 반복 문의가 많다.",
    ],
    customerJourney: [
      "지역과 시술 키워드로 후보를 찾고 스타일 사진을 비교합니다.",
      "디자이너, 가격대, 소요 시간, 예약 가능성을 확인합니다.",
      "인스타그램과 플레이스 리뷰를 오가며 신뢰 요소를 확인합니다.",
      "예약 링크 또는 전화 문의로 상담을 시작합니다.",
    ],
    missedElements: [
      "시술사진이 어떤 고객 고민을 해결하는 사례인지 설명되지 않은 경우",
      "가격 정보와 예약 전 확인사항이 부족해 문의 전 이탈하는 경우",
      "인스타그램 콘텐츠와 플레이스 예약 동선이 끊겨 있는 경우",
    ],
    placeStrategy: [
      "지역+시술 검색에서 사진, 가격, 예약 정보가 함께 보이는지 점검합니다.",
      "디자이너, 시술 카테고리, 작업 사례를 사용자가 비교하기 쉽게 정리합니다.",
      "리뷰에서 반복되는 강점을 플레이스 소개와 콘텐츠에 반영합니다.",
      "인스타그램, Reels, Shorts에서 예약 페이지로 이어지는 동선을 확인합니다.",
    ],
    contentStrategy: [
      "스타일 결과물만 나열하지 않고 고객 고민, 시술 기준, 관리 정보를 함께 설명합니다.",
      "블로그는 시술 전후 확인사항, 가격 범위 안내, 예약 전 질문을 중심으로 구성합니다.",
      "숏폼은 스타일 변화, 시술 과정 일부, 관리 팁처럼 상담 전 신뢰를 만드는 소재를 우선합니다.",
    ],
    process: [
      "지역+시술 키워드와 플레이스 첫 화면 점검",
      "스타일 사례, 가격 정보, 디자이너 정보 구조화",
      "Instagram·숏폼·플레이스 예약 동선 연결",
      "무료진단 결과 기준으로 콘텐츠와 실행 범위 협의",
    ],
    ctaLabel: "우리 미용실 플레이스 무료 진단",
    secondaryCtaLabel: "뷰티 업종 마케팅 상담하기",
    portfolioKeywords: ["미용", "뷰티", "헤어", "네일", "피부", "왁싱"],
    relatedServiceSlugs: [
      "instagram-traffic",
      "naver-place-receipt-review",
      "naver-place-blog-review",
      "threads-traffic",
    ],
  },
];

export const marketingIndustrySlugs = marketingIndustryPages.map((page) => page.slug);

export function getMarketingIndustryPage(slug: string) {
  return marketingIndustryPages.find((page) => page.slug === slug);
}
