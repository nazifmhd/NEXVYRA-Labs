"use client";

import Link from "next/link";
import { useId, useMemo, useState, type CSSProperties } from "react";
import type { Diagram } from "@/content/architecture";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "@/components/ui/Icons";

const W = 1000;
const H = 560;

/**
 * Interactive system diagram. Each component is a real button (keyboard,
 * touch, screen readers); selecting one highlights its connections and shows
 * what it does. Data pulses run along the links. Small screens get a list.
 */
export function ArchitectureDiagram({ diagram, initial, caption }: { diagram: Diagram; initial?: string; caption?: string }) {
  const [selected, setSelected] = useState(initial ?? diagram.nodes[0]?.id);
  const panelId = useId();
  const gradId = `g${panelId.replace(/[^a-zA-Z0-9_-]/g, "")}`; // safe for url(#…)
  const byId = useMemo(() => Object.fromEntries(diagram.nodes.map((n) => [n.id, n])), [diagram]);
  const node = byId[selected];
  const linked = new Set(diagram.edges.filter(([a, b]) => a === selected || b === selected).flat());
  const service = node?.service ? services.find((s) => s.slug === node.service) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Diagram (md+) */}
      <div className="relative hidden overflow-hidden rounded-[1.5rem] border border-line bg-mist md:block lg:col-span-12">
        <div className="bp-grid-fine pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1769AA" />
                <stop offset="100%" stopColor="#368CEB" />
              </linearGradient>
            </defs>
            {diagram.edges.map(([a, b], n) => {
              const A = byId[a];
              const B = byId[b];
              if (!A || !B) return null;
              const on = a === selected || b === selected;
              const d = `M${A.x} ${A.y} L${B.x} ${B.y}`;
              return (
                <g key={`${a}-${b}`}>
                  <path d={d} stroke={on ? "#1769AA" : "rgb(23 105 170 / 0.22)"} strokeWidth={on ? 2 : 1.2} fill="none" className="transition-[stroke] duration-300" />
                  <path
                    d={d}
                    pathLength={100}
                    className="trace-pulse"
                    stroke={`url(#${gradId})`}
                    strokeWidth={on ? 3.5 : 2.5}
                    strokeLinecap="round"
                    fill="none"
                    style={{ "--dur": `${3.2 + (n % 4) * 0.7}s`, "--delay": `${(n * 0.45) % 3}s`, opacity: on ? 1 : 0.55 } as CSSProperties}
                  />
                </g>
              );
            })}
          </svg>

          {diagram.nodes.map((n) => {
            const active = n.id === selected;
            const near = linked.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelected(n.id)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setSelected(n.id)}
                onFocus={() => setSelected(n.id)}
                aria-pressed={active}
                aria-controls={panelId}
                data-cursor="Inspect"
                className={cn(
                  "absolute flex w-[17%] -translate-x-1/2 -translate-y-1/2 flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-300",
                  active
                    ? "z-10 scale-105 border-action bg-navy text-white shadow-[0_18px_40px_-18px_rgb(16_43_70/0.7)]"
                    : near
                      ? "border-action/50 bg-white text-navy"
                      : "border-line bg-white/90 text-navy hover:border-action/40",
                  n.tone === "core" && !active && "ring-2 ring-accent/20",
                  n.tone === "human" && !active && "border-dashed",
                )}
                style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
              >
                <span className="font-display text-[clamp(0.72rem,1.15vw,0.98rem)] leading-tight font-medium">{n.label}</span>
                <span className={cn("mt-0.5 font-mono text-[clamp(0.55rem,0.8vw,0.66rem)] tracking-[0.06em] uppercase", active ? "text-sky/80" : "text-muted")}>
                  {n.sub}
                </span>
              </button>
            );
          })}
        </div>
        {caption && (
          <p className="relative border-t border-line bg-white/70 px-5 py-3 font-mono text-[0.66rem] tracking-[0.1em] text-muted uppercase">{caption}</p>
        )}
      </div>

      {/* List (small screens) */}
      <ul className="grid grid-cols-2 gap-2 md:hidden">
        {diagram.nodes.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => setSelected(n.id)}
              aria-pressed={n.id === selected}
              aria-controls={panelId}
              className={cn(
                "w-full rounded-xl border px-3 py-3 text-left transition-colors",
                n.id === selected ? "border-navy bg-navy text-white" : "border-line bg-white text-navy",
              )}
            >
              <span className="block font-display text-[0.95rem]">{n.label}</span>
              <span className={cn("block font-mono text-[0.62rem] uppercase", n.id === selected ? "text-sky/80" : "text-muted")}>{n.sub}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Detail panel */}
      <div id={panelId} aria-live="polite" className="lg:col-span-12">
        {node && (
          <div key={node.id} className="animate-rise relative overflow-hidden rounded-[1.5rem] bg-navy-950 p-7 text-white sm:p-8">
            <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            {/* Console readout: identity · what it does · examples & owner */}
            <div className="relative grid gap-6 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <p className="font-mono text-[0.68rem] tracking-[0.14em] text-accent uppercase">Component</p>
                <h3 className="mt-3 font-display text-[1.6rem] leading-tight font-medium">{node.label}</h3>
                <p className="mt-1 font-mono text-[0.7rem] tracking-[0.08em] text-sky/60 uppercase">{node.sub}</p>
              </div>
              <p className="text-[1rem] leading-relaxed text-sky/85 md:col-span-5 md:border-l md:border-white/10 md:pl-8">{node.detail}</p>
              <div className="flex flex-col gap-5 md:col-span-4">
                {node.examples && (
                  <ul className="flex flex-wrap gap-2">
                    {node.examples.map((e) => (
                      <li key={e} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.8rem] text-sky">
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
                {service && (
                  <Link
                    href={`/services/${service.slug}`}
                    className="group inline-flex items-center gap-2 text-[0.95rem] text-white hover:text-sky"
                  >
                    Delivered through {service.title}
                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
