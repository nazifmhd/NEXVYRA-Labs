import type { ContactData } from "@/lib/validation/contact";
import { BUDGET_RANGES, ENQUIRY_TYPES } from "@/lib/validation/contact";
import { services } from "@/content/services";

/**
 * Server-side enquiry delivery (blueprint §9.2). Secrets never reach the
 * browser. Swap the provider here or add a CRM adapter alongside it
 * without touching the form or route (§9.3).
 */

type DeliveryResult = { ok: true; mode: "sent" | "dev-log" } | { ok: false; reason: string };

function env() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim() || "",
    to: process.env.CONTACT_TO_EMAIL?.trim() || "",
    from: process.env.CONTACT_FROM_EMAIL?.trim() || "",
  };
}

export function isEmailConfigured() {
  const e = env();
  return Boolean(e.apiKey && e.to && e.from);
}

function label<T extends { value: string; label: string }>(list: readonly T[], value: string) {
  return list.find((i) => i.value === value)?.label ?? value;
}

function formatBody(d: ContactData) {
  const serviceNames = d.services.map((s) => services.find((x) => x.slug === s)?.title ?? s).join(", ");
  return [
    `New website enquiry`,
    ``,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Company: ${d.company || "—"}`,
    `Country / time zone: ${d.location || "—"}`,
    `Enquiry type: ${label(ENQUIRY_TYPES, d.enquiryType)}`,
    `Service interest: ${serviceNames}`,
    `Budget range: ${d.budget ? label(BUDGET_RANGES, d.budget) : "Not provided"}`,
    `Reference URL: ${d.website || "—"}`,
    ``,
    `Project description:`,
    d.message,
    ``,
    `Privacy notice acknowledged: yes (${new Date().toISOString()})`,
  ].join("\n");
}

export async function deliverEnquiry(data: ContactData): Promise<DeliveryResult> {
  const { apiKey, to, from } = env();

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Email provider not configured — accepted in development only.", {
        enquiryType: data.enquiryType,
        services: data.services.length,
      });
      return { ok: true, mode: "dev-log" };
    }
    return { ok: false, reason: "not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Website enquiry — ${label(ENQUIRY_TYPES, data.enquiryType)} — ${data.name.slice(0, 60)}`,
        text: formatBody(data),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: false, reason: `provider_${res.status}` };
    return { ok: true, mode: "sent" };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.name : "unknown" };
  }
}
