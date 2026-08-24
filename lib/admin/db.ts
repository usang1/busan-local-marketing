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

export type DashboardPeriod = "today" | "7d" | "30d" | "all";

type AttributionRow = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
};

type FunnelStep = {
  label: string;
  from: number;
  to: number;
  rate: number | null;
};

type SourceStat = {
  key: string;
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  leads: number;
  freeAudit: number;
  consultation: number;
  contracts: number;
  payments: number;
  revenue: number;
};

type CampaignStat = {
  campaign: string;
  sessions: null;
  leads: number;
  contracts: number;
  payments: number;
  revenue: number;
};

function getPeriodStart(period: DashboardPeriod) {
  if (period === "all") return null;

  const now = new Date();
  const start = new Date(now);
  if (period === "today") {
    start.setHours(0, 0, 0, 0);
    return start;
  }
  start.setDate(now.getDate() - (period === "7d" ? 6 : 29));
  start.setHours(0, 0, 0, 0);
  return start;
}

function isInPeriod(value: string | null | undefined, start: Date | null) {
  if (!start) return true;
  if (!value) return false;
  return new Date(value).getTime() >= start.getTime();
}

function conversionRate(to: number, from: number) {
  if (from <= 0) return null;
  return Math.round((to / from) * 1000) / 10;
}

function referrerHost(referrer?: string | null) {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

function normalizeAttribution(row: AttributionRow) {
  const source = row.utm_source?.trim() || (row.referrer ? referrerHost(row.referrer) : "direct");
  const medium = row.utm_medium?.trim() || (row.referrer ? "referral" : "direct");
  const campaign = row.utm_campaign?.trim() || "";
  const referrer = referrerHost(row.referrer);
  return {
    source,
    medium,
    campaign,
    referrer,
    key: [source, medium, campaign, referrer].join("|"),
  };
}

function hasReached(status: LeadStatus, stage: LeadStatus) {
  const order: LeadStatus[] = ["new", "contacted", "consulting", "proposal", "contracted"];
  if (status === "on_hold" || status === "rejected") return false;
  return order.indexOf(status) >= order.indexOf(stage);
}

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

export async function getDashboardStats(period: DashboardPeriod = "30d") {
  const supabase = await getSupabaseServerClient();
  const start = getPeriodStart(period);
  const empty = {
    period,
    total: 0,
    newLeads: 0,
    testLeads: 0,
    freeAudit: 0,
    consultation: 0,
    contacted: 0,
    consulting: 0,
    proposal: 0,
    contracted: 0,
    paidOrders: 0,
    paidAmount: 0,
    recentOrders: [] as Order[],
    sourceStats: [] as SourceStat[],
    campaignStats: [] as CampaignStat[],
    conversionSteps: [] as FunnelStep[],
    freeAuditFunnel: {
      ctaClicks: null as number | null,
      formStarts: null as number | null,
      formSubmits: 0,
      submitRate: null as number | null,
      contracts: 0,
      paid: 0,
    },
    funnel: Object.fromEntries(funnelStatuses.map((status) => [status, 0])) as Record<LeadStatus, number>,
    recent: [] as Lead[],
    error: supabase ? null : "Supabase 환경변수가 없습니다.",
  };

  if (!supabase) return empty;

  let leadsQuery = supabase.from("leads").select("*").eq("is_test", false).order("created_at", { ascending: false });
  let testLeadsQuery = supabase.from("leads").select("id", { count: "exact", head: true }).eq("is_test", true);
  if (start) {
    leadsQuery = leadsQuery.gte("created_at", start.toISOString());
    testLeadsQuery = testLeadsQuery.gte("created_at", start.toISOString());
  }

  const [leadsResult, ordersResult, recentResult, recentOrdersResult, testLeadsResult] = await Promise.all([
    leadsQuery.limit(5000),
    supabase.from("orders").select("*, products(name, slug, price_label)").order("created_at", { ascending: false }).limit(5000),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("orders").select("*, products(name, slug, price_label)").order("created_at", { ascending: false }).limit(5),
    testLeadsQuery,
  ]);

  const leads = (leadsResult.data || []) as Lead[];
  const orders = ((ordersResult.data || []) as Order[]).filter((order) => isInPeriod(order.paid_at || order.created_at, start));
  const paidOrders = orders.filter((order) => order.status === "paid");
  const paidLeadIds = new Set(paidOrders.map((order) => order.lead_id).filter(Boolean));
  const contractedLeadIds = new Set(leads.filter((lead) => lead.status === "contracted").map((lead) => lead.id));

  const sourceMap = new Map<string, SourceStat>();
  const campaignMap = new Map<string, CampaignStat>();

  function ensureSource(row: AttributionRow) {
    const attribution = normalizeAttribution(row);
    const existing = sourceMap.get(attribution.key);
    if (existing) return existing;
    const next = {
      key: attribution.key,
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      referrer: attribution.referrer,
      leads: 0,
      freeAudit: 0,
      consultation: 0,
      contracts: 0,
      payments: 0,
      revenue: 0,
    };
    sourceMap.set(attribution.key, next);
    return next;
  }

  function ensureCampaign(campaign: string | null) {
    const key = campaign?.trim() || "(campaign 없음)";
    const existing = campaignMap.get(key);
    if (existing) return existing;
    const next = { campaign: key, sessions: null, leads: 0, contracts: 0, payments: 0, revenue: 0 };
    campaignMap.set(key, next);
    return next;
  }

  for (const lead of leads) {
    const source = ensureSource(lead);
    const campaign = ensureCampaign(lead.utm_campaign);
    source.leads += 1;
    campaign.leads += 1;
    if (lead.lead_type === "free_audit") source.freeAudit += 1;
    if (lead.lead_type === "consultation") source.consultation += 1;
    if (lead.status === "contracted") {
      source.contracts += 1;
      campaign.contracts += 1;
    }
  }

  for (const order of paidOrders) {
    const source = ensureSource(order);
    const campaign = ensureCampaign(order.utm_campaign);
    source.payments += 1;
    source.revenue += Number(order.amount || 0);
    campaign.payments += 1;
    campaign.revenue += Number(order.amount || 0);
  }

  const reachedContacted = leads.filter((lead) => hasReached(lead.status, "contacted")).length;
  const reachedConsulting = leads.filter((lead) => hasReached(lead.status, "consulting")).length;
  const reachedProposal = leads.filter((lead) => hasReached(lead.status, "proposal")).length;
  const reachedContracted = leads.filter((lead) => hasReached(lead.status, "contracted")).length;
  const linkedPaidContracts = Array.from(paidLeadIds).filter((leadId) => contractedLeadIds.has(String(leadId))).length;
  const freeAuditLeads = leads.filter((lead) => lead.lead_type === "free_audit");
  const freeAuditLeadIds = new Set(freeAuditLeads.map((lead) => lead.id));
  const freeAuditPaid = paidOrders.filter((order) => order.lead_id && freeAuditLeadIds.has(order.lead_id)).length;

  return {
    period,
    total: leads.length,
    newLeads: leads.filter((lead) => lead.status === "new").length,
    testLeads: testLeadsResult.count || 0,
    freeAudit: freeAuditLeads.length,
    consultation: leads.filter((lead) => lead.lead_type === "consultation").length,
    contacted: leads.filter((lead) => lead.status === "contacted").length,
    consulting: leads.filter((lead) => lead.status === "consulting").length,
    proposal: leads.filter((lead) => lead.status === "proposal").length,
    contracted: reachedContracted,
    paidOrders: paidOrders.length,
    paidAmount: paidOrders.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    funnel: Object.fromEntries(funnelStatuses.map((status) => [status, leads.filter((lead) => lead.status === status).length])) as Record<LeadStatus, number>,
    conversionSteps: [
      { label: "Lead → 연락완료", from: leads.length, to: reachedContacted, rate: conversionRate(reachedContacted, leads.length) },
      { label: "연락완료 → 상담", from: reachedContacted, to: reachedConsulting, rate: conversionRate(reachedConsulting, reachedContacted) },
      { label: "상담 → 제안", from: reachedConsulting, to: reachedProposal, rate: conversionRate(reachedProposal, reachedConsulting) },
      { label: "제안 → 계약", from: reachedProposal, to: reachedContracted, rate: conversionRate(reachedContracted, reachedProposal) },
      { label: "계약 → 결제", from: reachedContracted, to: linkedPaidContracts, rate: conversionRate(linkedPaidContracts, reachedContracted) },
    ],
    freeAuditFunnel: {
      ctaClicks: null,
      formStarts: null,
      formSubmits: freeAuditLeads.length,
      submitRate: null,
      contracts: freeAuditLeads.filter((lead) => lead.status === "contracted").length,
      paid: freeAuditPaid,
    },
    recent: (recentResult.data || []) as Lead[],
    recentOrders: (recentOrdersResult.data || []) as Order[],
    sourceStats: Array.from(sourceMap.values()).sort((a, b) => b.leads - a.leads || b.revenue - a.revenue).slice(0, 10),
    campaignStats: Array.from(campaignMap.values()).sort((a, b) => b.leads - a.leads || b.revenue - a.revenue).slice(0, 10),
    error: leadsResult.error || ordersResult.error ? "Dashboard 데이터를 불러오지 못했습니다." : null,
  };
}

export async function getLeadOrders(leadId: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { data: [] as Order[], error: "Supabase 환경변수가 없습니다." };

  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name, slug, price_label)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  return { data: (data || []) as Order[], error: error ? "연결 주문을 불러오지 못했습니다." : null };
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
