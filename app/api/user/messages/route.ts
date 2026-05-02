import { NextResponse, type NextRequest } from "next/server";
import { readDb } from "@/lib/backend/db";
import { jsonError, sanitizeOptionalString } from "@/lib/backend/http";
import { wantsPagination, parsePageLimit, type ListMeta } from "@/lib/backend/list-utils";
import { getAuthenticatedUser } from "@/lib/backend/session";

type MsgSortBy = "createdAt" | "updatedAt";

function parseMsgSortBy(raw: string | null): MsgSortBy {
  return raw === "updatedAt" ? "updatedAt" : "createdAt";
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionUser = await getAuthenticatedUser(request);
    const emailParam = sanitizeOptionalString(url.searchParams.get("email"))?.toLowerCase() ?? "";

    if (sessionUser && emailParam && emailParam !== sessionUser.email.toLowerCase()) {
      return jsonError("Forbidden", 403);
    }

    const email = sessionUser?.email.toLowerCase() ?? emailParam;

    if (!email) {
      return jsonError("Email is required or sign in", 400);
    }

    const db = await readDb();
    const allMessages = db.messages || [];

    let userMessages = allMessages.filter(
      (m: { email?: string }) => (m.email || "").trim().toLowerCase() === email
    );

    const sortBy = parseMsgSortBy(url.searchParams.get("sortBy"));
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const applySort = url.searchParams.has("sortBy") || url.searchParams.has("sortOrder");

    if (applySort) {
      userMessages.sort((a: { createdAt?: string; updatedAt?: string }, b: { createdAt?: string; updatedAt?: string }) => {
        const av =
          sortBy === "updatedAt"
            ? Date.parse(String(a.updatedAt ?? ""))
            : Date.parse(String(a.createdAt ?? ""));
        const bv =
          sortBy === "updatedAt"
            ? Date.parse(String(b.updatedAt ?? ""))
            : Date.parse(String(b.createdAt ?? ""));
        return av - bv;
      });
      if (sortOrder === "desc") userMessages.reverse();
    } else {
      userMessages.sort(
        (a: { createdAt?: string }, b: { createdAt?: string }) =>
          Date.parse(String(b.createdAt ?? "")) - Date.parse(String(a.createdAt ?? ""))
      );
    }

    const paginated = wantsPagination(url.searchParams);
    const { page: rawPage, limit } = parsePageLimit(url.searchParams, 20);
    const total = userMessages.length;
    const totalPages = paginated ? Math.max(1, Math.ceil(total / limit)) : 1;
    const page = paginated ? Math.min(Math.max(1, rawPage), totalPages) : 1;
    const start = paginated ? (page - 1) * limit : 0;
    const slice = paginated ? userMessages.slice(start, start + limit) : userMessages;

    const meta: ListMeta = {
      page: paginated ? page : 1,
      limit: paginated ? limit : total,
      total,
      totalPages: paginated ? totalPages : 1,
      hasNextPage: paginated ? page < totalPages : false,
      hasPrevPage: paginated ? page > 1 : false,
      sortBy: applySort ? sortBy : "createdAt",
      sortOrder: applySort ? sortOrder : "desc",
    };

    return NextResponse.json({ messages: slice, meta });
  } catch (error) {
    console.error("User Messages API Error:", error);
    return jsonError("Internal Server Error", 500);
  }
}
