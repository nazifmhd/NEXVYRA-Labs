/** How clients can work with us. Durations and pricing are agreed per engagement, so none are published here. */
export const engagements = [
  {
    code: "E-01",
    title: "Discovery sprint",
    fit: "When the problem is clear but the solution isn’t.",
    body: "A short, fixed-scope engagement to understand your goals, systems and constraints, test feasibility and agree what to build.",
    outputs: ["Discovery summary", "Solution options with trade-offs", "Scoped roadmap and estimate"],
  },
  {
    code: "E-02",
    title: "Project delivery",
    fit: "When you know what you need built.",
    body: "We design, engineer and deploy a defined solution in working increments, with demos, tests and documentation throughout.",
    outputs: ["Working releases", "Architecture & runbooks", "Deployment and handover"],
  },
  {
    code: "E-03",
    title: "Ongoing support & evolution",
    fit: "When a system is live and needs to keep improving.",
    body: "Monitoring, maintenance and continuous improvement for systems we’ve built — or ones you already run.",
    outputs: ["Monitoring & maintenance", "Evaluation and optimisation", "Prioritised improvement backlog"],
  },
  {
    code: "E-04",
    title: "Embedded engineering",
    fit: "When your team needs more engineering capacity.",
    body: "Our engineers work inside your team and process, contributing to your roadmap with the same standards we apply to our own work.",
    outputs: ["Engineers in your workflow", "Code review & quality practices", "Knowledge shared as we go"],
  },
] as const;
