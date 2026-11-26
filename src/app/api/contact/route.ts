import { contactSchema } from "@/lib/validation/contact";
import { deliverEnquiry } from "@/lib/email";
import { guardJson, json } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const g = await guardJson(req, { bucket: "contact", maxBytes: 16_000 });
  if (!g.ok) return g.res;

  // Honeypot: bots fill hidden fields. Respond as success without delivering.
  const { hp, ...rest } = g.body;
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
    console.error("[contact] delivery failed:", result.reason); // outcome only — never personal data
    return json(502, { message: "We couldn’t send your enquiry just now. Your details are still in the form — please try again shortly." });
  }

  console.info("[contact] enquiry accepted", { mode: result.mode, type: parsed.data.enquiryType });
  return json(200, { ok: true });
}

export function GET() {
  return json(405, { message: "Method not allowed" }, { Allow: "POST" });
}
