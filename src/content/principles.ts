/** Differentiators (blueprint §5.1) — framed as working principles, not claims. */
export const principles = [
  { code: "P-01", title: "Engineering discipline", body: "Architecture, code review, testing and version control on every engagement — including prototypes that might become products." },
  { code: "P-02", title: "Fit-for-purpose AI", body: "We use AI where it measurably helps and say so when a simpler, deterministic solution is the better choice." },
  { code: "P-03", title: "Evaluation built in", body: "Quality is defined and measured from the start, so decisions are based on evidence rather than impressions." },
  { code: "P-04", title: "Integration first", body: "Systems are designed to work with the tools and data you already rely on, not alongside them." },
  { code: "P-05", title: "Documented by default", body: "Decisions, architecture and runbooks are written down so your team can own what we build." },
  { code: "P-06", title: "Support beyond launch", body: "Monitoring, maintenance and improvement plans are part of the delivery, not an afterthought." },
] as const;

export const values = [
  { title: "Engineering quality", body: "We take pride in work that is correct, maintainable and built to last." },
  { title: "Clarity", body: "Plain language, honest trade-offs and no surprises." },
  { title: "Responsibility", body: "We consider the people affected by the systems we build — privacy, security and fairness included." },
  { title: "Collaboration", body: "We work as an extension of your team, across time zones and disciplines." },
  { title: "Continuous learning", body: "Technology moves quickly; we keep learning so our advice stays current." },
] as const;
