/**
 * In-memory sliding-window rate limiter.
 * Each key (usually an IP address) is allowed `maxRequests` within a
 * rolling `windowMs` time window.  Oldest timestamps are pruned on
 * every call so memory stays bounded.
 */

type RateLimitEntry = { timestamps: number[] };

const store = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  /** Rolling window duration in milliseconds (default 60 000 = 1 min) */
  windowMs?: number;
  /** Maximum requests allowed inside the window (default 100) */
  maxRequests?: number;
};

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 100;

/**
 * Returns `{ allowed, remaining, retryAfterMs }`.
 *   – `allowed`     → `true` when the request can proceed.
 *   – `remaining`   → number of requests left in the current window.
 *   – `retryAfterMs`→ ms to wait before the window frees a slot (0 when allowed).
 */
export function checkRateLimit(
  key: string,
  config?: RateLimitConfig,
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const windowMs = config?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = config?.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Prune timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0] ?? now;
    const retryAfterMs = oldestInWindow + windowMs - now;
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, retryAfterMs) };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    retryAfterMs: 0,
  };
}

/**
 * Extract a best-effort client identifier from request headers.
 * Works behind proxies that set X-Forwarded-For / X-Real-IP.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

// Periodically clean up stale entries (every 5 minutes)
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 5 * 60 * 1000;
  const cleanupKey = "__rate_limit_cleanup";
  if (!(globalThis as Record<string, unknown>)[cleanupKey]) {
    (globalThis as Record<string, unknown>)[cleanupKey] = true;
    setInterval(() => {
      const cutoff = Date.now() - DEFAULT_WINDOW_MS * 2;
      for (const [key, entry] of store) {
        const latest = entry.timestamps[entry.timestamps.length - 1] ?? 0;
        if (latest < cutoff) store.delete(key);
      }
    }, CLEANUP_INTERVAL).unref?.();
  }
}
