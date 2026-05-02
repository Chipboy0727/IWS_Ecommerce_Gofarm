import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readDb } from "@/lib/backend/db";
import { createSessionToken, verifyPassword } from "@/lib/backend/auth";
import { jsonError, readJsonBody, sanitizeString } from "@/lib/backend/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const email = sanitizeString(body.email).toLowerCase();
  const password = sanitizeString(body.password);
  if (!email || !password) return jsonError("Email and password are required", 400);

  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return jsonError("Invalid email or password", 401);
  }

  if ((user as any).status === "Banned") {
    return jsonError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.", 403);
  }

  const token = createSessionToken({ id: user.id, email: user.email, role: user.role });
  const response = NextResponse.json({
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      redirectTo: (user as any).redirectTo 
    },
    token,
  });

  response.cookies.set("gofarm_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
