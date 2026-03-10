import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, SESSION_COOKIE_NAME, SESSION_EXPIRY_MS } from "@/lib/auth/session";
import { applyRateLimit } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  // Rate limit: 10 auth attempts per minute
  const rateLimited = applyRateLimit(request, 10, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const sessionCookie = await createSessionCookie(idToken);

    const response = NextResponse.json({ status: "success" });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRY_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session creation failed:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}
