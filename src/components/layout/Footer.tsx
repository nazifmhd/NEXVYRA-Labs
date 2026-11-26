import Link from "next/link";
import { legalNav, primaryNav, siteConfig, socialLinks } from "@/config/site";
import { services } from "@/content/services";
import { insights } from "@/content/insights";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { InView } from "@/components/motion/InView";

export function Footer() {
  const year = new Date().getFullYear();
  const { brand, contact } = siteConfig;
  const socials = socialLinks();
  const nav = primaryNav.filter((i) => i.href !== "/insights" || insights.length > 0);

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <Container className="relative">
        <div className="grid gap-12 border-b border-white/10 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-sky/75">{brand.tagline}</p>
            <p className="mt-6 font-mono text-[0.78rem] tracking-[0.1em] text-sky/60 uppercase">{contact.locationLine}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h2 className="font-mono text-[0.75rem] tracking-[0.16em] text-sky/60 uppercase">Company</h2>
              <ul className="mt-5 space-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[0.95rem] text-white/85 transition-colors hover:text-sky">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[0.75rem] tracking-[0.16em] text-sky/60 uppercase">Services</h2>
              <ul className="mt-5 space-y-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="text-[0.95rem] text-white/85 transition-colors hover:text-sky">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-mono text-[0.75rem] tracking-[0.16em] text-sky/60 uppercase">Connect</h2>
              <ul className="mt-5 space-y-3">
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="text-[0.95rem] text-white/85 hover:text-sky">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="text-[0.95rem] text-white/85 hover:text-sky">
                      {contact.phone}
                    </a>
                  </li>
                )}
                <li>
                  <Link href="/contact" className="inline-flex items-center gap-1.5 text-[0.95rem] text-white/85 hover:text-sky">
                    Project enquiry <ArrowUpRight size={14} />
                  </Link>
                </li>
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[0.95rem] text-white/85 hover:text-sky"
                    >
                      {s.label} <ArrowUpRight size={14} />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <InView className="relative">
        <div
          className="stroke-text pointer-events-none -mb-[0.18em] pt-8 text-center font-display text-[clamp(4rem,17vw,15rem)] leading-none font-semibold tracking-[0.06em] [--stroke-color:rgb(168_216_255/0.28)] select-none"
          aria-hidden="true"
        >
          {brand.wordmark}
        </div>
        <div
          className="sweep-text pointer-events-none absolute inset-0 pt-8 text-center font-display text-[clamp(4rem,17vw,15rem)] leading-none font-semibold tracking-[0.06em] select-none"
          aria-hidden="true"
        >
          {brand.wordmark}
        </div>
        </InView>

        <div className="relative flex flex-col gap-4 border-t border-white/10 py-6 text-[0.85rem] text-sky/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.legalName ?? brand.displayName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-sky">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
