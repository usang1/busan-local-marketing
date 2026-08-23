import type { LeadStatus, LeadType } from "@/types/lead";

export type AdminRole = "admin" | "manager" | "viewer";

export type Lead = {
  id: string;
  lead_type: LeadType;
  business_name: string;
  contact_name: string;
  phone: string;
  industry: string;
  region: string;
  place_url: string | null;
  budget: string | null;
  current_marketing: string | null;
  concerns: string | null;
  interested_services: string | null;
  competitor: string | null;
  preferred_contact_time: string | null;
  message: string | null;
  status: LeadStatus;
  admin_memo: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
};

export type Portfolio = {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  location: string;
  summary: string;
  challenge: string;
  strategy: string[];
  execution: string[];
  result: string;
  thumbnail_url: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  price_label: string;
  features: string[];
  recommended: boolean;
  published: boolean;
  sort_order: number;
  purchase_type: "direct" | "consultation_required";
  created_at: string;
  updated_at: string;
};

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export type Order = {
  id: string;
  order_id: string;
  lead_id: string | null;
  product_id: string;
  business_name: string;
  customer_name: string;
  phone: string;
  email: string;
  request_note: string | null;
  amount: number;
  currency: "KRW";
  status: OrderStatus;
  payment_provider: string;
  payment_key: string | null;
  failure_code: string | null;
  failure_message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  products?: Pick<Product, "name" | "slug" | "price_label"> | null;
};

export type SiteSettings = {
  id: string;
  brand_name: string | null;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  kakao_chat_url: string | null;
  service_region: string | null;
  business_name: string | null;
  address: string | null;
  updated_at: string;
};
