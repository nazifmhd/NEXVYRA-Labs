import { pageMetadata } from "@/lib/seo";
import { processSteps } from "@/content/process";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { InView } from "@/components/motion/InView";
import { Principles } from "@/components/sections/Principles";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata = pageMetadata({
  title: "Our Process",
  description:
    "How NEXVYRA Labs delivers: Discover, Strategize, Design, Engineer, Deploy and Evolve — with a clear client-facing artefact at every stage.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageHero
        label="Our process"
        crumbs={[{ name: "Process", path: "/process" }]}
        title={<>From possibility to production.</>}
        intro="Six stages, each ending in something tangible you can review. The model flexes to the size of the engagement, but the discipline doesn’t."
      />

      <section className="bg-white pb-24 sm:pb-32" aria-label="Delivery stages">
        <Container>
          <InView>
          <Reveal className="relative">
            <span className="absolute top-0 bottom-0 left-[1.1rem] w-px overflow-y-clip bg-line md:left-[calc(25%-0.5px)]" aria-hidden="true">
              <span className="signal-line-v block h-full w-full bg-gradient-to-b from-action via-accent to-sky" />
              <span className="process-pulse-v absolute inset-0">
                <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgb(54_140_235/0.7)]" />
              </span>
            </span>
            <ol className="relative">
            {processSteps.map((step, i) => (
              <li key={step.title} style={{ "--i": i } as React.CSSProperties} className="relative grid gap-6 pb-16 pl-12 last:pb-0 md:grid-cols-4 md:gap-12 md:pl-0">
                <span
                  className="process-node absolute top-1 left-[0.45rem] flex h-[1.4rem] w-[1.4rem] items-center justify-center rounded-full border border-action/40 bg-white md:left-[calc(25%-0.7rem)]"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-action" />
                </span>
                <div className="md:pr-10 md:text-right">
                  <p className="font-mono text-[0.75rem] tracking-[0.14em] text-muted">STAGE {step.index}</p>
                  <h2 className="mt-2 font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-none font-medium text-navy">{step.title}</h2>
                </div>
                <div className="md:col-span-3 md:pl-6">
                  <p className="max-w-2xl text-[1.1rem] leading-relaxed text-navy/85">{step.summary}</p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-[1.4fr_1fr]">
                    <div>
                      <p className="font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">What happens</p>
                      <ul className="mt-3 space-y-2">
                        {step.activities.map((a) => (
                          <li key={a} className="flex gap-3 text-[0.98rem] text-muted">
                            <span className="mt-2.5 h-1 w-3 shrink-0 bg-accent/60" aria-hidden="true" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="self-start rounded-2xl border border-line bg-mist p-5">
                      <p className="font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">You receive</p>
                      <p className="mt-2 font-display text-[1.15rem] text-navy">{step.artefact}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            </ol>
          </Reveal>
          </InView>
        </Container>
      </section>

      <Principles index="01" />
      <CtaBand title="Ready for Discover?" body="Every engagement starts with a conversation about your goals and constraints. No commitment, no jargon." />
    </>
  );
}
