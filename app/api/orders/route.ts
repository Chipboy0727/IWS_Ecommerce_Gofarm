import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readDb, updateDb } from "@/lib/backend/db";
import { getAuthenticatedUser } from "@/lib/backend/session";
import { jsonError, parsePositiveInt, readJsonBody, sanitizeOptionalString, sanitizeString, sanitizeNumber } from "@/lib/backend/http";
import type { BackendOrder } from "@/lib/backend/catalog-seed";

export const runtime = "nodejs";

function toOrderStatus(value: unknown): BackendOrder["status"] {
  const text = sanitizeString(value).toLowerCase();
  if (text === "processing" || text === "shipped" || text === "delivered" || text === "cancelled" || text === "awaiting_payment") {
    return text;
  }
  return "pending";
}

type OrderSortBy = "date" | "total" | "status" | "customerName" | "createdAt" | "updatedAt" | "items";

const ORDER_SORT_VALUES: OrderSortBy[] = ["date", "total", "status", "customerName", "createdAt", "updatedAt", "items"];

function parseOrderSortBy(value: string | null): OrderSortBy {
  if (!value) return "createdAt";
  return ORDER_SORT_VALUES.includes(value as OrderSortBy) ? (value as OrderSortBy) : "createdAt";
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const db = await readDb();
  const url = new URL(request.url);

  // ─── Filtering ───
  const search = sanitizeOptionalString(url.searchParams.get("search"))?.toLowerCase() ?? "";
  const statusFilter = sanitizeOptionalString(url.searchParams.get("status"))?.toLowerCase() ?? "";

  let orders = user.role === "admin"
    ? db.orders
    : db.orders.filter((order) => order.customerEmail.toLowerCase() === user.email.toLowerCase());

  // Apply search filter
  if (search) {
    orders = orders.filter((order) =>
      [order.id, order.customerName, order.customerEmail, order.shippingAddress, order.paymentMethod]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }

  // Apply status filter
  if (statusFilter) {
    orders = orders.filter((order) => order.status.toLowerCase() === statusFilter);
  }

  const minTotalRaw = url.searchParams.get("minTotal");
  const maxTotalRaw = url.searchParams.get("maxTotal");
  if (minTotalRaw !== null && minTotalRaw !== "") {
    const minT = Number(minTotalRaw);
    if (Number.isFinite(minT)) orders = orders.filter((o) => o.total >= minT);
  }
  if (maxTotalRaw !== null && maxTotalRaw !== "") {
    const maxT = Number(maxTotalRaw);
    if (Number.isFinite(maxT)) orders = orders.filter((o) => o.total <= maxT);
  }

  const fromDate = sanitizeOptionalString(url.searchParams.get("fromDate"));
  const toDate = sanitizeOptionalString(url.searchParams.get("toDate"));
  if (fromDate) {
    const fromMs = Date.parse(fromDate);
    if (Number.isFinite(fromMs)) {
      orders = orders.filter((o) => Date.parse(o.createdAt) >= fromMs);
    }
  }
  if (toDate) {
    const toMs = Date.parse(toDate);
    if (Number.isFinite(toMs)) {
      orders = orders.filter((o) => Date.parse(o.createdAt) <= toMs);
    }
  }

  // ─── Sorting ───
  const sortBy = parseOrderSortBy(url.searchParams.get("sortBy"));
  const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const sorted = [...orders].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return Date.parse(a.date) - Date.parse(b.date);
      case "total":
        return a.total - b.total;
      case "status":
        return a.status.localeCompare(b.status);
      case "customerName":
        return a.customerName.localeCompare(b.customerName);
      case "items":
        return a.items - b.items;
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

  // ─── Pagination ───
  const paginated = url.searchParams.has("page") || url.searchParams.has("limit") || url.searchParams.get("paginated") === "true";
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const limit = parsePositiveInt(url.searchParams.get("limit"), 12);
  const total = sorted.length;
  const totalPages = paginated ? Math.max(1, Math.ceil(total / limit)) : 1;
  const safePage = paginated ? Math.min(page, totalPages) : 1;
  const start = paginated ? (safePage - 1) * limit : 0;
  const items = paginated ? sorted.slice(start, start + limit) : sorted;

  return NextResponse.json({
    orders: items,
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
