import type { ServiceSlug } from "@/lib/validation/contact";

/** Problem-led solution categories (blueprint §5.4). These are illustrative approaches, not packaged products. */
export type Solution = {
  slug: string;
  code: string;
  title: string;
  problem: string;
  approach: string;
  benefits: string[];
  services: ServiceSlug[];
};

export const solutions: Solution[] = [
  {
    slug: "knowledge-assistant",
    code: "SOL-01",
    title: "AI-powered knowledge assistant",
    problem: "Answers live in documents, wikis and people’s heads. Staff and customers wait, or get inconsistent answers.",
    approach: "A retrieval-based assistant grounded in approved sources, with citations, access controls and escalation to a person when it isn’t sure.",
    benefits: ["Faster, consistent answers", "Every answer traceable to a source", "Gaps in documentation become visible"],
    services: ["ai-engineering", "software-engineering"],
  },
  {
    slug: "operations-workflows",
    code: "SOL-02",
    title: "Customer & operations workflows",
    problem: "Requests, approvals and hand-offs move through email and spreadsheets, creating delays and dropped balls.",
    approach: "Orchestrated workflows connecting your CRM, helpdesk and internal tools, with AI triage where useful and clear exception queues.",
    benefits: ["Less manual re-keying", "Visible status for every request", "Defined paths for exceptions"],
    services: ["intelligent-automation", "ai-engineering"],
  },
  {
    slug: "document-intelligence",
    code: "SOL-03",
    title: "Document processing & review",
    problem: "Teams read, extract and re-enter information from invoices, contracts, forms and reports by hand.",
    approach: "Extraction and classification pipelines that structure document data, flag uncertainty and route items for human review.",
    benefits: ["Hours of manual entry reduced", "Confidence-based review", "Structured data ready for your systems"],
    services: ["ai-engineering", "intelligent-automation"],
  },
  {
    slug: "decision-support",
    code: "SOL-04",
    title: "Business data & decision support",
    problem: "Data is spread across tools, so decisions rely on stale exports and manual reconciliation.",
    approach: "Integrated data flows and focused reporting or natural-language query layers over trusted, governed data.",
    benefits: ["One consistent view of key metrics", "Less time reconciling reports", "Questions answered closer to real time"],
    services: ["digital-innovation", "software-engineering"],
  },
  {
    slug: "custom-platforms",
    code: "SOL-05",
    title: "Custom digital platforms & internal tools",
    problem: "Off-the-shelf software doesn’t fit how you operate, and workarounds have become the process.",
    approach: "Purpose-built web platforms and internal tools designed around your workflows, integrated with the systems you keep.",
    benefits: ["Software that fits the work", "Fewer disconnected tools", "A foundation you own and can extend"],
    services: ["software-engineering", "digital-innovation"],
  },
];
