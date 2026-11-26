import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { guardJson, json } from "@/lib/api-guard";
import { ASSISTANT_RULES, buildSiteKnowledge } from "@/lib/assistant/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Claude Haiku 5.5: fast and low-cost, a good fit for short site Q&A.
// (Haiku has no server-side refusal fallback; refusals end in the /contact handoff below.)
const MODEL = "claude-haiku-5-5";
const HANDOFF = "\n\nI can't help with that one here — please use /contact and a person from the team will reply.";

const bodySchema = z
  .object({
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(4000),
        }),
      )
      .min(1)
      .max(12),
  })
  .strict()
  .refine((b) => b.messages[0].role === "user" && b.messages[b.messages.length - 1].role === "user", "Conversation must start and end with a user message")
  .refine((b) => b.messages.every((m) => m.role !== "user" || m.content.length <= 1000), "Messages are limited to 1,000 characters");

// Built once per server instance; deterministic so the prompt cache stays warm.
const SYSTEM: Anthropic.TextBlockParam[] = [
  { type: "text", text: `${ASSISTANT_RULES}\n\n<site_content>\n${buildSiteKnowledge()}\n</site_content>`, cache_control: { type: "ephemeral" } },
];

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return json(503, { message: "The assistant isn’t available right now." });

  // Per-visitor limit: 20 questions per 10 minutes (production).
  const g = await guardJson(req, { bucket: "assistant", maxBytes: 24_000, limit: 20 });
  if (!g.ok) return g.res;

  const parsed = bodySchema.safeParse(g.body);
  if (!parsed.success) return json(400, { message: parsed.error.issues[0]?.message ?? "Invalid request" });

  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 8000,
    output_config: { effort: "low" },
    system: SYSTEM,
    messages: parsed.data.messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sent = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") controller.enqueue(encoder.encode(sent ? HANDOFF : HANDOFF.trim()));
        console.info("[assistant] reply", {
          stop: final.stop_reason,
          out: final.usage.output_tokens,
          cacheRead: final.usage.cache_read_input_tokens ?? 0,
        });
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) console.warn("[assistant] provider rate limited");
        else if (err instanceof Anthropic.APIError) console.error("[assistant] API error", err.status);
        else console.error("[assistant] stream failed", err instanceof Error ? err.name : "unknown");
        controller.enqueue(encoder.encode(sent ? "\n\n(The reply was interrupted. Please try again.)" : "Sorry — I couldn’t answer just now. Please try again, or use /contact to reach the team."));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export function GET() {
  return json(405, { message: "Method not allowed" }, { Allow: "POST" });
}
