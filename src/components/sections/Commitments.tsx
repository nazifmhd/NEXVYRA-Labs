import { commitments } from "@/content/commitments";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";

/** Trust section — only commitments the business has confirmed it keeps. */
export function Commitments({ index }: { index?: string }) {
  return (
    <section className="relative overflow-hidden bg-mist py-24 sm:py-28" aria-labelledby="commit-title">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <Container className="relative">
        <SectionHeader
          index={index}
          label="Our commitments"
          title={<span id="commit-title">How we handle your work.</span>}
          intro="Promises we make to every client, written down so you can hold us to them."
        />
        <Spotlight>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((c, n) => (
              <Reveal as="li" key={c.code} delay={n * 80} className="spot-card rounded-[1.5rem] border border-line bg-white p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">{c.code}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-action/30 text-action" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3 4 6v6c0 4.4 3.4 8.3 8 9 4.6-.7 8-4.6 8-9V6l-8-3Z" />
                      <path d="m8.5 12 2.5 2.5 4.5-5" />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-7 font-display text-[1.3rem] leading-snug font-medium text-navy">{c.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">{c.body}</p>
              </Reveal>
            ))}
          </ul>
        </Spotlight>
      </Container>
    </section>
  );
}
