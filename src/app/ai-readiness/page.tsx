import { pageMetadata } from "@/lib/seo";
import { dimensions } from "@/content/readiness";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ReadinessCheck } from "@/components/readiness/ReadinessCheck";

export const metadata = pageMetadata({
  title: "AI Readiness Check",
  description:
    "A free two-minute self-assessment of your organisation’s readiness for AI across goals, data, process and governance — with a suggested first step.",
  path: "/ai-readiness",
});

export default function ReadinessPage() {
  return (
    <>
      <PageHero
        label="AI readiness check"
        crumbs={[{ name: "AI Readiness Check", path: "/ai-readiness" }]}
        title={
          <>
            How ready is your organisation for <span className="ink-gradient">AI?</span>
          </>
        }
        intro="Eight questions, about two minutes. You’ll get a readiness level, your strongest and weakest areas, and a practical suggestion for where to start."
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {Object.values(dimensions).map((d) => (
            <li key={d.label} className="rounded-full border border-line bg-white/70 px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.08em] text-navy uppercase">
              {d.label}
            </li>
          ))}
        </ul>
      </PageHero>
      <section className="bg-white pb-24 sm:pb-32" aria-label="Assessment">
        <Container>
          <ReadinessCheck />
        </Container>
      </section>
    </>
  );
}
