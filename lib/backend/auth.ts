import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export type SessionRole = "admin" | "user";

type SessionUser = {
  sub: string;
  email: string;
  role: SessionRole;
  exp: number;
  iat: number;
};

export const SESSION_COOKIE = "gofarm_session";
const TOKEN_SECRET = process.env.GOFARM_AUTH_SECRET ?? "gofarm-dev-secret";

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", TOKEN_SECRET).update(value).digest("base64url");
}

/** Hash a password using PBKDF2 with a random salt. Returns "salt:derived" format. */
export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = pbkdf2Sync(password, salt, 120_000, 32, "sha256").toString("hex");
  return `${salt}:${derived}`;
}

/** Verify a plaintext password against a stored "salt:derived" hash using timing-safe comparison. */
export function verifyPassword(password: string, storedHash: string) {
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) return false;
  const candidate = pbkdf2Sync(password, salt, 120_000, 32, "sha256").toString("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const candidateBuffer = Buffer.from(candidate, "hex");
  if (expectedBuffer.length !== candidateBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, candidateBuffer);
}

/** Create a signed JWT session token valid for 7 days. */
export function createSessionToken(user: { id: string; email: string; role: SessionRole }) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7;
  const payload: SessionUser = { sub: user.id, email: user.email, role: user.role, iat, exp };
  const encodedHeader = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/** Verify and decode a JWT session token. Returns the payload or null if invalid/expired. */
export function verifySessionToken(token: string): SessionUser | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`);
  if (signature !== expectedSignature) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionUser;
    if (!payload?.sub || !payload?.email || !payload?.role || !payload?.exp || !payload?.iat) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}


/** Build a Set-Cookie header that clears/expires the session cookie. */
export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

/** Extract the session token from the Authorization header or cookie. */
export function readSessionToken(request: Request | NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
  if (bearer) return bearer;
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieMatch = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return cookieMatch?.[1] ?? "";
}

/** Generate a cryptographically random reset token. */
export function createResetToken() {
  return randomBytes(24).toString("base64url");
}

/** Hash a reset token for secure storage comparison. */
export function hashResetToken(token: string) {
  return createHmac("sha256", TOKEN_SECRET).update(`reset:${token}`).digest("hex");
}
