"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { bootDelay } from "@/lib/motion";

const GLYPHS = "01<>/{}[]=+*#%ΔΣλ∴NXVYRA";

/** Deterministic glyph so server and client render identical markup. */
const seedGlyph = (i: number, len: number) => GLYPHS[(i * 7 + len * 3) % GLYPHS.length];

/**
 * Text that "compiles" into place: each character starts as a mono glyph and
 * resolves left-to-right. Character widths come from the final text, so there is no layout shift.
 * Screen readers get the plain text; the animated cells are aria-hidden.
 */
export function DecodeText({
  text,
  delay = 0,
  duration = 900,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // Phones and reduced motion get the plain headline immediately (fast first paint).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) {
      root.dataset.done = "true";
      return;
    }
    delete root.dataset.done; // effects can re-run (Strict Mode); restart cleanly
    const cells = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-ch]"));
    cells.forEach((c) => delete c.dataset.resolved);
    const n = cells.length;
    const start0 = delay + bootDelay();
    const resolveAt = cells.map((_, i) => start0 + (i / Math.max(1, n - 1)) * duration * 0.75 + Math.random() * duration * 0.25);
    let raf = 0;
    let start = 0;
    let last = 0;

    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      if (t - last > 50) {
        last = t;
        let pending = 0;
        cells.forEach((cell, i) => {
          if (cell.dataset.resolved) return;
          if (elapsed >= resolveAt[i]) {
            cell.dataset.resolved = "true";
          } else {
            pending++;
            if (elapsed > start0 - 250) {
              const g = cell.lastElementChild as HTMLSpanElement | null;
              if (g) g.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
          }
        });
        if (pending === 0) {
          root.dataset.done = "true";
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.dataset.done = "true";
    };
  }, [delay, duration]);

  const chars = Array.from(text);
  return (
    <span ref={ref} className={cn("decode-root", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((ch, i) =>
          ch === " " ? (
            " "
          ) : (
            <span key={i} data-ch="" className="decode-cell">
              <span className="decode-final">{ch}</span>
              <span className="decode-glyph">{seedGlyph(i, chars.length)}</span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}
