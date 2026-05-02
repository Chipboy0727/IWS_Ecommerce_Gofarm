import { NextResponse, type NextRequest } from "next/server";
import { readDb } from "@/lib/backend/db";
import { jsonError, sanitizeOptionalString } from "@/lib/backend/http";
import { wantsPagination, parsePageLimit, type ListMeta } from "@/lib/backend/list-utils";
import { requireAdmin } from "@/lib/backend/session";

type MessageSortBy = "createdAt" | "updatedAt" | "status" | "email" | "name";

const MESSAGE_SORT: MessageSortBy[] = ["createdAt", "updatedAt", "status", "email", "name"];

function parseMessageSortBy(raw: string | null): MessageSortBy {
  if (!raw) return "createdAt";
  return MESSAGE_SORT.includes(raw as MessageSortBy) ? (raw as MessageSortBy) : "createdAt";
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return jsonError("Unauthorized", 401);

    const url = new URL(request.url);
    const search = sanitizeOptionalString(url.searchParams.get("search"))?.toLowerCase() ?? "";
    const statusFilter = sanitizeOptionalString(url.searchParams.get("status"))?.toLowerCase() ?? "";

    const db = await readDb();
    let messages = [...(db.messages || [])];

    if (search) {
      messages = messages.filter((m: Record<string, unknown>) =>
        [String(m.name ?? ""), String(m.email ?? ""), String(m.subject ?? ""), String(m.message ?? "")]
          .join(" ")
          .toLowerCase()
          .includes(search)
      );
    }
    if (statusFilter === "unread" || statusFilter === "read" || statusFilter === "replied") {
      messages = messages.filter((m: Record<string, unknown>) => String(m.status ?? "").toLowerCase() === statusFilter);
    }

    const sortBy = parseMessageSortBy(url.searchParams.get("sortBy"));
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const applySort = url.searchParams.has("sortBy") || url.searchParams.has("sortOrder");

    if (applySort) {
      messages.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        switch (sortBy) {
          case "updatedAt":
            return Date.parse(String(a.updatedAt ?? "")) - Date.parse(String(b.updatedAt ?? ""));
          case "status":
            return String(a.status ?? "").localeCompare(String(b.status ?? ""));
          case "email":
            return String(a.email ?? "").localeCompare(String(b.email ?? ""));
          case "name":
            return String(a.name ?? "").localeCompare(String(b.name ?? ""));
          case "createdAt":
          default:
            return Date.parse(String(a.createdAt ?? "")) - Date.parse(String(b.createdAt ?? ""));
        }
      });
      if (sortOrder === "desc") messages.reverse();
    }

    const paginated = wantsPagination(url.searchParams);
    const { page: rawPage, limit } = parsePageLimit(url.searchParams, 20);
    const total = messages.length;
    const totalPages = paginated ? Math.max(1, Math.ceil(total / limit)) : 1;
    const page = paginated ? Math.min(Math.max(1, rawPage), totalPages) : 1;
    const start = paginated ? (page - 1) * limit : 0;
    const slice = paginated ? messages.slice(start, start + limit) : messages;

    const meta: ListMeta = {
      page: paginated ? page : 1,
      limit: paginated ? limit : total,
      total,
      totalPages: paginated ? totalPages : 1,
      hasNextPage: paginated ? page < totalPages : false,
      hasPrevPage: paginated ? page > 1 : false,
      sortBy: applySort ? sortBy : "default",
      sortOrder: applySort ? sortOrder : "asc",
    };

    return NextResponse.json({ messages: slice, meta });
  } catch (error) {
    console.error("Admin Messages API Error:", error);
    return jsonError("Internal Server Error", 500);
  }
}
