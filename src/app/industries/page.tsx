import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { industries } from "@/content/industries";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata = pageMetadata({
  title: "Industries",
  description: "AI, automation and software for healthcare and clinics, retail and e-commerce, and finance and professional services.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        label="Industries"
        crumbs={[{ name: "Industries", path: "/industries" }]}
        title={<>Built around how your sector works.</>}
        intro="The same engineering discipline, applied to the constraints, data obligations and workflows of the sectors we know."
      />
      <section className="bg-white pb-24 sm:pb-32" aria-label="Industries">
        <Container>
          <Spotlight>
            <ul className="grid gap-4 md:grid-cols-3">
              {industries.map((ind, n) => (
                <Reveal as="li" key={ind.slug} delay={n * 90}>
                  <article className="spot-card group relative flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-action/40">
                    <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">{ind.code}</p>
                    <h2 className="mt-8 font-display text-[1.9rem] leading-tight font-medium text-navy">
                      <Link href={`/industries/${ind.slug}`} data-cursor="Explore" className="after:absolute after:inset-0 after:content-['']">
                        {ind.title}
                      </Link>
                    </h2>
                    <p className="mt-2 font-mono text-[0.72rem] tracking-[0.08em] text-action uppercase">{ind.short}</p>
                    <p className="mt-5 text-[1rem] leading-relaxed text-muted">{ind.intro}</p>
                    <ul className="mt-6 space-y-1.5">
                      {ind.solutions.slice(0, 3).map((s) => (
                        <li key={s.title} className="flex gap-3 text-[0.92rem] text-navy">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                          {s.title}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[0.95rem] font-medium text-action" aria-hidden="true">
                      Explore {ind.title.toLowerCase()}
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </article>
                </Reveal>
              ))}
            </ul>
          </Spotlight>
        </Container>
      </section>
      <CtaBand title="Working in a different sector?" body="Our disciplines transfer across industries. Tell us about your context and we’ll tell you honestly whether we’re a good fit." />
    </>
  );
}
