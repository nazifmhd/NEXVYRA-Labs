"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceSlug } from "@/lib/validation/contact";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";

type Item = { slug: ServiceSlug; index: string; title: string; kicker: string };

/**
 * A floating "specimen" panel that trails the cursor over the capability
 * index, showing the hovered service's schematic drawing itself.
 * Purely supplementary: every row already shows its full information.
 * Must be rendered inside a `relative` container that wraps rows marked [data-preview="i"].
 */
export function CapabilityPreview({ items }: { items: Item[] }) {
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isFinePointer() && !prefersReducedMotion() && window.innerWidth >= 1024) setEnabled(true);
  }, []);

  useEffect(() => {
    const p = panel.current;
    const host = p?.parentElement;
    if (!enabled || !p || !host) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, first = true;
    const loop = () => {
      const dx = tx - x;
      x += dx * 0.14;
      y += (ty - y) * 0.14;
      const rot = Math.max(-10, Math.min(10, dx * 0.06));
      p.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      raf = Math.abs(dx) > 0.2 || Math.abs(ty - y) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const hr = host.getBoundingClientRect();
      tx = e.clientX - hr.left + 28;
      ty = e.clientY - hr.top - 130;
      if (first) {
        x = tx;
        y = ty;
        first = false;
      }
      const row = (e.target as Element).closest<HTMLElement>("[data-preview]");
      setActive(row ? Number(row.dataset.preview) : null);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      setActive(null);
      first = true;
    };
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={panel}
      aria-hidden="true"
      data-on={active !== null ? "true" : undefined}
      className="preview-panel pointer-events-none absolute top-0 left-0 z-20 h-64 w-56 overflow-hidden rounded-2xl bg-navy text-sky shadow-[0_30px_60px_-20px_rgb(16_43_70/0.55)]"
    >
      <div className="bp-grid-dark absolute inset-0" />
      {items.map((it, i) => (
        <div key={it.slug} className="preview-layer absolute inset-0 flex flex-col justify-between p-5" data-on={active === i ? "true" : undefined}>
          <div className="flex justify-between font-mono text-[0.65rem] tracking-[0.14em] text-sky/70 uppercase">
            <span>FIG. {it.index}</span>
            <span>● Spec</span>
          </div>
          <ServiceGlyph slug={it.slug} className="mx-auto h-28 w-28 text-sky" />
          <div>
            <p className="font-display text-[1.05rem] text-white">{it.title}</p>
            <p className="mt-1 font-mono text-[0.62rem] leading-snug tracking-[0.08em] text-sky/60 uppercase">{it.kicker}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
