import Link from "next/link";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";
import { Reveal } from "@/components/motion/Reveal";
import { CapabilityPreview } from "@/components/motion/CapabilityPreview";

/** Capability index — an editorial, numbered list rather than a card grid. */
export function Capabilities({ index = "02", headingLevel = "h2" }: { index?: string; headingLevel?: "h1" | "h2" }) {
  const ItemHeading = headingLevel === "h1" ? "h2" : "h3";
  return (
    <section className="relative bg-mist py-24 sm:py-32" aria-labelledby="capabilities-title">
      <Container>
        <SectionHeader
          index={index}
          label="Capabilities"
          as={headingLevel}
          title={<span id="capabilities-title">Technology engineered around your ambition.</span>}
          intro="Four connected disciplines. Most engagements draw on more than one — an AI system still needs solid software, integrations and a path to production."
        />

        <div className="relative">
        <CapabilityPreview items={services.map(({ slug, index, title, kicker }) => ({ slug, index, title, kicker }))} />
        <ul className="mt-16 border-t border-navy/15">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={i * 70} className="border-b border-navy/15">
              <Link
                href={`/services/${s.slug}`}
                data-preview={i}
                data-cursor="Explore"
                className="group relative grid grid-cols-[auto_1fr_auto] items-start gap-x-5 gap-y-3 py-8 sm:gap-x-8 lg:grid-cols-[5rem_1.1fr_1.3fr_auto] lg:items-center lg:py-10"
              >
                <span
                  className="pointer-events-none absolute inset-0 -z-0 origin-left scale-x-0 bg-white transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  aria-hidden="true"
                />
                <span className="relative font-mono text-[0.8rem] tracking-[0.12em] text-muted lg:pl-4">{s.index}</span>
                <span className="relative">
                  <ItemHeading className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-medium text-navy transition-colors group-hover:text-action">
                    {s.title}
                  </ItemHeading>
                  <span className="mt-1.5 block font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase">{s.kicker}</span>
                </span>
                <p className="relative col-span-3 col-start-1 max-w-xl text-[1rem] leading-relaxed text-muted sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-auto">
                  {s.summary}
                </p>
                <span className="relative col-start-3 row-start-1 flex items-center gap-5 lg:col-start-auto lg:row-start-auto lg:pr-4">
                  <ServiceGlyph slug={s.slug} className="hidden h-12 w-12 text-action/70 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-[30deg] md:block" />
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-all duration-500 group-hover:border-action group-hover:bg-action group-hover:text-white">
                    <ArrowUpRight size={18} />
                    <span className="sr-only">Explore {s.title}</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        </div>
      </Container>
    </section>
  );
}
