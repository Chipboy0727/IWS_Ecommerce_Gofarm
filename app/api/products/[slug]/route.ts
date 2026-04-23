import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDb, updateDb } from "@/lib/backend/db";
import { jsonError, readJsonBody } from "@/lib/backend/http";
import { updateProductPayload } from "@/lib/backend/products";
import { requireAdmin } from "@/lib/backend/session";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const db = await readDb();
  const product = db.products.find((item) => item.slug === slug);
  if (!product) return jsonError("Product not found", 404);
  return NextResponse.json({ product });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { slug } = await params;
  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const db = await readDb();
  const existing = db.products.find((item) => item.slug === slug);
  if (!existing) return jsonError("Product not found", 404);

  const result = updateProductPayload(existing, body, db.categories, db.products);
  if ("error" in result) return jsonError(String(result.error), 400);

  await updateDb(async (current) => ({
    ...current,
    products: current.products.map((product) => (product.id === existing.id ? result.product : product)),
  }));

  revalidatePath("/", "layout");

  return NextResponse.json({ product: result.product });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { slug } = await params;
  const db = await readDb();
  const existing = db.products.find((item) => item.slug === slug);
  if (!existing) return jsonError("Product not found", 404);

  await updateDb(async (current) => ({
    ...current,
    products: current.products.filter((product) => product.id !== existing.id),
  }));

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
