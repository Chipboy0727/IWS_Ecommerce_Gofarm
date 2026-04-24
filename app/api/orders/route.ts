import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readDb, updateDb } from "@/lib/backend/db";
import { getAuthenticatedUser } from "@/lib/backend/session";
import { jsonError, readJsonBody, sanitizeOptionalString, sanitizeString, sanitizeNumber } from "@/lib/backend/http";
import type { BackendOrder } from "@/lib/backend/catalog-seed";

export const runtime = "nodejs";

function toOrderStatus(value: unknown): BackendOrder["status"] {
  const text = sanitizeString(value).toLowerCase();
  if (text === "processing" || text === "shipped" || text === "delivered" || text === "cancelled" || text === "awaiting_payment") {
    return text;
  }
  return "pending";
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const db = await readDb();
  const orders = user.role === "admin"
    ? db.orders
    : db.orders.filter((order) => order.customerEmail.toLowerCase() === user.email.toLowerCase());

  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const now = new Date().toISOString();
  const id = sanitizeOptionalString(body.id) ?? `ORD-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const products = Array.isArray(body.products)
    ? body.products.map((item) => ({
        id: sanitizeOptionalString((item as Record<string, unknown>).id) ?? randomUUID(),
        name: sanitizeString((item as Record<string, unknown>).name) || "Product",
        price: sanitizeNumber((item as Record<string, unknown>).price, 0),
        quantity: Math.max(1, Math.floor(sanitizeNumber((item as Record<string, unknown>).quantity, 1))),
        imageSrc: sanitizeOptionalString((item as Record<string, unknown>).imageSrc) ?? "/images/logo.svg",
        slug: sanitizeOptionalString((item as Record<string, unknown>).slug) ?? "product",
      }))
    : [];

  const order: BackendOrder = {
    id,
    date: sanitizeOptionalString(body.date) ?? now.slice(0, 10),
    total: sanitizeNumber(body.total, 0),
    status: toOrderStatus(body.status),
    items: Math.max(0, Math.floor(sanitizeNumber(body.items, products.length))),
    products,
    shippingAddress: sanitizeString(body.shippingAddress),
    customerName: sanitizeString(body.customerName) || user.name,
    customerEmail: sanitizeString(body.customerEmail) || user.email,
    customerPhone: sanitizeString(body.customerPhone),
    paymentMethod: sanitizeString(body.paymentMethod) || "Cash on Delivery",
    createdAt: sanitizeOptionalString(body.createdAt) ?? now,
    updatedAt: now,
  };

  await updateDb(async (db) => {
    const nextOrders = db.orders.filter((existing) => existing.id !== order.id);
    nextOrders.unshift(order);
    return { ...db, orders: nextOrders };
  });

  return NextResponse.json({ order }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  await updateDb(async (db) => ({
    ...db,
    orders: user.role === "admin" ? [] : db.orders.filter((order) => order.customerEmail.toLowerCase() !== user.email.toLowerCase()),
  }));

  return NextResponse.json({ ok: true });
}
