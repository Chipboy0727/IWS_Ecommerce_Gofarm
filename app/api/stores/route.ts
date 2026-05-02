import { NextResponse } from "next/server";
import { readDb, updateDb, cloneDb, type BackendDb } from "@/lib/backend/db";
import { jsonError, readJsonBody, sanitizeOptionalString } from "@/lib/backend/http";
import { wantsPagination, parsePageLimit, type ListMeta } from "@/lib/backend/list-utils";
import { requireAdmin } from "@/lib/backend/session";
import type { NextRequest } from "next/server";
import type { BackendStore } from "@/lib/backend/catalog-seed";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

type StoreSortBy = "name" | "city" | "status" | "createdAt" | "updatedAt";

const STORE_SORT: StoreSortBy[] = ["name", "city", "status", "createdAt", "updatedAt"];

function parseStoreSortBy(raw: string | null): StoreSortBy {
  if (!raw) return "name";
  return STORE_SORT.includes(raw as StoreSortBy) ? (raw as StoreSortBy) : "name";
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  try {
    const db = await readDb();
    const url = new URL(request.url);
    const search = sanitizeOptionalString(url.searchParams.get("search"))?.toLowerCase() ?? "";
    const statusRaw = sanitizeOptionalString(url.searchParams.get("status"))?.toLowerCase() ?? "";

    let list = [...db.stores];

    if (search) {
      list = list.filter((s) =>
        [s.name, s.address, s.city, s.manager, s.email, s.phone, s.country ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(search)
      );
    }
    if (statusRaw === "active") list = list.filter((s) => s.status === "Active");
    if (statusRaw === "maintenance") list = list.filter((s) => s.status === "Maintenance");

    const sortBy = parseStoreSortBy(url.searchParams.get("sortBy"));
    const sortOrder = url.searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    list.sort((a, b) => {
      switch (sortBy) {
        case "city":
          return a.city.localeCompare(b.city);
        case "status":
          return a.status.localeCompare(b.status);
        case "createdAt":
          return Date.parse(a.createdAt) - Date.parse(b.createdAt);
        case "updatedAt":
          return Date.parse(a.updatedAt) - Date.parse(b.updatedAt);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    if (sortOrder === "desc") list.reverse();

    const paginated = wantsPagination(url.searchParams);
    const { page: rawPage, limit } = parsePageLimit(url.searchParams, 12);
    const total = list.length;
    const totalPages = paginated ? Math.max(1, Math.ceil(total / limit)) : 1;
    const page = paginated ? Math.min(Math.max(1, rawPage), totalPages) : 1;
    const start = paginated ? (page - 1) * limit : 0;
    const stores: BackendStore[] = paginated ? list.slice(start, start + limit) : list;

    const meta: ListMeta = {
      page: paginated ? page : 1,
      limit: paginated ? limit : total,
      total,
      totalPages: paginated ? totalPages : 1,
      hasNextPage: paginated ? page < totalPages : false,
      hasPrevPage: paginated ? page > 1 : false,
      sortBy,
      sortOrder,
    };

    return NextResponse.json({ stores, meta });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return jsonError(message, 500);
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const body = await readJsonBody<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON body", 400);

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
        status: sanitizeOptionalString(body.status) === "Maintenance" ? ("Maintenance" as const) : ("Active" as const),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      next.stores.push(newStore);
      return next;
    });

    const store = nextDb.stores[nextDb.stores.length - 1];
    return NextResponse.json(store);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bad request";
    return jsonError(message, 400);
  }
}
