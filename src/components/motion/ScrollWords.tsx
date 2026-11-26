"use client";

import { useEffect, useRef } from "react";
import { clamp, onScrollFrame, prefersReducedMotion } from "@/lib/motion";

type Segment = { text: string; className?: string };

/**
 * A statement that "powers up" word by word as it scrolls through the viewport.
 * Scroll-linked (scrolling back dims it again). Plain, fully readable text
 * without JS or with reduced motion.
 */
export function ScrollWords({ segments, id, className }: { segments: Segment[]; id?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    const n = words.length;
    const last = new Array<number>(n).fill(-1);

    const stop = onScrollFrame(el, (r, vh) => {
      const q = clamp((vh * 0.82 - r.top) / (vh * 0.45 + r.height * 0.6));
      for (let i = 0; i < n; i++) {
        const local = clamp(q * (n + 2) - i);
        const v = Math.round((0.14 + 0.86 * local) * 100) / 100;
        if (v !== last[i]) {
          last[i] = v;
          words[i].style.opacity = String(v);
          words[i].style.filter = local < 1 ? `blur(${((1 - local) * 1.2).toFixed(2)}px)` : "";
        }
      }
    });
    return () => {
      stop();
      words.forEach((w) => {
        w.style.opacity = "";
        w.style.filter = "";
      });
    };
  }, []);

  let k = 0;
  return (
    <h2 ref={ref} id={id} className={className}>
      {segments.map((seg, si) => (
        <span key={si} className={seg.className}>
          {seg.text.split(/(\s+)/).map((part) =>
            /^\s+$/.test(part) || part === "" ? (
              part
            ) : (
              <span key={k++} data-w="" className="inline-block transition-[opacity,filter] duration-200">
                {part}
              </span>
            ),
          )}
        </span>
      ))}
    </h2>
  );
}
