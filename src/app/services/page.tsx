import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { ProcessPath } from "@/components/sections/ProcessPath";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "AI engineering, software engineering, intelligent automation and digital innovation — four connected disciplines for building intelligent, dependable systems.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        crumbs={[{ name: "Services", path: "/services" }]}
        title={<>Technology engineered around your ambition.</>}
        intro="Four connected disciplines. Most engagements combine more than one — because an intelligent system still needs solid software, reliable integrations and a path to production."
      />

      <section className="bg-white pb-24 sm:pb-32" aria-label="Service pillars">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 2) * 90}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white p-8 transition-[border-color,box-shadow] duration-500 hover:border-action/40 hover:shadow-[0_30px_60px_-36px_rgb(23_105_170/0.5)] sm:p-10">
                  <div className="bp-grid-fine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true" />
                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-[0.8rem] tracking-[0.14em] text-muted">{s.index}</span>
                    <ServiceGlyph slug={s.slug} className="h-16 w-16 text-action transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-[24deg]" />
                  </div>
                  <h2 className="relative mt-8 font-display text-[clamp(1.75rem,3vw,2.4rem)] leading-tight font-medium text-navy">
                    <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {s.title}
                    </Link>
                  </h2>
                  <p className="relative mt-2 font-mono text-[0.75rem] tracking-[0.08em] text-action uppercase">{s.kicker}</p>
                  <p className="relative mt-5 text-[1.02rem] leading-relaxed text-muted">{s.summary}</p>
                  <ul className="relative mt-7 flex flex-wrap gap-2">
                    {s.capabilities.slice(0, 6).map((c) => (
                      <li key={c} className="rounded-full bg-mist px-3 py-1.5 text-[0.82rem] text-navy">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <span className="relative mt-auto inline-flex items-center gap-2 pt-9 text-[0.95rem] font-medium text-action" aria-hidden="true">
                    Explore {s.title}
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <ProcessPath index="01" />
      <CtaBand />
    </>
  );
}
