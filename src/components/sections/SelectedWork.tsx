import { featuredProjects, projects } from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";

/** Renders nothing until approved projects exist (no placeholder work is ever shown). */
export function SelectedWork({ index = "03" }: { index?: string }) {
  const list = (featuredProjects.length > 0 ? featuredProjects : projects).slice(0, 4);
  if (list.length === 0) return null;

  return (
    <section className="bg-white py-24 sm:py-32" aria-labelledby="work-title">
      <Container>
        <SectionHeader
          index={index}
          label="Selected work"
          title={<span id="work-title">Ideas engineered into reality.</span>}
          intro="A selection of projects, each labelled with what kind of work it was and what we were responsible for."
        />
        <ul className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {list.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 2) * 100} className={i % 2 === 1 ? "md:mt-24" : undefined}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-14">
          <ButtonLink href="/projects" variant="secondary" arrow>
            All projects
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
