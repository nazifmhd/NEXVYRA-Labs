/**
 * Insights (blueprint §5.7). Empty until genuinely useful, reviewed articles
 * exist — the nav link and homepage section stay hidden while this is empty.
 * Move to MDX or a headless CMS when an editorial workflow is needed.
 */
export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  category: "AI Engineering" | "Agentic AI" | "Software Engineering" | "Automation" | "Engineering Notes" | "Company Updates";
  author: string;
  publishDate: string;
  readingTime: string;
};

export const insights: Insight[] = [];
