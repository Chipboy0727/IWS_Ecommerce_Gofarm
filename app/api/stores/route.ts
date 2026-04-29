import { NextResponse } from "next/server";
import { readDb, updateDb, cloneDb, type BackendDb } from "@/lib/backend/db";
import { jsonError, sanitizeOptionalString } from "@/lib/backend/http";
import { requireAdmin } from "@/lib/backend/session";
import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  try {
    const db = await readDb();
    return NextResponse.json(db.stores);
  } catch (error: any) {
    return jsonError(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const body = await request.json().catch(() => ({}));
  const name = sanitizeOptionalString(body.name);
  const address = sanitizeOptionalString(body.address);
  const city = sanitizeOptionalString(body.city);

  if (!name || !address || !city) {
    return jsonError("Name, address, and city are required", 400);
  }

  try {
    const nextDb: BackendDb = await updateDb((db) => {
      const next = cloneDb(db);
      
      const newStore = {
        id: randomUUID(),
        name,
        address,
        phone: sanitizeOptionalString(body.phone) || "",
        email: sanitizeOptionalString(body.email) || "",
        country: sanitizeOptionalString(body.country) || "",
        hours: sanitizeOptionalString(body.hours) || "",
        city,
        pinX: Number(body.pinX) || 0,
        pinY: Number(body.pinY) || 0,
        manager: sanitizeOptionalString(body.manager) || "",
        contact: sanitizeOptionalString(body.contact) || "",
        imageSrc: sanitizeOptionalString(body.imageSrc) || "/images/logo.svg",
        status: sanitizeOptionalString(body.status) === "Maintenance" ? "Maintenance" as const : "Active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      next.stores.push(newStore);
      return next;
    });

    const store = nextDb.stores[nextDb.stores.length - 1];
    return NextResponse.json(store);
  } catch (error: any) {
    return jsonError(error.message, 400);
  }
}
