import type { ServiceSlug } from "@/lib/validation/contact";

/**
 * Service pillars (blueprint §5.3). Publish only capabilities actually
 * offered — review each list before launch.
 */

export type Service = {
  slug: ServiceSlug;
  index: string;
  title: string;
  kicker: string;
  /** One-line summary for cards and the index list. */
  summary: string;
  /** Business outcome headline used on the detail hero. */
  headline: string;
  intro: string;
  problem: { title: string; body: string; signals: string[] };
  includes: { title: string; body: string }[];
  capabilities: string[];
  approach: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "ai-engineering",
    index: "01",
    title: "AI Engineering",
    kicker: "Agents · LLM applications · Retrieval",
    summary:
      "Production AI systems — agents, LLM applications and knowledge retrieval — designed to be measured, governed and trusted.",
    headline: "AI that holds up after the demo.",
    intro:
      "We design and build AI systems around a specific job to be done: answering from your knowledge, taking structured actions in your tools, or assisting people inside a workflow. Every system ships with evaluation, guardrails and a clear path for human oversight.",
    problem: {
      title: "Most AI pilots stall between prototype and production.",
      body: "A convincing demo is easy. A system that answers accurately on your data, behaves predictably, stays within budget and can be improved with evidence is engineering work.",
      signals: [
        "Answers that sound right but can’t be traced to a source",
        "No way to tell whether a change made the system better or worse",
        "Unpredictable latency and model costs",
        "Unclear ownership when the model is wrong",
      ],
    },
    includes: [
      { title: "Agentic AI systems", body: "Multi-step agents that plan, call tools and hand off to people when confidence is low — scoped to tasks where autonomy is genuinely useful." },
      { title: "LLM applications", body: "Assistants, copilots and generation features embedded into your product or internal tools, with structured outputs your software can rely on." },
      { title: "RAG & knowledge retrieval", body: "Retrieval pipelines over documents, wikis and databases with chunking, ranking and citation strategies tuned to your content." },
      { title: "Model & API integration", body: "Provider-agnostic integration of hosted and open models, with routing, caching and fallbacks designed for cost and resilience." },
      { title: "Evaluation & guardrails", body: "Task-specific test sets, automated evaluation and runtime guardrails so quality is measured rather than assumed." },
      { title: "Human-in-the-loop design", body: "Review queues, approval steps and escalation paths that keep accountable people in control of consequential decisions." },
    ],
    capabilities: ["Agentic AI", "LLM applications", "RAG", "Structured outputs", "Tool calling", "Evaluation", "Guardrails", "Human-in-the-loop"],
    approach: [
      { title: "Define the job", body: "Agree the task, the users, what a good answer looks like and the cost of a wrong one." },
      { title: "Build the evaluation first", body: "Assemble representative cases and success criteria before tuning prompts or pipelines." },
      { title: "Engineer the system", body: "Retrieval, tools, prompts and interfaces — iterated against the evaluation, not intuition." },
      { title: "Operate with evidence", body: "Monitoring, feedback capture and regression checks so improvements are provable." },
    ],
    faqs: [
      { q: "Which models do you work with?", a: "We stay provider-agnostic and choose models per task based on quality, latency, cost and data requirements. Many systems use more than one model." },
      { q: "Can the AI work with our private data securely?", a: "Yes, with appropriate design: access controls on retrieval, data-handling agreements with providers, and options for self-hosted models where data must not leave your environment." },
      { q: "How do you know the system is accurate enough?", a: "We agree measurable acceptance criteria up front and test against a representative evaluation set. You see the results before anything goes live." },
      { q: "Do we need an AI strategy first?", a: "Not necessarily. A focused discovery on one high-value workflow is often the fastest way to learn what AI can do for your organisation." },
    ],
    seoDescription:
      "AI engineering services: agentic AI, LLM applications, RAG and knowledge retrieval, evaluation and guardrails — engineered for production.",
  },
  {
    slug: "software-engineering",
    index: "02",
    title: "Software Engineering",
    kicker: "Platforms · Web & mobile · APIs",
    summary:
      "Custom platforms, web and mobile applications and APIs — architected for change, tested for confidence, documented for handover.",
    headline: "Software engineered to keep working.",
    intro:
      "From a first MVP to a platform that runs part of your business, we build software with clear architecture, automated testing and documentation — so it can grow without being rewritten.",
    problem: {
      title: "Software that ships fast but can’t change safely becomes a liability.",
      body: "Rushed foundations, missing tests and undocumented decisions turn every new feature into a risk. Good engineering keeps delivery fast for the long term, not just the first release.",
      signals: [
        "Every release breaks something unrelated",
        "Only one person understands how it works",
        "Off-the-shelf tools no longer fit how you operate",
        "An idea that needs a credible, production-ready first version",
      ],
    },
    includes: [
      { title: "Product discovery", body: "Clarify users, scope and priorities so the first release solves the right problem." },
      { title: "UX/UI collaboration", body: "Work with your designers — or ours — to turn journeys into accessible, consistent interfaces." },
      { title: "Web & mobile applications", body: "Responsive web apps and cross-platform mobile experiences built on modern, maintainable stacks." },
      { title: "Backend & APIs", body: "Well-designed services, data models and APIs with authentication, validation and observability built in." },
      { title: "Integrations", body: "Connect payment, CRM, ERP and third-party services through robust, documented interfaces." },
      { title: "Testing, deployment & maintenance", body: "Automated tests, CI/CD pipelines and a support plan so the software stays healthy after launch." },
    ],
    capabilities: ["Product discovery", "Frontend", "Backend", "APIs", "Databases", "Web apps", "Mobile apps", "Testing", "CI/CD", "Maintenance"],
    approach: [
      { title: "Shape the scope", body: "Define the smallest release that proves value, with explicit trade-offs." },
      { title: "Architect for change", body: "Choose boundaries, data models and infrastructure that fit today and extend tomorrow." },
      { title: "Build in increments", body: "Working software every iteration, with code review, tests and demos." },
      { title: "Hand over cleanly", body: "Documentation, runbooks and knowledge transfer so you are never locked in." },
    ],
    faqs: [
      { q: "Can you take over an existing codebase?", a: "Yes. We start with a technical review to understand risks and quick wins, then agree a plan to stabilise and extend it." },
      { q: "Do you build MVPs for startups?", a: "Yes — scoped to validate the riskiest assumptions quickly, on foundations that won’t need to be thrown away if it succeeds." },
      { q: "Who owns the code?", a: "Ownership terms are agreed in the engagement contract; our default position is that clients own the code we write for them." },
    ],
    seoDescription:
      "Custom software engineering: web and mobile applications, platforms, APIs and integrations — architected, tested and documented.",
  },
  {
    slug: "intelligent-automation",
    index: "03",
    title: "Intelligent Automation",
    kicker: "Workflows · Integrations · Voice AI",
    summary:
      "Workflow orchestration that connects your systems, handles the exceptions and knows when to hand off to a person.",
    headline: "Automation that handles the edge cases.",
    intro:
      "We map how work actually flows through your organisation, then automate the repetitive parts — connecting business systems, processing documents and adding AI where judgment helps — with monitoring and human handoff built in.",
    problem: {
      title: "Manual work hides in the gaps between systems.",
      body: "Copying data between tools, chasing approvals and re-keying documents costs hours every week. Brittle automations that fail silently can be worse than none at all.",
      signals: [
        "Teams re-entering the same data in multiple systems",
        "Requests and documents waiting in inboxes for triage",
        "Automations nobody monitors until something breaks",
        "Customer enquiries outside working hours going unanswered",
      ],
    },
    includes: [
      { title: "Workflow design", body: "Map the current process, identify what should be automated and design the target flow with its owners." },
      { title: "Orchestration", body: "Reliable multi-step workflows with retries, idempotency and clear state — not fragile chains of triggers." },
      { title: "Business-system integrations", body: "CRM, helpdesk, finance and internal tools connected through APIs and webhooks." },
      { title: "Document workflows", body: "Extract, classify and route information from documents and emails, with review where accuracy matters." },
      { title: "Voice AI, where it fits", body: "Voice agents for well-defined conversations such as intake or scheduling, with clean escalation to staff." },
      { title: "Monitoring & human handoff", body: "Alerts, dashboards and exception queues so failures are visible and people stay in control." },
    ],
    capabilities: ["Workflow design", "Orchestration", "CRM integration", "Document processing", "Voice AI", "Monitoring", "Exception handling", "Human handoff"],
    approach: [
      { title: "Observe the work", body: "Understand the real process, volumes and exceptions before automating anything." },
      { title: "Automate the reliable core", body: "Start with high-volume, well-understood steps and prove the savings." },
      { title: "Design for exceptions", body: "Every flow has a defined path for the cases it can’t handle." },
      { title: "Monitor and refine", body: "Track throughput, failures and handoffs to improve continuously." },
    ],
    faqs: [
      { q: "Will automation replace our team?", a: "Our aim is to remove repetitive work so your people can focus on judgment, relationships and exceptions — the work that benefits most from them." },
      { q: "What happens when an automation fails?", a: "Failures are surfaced through alerts and exception queues with enough context for someone to resolve them. Nothing should fail silently." },
      { q: "Can you work with the tools we already use?", a: "Usually, yes. We prefer integrating with your existing systems over replacing them, as long as they expose suitable APIs." },
    ],
    seoDescription:
      "Intelligent automation services: workflow orchestration, business-system integrations, document processing and voice AI with monitoring and human handoff.",
  },
  {
    slug: "digital-innovation",
    index: "04",
    title: "Digital Innovation",
    kicker: "Cloud · Modernisation · Consulting",
    summary:
      "Cloud foundations, system modernisation and technical consulting that turn ambitions into a credible, staged roadmap.",
    headline: "A clear path from today’s systems to what’s next.",
    intro:
      "We help organisations make sound technology decisions: reviewing architecture, modernising legacy systems, connecting data and establishing cloud foundations — with roadmaps sized to your budget and team.",
    problem: {
      title: "Ambition outpaces the systems underneath it.",
      body: "Legacy platforms, disconnected data and unclear technical direction make every new initiative slower and riskier than it should be.",
      signals: [
        "Critical systems nobody wants to touch",
        "Data scattered across tools with no single view",
        "Cloud costs growing without clear value",
        "Uncertainty about which technology investments to make first",
      ],
    },
    includes: [
      { title: "Architecture reviews", body: "An independent assessment of your systems with prioritised, practical recommendations." },
      { title: "Cloud foundations", body: "Secure, cost-aware environments with infrastructure as code, access controls and observability." },
      { title: "Modernisation", body: "Incremental migration of legacy systems that reduces risk instead of betting on a big-bang rewrite." },
      { title: "System integration & data flows", body: "Connect systems and consolidate data so teams work from consistent information." },
      { title: "Technical consulting", body: "Senior engineering input on build-vs-buy, vendor selection, AI readiness and delivery planning." },
      { title: "Digital transformation roadmaps", body: "Staged plans that sequence quick wins and foundational work against business priorities." },
    ],
    capabilities: ["Cloud foundations", "System integration", "Modernisation", "Architecture reviews", "Data flows", "Technical consulting", "Roadmapping"],
    approach: [
      { title: "Assess", body: "Understand systems, constraints, risks and the outcomes the business needs." },
      { title: "Prioritise", body: "Rank opportunities by value, effort and risk; agree a sequence." },
      { title: "Prove", body: "Deliver a focused first step that validates the direction." },
      { title: "Scale", body: "Expand in stages, measuring outcomes and adjusting the roadmap." },
    ],
    faqs: [
      { q: "Do you only recommend, or also implement?", a: "Both. Many engagements start with an assessment and continue into implementation with our software and automation teams." },
      { q: "Are you tied to a particular cloud vendor?", a: "No. Recommendations are based on your requirements, existing investments and team skills." },
      { q: "How long does an architecture review take?", a: "It depends on scope. We agree the depth and timeline during discovery so the review is proportionate to the decisions you need to make." },
    ],
    seoDescription:
      "Digital innovation services: cloud foundations, legacy modernisation, system integration, architecture reviews and technical consulting.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
