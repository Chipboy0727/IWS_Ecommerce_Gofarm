import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/backend/db";
import { jsonError, readJsonBody, sanitizeOptionalString, sanitizeString, slugify } from "@/lib/backend/http";
import { normalizeProductCategories } from "@/lib/backend/products";
import { requireAdmin } from "@/lib/backend/session";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { slug } = await params;
  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const db = await readDb();
  const existing = db.categories.find((item) => item.slug === slug || item.id === slug);
  if (!existing) return jsonError("Category not found", 404);

  const nextTitle = sanitizeString(body.title) || existing.title;
  const nextSlugBase = slugify(sanitizeOptionalString(body.slug) ?? nextTitle) || existing.slug;
  let nextSlug = nextSlugBase;
  let suffix = 2;
  while (db.categories.some((item) => item.slug === nextSlug && item.id !== existing.id)) {
    nextSlug = `${nextSlugBase}-${suffix++}`;
  }

  const updated = {
    ...existing,
    title: nextTitle,
    slug: nextSlug,
    imageSrc: sanitizeOptionalString(body.imageSrc) ?? existing.imageSrc,
    updatedAt: new Date().toISOString(),
  };

  await updateDb(async (current) => ({
    ...current,
    categories: current.categories.map((category) => (category.id === existing.id ? updated : category)),
  }));

  const nextDb = await readDb();
  return NextResponse.json({
    category: updated,
    categories: normalizeProductCategories(nextDb.products, nextDb.categories),
  });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { slug } = await params;
  const db = await readDb();
  const existing = db.categories.find((item) => item.slug === slug || item.id === slug);
  if (!existing) return jsonError("Category not found", 404);

  await updateDb(async (current) => ({
    ...current,
    categories: current.categories.filter((category) => category.id !== existing.id),
    products: current.products.map((product) =>
      product.categoryId === existing.id
        ? { ...product, categoryId: null, categoryTitle: null, updatedAt: new Date().toISOString() }
        : product
    ),
  }));

  const nextDb = await readDb();
  return NextResponse.json({
    ok: true,
    categories: normalizeProductCategories(nextDb.products, nextDb.categories),
  });
}
