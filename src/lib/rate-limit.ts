/**
 * Minimal fixed-window rate limiter. In-memory, so limits are per server
 * instance — adequate for a low-traffic marketing site. For multi-region or
 * serverless scale, replace with a shared store (e.g. Upstash/Redis).
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > max) return { allowed: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  return { allowed: true, retryAfter: 0 };
}
