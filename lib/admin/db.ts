import { getSupabaseServerClient } from "@/lib/supabase";
import { funnelStatuses } from "@/lib/admin/constants";
import type { LeadStatus, LeadType } from "@/types/lead";
import type { Lead, Order, Portfolio, Product, SiteSettings } from "@/types/database";

export type LeadListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  type?: "all" | LeadType;
  status?: "all" | LeadStatus;
  region?: "all" | "busan" | "gyeongnam" | "other";
  industry?: string;
  sort?: "newest" | "oldest" | "business";
};

function cleanPage(value?: number) {
  if (!value || Number.isNaN(value) || value < 1) return 1;
  return Math.floor(value);
}

type RegionFilterQuery<T> = {
  ilike: (column: string, pattern: string) => T;
  or: (filters: string) => T;
  not: (column: string, operator: string, value: string) => T;
};

function applyRegionFilter<T extends RegionFilterQuery<T>>(query: T, region?: LeadListParams["region"]) {
  if (!region || region === "all") return query;

  if (region === "busan") {
    return query.ilike("region", "%부산%");
  }

  if (region === "gyeongnam") {
    return query.or("region.ilike.%경남%,region.ilike.%김해%,region.ilike.%창원%,region.ilike.%양산%,region.ilike.%진주%,region.ilike.%거제%");
  }

  return query.not("region", "ilike", "%부산%").not("region", "ilike", "%경남%");
}

export async function listLeads(params: LeadListParams = {}) {
  const supabase = await getSupabaseServerClient();
  const page = cleanPage(params.page);
  const pageSize = params.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!supabase) {
    return { data: [] as Lead[], count: 0, page, pageSize, error: "Supabase 환경변수가 없습니다." };
  }

  let query = supabase.from("leads").select("*", { count: "exact" });

  if (params.q) {
    const q = params.q.replaceAll(",", " ").trim();
    if (q) {
      query = query.or(
        `business_name.ilike.%${q}%,contact_name.ilike.%${q}%,phone.ilike.%${q}%`,
      );
    }
  }

  if (params.type && params.type !== "all") {
    query = query.eq("lead_type", params.type);
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.industry) {
    query = query.eq("industry", params.industry);
  }

  query = applyRegionFilter(query, params.region);

  if (params.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (params.sort === "business") {
    query = query.order("business_name", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  return {
    data: (data || []) as Lead[],
    count: count || 0,
    page,
    pageSize,
    error: error ? "문의 목록을 불러오지 못했습니다." : null,
  };
}

export async function getLead(id: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { data: null, error: "Supabase 환경변수가 없습니다." };

  const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  return { data: (data as Lead | null) || null, error: error ? "문의 정보를 불러오지 못했습니다." : null };
}

export async function getLeadIndustries() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase.from("leads").select("industry").order("industry");
  return Array.from(new Set((data || []).map((item) => item.industry).filter(Boolean)));
}

export async function getDashboardStats() {
  const supabase = await getSupabaseServerClient();
  const empty = {
    total: 0,
    today: 0,
    week: 0,
    freeAudit: 0,
    consultation: 0,
    consulting: 0,
    proposal: 0,
    contracted: 0,
    paidOrders: 0,
    paidAmount: 0,
    recentOrders: [] as Order[],
    sourceStats: [] as { source: string; total: number; freeAudit: number; consultation: number }[],
    funnel: Object.fromEntries(funnelStatuses.map((status) => [status, 0])) as Record<LeadStatus, number>,
    recent: [] as Lead[],
    error: supabase ? null : "Supabase 환경변수가 없습니다.",
  };

  if (!supabase) return empty;

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfThirtyDays = new Date(now);
  startOfThirtyDays.setDate(now.getDate() - 29);
  startOfThirtyDays.setHours(0, 0, 0, 0);

  const [
    total,
    today,
    week,
    freeAudit,
    consultation,
    consulting,
    proposal,
    contracted,
    paidOrders,
    paidOrderRows,
    recent,
    recentOrders,
    sourceRows,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfWeek.toISOString()),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("lead_type", "free_audit"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("lead_type", "consultation"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "consulting"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "proposal"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "contracted"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("orders").select("amount").eq("status", "paid"),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8),
    supabase
      .from("orders")
      .select("*, products(name, slug, price_label)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leads")
      .select("utm_source, lead_type")
      .gte("created_at", startOfThirtyDays.toISOString()),
  ]);

  const funnelEntries = await Promise.all(
    funnelStatuses.map(async (status) => {
      const { count } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", status);
      return [status, count || 0] as const;
    }),
  );

  const sourceMap = new Map<string, { source: string; total: number; freeAudit: number; consultation: number }>();
  for (const item of sourceRows.data || []) {
    const source = item.utm_source || "direct";
    const stat = sourceMap.get(source) || { source, total: 0, freeAudit: 0, consultation: 0 };
    stat.total += 1;
    if (item.lead_type === "free_audit") stat.freeAudit += 1;
    if (item.lead_type === "consultation") stat.consultation += 1;
    sourceMap.set(source, stat);
  }

  return {
    total: total.count || 0,
    today: today.count || 0,
    week: week.count || 0,
    freeAudit: freeAudit.count || 0,
    consultation: consultation.count || 0,
    consulting: consulting.count || 0,
    proposal: proposal.count || 0,
    contracted: contracted.count || 0,
    paidOrders: paidOrders.count || 0,
    paidAmount: (paidOrderRows.data || []).reduce((sum, item) => sum + Number(item.amount || 0), 0),
    funnel: Object.fromEntries(funnelEntries) as Record<LeadStatus, number>,
    recent: (recent.data || []) as Lead[],
    recentOrders: (recentOrders.data || []) as Order[],
    sourceStats: Array.from(sourceMap.values()).sort((a, b) => b.total - a.total).slice(0, 6),
    error: null,
  };
}

export async function listOrders() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { data: [] as Order[], error: "Supabase 환경변수가 없습니다." };

  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name, slug, price_label)")
    .order("created_at", { ascending: false })
    .limit(50);

  return { data: (data || []) as Order[], error: error ? "주문 목록을 불러오지 못했습니다." : null };
}

export async function getOrder(id: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { data: null, error: "Supabase 환경변수가 없습니다." };

  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name, slug, price_label)")
    .eq("id", id)
    .maybeSingle();

  return { data: (data as Order | null) || null, error: error ? "주문 정보를 불러오지 못했습니다." : null };
}

export async function getOrderByOrderId(orderId: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("orders")
    .select("*, products(name, slug, price_label)")
    .eq("order_id", orderId)
    .maybeSingle();
  return (data as Order | null) || null;
}

export async function listPortfolios({ publishedOnly = false, featuredOnly = false } = {}) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { data: [] as Portfolio[], error: "Supabase 환경변수가 없습니다.", unavailable: true };

  let query = supabase.from("portfolios").select("*");
  if (publishedOnly) query = query.eq("published", true);
  if (featuredOnly) query = query.eq("featured", true);

  const { data, error } = await query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  return { data: (data || []) as Portfolio[], error: error ? "포트폴리오를 불러오지 못했습니다." : null, unavailable: false };
}

export async function getPortfolioById(id: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("portfolios").select("*").eq("id", id).maybeSingle();
  return (data as Portfolio | null) || null;
}

export async function getPortfolioBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { data: null, unavailable: true };
  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return { data: (data as Portfolio | null) || null, unavailable: false };
}

export async function listProducts({ publishedOnly = false } = {}) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { data: [] as Product[], error: "Supabase 환경변수가 없습니다.", unavailable: true };

  let query = supabase.from("products").select("*");
  if (publishedOnly) query = query.eq("published", true);

  const { data, error } = await query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  return { data: (data || []) as Product[], error: error ? "상품을 불러오지 못했습니다." : null, unavailable: false };
}

export async function getProductById(id: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  return (data as Product | null) || null;
}

export async function getPublicProductBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as Product | null) || null;
}

export async function getSiteSettings() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
  return (data as SiteSettings | null) || null;
}
