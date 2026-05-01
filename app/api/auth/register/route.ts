import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readDb, updateDb } from "@/lib/backend/db";
import { createSessionToken, hashPassword } from "@/lib/backend/auth";
import { jsonError, readJsonBody, sanitizeString } from "@/lib/backend/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const name = sanitizeString(body.name);
  const email = sanitizeString(body.email).toLowerCase();
  const password = sanitizeString(body.password);

  if (!name || !email || !password) return jsonError("Name, email and password are required", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("Invalid email address", 400);
  if (password.length < 8) return jsonError("Password must be at least 8 characters", 400);

  const db = await readDb();
  if (db.users.some((user) => user.email.toLowerCase() === email)) {
    return jsonError("Email already exists", 409);
  }

  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    role: "user" as const,
    phone: sanitizeString(body.phone),
    address: sanitizeString(body.address),
    city: sanitizeString(body.city),
    state: sanitizeString(body.state),
    zipCode: sanitizeString(body.zipCode),
    status: "Active",
    createdAt: now,
    updatedAt: now,
  };

  await updateDb(async (current) => ({
    ...current,
    users: [...current.users, user],
  }));

  return NextResponse.json(
    { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    { status: 201 }
  );
}
