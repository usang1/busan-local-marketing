import {
  BarChart3,
  Camera,
  Clapperboard,
  FileSearch,
  Globe2,
  MessageSquareText,
  Search,
  Store,
} from "lucide-react";

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
