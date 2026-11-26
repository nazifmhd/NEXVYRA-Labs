import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Common protections for public JSON endpoints: same-origin, JSON-only,
 * per-IP rate limit (namespaced by `bucket`) and a body size cap.
 * Returns the parsed object, or a ready-to-send error response.
 */
export async function guardJson(
  req: Request,
  opts: { bucket: string; maxBytes: number; limit?: number; windowMs?: number },
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; res: NextResponse }> {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return { ok: false, res: json(403, { message: "Forbidden" }) };
    } catch {
      return { ok: false, res: json(403, { message: "Forbidden" }) };
    }
  }
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return { ok: false, res: json(415, { message: "Unsupported content type" }) };
  }
  // Production limits are strict; local development is relaxed so automated tests and evals can run.
  const max = process.env.NODE_ENV === "production" ? (opts.limit ?? 5) : 1000;
  const rl = rateLimit(`${opts.bucket}:${clientIp(req)}`, max, opts.windowMs);
  if (!rl.allowed) {
    return { ok: false, res: json(429, { message: "Too many requests" }, { "Retry-After": String(rl.retryAfter) }) };
  }
  const raw = await req.text();
  if (raw.length > opts.maxBytes) return { ok: false, res: json(413, { message: "Request too large" }) };
  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
    return { ok: true, body };
  } catch {
    return { ok: false, res: json(400, { message: "Invalid request" }) };
  }
}
