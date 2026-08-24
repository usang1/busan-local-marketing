export type PlaceDataAvailability = {
  reviews: boolean;
  images: boolean;
  menu: boolean;
  businessHours: boolean;
};

export type NaverPlaceData = {
  placeId: string;
  sourceUrl: string;
  normalizedUrl: string;
  name: string | null;
  category: string | null;
  address: string | null;
  roadAddress: string | null;
  phone: string | null;
  businessHours: {
    available: boolean;
    text: string | null;
    openNow: boolean | null;
  };
  conversion: {
    phone: boolean | null;
    booking: boolean | null;
    order: boolean | null;
    directions: boolean | null;
  };
  description: {
    exists: boolean;
    length: number | null;
    text: string | null;
  };
  images: {
    representativeExists: boolean | null;
    count: number | null;
  };
  menu: {
    exists: boolean | null;
    count: number | null;
    items: Array<{
      name: string;
      price: number | null;
    }>;
  };
  reviews: {
    visitorCount: number | null;
    blogCount: number | null;
    rating: number | null;
    latestReviewDate: string | null;
    last7DaysCount: number | null;
    last30DaysCount: number | null;
  };
  fetchedAt: string;
  availability: PlaceDataAvailability;
  warnings: string[];
};

export type PlaceAnalysisStatus = "good" | "needs_improvement" | "priority";
export type PlaceAnalysisArea = "basic" | "conversion" | "content" | "review";

export type PlaceAnalysisFinding = {
  area: PlaceAnalysisArea;
  label: string;
  status: PlaceAnalysisStatus;
  summary: string;
  explanation: string;
  recommendation: string;
  evidence: string;
  score: {
    earned: number;
    max: number;
  };
};

export type PlaceEvidenceItem = {
  label: string;
  value: string;
  available: boolean;
};

export type PlaceAnalysisResult = {
  mode: "naver_place_url";
  score: number | null;
  grade: "A" | "B" | "C" | "D" | "진단 제한";
  earnedScore: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: PlaceAnalysisFinding[];
  unavailableChecks: string[];
  evidence: PlaceEvidenceItem[];
  dataSourceLabel: string;
  fetchedAt: string;
  place: NaverPlaceData;
  positives: string[];
  priorityImprovements: PlaceAnalysisFinding[];
  additionalChecks: string[];
  recommendedServices: { slug: string; title: string; reason: string }[];
  findings: PlaceAnalysisFinding[];
};

export type PlaceAnalyzeSuccess = {
  success: true;
  id: string;
  stored: boolean;
  cached: boolean;
  place: NaverPlaceData;
  analysis: PlaceAnalysisResult;
};

export type PlaceAnalyzeFailure = {
  success: false;
  code:
    | "INVALID_PLACE_URL"
    | "PLACE_NOT_FOUND"
    | "PLACE_FETCH_FAILED"
    | "RATE_LIMITED"
    | "INTERNAL_ERROR";
  message: string;
};

export type PlaceAnalyzeResponse = PlaceAnalyzeSuccess | PlaceAnalyzeFailure;
