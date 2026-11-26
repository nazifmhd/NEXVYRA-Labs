import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { solutions } from "@/content/solutions";
import { services } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata = pageMetadata({
  title: "Solutions",
  description:
    "Problem-led solutions: AI knowledge assistants, operations workflows, document processing, decision support and custom platforms.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        label="Solutions"
        crumbs={[{ name: "Solutions", path: "/solutions" }]}
        title={<>Start from the problem, not the tool.</>}
        intro="These are challenges we regularly help organisations work through. Each describes an illustrative approach that we tailor to your systems, data and constraints — they are not packaged products."
      />

      <section className="bg-white pb-24 sm:pb-32" aria-label="Solution categories">
        <Container>
          <ol className="space-y-5">
            {solutions.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={60}>
                <article id={s.slug} className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-line">
                  <div className="grid lg:grid-cols-12">
                    <div className="relative bg-mist p-8 sm:p-10 lg:col-span-5">
                      <div className="bp-grid-fine pointer-events-none absolute inset-0" aria-hidden="true" />
                      <div className="relative">
                        <p className="flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.14em] text-muted uppercase">
                          {s.code}
                          <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[0.65rem]">Illustrative</span>
                        </p>
                        <h2 className="mt-6 font-display text-[clamp(1.6rem,2.8vw,2.3rem)] leading-tight font-medium text-navy">{s.title}</h2>
                        <p className="mt-6 font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">The problem</p>
                        <p className="mt-2 text-[1.02rem] leading-relaxed text-navy/85">{s.problem}</p>
                      </div>
                    </div>
                    <div className="flex flex-col p-8 sm:p-10 lg:col-span-7">
                      <p className="font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">Proposed approach</p>
                      <p className="mt-2 text-[1.06rem] leading-relaxed text-muted">{s.approach}</p>
                      <p className="mt-8 font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">What it aims to improve</p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                        {s.benefits.map((b) => (
                          <li key={b} className="rounded-xl bg-mist px-4 py-3 text-[0.94rem] leading-snug text-navy">
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-9">
                        <ul className="flex flex-wrap gap-2" aria-label="Related services">
                          {s.services.map((slug) => {
                            const svc = services.find((x) => x.slug === slug);
                            return svc ? (
                              <li key={slug}>
                                <Link
                                  href={`/services/${slug}`}
                                  className="inline-block rounded-full border border-line px-3 py-1.5 text-[0.84rem] text-action transition-colors hover:border-action/50 hover:bg-mist"
                                >
                                  {svc.title}
                                </Link>
                              </li>
                            ) : null;
                          })}
                        </ul>
                        <ButtonLink href="/contact" variant="ghost" arrow className="text-action">
                          Discuss this
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </article>
                <span className="sr-only">{`Solution ${i + 1} of ${solutions.length}`}</span>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand title="Have a different problem?" body="Most of our work starts with a challenge that doesn’t fit a neat category. Tell us about yours." />
    </>
  );
}
