import fs from "node:fs/promises";
import path from "node:path";
import { featuredProductsGridHtml } from "@/components/home/featured-products";
import { sectionCarouselHtml, vegetableSectionHtml } from "@/components/home/vegetable-section";
import { loadLocalCatalog } from "@/lib/local-catalog";
import { ProductGridClient } from "@/components/home/ProductGridClient";
import ProductShareHandler from "@/components/home/ProductShareHandler";
import { productCardHtmlServer } from "@/components/home/product-card-html";

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

// Hàm tạo HTML cho product card với đầy đủ data attributes cho add-to-cart, wishlist, share
function enhancedProductCardHtml(product: any) {
  const salePrice = product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const formattedSalePrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(salePrice);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(product.price);
  
  // Escape các ký tự đặc biệt trong tên sản phẩm
  const escapedName = product.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  
  return `
    <div class="transform hover:scale-105 transition-transform duration-300">
      <article class="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300" data-product-id="${product.id}">
        <a href="/shop/${product.slug}" class="block">
          <div class="relative h-52 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
            <img
              src="${product.imageSrc}"
              class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              alt="${product.imageAlt || product.name}"
              loading="lazy"
            />

            <div class="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
              <div class="inline-flex items-center rounded-md bg-gofarm-green text-white text-[10px] px-2 py-0.5 shadow-md font-semibold">
                ${status}
              </div>
              ${product.discount ? `
                <div class="inline-flex items-center rounded-md bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md font-bold">
                  -${product.discount}%
                </div>
              ` : ''}
            </div>

            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
              <button type="button" class="wishlist-btn p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white" data-product-id="${product.id}" data-product-name="${escapedName}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}" aria-label="Add to wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" class="w-3 h-3">
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                </svg>
              </button>
              <button type="button" class="share-btn p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white" data-product-id="${product.id}" data-product-name="${escapedName}" data-product-slug="${product.slug}" aria-label="Share product">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" class="w-3 h-3">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-2 space-y-1">
            <h2 class="text-xs font-semibold line-clamp-1 mb-0.5 group-hover:text-gofarm-green transition-colors">
              ${product.name}
            </h2>

            <div class="flex items-center gap-1">
              <div class="flex items-center">
                ${Array.from({ length: 5 }, (_, index) => `
                  <svg class="w-2.5 h-2.5 ${index < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}" viewBox="0 0 24 24" fill="${index < Math.round(product.rating) ? "currentColor" : "none"}" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                `).join('')}
              </div>
              <span class="text-[9px] text-gofarm-gray">(${product.reviews})</span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1 flex-wrap">
                <span class="text-gofarm-green text-sm font-bold">${formattedSalePrice}</span>
                ${product.discount ? `
                  <span class="text-[10px] text-gray-400 line-through">${formattedPrice}</span>
                ` : ''}
              </div>
            </div>
          </div>
        </a>
        
        <button class="add-to-cart-btn w-full rounded-md bg-gofarm-green text-white px-2 py-1.5 text-[10px] font-semibold hover:bg-gofarm-light-green transition-colors mx-2 mb-2" style="width: calc(100% - 16px)" data-product-id="${product.id}" data-product-name="${escapedName}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}">
          Add to Cart
        </button>
      </article>
    </div>
  `;
}

export default async function HomePage() {
  const bodyHtml = await readOriginalBody();
  const catalog = await loadLocalCatalog();
  const allProducts = catalog.products;
  const products = allProducts.slice(0, 13);
  
  // Sử dụng hàm enhancedProductCardHtml thay vì productCardHtmlServer
  const productGridMarkup = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      ${products.map(enhancedProductCardHtml).join("")}
    </div>
  `;
  
  const vegetableProducts = products.slice(0, 10);
  
  // Hàm tạo carousel với enhanced product cards
  const enhancedSectionCarouselHtml = ({ title, href, products, productCount }: { title: string; href: string; products: any[]; productCount: number }) => {
    const items = products.slice(0, 10);
    return `
      <div class="bg-gofarm-white rounded-2xl shadow-lg border border-gofarm-light-green/20 p-6 mb-8">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <h3 class="text-2xl font-bold text-gofarm-black">${title}</h3>
            <span class="inline-flex items-center rounded-full bg-gofarm-light-orange/40 px-4 py-2 text-sm font-semibold text-gofarm-green">
              ${productCount} Products
            </span>
          </div>
          <a class="inline-flex items-center gap-2 text-gofarm-green font-semibold hover:text-gofarm-light-green transition-colors duration-200" href="/shop">
            <span>View More</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div class="border-t border-gofarm-light-gray pt-8 relative">
          <button
            type="button"
            class="absolute left-[-16px] top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green"
            aria-label="Previous products"
            onclick="(function(el){if(el){el.scrollBy({left:-el.clientWidth,behavior:'smooth'})}})(document.getElementById('carousel-${title.replace(/\s/g, '')}'))"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            class="absolute right-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green"
            aria-label="Next products"
            onclick="(function(el){if(el){el.scrollBy({left:el.clientWidth,behavior:'smooth'})}})(document.getElementById('carousel-${title.replace(/\s/g, '')}'))"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div id="carousel-${title.replace(/\s/g, '')}" class="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-20 pr-16">
            <div class="pb-2" style="display:grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 64px) / 5); gap: 16px;">
              ${items.map((product, index) => `
                <div id="carousel-item-${title.replace(/\s/g, '')}-${index}" class="snap-start">
                  ${enhancedProductCardHtml(product)}
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 pt-8">
          <span class="h-3 w-8 rounded-full bg-gofarm-green"></span>
          <span class="h-3 w-3 rounded-full bg-gray-200"></span>
          <span class="h-3 w-3 rounded-full bg-gray-200"></span>
          <span class="h-3 w-3 rounded-full bg-gray-200"></span>
          <span class="h-3 w-3 rounded-full bg-gray-200"></span>
          <span class="h-3 w-3 rounded-full bg-gray-200"></span>
          <span class="h-3 w-3 rounded-full bg-gray-200"></span>
          <span class="h-3 w-3 rounded-full bg-gray-200"></span>
        </div>
      </div>
    `;
  };

  const vegetableMarkup = enhancedSectionCarouselHtml({
    title: "Vegetables",
    href: "/shop",
    products: vegetableProducts,
    productCount: vegetableProducts.length,
  });

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

  const fruitsMarkup = enhancedSectionCarouselHtml({
    title: "Fruits",
    href: "/shop",
    products: fruitsProducts,
    productCount: fruitsProducts.length,
  });
  const juicesMarkup = enhancedSectionCarouselHtml({
    title: "Juices",
    href: "/shop",
    products: juicesProducts,
    productCount: juicesProducts.length,
  });
  const drinksMarkup = enhancedSectionCarouselHtml({
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

  if (
    featuredSectionStart !== undefined && featuredSectionStart >= 0 &&
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
      `<div class="pt-8">${productGridMarkup}</div>` +
      transformedBody.slice(nextSectionStart);
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