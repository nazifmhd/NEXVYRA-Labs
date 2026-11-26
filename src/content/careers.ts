/**
 * Careers. Founder confirmed (27 Nov 2026): not hiring right now — the page
 * shows no open roles and invites people to join a talent pool.
 * When hiring starts, add roles to `openRoles`.
 */
export type Role = { slug: string; title: string; type: string; location: string; summary: string };

export const openRoles: Role[] = [];

export const talentAreas = [
  { value: "ai-engineering", label: "AI engineering" },
  { value: "software-engineering", label: "Software engineering" },
  { value: "automation", label: "Automation & integration" },
  { value: "design", label: "Product & UX design" },
  { value: "cloud-devops", label: "Cloud & DevOps" },
  { value: "other", label: "Something else" },
] as const;

export const howWeWork = [
  { title: "Engineering first", body: "Code review, testing and documentation are part of the job, not extras." },
  { title: "Real problems", body: "Work that solves concrete business problems for real users." },
  { title: "Learning built in", body: "Technology moves fast; time to learn and share is part of how we work." },
  { title: "Remote-friendly", body: "Based in Sri Lanka, collaborating with teams across time zones." },
] as const;
