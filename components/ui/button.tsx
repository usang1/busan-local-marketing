import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "disabled";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground border-accent hover:bg-[#24776f] focus-visible:ring-accent/30",
  secondary:
    "bg-ink text-white border-ink hover:bg-[#2f3d42] focus-visible:ring-ink/20",
  ghost:
    "border-transparent bg-transparent text-ink hover:bg-ink/5 focus-visible:ring-accent/20",
  outline:
    "border-line bg-white/70 text-ink hover:border-accent/40 hover:bg-pale-mint/60 focus-visible:ring-accent/20",
  disabled:
    "cursor-not-allowed border-line bg-white/60 text-muted opacity-70 focus-visible:ring-transparent",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-[8px] border font-semibold transition focus-visible:outline-none focus-visible:ring-4";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  href,
  disabled,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(base, variants.disabled, sizes[size], className)}
        title="카카오톡 상담 링크 설정 전입니다."
      >
        {children}
      </span>
    );
  }

  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} href={href} {...props}>
      {children}
    </Link>
  );
}
