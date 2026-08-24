import { z } from "zod";
import { leadStatusOptions } from "@/lib/admin/constants";
import { normalizeSlug } from "@/lib/admin/slug";

const text = (label: string, max = 500) =>
  z.string().trim().min(1, `${label}을 입력해주세요.`).max(max, `${label}은 ${max}자 이내로 입력해주세요.`);

const optionalUrl = z
  .string()
  .trim()
  .max(800, "URL은 800자 이내로 입력해주세요.")
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "http 또는 https URL을 입력해주세요.");

export const adminLoginSchema = z.object({
  email: z.string().trim().email("이메일 형식을 확인해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export const leadUpdateSchema = z.object({
  status: z.enum(leadStatusOptions.map((item) => item.value) as [string, ...string[]]),
  adminMemo: z.string().trim().max(3000, "관리자 메모는 3000자 이내로 입력해주세요.").optional(),
  isTest: z.boolean().default(false),
});

export const portfolioSchema = z.object({
  title: text("제목", 120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug를 입력해주세요.")
    .max(120, "Slug는 120자 이내로 입력해주세요.")
    .transform(normalizeSlug)
    .refine((value) => value.length > 0, "유효한 Slug를 입력해주세요."),
  clientName: text("고객명", 120),
  industry: text("업종", 80),
  location: text("지역", 80),
  summary: text("요약", 800),
  challenge: text("문제", 1200),
  strategy: z.string().trim().min(1, "전략을 입력해주세요.").max(2400),
  execution: z.string().trim().min(1, "실행 내용을 입력해주세요.").max(2400),
  result: text("결과", 1200),
  thumbnailUrl: optionalUrl,
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export const productSchema = z.object({
  name: text("상품명", 120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug를 입력해주세요.")
    .max(120)
    .transform(normalizeSlug)
    .refine((value) => value.length > 0, "유효한 Slug를 입력해주세요."),
  description: text("설명", 1000),
  price: z
    .union([z.coerce.number().int().min(0).max(999999999), z.literal(""), z.null()])
    .transform((value) => (value === "" ? null : value)),
  priceLabel: z.string().trim().min(1, "가격 라벨을 입력해주세요.").max(80),
  features: z.string().trim().min(1, "포함 항목을 입력해주세요.").max(2400),
  recommended: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  purchaseType: z.enum(["direct", "consultation_required"]).default("consultation_required"),
});

export const siteSettingsSchema = z.object({
  brandName: z.string().trim().max(80).optional().or(z.literal("")),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("이메일 형식을 확인해주세요.").optional().or(z.literal("")),
  kakaoChatUrl: optionalUrl,
  serviceRegion: z.string().trim().max(80).optional().or(z.literal("")),
  businessName: z.string().trim().max(120).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  productSlug: z.string().trim().min(1, "상품을 선택해주세요.").max(120),
  businessName: z.string().trim().min(1, "업체명을 입력해주세요.").max(120),
  customerName: z.string().trim().min(1, "담당자명을 입력해주세요.").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "연락처를 입력해주세요.")
    .max(40)
    .regex(/^[0-9+\-\s().]+$/, "연락처 형식을 확인해주세요."),
  email: z.string().trim().email("이메일 형식을 확인해주세요.").max(160),
  requestNote: z.string().trim().max(1200, "요청사항은 1200자 이내로 입력해주세요.").optional().or(z.literal("")),
  privacyConsent: z.boolean().refine((value) => value, "개인정보 수집 및 결제 진행에 동의해주세요."),
  termsConsent: z.boolean().refine((value) => value, "이용약관 및 결제 안내에 동의해주세요."),
  utmSource: z.string().trim().max(120).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(120).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(120).optional().or(z.literal("")),
  utmContent: z.string().trim().max(120).optional().or(z.literal("")),
  utmTerm: z.string().trim().max(120).optional().or(z.literal("")),
  landingPage: optionalUrl,
  referrer: optionalUrl,
});

export function linesToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
export type PortfolioValues = z.input<typeof portfolioSchema>;
export type ProductValues = z.input<typeof productSchema>;
export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
