import type { ServiceSlug } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

/**
 * Small schematic glyphs per pillar — original line drawings, decorative only.
 * Every stroke has pathLength=1 so it can "draw itself" when revealed (see .draw-svg).
 */
export function ServiceGlyph({ slug, className }: { slug: ServiceSlug; className?: string }) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className: cn("draw-svg h-14 w-14", className),
  };
  const L = 1;

  switch (slug) {
    case "ai-engineering":
      return (
        <svg {...common}>
          <path pathLength={L} d="M32 8 52 20v24L32 56 12 44V20Z" strokeOpacity=".35" />
          <path pathLength={L} d="M32 20 42 26v12L32 44 22 38V26Z" />
          <path pathLength={L} d="M32 8v12M52 20l-10 6M52 44l-10-6M32 56V44M12 44l10-6M12 20l10 6" strokeOpacity=".55" />
          <circle cx="32" cy="32" r="3" fill="currentColor" />
        </svg>
      );
    case "software-engineering":
      return (
        <svg {...common}>
          <path pathLength={L} d="M10 22 32 11l22 11-22 11Z" />
          <path pathLength={L} d="m10 32 22 11 22-11" strokeOpacity=".6" />
          <path pathLength={L} d="m10 42 22 11 22-11" strokeOpacity=".35" />
          <path pathLength={L} d="m27 22 5 3 5-3" />
        </svg>
      );
    case "intelligent-automation":
      return (
        <svg {...common}>
          <rect pathLength={L} x="8" y="12" width="14" height="10" rx="2" />
          <rect pathLength={L} x="42" y="12" width="14" height="10" rx="2" strokeOpacity=".6" />
          <rect pathLength={L} x="25" y="42" width="14" height="10" rx="2" />
          <path pathLength={L} d="M22 17h20M49 22v8c0 4-3 7-7 7H32v5M15 22v8c0 4 3 7 7 7h4" strokeOpacity=".6" />
          <circle cx="32" cy="17" r="2.2" fill="currentColor" />
        </svg>
      );
    case "digital-innovation":
      return (
        <svg {...common}>
          <circle pathLength={L} cx="32" cy="32" r="8" />
          <ellipse pathLength={L} cx="32" cy="32" rx="24" ry="10" strokeOpacity=".55" />
          <ellipse pathLength={L} cx="32" cy="32" rx="24" ry="10" transform="rotate(60 32 32)" strokeOpacity=".35" />
          <ellipse pathLength={L} cx="32" cy="32" rx="24" ry="10" transform="rotate(-60 32 32)" strokeOpacity=".35" />
          <circle cx="56" cy="32" r="2.2" fill="currentColor" />
        </svg>
      );
  }
}
