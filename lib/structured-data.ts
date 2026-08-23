import { BRAND, SITE } from "@/config/site";

function hasConfiguredBrand() {
  return Boolean(BRAND.name && BRAND.name !== "브랜드명");
}

export function organizationJsonLd() {
  if (!hasConfiguredBrand()) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: SITE.url,
    description: BRAND.description,
    areaServed: ["부산", "경남"],
    contactPoint: SITE.email || SITE.phone
      ? {
          "@type": "ContactPoint",
          telephone: SITE.phone || undefined,
          email: SITE.email || undefined,
          contactType: "customer service",
          areaServed: ["KR-26", "KR-48"],
          availableLanguage: ["ko"],
        }
      : undefined,
  };
}

export function professionalServiceJsonLd() {
  if (!hasConfiguredBrand()) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND.name,
    url: SITE.url,
    description: BRAND.description,
    areaServed: ["부산", "경남"],
    serviceType: ["네이버 플레이스 마케팅", "로컬 SEO", "로컬 비즈니스 마케팅"],
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: hasConfiguredBrand() ? BRAND.name : undefined,
      url: SITE.url,
    },
    areaServed: ["부산", "경남"],
    url: `${SITE.url}${path}`,
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
