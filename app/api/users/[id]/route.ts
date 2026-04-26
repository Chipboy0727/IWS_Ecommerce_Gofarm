import { NextResponse } from "next/server";
import { updateDb, cloneDb } from "@/lib/backend/db";
import { jsonError, sanitizeOptionalString } from "@/lib/backend/http";
import { requireAdmin } from "@/lib/backend/session";
import { hashPassword } from "@/lib/backend/auth";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { id } = params;
  if (!id) return jsonError("User ID required", 400);

  const body = await request.json().catch(() => ({}));
  const name = sanitizeOptionalString(body.name);
  const email = sanitizeOptionalString(body.email);
  const password = sanitizeOptionalString(body.password);
  const role = sanitizeOptionalString(body.role) === "admin" ? "admin" : "user";
  const status = sanitizeOptionalString(body.status);

  if (!name || !email) {
    return jsonError("Name and email are required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonError("Invalid email format", 400);
  }

  try {
    const updatedUser = await updateDb((db) => {
      const next = cloneDb(db);
      const userIndex = next.users.findIndex((u) => u.id === id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      if (next.users.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== id)) {
        throw new Error("Email already in use");
      }
      
      const currentUser = next.users[userIndex];
      if (!currentUser) throw new Error("User not found");
      
      currentUser.name = name;
      currentUser.email = email.toLowerCase();
      currentUser.role = role;
      currentUser.updatedAt = new Date().toISOString();
      
      if (status) {
        currentUser.status = status;
      }
      
      if (password) {
        currentUser.passwordHash = hashPassword(password);
      }
      
      return next;
    });
    
    const user = updatedUser.users.find((u) => u.id === id);
    return NextResponse.json({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      status: user?.status,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    });
  } catch (error: any) {
    if (error.message === "User not found") return jsonError(error.message, 404);
    return jsonError(error.message, 400);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { id } = params;
  if (!id) return jsonError("User ID required", 400);
  
  if (admin.sub === id) {
    return jsonError("Cannot delete your own account", 400);
  }

  try {
    await updateDb((db) => {
      const next = cloneDb(db);
      const userIndex = next.users.findIndex((u) => u.id === id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      next.users.splice(userIndex, 1);
      return next;
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "User not found") return jsonError(error.message, 404);
    return jsonError(error.message, 400);
  }
}
