import { processSteps } from "@/content/process";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { InView } from "@/components/motion/InView";

/**
 * "Signal path" — six stages on a connecting line that draws itself in.
 * Fully understandable with the animation disabled.
 */
export function ProcessPath({ index = "04", showLink = true }: { index?: string; showLink?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-mist py-24 sm:py-32" aria-labelledby="process-title">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <Container className="relative">
        <SectionHeader
          index={index}
          label="Process"
          title={<span id="process-title">From possibility to production.</span>}
          intro="A six-stage delivery model with a tangible artefact at every step, so you always know where the work stands and what comes next."
        />

        <InView>
        <Reveal className="relative mt-16">
          {/* Desktop horizontal line */}
          <div className="absolute top-[0.6875rem] right-0 left-0 hidden h-px overflow-x-clip bg-navy/10 lg:block" aria-hidden="true">
            <div className="signal-line h-full bg-gradient-to-r from-action via-accent to-sky" />
            {/* Travelling signal */}
            <span className="process-pulse absolute inset-0">
              <span className="absolute top-1/2 right-0 h-[3px] w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent to-white" />
              <span className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgb(54_140_235/0.7)]" />
            </span>
          </div>
          {/* Mobile vertical line */}
          <div className="absolute top-2 bottom-2 left-[0.6875rem] w-px overflow-y-clip bg-navy/10 lg:hidden" aria-hidden="true">
            <div className="signal-line-v h-full w-full bg-gradient-to-b from-action via-accent to-sky" />
            <span className="process-pulse-v absolute inset-0">
              <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgb(54_140_235/0.7)]" />
            </span>
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-6 lg:gap-6">
            {processSteps.map((step, i) => (
              <li key={step.title} className="relative pl-10 lg:pl-0" style={{ "--i": i } as React.CSSProperties}>
                <span
                  className="process-node absolute top-0 left-0 flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full border border-action/40 bg-white lg:relative"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-action" />
                </span>
                <div className="process-step">
                  <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted lg:mt-6">STAGE {step.index}</p>
                  <h3 className="mt-2 font-display text-[1.4rem] font-medium text-navy">{step.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.summary}</p>
                  <p className="mt-4 inline-flex rounded-md border border-line bg-white px-2.5 py-1.5 text-[0.8rem] leading-snug text-navy">
                    <span className="sr-only">Artefact: </span>
                    {step.artefact}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        </InView>

        {showLink && (
          <div className="mt-14">
            <ButtonLink href="/process" variant="secondary" arrow>
              How we work in detail
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}
