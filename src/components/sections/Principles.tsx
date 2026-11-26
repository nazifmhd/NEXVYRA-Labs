import { principles } from "@/content/principles";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { CoreFallback } from "@/components/visuals/CoreFallback";
import { CircuitTraces } from "@/components/visuals/CircuitTraces";
import { InView } from "@/components/motion/InView";

export function Principles({ index = "05" }: { index?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy py-24 text-white sm:py-32" aria-labelledby="principles-title">
      <div className="bp-grid-dark pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <InView className="pointer-events-none absolute inset-0 -z-10">
        <CircuitTraces className="absolute inset-0 h-full w-full" />
        <div className="absolute -right-40 -bottom-40 w-[36rem] opacity-[0.18] mix-blend-screen" aria-hidden="true">
          <CoreFallback className="spin-slow" />
        </div>
      </InView>
      <Container>
        <SectionHeader
          index={index}
          tone="dark"
          label="Why NEXVYRA"
          title={<span id="principles-title">Principles we engineer by.</span>}
          intro="Not slogans — working rules that shape how we scope, build and support every engagement."
        />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.code} delay={(i % 3) * 80} className="group bg-navy p-7 transition-colors duration-500 hover:bg-[#13324f] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.72rem] tracking-[0.14em] text-sky/70">{p.code}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </div>
              <h3 className="mt-8 font-display text-[1.35rem] font-medium text-white">{p.title}</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-sky/75">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
