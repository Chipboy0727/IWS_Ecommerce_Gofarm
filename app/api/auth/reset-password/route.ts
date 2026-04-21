import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/backend/db";
import { hashPassword, hashResetToken } from "@/lib/backend/auth";
import { jsonError, readJsonBody, sanitizeString } from "@/lib/backend/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const email = sanitizeString(body.email).toLowerCase();
  const token = sanitizeString(body.token);
  const password = sanitizeString(body.password);

  if (!email || !token || !password) return jsonError("Email, token and password are required", 400);
  if (password.length < 8) return jsonError("Password must be at least 8 characters", 400);

  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email);
  if (!user) return jsonError("Invalid reset token", 400);

  const expectedHash = user.resetTokenHash;
  const expectedExpiry = user.resetTokenExpiresAt ? Date.parse(user.resetTokenExpiresAt) : 0;
  const providedHash = hashResetToken(token);
  if (!expectedHash || expectedHash !== providedHash || !expectedExpiry || expectedExpiry < Date.now()) {
    return jsonError("Invalid or expired reset token", 400);
  }

  await updateDb(async (current) => ({
    ...current,
    users: current.users.map((item) =>
      item.id === user.id
        ? {
            ...item,
            passwordHash: hashPassword(password),
            resetTokenHash: null,
            resetTokenExpiresAt: null,
            updatedAt: new Date().toISOString(),
          }
        : item
    ),
  }));

  return NextResponse.json({ ok: true });
}
