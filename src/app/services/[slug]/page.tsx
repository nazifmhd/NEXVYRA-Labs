import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { getService, services } from "@/content/services";
import { solutions } from "@/content/solutions";
import { projects, type ProjectCategory } from "@/content/projects";
import type { ServiceSlug } from "@/lib/validation/contact";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader, SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";
import { Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceViewTracker } from "./ServiceViewTracker";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.seoDescription, path: `/services/${s.slug}` });
}

const projectCategory: Record<ServiceSlug, ProjectCategory> = {
  "ai-engineering": "AI",
  "software-engineering": "Software",
  "intelligent-automation": "Automation",
  "digital-innovation": "Platform",
};

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const related = projects.filter((p) => p.categories.includes(projectCategory[s.slug])).slice(0, 2);
  const relatedSolutions = solutions.filter((x) => x.services.includes(s.slug));
  const others = services.filter((x) => x.slug !== s.slug);
  let section = 0;
  const idx = () => String(++section).padStart(2, "0");

  return (
    <>
      <ServiceViewTracker slug={s.slug} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          description: s.seoDescription,
          serviceType: s.title,
          provider: { "@id": `${siteConfig.siteUrl}/#organization` },
          areaServed: "Worldwide",
          url: `${siteConfig.siteUrl}/services/${s.slug}`,
        }}
      />
      <PageHero
        label={`Service ${s.index} — ${s.title}`}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: s.title, path: `/services/${s.slug}` },
        ]}
        title={s.headline}
        intro={s.intro}
        aside={
          <div className="frame-marks mx-auto hidden aspect-square max-w-[16rem] items-center justify-center p-8 text-action lg:flex">
            <ServiceGlyph slug={s.slug} className="h-full w-full" />
          </div>
        }
      >
        <div className="animate-rise mt-9 flex flex-wrap gap-3" style={{ "--d": "220ms" } as React.CSSProperties}>
          <ButtonLink href="/contact" arrow>
            Discuss your project
          </ButtonLink>
        </div>
      </PageHero>

      {/* Problem */}
      <section className="bg-white py-24 sm:py-28" aria-labelledby="problem-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionLabel index={idx()}>The challenge</SectionLabel>
              <h2 id="problem-title" className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-medium text-navy">
                {s.problem.title}
              </h2>
              <p className="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-muted">{s.problem.body}</p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="font-mono text-[0.75rem] tracking-[0.14em] text-muted uppercase">Sound familiar?</p>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {s.problem.signals.map((sig) => (
                  <li key={sig} className="flex gap-4 py-4 text-[1rem] text-navy">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {sig}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* What's included */}
      <section className="bg-mist py-24 sm:py-28" aria-labelledby="includes-title">
        <Container>
          <SectionHeader index={idx()} label="What’s included" title={<span id="includes-title">What we deliver.</span>} />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {s.includes.map((it, i) => (
              <Reveal as="li" key={it.title} delay={(i % 3) * 70} className="bg-white p-7 sm:p-8">
                <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">
                  {s.index}.{i + 1}
                </span>
                <h3 className="mt-4 font-display text-[1.25rem] font-medium text-navy">{it.title}</h3>
                <p className="mt-2.5 text-[0.97rem] leading-relaxed text-muted">{it.body}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <p className="font-mono text-[0.75rem] tracking-[0.14em] text-muted uppercase">Capabilities</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {s.capabilities.map((c) => (
                <li key={c} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.88rem] text-navy">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Approach */}
      <section className="bg-white py-24 sm:py-28" aria-labelledby="approach-title">
        <Container>
          <SectionHeader index={idx()} label="Delivery approach" title={<span id="approach-title">How we approach it.</span>} />
          <Reveal as="ol" className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            {s.approach.map((a, i) => (
              <li key={a.title} className="relative border-t border-navy/15 pt-6">
                <span className="absolute -top-px left-0 h-px w-full origin-left bg-action signal-line" aria-hidden="true" />
                <span className="font-mono text-[0.75rem] tracking-[0.14em] text-action">STEP {i + 1}</span>
                <h3 className="mt-3 font-display text-[1.3rem] font-medium text-navy">{a.title}</h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{a.body}</p>
              </li>
            ))}
          </Reveal>

        </Container>
      </section>

      {/* Related evidence */}
      {(related.length > 0 || relatedSolutions.length > 0) && (
        <section className="bg-mist py-24 sm:py-28" aria-labelledby="related-title">
          <Container>
            <SectionHeader
              index={idx()}
              label={related.length > 0 ? "Relevant work" : "Where it applies"}
              title={<span id="related-title">{related.length > 0 ? "See it in practice." : "Problems this helps solve."}</span>}
            />
            {related.length > 0 ? (
              <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
                {related.map((p) => (
                  <li key={p.slug}>
                    <ProjectCard project={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-14 grid gap-4 md:grid-cols-2">
                {relatedSolutions.map((x) => (
                  <li key={x.slug} className="rounded-2xl border border-line bg-white p-7">
                    <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">{x.code} · Illustrative</p>
                    <h3 className="mt-3 font-display text-[1.3rem] font-medium text-navy">{x.title}</h3>
                    <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{x.approach}</p>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>
      )}

      {/* FAQs */}
      <section className="bg-white py-24 sm:py-28" aria-labelledby="faq-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index={idx()}>FAQs</SectionLabel>
              <h2 id="faq-title" className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.75rem)] leading-tight font-medium text-navy">
                Common questions.
              </h2>
              <p className="mt-4 text-[1rem] text-muted">
                Something else?{" "}
                <Link href="/contact" className="text-action underline underline-offset-2">
                  Ask us directly
                </Link>
                .
              </p>
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={s.faqs} />
            </div>
          </div>
        </Container>
      </section>

      {/* Other services */}
      <section className="border-t border-line bg-white py-16" aria-labelledby="other-title">
        <Container>
          <h2 id="other-title" className="font-mono text-[0.75rem] tracking-[0.14em] text-muted uppercase">
            Other services
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-line p-5 transition-colors hover:border-action/50 hover:bg-mist"
                >
                  <span>
                    <span className="font-mono text-[0.72rem] text-muted">{o.index}</span>
                    <span className="mt-1 block font-display text-[1.1rem] text-navy">{o.title}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-action transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title={`Let’s talk about ${s.title.toLowerCase()}.`} />
    </>
  );
}
