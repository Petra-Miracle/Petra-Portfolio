import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Gate in front of /admin — a second, independent lock checked before the
 * login page (or anything else under /admin) is even served. This exists so
 * random visitors/bots can't reach the admin login form at all, not even to
 * try guessing credentials there.
 */
export function proxy(request: NextRequest) {
  const gateUser = process.env.ADMIN_GATE_USER;
  const gatePassword = process.env.ADMIN_GATE_PASSWORD;

  // If the gate isn't configured (e.g. env vars not set yet), don't silently
  // lock everyone out — just pass through.
  if (!gateUser || !gatePassword) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    const suppliedUser = decoded.slice(0, separatorIndex);
    const suppliedPassword = decoded.slice(separatorIndex + 1);

    if (safeEqual(suppliedUser, gateUser) && safeEqual(suppliedPassword, gatePassword)) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autentikasi diperlukan.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
