import { talentSchema } from "@/lib/validation/talent";
import { talentAreas } from "@/content/careers";
import { sendMail } from "@/lib/email";
import { guardJson, json } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const g = await guardJson(req, { bucket: "talent", maxBytes: 8_000, limit: 3 });
  if (!g.ok) return g.res;

  const { hp, ...rest } = g.body;
  if (typeof hp === "string" && hp.length > 0) return json(200, { ok: true });

  const parsed = talentSchema.safeParse(rest);
  if (!parsed.success) {
    return json(400, { message: "Please check the highlighted fields", fieldErrors: parsed.error.flatten().fieldErrors });
  }
  const d = parsed.data;
  const area = talentAreas.find((a) => a.value === d.area)?.label ?? d.area;

  const result = await sendMail({
    subject: `Talent pool — ${area} — ${d.name.slice(0, 60)}`,
    replyTo: d.email,
    text: [
      "New talent-pool registration",
      "",
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Location: ${d.location || "—"}`,
      `Area: ${area}`,
      `Profile: ${d.profile}`,
      "",
      "About them:",
      d.message,
      "",
      `Privacy notice acknowledged: yes (${new Date().toISOString()})`,
    ].join("\n"),
    logMeta: { area: d.area },
  });

  if (!result.ok) {
    console.error("[talent] delivery failed:", result.reason);
    return json(502, { message: "We couldn’t send this just now. Your details are still in the form — please try again shortly." });
  }
  return json(200, { ok: true });
}

export function GET() {
  return json(405, { message: "Method not allowed" }, { Allow: "POST" });
}
