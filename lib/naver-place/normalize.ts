import type { NaverPlaceData } from "@/lib/naver-place/types";

export function emptyPlaceData({
  placeId,
  sourceUrl,
  normalizedUrl,
  fetchedAt = new Date().toISOString(),
  dataStatus = "partial",
  failureReason = null,
  warnings = [],
}: {
  placeId: string;
  sourceUrl: string;
  normalizedUrl: string;
  fetchedAt?: string;
  dataStatus?: NaverPlaceData["dataStatus"];
  failureReason?: string | null;
  warnings?: string[];
}): NaverPlaceData {
  return {
    placeId,
    sourceUrl,
    normalizedUrl,
    dataStatus,
    failureReason,
    name: null,
    category: null,
    address: null,
    roadAddress: null,
    phone: null,
    businessHours: {
      available: false,
      text: null,
      openNow: null,
    },
    conversion: {
      phone: null,
      booking: null,
      order: null,
      directions: null,
    },
    description: {
      exists: false,
      length: null,
      text: null,
    },
    images: {
      representativeExists: null,
      count: null,
    },
    menu: {
      exists: null,
      count: null,
      items: [],
    },
    reviews: {
      visitorCount: null,
      blogCount: null,
      rating: null,
      latestReviewDate: null,
      last7DaysCount: null,
      last30DaysCount: null,
    },
    fetchedAt,
    availability: {
      reviews: false,
      images: false,
      menu: false,
      businessHours: false,
    },
    warnings,
  };
}

export function firstText(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.replace(/\s+/g, " ").trim();
    if (trimmed) return trimmed;
  }
  return null;
}

export function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[,개건\s]/g, "");
  if (!normalized || Number.isNaN(Number(normalized))) return null;
  return Number(normalized);
}

export function safeDateString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const iso = new Date(trimmed);
  if (!Number.isNaN(iso.getTime())) return iso.toISOString();

  const match = trimmed.match(/(20\d{2})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
