import { cn } from "@/lib/utils";

/**
 * Miniature Intelligence Core used as the assistant's identity: a glass
 * hexagon with an orbiting node. Spins faster while `busy` (CSS-only).
 */
export function CoreOrb({ busy = false, className }: { busy?: boolean; className?: string }) {
  return (
    <span className={cn("core-orb relative inline-block", className)} data-busy={busy ? "true" : undefined} aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(54_140_235/0.55),transparent_70%)]" />
      <svg viewBox="0 0 40 40" className="core-orb-shape absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="orb-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#A8D8FF" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <polygon points="20,7 31.3,13.5 31.3,26.5 20,33 8.7,26.5 8.7,13.5" fill="url(#orb-face)" stroke="#1769AA" strokeOpacity=".6" strokeWidth=".8" />
        <polygon points="20,13.5 25.6,23.2 14.4,23.2" fill="#FFFFFF" fillOpacity=".7" stroke="#1769AA" strokeOpacity=".55" strokeWidth=".7" />
        <path d="M20 13.5V7M25.6 23.2l5.7 3.3M14.4 23.2l-5.7 3.3" stroke="#1769AA" strokeOpacity=".45" strokeWidth=".7" />
        <circle cx="20" cy="20" r="2.4" fill="#368CEB" />
      </svg>
      <span className="core-orb-orbit absolute inset-[-3px]">
        <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_6px_1px_rgb(54_140_235/0.8)]" />
      </span>
    </span>
  );
}
