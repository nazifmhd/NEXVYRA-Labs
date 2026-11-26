import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

/** Lab-style index label, e.g. "[02] Capabilities". Its rule line draws in like a dimension line. */
export function SectionLabel({
  index,
  children,
  tone = "light",
  className,
}: {
  index?: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Reveal
      as="p"
      className={cn(
        "flex items-center gap-3 font-mono text-[0.78rem] tracking-[0.14em] uppercase",
        tone === "light" ? "text-action" : "text-sky",
        className,
      )}
    >
      <span className="relative flex h-2 w-8 items-center" aria-hidden="true">
        <span className={cn("signal-line h-px w-full", tone === "light" ? "bg-action/60" : "bg-sky/60")} />
        <span className={cn("absolute right-0 h-2 w-px", tone === "light" ? "bg-action/60" : "bg-sky/60")} />
      </span>
      {index && <span className={tone === "light" ? "text-muted" : "text-sky/60"}>[{index}]</span>}
      <span>{children}</span>
    </Reveal>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  intro,
  tone = "light",
  align = "split",
  className,
  as: Heading = "h2",
}: {
  index?: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "split" | "stack";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        align === "split" && "lg:grid-cols-12 lg:items-end lg:gap-12",
        className,
      )}
    >
      <div className={cn(align === "split" && "lg:col-span-7")}>
        <SectionLabel index={index} tone={tone}>
          {label}
        </SectionLabel>
        <Reveal className="scan-reveal mt-5">
          <Heading
            className={cn(
              "text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.04] font-medium",
              tone === "light" ? "text-navy" : "text-white",
            )}
          >
            {title}
          </Heading>
        </Reveal>
      </div>
      {intro && (
        <Reveal
          delay={150}
          className={cn(
            "max-w-xl text-[1.0625rem] leading-relaxed",
            align === "split" && "lg:col-span-5 lg:justify-self-end",
            tone === "light" ? "text-muted" : "text-sky/80",
          )}
        >
          {intro}
        </Reveal>
      )}
    </div>
  );
}
