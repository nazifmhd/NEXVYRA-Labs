import type { Diagram } from "@/content/architecture";

/**
 * Projects & case studies (blueprint §5.5).
 *
 * Add real projects here. Rules:
 *  - Never fabricate clients, metrics or outcomes.
 *  - Label the project type honestly (client delivery vs personal/internal/prototype).
 *  - Set `publishApproved: true` only once names, visuals and metrics are cleared.
 *  - Put images in /public/projects/<slug>/ and reference them as "/projects/<slug>/cover.jpg".
 */

export type ProjectCategory = "AI" | "Software" | "Automation" | "Platform";
export type ProjectType = "Client delivery" | "Internal product" | "Personal project" | "Prototype" | "Research";

export type Project = {
  slug: string;
  title: string;
  categories: ProjectCategory[];
  projectType: ProjectType;
  year?: string;
  /** Industry or anonymised context, e.g. "Logistics company (anonymised)". */
  context: string;
  summary: string;
  problem: string;
  constraints: string[];
  role: string;
  approach: string[];
  architecture: { summary: string; components: { name: string; detail: string }[]; diagram?: Diagram };
  stack: string[];
  outcomes: { value?: string; detail: string; method?: string }[];
  lessons: string[];
  cover?: { src: string; alt: string; width: number; height: number };
  links?: { label: string; href: string }[];
  featured?: boolean;
  publishApproved: boolean;
};

const allProjects: Project[] = [
  // Projects will be added here.
];

export const projects = allProjects.filter((p) => p.publishApproved);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
