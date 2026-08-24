import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { organizationJsonLd, professionalServiceJsonLd } from "@/lib/structured-data";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { brand, site } = await getPublicSiteProfile();

  return {
    metadataBase: new URL(site.url || SITE.url),
    title: {
      default: `${brand.name} | ${brand.tagline}`,
      template: `%s | ${brand.name}`,
    },
    description: brand.description,
    openGraph: {
      title: `${brand.name} | ${brand.tagline}`,
      description: brand.description,
      siteName: brand.name,
      locale: "ko_KR",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      other: {
        "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
          ? [process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION]
          : [],
      },
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { brand, site } = await getPublicSiteProfile();

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Header brand={brand} />
        <main className="flex-1">{children}</main>
        <Footer brand={brand} site={site} />
        <MobileStickyCta kakaoChatUrl={site.kakaoChatUrl} />
        <JsonLd data={[organizationJsonLd({ brand, site }), professionalServiceJsonLd({ brand, site })]} />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
