/**
 * Central brand & company configuration (blueprint §24).
 *
 * The brand name is PROVISIONAL pending company-name, domain and trademark
 * clearance. Never hard-code the name elsewhere — import from here.
 *
 * Contact / social values are `null` until verified. Components render a
 * channel only when its value is set, so nothing unverified is published.
 */

export const siteConfig = {
  brand: {
    displayName: "NEXVYRA Labs",
    wordmark: "NEXVYRA",
    wordmarkSub: "LABS",
    /** Registered legal entity name — TBD. Shown in footer/legal pages only when set. */
    legalName: null as string | null,
    tagline: "Engineering Intelligence. Building Tomorrow.",
    description:
      "NEXVYRA Labs is an AI engineering and software technology company. We engineer intelligent systems and dependable software that help businesses solve complex problems, operate smarter and build what’s next.",
    logoMark: "/brand/nexvyra-mark.jpg",
  },

  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  contact: {
    email: null as string | null,
    phone: null as string | null,
    /** Publish only if approved. */
    address: null as string | null,
    /** Location wording (blueprint: Sri Lanka + international, global-first). */
    locationLine: "Based in Sri Lanka · Working with teams worldwide",
  },

  social: {
    linkedin: null as string | null,
    github: null as string | null,
    instagram: null as string | null,
  },

  serviceAreas: ["Sri Lanka", "International (remote)"],

  legal: {
    /** Flip to true once privacy/terms have had qualified legal review. */
    reviewed: false,
    lastUpdated: "26 November 2026",
  },
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Process", href: "/process" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const companyExtraNav: NavItem[] = [{ label: "Careers", href: "/careers" }];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

export function socialLinks() {
  const s = siteConfig.social;
  return [
    s.linkedin && { label: "LinkedIn", href: s.linkedin },
    s.github && { label: "GitHub", href: s.github },
    s.instagram && { label: "Instagram", href: s.instagram },
  ].filter(Boolean) as NavItem[];
}
