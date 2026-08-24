import type { Metadata } from "next";
import { BRAND, SEO_KEYWORDS, SITE } from "@/config/site";
import { getPublicSiteProfile, type PublicBrandConfig, type PublicSiteConfig } from "@/lib/public/site-config";

const FALLBACK_SITE: PublicSiteConfig = { ...SITE, businessName: "", address: "" };

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
  brand?: PublicBrandConfig;
  site?: PublicSiteConfig;
};

export function createMetadata({ title, description, path = "", index = true, brand = BRAND, site = FALLBACK_SITE }: PageSeo): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    keywords: SEO_KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      url,
      siteName: brand.name,
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${site.url}/placeholders/local-audit-hero.png`,
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

export async function createPublicMetadata(seo: Omit<PageSeo, "brand" | "site">): Promise<Metadata> {
  const { brand, site } = await getPublicSiteProfile();
  return createMetadata({ ...seo, brand, site });
}
