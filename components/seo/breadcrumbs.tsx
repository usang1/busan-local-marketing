import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "홈", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-8 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? <ChevronRight size={14} aria-hidden="true" /> : null}
              {index === allItems.length - 1 ? (
                <span className="font-semibold text-ink">{item.name}</span>
              ) : (
                <Link className="hover:text-accent" href={item.href}>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={jsonLd} />
    </>
  );
}
