import { pageMetadata } from "@/lib/seo";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { CtaBand } from "@/components/sections/CtaBand";
import { CoreFallback } from "@/components/visuals/CoreFallback";

export const metadata = pageMetadata({
  title: "Projects",
  description: "Case studies and projects from NEXVYRA Labs across AI engineering, software, automation and platforms.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        label="Projects"
        crumbs={[{ name: "Projects", path: "/projects" }]}
        title={<>Ideas engineered into reality.</>}
        intro="Every project is labelled with what kind of work it was — client delivery, internal product, prototype or research — and what we were responsible for."
      />

      <section className="bg-white pb-24 sm:pb-32" aria-label="Project list">
        <Container>
          {projects.length > 0 ? (
            <ProjectsIndex projects={projects} />
          ) : (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-action/30 bg-mist px-6 py-16 text-center sm:px-12 sm:py-20">
              <div className="bp-grid pointer-events-none absolute inset-0" aria-hidden="true" />
              <div className="relative mx-auto max-w-xl">
                <div className="mx-auto w-28" aria-hidden="true">
                  <CoreFallback />
                </div>
                <h2 className="mt-6 font-display text-[1.9rem] leading-tight font-medium text-navy">Case studies are being prepared.</h2>
                <p className="mt-4 text-[1.04rem] leading-relaxed text-muted">
                  We’re documenting selected work with the detail it deserves — the problem, our role, the architecture and honest outcomes.
                  In the meantime, we’re happy to walk you through relevant examples in a conversation.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <ButtonLink href="/contact" arrow>
                    Start a Conversation
                  </ButtonLink>
                  <ButtonLink href="/services" variant="secondary">
                    Explore services
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {projects.length > 0 && <CtaBand />}
    </>
  );
}
