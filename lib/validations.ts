import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(1200, "내용은 1200자 이내로 입력해주세요.")
  .optional()
  .or(z.literal(""));

const optionalShortText = z
  .string()
  .trim()
  .max(120, "120자 이내로 입력해주세요.")
  .optional()
  .or(z.literal(""));

const optionalUrlText = z
  .string()
  .trim()
  .max(500, "URL은 500자 이내로 입력해주세요.")
  .optional()
  .or(z.literal(""));

const phone = z
  .string()
  .trim()
  .min(8, "연락처를 입력해주세요.")
  .max(30, "연락처가 너무 깁니다.")
  .regex(/^[0-9+\-\s().]+$/, "연락처 형식을 확인해주세요.");

export const leadSchema = z.object({
  leadType: z.enum(["free_audit", "consultation"]),
  businessName: z.string().trim().min(1, "업체명을 입력해주세요.").max(80),
  contactName: z.string().trim().min(1, "담당자명을 입력해주세요.").max(40),
  phone,
  industry: z.string().trim().min(1, "업종을 입력해주세요.").max(80),
  region: z.string().trim().min(1, "지역을 입력해주세요.").max(80),
  placeUrl: optionalUrlText.refine(
    (value) => !value || value.startsWith("http"),
    "네이버 플레이스 URL은 http로 시작하는 주소를 입력해주세요.",
  ),
  budget: optionalShortText,
  currentMarketing: optionalShortText,
  concerns: optionalText,
  interestedServices: z.array(z.string().trim().max(80)).optional(),
  competitor: optionalText,
  preferredContactTime: optionalShortText,
  message: optionalText,
  utmSource: optionalShortText,
  utmMedium: optionalShortText,
  utmCampaign: optionalShortText,
  utmContent: optionalShortText,
  utmTerm: optionalShortText,
  landingPage: optionalUrlText,
  referrer: optionalUrlText,
  privacyConsent: z
    .boolean()
    .refine((value) => value, "개인정보 수집 및 이용에 동의해주세요."),
  companyWebsite: z.string().optional(),
  formStartedAt: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export function toLeadInsert(values: LeadFormValues) {
  return {
    lead_type: values.leadType,
    business_name: values.businessName,
    contact_name: values.contactName,
    phone: values.phone,
    industry: values.industry,
    region: values.region,
    place_url: values.placeUrl || null,
    budget: values.budget || null,
    current_marketing: values.currentMarketing || null,
    concerns: values.concerns || null,
    interested_services: values.interestedServices?.length
      ? values.interestedServices.join(", ")
      : null,
    competitor: values.competitor || null,
    preferred_contact_time: values.preferredContactTime || null,
    message: values.message || null,
    utm_source: values.utmSource || null,
    utm_medium: values.utmMedium || null,
    utm_campaign: values.utmCampaign || null,
    utm_content: values.utmContent || null,
    utm_term: values.utmTerm || null,
    landing_page: values.landingPage || null,
    referrer: values.referrer || null,
    status: "new",
  };
}
