import { insights } from "@/content/insights";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { InsightCard } from "@/components/insights/InsightCard";

/** Latest articles — renders nothing when there are none (blueprint §5.1). */
export function InsightsPreview({ index }: { index?: string }) {
  const latest = [...insights].sort((a, b) => b.publishDate.localeCompare(a.publishDate)).slice(0, 3);
  if (latest.length === 0) return null;
  return (
    <section className="bg-white py-24 sm:py-28" aria-labelledby="insights-title">
      <Container>
        <SectionHeader
          index={index}
          label="Insights"
          title={<span id="insights-title">Engineering notes, openly shared.</span>}
          intro="Practical writing from our team on building AI and software that hold up in production."
        />
        <Spotlight>
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {latest.map((a, n) => (
              <Reveal as="li" key={a.slug} delay={n * 80}>
                <InsightCard article={a} />
              </Reveal>
            ))}
          </ul>
        </Spotlight>
        <div className="mt-10">
          <ButtonLink href="/insights" variant="secondary" arrow>
            All insights
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
