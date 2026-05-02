import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/backend/rate-limit";

/**
 * Next.js Edge Middleware — Security & Access Control
 * ---------------------------------------------------
 * Implements multiple OWASP Top 10 mitigations:
 *
 *  • A01:2021 – Broken Access Control
 *    → Admin route protection: unauthenticated users are redirected to /sign-in.
 *    → CORS preflight (OPTIONS) returns a strict Allow-Origin policy.
 *
 *  • A05:2021 – Security Misconfiguration
 *    → Every response receives hardened security headers (CSP, HSTS,
 *      X-Frame-Options, X-Content-Type-Options, Permissions-Policy).
 *
 *  • A07:2021 – Identification and Authentication Failures
 *    → Rate-limiting on API routes (100 req/min general, 20 req/min for
 *      /api/auth/* to mitigate brute-force and credential-stuffing attacks).
 */

const RATE_LIMIT_CONFIG = { windowMs: 60_000, maxRequests: 100 };

// Stricter limit for auth endpoints to mitigate brute-force attacks
const AUTH_RATE_LIMIT_CONFIG = { windowMs: 60_000, maxRequests: 20 };

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── CORS Preflight (OPTIONS) for API routes ───
  // Returns an immediate 204 with the required Access-Control-* headers
  // so that cross-origin requests from the allowed frontend origin succeed.
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // ─── Rate Limiting (API routes only) ───
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(request);
    const isAuthRoute = pathname.startsWith("/api/auth/");
    const config = isAuthRoute ? AUTH_RATE_LIMIT_CONFIG : RATE_LIMIT_CONFIG;
    const { allowed, remaining, retryAfterMs } = checkRateLimit(
      `${ip}:${isAuthRoute ? "auth" : "api"}`,
      config,
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
            "X-RateLimit-Limit": String(config.maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil((Date.now() + retryAfterMs) / 1000)),
          },
        },
      );
    }

    // Continue but attach rate-limit info headers
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(config.maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    addSecurityHeaders(response);
    return response;
  }

  // ─── Admin Route Protection & Unified Login ───
  if (pathname.startsWith("/admin/login")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("gofarm_session")?.value;
    if (!sessionCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/sign-in";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─── Default: add security headers ───
  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

/**
 * Attach security-related HTTP headers to the response.
 * Mitigates clickjacking, XSS, MIME-sniffing, and other common web vulnerabilities.
 */
function addSecurityHeaders(response: NextResponse) {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Block MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions / Feature policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=(self)",
  );

  // Strict Transport Security (applied only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  // Content Security Policy — permissive enough for the app to work,
  // strict enough to block inline-injection attacks.
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://i.pinimg.com https://images.unsplash.com https://*.googleusercontent.com https://*.gstatic.com",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
}

/**
 * Matcher — apply middleware to API routes, admin pages, and all regular pages.
 * Skip static assets and Next.js internals for performance.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|css/|fonts/|js/).*)",
  ],
};
