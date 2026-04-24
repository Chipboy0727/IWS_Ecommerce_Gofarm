import { ProductGridClient } from "@/components/home/product-grid-client";
import ProductShareHandler from "@/components/home/product-share-handler";
import { sanitizeServerHtml } from "@/lib/backend/sanitize-html";
import {
  buildProductGridMarkup,
  buildSectionCarouselHtml,
  readOriginalHomeBody,
  transformHomeBody,
} from "@/lib/home-page";
import { loadLocalCatalog } from "@/lib/local-catalog";

export default async function HomePage() {
  const bodyHtml = await readOriginalHomeBody();
  const { products: allProducts } = await loadLocalCatalog();
  const usedSlugs = new Set<string>();

  const takeSectionProducts = (matches: typeof allProducts, limit = 10) => {
    const items: typeof allProducts = [];

    for (const product of matches) {
      if (!product.slug || usedSlugs.has(product.slug)) continue;
      items.push(product);
      usedSlugs.add(product.slug);
      if (items.length >= limit) return items;
    }

    for (const product of allProducts) {
      if (!product.slug || usedSlugs.has(product.slug)) continue;
      items.push(product);
      usedSlugs.add(product.slug);
      if (items.length >= limit) return items;
    }

    return items;
  };

  const vegetableProducts = takeSectionProducts(
    allProducts.filter(
      (product) =>
        product.categoryTitle?.toLowerCase() === "vegetables" ||
        /vegetable|tomato|potato|onion|cabbage|carrot|broccoli|lettuce/i.test(product.name)
    )
  );

  const fruitsProducts = takeSectionProducts(
    allProducts.filter(
      (product) =>
        product.categoryTitle?.toLowerCase() === "fruits" ||
        /fruit|apple|pear|mango|banana|watermelon|orange|berry/i.test(product.name)
    )
  );

  const juicesProducts = takeSectionProducts(
    allProducts.filter(
      (product) =>
        product.categoryTitle?.toLowerCase() === "juices" ||
        /juice|juices|smoothie/i.test(product.name)
    )
  );

  const spicesProducts = takeSectionProducts(
    allProducts.filter(
      (product) =>
        product.categoryTitle?.toLowerCase() === "spices & herbs" ||
        /chili|pepper|garlic|salt|sugar|herb|spice/i.test(product.name)
    )
  );

  const products = allProducts.filter((product) => !usedSlugs.has(product.slug)).slice(0, 15);
  const productGridMarkup = buildProductGridMarkup(products);
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
    productGridMarkup,
    sectionMarkups,
  });

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeServerHtml(transformedBody) }}
        suppressHydrationWarning
      />
      <ProductGridClient products={allProducts} />
      <ProductShareHandler products={allProducts} />
    </>
  );
}
