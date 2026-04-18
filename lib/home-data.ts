import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { loadLocalCatalog } from "@/lib/local-catalog";

export type HomeStat = {
  label: string;
  value: string;
  note: string;
};

export type HomeData = {
  products: LocalProduct[];
  categories: LocalCategory[];
  featuredProducts: LocalProduct[];
  spotlightCategories: LocalCategory[];
  stats: HomeStat[];
};

export async function getHomeData(): Promise<HomeData> {
  const { products, categories } = await loadLocalCatalog();
  const featuredProducts = products.slice(0, 8);
  const spotlightCategories = [...categories]
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const averageRating = products.length
    ? products.reduce((sum, product) => sum + product.rating, 0) / products.length
    : 0;

  const discountedCount = products.filter((product) => Boolean(product.discount && product.discount > 0)).length;

  const stats: HomeStat[] = [
    {
      label: "Products",
      value: products.length.toLocaleString("en-US"),
      note: "Live catalog entries",
    },
    {
      label: "Categories",
      value: categories.length.toLocaleString("en-US"),
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
  ];

  return {
    products,
    categories,
    featuredProducts,
    spotlightCategories,
    stats,
  };
}
