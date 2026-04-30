import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jsonError, readJsonBody, sanitizeString } from "@/lib/backend/http";
import { getAuthenticatedUser } from "@/lib/backend/session";
import { readDb, updateDb } from "@/lib/backend/db";
import type { BackendOrder } from "@/lib/backend/catalog-seed";

export const runtime = "nodejs";

function canAccessOrder(userRole: string, userEmail: string, order: BackendOrder) {
  return userRole === "admin" || order.customerEmail.toLowerCase() === userEmail.toLowerCase();
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await params;
  const db = await readDb();
  const order = db.orders.find((item) => item.id === id);
  if (!order) return jsonError("Order not found", 404);
  if (!canAccessOrder(user.role, user.email, order)) return jsonError("Forbidden", 403);
  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const { id } = await params;
  const nextStatus = sanitizeString(body.status).toLowerCase();

  if (!["pending", "processing", "preparing", "shipped", "delivered", "cancelled", "awaiting_payment"].includes(nextStatus)) {
    return jsonError("Invalid status", 400);
  }

  let updatedOrder: BackendOrder | null = null;
  await updateDb(async (db) => {
    const currentOrder = db.orders.find((item) => item.id === id);
    if (!currentOrder) return db;
    if (!canAccessOrder(user.role, user.email, currentOrder)) return db;

    updatedOrder = { ...currentOrder, status: nextStatus as BackendOrder["status"], updatedAt: new Date().toISOString() };
    return {
      ...db,
      orders: db.orders.map((item) => (item.id === id ? updatedOrder! : item)),
    };
  });

  if (!updatedOrder) return jsonError("Order not found", 404);
  return NextResponse.json({ order: updatedOrder });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await params;
  let deleted = false;
  await updateDb(async (db) => {
    const currentOrder = db.orders.find((item) => item.id === id);
    if (!currentOrder || !canAccessOrder(user.role, user.email, currentOrder)) return db;
    deleted = true;
    return {
      ...db,
      orders: db.orders.filter((item) => item.id !== id),
    };
  });

  if (!deleted) return jsonError("Order not found", 404);
  return NextResponse.json({ ok: true });
}
