import { SESSION_COOKIE, TOKEN_SECRET, type SessionRole, type SessionUser } from "@/lib/backend/auth-common";

function base64UrlEncode(bytes: Uint8Array) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function sign(value: string) {
  const keyData = new TextEncoder().encode(TOKEN_SECRET);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`);
  if (signature !== expectedSignature) return null;

  try {
    const payloadText = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadText) as SessionUser;
    if (!payload?.sub || !payload?.email || !payload?.role || !payload?.exp || !payload?.iat) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
