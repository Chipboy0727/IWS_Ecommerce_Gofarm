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
<<<<<<< HEAD
  
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
=======
  const withoutPromoBanner = body.replace(
    /<div class="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">[\s\S]*?<\/div><div class="border-b border-gofarm-light-gray">/,
    '<div class="border-b border-gofarm-light-gray">'
>>>>>>> c3af2340ffa65f6a5a79fe54fa70f6b87f59c6f7
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

// HTML fallback cho Why Shop With Us
const whyShopHtml = `
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
      <!-- Secure Shopping -->
      <button class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gofarm-light-green hoverEffect transform hover:-translate-y-2 cursor-pointer text-left w-full" style="animation-delay:0s">
        <div class="flex justify-center mb-5">
          <div class="relative w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:shadow-lg hoverEffect">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check w-8 h-8 text-blue-600 group-hover:scale-110 hoverEffect"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <div class="absolute inset-0 bg-linear-to-t from-gofarm-light-green/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-2xl"></div>
          </div>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect">Secure Shopping</h3>
          <p class="text-sm text-gofarm-gray leading-relaxed">100% secure payment with SSL encryption</p>
        </div>
      </button>
      <!-- Free Delivery -->
      <button class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gofarm-light-green hoverEffect transform hover:-translate-y-2 cursor-pointer text-left w-full" style="animation-delay:0.05s">
        <div class="flex justify-center mb-5">
          <div class="relative w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center group-hover:shadow-lg hoverEffect">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck w-8 h-8 text-green-600 group-hover:scale-110 hoverEffect"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
            <div class="absolute inset-0 bg-linear-to-t from-gofarm-light-green/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-2xl"></div>
          </div>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect">Free Delivery</h3>
          <p class="text-sm text-gofarm-gray leading-relaxed">Free shipping on orders over $50</p>
        </div>
      </button>
      <!-- Easy Payments -->
      <button class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gofarm-light-green hoverEffect transform hover:-translate-y-2 cursor-pointer text-left w-full" style="animation-delay:0.1s">
        <div class="flex justify-center mb-5">
          <div class="relative w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:shadow-lg hoverEffect">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card w-8 h-8 text-purple-600 group-hover:scale-110 hoverEffect"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
            <div class="absolute inset-0 bg-linear-to-t from-gofarm-light-green/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-2xl"></div>
          </div>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect">Easy Payments</h3>
          <p class="text-sm text-gofarm-gray leading-relaxed">Multiple payment options available</p>
        </div>
      </button>
      <!-- 24/7 Support -->
      <button class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gofarm-light-green hoverEffect transform hover:-translate-y-2 cursor-pointer text-left w-full" style="animation-delay:0.15s">
        <div class="flex justify-center mb-5">
          <div class="relative w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:shadow-lg hoverEffect">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones w-8 h-8 text-orange-600 group-hover:scale-110 hoverEffect"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg>
            <div class="absolute inset-0 bg-linear-to-t from-gofarm-light-green/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-2xl"></div>
          </div>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect">24/7 Support</h3>
          <p class="text-sm text-gofarm-gray leading-relaxed">Dedicated customer support anytime</p>
        </div>
      </button>
    </div>
    <div class="mt-12 pt-8 border-t border-gofarm-light-green/20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center"><div class="text-3xl font-bold bg-linear-to-r from-gofarm-green to-gofarm-light-green bg-clip-text text-transparent mb-2">50K+</div><div class="text-sm text-gofarm-gray font-medium">Happy Customers</div></div>
        <div class="text-center"><div class="text-3xl font-bold bg-linear-to-r from-gofarm-green to-gofarm-light-green bg-clip-text text-transparent mb-2">100K+</div><div class="text-sm text-gofarm-gray font-medium">Products Sold</div></div>
        <div class="text-center"><div class="text-3xl font-bold bg-linear-to-r from-gofarm-green to-gofarm-light-green bg-clip-text text-transparent mb-2">99%</div><div class="text-sm text-gofarm-gray font-medium">Satisfaction Rate</div></div>
        <div class="text-center"><div class="text-3xl font-bold bg-linear-to-r from-gofarm-green to-gofarm-light-green bg-clip-text text-transparent mb-2">24/7</div><div class="text-sm text-gofarm-gray font-medium">Customer Support</div></div>
      </div>
    </div>
  </div>
</div>
`;

// HTML fallback cho Shop By Brands
const brandsGridHtml = `
<div class="w-full bg-gofarm-light-gray py-16">
  <div class="max-w-(--breakpoint-xl) mx-auto px-4">
    <div class="text-center mb-12">
      <div class="inline-flex items-center gap-3 mb-4">
        <div class="h-1 w-12 bg-linear-to-r from-gofarm-orange to-gofarm-light-orange rounded-full"></div>
        <h2 class="text-3xl lg:text-4xl font-bold text-gofarm-black">Shop By Brands</h2>
        <div class="h-1 w-12 bg-linear-to-l from-gofarm-orange to-gofarm-light-orange rounded-full"></div>
      </div>
      <p class="text-gofarm-gray text-lg max-w-2xl mx-auto">Discover products from your favorite trusted brands</p>
      <a class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gofarm-light-orange text-gofarm-green font-semibold rounded-full hover:bg-gofarm-orange hover:text-white border-2 border-gofarm-orange hoverEffect" href="/shop">Explore All Brands
        <svg class="w-4 h-4 hoverEffect group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </a>
    </div>
    <div class="bg-linear-to-br from-gray-50 via-white to-gofarm-light-orange p-8 lg:p-12 rounded-3xl shadow-xl border border-gofarm-light-green/20 mb-16">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-6">
        <!-- Brand logos -->
        <div class="group bg-white rounded-2xl p-6 flex items-center justify-center aspect-square hover:shadow-2xl shadow-lg border border-gray-100 hover:border-gofarm-orange hoverEffect transform hover:-translate-y-2">
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="text-center text-gofarm-green font-semibold">Brand 1</div>
          </div>
        </div>
        <div class="group bg-white rounded-2xl p-6 flex items-center justify-center aspect-square hover:shadow-2xl shadow-lg border border-gray-100 hover:border-gofarm-orange hoverEffect transform hover:-translate-y-2">
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="text-center text-gofarm-green font-semibold">Brand 2</div>
          </div>
        </div>
        <div class="group bg-white rounded-2xl p-6 flex items-center justify-center aspect-square hover:shadow-2xl shadow-lg border border-gray-100 hover:border-gofarm-orange hoverEffect transform hover:-translate-y-2">
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="text-center text-gofarm-green font-semibold">Brand 3</div>
          </div>
        </div>
        <div class="group bg-white rounded-2xl p-6 flex items-center justify-center aspect-square hover:shadow-2xl shadow-lg border border-gray-100 hover:border-gofarm-orange hoverEffect transform hover:-translate-y-2">
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="text-center text-gofarm-green font-semibold">Brand 4</div>
          </div>
        </div>
        <div class="group bg-white rounded-2xl p-6 flex items-center justify-center aspect-square hover:shadow-2xl shadow-lg border border-gray-100 hover:border-gofarm-orange hoverEffect transform hover:-translate-y-2">
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="text-center text-gofarm-green font-semibold">Brand 5</div>
          </div>
        </div>
        <div class="group bg-white rounded-2xl p-6 flex items-center justify-center aspect-square hover:shadow-2xl shadow-lg border border-gray-100 hover:border-gofarm-orange hoverEffect transform hover:-translate-y-2">
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="text-center text-gofarm-green font-semibold">Brand 6</div>
          </div>
        </div>
      </div>
      <div class="text-center mt-8 pt-6 border-t border-gofarm-light-green/20">
        <p class="text-dark-text text-sm"><span class="font-semibold text-gofarm-orange">12+</span> trusted brands and counting</p>
      </div>
    </div>
  </div>
</div>
`;

// HTML fallback cho Why Choose Us
const whyChooseHtml = `
<div class="bg-white rounded-3xl shadow-xl border border-gofarm-light-green/10 p-8 lg:p-12">
  <div class="text-center mb-10">
    <h3 class="text-2xl lg:text-3xl font-bold text-gofarm-black mb-3">Why Choose Us?</h3>
    <p class="text-gofarm-gray text-lg">We provide the best shopping experience with premium services</p>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <div class="group text-center p-6 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gofarm-light-green/10 hover:border-gofarm-orange/30 hover:shadow-lg hoverEffect">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-gofarm-light-orange to-gofarm-light-orange/20 text-gofarm-orange group-hover:from-gofarm-orange group-hover:to-gofarm-light-orange group-hover:text-white group-hover:scale-110 hoverEffect mb-4">
        <span class="transform group-hover:scale-110 hoverEffect">
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
        </span>
      </div>
      <div>
        <h4 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect mb-2">Free Delivery</h4>
        <p class="text-gofarm-gray text-sm leading-relaxed">Free shipping over $100</p>
      </div>
    </div>
    <div class="group text-center p-6 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gofarm-light-green/10 hover:border-gofarm-orange/30 hover:shadow-lg hoverEffect">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-gofarm-light-orange to-gofarm-light-orange/20 text-gofarm-orange group-hover:from-gofarm-orange group-hover:to-gofarm-light-orange group-hover:text-white group-hover:scale-110 hoverEffect mb-4">
        <span class="transform group-hover:scale-110 hoverEffect">
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-compare-arrows"><circle cx="5" cy="6" r="3"></circle><path d="M12 6h5a2 2 0 0 1 2 2v7"></path><path d="m15 9-3-3 3-3"></path><circle cx="19" cy="18" r="3"></circle><path d="M12 18H7a2 2 0 0 1-2-2V9"></path><path d="m9 15 3 3-3 3"></path></svg>
        </span>
      </div>
      <div>
        <h4 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect mb-2">Free Return</h4>
        <p class="text-gofarm-gray text-sm leading-relaxed">Free shipping over $100</p>
      </div>
    </div>
    <div class="group text-center p-6 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gofarm-light-green/10 hover:border-gofarm-orange/30 hover:shadow-lg hoverEffect">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-gofarm-light-orange to-gofarm-light-orange/20 text-gofarm-orange group-hover:from-gofarm-orange group-hover:to-gofarm-light-orange group-hover:text-white group-hover:scale-110 hoverEffect mb-4">
        <span class="transform group-hover:scale-110 hoverEffect">
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headset"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"></path><path d="M21 16v2a4 4 0 0 1-4 4h-5"></path></svg>
        </span>
      </div>
      <div>
        <h4 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect mb-2">Customer Support</h4>
        <p class="text-gofarm-gray text-sm leading-relaxed">Friendly 24/7 customer support</p>
      </div>
    </div>
    <div class="group text-center p-6 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gofarm-light-green/10 hover:border-gofarm-orange/30 hover:shadow-lg hoverEffect">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-gofarm-light-orange to-gofarm-light-orange/20 text-gofarm-orange group-hover:from-gofarm-orange group-hover:to-gofarm-light-orange group-hover:text-white group-hover:scale-110 hoverEffect mb-4">
        <span class="transform group-hover:scale-110 hoverEffect">
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
        </span>
      </div>
      <div>
        <h4 class="text-lg font-bold text-gofarm-black group-hover:text-gofarm-green hoverEffect mb-2">Money Back guarantee</h4>
        <p class="text-gofarm-gray text-sm leading-relaxed">Quality checked by our team</p>
      </div>
    </div>
  </div>
  <div class="text-center mt-10 pt-8 border-t border-gofarm-light-green/20">
    <div class="inline-flex items-center gap-4 px-8 py-4 bg-linear-to-r from-gofarm-light-orange to-gray-50 rounded-2xl border border-gofarm-orange/20">
      <div class="w-2 h-2 bg-gofarm-orange rounded-full animate-pulse"></div>
      <span class="text-dark-text font-medium">Trusted by thousands of customers worldwide</span>
      <div class="w-2 h-2 bg-gofarm-orange rounded-full animate-pulse"></div>
    </div>
  </div>
</div>
`;

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

  const footerRegex = /<footer class="bg-gofarm-white border-t border-gofarm-light-gray mt-10">/i;
  const footerMatch = transformedBody.slice(nextSectionStart).match(footerRegex);
  const footerStart = footerMatch ? nextSectionStart + footerMatch.index! : transformedBody.length;

  if (
    featuredSectionStart >= 0 &&
    skeletonStart >= 0 &&
    filtersStart >= 0 &&
    emptyStateStart >= 0 &&
    nextSectionStart > emptyStateStart
  ) {
    const titleBlock = transformedBody.slice(featuredSectionStart, skeletonStart);
    const remainingContent = transformedBody.slice(nextSectionStart, footerStart);

    // Kiểm tra nếu remainingContent không có 3 phần thì thêm fallback
    let finalContent = remainingContent;
    if (!remainingContent.includes("Why Shop With Us")) {
      finalContent = whyShopHtml + brandsGridHtml + whyChooseHtml;
    }

    transformedBody =
      transformedBody.slice(0, featuredSectionStart) +
      titleBlock +
      vegetableMarkup +
      fruitsMarkup +
      juicesMarkup +
      drinksMarkup +
      `<div class="pt-8">${productGridMarkup}</div>` +
      finalContent +
      transformedBody.slice(footerStart);
  } else {
    // Nếu regex không match, vẫn thêm fallback
    transformedBody = transformedBody + whyShopHtml + brandsGridHtml + whyChooseHtml;
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

  transformedBody = transformedBody.replace(/href="\/sign-up"/g, 'href="/contact"');
  transformedBody = transformedBody.replace(/href="\/vendor-info"/g, 'href="/contact"');
  transformedBody = transformedBody.replace(/href="\/category\/vegetables"/g, 'href="/shop"');
  transformedBody = transformedBody.replace(/href="\/collection"/g, 'href="/shop"');

  transformedBody = transformedBody.replace(
    /<a target="_blank" rel="noopener noreferrer" class="fixed bottom-6 right-20 z-50 group" href="https:\/\/buymeacoffee\.com\/reactbd\/e\/484104">[\s\S]*?<\/a>(?=<section aria-label="Notifications alt\+T")/,
    ""
  );

<<<<<<< HEAD
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
=======
  return <div dangerouslySetInnerHTML={{ __html: transformedBody }} />;
}
>>>>>>> c3af2340ffa65f6a5a79fe54fa70f6b87f59c6f7
