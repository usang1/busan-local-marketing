import { connection } from "next/server";
import { BRAND, SITE } from "@/config/site";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { SiteSettings } from "@/types/database";

export type PublicBrandConfig = typeof BRAND;
export type PublicSiteConfig = typeof SITE & {
  businessName: string;
  address: string;
};

export type PublicSiteProfile = {
  brand: PublicBrandConfig;
  site: PublicSiteConfig;
};

function clean(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function cleanBrandName(value?: string | null) {
  const name = clean(value);
  if (!name || name === "브랜드명") return undefined;
  return name;
}

export function mergeSiteSettings(settings?: SiteSettings | null): PublicSiteProfile {
  const name = cleanBrandName(settings?.brand_name) || BRAND.name;
  const region = clean(settings?.service_region) || BRAND.region;
  const tagline = clean(settings?.tagline) || BRAND.tagline;

  return {
    brand: {
      ...BRAND,
      name,
      tagline,
      region,
      description: BRAND.description.replaceAll(BRAND.name, name).replaceAll(BRAND.region, region),
    },
    site: {
      ...SITE,
      phone: clean(settings?.phone) || SITE.phone,
      email: clean(settings?.email) || SITE.email,
      kakaoChatUrl: clean(settings?.kakao_chat_url) || SITE.kakaoChatUrl,
      businessName: clean(settings?.business_name) || "",
      address: clean(settings?.address) || "",
    },
  };
}

export async function getPublicSiteProfile(): Promise<PublicSiteProfile> {
  await connection();

  const supabase = await getSupabaseServerClient();
  if (!supabase) return mergeSiteSettings(null);

  const { data } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
  return mergeSiteSettings((data as SiteSettings | null) || null);
}
