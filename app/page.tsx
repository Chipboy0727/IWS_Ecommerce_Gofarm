import { HomeProductBrowser } from "@/components/home/home-product-browser";
import { ProductGridClient } from "@/components/home/product-grid-client";
import ProductShareHandler from "@/components/home/product-share-handler";
import { sanitizeServerHtml } from "@/lib/backend/sanitize-html";
import {
  buildSectionCarouselHtml,
  readOriginalHomeBody,
  transformHomeBody,
} from "@/lib/home-page";
import { loadLocalCatalog } from "@/lib/local-catalog";

export const dynamic = "force-static";
export const revalidate = 20;

export default async function HomePage() {
  const bodyHtml = await readOriginalHomeBody();
  const { products: allProducts } = await loadLocalCatalog();
  const storefrontProducts = allProducts.filter(
    (product) => product.price > 0 && product.name.trim() && product.imageSrc.trim()
  );
  const usedSlugs = new Set<string>();
  const vegetableProducts: typeof storefrontProducts = [];
  const fruitsProducts: typeof storefrontProducts = [];
  const juicesProducts: typeof storefrontProducts = [];
  const spicesProducts: typeof storefrontProducts = [];
  const remainingProducts: typeof storefrontProducts = [];

  const normalize = (value: string | null | undefined) => value?.toLowerCase() ?? "";

  const isJuiceProduct = (category: string, name: string) =>
    category === "juices" || /juice|juices|smoothie|water|milk|drink/i.test(name);

  const isVegetableProduct = (category: string, name: string) =>
    (category === "vegetables" ||
      /vegetable|tomato|potato|onion|cabbage|carrot|broccoli|lettuce|pepper|asparagus|cucumber|spinach|pumpkin/i.test(name)) &&
    !isJuiceProduct(category, name);

  const isFruitProduct = (category: string, name: string) =>
    (category === "fruits" ||
      /fruit|apple|pear|mango|banana|watermelon|orange|berry|kiwi|pomelo|grape|avocado|durian|mangosteen|lychee|longan|pineapple/i.test(name)) &&
    !isJuiceProduct(category, name);

  const isSpiceProduct = (category: string, name: string) =>
    category === "spices & herbs" ||
    category === "spices" ||
    /chili|pepper|garlic|salt|sugar|herb|spice|ginger|lemongrass|shallot|turmeric|onion|coriander|mint|dill|perilla|lime leaf/i.test(name);

  for (const product of storefrontProducts) {
    const slug = product.slug;
    if (!slug || usedSlugs.has(slug)) continue;

    const category = normalize(product.categoryTitle);
    const name = normalize(product.name);

    if (vegetableProducts.length < 10 && isVegetableProduct(category, name)) {
      vegetableProducts.push(product);
      usedSlugs.add(slug);
      continue;
    }
    if (fruitsProducts.length < 10 && isFruitProduct(category, name)) {
      fruitsProducts.push(product);
      usedSlugs.add(slug);
      continue;
    }
    if (juicesProducts.length < 10 && isJuiceProduct(category, name)) {
      juicesProducts.push(product);
      usedSlugs.add(slug);
      continue;
    }
    if (spicesProducts.length < 10 && isSpiceProduct(category, name)) {
      spicesProducts.push(product);
      usedSlugs.add(slug);
      continue;
    }

    remainingProducts.push(product);
  }

  const products = remainingProducts.slice(0, 15);
  const sectionMarkups = [
    buildSectionCarouselHtml({
      title: "Vegetables",
      products: vegetableProducts,
      productCount: vegetableProducts.length,
    }),
    buildSectionCarouselHtml({
      title: "Fruits",
      products: fruitsProducts,
      productCount: fruitsProducts.length,
    }),
    buildSectionCarouselHtml({
      title: "Juices",
      products: juicesProducts,
      productCount: juicesProducts.length,
    }),
    buildSectionCarouselHtml({
      title: "Spices & Herbs",
      products: spicesProducts,
      productCount: spicesProducts.length,
    }),
  ];

  const transformedBody = transformHomeBody({
    bodyHtml,
    productCount: products.length,
    productGridMarkup: "",
    sectionMarkups,
  });

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeServerHtml(transformedBody) }}
        suppressHydrationWarning
      />
      <HomeProductBrowser
        products={storefrontProducts}
        categories={[
          {
            id: "vegetables",
            label: "Vegetables",
            products: vegetableProducts,
          },
          {
            id: "fruits",
            label: "Fruits",
            products: fruitsProducts,
          },
          {
            id: "juices",
            label: "Juices",
            products: juicesProducts,
          },
          {
            id: "spices",
            label: "Spices & Herbs",
            products: spicesProducts,
          },
        ]}
      />
      <ProductGridClient products={storefrontProducts} />
      <ProductShareHandler products={storefrontProducts} />
    </>
  );
}
