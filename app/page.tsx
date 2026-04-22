import fs from "node:fs/promises";
import path from "node:path";
import { featuredProductsGridHtml } from "@/components/home/featured-products";
import { sectionCarouselHtml, vegetableSectionHtml } from "@/components/home/vegetable-section";
import { loadLocalCatalog } from "@/lib/local-catalog";
import { ProductGridClient } from "@/components/home/ProductGridClient";
import ProductShareHandler from "@/components/home/ProductShareHandler";

async function readOriginalBody() {
  const filePath = path.join(process.cwd(), "index.html");
  const html = await fs.readFile(filePath, "utf8");
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = match?.[1] ?? html;
  
  // Remove header since layout.tsx has SiteHeader component
  const withoutHeader = body.replace(/<header[^>]*>[\s\S]*?<\/header>/i, "");
  
  // Replace promo banner with shopping banner
  const withoutPromoBanner = withoutHeader.replace(
    /<div class="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">[\s\S]*?<\/div>/i,
    `<div class="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">
      <div class="flex items-center justify-center gap-2 text-sm">
        <span class="font-medium">
          🛒 Discover thousands of quality products!
        </span>
        <a href="/shop" class="underline font-semibold hover:text-yellow-200 transition-colors">
          Buy now →
        </a>
      </div>
    </div>`
  );

  const mainContentRegex = /<div>\s*<div class="max-w-\(--breakpoint-xl\) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">/i;
  const mainContentMatch = withoutPromoBanner.match(mainContentRegex);
  const mainContentStart = mainContentMatch ? mainContentMatch.index : -1;
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

  // Tất cả các section đều có href="/shop"
  const fruitsMarkup = sectionCarouselHtml({
    title: "Fruits",
    href: "/shop",
    products: fruitsProducts,
    productCount: fruitsProducts.length,
  });
  const juicesMarkup = sectionCarouselHtml({
    title: "Juices",
    href: "/shop",
    products: juicesProducts,
    productCount: juicesProducts.length,
  });
  const drinksMarkup = sectionCarouselHtml({
    title: "Drinks",
    href: "/shop",
    products: drinksProducts,
    productCount: drinksProducts.length,
  });

  let transformedBody = bodyHtml.replace(/0(?:<!-- -->)? products/g, `${products.length} products`);

  const mainContentRegex = /<div>\s*<div class="max-w-\(--breakpoint-xl\) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">/i;
  const mainContentMatch = transformedBody.match(mainContentRegex);
  const featuredSectionStart = mainContentMatch ? mainContentMatch.index : -1;

  const skeletonRegex = /<div class="space-y-6 mb-12">/i;
  const skeletonMatch = featuredSectionStart >= 0
    ? transformedBody.slice(featuredSectionStart).match(skeletonRegex)
    : null;
  const skeletonStart = skeletonMatch ? featuredSectionStart + skeletonMatch.index! : -1;

  const filtersRegex = /<div class="bg-gofarm-white rounded-2xl shadow-lg border border-gofarm-light-green\/20 p-6 mb-8">/i;
  const filtersMatch = featuredSectionStart >= 0
    ? transformedBody.slice(featuredSectionStart).match(filtersRegex)
    : null;
  const filtersStart = filtersMatch ? featuredSectionStart + filtersMatch.index! : -1;

  const emptyStateRegex = /<div class="flex flex-col items-center justify-center py-16 min-h-80 space-y-8 text-center bg-linear-to-br from-gray-50\/50 to-white rounded-xl border border-gray-200\/50 w-full">/i;
  const emptyStateMatch = filtersStart >= 0
    ? transformedBody.slice(filtersStart).match(emptyStateRegex)
    : null;
  const emptyStateStart = emptyStateMatch ? filtersStart + emptyStateMatch.index! : -1;

  const nextSectionRegex = /<section class="py-16 lg:py-20 bg-linear-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">/i;
  const nextSectionMatch = emptyStateStart >= 0
    ? transformedBody.slice(emptyStateStart).match(nextSectionRegex)
    : null;
  const nextSectionStart = nextSectionMatch ? emptyStateStart + nextSectionMatch.index! : -1;

  // Tìm vị trí kết thúc của phần cần thay thế (footer)
  const footerRegex = /<footer class="bg-gofarm-white border-t border-gofarm-light-gray mt-10">/i;
  const footerMatch = transformedBody.slice(nextSectionStart).match(footerRegex);
  const footerStart = footerMatch ? nextSectionStart + footerMatch.index! : transformedBody.length;

  if (
    featuredSectionStart !== undefined && featuredSectionStart >= 0 &&
    skeletonStart >= 0 &&
    filtersStart >= 0 &&
    emptyStateStart >= 0 &&
    nextSectionStart > emptyStateStart
  ) {
    const titleBlock = transformedBody.slice(featuredSectionStart, skeletonStart);
    // Lấy toàn bộ phần còn lại từ nextSectionStart đến footer (bao gồm WhyShop, BrandsGrid, WhyChoose)
    const remainingContent = transformedBody.slice(nextSectionStart, footerStart);

    transformedBody =
      transformedBody.slice(0, featuredSectionStart) +
      titleBlock +
      vegetableMarkup +
      fruitsMarkup +
      juicesMarkup +
      drinksMarkup +
      `<div class="pt-8">${productGridMarkup}</div>` +
      remainingContent +  // ← GIỮ LẠI WhyShop, BrandsGrid, WhyChoose
      transformedBody.slice(footerStart);
  }

  // Sửa tất cả link "Become a Vendor" và "Learn More" về /contact
  transformedBody = transformedBody.replace(
    /<a href="\/sign-up">\s*<button[\s\S]*?Become a Vendor[\s\S]*?<\/button>\s*<\/a>/gi,
    `<a href="/contact">
      <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-4 bg-gofarm-green hover:bg-gofarm-green/90 text-white font-semibold px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">Become a Vendor</button>
    </a>`
  );

  transformedBody = transformedBody.replace(
    /<a href="\/vendor-info">\s*<button[\s\S]*?Learn More[\s\S]*?<\/button>\s*<\/a>/i,
    `<a href="/contact">
      <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-[>svg]:px-4 border-2 border-gofarm-green text-gofarm-green hover:bg-gofarm-green/5 font-semibold px-8 h-12 rounded-xl w-full sm:w-auto">Learn More</button>
    </a>`
  );

  // Cách thay thế đơn giản hơn (dự phòng nếu regex không match)
  transformedBody = transformedBody.replace(/href="\/sign-up"/g, 'href="/contact"');
  transformedBody = transformedBody.replace(/href="\/vendor-info"/g, 'href="/contact"');

  // Đảm bảo tất cả link "View More" đều về /shop
  transformedBody = transformedBody.replace(/href="\/category\/vegetables"/g, 'href="/shop"');
  transformedBody = transformedBody.replace(/href="\/collection"/g, 'href="/shop"');

  // Xóa floating button Buy Production Code
  transformedBody = transformedBody.replace(
    /<a target="_blank" rel="noopener noreferrer" class="fixed bottom-6 right-20 z-50 group" href="https:\/\/buymeacoffee\.com\/reactbd\/e\/484104">[\s\S]*?<\/a>(?=<section aria-label="Notifications alt\+T")/i,
    ""
  );

  // Remove Latest Blog Posts section
  transformedBody = transformedBody.replace(
    /<div class="max-w-\(--breakpoint-xl\) mx-auto px-4 mt-16 lg:mt-24">\s*<div class="text-center mb-12">[\s\S]*?Latest Blog Posts[\s\S]*?Discover more insights and stories in our blog section[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
    ""
  );

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: transformedBody }} />
      <ProductGridClient products={products} />
      <ProductShareHandler products={products} />
    </>
  );
} 