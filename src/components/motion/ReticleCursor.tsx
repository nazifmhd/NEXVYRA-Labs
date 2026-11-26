"use client";

import { useEffect, useRef, useState } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

const INTERACTIVE = "a, button, summary, label, [role='button'], [data-cursor]";
const TEXT_INPUT = "input:not([type='checkbox']):not([type='radio']), textarea, select";

/**
 * An inspection reticle that trails the pointer and locks onto interactive
 * elements (optionally showing a label from data-cursor="View").
 * The native cursor is kept for accessibility; this only augments it.
 * Desktop fine pointers only; off for reduced motion.
 */
export function ReticleCursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isFinePointer() && !prefersReducedMotion()) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    let tx = -100, ty = -100, rx = -100, ry = -100;
    let raf = 0;

    const loop = () => {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      if (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1) raf = requestAnimationFrame(loop);
      else raf = 0;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      if (!ring.dataset.visible) {
        rx = tx;
        ry = ty;
        ring.dataset.visible = dot.dataset.visible = "true";
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || !(t instanceof Element)) return;
      if (t.closest(TEXT_INPUT)) {
        ring.dataset.hidden = dot.dataset.hidden = "true";
        return;
      }
      delete ring.dataset.hidden;
      delete dot.dataset.hidden;
      const hit = t.closest<HTMLElement>(INTERACTIVE);
      if (hit) {
        ring.dataset.hover = "true";
        const text = hit.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
        label.textContent = text;
        if (text) ring.dataset.label = "true";
        else delete ring.dataset.label;
        // Dark surfaces get the light variant via mix-blend; nothing else needed.
      } else {
        delete ring.dataset.hover;
        delete ring.dataset.label;
      }
    };

    const down = () => (ring.dataset.press = "true");
    const up = () => delete ring.dataset.press;
    const leave = () => {
      delete ring.dataset.visible;
      delete dot.dataset.visible;
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="reticle" aria-hidden="true">
        <div className="reticle-ring">
          <span className="reticle-tick top-[-6px] left-1/2 h-[5px] w-px -translate-x-1/2" />
          <span className="reticle-tick bottom-[-6px] left-1/2 h-[5px] w-px -translate-x-1/2" />
          <span className="reticle-tick top-1/2 left-[-6px] h-px w-[5px] -translate-y-1/2" />
          <span className="reticle-tick top-1/2 right-[-6px] h-px w-[5px] -translate-y-1/2" />
        </div>
        <span ref={labelRef} className="reticle-label" />
      </div>
      <div ref={dotRef} className="reticle reticle-dot-wrap" aria-hidden="true">
        <div className="reticle-dot" />
      </div>
    </>
  );
}
