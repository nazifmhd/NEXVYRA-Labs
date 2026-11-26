import type { ServiceSlug } from "@/lib/validation/contact";

/**
 * Industry pages — only for sectors the founder confirmed real experience in
 * (27 Nov 2026). Content describes the problems we solve and how we approach
 * them; it names no clients and states no metrics. Add case studies via
 * `relatedProjectCategories` once projects are published.
 */
export type Industry = {
  slug: string;
  code: string;
  title: string;
  short: string;
  headline: string;
  intro: string;
  challenges: { title: string; body: string }[];
  solutions: { title: string; body: string; services: ServiceSlug[] }[];
  considerations: string[];
  seoDescription: string;
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    code: "IND-01",
    title: "Healthcare & clinics",
    short: "Clinics, pharmacies and care providers",
    headline: "Technology that gives clinical teams time back.",
    intro:
      "Healthcare teams lose hours to bookings, calls, paperwork and disconnected systems. We build software and AI-assisted workflows that reduce administrative load while keeping clinicians in control and patient data protected.",
    challenges: [
      { title: "Administrative overload", body: "Appointment changes, reminders, referrals and forms consume staff time that should go to patients." },
      { title: "Disconnected systems", body: "Practice management, pharmacy, billing and messaging tools rarely share data cleanly." },
      { title: "Strict data obligations", body: "Patient information demands careful access control, auditability and data-residency decisions." },
      { title: "High cost of error", body: "Automation must know its limits — anything clinical or sensitive needs a person." },
    ],
    solutions: [
      {
        title: "Patient communication workflows",
        body: "Booking, reminder and follow-up flows across SMS, email and web, integrated with your scheduling system and escalating to staff when needed.",
        services: ["intelligent-automation", "software-engineering"],
      },
      {
        title: "Document & intake processing",
        body: "Structured extraction from referrals, forms and reports, with confidence checks and human review before anything reaches a record.",
        services: ["ai-engineering", "intelligent-automation"],
      },
      {
        title: "Internal knowledge assistants",
        body: "Staff-facing assistants grounded in your approved procedures and policies — answering operational questions, not giving medical advice.",
        services: ["ai-engineering"],
      },
      {
        title: "Practice platforms & integrations",
        body: "Custom portals, dashboards and integrations that connect the systems your clinic already relies on.",
        services: ["software-engineering", "digital-innovation"],
      },
    ],
    considerations: [
      "Role-based access to patient data and full audit trails",
      "Data-residency and hosting choices made with you, per jurisdiction",
      "Clinical decisions stay with qualified people — AI assists administration",
      "Privacy impact considered at design time, not after launch",
    ],
    seoDescription:
      "Software, automation and AI for healthcare providers and clinics: patient communication, document processing, knowledge assistants and integrations.",
  },
  {
    slug: "retail-ecommerce",
    code: "IND-02",
    title: "Retail & e-commerce",
    short: "Online stores and retail operations",
    headline: "Sell more without adding operational drag.",
    intro:
      "Retail growth multiplies questions, orders, returns and data. We build the platforms, integrations and AI-assisted operations that let teams handle more volume with the same people — and give customers faster answers.",
    challenges: [
      { title: "Support volume spikes", body: "Order status, delivery and returns questions surge around promotions and seasons." },
      { title: "Fragmented stack", body: "Storefront, inventory, fulfilment, payments and marketing tools each hold part of the picture." },
      { title: "Manual catalogue work", body: "Product data, descriptions and attributes are slow to create and hard to keep consistent." },
      { title: "Decisions on stale data", body: "Stock and sales reporting often depends on exports and spreadsheets." },
    ],
    solutions: [
      {
        title: "Customer support assistants",
        body: "Assistants grounded in your policies and order data that resolve routine questions and hand complex cases to your team with context attached.",
        services: ["ai-engineering", "intelligent-automation"],
      },
      {
        title: "Order & returns automation",
        body: "Workflows connecting storefront, fulfilment and helpdesk so status updates, returns and exceptions move without re-keying.",
        services: ["intelligent-automation"],
      },
      {
        title: "Catalogue & content tooling",
        body: "AI-assisted product data enrichment with human approval, keeping your catalogue consistent at scale.",
        services: ["ai-engineering", "software-engineering"],
      },
      {
        title: "Commerce platforms & reporting",
        body: "Custom storefront features, internal tools and integrated reporting on trustworthy, up-to-date data.",
        services: ["software-engineering", "digital-innovation"],
      },
    ],
    considerations: [
      "Payment data stays with your payment provider — never in AI prompts",
      "Assistants answer from approved policies, with clear escalation",
      "Integrations designed for peak-season load and graceful failure",
      "Customer personal data minimised and access-controlled",
    ],
    seoDescription:
      "AI, automation and software for retail and e-commerce: support assistants, order and returns automation, catalogue tooling and commerce platforms.",
  },
  {
    slug: "finance-professional-services",
    code: "IND-03",
    title: "Finance & professional services",
    short: "Insurance, accounting, legal and consulting",
    headline: "Precision work, with the repetition engineered out.",
    intro:
      "Firms in finance and professional services run on documents, deadlines and expert judgment. We automate the repetitive review, extraction and reporting around that judgment — with traceability built in so every output can be checked.",
    challenges: [
      { title: "Document-heavy processes", body: "Contracts, claims, statements and filings are read and re-keyed by highly skilled people." },
      { title: "Knowledge locked in files", body: "Precedents, policies and past work are hard to search and reuse." },
      { title: "Audit and accountability", body: "Every figure and statement may need to be traced to its source." },
      { title: "Client confidentiality", body: "Sensitive information requires strict handling and clear data boundaries." },
    ],
    solutions: [
      {
        title: "Document review & extraction",
        body: "Pipelines that extract, compare and summarise documents with citations to the source text and confidence-based review.",
        services: ["ai-engineering", "intelligent-automation"],
      },
      {
        title: "Firm knowledge assistants",
        body: "Retrieval over approved internal knowledge — policies, templates, precedents — with access control that mirrors your permissions.",
        services: ["ai-engineering"],
      },
      {
        title: "Workflow & reporting automation",
        body: "Intake, approvals and recurring reporting automated across your practice, CRM and finance systems.",
        services: ["intelligent-automation", "digital-innovation"],
      },
      {
        title: "Client portals & internal platforms",
        body: "Secure portals and tools that replace email-and-spreadsheet processes with something auditable.",
        services: ["software-engineering"],
      },
    ],
    considerations: [
      "Every AI output traceable to its source documents",
      "Permissions respected in retrieval — people only see what they’re allowed to",
      "NDAs available before any details are shared",
      "Professional judgment stays with professionals",
    ],
    seoDescription:
      "Document AI, knowledge assistants, workflow automation and secure platforms for finance, insurance, accounting, legal and consulting firms.",
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
