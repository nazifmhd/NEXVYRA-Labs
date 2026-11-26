import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CoreFallback } from "@/components/visuals/CoreFallback";

export const metadata = { title: "Page not found", robots: { index: false } };

const links = [
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[85svh] items-center overflow-hidden bg-gradient-to-b from-mist to-white pt-[4.5rem]">
      <div className="bp-grid fade-mask pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <Container>
        <div className="grid items-center gap-10 py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[0.78rem] tracking-[0.14em] text-action uppercase">Error 404 · Signal lost</p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.02] font-medium text-navy">
              This page isn’t part of the system.
            </h1>
            <p className="mt-6 max-w-lg text-[1.1rem] leading-relaxed text-muted">
              The link may be out of date, or the address mistyped. These routes will get you back on track:
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block rounded-full border border-line bg-white px-4 py-2 text-[0.95rem] text-navy hover:border-action/50 hover:text-action">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href="/" arrow className="mt-9">
              Back to home
            </ButtonLink>
          </div>
          <div className="mx-auto w-64 opacity-70 grayscale-[30%] lg:col-span-5 lg:w-80" aria-hidden="true">
            <CoreFallback />
          </div>
        </div>
      </Container>
    </section>
  );
}
