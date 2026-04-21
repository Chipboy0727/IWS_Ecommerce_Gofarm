import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/backend/db";
import { jsonError, parsePositiveInt, readJsonBody, sanitizeOptionalString } from "@/lib/backend/http";
import { createProductPayload, listProducts, normalizeProductCategories, parseProductSortBy } from "@/lib/backend/products";
import { requireAdmin } from "@/lib/backend/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const db = await readDb();
  const url = new URL(request.url);
  const paginated = url.searchParams.has("page") || url.searchParams.has("limit") || url.searchParams.get("paginated") === "true";

  const { items, meta } = listProducts(db.products, {
    search: sanitizeOptionalString(url.searchParams.get("search")) ?? undefined,
    category: sanitizeOptionalString(url.searchParams.get("category")) ?? undefined,
    brand: sanitizeOptionalString(url.searchParams.get("brand")) ?? undefined,
    status: sanitizeOptionalString(url.searchParams.get("status")) ?? undefined,
    sortBy: parseProductSortBy(url.searchParams.get("sortBy")),
    sortOrder: url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc",
    page: parsePositiveInt(url.searchParams.get("page"), 1),
    limit: parsePositiveInt(url.searchParams.get("limit"), 12),
    paginated,
  });

  return NextResponse.json({
    products: items,
    categories: normalizeProductCategories(db.products, db.categories),
    meta,
  });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const db = await readDb();
  const result = createProductPayload(body, db.categories, db.products);
  if ("error" in result) return jsonError(String(result.error), 400);

  await updateDb(async (current) => ({
    ...current,
    products: [result.product, ...current.products],
  }));

  const nextDb = await readDb();
  return NextResponse.json(
    {
      product: result.product,
      categories: normalizeProductCategories(nextDb.products, nextDb.categories),
    },
    { status: 201 }
  );
}
