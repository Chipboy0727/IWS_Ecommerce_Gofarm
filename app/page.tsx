import fs from "node:fs/promises";
import path from "node:path";
import { featuredProductsGridHtml } from "@/components/home/featured-products";
import { sectionCarouselHtml, vegetableSectionHtml } from "@/components/home/vegetable-section";
import { loadLocalCatalog } from "@/lib/local-catalog";

async function readOriginalBody() {
  const filePath = path.join(process.cwd(), "index.html");
  const html = await fs.readFile(filePath, "utf8");
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = match?.[1] ?? html;
  const withoutPromoBanner = body.replace(
    /<div class="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">[\s\S]*?<\/div><div class="border-b border-gofarm-light-gray">/,
    '<div class="border-b border-gofarm-light-gray">'
  );

  const mainContentMarker =
    '<div><div class="max-w-(--breakpoint-xl) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">';
  const mainContentStart = withoutPromoBanner.indexOf(mainContentMarker);
  const headerOnly =
    mainContentStart >= 0 ? withoutPromoBanner.slice(0, mainContentStart) : withoutPromoBanner;
  const restContent =
    mainContentStart >= 0 ? withoutPromoBanner.slice(mainContentStart) : "";
  const strippedHeader = headerOnly
    .replace(/<a[^>]*href="\/compare"[^>]*>[\s\S]*?<\/a>/g, "")
    .replace(/<a[^>]*href="\/blog"[^>]*>[\s\S]*?<\/a>/g, "");

  const combinedBody = strippedHeader + restContent;

  return combinedBody.replace(
    /<link rel="preload" as="script" fetchpriority="low" href="\/_next\/static\/chunks\/([^"?]+)(?:\?[^"]*)?">/g,
    '<link rel="preload" as="script" fetchpriority="low" href="/js/$1">'
  );
}

export default async function HomePage() {
  const bodyHtml = await readOriginalBody();
  const catalog = await loadLocalCatalog();
  const allProducts = catalog.products;
  const products = allProducts.slice(0, 13);
  const productGridMarkup = featuredProductsGridHtml(products);
  const vegetableProducts = products.slice(0, 10);
  const vegetableMarkup = vegetableSectionHtml(vegetableProducts, vegetableProducts.length);

  const usedSlugs = new Set<string>();
  for (const product of vegetableProducts) {
    if (product.slug) usedSlugs.add(product.slug);
  }
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

  const fruitsProducts = takeSectionProducts(
    allProducts.filter(
      (product) =>
        product.categoryTitle?.toLowerCase() === "fruit" ||
        /fruit|apple|pear|mango|banana|watermelon|orange|berry/i.test(product.name)
    )
  );
  const juicesProducts = takeSectionProducts(
    allProducts.filter((product) => /juice|juices|smoothie/i.test(product.name))
  );
  const drinksProducts = takeSectionProducts(
    allProducts.filter((product) => /drink|drinks|water|tea|milk|coffee|cola/i.test(product.name))
  );

  const fruitsMarkup = sectionCarouselHtml({
    title: "Fruits",
    href: "/collection",
    products: fruitsProducts,
    productCount: fruitsProducts.length,
  });
  const juicesMarkup = sectionCarouselHtml({
    title: "Jucies",
    href: "/collection",
    products: juicesProducts,
    productCount: juicesProducts.length,
  });
  const drinksMarkup = sectionCarouselHtml({
    title: "Drinks",
    href: "/collection",
    products: drinksProducts,
    productCount: drinksProducts.length,
  });

  let transformedBody = bodyHtml.replace(/0(?:<!-- -->)? products/g, `${products.length} products`);

  const featuredSectionStart = transformedBody.indexOf(
    '<div><div class="max-w-(--breakpoint-xl) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">'
  );
  const skeletonStart =
    featuredSectionStart >= 0
      ? transformedBody.indexOf('<div class="space-y-6 mb-12">', featuredSectionStart)
      : -1;
  const filtersStart =
    featuredSectionStart >= 0
      ? transformedBody.indexOf(
          '<div class="bg-gofarm-white rounded-2xl shadow-lg border border-gofarm-light-green/20 p-6 mb-8">',
          featuredSectionStart
        )
      : -1;
  const emptyStateStart =
    filtersStart >= 0
      ? transformedBody.indexOf(
          '<div class="flex flex-col items-center justify-center py-16 min-h-80 space-y-8 text-center bg-linear-to-br from-gray-50/50 to-white rounded-xl border border-gray-200/50 w-full">',
          filtersStart
        )
      : -1;
  const nextSectionStart =
    emptyStateStart >= 0
      ? transformedBody.indexOf(
          '<section class="py-16 lg:py-20 bg-linear-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">',
          emptyStateStart
        )
      : -1;

  if (
    featuredSectionStart >= 0 &&
    skeletonStart >= 0 &&
    filtersStart >= 0 &&
    emptyStateStart >= 0 &&
    nextSectionStart > emptyStateStart
  ) {
    const titleBlock = transformedBody.slice(featuredSectionStart, skeletonStart);
    const filtersBlock = transformedBody.slice(filtersStart, emptyStateStart);

    transformedBody =
      transformedBody.slice(0, featuredSectionStart) +
      titleBlock +
      vegetableMarkup +
      fruitsMarkup +
      juicesMarkup +
      drinksMarkup +
      filtersBlock +
      `<div class="pt-8">${productGridMarkup}</div>` +
      transformedBody.slice(nextSectionStart);
  }

  transformedBody = transformedBody.replace(
    /<a target="_blank" rel="noopener noreferrer" class="fixed bottom-6 right-20 z-50 group" href="https:\/\/buymeacoffee\.com\/reactbd\/e\/484104">[\s\S]*?<\/a>(?=<section aria-label="Notifications alt\+T")/,
    ""
  );

  return <div dangerouslySetInnerHTML={{ __html: transformedBody }} />;
}
