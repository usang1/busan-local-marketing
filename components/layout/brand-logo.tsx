import type { PublicBrandConfig } from "@/lib/public/site-config";

export function BrandLogo({ brand, size = "md" }: { brand: PublicBrandConfig; size?: "md" | "lg" }) {
  const markSize = size === "lg" ? "h-12 w-12 text-lg" : "h-10 w-10 text-base";
  const nameSize = size === "lg" ? "text-2xl" : "text-xl";
  const initial = brand.name.trim().slice(0, 1).toUpperCase() || "B";

  return (
    <span className="flex min-w-0 items-center gap-3">
      <span
        className={`${markSize} flex shrink-0 items-center justify-center rounded-[8px] bg-accent font-extrabold text-white shadow-[0_10px_28px_rgba(15,118,110,0.18)]`}
        aria-hidden="true"
      >
        {initial}
      </span>
      <span className="min-w-0">
        <span className={`${nameSize} block truncate font-extrabold leading-none text-ink`}>{brand.name}</span>
        <span className="mt-1 block truncate text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
          {brand.origin}
        </span>
      </span>
    </span>
  );
}
