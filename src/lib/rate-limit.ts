/**
 * Rate limiting stub.
 *
 * In-memory rate limiting doesn't work on Vercel serverless (each invocation
 * gets fresh memory). This stub always allows requests.
 *
 * TODO: Replace with Redis-backed rate limiting using the arb system's Redis
 * instance, or use Vercel's built-in WAF rate limiting.
 */
export function rateLimit(
  _key: string,
  _limit: number = 60,
  _windowMs: number = 60_000
): { success: true; reset: number } {
  return { success: true, reset: 0 };
}
