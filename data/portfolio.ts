export type PortfolioCase = {
  slug: string;
  client: string;
  industry: string;
  location: string;
  summary: string;
  challenge: string;
  strategy: string[];
  execution: string[];
  result: string;
  status: "placeholder" | "ready";
};

export const portfolioCases: PortfolioCase[] = [
  {
    slug: "busan-restaurant-a",
    client: "부산 음식점 A",
    industry: "음식점",
    location: "부산",
    summary:
      "검색 화면에서 경쟁 매장과 함께 비교될 때 대표사진과 메뉴 정보가 충분히 설득하는지 점검하는 사례 형식입니다.",
    challenge:
      "점심·저녁 검색 수요는 있지만 플레이스 첫 화면에서 매장 분위기와 대표 메뉴가 분명하게 보이지 않는 상황을 가정했습니다.",
    strategy: [
      "지역명+메뉴 키워드 기준으로 검색 화면 비교",
      "대표사진 첫 5장의 역할 재정의",
      "고객이 방문 전에 확인하는 메뉴·가격·주차 정보 정리",
    ],
    execution: [
      "플레이스 정보 구조 점검",
      "사진 구성 가이드 작성",
      "블로그 콘텐츠 주제 후보 정리",
    ],
    result: "실제 사례 입력 예정. 현재는 데이터 준비 중인 예시 구조입니다.",
    status: "placeholder",
  },
  {
    slug: "busan-clinic-a",
    client: "부산 병원 A",
    industry: "병원·의원",
    location: "부산",
    summary:
      "의료 업종에서 과장 없이 진료 정보와 신뢰 요소를 정리하는 컨설팅 흐름을 보여주는 placeholder입니다.",
    challenge:
      "검색은 되지만 진료 과목, 위치, 예약 전 확인 정보가 흩어져 문의 전환이 약한 상황을 가정했습니다.",
    strategy: [
      "진료 키워드와 지역 키워드 분리",
      "의료 광고 표현 리스크를 고려한 문구 점검",
      "예약 전 불안을 줄이는 정보 배치",
    ],
    execution: [
      "플레이스 소개 문장 재구성 방향 제안",
      "사진 카테고리별 우선순위 정리",
      "FAQ형 콘텐츠 소재 도출",
    ],
    result: "실제 사례 입력 예정. 의료광고 관련 세부 검토는 후속 단계에서 별도 진행합니다.",
    status: "placeholder",
  },
  {
    slug: "gyeongnam-cafe-a",
    client: "경남 카페 A",
    industry: "카페",
    location: "경남",
    summary:
      "저장하고 찾아가는 목적형 방문을 만들기 위해 사진, 리뷰, 숏폼 소재를 함께 점검하는 사례 구조입니다.",
    challenge:
      "리뷰는 있지만 신규 고객이 매장을 선택해야 하는 이유가 사진과 콘텐츠에서 충분히 보이지 않는 상황을 가정했습니다.",
    strategy: [
      "공간·메뉴·동선 사진의 역할 분리",
      "리뷰에서 반복되는 긍정 키워드 추출",
      "네이버 클립과 Reels용 짧은 소재 기획",
    ],
    execution: [
      "대표사진 구성안 작성",
      "저장형 콘텐츠 주제 정리",
      "주변 경쟁 카페의 노출 요소 비교",
    ],
    result: "실제 사례 입력 예정. 수치 성과는 확인된 데이터가 생긴 뒤 반영합니다.",
    status: "placeholder",
  },
];

export function getPortfolioCase(slug: string) {
  return portfolioCases.find((item) => item.slug === slug);
}
