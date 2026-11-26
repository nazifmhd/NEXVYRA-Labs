import Link from "next/link";
import { solutions } from "@/content/solutions";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";

export function SolutionsPreview({ index = "03" }: { index?: string }) {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32" aria-labelledby="solutions-title">
      <Container>
        <SectionHeader
          index={index}
          label="Solutions"
          title={<span id="solutions-title">Start from the problem, not the tool.</span>}
          intro="Common challenges we help organisations solve. Each is an illustrative approach we adapt to your context — not an off-the-shelf product."
        />
        <Spotlight>
        <ol className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal
              as="li"
              key={s.slug}
              delay={(i % 3) * 80}
              className={i === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : undefined}
            >
              <article className="spot-card group relative flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-action/40 hover:shadow-[0_24px_50px_-30px_rgb(23_105_170/0.45)]">
                <span
                  className="frame-marks pointer-events-none absolute inset-2.5 scale-[1.04] opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">
                  <span>{s.code}</span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-[0.65rem]">Illustrative</span>
                </div>
                <h3 className="mt-6 font-display text-[1.45rem] leading-snug font-medium text-navy">{s.title}</h3>
                <dl className="mt-5 space-y-4 text-[0.97rem] leading-relaxed">
                  <div>
                    <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-action uppercase">Problem</dt>
                    <dd className="mt-1 text-muted">{s.problem}</dd>
                  </div>
                  <div className={i === 0 ? "" : "hidden sm:block"}>
                    <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-action uppercase">Approach</dt>
                    <dd className="mt-1 text-muted">{s.approach}</dd>
                  </div>
                </dl>
                {i === 0 && (
                  <ul className="mt-6 space-y-2 border-t border-line pt-5">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex gap-3 text-[0.95rem] text-navy">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex flex-wrap gap-2 pt-7">
                  {s.services.map((slug) => {
                    const svc = services.find((x) => x.slug === slug);
                    return svc ? (
                      <Link
                        key={slug}
                        href={`/services/${slug}`}
                        className="rounded-full bg-mist px-3 py-1.5 text-[0.8rem] text-action transition-colors hover:bg-ice"
                      >
                        {svc.title}
                      </Link>
                    ) : null;
                  })}
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
        </Spotlight>
        <div className="mt-12">
          <ButtonLink href="/solutions" variant="secondary" arrow>
            All solutions
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
