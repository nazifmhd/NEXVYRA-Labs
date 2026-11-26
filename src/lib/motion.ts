/** Shared motion helpers. All are no-ops on the server. */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/** Extra delay while the first-visit boot intro is playing (see layout inline script). */
export const BOOT_MS = 1350;
export const bootDelay = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("boot") ? BOOT_MS : 0;

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * Calls `cb` with the element's rect on scroll/resize, rAF-throttled, and only
 * while the element is near the viewport. Returns a cleanup function.
 */
export function onScrollFrame(el: Element, cb: (rect: DOMRect, vh: number) => void) {
  let active = false;
  let raf = 0;
  const run = () => {
    raf = 0;
    cb(el.getBoundingClientRect(), window.innerHeight);
  };
  const schedule = () => {
    if (active && !raf) raf = requestAnimationFrame(run);
  };
  const io = new IntersectionObserver(
    ([e]) => {
      active = e.isIntersecting;
      if (active) schedule();
    },
    { rootMargin: "200px 0px" },
  );
  io.observe(el);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  run();
  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}
