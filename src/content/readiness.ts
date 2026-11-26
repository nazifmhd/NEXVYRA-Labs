import type { ServiceSlug } from "@/lib/validation/contact";

/**
 * AI readiness self-assessment. Deterministic scoring, runs entirely in the
 * browser, nothing is stored. It is a guide for a first conversation, not an audit.
 */
export type DimensionKey = "goals" | "data" | "process" | "people";

export const dimensions: Record<DimensionKey, { label: string; strength: string; gap: string; service: ServiceSlug }> = {
  goals: {
    label: "Goals & ownership",
    strength: "You know what you want to achieve and who owns it — the most common reason AI projects stall is already handled.",
    gap: "Pick one problem worth solving and give it an owner. A focused use case with a success measure beats a broad AI strategy.",
    service: "digital-innovation",
  },
  data: {
    label: "Data & knowledge",
    strength: "Your information is accessible and reasonably trustworthy, which is what retrieval and automation depend on.",
    gap: "AI is only as good as the information it can reach. Consolidating and cleaning the key sources is usually the first engineering task.",
    service: "digital-innovation",
  },
  process: {
    label: "Process & systems",
    strength: "Your workflow is understood and your systems can be connected, so improvements can be measured and integrated.",
    gap: "Map the current workflow — volumes, steps, exceptions — before automating. It reveals where AI helps and where simpler automation is enough.",
    service: "intelligent-automation",
  },
  people: {
    label: "Oversight & governance",
    strength: "You have a plan for review, escalation and data protection — essential for using AI responsibly.",
    gap: "Decide who reviews AI output, when people step in, and how data protection is handled. Designing this early avoids costly rework.",
    service: "ai-engineering",
  },
};

export type Question = { id: string; dimension: DimensionKey; text: string; help: string; options: string[] };

/** Each option scores its index (0–3). */
export const questions: Question[] = [
  {
    id: "problem",
    dimension: "goals",
    text: "How clearly defined is the problem you want AI to help with?",
    help: "Think about the specific task or decision, not AI in general.",
    options: ["We’re exploring ideas", "We have a few candidate use cases", "One priority use case is agreed", "A priority use case with success measures"],
  },
  {
    id: "owner",
    dimension: "goals",
    text: "Is there someone who owns this initiative?",
    help: "Ownership means time, authority and a budget to make decisions.",
    options: ["Not yet", "There’s interest, but no owner", "A named owner", "An owner with budget and time"],
  },
  {
    id: "sources",
    dimension: "data",
    text: "Where does the information this would rely on live today?",
    help: "Documents, records, policies, customer data — whatever the AI would need.",
    options: ["Mostly in people’s heads or on paper", "Scattered across files and email", "In a few systems we can access", "Organised and accessible through exports or APIs"],
  },
  {
    id: "quality",
    dimension: "data",
    text: "How confident are you in that information’s quality?",
    help: "Is it accurate, current and consistent?",
    options: ["Not confident", "Mixed — it’s often out of date", "Mostly accurate", "Maintained, with clear owners"],
  },
  {
    id: "workflow",
    dimension: "process",
    text: "How well documented is the workflow involved?",
    help: "Could someone new follow it without asking around?",
    options: ["Not documented", "Partly — it varies by person", "Documented and mostly followed", "Documented and measured (volumes, times)"],
  },
  {
    id: "systems",
    dimension: "process",
    text: "What would a solution need to connect to?",
    help: "The tools your team uses for this work today.",
    options: ["Not sure yet", "Mostly spreadsheets and manual tools", "Business systems with some integration options", "Systems with APIs we already integrate"],
  },
  {
    id: "review",
    dimension: "people",
    text: "How would people review or override AI output?",
    help: "For example approving drafts, handling exceptions or correcting mistakes.",
    options: ["We haven’t considered it", "Informally, case by case", "We know who would review", "A defined review and escalation process"],
  },
  {
    id: "governance",
    dimension: "people",
    text: "How do you handle data protection and security for new tools?",
    help: "Policies, approvals, vendor checks.",
    options: ["No process yet", "Case by case", "Policies exist", "Policies plus a review before adoption"],
  },
];

export const levels = [
  {
    min: 0,
    name: "Exploring",
    summary: "You’re at the start. That’s a good place to be — the right first step now saves a lot of wasted effort later.",
    step: "Discovery sprint",
    stepDetail: "A short, fixed-scope engagement to choose one high-value problem, check your data and systems, and agree what a sensible first project looks like.",
  },
  {
    min: 36,
    name: "Emerging",
    summary: "The foundations are partly there. A focused use case and a clear look at your data will tell you what’s feasible.",
    step: "Discovery sprint, focused on one use case",
    stepDetail: "Validate one priority use case end to end: the workflow, the information it needs, how it would be reviewed and how success will be measured.",
  },
  {
    min: 61,
    name: "Ready",
    summary: "You’re in a strong position to build. The next step is a well-scoped first release with evaluation built in from day one.",
    step: "Project delivery — a measured first release",
    stepDetail: "Design and build a first production version with an evaluation set, guardrails and human review, then expand based on evidence.",
  },
  {
    min: 81,
    name: "Advanced",
    summary: "You have the ownership, data, process and governance in place. The opportunity is scaling well and proving value across more workflows.",
    step: "Project delivery or embedded engineering",
    stepDetail: "Extend proven patterns to new workflows, strengthen monitoring and evaluation, and add engineering capacity where your roadmap needs it.",
  },
] as const;

export function score(answers: Record<string, number>) {
  const dims = (Object.keys(dimensions) as DimensionKey[]).map((key) => {
    const qs = questions.filter((q) => q.dimension === key);
    const got = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    return { key, pct: Math.round((got / (qs.length * 3)) * 100) };
  });
  const total = Math.round(dims.reduce((s, d) => s + d.pct, 0) / dims.length);
  const level = [...levels].reverse().find((l) => total >= l.min) ?? levels[0];
  const sorted = [...dims].sort((a, b) => a.pct - b.pct);
  return { total, level, dims, weakest: sorted[0], strongest: sorted[sorted.length - 1] };
}
