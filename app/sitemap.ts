import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { portfolioCases } from "@/data/portfolio";
import { services } from "@/data/services";
import { listPortfolios } from "@/lib/admin/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/services", "/services/naver-place", "/portfolio", "/free-audit", "/contact", "/pricing", "/privacy", "/terms"];
  const now = new Date();
  const publishedServiceRoutes = services.filter((service) => !service.draft).map((service) => `/services/${service.slug}`);
  const portfolios = await listPortfolios({ publishedOnly: true });
  const portfolioRoutes = portfolios.data.length
    ? portfolios.data.map((item) => ({
        slug: item.slug,
        updatedAt: item.updated_at,
      }))
    : portfolioCases.map((item) => ({ slug: item.slug, updatedAt: now.toISOString() }));

  return [
    ...[...routes, ...publishedServiceRoutes].map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...portfolioRoutes.map((item) => ({
      url: `${SITE.url}/portfolio/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
