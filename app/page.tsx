import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/backend/auth";
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
  const storefrontProducts = allProducts.filter(
    (product) => product.price > 0 && product.name.trim() && product.imageSrc.trim()
  );
  const usedSlugs = new Set<string>();
  const normalize = (value: string | null | undefined) => value?.toLowerCase() ?? "";

  const isJuiceProduct = (product: (typeof storefrontProducts)[number]) => {
    const category = normalize(product.categoryTitle);
    const name = normalize(product.name);
    return category === "juices" || /juice|juices|smoothie|nước ép|sinh tố|nước|sữa/i.test(name);
  };

  const isVegetableProduct = (product: (typeof storefrontProducts)[number]) => {
    const category = normalize(product.categoryTitle);
    const name = normalize(product.name);
    return (
      (category === "vegetables" ||
        /vegetable|tomato|potato|onion|cabbage|carrot|broccoli|lettuce|cà chua|cải|khoai|hành|tỏi|bí|rau|ớt chuông|măng tây|súp lơ|dưa leo/i.test(name)) &&
      !isJuiceProduct(product)
    );
  };

  const isFruitProduct = (product: (typeof storefrontProducts)[number]) => {
    const category = normalize(product.categoryTitle);
    const name = normalize(product.name);
    return (
      (category === "fruits" ||
        /fruit|apple|pear|mango|banana|watermelon|orange|berry|táo|lê|xoài|chuối|dưa|cam|nho|bơ|dâu|thanh long|bưởi|kiwi|măng cụt|sầu riêng|chôm chôm|việt quất|ổi|lựu|nhãn|vải/i.test(name)) &&
      !isJuiceProduct(product)
    );
  };

  const takeSectionProducts = (matches: typeof storefrontProducts, limit = 10) => {
    const items: typeof storefrontProducts = [];

    for (const product of matches) {
      if (!product.slug || usedSlugs.has(product.slug)) continue;
      items.push(product);
      usedSlugs.add(product.slug);
      if (items.length >= limit) return items;
    }

    for (const product of storefrontProducts) {
      if (!product.slug || usedSlugs.has(product.slug)) continue;
      items.push(product);
      usedSlugs.add(product.slug);
      if (items.length >= limit) return items;
    }

    return items;
  };

  const vegetableProducts = takeSectionProducts(
    storefrontProducts.filter((product) => isVegetableProduct(product))
  );

  const fruitsProducts = takeSectionProducts(
    storefrontProducts.filter((product) => isFruitProduct(product))
  );

  const juicesProducts = takeSectionProducts(
    storefrontProducts.filter((product) => isJuiceProduct(product))
  );

  const spicesProducts = takeSectionProducts(
    storefrontProducts.filter(
      (product) =>
        product.categoryTitle?.toLowerCase() === "spices & herbs" ||
        /chili|pepper|garlic|salt|sugar|herb|spice|ớt|tiêu|tỏi|muối|đường|thảo mộc|gia vị|gừng|sả|hành|nghệ|riềng|rau thơm|quế|hồi/i.test(product.name)
    )
  );

  const products = storefrontProducts.filter((product) => !usedSlugs.has(product.slug)).slice(0, 15);
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
      <ProductGridClient products={storefrontProducts} />
      <ProductShareHandler products={storefrontProducts} />
    </>
  );
}
