import { technologyGroups } from "@/content/technologies";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";

export function TechStack({ index = "06" }: { index?: string }) {
  return (
    <section className="bg-white py-24 sm:py-28" aria-labelledby="tech-title">
      <Container>
        <SectionHeader
          index={index}
          label="Technology ecosystem"
          title={<span id="tech-title">The right tools, chosen per problem.</span>}
          intro="We stay pragmatic about technology. These are the foundations we work with most — selected for reliability, community support and long-term maintainability."
        />
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {technologyGroups.map((g, i) => (
            <Reveal key={g.group} delay={i * 70}>
              <h3 className="border-b border-line pb-3 font-mono text-[0.75rem] tracking-[0.14em] text-action uppercase">{g.group}</h3>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((t) => (
                  <li key={t} className="text-[1rem] text-navy">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
