import mysql from "mysql2/promise";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { loadSeedCatalog, type BackendOrder, type BackendStore, type BackendUser, type SeedCatalog } from "@/lib/backend/catalog-seed";
import { normalizeProductCategories } from "@/lib/backend/products";
import { getMysqlPool } from "@/lib/backend/mysql";

export type { BackendUser, BackendStore };
export type BackendDb = SeedCatalog;

const LEGACY_JSON_PATH = path.resolve(process.cwd(), "data", "gofarm-backend-db.json");

let mysqlReady: boolean | null = null;
let mysqlInitPromise: Promise<boolean> | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function nowIso() {
  return new Date().toISOString();
}

function normalizeProduct(product: LocalProduct): LocalProduct {
  return {
    ...product,
    id: product.id || product.slug || randomUUID(),
    slug: product.slug || `product-${randomUUID().slice(0, 8)}`,
    name: product.name || "Unnamed product",
    imageSrc: (product.imageSrc || "/images/logo.svg").includes("/")
      ? (product.imageSrc || "/images/logo.svg")
      : `/images/${product.imageSrc}`,
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
    createdAt: product.createdAt ?? nowIso(),
    updatedAt: product.updatedAt ?? nowIso(),
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

function rowToProduct(row: Record<string, unknown>): LocalProduct {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    imageSrc: String(row.imageSrc ?? "/images/logo.svg").includes("/") 
      ? String(row.imageSrc ?? "/images/logo.svg") 
      : `/images/${row.imageSrc}`,
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
    resetTokenExpiresAt:
      row.resetTokenExpiresAt === null || row.resetTokenExpiresAt === undefined
        ? null
        : String(row.resetTokenExpiresAt),
    status: String(row.status ?? "Active"),
  };
}

function rowToOrder(row: Record<string, unknown>): BackendOrder {
  let products: BackendOrder["products"] = [];
  try {
    const raw = row.products;
    if (typeof raw === "string" && raw.trim()) {
      products = JSON.parse(raw) as BackendOrder["products"];
    } else if (Array.isArray(raw)) {
      products = raw as BackendOrder["products"];
    }
  } catch {
    products = [];
  }

  return {
    id: String(row.id ?? ""),
    date: String(row.date ?? nowIso()),
    total: Number(row.total ?? 0),
    status: String(row.status ?? "pending") as BackendOrder["status"],
    items: Number(row.items ?? 0),
    products,
    shippingAddress: String(row.shippingAddress ?? ""),
    customerName: String(row.customerName ?? "Guest"),
    customerEmail: String(row.customerEmail ?? ""),
    customerPhone: String(row.customerPhone ?? ""),
    paymentMethod: String(row.paymentMethod ?? "Cash on Delivery"),
    createdAt: String(row.createdAt ?? nowIso()),
    updatedAt: String(row.updatedAt ?? nowIso()),
  };
}

function rowToStore(row: Record<string, unknown>): BackendStore {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    address: String(row.address ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    country: String(row.country ?? ""),
    hours: String(row.hours ?? ""),
    city: String(row.city ?? ""),
    pinX: Number(row.pinX ?? 0),
    pinY: Number(row.pinY ?? 0),
    manager: String(row.manager ?? ""),
    contact: String(row.contact ?? ""),
    imageSrc: String(row.imageSrc ?? "/images/logo.svg"),
    status: String(row.status ?? "Active") as BackendStore["status"],
    createdAt: String(row.createdAt ?? nowIso()),
    updatedAt: String(row.updatedAt ?? nowIso()),
  };
}

function getPool() {
  return getMysqlPool();
}

async function ensureMysqlSchema() {
  const pool = getPool();
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

  try {
    await pool.execute("ALTER TABLE users ADD status VARCHAR(32) DEFAULT 'Active'");
  } catch {
    // column already exists
  }

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      date VARCHAR(32) NOT NULL,
      total DECIMAL(12,2) NOT NULL DEFAULT 0,
      status VARCHAR(32) NOT NULL,
      items INT NOT NULL DEFAULT 0,
      products LONGTEXT NOT NULL,
      shippingAddress TEXT NOT NULL,
      customerName VARCHAR(255) NOT NULL,
      customerEmail VARCHAR(255) NOT NULL,
      customerPhone VARCHAR(64) NOT NULL,
      paymentMethod VARCHAR(255) NOT NULL,
      createdAt VARCHAR(32) NOT NULL,
      updatedAt VARCHAR(32) NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS stores (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      phone VARCHAR(64) NOT NULL,
      email VARCHAR(255) NOT NULL,
      country VARCHAR(64) NOT NULL,
      hours VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      pinX INT NOT NULL DEFAULT 0,
      pinY INT NOT NULL DEFAULT 0,
      manager VARCHAR(255) NOT NULL,
      contact VARCHAR(255) NOT NULL,
      imageSrc TEXT NOT NULL,
      status VARCHAR(32) NOT NULL,
      createdAt VARCHAR(32) NOT NULL,
      updatedAt VARCHAR(32) NOT NULL
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
  const pool = getPool();
  if (!pool) return false;

  const [productRows] = await pool.query("SELECT COUNT(*) AS count FROM products");
  const [categoryRows] = await pool.query("SELECT COUNT(*) AS count FROM categories");
  const [userRows] = await pool.query("SELECT COUNT(*) AS count FROM users");
  const [orderRows] = await pool.query("SELECT COUNT(*) AS count FROM orders");
  const [storeRows] = await pool.query("SELECT COUNT(*) AS count FROM stores");

  const productCount = Number((productRows as Array<{ count: number }>)[0]?.count ?? 0);
  const categoryCount = Number((categoryRows as Array<{ count: number }>)[0]?.count ?? 0);
  const userCount = Number((userRows as Array<{ count: number }>)[0]?.count ?? 0);
  const orderCount = Number((orderRows as Array<{ count: number }>)[0]?.count ?? 0);
  const storeCount = Number((storeRows as Array<{ count: number }>)[0]?.count ?? 0);

  if (productCount > 0 || categoryCount > 0 || userCount > 0 || orderCount > 0 || storeCount > 0) {
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

  const pool = getPool();
  if (!pool) return null;

  const [productsResult] = await pool.query("SELECT * FROM products ORDER BY updatedAt DESC, createdAt DESC");
  const [categoriesResult] = await pool.query("SELECT * FROM categories ORDER BY updatedAt DESC, createdAt DESC");
  const [usersResult] = await pool.query("SELECT * FROM users ORDER BY updatedAt DESC, createdAt DESC");
  const [ordersResult] = await pool.query("SELECT * FROM orders ORDER BY updatedAt DESC, createdAt DESC");
  const [storesResult] = await pool.query("SELECT * FROM stores ORDER BY updatedAt DESC, createdAt DESC");

  const products = (productsResult as Array<Record<string, unknown>>).map(rowToProduct);
  const categories = (categoriesResult as Array<Record<string, unknown>>).map(rowToCategory);
  const users = (usersResult as Array<Record<string, unknown>>).map(rowToUser);
  const orders = (ordersResult as Array<Record<string, unknown>>).map(rowToOrder);
  const stores = (storesResult as Array<Record<string, unknown>>).map(rowToStore);

  const [metaRows] = await pool.query("SELECT value FROM meta WHERE `key` = 'state' LIMIT 1");
  const metaValue = (metaRows as Array<{ value: string }>)[0]?.value;
  const meta = metaValue ? (JSON.parse(metaValue) as BackendDb["meta"]) : { version: 1, updatedAt: nowIso() };

  return {
    products,
    categories: normalizeProductCategories(products, categories),
    users,
    orders,
    stores,
    meta,
  };
}

async function persistMysqlState(state: BackendDb) {
  const pool = getPool();
  if (!pool) return false;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM products");
    await connection.query("DELETE FROM categories");
    await connection.query("DELETE FROM users");
    await connection.query("DELETE FROM orders");
    await connection.query("DELETE FROM stores");
    await connection.query("DELETE FROM meta");

    const usedProductSlugs = new Set<string>();
    for (const product of state.products.map(normalizeProduct)) {
      const baseSlug = product.slug || `product-${product.id.slice(0, 8)}`;
      let slug = baseSlug;
      let suffix = 2;
      while (usedProductSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }
      usedProductSlugs.add(slug);

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
            id, name, email, passwordHash, role, createdAt, updatedAt, resetTokenHash, resetTokenExpiresAt, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          user.id,
          user.name,
          user.email,
          user.passwordHash,
          user.role,
          user.createdAt ?? nowIso(),
          user.updatedAt ?? nowIso(),
          user.resetTokenHash ?? null,
          user.resetTokenExpiresAt ?? null,
          user.status ?? "Active",
        ]
      );
    }

    for (const order of state.orders) {
      await connection.execute(
        `
          INSERT INTO orders (
            id, date, total, status, items, products, shippingAddress,
            customerName, customerEmail, customerPhone, paymentMethod, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          order.id,
          order.date,
          order.total,
          order.status,
          order.items,
          JSON.stringify(order.products ?? []),
          order.shippingAddress,
          order.customerName,
          order.customerEmail,
          order.customerPhone,
          order.paymentMethod,
          order.createdAt,
          order.updatedAt,
        ]
      );
    }

    for (const store of state.stores) {
      await connection.execute(
        `
          INSERT INTO stores (
            id, name, address, phone, email, country, hours, city, pinX, pinY,
            manager, contact, imageSrc, status, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          store.id,
          store.name,
          store.address,
          store.phone,
          store.email,
          store.country,
          store.hours,
          store.city,
          store.pinX,
          store.pinY,
          store.manager,
          store.contact,
          store.imageSrc,
          store.status,
          store.createdAt,
          store.updatedAt,
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

async function persistFallbackState(state: BackendDb) {
  await fs.mkdir(path.dirname(LEGACY_JSON_PATH), { recursive: true });
  await fs.writeFile(LEGACY_JSON_PATH, JSON.stringify(state, null, 2), "utf8");
}

export async function readDb(): Promise<BackendDb> {
  const mysqlState = await readMysqlState();
  if (mysqlState) return mysqlState;
  return loadSeedCatalog();
}

export async function writeDb(mutator: (db: BackendDb) => BackendDb | Promise<BackendDb>) {
  writeQueue = writeQueue.then(async () => {
    const current = await readDb();
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
