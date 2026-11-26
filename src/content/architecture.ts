import type { ServiceSlug } from "@/lib/validation/contact";

/**
 * Architecture diagrams. Coordinates are on a 1000 × 560 canvas.
 * `referenceArchitecture` is the homepage explorer (a typical AI system);
 * projects can supply their own `Diagram` in content/projects.ts.
 */
export type DiagramNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  /** What this component does — shown when selected. */
  detail: string;
  examples?: string[];
  service?: ServiceSlug;
  tone?: "core" | "edge" | "human";
};
export type Diagram = { nodes: DiagramNode[]; edges: [string, string][] };

export const referenceArchitecture: Diagram = {
  nodes: [
    {
      id: "sources",
      label: "Data sources",
      sub: "Docs · DBs · APIs",
      x: 110,
      y: 110,
      tone: "edge",
      detail: "The systems that hold your knowledge and records: documents, wikis, databases, CRMs and third-party APIs. We connect to what exists rather than asking you to migrate.",
      examples: ["Document stores", "SQL databases", "CRM / ERP APIs"],
      service: "digital-innovation",
    },
    {
      id: "ingest",
      label: "Ingestion",
      sub: "Clean · chunk · index",
      x: 330,
      y: 110,
      detail: "Pipelines that extract, clean, split and index content, keeping it in sync as sources change and carrying access permissions along with the data.",
      examples: ["Parsing & chunking", "Embeddings", "Incremental sync"],
      service: "ai-engineering",
    },
    {
      id: "retrieval",
      label: "Retrieval",
      sub: "Search · rank · filter",
      x: 550,
      y: 110,
      detail: "Finds the most relevant, permitted information for each request using search, ranking and filters — and discards weak matches instead of guessing.",
      examples: ["Hybrid search", "Re-ranking", "Permission filters"],
      service: "ai-engineering",
    },
    {
      id: "model",
      label: "Model layer",
      sub: "LLMs · routing",
      x: 550,
      y: 300,
      tone: "core",
      detail: "The language models that reason over retrieved context. Provider-agnostic, with routing, caching and fallbacks chosen for quality, latency and cost.",
      examples: ["Hosted or self-hosted models", "Structured outputs", "Caching & fallbacks"],
      service: "ai-engineering",
    },
    {
      id: "tools",
      label: "Tools & actions",
      sub: "APIs · workflows",
      x: 330,
      y: 300,
      detail: "Controlled actions the system can take — updating a CRM, booking an appointment, triggering a workflow — each with permissions and limits.",
      examples: ["Tool calling", "Workflow triggers", "Scoped credentials"],
      service: "intelligent-automation",
    },
    {
      id: "guard",
      label: "Guardrails & evals",
      sub: "Check · score",
      x: 770,
      y: 300,
      detail: "Automated checks on every output — grounding, safety, policy and format — plus evaluation sets that prove each change is an improvement before release.",
      examples: ["Grounding checks", "Policy filters", "Regression evals"],
      service: "ai-engineering",
    },
    {
      id: "apps",
      label: "Your applications",
      sub: "Web · chat · internal",
      x: 890,
      y: 110,
      tone: "edge",
      detail: "Where people meet the system: your website, product, helpdesk, chat channels or internal tools — designed so users understand what the AI did and why.",
      examples: ["Web & mobile apps", "Helpdesk & chat", "Internal tools"],
      service: "software-engineering",
    },
    {
      id: "human",
      label: "Human review",
      sub: "Escalate · approve",
      x: 770,
      y: 470,
      tone: "human",
      detail: "Low-confidence, sensitive or high-impact cases go to the right person with the full context, and their decisions feed back into the system.",
      examples: ["Review queues", "Approvals", "Escalation rules"],
      service: "intelligent-automation",
    },
    {
      id: "monitor",
      label: "Monitoring",
      sub: "Logs · feedback",
      x: 330,
      y: 470,
      detail: "Observability across the whole system — usage, quality, latency, cost and failures — so problems are visible and improvements are measurable.",
      examples: ["Tracing & logs", "Quality dashboards", "Alerting"],
      service: "digital-innovation",
    },
  ],
  edges: [
    ["sources", "ingest"],
    ["ingest", "retrieval"],
    ["retrieval", "model"],
    ["tools", "model"],
    ["model", "guard"],
    ["guard", "apps"],
    ["guard", "human"],
    ["human", "monitor"],
    ["monitor", "model"],
  ],
};
