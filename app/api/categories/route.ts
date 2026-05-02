import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readDb, updateDb } from "@/lib/backend/db";
import { jsonError, parsePositiveInt, readJsonBody, sanitizeOptionalString, sanitizeString, slugify } from "@/lib/backend/http";
import { normalizeProductCategories } from "@/lib/backend/products";
import { requireAdmin } from "@/lib/backend/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const db = await readDb();
  const url = new URL(request.url);
  const search = sanitizeOptionalString(url.searchParams.get("search"))?.toLowerCase() ?? "";
  const sortBy = sanitizeOptionalString(url.searchParams.get("sortBy")) ?? "title";
  const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const paginated = url.searchParams.has("page") || url.searchParams.has("limit") || url.searchParams.get("paginated") === "true";
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const limit = parsePositiveInt(url.searchParams.get("limit"), 12);

  const filtered = normalizeProductCategories(db.products, db.categories).filter((category) => {
    if (!search) return true;
    return [category.title, category.slug].join(" ").toLowerCase().includes(search);
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "count":
        return a.count - b.count;
      case "createdAt":
        return Date.parse(a.createdAt ?? "") - Date.parse(b.createdAt ?? "");
      case "updatedAt":
        return Date.parse(a.updatedAt ?? "") - Date.parse(b.updatedAt ?? "");
      case "title":
      default:
        return a.title.localeCompare(b.title);
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
    categories: items,
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

  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const title = sanitizeString(body.title);
  if (!title) return jsonError("Category title is required", 400);

  const slugBase = slugify(sanitizeOptionalString(body.slug) ?? title) || `category-${randomUUID().slice(0, 8)}`;
  const db = await readDb();
  let slug = slugBase;
  let suffix = 2;
  while (db.categories.some((item) => item.slug === slug)) {
    slug = `${slugBase}-${suffix++}`;
  }

  const now = new Date().toISOString();
  const category = {
    id: randomUUID(),
    title,
    slug,
    imageSrc: sanitizeOptionalString(body.imageSrc),
    count: 0,
    createdAt: now,
    updatedAt: now,
  };

  await updateDb(async (current) => ({
    ...current,
    categories: [category, ...current.categories],
  }));

  const nextDb = await readDb();
  return NextResponse.json(
    {
      category,
      categories: normalizeProductCategories(nextDb.products, nextDb.categories),
    },
    { status: 201 }
  );
}
