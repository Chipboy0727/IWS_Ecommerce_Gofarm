import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { hashPassword } from "@/lib/backend/auth";
import { loadLocalCatalog } from "@/lib/local-catalog";
import { normalizeProductCategories } from "@/lib/backend/products";

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

const DB_PATH = path.resolve(process.cwd(), "data", "gofarm-backend.db");
const LEGACY_JSON_PATH = path.resolve(process.cwd(), "data", "gofarm-backend-db.json");
let database: DatabaseSync | null = null;
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

function getDatabase() {
  if (!database) {
    database = new DatabaseSync(DB_PATH);
    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        imageSrc TEXT NOT NULL,
        imageAlt TEXT NOT NULL,
        price REAL NOT NULL,
        discount REAL,
        brand TEXT,
        categoryId TEXT,
        categoryTitle TEXT,
        description TEXT NOT NULL DEFAULT '',
        rating REAL NOT NULL DEFAULT 0,
        reviews INTEGER NOT NULL DEFAULT 0,
        stock INTEGER,
        status TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        imageSrc TEXT,
        count INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        resetTokenHash TEXT,
        resetTokenExpiresAt TEXT
      );

      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  return database;
}

function readLegacyDbState(): BackendDb | null {
  try {
    const raw = fsSync.readFileSync(LEGACY_JSON_PATH, "utf8");
    if (!raw.trim()) return null;
    const parsed = JSON.parse(raw) as Partial<BackendDb>;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.categories)) return null;
    return {
      products: parsed.products.map(normalizeProduct),
      categories: parsed.categories.map(normalizeCategory),
      users: Array.isArray(parsed.users) && parsed.users.length > 0 ? (parsed.users as BackendUser[]) : [createSeedAdmin()],
      meta: {
        version: parsed.meta?.version ?? 1,
        updatedAt: parsed.meta?.updatedAt ?? nowIso(),
      },
    };
  } catch {
    return null;
  }
}

function readSeedCatalog(): BackendDb {
  return {
    products: [],
    categories: [],
    users: [createSeedAdmin()],
    meta: { version: 1, updatedAt: nowIso() },
  };
}

async function ensureSeedData() {
  const db = getDatabase();
  const categoryCount = db.prepare("SELECT COUNT(*) AS count FROM categories").get() as { count: number };
  const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get() as { count: number };
  const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };

  if (categoryCount.count > 0 || productCount.count > 0 || userCount.count > 0) {
    return;
  }

  const legacySeed = readLegacyDbState();
  const catalog = legacySeed ?? (await loadLocalCatalog());
  const state: BackendDb = {
    products: catalog.products.map(normalizeProduct),
    categories: catalog.categories.map(normalizeCategory),
    users: legacySeed?.users?.length ? legacySeed.users : [createSeedAdmin()],
    meta: legacySeed?.meta ?? { version: 1, updatedAt: nowIso() },
  };

  await persistDb(state);
}

function rowToProduct(row: Record<string, unknown>): LocalProduct {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    imageSrc: String(row.imageSrc ?? "/images/logo.svg"),
    imageAlt: String(row.imageAlt ?? row.name ?? "Product image"),
    price: Number(row.price ?? 0),
    discount: row.discount === null || row.discount === undefined ? null : Number(row.discount),
    brand: row.brand === null || row.brand === undefined ? null : String(row.brand),
    categoryId: row.categoryId === null || row.categoryId === undefined ? null : String(row.categoryId),
    categoryTitle: row.categoryTitle === null || row.categoryTitle === undefined ? null : String(row.categoryTitle),
    description: String(row.description ?? ""),
    rating: Number(row.rating ?? 0),
    reviews: Number(row.reviews ?? 0),
    stock: row.stock === null || row.stock === undefined ? null : Number(row.stock),
    status: row.status === null || row.status === undefined ? null : String(row.status),
    createdAt: String(row.createdAt ?? nowIso()),
    updatedAt: String(row.updatedAt ?? nowIso()),
  };
}

function rowToCategory(row: Record<string, unknown>): LocalCategory {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? "Category"),
    slug: String(row.slug ?? ""),
    imageSrc: row.imageSrc === null || row.imageSrc === undefined ? null : String(row.imageSrc),
    count: Number(row.count ?? 0),
    createdAt: String(row.createdAt ?? nowIso()),
    updatedAt: String(row.updatedAt ?? nowIso()),
  };
}

function rowToUser(row: Record<string, unknown>): BackendUser {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    passwordHash: String(row.passwordHash ?? ""),
    role: row.role === "admin" ? "admin" : "user",
    createdAt: String(row.createdAt ?? nowIso()),
    updatedAt: String(row.updatedAt ?? nowIso()),
    resetTokenHash: row.resetTokenHash === null || row.resetTokenHash === undefined ? null : String(row.resetTokenHash),
    resetTokenExpiresAt: row.resetTokenExpiresAt === null || row.resetTokenExpiresAt === undefined ? null : String(row.resetTokenExpiresAt),
  };
}

async function readStateFromDb(): Promise<BackendDb> {
  await ensureSeedData();
  const db = getDatabase();
  const products = db.prepare("SELECT * FROM products ORDER BY datetime(updatedAt) DESC, datetime(createdAt) DESC").all().map(rowToProduct);
  const rawCategories = db.prepare("SELECT * FROM categories ORDER BY datetime(updatedAt) DESC, datetime(createdAt) DESC").all().map(rowToCategory);
  const users = db.prepare("SELECT * FROM users ORDER BY datetime(updatedAt) DESC, datetime(createdAt) DESC").all().map(rowToUser);
  return {
    products,
    categories: normalizeProductCategories(products, rawCategories),
    users,
    meta: readMeta(),
  };
}

function readMeta() {
  const db = getDatabase();
  const row = db.prepare("SELECT value FROM meta WHERE key = 'state'").get() as { value?: string } | undefined;
  if (!row?.value) {
    return { version: 1, updatedAt: nowIso() };
  }

  try {
    return JSON.parse(row.value) as BackendDb["meta"];
  } catch {
    return { version: 1, updatedAt: nowIso() };
  }
}

async function persistDb(state: BackendDb) {
  const db = getDatabase();
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  db.exec("BEGIN IMMEDIATE TRANSACTION");
  try {
    db.exec("DELETE FROM products; DELETE FROM categories; DELETE FROM users; DELETE FROM meta;");

    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, slug, imageSrc, imageAlt, price, discount, brand, categoryId, categoryTitle,
        description, rating, reviews, stock, status, createdAt, updatedAt
      ) VALUES (
        @id, @name, @slug, @imageSrc, @imageAlt, @price, @discount, @brand, @categoryId, @categoryTitle,
        @description, @rating, @reviews, @stock, @status, @createdAt, @updatedAt
      )
    `);

    const insertCategory = db.prepare(`
      INSERT INTO categories (
        id, title, slug, imageSrc, count, createdAt, updatedAt
      ) VALUES (
        @id, @title, @slug, @imageSrc, @count, @createdAt, @updatedAt
      )
    `);

    const insertUser = db.prepare(`
      INSERT INTO users (
        id, name, email, passwordHash, role, createdAt, updatedAt, resetTokenHash, resetTokenExpiresAt
      ) VALUES (
        @id, @name, @email, @passwordHash, @role, @createdAt, @updatedAt, @resetTokenHash, @resetTokenExpiresAt
      )
    `);

    const usedProductSlugs = new Set<string>();
    for (const product of state.products.map(normalizeProduct)) {
      const baseSlug = product.slug || `product-${product.id.slice(0, 8)}`;
      let slug = baseSlug;
      let suffix = 2;
      while (usedProductSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }
      usedProductSlugs.add(slug);
      insertProduct.run({
        ...product,
        slug,
        brand: product.brand,
        categoryId: product.categoryId,
        categoryTitle: product.categoryTitle,
        discount: product.discount,
        stock: product.stock,
      });
    }

    const usedCategorySlugs = new Set<string>();
    for (const category of state.categories.map(normalizeCategory)) {
      const baseSlug = category.slug || `category-${category.id.slice(0, 8)}`;
      let slug = baseSlug;
      let suffix = 2;
      while (usedCategorySlugs.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }
      usedCategorySlugs.add(slug);
      insertCategory.run({
        ...category,
        slug,
      });
    }

    for (const user of state.users) {
      insertUser.run({
        ...user,
        resetTokenHash: user.resetTokenHash ?? null,
        resetTokenExpiresAt: user.resetTokenExpiresAt ?? null,
      });
    }

    db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('state', ?)").run(JSON.stringify(state.meta ?? { version: 1, updatedAt: nowIso() }));
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export async function readDb() {
  return readStateFromDb();
}

export async function writeDb(mutator: (db: BackendDb) => BackendDb | Promise<BackendDb>) {
  writeQueue = writeQueue.then(async () => {
    const current = await readStateFromDb();
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
