"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Subtle magnetic pull toward the cursor for primary CTAs.
 * Desktop fine pointers only; disabled for reduced motion and touch (blueprint §7).
 */
export function Magnetic({ children, strength = 0.22, max = 8 }: { children: ReactNode; strength?: number; max?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = clamp((e.clientX - (r.left + r.width / 2)) * strength);
      const dy = clamp((e.clientY - (r.top + r.height / 2)) * strength);
      el.style.transition = "transform 0.15s ease-out";
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };
    const leave = () => {
      el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "translate3d(0, 0, 0)";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength, max]);

  return (
    <span ref={ref} className="inline-block will-change-transform">
      {children}
    </span>
  );
}
