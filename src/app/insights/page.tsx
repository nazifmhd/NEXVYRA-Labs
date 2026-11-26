import { pageMetadata } from "@/lib/seo";
import { insights } from "@/content/insights";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = pageMetadata({
  title: "Insights",
  description: "Technical articles, engineering notes and company updates from NEXVYRA Labs.",
  path: "/insights",
  // Keep out of the index until real articles are published.
  noindex: insights.length === 0,
});

export default function InsightsPage() {
  return (
    <>
      <PageHero
        label="Insights"
        crumbs={[{ name: "Insights", path: "/insights" }]}
        title={<>Engineering notes, openly shared.</>}
        intro="Practical writing on AI engineering, agentic systems, software and automation — reviewed, original and useful."
      />
      <section className="bg-white pb-24 sm:pb-32">
        <Container>
          {insights.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-action/30 bg-mist px-6 py-16 text-center">
              <h2 className="font-display text-[1.75rem] font-medium text-navy">First articles coming soon.</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted">We publish only when we have something genuinely useful to say.</p>
              <ButtonLink href="/services" variant="secondary" className="mt-8">
                Explore our services
              </ButtonLink>
            </div>
          ) : (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((a) => (
                <li key={a.slug} className="rounded-2xl border border-line p-7">
                  <p className="font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">{a.category}</p>
                  <h2 className="mt-3 font-display text-[1.35rem] font-medium text-navy">{a.title}</h2>
                  <p className="mt-2 text-muted">{a.excerpt}</p>
                  <p className="mt-5 text-[0.85rem] text-muted">
                    {a.author} · {a.publishDate} · {a.readingTime}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
