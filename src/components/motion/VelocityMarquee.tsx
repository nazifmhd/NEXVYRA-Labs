"use client";

import { Fragment, useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

function Separator() {
  return (
    <svg viewBox="0 0 24 24" className="mx-[0.35em] inline-block h-[0.42em] w-[0.42em] shrink-0 text-accent" aria-hidden="true">
      <path d="M12 0 15 9 24 12 15 15 12 24 9 15 0 12 9 9Z" fill="currentColor" />
    </svg>
  );
}

function Sequence({ items }: { items: string[] }) {
  return (
    <span className="flex shrink-0 items-center pr-[0.35em]">
      {items.map((t) => (
        <Fragment key={t}>
          <span className="whitespace-nowrap">{t}</span>
          <Separator />
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Two counter-running bands of capability names. Drifts slowly on its own;
 * scroll speed adds momentum and scroll direction steers it. Pauses offscreen.
 * Decorative (the same content is navigable elsewhere), so aria-hidden.
 */
export function VelocityMarquee({ items, className }: { items: string[]; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const rows = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    const el = wrap.current;
    const tracks = rows.map((r) => r.current);
    if (!el || tracks.some((t) => !t) || prefersReducedMotion()) return;

    const x = [0, -200];
    let lastY = window.scrollY;
    let v = 0;
    let dir = 1;
    let raf = 0;
    let running = false;

    const loop = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      v += (dy - v) * 0.12;
      if (Math.abs(v) > 0.3) dir = v > 0 ? 1 : -1;
      const speed = 0.55 + Math.min(Math.abs(v) * 0.4, 14);
      tracks.forEach((t, i) => {
        const w = t!.scrollWidth / 2;
        if (w <= 0) return;
        x[i] += speed * dir * (i === 0 ? -1 : 1);
        while (x[i] <= -w) x[i] += w;
        while (x[i] > 0) x[i] -= w;
        t!.style.transform = `translate3d(${x[i].toFixed(2)}px,0,0) skewX(${(-v * 0.15 * (i === 0 ? 1 : -1)).toFixed(2)}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        lastY = window.scrollY;
        raf = requestAnimationFrame(loop);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden select-none", className)} aria-hidden="true">
      <div className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[1.05] font-medium tracking-[-0.03em]">
        <div ref={rows[0]} className="flex w-max text-navy will-change-transform">
          <Sequence items={items} />
          <Sequence items={items} />
        </div>
        <div ref={rows[1]} className="stroke-text flex w-max will-change-transform [--stroke-color:rgb(23_105_170/0.45)]">
          <Sequence items={[...items].reverse()} />
          <Sequence items={[...items].reverse()} />
        </div>
      </div>
    </div>
  );
}
