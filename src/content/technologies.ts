/**
 * Technology ecosystem (blueprint §5.1).
 * VERIFY BEFORE LAUNCH: list only technologies the team genuinely uses and can support.
 */
export const technologyGroups = [
  { group: "AI & data", items: ["Python", "LLM provider APIs", "Retrieval & vector search", "Evaluation tooling", "PostgreSQL"] },
  { group: "Application", items: ["TypeScript", "React", "Next.js", "Node.js", "REST & GraphQL APIs"] },
  { group: "Automation & integration", items: ["Workflow orchestration", "Webhooks", "CRM & business-system APIs", "Voice AI platforms"] },
  { group: "Cloud & delivery", items: ["AWS", "Vercel", "Docker", "CI/CD pipelines", "Monitoring & observability"] },
] as const;
