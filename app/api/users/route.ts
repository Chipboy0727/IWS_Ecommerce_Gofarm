import { NextResponse } from "next/server";
import { readDb } from "@/lib/backend/db";
import { jsonError } from "@/lib/backend/http";
import { requireAdmin } from "@/lib/backend/session";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const db = await readDb();
  const users = db.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return NextResponse.json({ users });
}
