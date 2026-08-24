import { BRAND, SITE } from "@/config/site";
import type { PublicBrandConfig, PublicSiteConfig } from "@/lib/public/site-config";

const FALLBACK_SITE: PublicSiteConfig = { ...SITE, businessName: "", address: "" };

function hasConfiguredBrand(brand = BRAND) {
  return Boolean(brand.name && brand.name !== "브랜드명");
}

export function organizationJsonLd({
  brand = BRAND,
  site = FALLBACK_SITE,
}: {
  brand?: PublicBrandConfig;
  site?: PublicSiteConfig;
} = {}) {
  if (!hasConfiguredBrand(brand)) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: site.url,
    description: brand.description,
    areaServed: ["부산", "경남"],
    contactPoint: site.email || site.phone
      ? {
          "@type": "ContactPoint",
          telephone: site.phone || undefined,
          email: site.email || undefined,
          contactType: "customer service",
          areaServed: ["KR-26", "KR-48"],
          availableLanguage: ["ko"],
        }
      : undefined,
  };
}

export function professionalServiceJsonLd({
  brand = BRAND,
  site = FALLBACK_SITE,
}: {
  brand?: PublicBrandConfig;
  site?: PublicSiteConfig;
} = {}) {
  if (!hasConfiguredBrand(brand)) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: brand.name,
    url: site.url,
    description: brand.description,
    areaServed: ["부산", "경남"],
    serviceType: ["네이버 플레이스 마케팅", "로컬 SEO", "로컬 비즈니스 마케팅"],
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
  brand = BRAND,
  site = FALLBACK_SITE,
}: {
  name: string;
  description: string;
  path: string;
  brand?: PublicBrandConfig;
  site?: PublicSiteConfig;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: hasConfiguredBrand(brand) ? brand.name : undefined,
      url: site.url,
    },
    areaServed: ["부산", "경남"],
    url: `${site.url}${path}`,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
