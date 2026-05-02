import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/backend/db";
import { createResetToken, hashResetToken } from "@/lib/backend/auth";
import { jsonError, readJsonBody, sanitizeString } from "@/lib/backend/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const email = sanitizeString(body.email).toLowerCase();
  if (!email) return jsonError("Email is required", 400);

  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email);

  if (user) {
    const resetToken = createResetToken();
    const resetTokenHash = hashResetToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await updateDb(async (current) => ({
      ...current,
      users: current.users.map((item) =>
        item.id === user.id
          ? { ...item, resetTokenHash, resetTokenExpiresAt: expiresAt, updatedAt: new Date().toISOString() }
          : item
      ),
    }));

    // In production, the reset token would be sent via email.
    // In development, we include it in the response for testing convenience.
    const responsePayload: Record<string, unknown> = {
      ok: true,
      message: "If the email exists, a password reset link has been sent.",
    };

    if (process.env.NODE_ENV !== "production") {
      responsePayload.resetToken = resetToken;
      responsePayload.resetTokenExpiresAt = expiresAt;
    }

    return NextResponse.json(responsePayload);
  }

  return NextResponse.json({
    ok: true,
    message: "If the email exists, a password reset link has been sent.",
  });
}
