import fs from "node:fs/promises";
import path from "node:path";
import type { LocalProduct } from "@/lib/local-catalog";

type SectionCarouselOptions = {
  title: string;
  products: LocalProduct[];
  productCount: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

export async function readOriginalHomeBody() {
  const filePath = path.join(process.cwd(), "data", "index.html");
  const html = await fs.readFile(filePath, "utf8");
  const normalizedHtml = html.replace(/\r\n/g, "\n");
  const match = normalizedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = match?.[1] ?? normalizedHtml;

  const withoutHeader = body.replace(/<header[^>]*>[\s\S]*?<\/header>/i, "");

  const withoutPromoBanner = withoutHeader.replace(
    /<div class="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">[\s\S]*?<\/div>/i,
    `<div class="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">
      <div class="flex items-center justify-center gap-2 text-sm">
        <span class="font-medium">Discover thousands of quality products!</span>
        <a href="/shop" class="underline font-semibold hover:text-yellow-200 transition-colors">
          Buy now &rarr;
        </a>
      </div>
    </div>`
  );

  const mainContentRegex = /<div>\s*<div class="max-w-\(--breakpoint-xl\) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">/i;
  const mainContentMatch = withoutPromoBanner.match(mainContentRegex);
  const mainContentStart = mainContentMatch?.index ?? -1;
  const headerOnly =
    mainContentStart >= 0 ? withoutPromoBanner.slice(0, mainContentStart) : withoutPromoBanner;
  const restContent =
    mainContentStart >= 0 ? withoutPromoBanner.slice(mainContentStart) : "";
  const strippedHeader = headerOnly
    .replace(/<a[^>]*href="\/compare"[^>]*>[\s\S]*?<\/a>/g, "")
    .replace(/<a[^>]*href="\/blog"[^>]*>[\s\S]*?<\/a>/g, "");

  const combinedBody = strippedHeader + restContent;
  const withoutFooter = combinedBody.replace(/<footer[^>]*>[\s\S]*?<\/footer>/i, "");
  const withoutDocumentArtifacts = withoutFooter
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .replace(/<\/?(html|head|body)\b[^>]*>/gi, "")
    .replace(/<div hidden="">\s*<!--\$--><!--\/\$-->\s*<\/div>/gi, "")
    .replace(/<!--\$-->|<!--\/\$-->/g, "");

  return withoutDocumentArtifacts.replace(
    /<link rel="preload" as="script" fetchpriority="low" href="\/_next\/static\/chunks\/([^"?]+)(?:\?[^"]*)?">/g,
    '<link rel="preload" as="script" fetchpriority="low" href="/js/$1">'
  );
}

export function buildInteractiveProductCardHtml(product: LocalProduct) {
  const salePrice = product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const formattedSalePrice = formatPrice(salePrice);
  const formattedPrice = formatPrice(product.price);
  const escapedName = product.name.replace(/'/g, "\\'").replace(/"/g, "&quot;");

  return `
    <div class="h-full transform hover:scale-105 transition-transform duration-300">
      <article class="group relative flex h-full flex-col border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300" data-product-id="${product.id}">
        <a href="/shop/${product.slug}" class="block flex-1">
          <div class="relative h-52 overflow-hidden bg-white flex items-center justify-center p-4">
            <img
              src="${product.imageSrc}"
              class="max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-all duration-500 group-hover:scale-105"
              data-product-card-image="true"
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
              ` : ""}
            </div>

          </div>

          <div class="flex h-[140px] flex-col p-2 space-y-1">
            <h2 class="text-xs font-semibold line-clamp-1 mb-0.5 group-hover:text-gofarm-green transition-colors">
              ${product.name}
            </h2>

            <div class="flex items-center gap-1">
              <div class="flex items-center">
                ${Array.from({ length: 5 }, (_, index) => `
                  <svg class="w-2.5 h-2.5 ${index < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}" viewBox="0 0 24 24" fill="${index < Math.round(product.rating) ? "currentColor" : "none"}" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                `).join("")}
              </div>
              <span class="text-[9px] text-gofarm-gray">(${product.reviews})</span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1 flex-wrap">
                <span class="text-gofarm-green text-sm font-bold">${formattedSalePrice}</span>
                ${product.discount ? `<span class="text-[10px] text-gray-400 line-through">${formattedPrice}</span>` : ""}
              </div>
            </div>
          </div>
        </a>

        <div class="absolute right-2 top-4 z-10 flex translate-x-full flex-col gap-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100">
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

        <button class="add-to-cart-btn mt-auto w-full rounded-md border border-gofarm-green bg-white px-2 py-1.5 text-[10px] font-semibold text-gofarm-green transition-colors hover:bg-gofarm-green hover:text-white active:bg-gofarm-green active:text-white mx-2 mb-2" style="width: calc(100% - 16px)" data-product-id="${product.id}" data-product-name="${escapedName}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}">
          Add to Cart
        </button>
      </article>
    </div>
  `;
}

export function buildProductGridMarkup(products: LocalProduct[]) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      ${products.map(buildInteractiveProductCardHtml).join("")}
    </div>
  `;
}

export function buildSectionCarouselHtml({ title, products, productCount }: SectionCarouselOptions) {
  const items = products.slice(0, 10);
  const carouselId = `carousel-${title.replace(/\s/g, "")}`;

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
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div class="border-t border-gofarm-light-gray pt-8 relative">
        <button
          type="button"
          class="absolute left-[-16px] top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green"
          aria-label="Previous products"
          data-carousel-target="${carouselId}"
          data-carousel-direction="prev"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          class="absolute right-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green"
          aria-label="Next products"
          data-carousel-target="${carouselId}"
          data-carousel-direction="next"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div id="${carouselId}" class="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-20 pr-16">
          <div class="pb-2" style="display:grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 64px) / 5); gap: 16px;">
            ${items.map((product, index) => `
              <div id="${carouselId}-item-${index}" class="snap-start">
                ${buildInteractiveProductCardHtml(product)}
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
}

type TransformHomeBodyOptions = {
  bodyHtml: string;
  productCount: number;
  productGridMarkup: string;
  sectionMarkups: string[];
};

export function transformHomeBody({
  bodyHtml,
  productCount,
  productGridMarkup,
  sectionMarkups,
}: TransformHomeBodyOptions) {
  let transformedBody = bodyHtml.replace(/0(?:<!-- -->)? products/g, `${productCount} products`);

  const mainContentRegex = /<div\s+class="max-w-\(--breakpoint-xl\) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">/i;
  const mainContentMatch = transformedBody.match(mainContentRegex);
  const featuredSectionStart = mainContentMatch?.index ?? -1;

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

  const emptyStateRegex = /<div\s+class="flex flex-col items-center justify-center py-16 min-h-80 space-y-8 text-center bg-linear-to-br from-gray-50\/50 to-white rounded-xl border border-gray-200\/50 w-full">/i;
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
    featuredSectionStart >= 0 &&
    skeletonStart >= 0 &&
    filtersStart >= 0 &&
    emptyStateStart >= 0 &&
    nextSectionStart > emptyStateStart
  ) {
    const titleBlock = transformedBody.slice(featuredSectionStart, skeletonStart);
    transformedBody =
      transformedBody.slice(0, featuredSectionStart) +
      titleBlock +
      sectionMarkups.join("") +
      `<div class="pt-8">${productGridMarkup}</div>` +
      transformedBody.slice(nextSectionStart);
  }

  const blogTitleIndex = transformedBody.indexOf("Latest Blog Posts");
  if (blogTitleIndex >= 0) {
    const blogStart = transformedBody.lastIndexOf(
      '<div class="max-w-(--breakpoint-xl) mx-auto px-4 mt-16 lg:mt-24">',
      blogTitleIndex
    );

    if (blogStart >= 0) {
      transformedBody = transformedBody.slice(0, blogStart);
    }
  }

  const emptyPlaceholderSection = /<section class="py-16 lg:py-20 bg-linear-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">\s*<div class="absolute inset-0 bg-grid-slate-100 \[mask-image:linear-linear\(0deg,white,rgba\(255,255,255,0\.6\)\)\] bg-\[size:32px_32px\]">\s*<\/div>\s*<div class="container mx-auto px-4 relative">\s*<div class="text-center mb-12">\s*<div class="h-10 bg-gray-200 rounded-xl w-80 mx-auto mb-4 animate-pulse"><\/div>\s*<div class="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"><\/div>\s*<\/div>\s*<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\s*<div class="h-64 bg-white\/50 rounded-2xl animate-pulse border border-gray-100"><\/div>\s*<div class="h-64 bg-white\/50 rounded-2xl animate-pulse border border-gray-100"><\/div>\s*<div class="h-64 bg-white\/50 rounded-2xl animate-pulse border border-gray-100"><\/div>\s*<\/div>\s*<\/div>\s*<\/section>/i;
  transformedBody = transformedBody.replace(emptyPlaceholderSection, "");

  transformedBody = `<style>
    section.py-16.lg\\:py-20.bg-linear-to-br.from-emerald-50.via-white.to-green-50.relative.overflow-hidden {
      display: none !important;
    }
  </style>${transformedBody}`;

  transformedBody = transformedBody.replace(
    /<a href="\/sign-up">\s*<button[\s\S]*?Become a Vendor[\s\S]*?<\/button>\s*<\/a>/gi,
    `<a href="/contact" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-4 bg-gofarm-green hover:bg-gofarm-green/90 text-white font-semibold px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">Become a Vendor</a>`
  );

  transformedBody = transformedBody.replace(
    /<a href="\/vendor-info">\s*<button[\s\S]*?Learn More[\s\S]*?<\/button>\s*<\/a>/i,
    `<a href="/contact" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-[>svg]:px-4 border-2 border-gofarm-green text-gofarm-green hover:bg-gofarm-green/5 font-semibold px-8 h-12 rounded-xl w-full sm:w-auto">Learn More</a>`
  );

  transformedBody = transformedBody.replace(/href="\/sign-up"/g, 'href="/contact"');
  transformedBody = transformedBody.replace(/href="\/vendor-info"/g, 'href="/contact"');
  transformedBody = transformedBody.replace(/href="\/category\/vegetables"/g, 'href="/shop"');
  transformedBody = transformedBody.replace(/href="\/collection"/g, 'href="/shop"');

  transformedBody = transformedBody.replace(
    /<a[^>]*class="[^"]*bottom-6[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    ""
  );

  transformedBody += `
    <a href="/shop" class="fixed bottom-6 right-6 z-50 group">
      <div class="relative">
        <div class="absolute inset-0 bg-linear-to-r from-gofarm-green to-emerald-500 rounded-full animate-pulse opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center gap-2.5 bg-linear-to-r from-gofarm-green to-emerald-600 text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 overflow-hidden">
          <span class="absolute inset-0 bg-gofarm-orange -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
          <div class="relative z-10 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="font-semibold group-hover:text-yellow-200 transition-colors duration-300"></span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-3 h-3 absolute -top-1 -right-1 animate-pulse text-yellow-300" aria-hidden="true">
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
            <path d="M20 2v4"></path>
            <path d="M22 4h-4"></path>
            <circle cx="4" cy="20" r="2"></circle>
          </svg>
        </div>
      </div>
    </a>
  `;

  return transformedBody;
}
