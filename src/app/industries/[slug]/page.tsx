import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getIndustry, industries } from "@/content/industries";
import { services } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader, SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { Commitments } from "@/components/sections/Commitments";
import { CtaBand } from "@/components/sections/CtaBand";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return pageMetadata({ title: ind.title, description: ind.seoDescription, path: `/industries/${ind.slug}` });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const others = industries.filter((i) => i.slug !== ind.slug);
  const contactServices = Array.from(new Set(ind.solutions.flatMap((s) => s.services))).join(",");

  return (
    <>
      <PageHero
        label={`${ind.code} — ${ind.title}`}
        crumbs={[
          { name: "Industries", path: "/industries" },
          { name: ind.title, path: `/industries/${ind.slug}` },
        ]}
        title={ind.headline}
        intro={ind.intro}
      >
        <div className="mt-9">
          <ButtonLink href={`/contact?type=consultation&services=${contactServices}`} arrow>
            Discuss your organisation
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-24 sm:py-28" aria-labelledby="challenges-title">
        <Container>
          <SectionHeader index="01" label="The challenges" title={<span id="challenges-title">What gets in the way.</span>} />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {ind.challenges.map((c, n) => (
              <Reveal as="li" key={c.title} delay={n * 70} className="bg-white p-7">
                <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">0{n + 1}</span>
                <h3 className="mt-4 font-display text-[1.2rem] font-medium text-navy">{c.title}</h3>
                <p className="mt-2 text-[0.96rem] leading-relaxed text-muted">{c.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-mist py-24 sm:py-28" aria-labelledby="solutions-title">
        <Container>
          <SectionHeader
            index="02"
            label="What we build"
            title={<span id="solutions-title">How we help.</span>}
            intro="Each approach is adapted to your systems, data and obligations during discovery."
          />
          <Spotlight>
            <ul className="mt-14 grid gap-4 md:grid-cols-2">
              {ind.solutions.map((s, n) => (
                <Reveal as="li" key={s.title} delay={(n % 2) * 90} className="spot-card flex flex-col rounded-[1.5rem] border border-line bg-white p-7 sm:p-8">
                  <h3 className="font-display text-[1.4rem] leading-snug font-medium text-navy">{s.title}</h3>
                  <p className="mt-3 text-[1rem] leading-relaxed text-muted">{s.body}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {s.services.map((slug) => {
                      const svc = services.find((x) => x.slug === slug);
                      return svc ? (
                        <Link key={slug} href={`/services/${slug}`} className="rounded-full bg-mist px-3 py-1.5 text-[0.8rem] text-action transition-colors hover:bg-ice">
                          {svc.title}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </Reveal>
              ))}
            </ul>
          </Spotlight>
        </Container>
      </section>

      <section className="bg-white py-24 sm:py-28" aria-labelledby="considerations-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel index="03">Built-in considerations</SectionLabel>
              <h2 id="considerations-title" className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-medium text-navy">
                Designed for your obligations.
              </h2>
              <p className="mt-5 text-[1.04rem] leading-relaxed text-muted">
                Specific regulatory requirements depend on your jurisdiction and organisation. We identify them with you during discovery and design for them from the start.
              </p>
            </div>
            <ul className="divide-y divide-line border-y border-line lg:col-span-6 lg:col-start-7">
              {ind.considerations.map((c) => (
                <li key={c} className="flex gap-4 py-5 text-[1.02rem] text-navy">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Commitments index="04" />

      <section className="border-t border-line bg-white py-16" aria-labelledby="other-ind-title">
        <Container>
          <h2 id="other-ind-title" className="font-mono text-[0.75rem] tracking-[0.14em] text-muted uppercase">
            Other industries
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/industries/${o.slug}`} className="group flex items-center justify-between rounded-2xl border border-line p-5 transition-colors hover:border-action/50 hover:bg-mist">
                  <span>
                    <span className="font-mono text-[0.72rem] text-muted">{o.code}</span>
                    <span className="mt-1 block font-display text-[1.1rem] text-navy">{o.title}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-action transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title={`Let’s talk about ${ind.title.toLowerCase()}.`} />
    </>
  );
}
