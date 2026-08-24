import Link from "next/link";
import { HeaderNavigation, type HeaderServiceGroup } from "@/components/layout/header-navigation";
import { BRAND, NAV_ITEMS } from "@/config/site";
import { getServicesByCategory, serviceCategoryOrder } from "@/data/services";

const serviceGroups: HeaderServiceGroup[] = serviceCategoryOrder.map((category) => ({
  category,
  services: getServicesByCategory(category).map((service) => ({
    slug: service.slug,
    title: service.title,
    shortTitle: service.shortTitle,
  })),
}));

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ivory/86 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="flex min-w-0 flex-col rounded-[6px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
        >
          <span className="text-base font-extrabold tracking-normal text-ink">{BRAND.name}</span>
          <span className="hidden text-xs font-medium text-muted sm:block">{BRAND.tagline}</span>
        </Link>

        <HeaderNavigation navItems={NAV_ITEMS} serviceGroups={serviceGroups} />
      </div>
    </header>
  );
}
