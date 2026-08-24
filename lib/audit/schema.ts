import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL은 500자 이내로 입력해주세요.")
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || value.startsWith("http"), "http로 시작하는 URL을 입력해주세요.");

const shortText = (label: string, max = 120) =>
  z.string().trim().min(1, `${label}을 입력해주세요.`).max(max, `${label}은 ${max}자 이내로 입력해주세요.`);

const optionalShortText = z.string().trim().max(160, "160자 이내로 입력해주세요.").optional().or(z.literal(""));

const readiness = z.enum(["ready", "partial", "missing"]);
const binary = z.enum(["yes", "no", "unknown"]);
const activity = z.enum(["active", "irregular", "none"]);

export const placeAuditInputSchema = z.object({
  businessName: shortText("업체명", 80),
  industry: shortText("업종", 80),
  region: shortText("지역", 80),
  placeUrl: optionalUrl,
  representativePhotoStatus: readiness,
  menuInfoStatus: readiness,
  introStatus: readiness,
  photoContentStatus: readiness,
  reviewCountRange: z.enum(["unknown", "none", "under_10", "10_50", "over_50"]),
  recentReviewStatus: z.enum(["unknown", "recent", "old", "none"]),
  reviewReplyStatus: z.enum(["active", "partial", "none", "unknown"]),
  phoneEnabled: binary,
  reservationEnabled: binary,
  directionsReady: binary,
  inquiryEnabled: binary,
  couponEventStatus: z.enum(["active", "planned", "none", "unknown"]),
  primaryKeywords: optionalShortText,
  blogStatus: activity,
  shortFormStatus: activity,
  snsStatus: activity,
  competitorPrepared: binary,
});

export type PlaceAuditInput = z.infer<typeof placeAuditInputSchema>;
