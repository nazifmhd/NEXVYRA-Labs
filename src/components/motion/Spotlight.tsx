"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Cursor-following light on every `.spot-card` inside: a soft field glow plus
 * an illuminated edge, as if the cards were lit by an inspection lamp.
 * Desktop fine pointers only. Pass tone="dark" on navy sections.
 */
export function Spotlight({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      el.querySelectorAll<HTMLElement>(".spot-card").forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", `${px - r.left}px`);
        card.style.setProperty("--y", `${py - r.top}px`);
      });
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      el.dataset.spot = "on";
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => delete el.dataset.spot;
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={cn(tone === "dark" ? "spot-dark" : "spot-light", className)}>
      {children}
    </div>
  );
}
