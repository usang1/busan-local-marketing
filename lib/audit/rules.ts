import type { PlaceAuditInput } from "@/lib/audit/schema";

export type AuditStatus = "good" | "needs_improvement" | "priority";
export type AuditArea = "basic" | "content" | "review" | "conversion" | "marketing";

export type AuditFinding = {
  area: AuditArea;
  label: string;
  status: AuditStatus;
  summary: string;
  explanation: string;
  recommendation: string;
};

export type AuditResult = {
  summary: string;
  positives: string[];
  priorityImprovements: AuditFinding[];
  additionalChecks: string[];
  recommendedServices: { slug: string; title: string; reason: string }[];
  findings: AuditFinding[];
};

function statusLabel(status: AuditStatus) {
  return status === "good" ? "양호" : status === "needs_improvement" ? "개선 필요" : "우선 개선";
}

function finding(
  area: AuditArea,
  label: string,
  status: AuditStatus,
  summary: string,
  explanation: string,
  recommendation: string,
): AuditFinding {
  return { area, label, status, summary, explanation, recommendation };
}

function hasPlaceUrl(input: PlaceAuditInput) {
  return Boolean(input.placeUrl?.trim());
}

export function runPlaceAudit(input: PlaceAuditInput): AuditResult {
  const findings: AuditFinding[] = [
    finding(
      "basic",
      "플레이스 기본 연결",
      hasPlaceUrl(input) ? "good" : "priority",
      hasPlaceUrl(input) ? "플레이스 URL을 기준으로 상담 전 확인이 가능합니다." : "플레이스 URL이 없어 상담 전 화면 확인이 제한됩니다.",
      hasPlaceUrl(input)
        ? "URL이 있으면 담당자가 실제 화면을 열어 기본정보와 전환 동선을 빠르게 확인할 수 있습니다."
        : "자동진단은 사용자가 입력한 정보만 분석합니다. URL이 없으면 실제 플레이스 화면, 사진, 메뉴, 리뷰 상태를 직접 확인할 수 없습니다.",
      hasPlaceUrl(input) ? "상담 전 현재 URL이 최신인지 확인하세요." : "네이버 플레이스 URL을 준비해 상세 진단에서 함께 전달하세요.",
    ),
    finding(
      "content",
      "대표사진",
      input.representativePhotoStatus === "ready" ? "good" : input.representativePhotoStatus === "partial" ? "needs_improvement" : "priority",
      input.representativePhotoStatus === "ready" ? "대표사진이 준비되어 있습니다." : "대표사진 영역을 먼저 점검할 필요가 있습니다.",
      "검색 결과에서 매장을 처음 접하는 고객은 메뉴나 상세 설명보다 사진을 먼저 확인하는 경우가 많습니다. 어떤 장면을 첫인상으로 보여줄지 기준을 정하는 것이 좋습니다.",
      "음식, 시술, 공간, 대표 서비스 중 고객이 가장 빨리 이해할 이미지를 우선 배치하세요.",
    ),
    finding(
      "content",
      "메뉴/서비스 정보",
      input.menuInfoStatus === "ready" ? "good" : input.menuInfoStatus === "partial" ? "needs_improvement" : "priority",
      input.menuInfoStatus === "ready" ? "메뉴 또는 서비스 정보가 준비되어 있습니다." : "방문 전 확인할 메뉴/서비스 정보가 부족할 수 있습니다.",
      "고객은 방문 전에 가격대, 대표 메뉴, 제공 서비스를 확인하려고 합니다. 이 정보가 부족하면 전화나 예약 전에 이탈할 가능성이 있습니다.",
      "대표 메뉴, 서비스 범위, 가격 안내 가능 여부를 정리하세요.",
    ),
    finding(
      "content",
      "소개문구",
      input.introStatus === "ready" ? "good" : input.introStatus === "partial" ? "needs_improvement" : "priority",
      input.introStatus === "ready" ? "매장 소개문구가 준비되어 있습니다." : "소개문구가 고객 선택 기준을 충분히 설명하지 못할 수 있습니다.",
      "소개문구는 검색 키워드만 나열하는 영역이 아니라, 고객이 왜 이 매장을 선택해야 하는지 짧게 확인하는 영역입니다.",
      "업종, 위치, 대표 강점, 예약/방문 전 확인사항을 짧게 정리하세요.",
    ),
    finding(
      "review",
      "최근 리뷰 흐름",
      input.recentReviewStatus === "recent" ? "good" : input.recentReviewStatus === "old" ? "needs_improvement" : "priority",
      input.recentReviewStatus === "recent" ? "최근 리뷰 흐름이 있는 것으로 입력되었습니다." : "최근 리뷰 흐름을 추가 확인해야 합니다.",
      "리뷰는 단순한 숫자보다 최근 방문자가 어떤 경험을 했는지 보여주는 신뢰 신호입니다. 다만 이 진단은 사용자가 입력한 상태만 기준으로 판단합니다.",
      "실제 방문 고객에게 정책을 지키는 방식으로 리뷰 요청 동선을 정리하세요.",
    ),
    finding(
      "conversion",
      "전화/예약/길찾기 동선",
      input.phoneEnabled === "yes" && input.reservationEnabled !== "no" && input.directionsReady === "yes" ? "good" : "priority",
      "고객 전환 버튼 상태를 점검했습니다.",
      "검색 후 고객이 행동하는 버튼은 전화, 예약, 길찾기입니다. 하나라도 불명확하면 관심이 있어도 실제 방문으로 이어지기 어렵습니다.",
      "전화번호, 예약 가능 여부, 길찾기 정보가 현재 운영 방식과 맞는지 확인하세요.",
    ),
    finding(
      "marketing",
      "키워드와 외부 콘텐츠",
      input.primaryKeywords || input.blogStatus !== "none" || input.shortFormStatus !== "none" || input.snsStatus !== "none"
        ? "needs_improvement"
        : "priority",
      input.primaryKeywords ? "대표 키워드가 입력되었습니다." : "대표 키워드와 외부 콘텐츠 기준이 필요합니다.",
      "플레이스는 단독으로만 작동하지 않습니다. 블로그, SNS, 숏폼에서 고객 질문을 풀어주면 검색 후 비교 과정에서 도움이 됩니다.",
      "지역명, 업종명, 대표 메뉴/서비스를 기준으로 콘텐츠 주제를 정리하세요.",
    ),
  ];

  const positives = findings
    .filter((item) => item.status === "good")
    .map((item) => `${item.label}: ${item.summary}`)
    .slice(0, 4);
  const priorityImprovements = findings
    .filter((item) => item.status === "priority")
    .concat(findings.filter((item) => item.status === "needs_improvement"))
    .slice(0, 3);
  const additionalChecks = [
    "실제 네이버 플레이스 화면의 카테고리, 운영시간, 휴무일이 최신인지 확인해야 합니다.",
    "사진의 품질과 순서는 실제 화면을 보며 추가 점검해야 합니다.",
    "리뷰 수와 리뷰 내용은 사용자가 입력한 상태만 기준으로 보며, 실제 리뷰 데이터는 자동 수집하지 않습니다.",
    "경쟁업체 비교는 사용자가 제공한 매장명 또는 URL이 있을 때만 상담 단계에서 확인합니다.",
  ];

  return {
    summary: `${input.region} ${input.industry} 플레이스는 ${priorityImprovements.length ? statusLabel(priorityImprovements[0].status) : "양호"} 항목을 중심으로 먼저 점검하는 것이 좋습니다.`,
    positives: positives.length ? positives : ["입력된 정보를 기준으로 상담 전 확인할 기본 자료가 정리되었습니다."],
    priorityImprovements,
    additionalChecks,
    recommendedServices: [
      { slug: "naver-place-reward-traffic", title: "네이버 플레이스 리워드 트래픽", reason: "플레이스 유입 전환 동선을 함께 점검할 수 있습니다." },
      { slug: "naver-place-receipt-review", title: "네이버 플레이스 영수증 리뷰", reason: "실제 방문 고객 기반 리뷰 요청 흐름을 정리할 수 있습니다." },
      { slug: "naver-place-blog-review", title: "네이버 플레이스 블로그 리뷰", reason: "검색 후 비교 단계에서 필요한 정보성 콘텐츠를 준비할 수 있습니다." },
    ],
    findings,
  };
}
