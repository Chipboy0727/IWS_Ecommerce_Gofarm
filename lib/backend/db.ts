import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { hashPassword } from "@/lib/backend/auth";
import { loadLocalCatalog } from "@/lib/local-catalog";

export type BackendUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: string | null;
};

export type BackendDb = {
  products: LocalProduct[];
  categories: LocalCategory[];
  users: BackendUser[];
  meta: {
    version: number;
    updatedAt: string;
  };
};

const DB_PATH = path.resolve(process.cwd(), "data", "gofarm-backend-db.json");
let writeQueue: Promise<void> = Promise.resolve();

function nowIso() {
  return new Date().toISOString();
}

function createSeedAdmin(): BackendUser {
  const timestamp = nowIso();
  return {
    id: randomUUID(),
    name: "Admin",
    email: "admin@gofarm.local",
    passwordHash: hashPassword("admin123"),
    role: "admin",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function normalizeProduct(product: LocalProduct, index: number): LocalProduct {
  return {
    ...product,
    createdAt: product.createdAt ?? nowIso(),
    updatedAt: product.updatedAt ?? nowIso(),
    id: product.id || product.slug || randomUUID(),
    slug: product.slug || `product-${index + 1}`,
    name: product.name || "Unnamed product",
    imageSrc: product.imageSrc || "/images/logo.svg",
    imageAlt: product.imageAlt || product.name || "Product image",
    price: typeof product.price === "number" ? product.price : 0,
    discount: typeof product.discount === "number" ? product.discount : null,
    brand: product.brand ?? null,
    categoryId: product.categoryId ?? null,
    categoryTitle: product.categoryTitle ?? null,
    description: product.description ?? "",
    rating: typeof product.rating === "number" ? product.rating : 0,
    reviews: typeof product.reviews === "number" ? product.reviews : 0,
    stock: typeof product.stock === "number" ? product.stock : null,
    status: product.status ?? null,
  };
}

function normalizeCategory(category: LocalCategory, index: number): LocalCategory {
  return {
    ...category,
    id: category.id || category.slug || randomUUID(),
    slug: category.slug || `category-${index + 1}`,
    title: category.title || "Category",
    imageSrc: category.imageSrc ?? null,
    count: typeof category.count === "number" ? category.count : 0,
    createdAt: category.createdAt ?? nowIso(),
    updatedAt: category.updatedAt ?? nowIso(),
  };
}

async function ensureDb(): Promise<BackendDb> {
  const raw = await fs.readFile(DB_PATH, "utf8").catch(() => "");
  if (raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as Partial<BackendDb>;
      if (Array.isArray(parsed.products) && Array.isArray(parsed.categories)) {
        return {
          products: parsed.products.map(normalizeProduct),
          categories: parsed.categories.map(normalizeCategory),
          users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : [createSeedAdmin()],
          meta: {
            version: parsed.meta?.version ?? 1,
            updatedAt: parsed.meta?.updatedAt ?? nowIso(),
          },
        };
      }
    } catch {
      // fall through to seed
    }
  }

  const catalog = await loadLocalCatalog();
  return {
    products: catalog.products.map(normalizeProduct),
    categories: catalog.categories.map(normalizeCategory),
    users: [createSeedAdmin()],
    meta: { version: 1, updatedAt: nowIso() },
  };
}

async function persistDb(state: BackendDb) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(state, null, 2), "utf8");
}

export async function readDb() {
  return ensureDb();
}

export async function writeDb(mutator: (db: BackendDb) => BackendDb | Promise<BackendDb>) {
  writeQueue = writeQueue.then(async () => {
    const current = await ensureDb();
    const next = await mutator(current);
    next.meta = {
      version: next.meta?.version ?? 1,
      updatedAt: nowIso(),
    };
    await persistDb(next);
  });

  await writeQueue;
}

export async function updateDb(mutator: (db: BackendDb) => BackendDb | Promise<BackendDb>) {
  let result: BackendDb | null = null;
  await writeDb(async (db) => {
    result = await mutator(db);
    return result;
  });
  if (!result) throw new Error("Database update failed");
  return result;
}

export function cloneDb<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
