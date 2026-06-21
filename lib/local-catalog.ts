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
  origin: string | null;
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

const LOCAL_CATALOG_CACHE_TTL_MS = Math.max(0, Number.parseInt(process.env.LOCAL_CATALOG_CACHE_TTL_MS ?? "10000", 10) || 10000);
let localCatalogCache: { timestamp: number; products: LocalProduct[]; categories: LocalCategory[] } | null = null;

function getLocalCatalogCache() {
  if (!localCatalogCache) return null;
  if (Date.now() - localCatalogCache.timestamp > LOCAL_CATALOG_CACHE_TTL_MS) {
    localCatalogCache = null;
    return null;
  }
  return localCatalogCache;
}

function setLocalCatalogCache(products: LocalProduct[], categories: LocalCategory[]) {
  localCatalogCache = {
    timestamp: Date.now(),
    products,
    categories,
  };
}

export async function loadLocalCatalog(): Promise<{
  products: LocalProduct[];
  categories: LocalCategory[];
}> {
  const cached = getLocalCatalogCache();
  if (cached) {
    return {
      products: cached.products,
      categories: cached.categories,
    };
  }

  try {
    const db = await readDb();
    setLocalCatalogCache(db.products, db.categories);
    return {
      products: db.products,
      categories: db.categories,
    };
  } catch (error) {
    console.error("Failed to load data from MySQL:", error);
    return { products: [], categories: [] };
  }
}
