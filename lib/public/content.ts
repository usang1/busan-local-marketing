import { portfolioCases, type PortfolioCase } from "@/data/portfolio";
import { pricingPlans } from "@/data/pricing";
import { listPortfolios, listProducts, getPortfolioBySlug } from "@/lib/admin/db";
import { isDirectPaymentAvailable } from "@/lib/payment/provider";
import type { Portfolio, Product } from "@/types/database";

export type PublicPortfolio = PortfolioCase & {
  id?: string;
  title: string;
  thumbnailUrl?: string | null;
  featured?: boolean;
};

export type PublicProduct = {
  id?: string;
  slug?: string;
  name: string;
  label: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

function portfolioToPublic(item: Portfolio): PublicPortfolio {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    client: item.client_name,
    industry: item.industry,
    location: item.location,
    summary: item.summary,
    challenge: item.challenge,
    strategy: item.strategy || [],
    execution: item.execution || [],
    result: item.result,
    status: "ready",
    thumbnailUrl: item.thumbnail_url,
    featured: item.featured,
  };
}

function productToPublic(item: Product): PublicProduct {
  const canDirectPay = item.purchase_type === "direct" && isDirectPaymentAvailable();

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    label: item.name,
    price: item.price === null ? item.price_label : `${new Intl.NumberFormat("ko-KR").format(item.price)}원`,
    description: item.description,
    features: item.features || [],
    cta: canDirectPay ? "신청 및 결제" : item.purchase_type === "direct" ? "상담 후 결제 안내" : "무료 진단 먼저 받기",
    href: canDirectPay ? `/checkout?product=${encodeURIComponent(item.slug)}` : item.purchase_type === "direct" ? "/contact" : "/free-audit",
    featured: item.recommended,
  };
}

export async function getPublicPortfolios({ featuredOnly = false } = {}) {
  const result = await listPortfolios({ publishedOnly: true, featuredOnly });
  if (result.unavailable) {
    return portfolioCases.map((item) => ({ ...item, title: `${item.industry} 로컬 마케팅 점검` }));
  }
  return result.data.map(portfolioToPublic);
}

export async function getFeaturedPublicPortfolios() {
  const featured = await getPublicPortfolios({ featuredOnly: true });
  if (featured.length) return featured.slice(0, 3);

  const all = await getPublicPortfolios();
  return all.slice(0, 3);
}

export async function getPublicPortfolioBySlug(slug: string) {
  const result = await getPortfolioBySlug(slug);
  if (result.unavailable) {
    const fallback = portfolioCases.find((item) => item.slug === slug);
    return fallback ? { ...fallback, title: `${fallback.industry} 로컬 마케팅 점검` } : null;
  }

  return result.data ? portfolioToPublic(result.data) : null;
}

export async function getPublicProducts() {
  const result = await listProducts({ publishedOnly: true });
  if (result.unavailable) {
    return pricingPlans;
  }

  return result.data.map(productToPublic);
}
