import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PageHero({
  label,
  title,
  intro,
  crumbs,
  aside,
  children,
}: {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: { name: string; path: string }[];
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-mist to-white pt-[4.5rem]">
      <div className="bp-grid fade-mask pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <Container>
        <div className="pt-10 pb-16 sm:pt-14 sm:pb-20">
          <Breadcrumbs items={crumbs} />
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className={aside ? "lg:col-span-8" : "lg:col-span-10"}>
              <SectionLabel>{label}</SectionLabel>
              <h1 className="animate-rise mt-5 font-display text-[clamp(2.4rem,5.6vw,4.75rem)] leading-[1] font-medium tracking-[-0.03em] text-navy">
                {title}
              </h1>
              {intro && (
                <div className="animate-rise mt-7 max-w-2xl text-[1.12rem] leading-relaxed text-muted" style={{ "--d": "120ms" } as CSSProperties}>
                  {intro}
                </div>
              )}
              {children}
            </div>
            {aside && <div className="lg:col-span-4">{aside}</div>}
          </div>
        </div>
      </Container>
    </section>
  );
}
