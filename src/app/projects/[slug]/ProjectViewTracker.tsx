"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ProjectViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("project_case_study_view", { project: slug });
  }, [slug]);
  return null;
}
