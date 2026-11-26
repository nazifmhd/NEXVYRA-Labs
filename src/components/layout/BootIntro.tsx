import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";

const lines = ["› initializing intelligence core", "› linking 12 nodes · 30 edges", "› system ready"];

/**
 * First-visit "system boot" (≈1.9s, once per session). Pure CSS, shown only
 * when the inline head script adds `html.boot` — so it never runs without JS,
 * for reduced motion, or on repeat page views. Non-interactive (pointer-events: none).
 */
export function BootIntro() {
  const word = siteConfig.brand.wordmark;
  return (
    <div className="boot-intro bp-grid-dark" aria-hidden="true">
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.brand.logoMark} alt="" width={64} height={64} className="boot-mark h-16 w-16 rounded-2xl object-cover" />
        <p className="boot-word mt-6 font-display text-[2rem] font-semibold tracking-[0.3em] text-white">
          {Array.from(word).map((c, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {c}
            </span>
          ))}
        </p>
        <div className="mt-6 w-64 font-mono text-[0.72rem] tracking-[0.08em] text-sky/70">
          {lines.map((l, i) => (
            <p key={l} className="boot-line" style={{ "--i": i } as CSSProperties}>
              {l}
            </p>
          ))}
          <div className="boot-bar mt-4 h-px w-full bg-white/10">
            <span className="block h-full w-full bg-gradient-to-r from-accent to-sky" />
          </div>
        </div>
      </div>
    </div>
  );
}
