import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 min-h-11";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white px-6 py-3 hover:bg-action shadow-[0_1px_0_0_rgb(255_255_255/0.15)_inset,0_8px_24px_-12px_rgb(16_43_70/0.6)] hover:shadow-[0_1px_0_0_rgb(255_255_255/0.2)_inset,0_14px_30px_-12px_rgb(23_105_170/0.7)]",
  secondary: "border border-navy/15 bg-white/70 text-navy px-6 py-3 backdrop-blur hover:border-action/50 hover:text-action",
  ghost: "text-navy px-1 py-2 hover:text-action",
  inverse: "bg-white text-navy px-6 py-3 hover:bg-ice",
};

type CommonProps = { variant?: Variant; arrow?: boolean; children: ReactNode; className?: string };

function Arrow() {
  return (
    <span className="relative inline-flex h-4 w-4 overflow-hidden" aria-hidden="true">
      <ArrowRight size={16} className="absolute transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-5" />
      <ArrowRight size={16} className="absolute -translate-x-5 transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-0" />
    </span>
  );
}

export function ButtonLink({
  variant = "primary",
  arrow = false,
  children,
  className,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  arrow = false,
  children,
  className,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
