import Image from "next/image";
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
          className="flex min-w-0 items-center gap-3 rounded-[6px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
        >
          <Image src="/markivo-logo.svg" alt={BRAND.name} className="h-10 w-auto" width={139} height={40} priority />
          <span className="hidden min-w-0 flex-col sm:flex">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{BRAND.origin}</span>
            <span className="text-xs font-medium text-muted">{BRAND.tagline}</span>
          </span>
        </Link>

        <HeaderNavigation navItems={NAV_ITEMS} serviceGroups={serviceGroups} />
      </div>
    </header>
  );
}
