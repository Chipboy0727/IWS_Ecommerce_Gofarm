import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

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
};

export type LocalCategory = {
  id: string;
  title: string;
  slug: string;
  imageSrc: string | null;
  count: number;
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

const DEFAULT_SEED_DIR = path.resolve(
  process.cwd(),
  "..",
  "gofarm-yt-main (1)",
  "gofarm-yt-main",
  "server",
  "seed",
  "production-export-2025-11-30t08-28-44-763z"
);

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
