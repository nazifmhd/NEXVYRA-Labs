/**
 * Privacy-conscious analytics shim (blueprint §10.3).
 * No provider is wired yet. When one is chosen (e.g. Plausible or a
 * self-hosted option), forward events here. Never pass personal data
 * (names, emails, message content) as event properties.
 */
export type AnalyticsEvent =
  | "primary_cta_click"
  | "service_detail_view"
  | "project_case_study_view"
  | "contact_form_start"
  | "contact_form_submit_success"
  | "contact_form_error"
  | "outbound_link_click"
  | "assistant_open"
  | "assistant_feedback";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: AnalyticsEvent, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, props ?? "");
    }
  } catch {
    /* analytics must never break the UI */
  }
}
