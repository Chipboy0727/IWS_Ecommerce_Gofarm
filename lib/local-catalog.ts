import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

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

type SeedDocument = {
  _type?: string;
  _id?: string;
  _updatedAt?: string;
  _createdAt?: string;
  name?: string;
  title?: string;
  slug?: { current?: string };
  price?: number;
  discount?: number;
  description?: string;
  averageRating?: number;
  totalReviews?: number;
  stock?: number;
  status?: string;
  brand?: { _ref?: string };
  categories?: Array<{ _ref?: string }>;
  images?: Array<{ _sanityAsset?: string }>;
  image?: { _sanityAsset?: string };
};

type SeedAssets = Record<
  string,
  {
    originalFilename?: string;
    sha1hash?: string;
  }
>;

type BackendDb = {
  products?: LocalProduct[];
  categories?: LocalCategory[];
};

const DEFAULT_SEED_DIR = path.resolve(
  process.cwd(),
  "data",
  "seed",
  "production-export-2025-11-30t08-28-44-763z"
);
const BACKEND_DB_PATH = path.resolve(process.cwd(), "data", "gofarm-backend-db.json");
const SQLITE_DB_PATH = path.resolve(process.cwd(), "data", "gofarm-backend.db");

function resolveSeedDir() {
  return process.env.GOFARM_SEED_DIR
    ? path.resolve(process.env.GOFARM_SEED_DIR)
    : DEFAULT_SEED_DIR;
}

function resolveImageSrc(
  image?: { _sanityAsset?: string },
  assets?: SeedAssets
) {
  const sanityAsset = image?._sanityAsset ?? "";
  const fileMatch = sanityAsset.match(/\.\/images\/([^"\]]+)/i);
  if (fileMatch?.[1]) {
    return `/images/${fileMatch[1]}`;
  }

  const filenameMatch = sanityAsset.match(/\/([^/]+\.(?:png|jpe?g|webp|svg|gif))$/i);
  if (filenameMatch?.[1]) {
    return `/images/${filenameMatch[1]}`;
  }

  if (assets) {
    for (const asset of Object.values(assets)) {
      if (!asset.sha1hash) continue;
      const originalFilename = asset.originalFilename;
      if (originalFilename && sanityAsset.includes(asset.sha1hash)) {
        return `/images/${originalFilename}`;
      }
    }
  }

  return "/images/logo.svg";
}

export async function loadLocalCatalog(): Promise<{
  products: LocalProduct[];
  categories: LocalCategory[];
}> {
  const sqliteCatalog = readCatalogFromSqlite();
  if (sqliteCatalog) {
    return sqliteCatalog;
  }

  const backendRaw = await fs.readFile(BACKEND_DB_PATH, "utf8").catch(() => "");
  if (backendRaw.trim()) {
    try {
      const backendDb = JSON.parse(backendRaw) as BackendDb;
      if (Array.isArray(backendDb.products) && Array.isArray(backendDb.categories)) {
        return {
          products: backendDb.products,
          categories: backendDb.categories,
        };
      }
    } catch {
      // fall through to seed export
    }
  }

  const seedDir = resolveSeedDir();
  const ndjsonPath = path.join(seedDir, "data.ndjson");
  const assetsPath = path.join(seedDir, "assets.json");

  const [ndjsonRaw, assetsRaw] = await Promise.all([
    fs.readFile(ndjsonPath, "utf8").catch(() => ""),
    fs.readFile(assetsPath, "utf8").catch(() => "{}"),
  ]);

  const assets = JSON.parse(assetsRaw) as SeedAssets;
  const documents = ndjsonRaw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SeedDocument);

  const brands = new Map(
    documents
      .filter((doc) => doc._type === "brand" && doc._id)
      .map((doc) => [doc._id as string, doc.name ?? "Brand"])
  );

  const categories = new Map(
    documents
      .filter((doc) => doc._type === "category" && doc._id)
      .map((doc) => [
        doc._id as string,
        {
          id: doc._id as string,
          title: doc.title ?? "Category",
          slug: doc.slug?.current ?? "",
          imageSrc: resolveImageSrc(doc.image, assets),
          count: 0,
        } satisfies LocalCategory,
      ])
  );

  const products = documents
    .filter((doc): doc is Required<Pick<SeedDocument, "_type">> & SeedDocument => doc._type === "product")
    .sort((a, b) => {
      const featuredA = Number(Boolean((a as { isFeatured?: boolean }).isFeatured));
      const featuredB = Number(Boolean((b as { isFeatured?: boolean }).isFeatured));
      if (featuredA !== featuredB) return featuredB - featuredA;
      const createdA = a._createdAt ? Date.parse(a._createdAt) : 0;
      const createdB = b._createdAt ? Date.parse(b._createdAt) : 0;
      return createdB - createdA;
    })
    .map((doc) => {
      const brandRef = doc.brand?._ref ?? null;
      const categoryRef = doc.categories?.[0]?._ref ?? null;
      const category = categoryRef ? categories.get(categoryRef) : null;
      const image = doc.images?.[0];
      const imageSrc = resolveImageSrc(image, assets);
      return {
        id: doc._id ?? doc.slug?.current ?? doc.name ?? randomUUID(),
        name: doc.name ?? "Unnamed product",
        slug: doc.slug?.current ?? "",
        imageSrc,
        imageAlt: doc.name ?? "Product image",
        price: typeof doc.price === "number" ? doc.price : 0,
        discount: typeof doc.discount === "number" ? doc.discount : null,
        brand: brandRef ? brands.get(brandRef) ?? brandRef : null,
        categoryId: categoryRef,
        categoryTitle: category?.title ?? null,
        description: doc.description ?? "",
        rating: typeof doc.averageRating === "number" ? doc.averageRating : 0,
        reviews: typeof doc.totalReviews === "number" ? doc.totalReviews : 0,
        stock: typeof doc.stock === "number" ? doc.stock : null,
        status: doc.status ?? null,
      } satisfies LocalProduct;
    });

  const categoryCounts = new Map<string, number>();
  for (const product of products) {
    if (!product.categoryId) continue;
    categoryCounts.set(product.categoryId, (categoryCounts.get(product.categoryId) ?? 0) + 1);
  }

  const categoryList = Array.from(categories.values()).map((category) => ({
    ...category,
    count: categoryCounts.get(category.id) ?? 0,
  }));

  return { products, categories: categoryList };
}

function readCatalogFromSqlite(): { products: LocalProduct[]; categories: LocalCategory[] } | null {
  try {
    const db = new DatabaseSync(SQLITE_DB_PATH, { readOnly: true });
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('products', 'categories')"
    ).all() as Array<{ name: string }>;
    if (tables.length < 2) return null;

    const products = db.prepare("SELECT * FROM products").all().map((row) => ({
      ...(row as Record<string, unknown>),
      id: String((row as Record<string, unknown>).id ?? ""),
      name: String((row as Record<string, unknown>).name ?? ""),
      slug: String((row as Record<string, unknown>).slug ?? ""),
      imageSrc: String((row as Record<string, unknown>).imageSrc ?? "/images/logo.svg"),
      imageAlt: String((row as Record<string, unknown>).imageAlt ?? "Product image"),
      price: Number((row as Record<string, unknown>).price ?? 0),
      discount: (row as Record<string, unknown>).discount === null || (row as Record<string, unknown>).discount === undefined ? null : Number((row as Record<string, unknown>).discount),
      brand: (row as Record<string, unknown>).brand === null || (row as Record<string, unknown>).brand === undefined ? null : String((row as Record<string, unknown>).brand),
      categoryId: (row as Record<string, unknown>).categoryId === null || (row as Record<string, unknown>).categoryId === undefined ? null : String((row as Record<string, unknown>).categoryId),
      categoryTitle: (row as Record<string, unknown>).categoryTitle === null || (row as Record<string, unknown>).categoryTitle === undefined ? null : String((row as Record<string, unknown>).categoryTitle),
      description: String((row as Record<string, unknown>).description ?? ""),
      rating: Number((row as Record<string, unknown>).rating ?? 0),
      reviews: Number((row as Record<string, unknown>).reviews ?? 0),
      stock: (row as Record<string, unknown>).stock === null || (row as Record<string, unknown>).stock === undefined ? null : Number((row as Record<string, unknown>).stock),
      status: (row as Record<string, unknown>).status === null || (row as Record<string, unknown>).status === undefined ? null : String((row as Record<string, unknown>).status),
      createdAt: String((row as Record<string, unknown>).createdAt ?? new Date().toISOString()),
      updatedAt: String((row as Record<string, unknown>).updatedAt ?? new Date().toISOString()),
    } satisfies LocalProduct));
    const categories = db.prepare("SELECT * FROM categories").all().map((row) => ({
      ...(row as Record<string, unknown>),
      id: String((row as Record<string, unknown>).id ?? ""),
      title: String((row as Record<string, unknown>).title ?? "Category"),
      slug: String((row as Record<string, unknown>).slug ?? ""),
      imageSrc: (row as Record<string, unknown>).imageSrc === null || (row as Record<string, unknown>).imageSrc === undefined ? null : String((row as Record<string, unknown>).imageSrc),
      count: Number((row as Record<string, unknown>).count ?? 0),
      createdAt: String((row as Record<string, unknown>).createdAt ?? new Date().toISOString()),
      updatedAt: String((row as Record<string, unknown>).updatedAt ?? new Date().toISOString()),
    } satisfies LocalCategory));
    if (!products.length && !categories.length) return null;

    const categoryCounts = new Map<string, number>();
    for (const product of products) {
      if (!product.categoryId) continue;
      categoryCounts.set(product.categoryId, (categoryCounts.get(product.categoryId) ?? 0) + 1);
    }

    return {
      products,
      categories: categories.map((category) => ({
        ...category,
        count: categoryCounts.get(category.id) ?? 0,
      })),
    };
  } catch {
    return null;
  }
}
