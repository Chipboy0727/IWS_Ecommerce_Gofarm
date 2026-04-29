import { NextResponse } from "next/server";
import { updateDb, cloneDb, type BackendDb } from "@/lib/backend/db";
import { jsonError, sanitizeOptionalString } from "@/lib/backend/http";
import { requireAdmin } from "@/lib/backend/session";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { id } = await params;
  if (!id) return jsonError("Store ID required", 400);

  const body = await request.json().catch(() => ({}));

  try {
    const nextDb: BackendDb = await updateDb((db) => {
      const next = cloneDb(db);
      const storeIndex = next.stores.findIndex((s) => s.id === id);
      
      if (storeIndex === -1) {
        throw new Error("Store not found");
      }
      
      const currentStore = next.stores[storeIndex];
      
      if (body.name !== undefined) currentStore.name = sanitizeOptionalString(body.name) || currentStore.name;
      if (body.address !== undefined) currentStore.address = sanitizeOptionalString(body.address) || currentStore.address;
      if (body.city !== undefined) currentStore.city = sanitizeOptionalString(body.city) || currentStore.city;
      if (body.phone !== undefined) currentStore.phone = sanitizeOptionalString(body.phone) || "";
      if (body.email !== undefined) currentStore.email = sanitizeOptionalString(body.email) || "";
      if (body.country !== undefined) currentStore.country = sanitizeOptionalString(body.country) || "";
      if (body.hours !== undefined) currentStore.hours = sanitizeOptionalString(body.hours) || "";
      if (body.manager !== undefined) currentStore.manager = sanitizeOptionalString(body.manager) || "";
      if (body.contact !== undefined) currentStore.contact = sanitizeOptionalString(body.contact) || "";
      if (body.imageSrc !== undefined) currentStore.imageSrc = sanitizeOptionalString(body.imageSrc) || "/images/logo.svg";
      if (body.status !== undefined) currentStore.status = sanitizeOptionalString(body.status) === "Maintenance" ? "Maintenance" : "Active";
      if (body.pinX !== undefined) currentStore.pinX = Number(body.pinX) || 0;
      if (body.pinY !== undefined) currentStore.pinY = Number(body.pinY) || 0;
      
      currentStore.updatedAt = new Date().toISOString();
      
      return next;
    });
    
    const store = nextDb.stores.find((s) => s.id === id);
    return NextResponse.json(store);
  } catch (error: any) {
    if (error.message === "Store not found") return jsonError(error.message, 404);
    return jsonError(error.message, 400);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { id } = await params;
  if (!id) return jsonError("Store ID required", 400);

  try {
    await updateDb((db) => {
      const next = cloneDb(db);
      const storeIndex = next.stores.findIndex((s) => s.id === id);
      
      if (storeIndex === -1) {
        throw new Error("Store not found");
      }
      
      next.stores.splice(storeIndex, 1);
      return next;
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Store not found") return jsonError(error.message, 404);
    return jsonError(error.message, 400);
  }
}
