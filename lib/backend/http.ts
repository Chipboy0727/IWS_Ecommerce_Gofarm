import { NextResponse } from "next/server";

/** Return a JSON error response with the given message and HTTP status code. */
export function jsonError(message: string, status = 400, details?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...(details ?? {}) }, { status });
}

/** Safely parse the JSON body of a request. Returns null on failure. */
export async function readJsonBody<T extends Record<string, unknown>>(request: Request) {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/** Trim and return a string, or return empty string if not a string. */
export function sanitizeString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

/** Return a trimmed string or null if empty/not a string. */
export function sanitizeOptionalString(value: unknown) {
  const text = sanitizeString(value);
  return text.length > 0 ? text : null;
}

/** Coerce a value to a finite number, falling back to the given default. */
export function sanitizeNumber(value: unknown, fallback = 0) {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

/** Convert a string to a URL-friendly slug. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Parse a string as a positive integer, returning fallback if invalid or <= 0. */
export function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = value ? Number.parseInt(value, 10) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
