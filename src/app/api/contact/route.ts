import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { deliverEnquiry } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 16_000;

function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(req: Request) {
  // Same-origin check (basic CSRF/abuse protection for a public endpoint).
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json(403, { message: "Forbidden" });
    } catch {
      return json(403, { message: "Forbidden" });
    }
  }

  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return json(415, { message: "Unsupported content type" });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.allowed) {
    return json(429, { message: "Too many requests" }, { "Retry-After": String(limit.retryAfter) });
  }

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return json(413, { message: "Submission too large" });

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { message: "Invalid request" });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json(400, { message: "Invalid request" });
  }

  // Honeypot: bots fill hidden fields. Respond as success without delivering.
  const { hp, ...rest } = payload as Record<string, unknown>;
  if (typeof hp === "string" && hp.length > 0) {
    console.info("[contact] honeypot triggered; submission dropped");
    return json(200, { ok: true });
  }

  const parsed = contactSchema.safeParse(rest);
  if (!parsed.success) {
    return json(400, { message: "Please check the highlighted fields", fieldErrors: parsed.error.flatten().fieldErrors });
  }

  const result = await deliverEnquiry(parsed.data);
  if (!result.ok) {
    // Log the outcome only — never the submitted personal data.
    console.error("[contact] delivery failed:", result.reason);
    return json(502, {
      message: "We couldn’t send your enquiry just now. Your details are still in the form — please try again shortly.",
    });
  }

  console.info("[contact] enquiry accepted", { mode: result.mode, type: parsed.data.enquiryType });
  return json(200, { ok: true });
}

export function GET() {
  return json(405, { message: "Method not allowed" }, { Allow: "POST" });
}
