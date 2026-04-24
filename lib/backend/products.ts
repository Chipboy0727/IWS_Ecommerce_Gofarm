import { randomUUID } from "node:crypto";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { sanitizeNumber, sanitizeOptionalString, sanitizeString, slugify } from "@/lib/backend/http";

export type ProductSortBy = "featured" | "name" | "price" | "rating" | "reviews" | "createdAt" | "updatedAt" | "discount" | "stock";
export type SortOrder = "asc" | "desc";

export type ProductListQuery = {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  filterType?: "all" | "sale" | "featured" | "new" | "hot";
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  paginated?: boolean;
};

export type ProductInput = {
  name?: unknown;
  slug?: unknown;
  imageSrc?: unknown;
  imageAlt?: unknown;
  price?: unknown;
  discount?: unknown;
  brand?: unknown;
  categoryId?: unknown;
  categoryTitle?: unknown;
  description?: unknown;
  rating?: unknown;
  reviews?: unknown;
  stock?: unknown;
  status?: unknown;
};

const PRODUCT_SORT_VALUES: ProductSortBy[] = [
  "featured",
  "name",
  "price",
  "rating",
  "reviews",
  "createdAt",
  "updatedAt",
  "discount",
  "stock",
];

/** Parse and validate a product sort field from a query string value. */
export function parseProductSortBy(value: string | null): ProductSortBy | undefined {
  if (!value) return undefined;
  const normalized = value as ProductSortBy;
  return PRODUCT_SORT_VALUES.includes(normalized) ? normalized : undefined;
}

/** Recompute product counts per category based on current product-category assignments. */
export function normalizeProductCategories(products: LocalProduct[], categories: LocalCategory[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (!product.categoryId) continue;
    counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
  }
  return categories.map((category) => ({ ...category, count: counts.get(category.id) ?? 0 }));
}

function salePrice(product: LocalProduct) {
  return product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
}

function compareByField(product: LocalProduct, sortBy: ProductSortBy) {
  switch (sortBy) {
    case "name":
      return product.name.toLowerCase();
    case "price":
      return salePrice(product);
    case "rating":
      return product.rating;
    case "reviews":
      return product.reviews;
    case "createdAt":
      return product.createdAt ? Date.parse(product.createdAt) : 0;
    case "updatedAt":
      return product.updatedAt ? Date.parse(product.updatedAt) : 0;
    case "discount":
      return product.discount ?? -1;
    case "stock":
      return product.stock ?? -1;
    case "featured":
    default:
      return 0;
  }
}

/** Filter, sort, and paginate a product list according to the given query parameters. */
export function listProducts(products: LocalProduct[], query: ProductListQuery) {
  const search = query.search?.trim().toLowerCase();
  const category = query.category?.trim().toLowerCase();
  const brand = query.brand?.trim().toLowerCase();
  const status = query.status?.trim().toLowerCase();
  const filterType = query.filterType ?? "all";
  const minPrice = typeof query.minPrice === "number" ? query.minPrice : null;
  const maxPrice = typeof query.maxPrice === "number" ? query.maxPrice : null;
  const sortBy = query.sortBy ?? "featured";
  const sortOrder = query.sortOrder ?? "desc";

  const filtered = products.filter((product) => {
    if (search) {
      const haystack = [product.name, product.description, product.brand ?? "", product.categoryTitle ?? ""].join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (category && product.categoryId?.toLowerCase() !== category && product.categoryTitle?.toLowerCase() !== category) return false;
    if (brand && (product.brand ?? "").toLowerCase() !== brand) return false;
    if (status && (product.status ?? "").toLowerCase() !== status) return false;
    if (filterType === "sale" && !(product.discount && product.discount > 0)) return false;
    if (filterType === "featured" && !(Boolean((product as { isFeatured?: boolean }).isFeatured) || product.rating >= 4.5)) return false;
    if (filterType === "new" && !/new|just added/i.test(product.status ?? "")) return false;
    if (filterType === "hot" && !(product.discount && product.discount >= 15)) return false;
    const currentPrice = salePrice(product);
    if (minPrice !== null && currentPrice < minPrice) return false;
    if (maxPrice !== null && currentPrice > maxPrice) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "featured") {
      const featuredA = Number(Boolean((a as { isFeatured?: boolean }).isFeatured));
      const featuredB = Number(Boolean((b as { isFeatured?: boolean }).isFeatured));
      if (featuredA !== featuredB) return featuredB - featuredA;
      const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return createdB - createdA;
    }

    const valueA = compareByField(a, sortBy);
    const valueB = compareByField(b, sortBy);
    if (typeof valueA === "string" && typeof valueB === "string") return valueA.localeCompare(valueB);
    return Number(valueA) - Number(valueB);
  });

  if (sortBy !== "featured" && sortOrder === "desc") {
    sorted.reverse();
  }

  const explicitPagination = Boolean(query.paginated || query.page !== undefined || query.limit !== undefined);
  const page = explicitPagination ? Math.max(1, Math.floor(query.page ?? 1)) : 1;
  const limit = explicitPagination ? Math.max(1, Math.floor(query.limit ?? 12)) : sorted.length || 1;
  const total = sorted.length;
  const totalPages = explicitPagination ? Math.max(1, Math.ceil(total / limit)) : 1;
  const start = explicitPagination ? (page - 1) * limit : 0;
  const end = explicitPagination ? start + limit : sorted.length;
  const items = sorted.slice(start, end);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: explicitPagination ? page < totalPages : false,
      hasPrevPage: explicitPagination ? page > 1 : false,
      sortBy,
      sortOrder,
    },
  };
}

function ensureSlug(product: ProductInput, existingSlug?: string) {
  const provided = sanitizeOptionalString(product.slug);
  if (provided) return slugify(provided);
  if (existingSlug) return slugify(existingSlug);
  return slugify(sanitizeString(product.name)) || `product-${randomUUID().slice(0, 8)}`;
}

function toNumber(value: unknown, fallback: number) {
  const numeric = sanitizeNumber(value, fallback);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function createProductPayload(input: ProductInput, categories: LocalCategory[], products: LocalProduct[]) {
  const name = sanitizeString(input.name);
  if (!name) return { error: "Product name is required" } as const;

  const slugBase = ensureSlug(input);
  let slug = slugBase;
  let suffix = 2;
  while (products.some((product) => product.slug === slug)) {
    slug = `${slugBase}-${suffix++}`;
  }

  const categoryId = sanitizeOptionalString(input.categoryId);
  const category = categoryId ? categories.find((item) => item.id === categoryId || item.slug === categoryId) ?? null : null;
  const price = toNumber(input.price, 0);
  if (price < 0) return { error: "Price must be zero or positive" } as const;

  const now = new Date().toISOString();
  const product: LocalProduct = {
    id: randomUUID(),
    name,
    slug,
    createdAt: now,
    updatedAt: now,
    imageSrc: sanitizeOptionalString(input.imageSrc) ?? "/images/logo.svg",
    imageAlt: sanitizeOptionalString(input.imageAlt) ?? name,
    price,
    discount: input.discount === undefined || input.discount === null || input.discount === "" ? null : toNumber(input.discount, 0),
    brand: sanitizeOptionalString(input.brand),
    categoryId: category?.id ?? categoryId ?? null,
    categoryTitle: sanitizeOptionalString(input.categoryTitle) ?? category?.title ?? null,
    description: sanitizeOptionalString(input.description) ?? "",
    rating: toNumber(input.rating, 0),
    reviews: Math.max(0, Math.floor(toNumber(input.reviews, 0))),
    stock: input.stock === undefined || input.stock === null || input.stock === "" ? null : Math.max(0, Math.floor(toNumber(input.stock, 0))),
    status: sanitizeOptionalString(input.status),
  };

  return { product } as const;
}

export function updateProductPayload(existing: LocalProduct, input: ProductInput, categories: LocalCategory[], products: LocalProduct[]) {
  const nextName = sanitizeString(input.name) || existing.name;
  const nextSlugRaw = sanitizeOptionalString(input.slug);
  const slugBase = nextSlugRaw ? slugify(nextSlugRaw) : existing.slug;
  let nextSlug = slugBase;
  let suffix = 2;
  while (products.some((product) => product.slug === nextSlug && product.id !== existing.id)) {
    nextSlug = `${slugBase}-${suffix++}`;
  }

  const nextCategoryId = sanitizeOptionalString(input.categoryId);
  const nextCategory = nextCategoryId
    ? categories.find((item) => item.id === nextCategoryId || item.slug === nextCategoryId) ?? null
    : categories.find((item) => item.id === existing.categoryId || item.slug === existing.categoryId) ?? null;

  const nextPrice = input.price !== undefined ? toNumber(input.price, existing.price) : existing.price;
  if (nextPrice < 0) return { error: "Price must be zero or positive" } as const;

  const discountValue = input.discount === undefined || input.discount === null || input.discount === "" ? existing.discount : toNumber(input.discount, existing.discount ?? 0);
  const stockValue = input.stock === undefined || input.stock === null || input.stock === "" ? existing.stock : Math.max(0, Math.floor(toNumber(input.stock, existing.stock ?? 0)));

  const updated: LocalProduct = {
    ...existing,
    name: nextName,
    slug: nextSlug,
    imageSrc: sanitizeOptionalString(input.imageSrc) ?? existing.imageSrc,
    imageAlt: sanitizeOptionalString(input.imageAlt) ?? existing.imageAlt,
    price: nextPrice,
    discount: discountValue,
    brand: sanitizeOptionalString(input.brand) ?? existing.brand,
    categoryId: nextCategory?.id ?? nextCategoryId ?? existing.categoryId,
    categoryTitle: sanitizeOptionalString(input.categoryTitle) ?? nextCategory?.title ?? existing.categoryTitle,
    description: sanitizeOptionalString(input.description) ?? existing.description,
    rating: input.rating !== undefined ? toNumber(input.rating, existing.rating) : existing.rating,
    reviews: input.reviews !== undefined ? Math.max(0, Math.floor(toNumber(input.reviews, existing.reviews))) : existing.reviews,
    stock: stockValue,
    status: sanitizeOptionalString(input.status) ?? existing.status,
    updatedAt: new Date().toISOString(),
  };

  return { product: updated } as const;
}

export function publicProduct(product: LocalProduct) {
  return product;
}
