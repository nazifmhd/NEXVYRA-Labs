"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ServiceViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("service_detail_view", { service: slug });
  }, [slug]);
  return null;
}
