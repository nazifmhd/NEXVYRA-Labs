"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

type Tag = "div" | "section" | "li" | "article" | "ol" | "ul" | "span" | "p";

/**
 * Fades/translates content in once when it enters the viewport.
 * Content is visible without JS and under prefers-reduced-motion (see globals.css).
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: Tag;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      // The large top margin counts anything already scrolled past as "seen",
      // so content skipped during a fast scroll or jump is never left hidden.
      { rootMargin: "10000px 0px -8% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Polymorphic tag: typed as "div" for JSX; ref/attributes are valid on every allowed tag.
  const Comp = as as "div";
  return (
    <Comp
      ref={ref as RefObject<HTMLDivElement>}
      data-reveal=""
      className={className}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Comp>
  );
}
