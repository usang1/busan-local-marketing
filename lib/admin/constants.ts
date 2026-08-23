import type { LeadStatus, LeadType } from "@/types/lead";
import type { OrderStatus } from "@/types/database";

export const leadTypeLabels: Record<LeadType, string> = {
  free_audit: "무료 진단",
  consultation: "일반 상담",
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "신규",
  contacted: "연락완료",
  consulting: "상담중",
  proposal: "제안발송",
  contracted: "계약",
  on_hold: "보류",
  rejected: "거절",
};

export const leadStatusOptions = Object.entries(leadStatusLabels).map(([value, label]) => ({
  value: value as LeadStatus,
  label,
}));

export const funnelStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "consulting",
  "proposal",
  "contracted",
];

export const leadTypeOptions = [
  { value: "all", label: "전체" },
  { value: "free_audit", label: "무료 진단" },
  { value: "consultation", label: "일반 상담" },
];

export const adminNavItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "전체 문의", href: "/admin/leads" },
  { label: "무료 진단", href: "/admin/audits" },
  { label: "주문 / 결제", href: "/admin/orders" },
  { label: "포트폴리오", href: "/admin/portfolio" },
  { label: "상품 관리", href: "/admin/products" },
  { label: "설정", href: "/admin/settings" },
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "결제대기",
  paid: "결제완료",
  failed: "실패",
  cancelled: "취소",
  refunded: "환불",
};

export function statusBadgeClass(status: LeadStatus) {
  switch (status) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "contacted":
      return "border-cyan-200 bg-cyan-50 text-cyan-800";
    case "consulting":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "proposal":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "contracted":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "on_hold":
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-800";
  }
}
