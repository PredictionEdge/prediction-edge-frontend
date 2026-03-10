/**
 * Simple in-memory sliding window rate limiter.
 * For production at scale, swap with Redis-backed implementation.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 60_000);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}, 60_000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // ms until window resets
}

/**
 * Check rate limit for a given key.
 * @param key - Unique identifier (e.g. IP or user ID)
 * @param limit - Max requests per window
 * @param windowMs - Window size in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key) || { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    return {
      success: false,
      remaining: 0,
      reset: oldest + windowMs - now,
    };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    success: true,
    remaining: limit - entry.timestamps.length,
    reset: windowMs,
  };
}
