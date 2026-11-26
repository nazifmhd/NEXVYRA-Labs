"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

const FILTERS: ("All" | ProjectCategory)[] = ["All", "AI", "Software", "Automation", "Platform"];

export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const available = useMemo(
    () => FILTERS.filter((f) => f === "All" || projects.some((p) => p.categories.includes(f))),
    [projects],
  );
  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <div>
      {available.length > 2 && (
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {available.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "min-h-11 rounded-full border px-5 text-[0.92rem] transition-colors",
                filter === f ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-action/50",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} project{shown.length === 1 ? "" : "s"}
      </p>
      <ul className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
        {shown.map((p, i) => (
          <li key={p.slug}>
            <ProjectCard project={p} priority={i < 2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
