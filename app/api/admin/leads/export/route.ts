import { NextResponse } from "next/server";
import { leadStatusOptions } from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Lead, Order } from "@/types/database";
import type { LeadStatus, LeadType } from "@/types/lead";

const leadTypes: LeadType[] = ["free_audit", "consultation"];
const leadStatuses = leadStatusOptions.map((item) => item.value) as LeadStatus[];

function csvCell(value: string | number | boolean | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows: (string | number | boolean | null | undefined)[][]) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function paidRevenueForLead(orders: Order[], leadId: string) {
  return orders
    .filter((order) => order.lead_id === leadId && order.status === "paid")
    .reduce((sum, order) => sum + Number(order.amount || 0), 0);
}

export async function GET(request: Request) {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 없습니다." }, { status: 500 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");
  const region = url.searchParams.get("region");
  const industry = url.searchParams.get("industry");
  const q = url.searchParams.get("q")?.replaceAll(",", " ").trim();

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

  if (q) {
    query = query.or(`business_name.ilike.%${q}%,contact_name.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  if (type && leadTypes.includes(type as LeadType)) {
    query = query.eq("lead_type", type);
  }

  if (status && leadStatuses.includes(status as LeadStatus)) {
    query = query.eq("status", status);
  }

  if (industry) {
    query = query.eq("industry", industry);
  }

  if (region === "busan") {
    query = query.ilike("region", "%부산%");
  } else if (region === "gyeongnam") {
    query = query.or("region.ilike.%경남%,region.ilike.%김해%,region.ilike.%창원%,region.ilike.%양산%,region.ilike.%진주%,region.ilike.%거제%");
  } else if (region === "other") {
    query = query.not("region", "ilike", "%부산%").not("region", "ilike", "%경남%");
  }

  const [leadsResult, ordersResult] = await Promise.all([
    query.limit(5000),
    supabase.from("orders").select("*").limit(5000),
  ]);

  if (leadsResult.error || ordersResult.error) {
    return NextResponse.json({ message: "Export 데이터를 불러오지 못했습니다." }, { status: 500 });
  }

  const leads = (leadsResult.data || []) as Lead[];
  const orders = (ordersResult.data || []) as Order[];
  const rows = [
    ["업체명", "업종", "지역", "Lead Type", "Status", "Source", "Medium", "Campaign", "생성일", "계약 여부", "주문/매출", "테스트 여부"],
    ...leads.map((lead) => [
      lead.business_name,
      lead.industry,
      lead.region,
      lead.lead_type,
      lead.status,
      lead.utm_source || "direct",
      lead.utm_medium || "",
      lead.utm_campaign || "",
      lead.created_at,
      lead.status === "contracted" ? "Y" : "N",
      paidRevenueForLead(orders, lead.id),
      lead.is_test ? "Y" : "N",
    ]),
  ];

  return new NextResponse(`\uFEFF${toCsv(rows)}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
