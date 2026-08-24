import type { NaverPlaceData, PlaceAnalysisArea, PlaceAnalysisFinding, PlaceAnalysisResult } from "@/lib/naver-place/types";

type ScoreCheck = {
  label: string;
  area: PlaceAnalysisArea;
  available: boolean;
  earned: number;
  max: number;
  evidence: string;
  unavailableLabel: string;
};

const areaLabels: Record<PlaceAnalysisArea, string> = {
  basic: "기본 정보 완성도",
  conversion: "방문 전환 동선",
  content: "콘텐츠 경쟁력",
  review: "리뷰 활동성",
};

function displayValue(value: string | number | boolean | null | undefined, fallback = "확인 불가") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "boolean") return value ? "확인됨" : "확인 안 됨";
  if (typeof value === "number") return value.toLocaleString("ko-KR");
  return value;
}

function daysSince(value: string | null) {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return Math.max(0, Math.floor((Date.now() - time) / 86_400_000));
}

function gradeFromScore(score: number | null): PlaceAnalysisResult["grade"] {
  if (score === null) return "진단 제한";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

function statusFromRate(rate: number) {
  if (rate >= 0.8) return "good" as const;
  if (rate >= 0.55) return "needs_improvement" as const;
  return "priority" as const;
}

function reviewRecencyEvidence(place: NaverPlaceData) {
  const days = daysSince(place.reviews.latestReviewDate);
  if (days === null) return null;
  if (days <= 7) return { earned: 8, evidence: `최근 리뷰 ${days}일 전 확인` };
  if (days <= 30) return { earned: 5, evidence: `최근 리뷰 ${days}일 전 확인` };
  return { earned: 2, evidence: `최근 리뷰 ${days}일 전 확인` };
}

function createChecks(place: NaverPlaceData): ScoreCheck[] {
  const descriptionLength = place.description.length;
  const imageCount = place.images.count;
  const menuCount = place.menu.count;
  const visitorReviewCount = place.reviews.visitorCount;
  const blogReviewCount = place.reviews.blogCount;
  const reviewRecency = reviewRecencyEvidence(place);

  return [
    {
      label: "주소",
      area: "basic",
      available: Boolean(place.address || place.roadAddress),
      earned: place.address || place.roadAddress ? 5 : 0,
      max: 5,
      evidence: `주소 ${displayValue(place.roadAddress || place.address)}`,
      unavailableLabel: "주소",
    },
    {
      label: "전화번호",
      area: "basic",
      available: place.phone !== null,
      earned: place.phone ? 5 : 0,
      max: 5,
      evidence: `전화번호 ${place.phone ? "등록됨" : "확인 불가"}`,
      unavailableLabel: "전화번호",
    },
    {
      label: "영업시간",
      area: "basic",
      available: place.businessHours.available,
      earned: place.businessHours.available ? 5 : 0,
      max: 5,
      evidence: `영업시간 ${displayValue(place.businessHours.text)}`,
      unavailableLabel: "영업시간",
    },
    {
      label: "업체 소개",
      area: "basic",
      available: descriptionLength !== null,
      earned: descriptionLength && descriptionLength >= 80 ? 5 : descriptionLength && descriptionLength >= 30 ? 3 : 1,
      max: 5,
      evidence: descriptionLength !== null ? `소개글 ${descriptionLength}자 확인` : "소개글 확인 불가",
      unavailableLabel: "업체 소개",
    },
    {
      label: "메뉴 정보",
      area: "basic",
      available: place.menu.exists !== null,
      earned: menuCount && menuCount >= 5 ? 5 : menuCount && menuCount > 0 ? 3 : 0,
      max: 5,
      evidence: menuCount !== null ? `메뉴 ${menuCount}개 확인` : "메뉴 확인 불가",
      unavailableLabel: "메뉴 정보",
    },
    {
      label: "전화 버튼",
      area: "conversion",
      available: place.conversion.phone !== null,
      earned: place.conversion.phone ? 6 : 0,
      max: 6,
      evidence: `전화 ${place.conversion.phone ? "사용 가능" : "확인 불가"}`,
      unavailableLabel: "전화 버튼",
    },
    {
      label: "예약",
      area: "conversion",
      available: place.conversion.booking !== null,
      earned: place.conversion.booking ? 5 : 0,
      max: 5,
      evidence: `예약 ${place.conversion.booking ? "사용 가능" : "확인 안 됨"}`,
      unavailableLabel: "예약",
    },
    {
      label: "주문",
      area: "conversion",
      available: place.conversion.order !== null,
      earned: place.conversion.order ? 4 : 0,
      max: 4,
      evidence: `주문 ${place.conversion.order ? "사용 가능" : "확인 안 됨"}`,
      unavailableLabel: "주문",
    },
    {
      label: "길찾기",
      area: "conversion",
      available: place.conversion.directions !== null,
      earned: place.conversion.directions ? 5 : 0,
      max: 5,
      evidence: `길찾기 ${place.conversion.directions ? "가능" : "확인 불가"}`,
      unavailableLabel: "길찾기",
    },
    {
      label: "대표 이미지",
      area: "content",
      available: place.images.representativeExists !== null,
      earned: place.images.representativeExists ? 7 : 0,
      max: 7,
      evidence: `대표 이미지 ${place.images.representativeExists ? "확인됨" : "확인 불가"}`,
      unavailableLabel: "대표 이미지",
    },
    {
      label: "사진 수",
      area: "content",
      available: imageCount !== null,
      earned: imageCount && imageCount >= 10 ? 8 : imageCount && imageCount >= 4 ? 5 : imageCount && imageCount > 0 ? 2 : 0,
      max: 8,
      evidence: imageCount !== null ? `이미지 ${imageCount}개 확인` : "이미지 수 확인 불가",
      unavailableLabel: "사진 수",
    },
    {
      label: "메뉴 콘텐츠",
      area: "content",
      available: place.menu.exists !== null,
      earned: menuCount && menuCount >= 5 ? 6 : menuCount && menuCount > 0 ? 3 : 0,
      max: 6,
      evidence: menuCount !== null ? `메뉴 ${menuCount}개 확인` : "메뉴 콘텐츠 확인 불가",
      unavailableLabel: "메뉴 콘텐츠",
    },
    {
      label: "소개글 길이",
      area: "content",
      available: descriptionLength !== null,
      earned: descriptionLength && descriptionLength >= 80 ? 4 : descriptionLength && descriptionLength >= 30 ? 2 : 0,
      max: 4,
      evidence: descriptionLength !== null ? `소개글 ${descriptionLength}자 확인` : "소개글 확인 불가",
      unavailableLabel: "소개글 길이",
    },
    {
      label: "방문자 리뷰",
      area: "review",
      available: visitorReviewCount !== null,
      earned: visitorReviewCount && visitorReviewCount >= 100 ? 8 : visitorReviewCount && visitorReviewCount >= 20 ? 5 : visitorReviewCount && visitorReviewCount > 0 ? 2 : 0,
      max: 8,
      evidence: visitorReviewCount !== null ? `방문자 리뷰 ${visitorReviewCount.toLocaleString("ko-KR")}개 확인` : "방문자 리뷰 확인 불가",
      unavailableLabel: "방문자 리뷰",
    },
    {
      label: "블로그 리뷰",
      area: "review",
      available: blogReviewCount !== null,
      earned: blogReviewCount && blogReviewCount >= 30 ? 6 : blogReviewCount && blogReviewCount >= 5 ? 3 : blogReviewCount && blogReviewCount > 0 ? 1 : 0,
      max: 6,
      evidence: blogReviewCount !== null ? `블로그 리뷰 ${blogReviewCount.toLocaleString("ko-KR")}개 확인` : "블로그 리뷰 확인 불가",
      unavailableLabel: "블로그 리뷰",
    },
    {
      label: "평점",
      area: "review",
      available: place.reviews.rating !== null,
      earned: place.reviews.rating && place.reviews.rating >= 4.5 ? 6 : place.reviews.rating && place.reviews.rating >= 4 ? 4 : place.reviews.rating ? 2 : 0,
      max: 6,
      evidence: place.reviews.rating !== null ? `평점 ${place.reviews.rating} 확인` : "평점 확인 불가",
      unavailableLabel: "평점",
    },
    {
      label: "최근 리뷰",
      area: "review",
      available: reviewRecency !== null,
      earned: reviewRecency?.earned || 0,
      max: 8,
      evidence: reviewRecency?.evidence || "최근 리뷰 확인 불가",
      unavailableLabel: "최근 리뷰",
    },
  ];
}

function makeFinding(area: PlaceAnalysisArea, checks: ScoreCheck[]): PlaceAnalysisFinding | null {
  const availableChecks = checks.filter((check) => check.available);
  if (!availableChecks.length) return null;

  const earned = availableChecks.reduce((sum, check) => sum + check.earned, 0);
  const max = availableChecks.reduce((sum, check) => sum + check.max, 0);
  const rate = max ? earned / max : 0;
  const weakChecks = availableChecks
    .filter((check) => check.earned / check.max < 0.7)
    .sort((a, b) => a.earned / a.max - b.earned / b.max);
  const strongestChecks = availableChecks
    .filter((check) => check.earned / check.max >= 0.8)
    .sort((a, b) => b.earned / b.max - a.earned / a.max);
  const target = weakChecks[0] || strongestChecks[0] || availableChecks[0];
  const label = areaLabels[area];
  const percent = Math.round(rate * 100);

  return {
    area,
    label,
    status: statusFromRate(rate),
    summary:
      weakChecks.length > 0
        ? `${target.label} 항목을 먼저 보완하는 것이 좋습니다.`
        : `${label}에서 확인 가능한 주요 항목이 비교적 잘 갖춰져 있습니다.`,
    explanation: `${label}은 실제 네이버 플레이스 공개 정보 중 확인 가능한 ${availableChecks.length}개 항목으로 계산했습니다. 현재 이 영역은 ${earned}/${max}점, 환산 ${percent}%입니다.`,
    recommendation:
      weakChecks.length > 0
        ? `${target.evidence}. 이 항목이 고객의 검색 후 행동에 영향을 줄 수 있으니 실제 운영 상태와 맞게 정리하세요.`
        : `${target.evidence}. 현재 상태를 유지하면서 상세 화면의 최신성만 주기적으로 확인하세요.`,
    evidence: availableChecks.map((check) => check.evidence).join(" · "),
    score: { earned, max },
  };
}

export function analyzePlace(place: NaverPlaceData): PlaceAnalysisResult {
  const checks = createChecks(place);
  const availableChecks = checks.filter((check) => check.available);
  const unavailableChecks = checks
    .filter((check) => !check.available)
    .map((check) => `${areaLabels[check.area]}: ${check.unavailableLabel}`);
  const earnedScore = availableChecks.reduce((sum, check) => sum + check.earned, 0);
  const maxScore = availableChecks.reduce((sum, check) => sum + check.max, 0);
  const score = maxScore ? Math.round((earnedScore / maxScore) * 100) : null;
  const findings = (Object.keys(areaLabels) as PlaceAnalysisArea[])
    .map((area) => makeFinding(area, checks.filter((check) => check.area === area)))
    .filter((finding): finding is PlaceAnalysisFinding => Boolean(finding));
  const priorityImprovements = findings
    .filter((finding) => finding.status === "priority")
    .concat(findings.filter((finding) => finding.status === "needs_improvement"))
    .slice(0, 3);
  const positives = findings
    .filter((finding) => finding.status === "good")
    .map((finding) => `${finding.label}: ${finding.summary}`);

  const evidence = [
    { label: "업체명", value: displayValue(place.name), available: place.name !== null },
    { label: "카테고리", value: displayValue(place.category), available: place.category !== null },
    { label: "주소", value: displayValue(place.roadAddress || place.address), available: Boolean(place.roadAddress || place.address) },
    { label: "전화", value: place.phone ? "등록됨" : "확인 불가", available: place.phone !== null },
    { label: "영업시간", value: displayValue(place.businessHours.text), available: place.businessHours.available },
    { label: "소개글", value: place.description.length !== null ? `${place.description.length}자` : "확인 불가", available: place.description.length !== null },
    { label: "대표 이미지", value: place.images.representativeExists ? "등록됨" : "확인 불가", available: place.images.representativeExists !== null },
    { label: "이미지 수", value: place.images.count !== null ? `${place.images.count.toLocaleString("ko-KR")}개` : "확인 불가", available: place.images.count !== null },
    { label: "메뉴", value: place.menu.count !== null ? `${place.menu.count.toLocaleString("ko-KR")}개` : "확인 불가", available: place.menu.count !== null },
    { label: "방문자 리뷰", value: place.reviews.visitorCount !== null ? `${place.reviews.visitorCount.toLocaleString("ko-KR")}개` : "확인 불가", available: place.reviews.visitorCount !== null },
    { label: "블로그 리뷰", value: place.reviews.blogCount !== null ? `${place.reviews.blogCount.toLocaleString("ko-KR")}개` : "확인 불가", available: place.reviews.blogCount !== null },
    { label: "평점", value: displayValue(place.reviews.rating), available: place.reviews.rating !== null },
    { label: "최근 리뷰", value: daysSince(place.reviews.latestReviewDate) !== null ? `${daysSince(place.reviews.latestReviewDate)}일 전` : "확인 불가", available: place.reviews.latestReviewDate !== null },
    { label: "예약", value: place.conversion.booking === true ? "사용 가능" : place.conversion.booking === false ? "확인 안 됨" : "확인 불가", available: place.conversion.booking !== null },
    { label: "주문", value: place.conversion.order === true ? "사용 가능" : place.conversion.order === false ? "확인 안 됨" : "확인 불가", available: place.conversion.order !== null },
  ];

  return {
    mode: "naver_place_url",
    score,
    grade: gradeFromScore(score),
    earnedScore,
    maxScore,
    summary:
      score === null
        ? "네이버 공개 정보에서 평가 가능한 항목이 충분히 확인되지 않았습니다. 확인된 데이터만 기준으로 상세 점검이 필요합니다."
        : `${place.name || "해당 매장"}의 네이버 플레이스 공개 정보를 기준으로 ${score}점(${gradeFromScore(score)})입니다. 확인되지 않은 항목은 점수 계산에서 제외했습니다.`,
    strengths: positives.length ? positives : ["공개 정보에서 강점으로 분류할 수 있는 항목이 아직 충분히 확인되지 않았습니다."],
    improvements: priorityImprovements,
    unavailableChecks,
    evidence,
    dataSourceLabel: "네이버 플레이스 공개 정보",
    fetchedAt: place.fetchedAt,
    place,
    positives: positives.length ? positives : ["확인 가능한 데이터가 제한되어 강점은 상담 단계에서 추가 확인이 필요합니다."],
    priorityImprovements,
    additionalChecks: [
      "네이버에서 일부 정보를 확인할 수 없어 해당 항목은 점수 계산에서 제외되었습니다.",
      "수집 결과는 공개 페이지에서 확인된 값만 사용하며, 로그인·캡TCHA·비공개 데이터는 수집하지 않습니다.",
      "검색 순위, 경쟁업체 데이터, 매출 가능성은 자동으로 추정하지 않습니다.",
    ],
    recommendedServices: [
      { slug: "naver-place-reward-traffic", title: "네이버 플레이스 리워드 트래픽", reason: "플레이스 유입 후 전화·예약·길찾기 동선을 함께 점검할 수 있습니다." },
      { slug: "naver-place-receipt-review", title: "네이버 플레이스 영수증 리뷰", reason: "정책을 지키는 실제 방문 고객 리뷰 참여 동선을 정리할 수 있습니다." },
      { slug: "naver-place-blog-review", title: "네이버 플레이스 블로그 리뷰", reason: "검색 후 비교 단계에서 필요한 정보성 콘텐츠를 준비할 수 있습니다." },
    ],
    findings,
  };
}
