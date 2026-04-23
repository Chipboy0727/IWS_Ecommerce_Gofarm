import { randomUUID } from "node:crypto";
import type { BackendDb } from "@/lib/backend/db";
import { readDb } from "@/lib/backend/db";

export type LocalProduct = {
  id: string;
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
  discount: number | null;
  brand: string | null;
  categoryId: string | null;
  categoryTitle: string | null;
  description: string;
  rating: number;
  reviews: number;
  stock: number | null;
  status: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type LocalCategory = {
  id: string;
  title: string;
  slug: string;
  imageSrc: string | null;
  count: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function loadLocalCatalog(): Promise<{
  products: LocalProduct[];
  categories: LocalCategory[];
}> {
  // Chuyển sang đọc trực tiếp từ MySQL Database
  try {
    const db = await readDb();
    return {
      products: db.products,
      categories: db.categories,
    };
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ MySQL:", error);
    return { products: [], categories: [] };
  }
}
  const db: BackendDb = await readDb();
  return {
    products: db.products,
    categories: db.categories,
  };
}

