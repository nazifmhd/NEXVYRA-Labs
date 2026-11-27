import type { Diagram } from "@/content/architecture";

/**
 * Projects & case studies (blueprint §5.5).
 *
 * Source: "Portfolio Project Content Pack" v1.0 (27 Nov 2026) plus founder
 * confirmation (27 Nov 2026) that these five are NEXVYRA Labs client projects.
 *
 * Rules:
 *  - Never fabricate clients, metrics or outcomes. Outcomes below are delivery
 *    facts (what was built), not impact claims.
 *  - Client names are confidential and never published. Case studies are
 *    anonymised with no client name, location, language names or links that
 *    would identify the client (founder decision).
 *  - Set `publishApproved: true` only once names, visuals and metrics are cleared.
 *  - Put images in /public/projects/<slug>/ and reference them as "/projects/<slug>/cover.jpg".
 */

export type ProjectCategory = "AI" | "Software" | "Automation" | "Platform";
export type ProjectType = "Client delivery" | "Internal product" | "Personal project" | "Prototype" | "Research";

export type Project = {
  slug: string;
  code: string;
  title: string;
  categories: ProjectCategory[];
  projectType: ProjectType;
  year?: string;
  /** Industry or anonymised context, e.g. "Logistics company (anonymised)". */
  context: string;
  /** Industry page this work relates to, if any (slug from content/industries). */
  industry?: string;
  summary: string;
  problem: string;
  constraints: string[];
  role: string;
  approach: string[];
  capabilities: string[];
  architecture: { summary: string; components: { name: string; detail: string }[]; diagram?: Diagram };
  stack: string[];
  outcomes: { value?: string; detail: string; method?: string }[];
  /** Boundaries, limitations and notes — stated plainly. */
  lessons: string[];
  cover?: { src: string; alt: string; width: number; height: number };
  links?: { label: string; href: string }[];
  featured?: boolean;
  publishApproved: boolean;
};

const allProjects: Project[] = [
  {
    slug: "hospital-operations-agentic-platform",
    code: "CASE-01",
    title: "Hospital Operations & Logistics Agentic Platform",
    categories: ["AI", "Platform"],
    projectType: "Client delivery",
    context: "Hospital (client name withheld)",
    industry: "healthcare",
    summary:
      "A multi-agent operations platform that connects inventory, logistics and discharge workflows across six locations, combining specialised agents with a real-time operations interface.",
    problem:
      "Hospital operations span inventory availability, location-to-location transfers, discharge coordination and time-sensitive operational decisions. Fragmented workflows made it harder for teams to keep visibility and coordinate actions across facilities.",
    constraints: [
      "Operational workflows across six locations",
      "Time-sensitive decisions that need current information",
      "Agents support staff — operational and clinical decisions stay with people",
    ],
    role: "NEXVYRA Labs designed and engineered the platform: the agent orchestration, the backend services, the operations interface and the deployment architecture.",
    approach: [
      "Mapped the operational workflows — inventory, transfers and discharge — into a set of specialised agents with clear responsibilities.",
      "Built a LangGraph orchestration layer to coordinate the agents, with retrieval-augmented generation for access to relevant operational knowledge.",
      "Connected agents to application capabilities through an MCP-based tool and integration layer.",
      "Delivered a unified operations interface with real-time updates and scheduled monitoring, on a containerised, cloud-ready deployment architecture.",
    ],
    capabilities: [
      "Multi-agent workflow orchestration",
      "Supply Inventory Agent: low-stock alerts, safety-stock logic and forecasting-oriented workflows",
      "Inventory transfer workflows spanning six locations",
      "Discharge Agent supporting discharge-related coordination",
      "RAG-enabled access to operational knowledge and context",
      "WebSocket updates and 30-second monitoring and refresh cycles",
    ],
    architecture: {
      summary:
        "React/Vite/Tailwind interface → FastAPI service layer → LangGraph orchestration → specialised agents and RAG → MCP tools and integrations → PostgreSQL/SQLite persistence. Real-time updates run over WebSockets with scheduled monitoring, and the containerised deployment is designed around AWS ECS Fargate with CloudWatch observability.",
      components: [
        { name: "Operations interface", detail: "React, Vite and Tailwind — nine application pages." },
        { name: "Service layer", detail: "FastAPI backend exposing 40+ API endpoints." },
        { name: "Orchestration", detail: "LangGraph coordinating specialised operational agents." },
        { name: "Tools & data", detail: "MCP integration layer over a PostgreSQL/SQLite data layer." },
      ],
      diagram: {
        nodes: [
          { id: "ui", label: "Operations UI", sub: "React · 9 pages", x: 110, y: 110, tone: "edge", detail: "A unified web interface for inventory, transfers and discharge, with nine application pages and live updates." },
          { id: "api", label: "FastAPI services", sub: "40+ endpoints", x: 330, y: 110, detail: "The service layer exposing more than 40 API endpoints to the interface and agents." },
          { id: "orch", label: "LangGraph", sub: "Orchestration", x: 550, y: 110, tone: "core", detail: "Coordinates the specialised agents, routing work and state between them." },
          { id: "rag", label: "Knowledge (RAG)", sub: "Retrieve · ground", x: 800, y: 110, detail: "Retrieval-augmented access to relevant operational knowledge and context." },
          { id: "ws", label: "Live updates", sub: "WebSockets · 30s", x: 110, y: 300, detail: "WebSocket updates and 30-second monitoring and refresh workflows keep the interface current." },
          { id: "inv", label: "Inventory agent", sub: "Stock · forecast", x: 400, y: 300, detail: "Low-stock alerts, safety-stock logic and forecasting-oriented inventory workflows." },
          { id: "xfer", label: "Transfer workflows", sub: "6 locations", x: 620, y: 300, detail: "Inventory transfer workflows spanning six locations." },
          { id: "dis", label: "Discharge agent", sub: "Coordination", x: 840, y: 300, detail: "Supports discharge-related operational coordination." },
          { id: "data", label: "Data layer", sub: "PostgreSQL · SQLite", x: 330, y: 470, detail: "Persistent operational data for the platform." },
          { id: "mcp", label: "MCP tools", sub: "Integrations", x: 620, y: 470, detail: "An MCP-based tool and integration layer connecting agents with application capabilities." },
        ],
        edges: [
          ["ui", "api"],
          ["api", "orch"],
          ["orch", "rag"],
          ["orch", "inv"],
          ["orch", "xfer"],
          ["orch", "dis"],
          ["ui", "ws"],
          ["inv", "mcp"],
          ["xfer", "mcp"],
          ["dis", "mcp"],
          ["mcp", "data"],
          ["api", "data"],
        ],
      },
    },
    stack: ["LangGraph", "RAG", "MCP", "FastAPI", "PostgreSQL / SQLite", "React", "Vite", "Tailwind", "WebSockets", "Docker", "AWS ECS Fargate", "CloudWatch"],
    outcomes: [
      { value: "9", detail: "Application pages in the operations interface" },
      { value: "40+", detail: "Backend API endpoints" },
      { value: "6", detail: "Locations covered by inventory transfer workflows" },
    ],
    lessons: [
      "The agents support operational coordination; they do not make clinical decisions.",
      "We don’t publish impact figures such as stockout or discharge-time changes unless they have been measured and documented.",
    ],
    featured: true,
    publishApproved: true,
  },
  {
    slug: "voice-ai-agents",
    code: "CASE-02",
    title: "Voice AI Agents & Conversational Automation",
    categories: ["AI", "Automation"],
    projectType: "Client delivery",
    context: "Multiple businesses (client names withheld)",
    summary:
      "Designing, testing and improving voice-agent workflows for inbound call analysis, sales conversations and outbound engagement — with structured quality assurance so agents are evaluated beyond a successful demo.",
    problem:
      "Voice agents that sound good in a demo can still fail on real calls: missed intents, poor fallbacks, broken hand-offs and telephony issues. Clients needed agents that were tested against realistic scenarios and monitored once live.",
    constraints: [
      "Separate use cases with different goals — analysis, sales and outbound",
      "Real telephony behaviour, not just text simulations",
      "Client data and call content kept confidential",
    ],
    role: "NEXVYRA Labs designed and configured the voice-agent workflows, built scenario-based QA, tested telephony and call flows, and monitored agent performance across operational use cases.",
    approach: [
      "Treated each use case separately — inbound call analysis, sales qualification and outbound engagement — rather than one agent doing everything.",
      "Designed conversations around greeting, intent capture, information collection, tool hand-off, fallback and escalation.",
      "Built scenario-based test suites to check agent behaviour against realistic cases before and after changes.",
      "Tested call flows on real telephony, then monitored live performance and fed issues back into regression testing.",
    ],
    capabilities: [
      "Voice-agent workflow development and configuration",
      "Scenario-based QA and test-case design",
      "Call-flow and telephony testing",
      "Call analysis and sales-agent workflows",
      "Outbound agent workflows",
      "Performance monitoring and issue triage across use cases",
    ],
    architecture: {
      summary:
        "Calls arrive through the telephony layer to a configured voice agent, which captures intent, collects information and hands off to tools or people. Scenario-based QA suites test the agent before release, and monitoring of live calls feeds regression testing.",
      components: [
        { name: "Conversation design", detail: "Intent capture, information collection, fallback and escalation paths." },
        { name: "Telephony", detail: "Call-flow testing on real telephony providers." },
        { name: "Quality assurance", detail: "Scenario-based test suites run against each agent." },
        { name: "Operations", detail: "Monitoring, issue triage, regression testing and iteration." },
      ],
      diagram: {
        nodes: [
          { id: "caller", label: "Caller", sub: "Inbound · outbound", x: 110, y: 110, tone: "edge", detail: "Customers and prospects on inbound and outbound calls." },
          { id: "tel", label: "Telephony", sub: "Call flows", x: 330, y: 110, detail: "Call routing and telephony, tested end to end on real providers." },
          { id: "agent", label: "Voice agent", sub: "Intent · slots", x: 550, y: 110, tone: "core", detail: "Captures intent, collects the information needed and decides the next step." },
          { id: "tools", label: "Tools & hand-off", sub: "Workflows", x: 800, y: 110, detail: "Hands structured outcomes to business workflows and tools." },
          { id: "design", label: "Conversation design", sub: "Fallback · escalate", x: 330, y: 300, detail: "Greeting, intent capture, slot collection, tool hand-off, fallback and escalation." },
          { id: "qa", label: "Scenario QA", sub: "Test suites", x: 550, y: 300, detail: "Scenario-based test cases check behaviour before and after every change." },
          { id: "human", label: "Human escalation", sub: "Hand to staff", x: 800, y: 300, tone: "human", detail: "Calls the agent shouldn’t handle are passed to people." },
          { id: "monitor", label: "Monitoring", sub: "Review · triage", x: 550, y: 470, detail: "Live performance is reviewed and issues are triaged into regression tests." },
        ],
        edges: [
          ["caller", "tel"],
          ["tel", "agent"],
          ["agent", "tools"],
          ["tools", "human"],
          ["design", "agent"],
          ["qa", "agent"],
          ["monitor", "qa"],
          ["monitor", "human"],
        ],
      },
    },
    stack: ["Voice AI platforms", "Conversational design", "Scenario-based QA", "Telephony testing", "Call analytics", "Workflow automation"],
    outcomes: [
      { detail: "Voice-agent workflows delivered across inbound analysis, sales and outbound use cases" },
      { detail: "Scenario-based QA suites for agent behaviour before and after changes" },
      { detail: "Ongoing monitoring and triage of live agent performance" },
    ],
    lessons: [
      "Each use case was built and evaluated separately; we don’t present one agent as doing everything.",
      "Client names, call recordings and call content stay confidential.",
    ],
    featured: true,
    publishApproved: true,
  },
  {
    slug: "campaign-trust-disbursement-orchestrator",
    code: "CASE-03",
    title: "Campaign Trust & Disbursement Orchestrator",
    categories: ["AI", "Automation"],
    projectType: "Client delivery",
    context: "Crowdfunding platform (client name withheld)",
    industry: "finance-professional-services",
    summary:
      "A multi-agent system that coordinates crowdfunding campaign trust checks and disbursement decisions across specialised agents, combining automated verification with controlled disbursement logic.",
    problem:
      "Crowdfunding platforms must decide which campaigns can be trusted and when funds can be released. Doing this manually is slow; doing it with a single unchecked model is risky.",
    constraints: [
      "Disbursement decisions involve money and must be controlled",
      "Trust checks and disbursement logic need clear separation of responsibilities",
    ],
    role: "NEXVYRA Labs designed and built the multi-agent system for the client.",
    approach: [
      "Split the work across specialised agents rather than one general model.",
      "Separated trust verification from disbursement decisions so each stage has a defined responsibility.",
      "Kept disbursement behind controlled logic, so automated verification informs decisions rather than releasing funds unchecked.",
    ],
    capabilities: [
      "Specialised agents coordinated by a multi-agent architecture",
      "Automated campaign trust verification",
      "Controlled disbursement decision logic",
    ],
    architecture: {
      summary:
        "Campaign information flows to a Gemini-based multi-agent system: trust-verification agents assess the campaign, and a disbursement stage applies controlled logic before any decision is made.",
      components: [
        { name: "Multi-agent coordination", detail: "Gemini-based agents with distinct roles." },
        { name: "Trust verification", detail: "Automated checks on campaigns." },
        { name: "Disbursement control", detail: "Controlled logic governing disbursement decisions." },
      ],
      diagram: {
        nodes: [
          { id: "campaign", label: "Campaign data", sub: "Submission", x: 140, y: 140, tone: "edge", detail: "Campaign information submitted to the platform." },
          { id: "coord", label: "Agent coordinator", sub: "Gemini · multi-agent", x: 480, y: 140, tone: "core", detail: "Coordinates the specialised agents and the order in which they act." },
          { id: "trust", label: "Trust verification", sub: "Automated checks", x: 300, y: 400, detail: "Agents that assess whether a campaign can be trusted." },
          { id: "disb", label: "Disbursement logic", sub: "Controlled", x: 660, y: 400, detail: "Controlled logic that governs disbursement decisions." },
          { id: "decision", label: "Decision", sub: "Release · hold", x: 860, y: 140, tone: "edge", detail: "The disbursement outcome returned to the platform." },
        ],
        edges: [
          ["campaign", "coord"],
          ["coord", "trust"],
          ["trust", "disb"],
          ["coord", "disb"],
          ["disb", "decision"],
        ],
      },
    },
    stack: ["Gemini", "Multi-agent architecture", "Verification logic", "Controlled disbursement rules"],
    outcomes: [
      { detail: "Multi-agent system delivered to coordinate trust checks and disbursement decisions" },
      { detail: "Verification and disbursement separated into distinct, controlled stages" },
    ],
    lessons: ["The client’s name and data stay confidential; this case study describes only the agent roles and safeguards we can share."],
    publishApproved: true,
  },
  {
    slug: "engineering-drawing-review-agent",
    code: "CASE-04",
    title: "Engineering Drawing Review AI Agent",
    categories: ["AI"],
    projectType: "Client delivery",
    context: "Engineering & manufacturing client (name withheld)",
    summary:
      "An AI-assisted review workflow for engineering drawings and technical documentation that applies structured checks and produces organised findings, suggested corrections and recommendations for engineers.",
    problem:
      "Reviewing engineering drawings is skilled, repetitive work, and inconsistencies are easy to miss. Engineers needed help surfacing issues faster without handing approval to a machine.",
    constraints: [
      "Must support qualified engineering review — not replace it",
      "Findings need to be structured and traceable, not free-form text",
    ],
    role: "NEXVYRA Labs designed and built the review workflow, combining rule-based validation with AI-assisted analysis and structured outputs.",
    approach: [
      "Combined rule and check-based validation with AI-assisted analysis, so known requirements are checked deterministically.",
      "Added comparison logic to identify inconsistencies or potential issues across drawings and documentation.",
      "Returned structured findings with suggested corrections and recommendations, ready for an engineer to review.",
    ],
    capabilities: [
      "Structured review workflow for drawings and technical documents",
      "Rule and check-based validation with AI-assisted analysis",
      "Comparison logic for inconsistencies",
      "Structured findings and suggested corrections",
    ],
    architecture: {
      summary:
        "Drawings and documentation are processed, then checked in two complementary ways — deterministic rules and AI-assisted analysis — before comparison logic consolidates structured findings for an engineer to review.",
      components: [
        { name: "Document processing", detail: "Prepares drawings and technical documentation for review." },
        { name: "Validation", detail: "Rule-based checks plus AI-assisted analysis." },
        { name: "Structured outputs", detail: "Findings, corrections and recommendations in a consistent format." },
      ],
      diagram: {
        nodes: [
          { id: "input", label: "Drawings & docs", sub: "Technical input", x: 110, y: 280, tone: "edge", detail: "Engineering drawings and technical documentation submitted for review." },
          { id: "proc", label: "Processing", sub: "Prepare · extract", x: 330, y: 280, detail: "Prepares the documents so they can be checked." },
          { id: "rules", label: "Rule checks", sub: "Deterministic", x: 550, y: 130, detail: "Rule and check-based validation for known requirements." },
          { id: "ai", label: "AI analysis", sub: "LLM-assisted", x: 550, y: 430, tone: "core", detail: "AI-assisted analysis to surface potential issues the rules don’t cover." },
          { id: "compare", label: "Comparison", sub: "Inconsistencies", x: 760, y: 280, detail: "Comparison logic consolidates and cross-checks findings." },
          { id: "review", label: "Engineer review", sub: "Approve · correct", x: 900, y: 470, tone: "human", detail: "Structured findings and suggested corrections go to a qualified engineer, who makes the decision." },
        ],
        edges: [
          ["input", "proc"],
          ["proc", "rules"],
          ["proc", "ai"],
          ["rules", "compare"],
          ["ai", "compare"],
          ["compare", "review"],
        ],
      },
    },
    stack: ["Python", "LLMs", "Document processing", "Structured outputs", "Validation logic"],
    outcomes: [
      { detail: "Review workflow producing structured findings, suggested corrections and recommendations" },
      { detail: "Deterministic checks combined with AI-assisted analysis" },
    ],
    lessons: ["Designed to support engineering review — approval always stays with a qualified engineer."],
    featured: true,
    publishApproved: true,
  },
  {
    slug: "rice-mill-platform",
    code: "CASE-05",
    title: "Rice Mill Website & ERP Platform",
    categories: ["Software", "Platform"],
    projectType: "Client delivery",
    context: "Rice miller & distributor (client name withheld)",
    summary:
      "A complete platform for an operating rice mill: a trilingual public product and wholesale website, plus a staff ERP portal covering accounting, inventory, payroll and field sales.",
    problem:
      "The mill needed a professional public presence that wholesale buyers could act on, and day-to-day operations — accounts, stock, payroll and field orders — that didn’t depend on paper and spreadsheets.",
    constraints: [
      "Public site in three languages",
      "Field sales staff working from mobile devices",
      "Financial and payroll data kept behind an authenticated portal",
    ],
    role: "NEXVYRA Labs designed and built both the public website and the staff ERP portal.",
    approach: [
      "Built the public site around the buyer’s questions: products, quality, process and how to order wholesale.",
      "Added a wholesale inquiry flow with per-product “Inquire / Order” routing.",
      "Delivered a separate authenticated staff portal for operations, designed mobile-first for field sales.",
    ],
    capabilities: [
      "Product catalogue of eight rice varieties with category filters, cooking ratios and pack sizes",
      "Five-step milling-process overview",
      "Farmers and sustainability section",
      "Wholesale (B2B) inquiry form with per-product routing",
      "Trilingual public interface",
      "Staff ERP: double-entry ledger, live inventory, daily payroll and mobile field-sales ordering",
    ],
    architecture: {
      summary:
        "A Next.js public website served through Cloudflare with a trilingual interface, alongside a separate authenticated staff portal for the ERP modules.",
      components: [
        { name: "Public website", detail: "Next.js, trilingual, served through Cloudflare." },
        { name: "Wholesale inquiries", detail: "B2B inquiry form with per-product routing." },
        { name: "Staff portal", detail: "Authenticated ERP: ledger, inventory, payroll and field sales." },
      ],
      diagram: {
        nodes: [
          { id: "buyer", label: "Buyers", sub: "Visitors · wholesale", x: 110, y: 120, tone: "edge", detail: "Visitors and wholesale buyers browsing products and sending inquiries." },
          { id: "site", label: "Public website", sub: "Next.js · 3 languages", x: 380, y: 120, tone: "core", detail: "Trilingual product, process and distribution website served through Cloudflare." },
          { id: "catalog", label: "Catalogue", sub: "8 varieties", x: 640, y: 60, detail: "Eight rice varieties with category filters, cooking ratios and pack sizes." },
          { id: "b2b", label: "Wholesale inquiry", sub: "Inquire · order", x: 640, y: 190, detail: "B2B inquiry form with per-product “Inquire / Order” routing." },
          { id: "staff", label: "Staff portal", sub: "Authenticated", x: 380, y: 400, tone: "human", detail: "A separate, authenticated portal for mill staff." },
          { id: "ledger", label: "Ledger", sub: "Double-entry", x: 640, y: 330, detail: "Double-entry accounting ledger." },
          { id: "stock", label: "Inventory", sub: "Live stock", x: 880, y: 330, detail: "Live inventory tracking." },
          { id: "payroll", label: "Payroll", sub: "Daily workers", x: 640, y: 480, detail: "Daily worker payroll." },
          { id: "field", label: "Field sales", sub: "Mobile-first", x: 880, y: 480, detail: "Mobile-first order taking for field sales staff." },
        ],
        edges: [
          ["buyer", "site"],
          ["site", "catalog"],
          ["site", "b2b"],
          ["staff", "ledger"],
          ["staff", "payroll"],
          ["ledger", "stock"],
          ["payroll", "field"],
          ["site", "staff"],
        ],
      },
    },
    stack: ["Next.js", "Cloudflare", "Multilingual interface", "ERP modules", "Mobile-first field app"],
    outcomes: [
      { value: "8", detail: "Rice varieties in the filterable product catalogue" },
      { value: "3", detail: "Languages on the public website" },
      { value: "4", detail: "ERP modules: ledger, inventory, payroll and field sales" },
    ],
    lessons: ["Portal screens, financial records and payroll data are never shown publicly. We don’t quote the client’s business figures."],
    featured: true,
    publishApproved: true,
  },
];

export const projects = allProjects.filter((p) => p.publishApproved);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
