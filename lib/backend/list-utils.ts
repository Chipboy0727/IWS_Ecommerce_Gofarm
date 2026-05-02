import { parsePositiveInt } from "@/lib/backend/http";

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

/** Opt-in pagination (matches products, categories, orders). */
export function wantsPagination(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has("page") ||
    searchParams.has("limit") ||
    searchParams.get("paginated") === "true"
  );
}

export function parsePageLimit(searchParams: URLSearchParams, defaultLimit = 12) {
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), defaultLimit),
  };
}
