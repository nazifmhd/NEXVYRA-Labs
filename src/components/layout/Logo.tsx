import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const { brand } = siteConfig;
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span className="relative block h-9 w-9 overflow-hidden rounded-[10px] ring-1 ring-navy/10 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-[8deg]">
        <Image src={brand.logoMark} alt="" width={72} height={72} className="h-full w-full scale-[1.35] object-cover" priority />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.06rem] font-semibold tracking-[0.18em]",
            tone === "light" ? "text-navy" : "text-white",
          )}
        >
          {brand.wordmark}
        </span>
        <span
          className={cn(
            "mt-1 font-mono text-[0.6rem] tracking-[0.55em]",
            tone === "light" ? "text-action" : "text-sky",
          )}
        >
          <span className="sr-only"> </span>
          {brand.wordmarkSub}
          <span className="sr-only"> home</span>
        </span>
      </span>
    </Link>
  );
}
