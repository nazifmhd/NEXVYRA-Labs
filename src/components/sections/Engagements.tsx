import { engagements } from "@/content/engagements";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { ButtonLink } from "@/components/ui/Button";

export function Engagements({ index }: { index?: string }) {
  return (
    <section className="bg-white py-24 sm:py-28" aria-labelledby="engage-title">
      <Container>
        <SectionHeader
          index={index}
          label="Ways to work with us"
          title={<span id="engage-title">Start in the way that fits.</span>}
          intro="Every engagement is scoped and priced to your situation. These are the four shapes most of our work takes."
        />
        <Spotlight>
          <ol className="mt-14 grid gap-4 md:grid-cols-2">
            {engagements.map((e, n) => (
              <Reveal as="li" key={e.code} delay={(n % 2) * 90} className="spot-card flex flex-col rounded-[1.5rem] border border-line p-7 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">{e.code}</span>
                  <span className="text-right text-[0.88rem] text-action">{e.fit}</span>
                </div>
                <h3 className="mt-6 font-display text-[1.6rem] leading-tight font-medium text-navy">{e.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-muted">{e.body}</p>
                <ul className="mt-6 space-y-2 border-t border-line pt-5">
                  {e.outputs.map((o) => (
                    <li key={o} className="flex gap-3 text-[0.95rem] text-navy">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {o}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </Spotlight>
        <div className="mt-10">
          <ButtonLink href="/contact?type=consultation" arrow>
            Discuss the right fit
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
