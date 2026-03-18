/**
 * Simple in-memory sliding window rate limiter.
 * Tracks timestamps per key and rejects requests exceeding the limit.
 *
 * Note: This is per-process — in a multi-instance deployment,
 * use Redis or Upstash Rate Limit instead.
 */

const store = new Map<string, number[]>();

type RateLimitResult = { success: true } | { success: false; retryAfterMs: number };

export function rateLimit(
  key: string,
  { windowMs, maxRequests }: { windowMs: number; maxRequests: number },
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  const timestamps = store.get(key) ?? [];
  const recent = timestamps.filter((t) => t > cutoff);

  if (recent.length >= maxRequests) {
    const oldestInWindow = recent[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return { success: false, retryAfterMs };
  }

  recent.push(now);
  store.set(key, recent);
  return { success: true };
}
