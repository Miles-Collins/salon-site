import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic Auth settings (read at build time for middleware/edge runtime)
const BASIC_USER = process.env.BASIC_AUTH_USER || "porscha"; // dev default
const BASIC_PASS = process.env.BASIC_AUTH_PASS || "style"; // dev default
const AUTH_ENABLED = (process.env.BASIC_AUTH_ENABLED ?? "true").toLowerCase() !== "false";
function unauthorized(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      // Triggers browser basic-auth prompt
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export function middleware(req: NextRequest) {
  if (!AUTH_ENABLED) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Extra guard (also enforced by matcher below)
  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return unauthorized();

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "basic" || !encoded) return unauthorized();

  // Edge runtime: use atob to decode Base64, not Node Buffer
  let decoded: string;
  try {
    decoded = globalThis.atob(encoded);
  } catch {
    return unauthorized();
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return unauthorized();

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  if (user !== BASIC_USER || pass !== BASIC_PASS) {
    return unauthorized("Invalid credentials");
  }

  return NextResponse.next();
}

// Only protect actual app routes. Allow Next.js internals and common static assets.
export const config = {
  matcher: [
    // Negative lookahead to exclude _next assets and common public files
    "/((?!_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|icon-\\d+x\\d+\\.png|apple-touch-icon\\.png|og-image\\.jpg).*)",
  ],
};
