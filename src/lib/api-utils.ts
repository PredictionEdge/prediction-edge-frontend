import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./rate-limit";

/**
 * Extract client identifier for rate limiting.
 * Uses X-Forwarded-For (Vercel sets this), falls back to a default.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Apply rate limiting to an API route.
 * Returns a NextResponse with 429 if rate limited, or null if OK.
 */
export function applyRateLimit(
  request: NextRequest,
  limit: number = 60,
  windowMs: number = 60_000
): NextResponse | null {
  const ip = getClientIp(request);
  const result = rateLimit(ip, limit, windowMs);

  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.reset / 1000)),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
