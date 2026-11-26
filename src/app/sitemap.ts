import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { insights } from "@/content/insights";
import { industries } from "@/content/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/solutions", "/industries", "/projects", "/process", "/careers", "/contact", "/privacy", "/terms", "/accessibility"];
  if (insights.length > 0) staticRoutes.push("/insights");

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : r.startsWith("/services") || r === "/contact" ? 0.8 : 0.6,
    })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...industries.map((i) => ({ url: `${base}/industries/${i.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...insights.map((a) => ({ url: `${base}/insights/${a.slug}`, lastModified: new Date(a.updatedDate ?? a.publishDate), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
