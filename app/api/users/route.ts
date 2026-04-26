import { NextResponse } from "next/server";
import { readDb } from "@/lib/backend/db";
import { jsonError, parsePositiveInt, sanitizeOptionalString } from "@/lib/backend/http";
import { requireAdmin } from "@/lib/backend/session";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const db = await readDb();
  const url = new URL(request.url);
  const search = sanitizeOptionalString(url.searchParams.get("search"))?.toLowerCase() ?? "";
  const role = sanitizeOptionalString(url.searchParams.get("role"))?.toLowerCase() ?? "";
  const sortBy = sanitizeOptionalString(url.searchParams.get("sortBy")) ?? "createdAt";
  const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const paginated = url.searchParams.has("page") || url.searchParams.has("limit") || url.searchParams.get("paginated") === "true";
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const limit = parsePositiveInt(url.searchParams.get("limit"), 12);

  const users = db.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })).filter((user) => {
    if (search && ![user.name, user.email, user.role].join(" ").toLowerCase().includes(search)) return false;
    if (role && user.role.toLowerCase() !== role) return false;
    return true;
  });

  const sorted = [...users].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "email":
        return a.email.localeCompare(b.email);
      case "role":
        return a.role.localeCompare(b.role);
      case "updatedAt":
        return Date.parse(a.updatedAt) - Date.parse(b.updatedAt);
      case "createdAt":
      default:
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    }
  });

  if (sortOrder === "desc") {
    sorted.reverse();
  }

  const total = sorted.length;
  const totalPages = paginated ? Math.max(1, Math.ceil(total / limit)) : 1;
  const safePage = paginated ? Math.min(page, totalPages) : 1;
  const start = paginated ? (safePage - 1) * limit : 0;
  const items = paginated ? sorted.slice(start, start + limit) : sorted;

  return NextResponse.json({
    users: items,
    meta: {
      page: safePage,
      limit: paginated ? limit : total,
      total,
      totalPages,
      hasNextPage: paginated ? safePage < totalPages : false,
      hasPrevPage: paginated ? safePage > 1 : false,
      sortBy,
      sortOrder,
    },
  });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const body = await request.json().catch(() => ({}));
  const name = sanitizeOptionalString(body.name);
  const email = sanitizeOptionalString(body.email);
  const password = sanitizeOptionalString(body.password);
  const role = sanitizeOptionalString(body.role) === "admin" ? "admin" : "user";

  if (!name || !email || !password) {
    return jsonError("Name, email, and password are required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonError("Invalid email format", 400);
  }

  const { hashPassword } = await import("@/lib/backend/auth");
  const { updateDb, cloneDb } = await import("@/lib/backend/db");
  const { randomUUID } = await import("node:crypto");

  try {
    const newUser = await updateDb((db) => {
      const next = cloneDb(db);
      if (next.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already in use");
      }
      
      const now = new Date().toISOString();
      const user = {
        id: randomUUID(),
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        role,
        createdAt: now,
        updatedAt: now,
      };
      
      next.users.push(user);
      return next;
    });
    
    const user = newUser.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return NextResponse.json({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    });
  } catch (error: any) {
    return jsonError(error.message, 400);
  }
}
