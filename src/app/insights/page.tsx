import { pageMetadata } from "@/lib/seo";
import { insights } from "@/content/insights";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { InsightCard } from "@/components/insights/InsightCard";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata = pageMetadata({
  title: "Insights",
  description: "Technical articles, engineering notes and company updates from NEXVYRA Labs.",
  path: "/insights",
  noindex: insights.length === 0,
});

export default function InsightsPage() {
  const list = [...insights].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  return (
    <>
      <PageHero
        label="Insights"
        crumbs={[{ name: "Insights", path: "/insights" }]}
        title={<>Engineering notes, openly shared.</>}
        intro="Practical writing on AI engineering, agentic systems, software and automation — reviewed, original and written to be useful."
      />
      <section className="bg-white pb-24 sm:pb-32">
        <Container>
          {list.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-action/30 bg-mist px-6 py-16 text-center">
              <h2 className="font-display text-[1.75rem] font-medium text-navy">First articles coming soon.</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted">We publish only when we have something genuinely useful to say.</p>
              <ButtonLink href="/services" variant="secondary" className="mt-8">
                Explore our services
              </ButtonLink>
            </div>
          ) : (
            <Spotlight>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map((a, n) => (
                  <Reveal as="li" key={a.slug} delay={(n % 3) * 80}>
                    <InsightCard article={a} />
                  </Reveal>
                ))}
              </ul>
            </Spotlight>
          )}
        </Container>
      </section>
      <CtaBand title="Have a problem like these?" body="If an article describes something you’re wrestling with, we’d be glad to talk it through." />
    </>
  );
}
