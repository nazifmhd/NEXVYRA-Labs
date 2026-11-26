"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, onScrollFrame, prefersReducedMotion } from "@/lib/motion";

/**
 * Restrained, scroll-linked depth (never scroll-jacking).
 *  - mode "exit":  as the block scrolls up and away, it lags (y), fades and/or scales.
 *  - mode "enter": as the block enters, it grows from `from` scale and rises from y.
 * The outer element is measured; only the inner element is transformed.
 * Disabled for reduced motion and below `minWidth` (mobile gets a static layout).
 */
export function Parallax({
  children,
  className,
  innerClassName,
  mode = "exit",
  y = 0,
  fade = 0,
  scale = 0,
  from = 0.92,
  minWidth = 768,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  mode?: "exit" | "enter";
  y?: number;
  fade?: number;
  scale?: number;
  from?: number;
  minWidth?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    if (prefersReducedMotion() || window.innerWidth < minWidth) return;

    i.style.willChange = "transform, opacity";
    const stop = onScrollFrame(o, (r, vh) => {
      if (mode === "exit") {
        const e = clamp(-r.top / Math.max(1, r.height));
        i.style.transform = `translate3d(0, ${(e * y).toFixed(1)}px, 0) scale(${(1 + e * scale).toFixed(4)})`;
        if (fade) i.style.opacity = String(clamp(1 - e * fade));
      } else {
        const n = clamp((vh - r.top) / (vh * 0.65));
        const ease = 1 - Math.pow(1 - n, 3);
        i.style.transform = `translate3d(0, ${((1 - ease) * y).toFixed(1)}px, 0) scale(${(from + (1 - from) * ease).toFixed(4)})`;
        if (fade) i.style.opacity = String(clamp(1 - (1 - ease) * fade));
      }
    });
    return () => {
      stop();
      i.style.transform = "";
      i.style.opacity = "";
      i.style.willChange = "";
    };
  }, [mode, y, fade, scale, from, minWidth]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
