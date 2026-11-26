"use client";

import { useEffect, useRef } from "react";

/**
 * A "probe" that lights up the blueprint grid around the cursor, like an
 * inspection lens. Desktop fine pointers only. Purely decorative.
 * Render as a direct child of a positioned section; it listens on its parent.
 */
export function PointerProbe() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--px", `${x}px`);
        el.style.setProperty("--py", `${y}px`);
        el.dataset.active = "true";
      });
    };
    const leave = () => {
      delete el.dataset.active;
    };
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <div ref={ref} className="probe pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />;
}
