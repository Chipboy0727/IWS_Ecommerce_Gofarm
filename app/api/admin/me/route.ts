import { NextResponse } from "next/server";
import { updateDb, cloneDb, readDb, type BackendDb } from "@/lib/backend/db";
import { jsonError } from "@/lib/backend/http";
import { requireAdmin } from "@/lib/backend/session";
import { hashPassword, verifyPassword } from "@/lib/backend/auth";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

/** GET /api/admin/me - trả về thông tin admin đang đăng nhập */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  return NextResponse.json({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  });
}

/** PUT /api/admin/me - cập nhật thông tin profile hoặc mật khẩu của admin */
export async function PUT(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const body = await request.json().catch(() => ({}));
  const { action } = body;

  // Thay đổi mật khẩu
  if (action === "change-password") {
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword.trim() : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword.trim() : "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return jsonError("All password fields are required", 400);
    }
    if (newPassword.length < 8) {
      return jsonError("New password must be at least 8 characters", 400);
    }
    if (newPassword !== confirmPassword) {
      return jsonError("New passwords do not match", 400);
    }

    // Xác minh mật khẩu hiện tại
    const db = await readDb();
    const currentUser = db.users.find((u) => u.id === admin.id);
    if (!currentUser) return jsonError("User not found", 404);

    const isValid = verifyPassword(currentPassword, currentUser.passwordHash);
    if (!isValid) return jsonError("Current password is incorrect", 400);

    await updateDb((db) => {
      const next = cloneDb(db);
      const idx = next.users.findIndex((u) => u.id === admin.id);
      if (idx === -1) throw new Error("User not found");
      next.users[idx].passwordHash = hashPassword(newPassword);
      next.users[idx].updatedAt = new Date().toISOString();
      return next;
    });

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  }

  // Cập nhật thông tin profile
  if (action === "update-profile") {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!name || !email) {
      return jsonError("Name and email are required", 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonError("Invalid email format", 400);
    }

    const updatedDb: BackendDb = await updateDb((db) => {
      const next = cloneDb(db);
      const idx = next.users.findIndex((u) => u.id === admin.id);
      if (idx === -1) throw new Error("User not found");
      if (next.users.some((u) => u.email.toLowerCase() === email && u.id !== admin.id)) {
        throw new Error("Email already in use by another account");
      }
      next.users[idx].name = name;
      next.users[idx].email = email;
      next.users[idx].updatedAt = new Date().toISOString();
      return next;
    });

    const updatedUser = updatedDb.users.find((u) => u.id === admin.id);
    if (!updatedUser) return jsonError("User not found", 404);
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt,
      },
    });
  }

  return jsonError("Invalid action", 400);
}
