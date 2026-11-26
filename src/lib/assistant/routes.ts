import { primaryNav, companyExtraNav, legalNav } from "@/config/site";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { insights } from "@/content/insights";
import { projects } from "@/content/projects";

/** Path → page title, used by the assistant to label the pages it references. */
export function routeTitles(): Record<string, string> {
  const t: Record<string, string> = {};
  for (const n of [...primaryNav, ...companyExtraNav, ...legalNav]) t[n.href] = n.label;
  for (const s of services) t[`/services/${s.slug}`] = s.title;
  for (const i of industries) t[`/industries/${i.slug}`] = i.title;
  for (const a of insights) t[`/insights/${a.slug}`] = a.title;
  for (const p of projects) t[`/projects/${p.slug}`] = p.title;
  return t;
}
