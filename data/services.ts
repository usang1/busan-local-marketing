import {
  BarChart3,
  Camera,
  Clapperboard,
  FileSearch,
  Globe2,
  Instagram,
  MapPin,
  MessageSquareText,
  MonitorSmartphone,
  Newspaper,
  PenLine,
  Search,
  Store,
  Users,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceCategory =
  | "글로벌 검색·관광"
  | "SNS 트래픽"
  | "언론·웹 제작"
  | "로컬·예약 플랫폼"
  | "네이버 플레이스"
  | "블로그·커뮤니티";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceDetail = {
  slug: string;
  title: string;
  shortTitle: string;
  category: ServiceCategory;
  summary: string;
  targetCustomers: string[];
  features: string[];
  process: string[];
  faq: ServiceFaq[];
  draft: boolean;
  icon: LucideIcon;
};

export const serviceCategoryOrder: ServiceCategory[] = [
  "글로벌 검색·관광",
  "SNS 트래픽",
  "언론·웹 제작",
  "로컬·예약 플랫폼",
  "네이버 플레이스",
  "블로그·커뮤니티",
];

export const serviceCategoryDescriptions: Record<ServiceCategory, string> = {
  "글로벌 검색·관광": "외국인 관광객과 지도 검색 이용자가 매장을 이해할 수 있도록 검색 접점을 정리합니다.",
  "SNS 트래픽": "콘텐츠를 본 사용자가 저장, 방문, 문의로 이어질 수 있는 채널별 유입 구조를 점검합니다.",
  "언론·웹 제작": "브랜드 신뢰와 문의 전환을 위해 외부 노출과 자체 웹페이지의 기본 구조를 준비합니다.",
  "로컬·예약 플랫폼": "동네 기반 채널과 예약 플랫폼에서 실제 고객 경험이 자연스럽게 이어지도록 설계합니다.",
  "네이버 플레이스": "검색, 리뷰, 블로그 콘텐츠가 플레이스 전환 흐름 안에서 역할을 하도록 나눠 봅니다.",
  "블로그·커뮤니티": "검색형 콘텐츠와 커뮤니티 접점에서 고객 질문을 해소하는 운영 구조를 잡습니다.",
};

const commonFaq: ServiceFaq[] = [
  {
    question: "상세 내용은 언제 확정되나요?",
    answer: "현재 페이지는 서비스 구조를 먼저 안내하기 위한 임시 콘텐츠입니다. 실제 제공 범위와 표현은 상담 후 확정합니다.",
  },
  {
    question: "성과를 보장하나요?",
    answer: "검색 순위, 매출, 예약 수, 리뷰 수 등 특정 성과를 보장하지 않습니다. 현재 상태와 실행 가능 범위를 확인해 필요한 작업을 제안합니다.",
  },
];

const defaultProcess = [
  "현재 채널과 검색 화면 확인",
  "업종, 상권, 고객 행동 기준으로 우선순위 정리",
  "진행 가능한 작업 범위와 일정 협의",
  "콘텐츠, 페이지, 노출 접점 등 실행 항목 준비",
  "진행 결과를 확인하고 다음 개선 항목 정리",
];

export const services: ServiceDetail[] = [
  {
    slug: "xiaohongshu",
    title: "샤오홍슈",
    shortTitle: "샤오홍슈",
    category: "글로벌 검색·관광",
    summary: "중국어권 관광객이 매장 정보를 이해하고 저장할 수 있도록 샤오홍슈 콘텐츠 방향을 설계합니다.",
    targetCustomers: ["외국인 관광객 방문 비중을 키우고 싶은 매장", "중국어권 고객에게 메뉴와 위치 정보를 설명해야 하는 업체", "관광 동선 안에서 발견될 콘텐츠가 필요한 브랜드"],
    features: ["콘텐츠 주제와 표현 방향 정리", "매장 소개 정보 구조화", "관광객 관점의 방문 전 확인 요소 점검", "이미지와 문구 소재 기획"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Globe2,
  },
  {
    slug: "google-maps-seo",
    title: "구글 지도 SEO 최적화",
    shortTitle: "구글 지도 SEO",
    category: "글로벌 검색·관광",
    summary: "구글 지도에서 매장 정보, 사진, 설명, 카테고리 등 기본 노출 요소를 점검하고 개선 방향을 정리합니다.",
    targetCustomers: ["외국인 고객이 구글 지도로 매장을 찾는 업체", "네이버 외 지도 검색 접점도 관리해야 하는 브랜드", "영문 정보와 위치 정보 정리가 필요한 매장"],
    features: ["지도 프로필 기본 정보 점검", "카테고리와 설명 문구 정리", "사진과 방문 정보 구성 확인", "검색 화면 내 경쟁 매장 비교"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: MapPin,
  },
  {
    slug: "youtube-traffic",
    title: "유튜브 트래픽",
    shortTitle: "유튜브",
    category: "SNS 트래픽",
    summary: "유튜브 콘텐츠와 쇼츠를 통해 브랜드 발견 접점을 만들고 문의로 이어지는 흐름을 점검합니다.",
    targetCustomers: ["영상으로 서비스나 공간을 설명해야 하는 업체", "검색 전 단계의 발견 채널이 필요한 브랜드", "기존 영상 콘텐츠의 활용 방향을 정리하고 싶은 팀"],
    features: ["콘텐츠 주제 기획", "쇼츠와 롱폼 활용 방향 정리", "유입 후 CTA 흐름 점검", "채널 기본 정보와 링크 구조 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Youtube,
  },
  {
    slug: "instagram-traffic",
    title: "인스타그램 트래픽",
    shortTitle: "인스타그램",
    category: "SNS 트래픽",
    summary: "인스타그램 게시물, 릴스, 프로필 링크가 저장과 문의로 이어질 수 있도록 기본 구조를 정리합니다.",
    targetCustomers: ["사진과 짧은 영상으로 매장 분위기를 보여줘야 하는 업체", "인스타그램에서 문의나 예약 동선을 만들고 싶은 브랜드", "게시물은 올리지만 전환 흐름이 약한 계정"],
    features: ["프로필 정보와 링크 점검", "릴스와 피드 콘텐츠 방향 정리", "방문 전 확인 요소 콘텐츠화", "문의 유도 문구와 동선 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Instagram,
  },
  {
    slug: "threads-traffic",
    title: "스레드 트래픽",
    shortTitle: "스레드",
    category: "SNS 트래픽",
    summary: "스레드에서 브랜드 톤과 대화형 콘텐츠를 만들고 다른 채널로 연결되는 흐름을 설계합니다.",
    targetCustomers: ["짧은 텍스트 기반 소통 채널이 필요한 브랜드", "인스타그램과 함께 운영할 가벼운 접점이 필요한 업체", "브랜드 관점과 소식을 꾸준히 쌓고 싶은 팀"],
    features: ["운영 톤과 주제 정리", "게시물 시리즈 소재 기획", "인스타그램 및 웹 링크 연결 점검", "댓글과 반응 관리 기준 수립"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: MessageSquareText,
  },
  {
    slug: "news-distribution",
    title: "뉴스 기사 송출",
    shortTitle: "뉴스 송출",
    category: "언론·웹 제작",
    summary: "브랜드 소식과 서비스 정보를 기사 형식으로 정리하되, 실제 확인 가능한 내용만 기반으로 구성합니다.",
    targetCustomers: ["브랜드 신뢰 자료가 필요한 업체", "신규 오픈이나 서비스 출시 소식을 정리해야 하는 팀", "홈페이지와 검색 결과에 연결할 외부 소개 자료가 필요한 브랜드"],
    features: ["기사 소재 정리", "확인 가능한 사실 기반 원고 구성", "표현 리스크 점검", "송출 후 활용 링크 정리"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Newspaper,
  },
  {
    slug: "website-production",
    title: "홈페이지 제작",
    shortTitle: "홈페이지",
    category: "언론·웹 제작",
    summary: "상담과 문의로 이어지는 기본 홈페이지 구조를 만들고 서비스, 위치, 문의 정보를 명확하게 배치합니다.",
    targetCustomers: ["검색 후 보여줄 공식 페이지가 필요한 업체", "기존 홈페이지의 문의 동선이 약한 브랜드", "서비스 소개와 상담 접수를 한곳에 정리하고 싶은 팀"],
    features: ["페이지 구조 기획", "서비스 소개 섹션 구성", "문의 CTA와 폼 동선 설계", "기본 SEO와 메타 정보 정리"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: MonitorSmartphone,
  },
  {
    slug: "daangn-viral",
    title: "당근마켓 바이럴",
    shortTitle: "당근마켓",
    category: "로컬·예약 플랫폼",
    summary: "동네 기반 고객에게 매장 소식과 혜택을 알릴 수 있는 콘텐츠 방향과 운영 범위를 점검합니다.",
    targetCustomers: ["상권 반경 안의 생활 고객에게 알려야 하는 매장", "동네 기반 이벤트나 소식을 운영하려는 업체", "지역 커뮤니티성 채널의 표현 기준이 필요한 브랜드"],
    features: ["지역 고객 관점 메시지 정리", "소식과 이벤트 소재 기획", "운영 정책 확인", "문의와 방문 동선 점검"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Users,
  },
  {
    slug: "catchtable-review",
    title: "캐치테이블 리뷰",
    shortTitle: "캐치테이블",
    category: "로컬·예약 플랫폼",
    summary: "예약 플랫폼에서 실제 방문 경험이 자연스럽게 기록될 수 있도록 리뷰 요청 동선과 응대 기준을 정리합니다.",
    targetCustomers: ["예약 플랫폼을 운영하지만 리뷰 흐름이 정리되지 않은 매장", "방문 후 고객 응대와 요청 문구 기준이 필요한 업체", "플랫폼 내 매장 정보와 리뷰 경험을 함께 점검하려는 브랜드"],
    features: ["예약 플랫폼 정보 점검", "실제 방문 고객 대상 리뷰 요청 동선 정리", "응대 문구와 운영 기준 수립", "정책 준수 범위 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: MessageSquareText,
  },
  {
    slug: "foodstagram-200k",
    title: "20만 먹스타그램",
    shortTitle: "먹스타그램",
    category: "로컬·예약 플랫폼",
    summary: "먹스타그램 성격의 인스타그램 채널 협업이 필요한 경우, 콘텐츠 소재와 방문 동선을 상담 후 검토합니다.",
    targetCustomers: ["음식 사진과 방문 경험을 시각적으로 보여줘야 하는 매장", "인스타그램 기반 발견 접점이 필요한 외식업체", "협업 전 콘텐츠 기준과 노출 후 동선을 정리하고 싶은 브랜드"],
    features: ["콘텐츠 소재와 촬영 포인트 정리", "협업 가능 범위 상담", "방문 전환 CTA 점검", "플레이스와 인스타그램 연결 흐름 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Instagram,
  },
  {
    slug: "naver-place-reward-traffic",
    title: "네이버 플레이스 리워드 트래픽",
    shortTitle: "리워드 트래픽",
    category: "네이버 플레이스",
    summary: "네이버 플레이스 유입을 늘리기 전, 정책과 실제 방문 전환 흐름을 함께 검토해 실행 범위를 정합니다.",
    targetCustomers: ["플레이스 유입 구조를 점검하고 싶은 업체", "방문 전환과 연결되는 캠페인 기준이 필요한 매장", "정책 리스크 없이 가능한 범위를 먼저 확인하고 싶은 브랜드"],
    features: ["플레이스 현재 상태 점검", "유입 후 전화·예약·길찾기 동선 확인", "캠페인 운영 기준 정리", "정책 준수 범위 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Store,
  },
  {
    slug: "naver-place-receipt-review",
    title: "네이버 플레이스 영수증 리뷰",
    shortTitle: "영수증 리뷰",
    category: "네이버 플레이스",
    summary: "실제 방문 고객의 영수증 리뷰 요청 동선과 매장 응대 기준을 정리해 자연스러운 리뷰 흐름을 만듭니다.",
    targetCustomers: ["실제 방문 고객에게 리뷰 요청 기준을 만들고 싶은 매장", "리뷰 응대와 안내 문구를 정리해야 하는 업체", "리뷰 수보다 리뷰 경험의 품질을 먼저 점검하고 싶은 브랜드"],
    features: ["영수증 리뷰 요청 동선 정리", "매장 내 안내 문구 검토", "리뷰 응대 기준 수립", "허위·과장 표현 방지 기준 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: MessageSquareText,
  },
  {
    slug: "naver-place-blog-review",
    title: "네이버 플레이스 블로그 리뷰",
    shortTitle: "블로그 리뷰",
    category: "네이버 플레이스",
    summary: "플레이스 선택에 도움이 되는 블로그 리뷰 콘텐츠 방향을 잡고, 사실 기반 소개와 방문 동선을 정리합니다.",
    targetCustomers: ["블로그 콘텐츠가 플레이스 신뢰로 이어지길 원하는 업체", "방문 전 고객 질문을 콘텐츠로 풀어야 하는 매장", "검색형 리뷰 콘텐츠의 표현 기준이 필요한 브랜드"],
    features: ["콘텐츠 주제와 키워드 정리", "방문 경험 기반 정보 구조화", "플레이스 연결 동선 점검", "표현 리스크와 정책 기준 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: FileSearch,
  },
  {
    slug: "cafe-viral",
    title: "카페 침투 바이럴",
    shortTitle: "카페 바이럴",
    category: "블로그·커뮤니티",
    summary: "커뮤니티 성격과 운영 정책을 고려해 브랜드가 언급될 수 있는 주제와 참여 범위를 점검합니다.",
    targetCustomers: ["검색 전후로 커뮤니티 언급이 필요한 브랜드", "과장 광고 없이 정보성 접근이 필요한 업체", "지역 또는 관심사 커뮤니티의 표현 기준을 정리해야 하는 팀"],
    features: ["커뮤니티 주제와 적합도 확인", "정보성 콘텐츠 방향 정리", "운영 정책과 표현 리스크 점검", "브랜드 언급 후 문의 동선 확인"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: Users,
  },
  {
    slug: "brand-blog-management",
    title: "브랜드 블로그 대행",
    shortTitle: "브랜드 블로그",
    category: "블로그·커뮤니티",
    summary: "브랜드가 직접 설명해야 할 서비스, 사례, FAQ를 블로그 콘텐츠로 꾸준히 쌓는 운영 구조를 만듭니다.",
    targetCustomers: ["공식 블로그 운영 기준이 필요한 업체", "검색형 콘텐츠를 꾸준히 축적하고 싶은 브랜드", "고객 질문을 콘텐츠로 정리해야 하는 팀"],
    features: ["월간 주제 기획", "검색 키워드와 고객 질문 정리", "브랜드 톤 문구 작성", "발행 후 내부 링크와 CTA 점검"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: PenLine,
  },
  {
    slug: "blog-copywriting",
    title: "블로그 원고 대행",
    shortTitle: "블로그 원고",
    category: "블로그·커뮤니티",
    summary: "검색 의도와 고객 질문을 기준으로 블로그 원고 초안을 작성하고 검수 가능한 구조로 제공합니다.",
    targetCustomers: ["블로그를 운영하지만 원고 작성 시간이 부족한 업체", "전문 서비스 설명을 쉽게 풀어야 하는 브랜드", "검색형 글의 기본 구조가 필요한 팀"],
    features: ["키워드와 독자 질문 정리", "원고 목차 구성", "초안 작성과 검수 반영", "과장 표현과 확인되지 않은 수치 제외"],
    process: defaultProcess,
    faq: commonFaq,
    draft: true,
    icon: FileSearch,
  },
];

export const serviceDetailSlugs = services.map((service) => service.slug);

export const serviceDraftMetadataNote = "상세 콘텐츠 준비 중인 임시 안내 페이지입니다.";

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory) {
  return services.filter((service) => service.category === category);
}

export function getServiceMetadataDescription(service: ServiceDetail) {
  return `${service.title} 서비스 임시 안내입니다. ${service.summary} ${serviceDraftMetadataNote}`;
}

export const serviceGroups = [
  {
    slug: "naver-place",
    title: "네이버 플레이스",
    eyebrow: "가장 먼저 점검할 로컬 전환 지점",
    description:
      "순위만 보는 대신 고객이 플레이스를 열고 전화, 예약, 길찾기까지 이어지는 과정을 함께 점검합니다.",
    icon: Store,
    items: [
      "검색 키워드 분석",
      "대표사진 전략",
      "플레이스 정보 최적화",
      "리뷰 흐름 점검",
      "경쟁업체 분석",
      "이벤트/쿠폰 기획",
    ],
  },
  {
    slug: "local-seo",
    title: "네이버 로컬 SEO",
    eyebrow: "검색 의도와 지역 키워드 정리",
    description:
      "부산·경남 상권에서 실제 고객이 검색하는 지역명, 업종명, 목적형 키워드를 분리해 우선순위를 잡습니다.",
    icon: Search,
    items: [
      "지역 및 서비스 키워드 분류",
      "경쟁 노출 화면 비교",
      "검색 결과 내 클릭 요소 점검",
      "상권별 콘텐츠 방향 설계",
    ],
  },
  {
    slug: "blog-marketing",
    title: "블로그 마케팅",
    eyebrow: "검색에서 신뢰로 이어지는 콘텐츠",
    description:
      "단순 후기형 글을 늘리는 방식이 아니라, 고객이 방문 전 확인하는 질문과 불안을 콘텐츠로 해소합니다.",
    icon: FileSearch,
    items: [
      "키워드 분석",
      "검색 노출 콘텐츠",
      "후기형 콘텐츠",
      "전환형 콘텐츠",
      "월간 콘텐츠 기획",
    ],
  },
  {
    slug: "short-form",
    title: "숏폼 콘텐츠",
    eyebrow: "검색 전후의 발견 채널",
    description:
      "네이버 클립, Reels, Shorts에서 매장 분위기와 이용 장면이 자연스럽게 전달되도록 촬영 방향을 설계합니다.",
    icon: Clapperboard,
    items: ["네이버 클립", "Instagram Reels", "Shorts", "촬영 콘셉트", "콘텐츠 흐름 설계"],
  },
  {
    slug: "china-tourist",
    title: "중국 관광객 마케팅",
    eyebrow: "저장과 방문을 고려한 정보 설계",
    description:
      "샤오홍슈 등 중국 소비자의 검색·저장 행동을 고려해 관광객이 매장을 이해할 수 있는 콘텐츠 구조를 잡습니다.",
    icon: Globe2,
    items: ["샤오홍슈", "저장형 콘텐츠", "중국 소비자 관점 정보", "관광 동선 고려"],
  },
  {
    slug: "conversion",
    title: "전환 최적화",
    eyebrow: "노출 이후의 손실 줄이기",
    description:
      "검색은 되는데 예약이 없다면 사진, 리뷰, 메뉴, 전화·예약 동선에서 이탈이 생기는지 먼저 봐야 합니다.",
    icon: BarChart3,
    items: ["전화/예약 동선", "대표사진 첫인상", "리뷰 메시지", "메뉴 구성", "문의 장벽 점검"],
  },
];

export const auditItems = [
  {
    title: "검색",
    icon: Search,
    items: ["지역 및 서비스 키워드", "검색 노출 상태", "경쟁 화면 내 위치"],
  },
  {
    title: "대표사진",
    icon: Camera,
    items: ["첫인상", "클릭 유도 요소", "경쟁업체와 차별성"],
  },
  {
    title: "플레이스 정보",
    icon: Store,
    items: ["메뉴", "소개", "카테고리", "편의정보", "전화/예약 동선"],
  },
  {
    title: "리뷰",
    icon: MessageSquareText,
    items: ["최근 리뷰 흐름", "자주 언급되는 장점", "불만 요소"],
  },
  {
    title: "경쟁업체",
    icon: FileSearch,
    items: ["주변 경쟁업체", "콘텐츠 차이", "리뷰 차이"],
  },
  {
    title: "전환",
    icon: BarChart3,
    items: ["전화", "예약", "길찾기", "문의"],
  },
];

export const processSteps = [
  {
    step: "01",
    title: "현황 분석",
    description: "현재 플레이스 정보, 사진, 리뷰, 문의 동선을 먼저 확인합니다.",
  },
  {
    step: "02",
    title: "경쟁업체 분석",
    description: "같은 지역에서 고객이 함께 비교하는 매장의 노출과 표현 방식을 봅니다.",
  },
  {
    step: "03",
    title: "검색 키워드 분석",
    description: "업종명, 지역명, 목적형 키워드를 분리해 우선순위를 정리합니다.",
  },
  {
    step: "04",
    title: "마케팅 전략 설계",
    description: "노출, 클릭, 신뢰, 문의, 방문 단계별로 필요한 개선안을 잡습니다.",
  },
  {
    step: "05",
    title: "콘텐츠 및 플레이스 개선",
    description: "대표사진, 소개, 메뉴, 리뷰 흐름, 콘텐츠 소재를 실행 가능한 단위로 개선합니다.",
  },
  {
    step: "06",
    title: "데이터 확인",
    description: "전화, 예약, 길찾기, 문의 변화와 검색 화면 변화를 함께 확인합니다.",
  },
  {
    step: "07",
    title: "개선",
    description: "한 번의 세팅으로 끝내지 않고 고객 반응을 보며 다음 작업을 조정합니다.",
  },
];
