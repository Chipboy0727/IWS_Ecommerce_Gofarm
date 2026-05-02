import type { NextRequest } from "next/server";
import { readDb } from "@/lib/backend/db";
import { readSessionToken, verifySessionToken } from "@/lib/backend/auth";

/** Retrieve the authenticated user from the session cookie/token. Returns null if unauthenticated. */
export async function getAuthenticatedUser(request: NextRequest) {
  const token = readSessionToken(request);
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const db = await readDb();
  return db.users.find((item) => item.id === payload.sub && item.email === payload.email && (item as any).status !== "Banned") ?? null;
}

/** Require admin role. Returns the admin user or null if unauthorized. */
export async function requireAdmin(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "admin") return null;
  return user;
}
