"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Marks a region data-inview="true|false" so looping CSS animations inside it
 * pause while off-screen (blueprint §7.2: pause offscreen animation).
 */
export function InView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.inview = e.isIntersecting ? "true" : "false";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
