import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { hashPassword } from "@/lib/backend/auth";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { hashPassword } from "@/lib/backend/auth";
import { loadSeedCatalog, type BackendUser, type SeedCatalog } from "@/lib/backend/catalog-seed";
import { normalizeProductCategories } from "@/lib/backend/products";
import { getMysqlPool } from "@/lib/backend/mysql";

export type { BackendUser };

export type BackendDb = SeedCatalog;

// Cấu hình kết nối MySQL
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "gofarm_db",
};
const LEGACY_JSON_PATH = path.resolve(process.cwd(), "data", "gofarm-backend-db.json");

let mysqlReady: boolean | null = null;
let mysqlInitPromise: Promise<boolean> | null = null;
let writeQueue: Promise<void> = Promise.resolve();

let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...DB_CONFIG,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeProduct(product: LocalProduct): LocalProduct {
  return {
    ...product,
    createdAt: product.createdAt ?? nowIso(),
    updatedAt: product.updatedAt ?? nowIso(),
    id: product.id || product.slug || randomUUID(),
    slug: product.slug || `product-${randomUUID().slice(0, 8)}`,
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

function normalizeCategory(category: LocalCategory): LocalCategory {
  return {
    ...category,
    id: category.id || category.slug || randomUUID(),
    slug: category.slug || `category-${randomUUID().slice(0, 8)}`,
    title: category.title || "Category",
    imageSrc: category.imageSrc ?? null,
    count: typeof category.count === "number" ? category.count : 0,
    createdAt: category.createdAt ?? nowIso(),
    updatedAt: category.updatedAt ?? nowIso(),
  };
}

export async function readDb(): Promise<BackendDb> {
  const db = getPool();
  
  const [productsRows] = await db.query("SELECT * FROM products ORDER BY updatedAt DESC, createdAt DESC");
  const [categoriesRows] = await db.query("SELECT * FROM categories ORDER BY updatedAt DESC, createdAt DESC");
  const [usersRows] = await db.query("SELECT * FROM users ORDER BY updatedAt DESC, createdAt DESC");
  
  // Convert MySQL rows to application types
  const products = (productsRows as any[]).map(row => ({
    ...row,
    price: Number(row.price),
    discount: row.discount === null ? null : Number(row.discount),
    rating: Number(row.rating),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
  })) as LocalProduct[];

  const categories = (categoriesRows as any[]).map(row => ({
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
  })) as LocalCategory[];

  const users = (usersRows as any[]).map(row => ({
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
    resetTokenExpiresAt: row.resetTokenExpiresAt instanceof Date ? row.resetTokenExpiresAt.toISOString() : row.resetTokenExpiresAt,
  })) as BackendUser[];
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

async function ensureMysqlSchema() {
  const pool = getMysqlPool();
  if (!pool) return false;

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      imageSrc TEXT NOT NULL,
      imageAlt TEXT NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      discount DECIMAL(12,2) NULL,
      brand VARCHAR(255) NULL,
      categoryId VARCHAR(64) NULL,
      categoryTitle VARCHAR(255) NULL,
      description TEXT NOT NULL,
      rating DECIMAL(4,2) NOT NULL DEFAULT 0,
      reviews INT NOT NULL DEFAULT 0,
      stock INT NULL,
      status VARCHAR(64) NULL,
      createdAt VARCHAR(32) NOT NULL,
      updatedAt VARCHAR(32) NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      imageSrc TEXT NULL,
      count INT NOT NULL DEFAULT 0,
      createdAt VARCHAR(32) NOT NULL,
      updatedAt VARCHAR(32) NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      role VARCHAR(16) NOT NULL,
      createdAt VARCHAR(32) NOT NULL,
      updatedAt VARCHAR(32) NOT NULL,
      resetTokenHash TEXT NULL,
      resetTokenExpiresAt VARCHAR(32) NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS meta (
      \`key\` VARCHAR(64) PRIMARY KEY,
      value LONGTEXT NOT NULL
    )
  `);

  return true;
}

async function ensureMysqlSeedData() {
  const pool = getMysqlPool();
  if (!pool) return false;

  const [productRows] = await pool.query("SELECT COUNT(*) AS count FROM products");
  const [categoryRows] = await pool.query("SELECT COUNT(*) AS count FROM categories");
  const [userRows] = await pool.query("SELECT COUNT(*) AS count FROM users");

  const productCount = Number((productRows as Array<{ count: number }>)[0]?.count ?? 0);
  const categoryCount = Number((categoryRows as Array<{ count: number }>)[0]?.count ?? 0);
  const userCount = Number((userRows as Array<{ count: number }>)[0]?.count ?? 0);

  if (productCount > 0 || categoryCount > 0 || userCount > 0) {
    return true;
  }

  const seed = await loadSeedCatalog();
  await persistMysqlState(seed);
  return true;
}

async function initializeMysql() {
  if (mysqlReady === true) return true;
  if (mysqlReady === false) return false;
  if (mysqlInitPromise) return mysqlInitPromise;

  mysqlInitPromise = (async () => {
    try {
      const schemaReady = await ensureMysqlSchema();
      if (!schemaReady) {
        mysqlReady = false;
        return false;
      }
      await ensureMysqlSeedData();
      mysqlReady = true;
      return true;
    } catch {
      mysqlReady = false;
      return false;
    } finally {
      mysqlInitPromise = null;
    }
  })();

  return mysqlInitPromise;
}

async function readMysqlState(): Promise<BackendDb | null> {
  const ready = await initializeMysql();
  if (!ready) return null;

  const pool = getMysqlPool();
  if (!pool) return null;

  const [productsResult] = await pool.query("SELECT * FROM products ORDER BY updatedAt DESC, createdAt DESC");
  const [categoriesResult] = await pool.query("SELECT * FROM categories ORDER BY updatedAt DESC, createdAt DESC");
  const [usersResult] = await pool.query("SELECT * FROM users ORDER BY updatedAt DESC, createdAt DESC");

  const products = (productsResult as Array<Record<string, unknown>>).map(rowToProduct);
  const categories = (categoriesResult as Array<Record<string, unknown>>).map(rowToCategory);
  const users = (usersResult as Array<Record<string, unknown>>).map(rowToUser);

  const [metaRows] = await pool.query("SELECT value FROM meta WHERE `key` = 'state' LIMIT 1");
  const metaValue = (metaRows as Array<{ value: string }>)[0]?.value;
  const meta = metaValue
    ? (JSON.parse(metaValue) as BackendDb["meta"])
    : { version: 1, updatedAt: nowIso() };

  return {
    products,
    categories: normalizeProductCategories(products, categories),
    users,
    meta: { version: 1, updatedAt: nowIso() },
  };
}

export async function persistDb(state: BackendDb) {
  const db = getPool();
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Xóa sạch dữ liệu cũ (Tương tự logic SQLite cũ)
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
    await connection.query("TRUNCATE TABLE products;");
    await connection.query("TRUNCATE TABLE categories;");
    await connection.query("TRUNCATE TABLE users;");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

    // Chèn danh mục
    for (const cat of state.categories.map(normalizeCategory)) {
      await connection.query(
        "INSERT INTO categories (id, title, slug, imageSrc, count, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [cat.id, cat.title, cat.slug, cat.imageSrc, cat.count, new Date(cat.createdAt), new Date(cat.updatedAt)]
      );
    }
    meta,
  };
}

async function persistMysqlState(state: BackendDb) {
  const pool = getMysqlPool();
  if (!pool) return false;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM products");
    await connection.query("DELETE FROM categories");
    await connection.query("DELETE FROM users");
    await connection.query("DELETE FROM meta");

    // Chèn sản phẩm
    const usedProductSlugs = new Set<string>();
    for (const p of state.products.map(normalizeProduct)) {
      let slug = p.slug;
      let suffix = 2;
      while (usedProductSlugs.has(slug)) {
        slug = `${p.slug}-${suffix++}`;
      }
      usedProductSlugs.add(slug);

      await connection.query(
        "INSERT INTO products (id, name, slug, imageSrc, imageAlt, price, discount, brand, categoryId, categoryTitle, description, rating, reviews, stock, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          p.id, p.name, slug, p.imageSrc, p.imageAlt, p.price, p.discount, p.brand, 
          p.categoryId, p.categoryTitle, p.description, p.rating, p.reviews, p.stock, 
          p.status, new Date(p.createdAt), new Date(p.updatedAt)
        ]
      );
    }

    // Chèn người dùng
    for (const u of state.users) {
      await connection.query(
        "INSERT INTO users (id, name, email, passwordHash, role, createdAt, updatedAt, resetTokenHash, resetTokenExpiresAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          u.id, u.name, u.email, u.passwordHash, u.role, 
          new Date(u.createdAt), new Date(u.updatedAt), 
          u.resetTokenHash, u.resetTokenExpiresAt ? new Date(u.resetTokenExpiresAt) : null
        ]
      );
    }

    await connection.commit();
      await connection.execute(
        `
          INSERT INTO products (
            id, name, slug, imageSrc, imageAlt, price, discount, brand, categoryId, categoryTitle,
            description, rating, reviews, stock, status, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          product.id,
          product.name,
          slug,
          product.imageSrc,
          product.imageAlt,
          product.price,
          product.discount,
          product.brand,
          product.categoryId,
          product.categoryTitle,
          product.description,
          product.rating,
          product.reviews,
          product.stock,
          product.status,
          product.createdAt ?? nowIso(),
          product.updatedAt ?? nowIso(),
        ]
      );
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
      await connection.execute(
        `
          INSERT INTO categories (
            id, title, slug, imageSrc, count, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          category.id,
          category.title,
          slug,
          category.imageSrc,
          category.count,
          category.createdAt ?? nowIso(),
          category.updatedAt ?? nowIso(),
        ]
      );
    }

    for (const user of state.users) {
      await connection.execute(
        `
          INSERT INTO users (
            id, name, email, passwordHash, role, createdAt, updatedAt, resetTokenHash, resetTokenExpiresAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          user.id,
          user.name,
          user.email,
          user.passwordHash,
          user.role,
          user.createdAt,
          user.updatedAt,
          user.resetTokenHash ?? null,
          user.resetTokenExpiresAt ?? null,
        ]
      );
    }

    await connection.execute("INSERT INTO meta (`key`, value) VALUES (?, ?)", [
      "state",
      JSON.stringify(state.meta ?? { version: 1, updatedAt: nowIso() }),
    ]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function writeDb(mutator: (db: BackendDb) => BackendDb | Promise<BackendDb>) {
  const current = await readDb();
  const next = await mutator(current);
  await persistDb(next);
async function persistFallbackState(state: BackendDb) {
  await fs.mkdir(path.dirname(LEGACY_JSON_PATH), { recursive: true });
  await fs.writeFile(LEGACY_JSON_PATH, JSON.stringify(state, null, 2), "utf8");
}

export async function readDb() {
  const mysqlState = await readMysqlState();
  if (mysqlState) return mysqlState;
  return loadSeedCatalog();
}

export async function writeDb(mutator: (db: BackendDb) => BackendDb | Promise<BackendDb>) {
  writeQueue = writeQueue.then(async () => {
    const current = (await readMysqlState()) ?? (await loadSeedCatalog());
    const next = await mutator(current);
    next.meta = {
      version: next.meta?.version ?? 1,
      updatedAt: nowIso(),
    };

    const persisted = await persistMysqlState(next).catch(() => false);
    if (!persisted) {
      await persistFallbackState(next);
      mysqlReady = false;
    }
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

