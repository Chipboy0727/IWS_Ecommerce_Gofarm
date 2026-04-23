import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { hashPassword } from "@/lib/backend/auth";
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

// Cấu hình kết nối MySQL
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "gofarm_db",
};

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
