import fs from "node:fs/promises";
import path from "node:path";
import { featuredProductsGridHtml } from "@/components/home/featured-products";
import { sectionCarouselHtml, vegetableSectionHtml } from "@/components/home/vegetable-section";
import { ProductGridClient } from "@/components/home/ProductGridClient";
import ProductShareHandler from "@/components/home/ProductShareHandler";
import { productCardHtmlServer } from "@/components/home/product-card-html";
import type { LocalCategory } from "@/lib/local-catalog";
import { loadLocalCatalog } from "@/lib/local-catalog";

async function readOriginalBody() {
  const filePath = path.join(process.cwd(), "index.html");
  const html = await fs.readFile(filePath, "utf8");
  const normalizedHtml = html.replace(/\r\n/g, "\n");
  const match = normalizedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = match?.[1] ?? normalizedHtml;
  
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
  const mainContentStart = mainContentMatch?.index ?? -1;
  const headerOnly =
    mainContentStart >= 0 ? withoutPromoBanner.slice(0, mainContentStart) : withoutPromoBanner;
  const restContent =
    mainContentStart >= 0 ? withoutPromoBanner.slice(mainContentStart) : "";
  const strippedHeader = headerOnly
    .replace(/<a[^>]*href="\/compare"[^>]*>[\s\S]*?<\/a>/g, "")
    .replace(/<a[^>]*href="\/blog"[^>]*>[\s\S]*?<\/a>/g, "");

  const combinedBody = strippedHeader + restContent;

  // Remove footer since layout.tsx has SiteFooter component
  const withoutFooter = combinedBody.replace(/<footer[^>]*>[\s\S]*?<\/footer>/i, "");

  return withoutFooter.replace(
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
          <div class="relative h-52 overflow-hidden bg-white flex items-center justify-center p-4">
            <img
              src="${product.imageSrc}"
              class="max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-all duration-500 group-hover:scale-105"
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
        
        <button class="add-to-cart-btn w-full rounded-md border border-gofarm-green bg-white px-2 py-1.5 text-[10px] font-semibold text-gofarm-green transition-colors hover:bg-gofarm-green hover:text-white active:bg-gofarm-green active:text-white mx-2 mb-2" style="width: calc(100% - 16px)" data-product-id="${product.id}" data-product-name="${escapedName}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}">
          Add to Cart
        </button>
      </article>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function popularCategoriesMarkup(categories: LocalCategory[]) {
  const items = [...categories]
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return `
    <div class="max-w-(--breakpoint-xl) mx-auto px-4 mt-16 lg:mt-24">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="h-1 w-16 bg-linear-to-r from-transparent via-gofarm-light-green to-gofarm-green rounded-full animate-pulse"></div>
          <h2 class="text-3xl lg:text-5xl font-extrabold bg-linear-to-r from-gofarm-green via-gofarm-light-green to-gofarm-green bg-clip-text text-transparent">Popular Categories</h2>
          <div class="h-1 w-16 bg-linear-to-l from-transparent via-gofarm-light-green to-gofarm-green rounded-full animate-pulse"></div>
        </div>
        <p class="text-gofarm-gray text-lg max-w-2xl mx-auto mb-2">Explore our most popular product categories and find what you need</p>
        <p class="text-sm text-gofarm-green/80 font-medium mb-6">Curated collections for your convenience</p>
        <a href="/collection" class="group inline-flex items-center gap-2 mt-2 px-8 py-3.5 bg-linear-to-r from-gofarm-green to-gofarm-light-green text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Browse All Categories
          <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
      <div class="relative bg-linear-to-br from-white via-gofarm-light-orange/20 to-gofarm-light-green/10 p-8 lg:p-12 rounded-3xl shadow-2xl border border-gofarm-light-green/30 overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gofarm-light-green/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-gofarm-orange/5 rounded-full blur-3xl"></div>
        <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${items
            .map(
              (category, index) => `
                <a href="/collection?category=${encodeURIComponent(category.slug)}" class="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100/50 hover:border-gofarm-light-green transition-all duration-300 transform hover:-translate-y-3 cursor-pointer block overflow-hidden" style="animation-delay:${index * 0.05}s">
                  <div class="absolute inset-0 bg-linear-to-br from-gofarm-light-green/0 to-gofarm-orange/0 group-hover:from-gofarm-light-green/5 group-hover:to-gofarm-orange/5 transition-all duration-300"></div>
                  <div class="absolute -top-1 -right-1 w-16 h-16 bg-linear-to-br from-gofarm-green to-gofarm-light-green opacity-0 group-hover:opacity-10 rounded-bl-3xl transition-opacity duration-300"></div>
                  <div class="relative flex justify-center mb-5">
                    <div class="relative w-24 h-24 rounded-2xl overflow-hidden bg-linear-to-br from-gofarm-light-orange/30 to-gofarm-light-green/10 p-4 group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-gofarm-light-green/30">
                      <img src="${category.imageSrc ?? "/images/logo.svg"}" alt="${escapeHtml(category.title)}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                      <div class="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover:translate-x-full"></div>
                    </div>
                    <div class="absolute -top-2 -right-2 bg-linear-to-r from-gofarm-orange to-gofarm-light-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">Hot</div>
                  </div>
                  <div class="relative text-center space-y-3">
                    <h3 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green transition-colors duration-300 line-clamp-1 mb-2">${escapeHtml(category.title)}</h3>
                    <p class="text-xs text-gofarm-gray line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300">${category.count} products available</p>
                    <div class="relative w-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full h-2 overflow-hidden">
                      <div class="absolute inset-0 bg-linear-to-r from-gofarm-light-green via-gofarm-green to-gofarm-light-green h-2 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    </div>
                    <div class="relative inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-linear-to-r from-gofarm-light-orange/50 to-gray-50 text-gofarm-green font-semibold rounded-full group-hover:from-gofarm-green group-hover:to-gofarm-light-green group-hover:text-white text-sm transition-all duration-300 overflow-hidden border border-gofarm-light-green/20 group-hover:border-transparent shadow-sm group-hover:shadow-lg">
                      <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <span class="relative z-10">Explore Now</span>
                      <svg class="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div class="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-gofarm-light-green to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </a>
              `
            )
            .join("")}
        </div>
        <div class="relative flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-gofarm-light-green/30">
          <div class="group text-center px-6 py-3 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div class="text-3xl font-extrabold bg-linear-to-r from-gofarm-green to-gofarm-light-green bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">${items.length}+ </div>
            <div class="text-sm text-gofarm-gray font-medium mt-1">Categories</div>
          </div>
          <div class="group text-center px-6 py-3 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div class="text-3xl font-extrabold bg-linear-to-r from-gofarm-orange to-gofarm-light-orange bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">${categories.length}+ </div>
            <div class="text-sm text-gofarm-gray font-medium mt-1">Collections</div>
          </div>
          <div class="group text-center px-6 py-3 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div class="text-3xl font-extrabold bg-linear-to-r from-gofarm-green to-gofarm-light-green bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">24/7</div>
            <div class="text-sm text-gofarm-gray font-medium mt-1">Support</div>
          </div>
        </div>
        <div class="relative text-center mt-8">
          <div class="inline-flex items-center gap-4 px-8 py-4 bg-linear-to-r from-white/70 via-gofarm-light-orange/20 to-white/70 backdrop-blur-sm rounded-2xl border-2 border-gofarm-light-green/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="w-2.5 h-2.5 bg-linear-to-r from-gofarm-light-green to-gofarm-green rounded-full animate-pulse shadow-lg shadow-gofarm-light-green/50"></div>
            <span class="text-gofarm-black font-semibold">Discover amazing products in every category</span>
            <div class="w-2.5 h-2.5 bg-linear-to-r from-gofarm-green to-gofarm-light-green rounded-full animate-pulse shadow-lg shadow-gofarm-green/50"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function whyShopWithUsMarkup() {
  const items = [
    {
      title: "Secure Shopping",
      description: "100% secure payment with SSL encryption",
      icon: "shield-check",
      tone: "blue",
      stroke: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      extra: `<path d="m9 12 2 2 4-4"></path>`,
    },
    {
      title: "Free Delivery",
      description: "Free shipping on orders over $50",
      icon: "truck",
      tone: "green",
      stroke: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
      extra: `<path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle>`,
    },
    {
      title: "Easy Payments",
      description: "Multiple payment options available",
      icon: "credit-card",
      tone: "purple",
      stroke: "M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z",
      extra: `<line x1="2" x2="22" y1="10" y2="10"></line>`,
    },
    {
      title: "24/7 Support",
      description: "Friendly customer support around the clock",
      icon: "headphones",
      tone: "orange",
      stroke: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
      extra: "",
    },
  ];

  const iconBg: Record<string, string> = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
  };

  const iconText: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return `
    <div class="max-w-(--breakpoint-xl) mx-auto px-4 my-16 lg:my-24">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="h-1 w-12 bg-linear-to-r from-gofarm-light-green to-gofarm-green rounded-full"></div>
          <h2 class="text-3xl lg:text-4xl font-bold text-gofarm-black">Why Shop With Us</h2>
          <div class="h-1 w-12 bg-linear-to-l from-gofarm-light-green to-gofarm-green rounded-full"></div>
        </div>
        <p class="text-gofarm-gray text-lg max-w-2xl mx-auto">Experience the best online shopping with our commitment to quality, security, and exceptional service</p>
      </div>
      <div class="bg-linear-to-br from-white via-gray-50 to-gofarm-light-orange p-8 lg:p-12 rounded-3xl shadow-xl border border-gofarm-light-green/20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${items
            .map(
              (item, index) => `
                <button class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gofarm-light-green hoverEffect transform hover:-translate-y-2 cursor-pointer text-left w-full" style="animation-delay:${index * 0.05}s">
                  <div class="flex justify-center mb-5">
                    <div class="relative w-16 h-16 rounded-2xl ${iconBg[item.tone]} flex items-center justify-center group-hover:shadow-lg hoverEffect">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${item.icon} w-8 h-8 ${iconText[item.tone]} group-hover:scale-110 hoverEffect" aria-hidden="true">
                        <path d="${item.stroke}"></path>
                        ${item.extra}
                      </svg>
                      <div class="absolute inset-0 bg-linear-to-t from-gofarm-light-green/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-2xl"></div>
                    </div>
                  </div>
                  <div class="text-center space-y-2">
                    <h3 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect">${item.title}</h3>
                    <p class="text-sm text-gofarm-gray leading-relaxed">${item.description}</p>
                    <div class="text-xs text-gofarm-green font-medium pt-2 opacity-0 group-hover:opacity-100 hoverEffect">Click to learn more →</div>
                  </div>
                  <div class="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                    <div class="bg-linear-to-r from-gofarm-green to-gofarm-light-green h-1.5 rounded-full hoverEffect group-hover:w-full transition-all duration-500" style="width:40%"></div>
                  </div>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function shopByBrandsMarkup() {
  const brands = [
    { slug: "food-and-beverages", title: "Food and Beverages", imageSrc: "/images/8b1901ec414cff437ab97ea2c12c8ba8274e762d-123x27.svg", animation: 0 },
    { slug: "cookings-mart", title: "Cookings Mart", imageSrc: "/images/e1a2df40d7f60feadddd8a7bfbd4737bfc2f9909-111x39.svg", animation: 0.05 },
    { slug: "best-cook-limited", title: "Best Cook Limited", imageSrc: "/images/9561f6ba004581c48558aced951df3c440f65a88-114x23.svg", animation: 0.1 },
    { slug: "marcies-limited", title: "Marcies Limited", imageSrc: "/images/f0dade62693de589e6b31b3b78f7961e18fcb544-101x56.svg", animation: 0.15 },
    { slug: "skialist", title: "Skialist Co.", imageSrc: "/images/f8dea3288dd59d6083fe52232f7067bb5869716f-114x30.svg", animation: 0.2 },
    { slug: "grill-and-bar", title: "Grill & Bar", imageSrc: "/images/87b50f653bde2307c8915328498dcbb4980f0d23-124x18.svg", animation: 0.25 },
    { slug: "krungthep", title: "KrungThep", imageSrc: "/images/2acc7961a610818789702c45954027d4ee64bd1b-139x22.svg", animation: 0.3 },
    { slug: "best-food-co", title: "Best Food Co.", imageSrc: "/images/a7671aaf24b80ad02c7db6cc091c95758c40fff3-99x26.svg", animation: 0.35 },
    { slug: "colas-mart", title: "Colas Mart", imageSrc: "/images/3df64e2b09ed8c4c51fffa2105a56213083f0db0-102x33.svg", animation: 0.4 },
    { slug: "cook-me-live", title: "Cook Me Live", imageSrc: "/images/8e79c2fcd6497d6f0e6e8710cc8742f3a50d7592-81x31.svg", animation: 0.45 },
    { slug: "topolis-limited", title: "Topolis Limited", imageSrc: "/images/8b9d5666aefcb54ee9f17814cf49cba7dfc75c0e-111x21.svg", animation: 0.5 },
    { slug: "let-s-cook", title: "Let's Cook", imageSrc: "/images/40306d47c21769c7b88530ba7debd84f4dccfeb4-118x29.svg", animation: 0.55 },
  ];

  return `
    <div class="w-full bg-gofarm-light-gray py-16">
      <div class="max-w-(--breakpoint-xl) mx-auto px-4">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="h-1 w-12 bg-linear-to-r from-gofarm-orange to-gofarm-light-orange rounded-full"></div>
            <h2 class="text-3xl lg:text-4xl font-bold text-gofarm-black">Shop By Brands</h2>
            <div class="h-1 w-12 bg-linear-to-l from-gofarm-orange to-gofarm-light-orange rounded-full"></div>
          </div>
          <p class="text-gofarm-gray text-lg max-w-2xl mx-auto">Discover products from your favorite trusted brands</p>
          <a class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gofarm-light-orange text-gofarm-green font-semibold rounded-full hover:bg-gofarm-orange hover:text-white border-2 border-gofarm-orange hoverEffect" href="/shop">
            Explore All Brands
            <svg class="w-4 h-4 hoverEffect group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
        <div class="bg-linear-to-br from-gray-50 via-white to-gofarm-light-orange p-8 lg:p-12 rounded-3xl shadow-xl border border-gofarm-light-green/20 mb-16">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-6">
            ${brands
              .map(
                (brand) => `
                  <a class="group bg-white rounded-2xl p-6 flex items-center justify-center aspect-square hover:shadow-2xl shadow-lg border border-gray-100 hover:border-gofarm-orange hoverEffect transform hover:-translate-y-2" style="animation-delay:${brand.animation}s" href="/shop?brand=${encodeURIComponent(brand.slug)}">
                    <div class="relative w-full h-full flex items-center justify-center">
                      <img alt="${escapeHtml(brand.title)} logo" loading="lazy" width="120" height="80" class="max-w-full max-h-full object-contain group-hover:scale-110 hoverEffect filter group-hover:brightness-110" style="color:transparent" src="${brand.imageSrc}">
                      <div class="absolute inset-0 bg-linear-to-t from-gofarm-orange/5 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-xl"></div>
                    </div>
                  </a>
                `
              )
              .join("")}
          </div>
          <div class="text-center mt-8 pt-6 border-t border-gofarm-light-green/20">
            <p class="text-dark-text text-sm"><span class="font-semibold text-gofarm-orange">12+</span> trusted brands and counting</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default async function HomePage() {
  const bodyHtml = await readOriginalBody();
  const { products: allProducts, categories } = await loadLocalCatalog();
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
      (p) => p.categoryTitle?.toLowerCase() === "vegetables" || 
      /vegetable|tomato|potato|onion|cabbage|carrot|broccoli|lettuce/i.test(p.name)
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

  const products = allProducts.filter(p => !usedSlugs.has(p.slug)).slice(0, 15);
  const popularCategories = [...categories]
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count);
  
  const productGridMarkup = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      ${products.map(enhancedProductCardHtml).join("")}
    </div>
  `;
  
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
  const spicesMarkup = enhancedSectionCarouselHtml({
    title: "Spices & Herbs",
    href: "/shop",
    products: spicesProducts,
    productCount: spicesProducts.length,
  });

  let transformedBody = bodyHtml.replace(/0(?:<!-- -->)? products/g, `${products.length} products`);

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
      spicesMarkup +
      `<div class="pt-8">${productGridMarkup}</div>` +
      transformedBody.slice(nextSectionStart);
  }

  {
    const blogTitle = "Latest Blog Posts";
    const blogEndText = "Discover more insights and stories in our blog section";
    const blogEndMarker = "<!--$--><!--/$--><!--/$-->";
    const blogTitleIndex = transformedBody.indexOf(blogTitle);
    if (blogTitleIndex >= 0) {
      const blogStart = transformedBody.lastIndexOf(
        '<div class="max-w-(--breakpoint-xl) mx-auto px-4 mt-16 lg:mt-24">',
        blogTitleIndex
      );
      const blogEndTextIndex = transformedBody.indexOf(blogEndText, blogTitleIndex);
      const blogEndMarkerIndex =
        blogEndTextIndex >= 0
          ? transformedBody.indexOf(blogEndMarker, blogEndTextIndex)
          : transformedBody.indexOf(blogEndMarker, blogTitleIndex);

      if (blogStart >= 0 && blogEndMarkerIndex >= 0) {
        transformedBody =
          transformedBody.slice(0, blogStart) +
          transformedBody.slice(blogEndMarkerIndex + blogEndMarker.length);
      }
    }
  }
  {
    const emptyPlaceholderSection = /<section class="py-16 lg:py-20 bg-linear-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">\s*<div class="absolute inset-0 bg-grid-slate-100 \[mask-image:linear-linear\(0deg,white,rgba\(255,255,255,0\.6\)\)\] bg-\[size:32px_32px\]">\s*<\/div>\s*<div class="container mx-auto px-4 relative">\s*<div class="text-center mb-12">\s*<div class="h-10 bg-gray-200 rounded-xl w-80 mx-auto mb-4 animate-pulse"><\/div>\s*<div class="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"><\/div>\s*<\/div>\s*<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\s*<div class="h-64 bg-white\/50 rounded-2xl animate-pulse border border-gray-100"><\/div>\s*<div class="h-64 bg-white\/50 rounded-2xl animate-pulse border border-gray-100"><\/div>\s*<div class="h-64 bg-white\/50 rounded-2xl animate-pulse border border-gray-100"><\/div>\s*<\/div>\s*<\/div>\s*<\/section>/i;
    transformedBody = transformedBody.replace(emptyPlaceholderSection, "");
  }
  transformedBody = `<style>
    section.py-16.lg\\:py-20.bg-linear-to-br.from-emerald-50.via-white.to-green-50.relative.overflow-hidden {
      display: none !important;
    }
  </style>` + transformedBody;
  transformedBody = transformedBody.replace(
    /<a href="\/sign-up">\s*<button[\s\S]*?Become a Vendor[\s\S]*?<\/button>\s*<\/a>/gi,
    `<a href="/contact" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-4 bg-gofarm-green hover:bg-gofarm-green/90 text-white font-semibold px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">Become a Vendor</a>`
  );

  transformedBody = transformedBody.replace(
    /<a href="\/vendor-info">\s*<button[\s\S]*?Learn More[\s\S]*?<\/button>\s*<\/a>/i,
    `<a href="/contact" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-[>svg]:px-4 border-2 border-gofarm-green text-gofarm-green hover:bg-gofarm-green/5 font-semibold px-8 h-12 rounded-xl w-full sm:w-auto">Learn More</a>`
  );

  // Cách thay thế đơn giản hơn (dự phòng nếu regex không match)
  transformedBody = transformedBody.replace(/href="\/sign-up"/g, 'href="/contact"');
  transformedBody = transformedBody.replace(/href="\/vendor-info"/g, 'href="/contact"');

  // Đảm bảo tất cả link "View More" đều về /shop
  transformedBody = transformedBody.replace(/href="\/category\/vegetables"/g, 'href="/shop"');
  transformedBody = transformedBody.replace(/href="\/collection"/g, 'href="/shop"');

  // XÓA TẤT CẢ floating button cũ (có class chứa bottom-6)
  transformedBody = transformedBody.replace(
    /<a[^>]*class="[^"]*bottom-6[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    ""
  );

  // THÊM floating button mới (giữ hiệu ứng hover từ xanh sang vàng)
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

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: transformedBody }} suppressHydrationWarning />
      <ProductGridClient products={allProducts} />
      <ProductShareHandler products={allProducts} />
    </>
  );
}

