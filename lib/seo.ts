import type { Metadata } from "next";
import { BRAND, SEO_KEYWORDS, SITE } from "@/config/site";

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
};

export function createMetadata({ title, description, path = "", index = true }: PageSeo): Metadata {
  const url = `${SITE.url}${path}`;

  return {
    title,
    description,
    keywords: SEO_KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${BRAND.name}`,
      description,
      url,
      siteName: BRAND.name,
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${SITE.url}/placeholders/local-audit-hero.png`,
          width: 1536,
          height: 1024,
          alt: "로컬 마케팅 진단 자료와 플레이스 점검 화면",
        },
      ],
    },
    robots: {
      index,
      follow: true,
    },
  };
}
