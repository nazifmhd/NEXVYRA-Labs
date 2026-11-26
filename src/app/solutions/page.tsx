import { pageMetadata } from "@/lib/seo";
import { solutions } from "@/content/solutions";
import { services } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Spotlight } from "@/components/motion/Spotlight";
import { SolutionsBrowser } from "@/components/sections/SolutionsBrowser";
import { ArchitectureExplorer } from "@/components/sections/ArchitectureExplorer";
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
          <Spotlight>
            <SolutionsBrowser solutions={solutions} services={services.map(({ slug, title }) => ({ slug, title }))} />
          </Spotlight>
        </Container>
      </section>

      <ArchitectureExplorer index="01" />
      <CtaBand title="Have a different problem?" body="Most of our work starts with a challenge that doesn’t fit a neat category. Tell us about yours." />
    </>
  );
}
