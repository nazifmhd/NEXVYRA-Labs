import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ice ring-1 ring-line">
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority={priority}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.03]">
            <ProjectVisual project={project} />
          </div>
        )}
        <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[0.7rem] tracking-[0.1em] text-navy uppercase backdrop-blur">
          {project.projectType}
        </span>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.72rem] tracking-[0.12em] text-muted uppercase">
        {project.categories.map((c) => (
          <span key={c}>{c}</span>
        ))}
        {project.year && <span>· {project.year}</span>}
      </div>
      <h3 className="mt-2 font-display text-[1.6rem] leading-tight font-medium text-navy">
        <Link href={`/projects/${project.slug}`} data-cursor="View" className="after:absolute after:inset-0 after:content-['']">
          {project.title}
        </Link>
      </h3>
      <p className="mt-3 text-[1rem] leading-relaxed text-muted">{project.summary}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-action" aria-hidden="true">
        Read case study
        <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </article>
  );
}
