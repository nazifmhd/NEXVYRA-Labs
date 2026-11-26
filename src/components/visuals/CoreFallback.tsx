import { cn } from "@/lib/utils";

/**
 * Static Intelligence Core — painted immediately (good LCP), and the
 * permanent visual when canvas is unavailable or motion is reduced to none.
 * An icosahedron seen vertex-on: hexagonal silhouette with inner facets.
 */
export function CoreFallback({ className }: { className?: string }) {
  const outer = "200,70 312.6,135 312.6,265 200,330 87.4,265 87.4,135";
  const inner = "200,135 256.3,232.5 143.7,232.5";
  return (
    <svg viewBox="0 0 400 400" className={cn("h-full w-full", className)} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="cf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#368CEB" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#A8D8FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D9EEFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cf-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#A8D8FF" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="cf-face2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9EEFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#368CEB" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#cf-glow)" />
      <ellipse cx="200" cy="200" rx="178" ry="52" fill="none" stroke="#1769AA" strokeOpacity="0.22" transform="rotate(-18 200 200)" />
      <ellipse cx="200" cy="200" rx="160" ry="40" fill="none" stroke="#368CEB" strokeOpacity="0.18" transform="rotate(24 200 200)" />
      <polygon points={outer} fill="url(#cf-face)" stroke="#1769AA" strokeOpacity="0.5" strokeWidth="1.2" />
      <polygon points="200,70 312.6,135 200,135" fill="url(#cf-face2)" />
      <polygon points="312.6,265 200,330 256.3,232.5" fill="url(#cf-face2)" />
      <polygon points="87.4,265 87.4,135 143.7,232.5" fill="url(#cf-face2)" />
      <polygon points={inner} fill="#FFFFFF" fillOpacity="0.55" stroke="#1769AA" strokeOpacity="0.55" strokeWidth="1.2" />
      <g stroke="#1769AA" strokeOpacity="0.42" strokeWidth="1">
        <path d="M200 135 L200 70 M200 135 L312.6 135 M200 135 L87.4 135" />
        <path d="M256.3 232.5 L312.6 135 M256.3 232.5 L312.6 265 M256.3 232.5 L200 330" />
        <path d="M143.7 232.5 L87.4 135 M143.7 232.5 L87.4 265 M143.7 232.5 L200 330" />
      </g>
      <circle cx="200" cy="200" r="26" fill="#368CEB" fillOpacity="0.35" />
      <circle cx="200" cy="200" r="9" fill="#FFFFFF" />
      <g fill="#102B46">
        {[
          [200, 70], [312.6, 135], [312.6, 265], [200, 330], [87.4, 265], [87.4, 135],
          [200, 135], [256.3, 232.5], [143.7, 232.5],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" />
        ))}
      </g>
      <circle cx="362" cy="148" r="4" fill="#368CEB" />
      <circle cx="58" cy="262" r="3" fill="#1769AA" />
    </svg>
  );
}
