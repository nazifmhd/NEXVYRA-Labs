import type { CSSProperties } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IntelligenceCore } from "@/components/visuals/IntelligenceCore";
import { DecodeText } from "@/components/motion/DecodeText";
import { PointerProbe } from "@/components/motion/PointerProbe";
import { Magnetic } from "@/components/motion/Magnetic";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const primary = projects.length > 0 ? { label: "Explore Our Work", href: "/projects" } : { label: "Explore Our Services", href: "/services" };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-mist via-white to-white pt-[4.5rem]">
      <div className="bp-grid fade-mask pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <PointerProbe />
      {/* Slow scan line sweeping the blueprint */}
      <InView className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="scanline absolute inset-0" aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-sky/25" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </div>
      </InView>
      <div
        className="pointer-events-none absolute top-[-20%] right-[-10%] -z-10 h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(168_216_255/0.55),transparent)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid items-center gap-8 pt-12 pb-16 sm:pt-16 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:gap-6 lg:pt-6 lg:pb-20">
          <Parallax className="lg:col-span-7" y={140} fade={1.1}>
            <p className="animate-rise inline-flex items-center gap-3 rounded-full border border-line bg-white/70 py-1.5 pr-4 pl-1.5 font-mono text-[0.75rem] tracking-[0.14em] text-navy uppercase backdrop-blur" style={d(0)}>
              <span className="pulse-dot h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              The next era of technology
            </p>

            <h1 className="mt-7 font-display text-[clamp(2.75rem,7.2vw,6.25rem)] leading-[0.95] font-medium tracking-[-0.035em] text-navy">
              <span className="animate-rise block" style={d(80)}>
                <DecodeText text="Engineering" delay={150} duration={850} />
              </span>
              <span className="animate-rise block" style={d(160)}>
                <DecodeText text="Intelligence." delay={420} duration={950} className="ink-gradient" />
              </span>
              <span className="animate-rise mt-2 block text-[0.62em] leading-[1.05] tracking-[-0.02em] text-navy/80" style={d(260)}>
                <DecodeText text="Building Tomorrow." delay={800} duration={900} />
              </span>
            </h1>

            <p className="animate-rise mt-7 max-w-[34rem] text-[1.125rem] leading-relaxed text-muted sm:text-[1.2rem]" style={d(360)}>
              We build intelligent AI systems and powerful software solutions that help businesses innovate, automate and move forward.
            </p>

            <div className="animate-rise mt-9 flex flex-wrap items-center gap-3" style={d(440)}>
              <Magnetic>
                <ButtonLink href={primary.href} arrow>
                  {primary.label}
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="/contact" variant="secondary">
                Start a Conversation
              </ButtonLink>
            </div>
          </Parallax>

          <Parallax className="relative lg:col-span-5" y={70} scale={0.12} fade={0.6}>
            <div className="frame-marks relative mx-auto max-w-[min(30rem,85vw)] p-5 sm:p-7">
              <div className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase">
                <span>FIG. 01 — Intelligence Core</span>
                <span className="text-action">● Live</span>
              </div>
              <IntelligenceCore className="mt-3" />
            </div>
          </Parallax>
        </div>

        {/* Capability rail */}
        <div className="relative -mt-4 border-t border-line pb-10 lg:mt-0">
          <ul className="grid grid-cols-2 gap-y-6 pt-6 md:grid-cols-4">
            {services.map((s, i) => (
              <li key={s.slug} className="animate-rise pr-4" style={d(600 + i * 90)}>
                <Link href={`/services/${s.slug}`} className="group relative block">
                  <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted transition-colors group-hover:text-action">{s.index}</span>
                  <span className="mt-1 block font-display text-[1.02rem] text-navy transition-colors group-hover:text-action">
                    {s.title}
                  </span>
                  <span className="absolute -top-[1.55rem] left-0 h-px w-0 bg-action transition-[width] duration-500 ease-[var(--ease-expo)] group-hover:w-full" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
