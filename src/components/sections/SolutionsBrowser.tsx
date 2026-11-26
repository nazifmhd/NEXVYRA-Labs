"use client";

import Link from "next/link";
import { useState } from "react";
import type { Solution } from "@/content/solutions";
import type { ServiceSlug } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

type Svc = { slug: ServiceSlug; title: string };

/** Filterable solutions list. Without JS every solution is shown. */
export function SolutionsBrowser({ solutions, services }: { solutions: Solution[]; services: Svc[] }) {
  const [filter, setFilter] = useState<ServiceSlug | "all">("all");
  const shown = filter === "all" ? solutions : solutions.filter((s) => s.services.includes(filter));
  const tabs: { value: ServiceSlug | "all"; label: string }[] = [{ value: "all", label: "All solutions" }, ...services.map((s) => ({ value: s.slug, label: s.title }))];

  return (
    <div>
      <div role="group" aria-label="Filter solutions by service" className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count = t.value === "all" ? solutions.length : solutions.filter((s) => s.services.includes(t.value as ServiceSlug)).length;
          return (
            <button
              key={t.value}
              type="button"
              aria-pressed={filter === t.value}
              onClick={() => setFilter(t.value)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-[0.92rem] transition-colors",
                filter === t.value ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-action/50",
              )}
            >
              {t.label}
              <span className={cn("font-mono text-[0.72rem]", filter === t.value ? "text-sky" : "text-muted")}>{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} solution{shown.length === 1 ? "" : "s"}
      </p>

      <ol className="mt-10 space-y-5">
        {shown.map((s, i) => (
          <li key={`${filter}-${s.slug}`} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <article id={s.slug} className="spot-card scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-line">
              <div className="grid lg:grid-cols-12">
                <div className="relative bg-mist p-8 sm:p-10 lg:col-span-5">
                  <div className="bp-grid-fine pointer-events-none absolute inset-0" aria-hidden="true" />
                  <div className="relative">
                    <p className="flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.14em] text-muted uppercase">
                      {s.code}
                      <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[0.65rem]">Illustrative</span>
                    </p>
                    <h2 className="mt-6 font-display text-[clamp(1.6rem,2.8vw,2.3rem)] leading-tight font-medium text-navy">{s.title}</h2>
                    <p className="mt-6 font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">The problem</p>
                    <p className="mt-2 text-[1.02rem] leading-relaxed text-navy/85">{s.problem}</p>
                  </div>
                </div>
                <div className="flex flex-col bg-white p-8 sm:p-10 lg:col-span-7">
                  <p className="font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">Proposed approach</p>
                  <p className="mt-2 text-[1.06rem] leading-relaxed text-muted">{s.approach}</p>
                  <p className="mt-8 font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">What it aims to improve</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                    {s.benefits.map((b) => (
                      <li key={b} className="rounded-xl bg-mist px-4 py-3 text-[0.94rem] leading-snug text-navy">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-9">
                    <ul className="flex flex-wrap gap-2" aria-label="Related services">
                      {s.services.map((slug) => {
                        const svc = services.find((x) => x.slug === slug);
                        return svc ? (
                          <li key={slug}>
                            <Link
                              href={`/services/${slug}`}
                              className="inline-block rounded-full border border-line px-3 py-1.5 text-[0.84rem] text-action transition-colors hover:border-action/50 hover:bg-mist"
                            >
                              {svc.title}
                            </Link>
                          </li>
                        ) : null;
                      })}
                    </ul>
                    <ButtonLink href={`/contact?type=project&services=${s.services.join(",")}`} variant="ghost" arrow className="text-action">
                      Discuss this
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
