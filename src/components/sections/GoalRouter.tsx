import Link from "next/link";
import type { ServiceSlug } from "@/lib/validation/contact";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ArrowRight } from "@/components/ui/Icons";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";

/** Route visitors by business goal (blueprint §2.1 audiences → §2.2 conversion paths). */
const goals: {
  code: string;
  audience: string;
  title: string;
  body: string;
  glyph: ServiceSlug;
  links: { label: string; href: string }[];
  contact: string;
}[] = [
  {
    code: "G-01",
    audience: "Startups & founders",
    title: "Launch a product",
    body: "Turn an idea into a validated MVP, built on foundations that won’t need rebuilding if it succeeds.",
    glyph: "software-engineering",
    links: [
      { label: "Software Engineering", href: "/services/software-engineering" },
      { label: "Custom platforms", href: "/solutions#custom-platforms" },
    ],
    contact: "/contact?type=project&services=software-engineering,ai-engineering",
  },
  {
    code: "G-02",
    audience: "Growing businesses",
    title: "Automate operations",
    body: "Remove repetitive work between your tools, with AI where it helps and people in control of the exceptions.",
    glyph: "intelligent-automation",
    links: [
      { label: "Intelligent Automation", href: "/services/intelligent-automation" },
      { label: "Operations workflows", href: "/solutions#operations-workflows" },
    ],
    contact: "/contact?type=consultation&services=intelligent-automation,ai-engineering",
  },
  {
    code: "G-03",
    audience: "Enterprise teams",
    title: "Modernise & scale",
    body: "Integrate securely, modernise legacy systems and build AI on governed, reliable foundations.",
    glyph: "digital-innovation",
    links: [
      { label: "Digital Innovation", href: "/services/digital-innovation" },
      { label: "AI Engineering", href: "/services/ai-engineering" },
    ],
    contact: "/contact?type=consultation&services=digital-innovation,ai-engineering",
  },
];

export function GoalRouter() {
  return (
    <section className="relative bg-white pt-20 pb-24 sm:pt-24 sm:pb-28" aria-labelledby="goals-title">
      <Container>
        <SectionHeader
          label="Choose your path"
          title={<span id="goals-title">Where do you want to start?</span>}
          intro="Tell us the outcome you’re after. We’ll point you to the right capabilities — and the conversation starts already focused."
        />
        <Spotlight>
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {goals.map((g, n) => (
              <Reveal as="li" key={g.code} delay={n * 90}>
                <article className="spot-card group flex h-full flex-col rounded-[1.5rem] border border-line bg-mist/60 p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-action/40 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">{g.code}</p>
                      <p className="mt-1 font-mono text-[0.72rem] tracking-[0.1em] text-action uppercase">{g.audience}</p>
                    </div>
                    <ServiceGlyph
                      slug={g.glyph}
                      className="h-12 w-12 text-action transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-[30deg]"
                    />
                  </div>
                  <h3 className="mt-8 font-display text-[1.7rem] leading-tight font-medium text-navy">{g.title}</h3>
                  <p className="mt-3 text-[1rem] leading-relaxed text-muted">{g.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="inline-block rounded-full border border-line bg-white px-3 py-1.5 text-[0.82rem] text-navy transition-colors hover:border-action/50 hover:text-action"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={g.contact}
                    data-cursor="Start"
                    className="group/link mt-auto inline-flex items-center gap-2 pt-8 text-[0.98rem] font-medium text-action"
                  >
                    Start this conversation
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </ul>
        </Spotlight>
      </Container>
    </section>
  );
}
