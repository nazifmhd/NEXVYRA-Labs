/** Six-stage delivery model (blueprint §5.6). */
export type ProcessStep = {
  index: string;
  title: string;
  summary: string;
  activities: string[];
  artefact: string;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    summary: "Understand the goals, people, workflows and constraints before proposing anything.",
    activities: ["Stakeholder & user conversations", "Workflow and system mapping", "Constraints and risks", "Success criteria"],
    artefact: "Discovery summary",
  },
  {
    index: "02",
    title: "Strategize",
    summary: "Test feasibility, shape the scope and agree how success will be measured.",
    activities: ["Feasibility & technical spikes", "Scope and milestones", "Architecture options", "Estimates and risks"],
    artefact: "Solution proposal / roadmap",
  },
  {
    index: "03",
    title: "Design",
    summary: "Design the experience and the system together, so both are buildable and usable.",
    activities: ["User journeys", "Wireframes & visual design", "System architecture", "Data and integration design"],
    artefact: "Approved design & architecture",
  },
  {
    index: "04",
    title: "Engineer",
    summary: "Build in working increments with review, testing and documentation as part of the work.",
    activities: ["Iterative implementation", "Code review", "Automated tests & evaluation", "Regular demos"],
    artefact: "Working increments & release notes",
  },
  {
    index: "05",
    title: "Deploy",
    summary: "Release safely, with monitoring, security checks and a proper handover.",
    activities: ["Release planning", "Monitoring & alerting", "Security checks", "Training & handover"],
    artefact: "Deployment & handover pack",
  },
  {
    index: "06",
    title: "Evolve",
    summary: "Measure, learn and improve — systems get better after launch, not worse.",
    activities: ["Feedback & evaluation", "Maintenance", "Optimisation", "Roadmap updates"],
    artefact: "Improvement backlog & support plan",
  },
];
