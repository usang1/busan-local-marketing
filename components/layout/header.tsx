import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { HeaderNavigation, type HeaderServiceGroup } from "@/components/layout/header-navigation";
import { NAV_ITEMS } from "@/config/site";
import { getServicesByCategory, serviceCategoryOrder } from "@/data/services";
import type { PublicBrandConfig } from "@/lib/public/site-config";

const serviceGroups: HeaderServiceGroup[] = serviceCategoryOrder.map((category) => ({
  category,
  services: getServicesByCategory(category).map((service) => ({
    slug: service.slug,
    title: service.title,
    shortTitle: service.shortTitle,
  })),
}));

export function Header({ brand }: { brand: PublicBrandConfig }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ivory/86 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-[6px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
        >
          <BrandLogo brand={brand} />
          <span className="hidden min-w-0 flex-col sm:flex">
            <span className="text-xs font-medium text-muted">{brand.tagline}</span>
          </span>
        </Link>

        <HeaderNavigation navItems={NAV_ITEMS} serviceGroups={serviceGroups} />
      </div>
    </header>
  );
}
