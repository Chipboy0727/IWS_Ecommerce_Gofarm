import { NextResponse } from "next/server";
import { readDb } from "@/lib/backend/db";
import { parsePositiveInt, sanitizeOptionalString } from "@/lib/backend/http";

export async function GET(request: Request) {
  const db = await readDb();
  const url = new URL(request.url);
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const limit = parsePositiveInt(url.searchParams.get("limit"), 8);
  const categoryPage = parsePositiveInt(url.searchParams.get("categoryPage"), 1);
  const categoryLimit = parsePositiveInt(url.searchParams.get("categoryLimit"), 6);
  const search = sanitizeOptionalString(url.searchParams.get("search"))?.toLowerCase() ?? "";

  const products = [...db.products]
    .filter((product) => {
      if (!search) return true;
      return [product.name, product.brand ?? "", product.categoryTitle ?? ""].join(" ").toLowerCase().includes(search);
    })
    .sort((a, b) => {
      const featuredA = Number(Boolean((a as { isFeatured?: boolean }).isFeatured));
      const featuredB = Number(Boolean((b as { isFeatured?: boolean }).isFeatured));
      if (featuredA !== featuredB) return featuredB - featuredA;
      const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return createdB - createdA;
    });

  const categories = [...db.categories]
    .sort((a, b) => {
      const countA = a.count ?? 0;
      const countB = b.count ?? 0;
      if (countA !== countB) return countB - countA;
      return a.title.localeCompare(b.title);
    });

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const featuredStart = (page - 1) * limit;
  const categoryStart = (categoryPage - 1) * categoryLimit;

  const featuredProducts = products.slice(featuredStart, featuredStart + limit);
  const spotlightCategories = categories.slice(categoryStart, categoryStart + categoryLimit);

  const averageRating = products.length
    ? products.reduce((sum, product) => sum + product.rating, 0) / products.length
    : 0;

  const discountedCount = products.filter((product) => Boolean(product.discount && product.discount > 0)).length;

  return NextResponse.json({
    stats: [
      {
        label: "Products",
        value: totalProducts.toLocaleString("en-US"),
        note: "Live catalog entries",
      },
      {
        label: "Categories",
        value: totalCategories.toLocaleString("en-US"),
        note: "Curated collections",
      },
      {
        label: "Avg. rating",
        value: averageRating.toFixed(1),
        note: "Based on customer reviews",
      },
      {
        label: "Discounted",
        value: discountedCount.toLocaleString("en-US"),
        note: "Current sale items",
      },
    ],
    categories: spotlightCategories,
    featuredProducts,
    meta: {
      productPage: page,
      productLimit: limit,
      productTotal: totalProducts,
      productTotalPages: Math.max(1, Math.ceil(totalProducts / limit)),
      categoryPage,
      categoryLimit,
      categoryTotal: totalCategories,
      categoryTotalPages: Math.max(1, Math.ceil(totalCategories / categoryLimit)),
    },
  });
}
