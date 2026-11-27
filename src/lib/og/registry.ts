import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { insights } from "@/content/insights";
import { projects } from "@/content/projects";

/**
 * Share-image content for every page, looked up by path. The image route only
 * renders entries from this registry, so it can't be used to generate branded
 * images with arbitrary text.
 */
export type OgEntry = { label: string; title: string; description: string };

const STATIC: Record<string, OgEntry> = {
  "/": { label: "AI & software engineering", title: siteConfig.brand.tagline, description: "AI engineering, software engineering, intelligent automation and digital innovation." },
  "/about": { label: "About", title: "An engineering partner for what’s next.", description: "Intelligent, dependable systems — engineered properly and supported after launch." },
  "/services": { label: "Services", title: "Technology engineered around your ambition.", description: "Four connected disciplines for building intelligent, dependable systems." },
  "/solutions": { label: "Solutions", title: "Start from the problem, not the tool.", description: "Knowledge assistants, workflows, document intelligence, decision support and platforms." },
  "/industries": { label: "Industries", title: "Built around how your sector works.", description: "Healthcare & clinics · Retail & e-commerce · Finance & professional services." },
  "/projects": { label: "Projects", title: "Ideas engineered into reality.", description: "Case studies with the problem, our role, the architecture and honest outcomes." },
  "/process": { label: "Our process", title: "From possibility to production.", description: "Discover · Strategize · Design · Engineer · Deploy · Evolve." },
  "/insights": { label: "Insights", title: "Engineering notes, openly shared.", description: "Practical writing on AI engineering, software and automation." },
  "/ai-readiness": { label: "AI readiness check", title: "How ready is your organisation for AI?", description: "Eight questions, two minutes — your readiness level and where to start." },
  "/careers": { label: "Careers", title: "Build meaningful technology with a focused team.", description: "How we work, and how to join our talent pool." },
  "/contact": { label: "Contact", title: "Let’s start a conversation.", description: "Tell us about your project, idea or challenge." },
  "/privacy": { label: "Legal", title: "Privacy Policy", description: "How we collect, use and protect personal information." },
  "/terms": { label: "Legal", title: "Terms of Use", description: "Terms governing the use of this website." },
  "/accessibility": { label: "Accessibility", title: "Accessibility Statement", description: "Our commitment to a website everyone can use." },
};

export function ogEntries(): Record<string, OgEntry> {
  const all: Record<string, OgEntry> = { ...STATIC };
  for (const s of services) all[`/services/${s.slug}`] = { label: `Service ${s.index} · ${s.title}`, title: s.headline, description: s.summary };
  for (const i of industries) all[`/industries/${i.slug}`] = { label: `Industry · ${i.title}`, title: i.headline, description: i.short };
  for (const a of insights) all[`/insights/${a.slug}`] = { label: `Insights · ${a.category}`, title: a.title, description: a.excerpt };
  for (const p of projects) all[`/projects/${p.slug}`] = { label: `Case study · ${p.projectType}`, title: p.title, description: p.summary };
  return all;
}

/** "/services/ai-engineering" → "/og/services/ai-engineering"; "/" → "/og/home". */
export function ogImagePath(path: string) {
  return `/og/${path === "/" ? "home" : path.replace(/^\//, "")}`;
}
