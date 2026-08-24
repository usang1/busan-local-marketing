import Image from "next/image";
import type { PublicBrandConfig } from "@/lib/public/site-config";

export function BrandLogo({ brand, size = "md" }: { brand: PublicBrandConfig; size?: "md" | "lg" }) {
  const imageSize = size === "lg" ? "h-20 w-auto" : "h-14 w-auto";
  const dimensions = size === "lg" ? { width: 221, height: 160 } : { width: 154, height: 112 };

  return (
    <Image
      src="/brand/markivo-logo.png"
      alt={`${brand.name} 로고`}
      className={`${imageSize} shrink-0 object-contain`}
      priority={size === "md"}
      {...dimensions}
    />
  );
}
