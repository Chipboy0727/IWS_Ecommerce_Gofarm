module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/local-catalog.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadLocalCatalog",
    ()=>loadLocalCatalog
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
;
;
const DEFAULT_SEED_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(process.cwd(), "..", "gofarm-yt-main (1)", "gofarm-yt-main", "server", "seed", "production-export-2025-11-30t08-28-44-763z");
function resolveSeedDir() {
    return process.env.GOFARM_SEED_DIR ? __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(process.env.GOFARM_SEED_DIR) : DEFAULT_SEED_DIR;
}
function resolveImageSrc(image, assets) {
    const sanityAsset = image?._sanityAsset ?? "";
    const fileMatch = sanityAsset.match(/\.\/images\/([^"\]]+)/i);
    if (fileMatch?.[1]) {
        return `/images/${fileMatch[1]}`;
    }
    const filenameMatch = sanityAsset.match(/\/([^/]+\.(?:png|jpe?g|webp|svg|gif))$/i);
    if (filenameMatch?.[1]) {
        return `/images/${filenameMatch[1]}`;
    }
    if (assets) {
        for (const asset of Object.values(assets)){
            if (!asset.sha1hash) continue;
            const originalFilename = asset.originalFilename;
            if (originalFilename && sanityAsset.includes(asset.sha1hash)) {
                return `/images/${originalFilename}`;
            }
        }
    }
    return "/images/logo.svg";
}
async function loadLocalCatalog() {
    const seedDir = resolveSeedDir();
    const ndjsonPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(seedDir, "data.ndjson");
    const assetsPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(seedDir, "assets.json");
    const [ndjsonRaw, assetsRaw] = await Promise.all([
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].readFile(ndjsonPath, "utf8").catch(()=>""),
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].readFile(assetsPath, "utf8").catch(()=>"{}")
    ]);
    const assets = JSON.parse(assetsRaw);
    const documents = ndjsonRaw.split(/\r?\n/).map((line)=>line.trim()).filter(Boolean).map((line)=>JSON.parse(line));
    const brands = new Map(documents.filter((doc)=>doc._type === "brand" && doc._id).map((doc)=>[
            doc._id,
            doc.name ?? "Brand"
        ]));
    const categories = new Map(documents.filter((doc)=>doc._type === "category" && doc._id).map((doc)=>[
            doc._id,
            {
                id: doc._id,
                title: doc.title ?? "Category",
                slug: doc.slug?.current ?? "",
                imageSrc: resolveImageSrc(doc.image, assets),
                count: 0
            }
        ]));
    const products = documents.filter((doc)=>doc._type === "product").sort((a, b)=>{
        const featuredA = Number(Boolean(a.isFeatured));
        const featuredB = Number(Boolean(b.isFeatured));
        if (featuredA !== featuredB) return featuredB - featuredA;
        const createdA = a._createdAt ? Date.parse(a._createdAt) : 0;
        const createdB = b._createdAt ? Date.parse(b._createdAt) : 0;
        return createdB - createdA;
    }).map((doc)=>{
        const brandRef = doc.brand?._ref ?? null;
        const categoryRef = doc.categories?.[0]?._ref ?? null;
        const category = categoryRef ? categories.get(categoryRef) : null;
        const image = doc.images?.[0];
        const imageSrc = resolveImageSrc(image, assets);
        return {
            id: doc._id ?? doc.slug?.current ?? doc.name ?? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
            name: doc.name ?? "Unnamed product",
            slug: doc.slug?.current ?? "",
            imageSrc,
            imageAlt: doc.name ?? "Product image",
            price: typeof doc.price === "number" ? doc.price : 0,
            discount: typeof doc.discount === "number" ? doc.discount : null,
            brand: brandRef ? brands.get(brandRef) ?? brandRef : null,
            categoryId: categoryRef,
            categoryTitle: category?.title ?? null,
            description: doc.description ?? "",
            rating: typeof doc.averageRating === "number" ? doc.averageRating : 0,
            reviews: typeof doc.totalReviews === "number" ? doc.totalReviews : 0,
            stock: typeof doc.stock === "number" ? doc.stock : null,
            status: doc.status ?? null
        };
    });
    const categoryCounts = new Map();
    for (const product of products){
        if (!product.categoryId) continue;
        categoryCounts.set(product.categoryId, (categoryCounts.get(product.categoryId) ?? 0) + 1);
    }
    const categoryList = Array.from(categories.values()).map((category)=>({
            ...category,
            count: categoryCounts.get(category.id) ?? 0
        }));
    return {
        products,
        categories: categoryList
    };
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/local-catalog.ts [app-rsc] (ecmascript)");
;
;
;
;
async function readOriginalBody() {
    const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "index.html");
    const html = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].readFile(filePath, "utf8");
    const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const body = match?.[1] ?? html;
    return body.replace(/<link rel="preload" as="script" fetchpriority="low" href="\/_next\/static\/chunks\/([^"?]+)(?:\?[^"]*)?">/g, '<link rel="preload" as="script" fetchpriority="low" href="/js/$1">');
}
function escapeHtml(input) {
    return input.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function slugify(input) {
    return input.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function formatCategoryLabel(slug) {
    return slug.split("-").map((part)=>part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
    }).format(price);
}
function renderProductCard(product) {
    const salePrice = product.discount && product.discount > 0 ? Math.max(0, product.price - Math.round(product.price * product.discount / 100)) : product.price;
    const stars = Array.from({
        length: 5
    }, (_, index)=>index < Math.round(product.rating));
    const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
    return `
    <article class="group rounded-[10px] border border-gray-200 bg-white overflow-hidden shadow-[0_1px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div class="relative h-[330px] bg-white flex items-center justify-center overflow-hidden px-4 pt-4">
        <div class="absolute left-3 top-3 z-10 flex flex-col gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gofarm-green text-white shadow">${escapeHtml(status)}</span>
          ${product.discount ? `<span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow">-${product.discount}%</span>` : ""}
        </div>
        <img
          src="${escapeHtml(product.imageSrc)}"
          alt="${escapeHtml(product.imageAlt)}"
          class="max-h-[240px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_22px_22px_rgba(0,0,0,0.08)]"
          loading="lazy"
        >
      </div>
      <div class="px-4 pb-4 pt-2">
        <h4 class="text-[17px] font-bold text-gofarm-black leading-tight mb-1 line-clamp-1">${escapeHtml(product.name)}</h4>
        <div class="flex items-center gap-1 text-[12px] leading-none">
          ${stars.map((active)=>`<span class="${active ? "text-yellow-400" : "text-gray-300"}">&#9733;</span>`).join("")}
          <span class="ml-1 text-gofarm-gray">(${product.reviews})</span>
        </div>
        <div class="flex items-end gap-2 mt-2 mb-4 flex-wrap">
          <span class="text-[22px] font-bold text-gofarm-green leading-none">${formatPrice(salePrice)}</span>
          ${product.discount ? `<span class="text-[18px] font-semibold text-gray-500 line-through leading-none">${formatPrice(product.price)}</span>` : ""}
          ${product.discount ? `<span class="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">-${product.discount}%</span>` : ""}
        </div>
        <button class="w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-gofarm-light-green/35 bg-white px-4 py-3 text-[15px] font-semibold text-gofarm-black transition-all duration-200 hover:border-gofarm-green hover:bg-gofarm-light-orange/10">
          <span>&#128722;</span>
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  `;
}
async function HomePage() {
    const bodyHtml = await readOriginalBody();
    const catalog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loadLocalCatalog"])();
    const products = catalog.products.slice(0, 13);
    const productCards = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      ${products.map(renderProductCard).join("")}
    </div>
  `;
    let transformedBody = bodyHtml.replace(/0(?:<!-- -->)? products/g, `${products.length} products`);
    const featuredSectionStart = transformedBody.indexOf('<div><div class="max-w-(--breakpoint-xl) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">');
    const skeletonStart = featuredSectionStart >= 0 ? transformedBody.indexOf('<div class="space-y-6 mb-12">', featuredSectionStart) : -1;
    const filtersStart = featuredSectionStart >= 0 ? transformedBody.indexOf('<div class="bg-gofarm-white rounded-2xl shadow-lg border border-gofarm-light-green/20 p-6 mb-8">', featuredSectionStart) : -1;
    const emptyStateStart = filtersStart >= 0 ? transformedBody.indexOf('<div class="flex flex-col items-center justify-center py-16 min-h-80 space-y-8 text-center bg-linear-to-br from-gray-50/50 to-white rounded-xl border border-gray-200/50 w-full">', filtersStart) : -1;
    const nextSectionStart = emptyStateStart >= 0 ? transformedBody.indexOf('<section class="py-16 lg:py-20 bg-linear-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">', emptyStateStart) : -1;
    if (featuredSectionStart >= 0 && skeletonStart >= 0 && filtersStart >= 0 && emptyStateStart >= 0 && nextSectionStart > emptyStateStart) {
        const titleBlock = transformedBody.slice(featuredSectionStart, skeletonStart);
        const filtersBlock = transformedBody.slice(filtersStart, emptyStateStart);
        const vegetableBlock = `
      <div class="bg-gofarm-white rounded-2xl shadow-lg border border-gofarm-light-green/20 p-6 mb-8">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <h3 class="text-2xl font-bold text-gofarm-black">Vegetables</h3>
            <span class="inline-flex items-center rounded-full bg-gofarm-light-orange/40 px-4 py-2 text-sm font-semibold text-gofarm-green">10 Products</span>
          </div>
          <a class="inline-flex items-center gap-2 text-gofarm-green font-semibold hover:text-gofarm-light-green transition-colors duration-200" href="/category/vegetables">
            <span>View More</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div class="border-t border-gofarm-light-gray pt-8">
          ${productCards}
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
        transformedBody = transformedBody.slice(0, featuredSectionStart) + titleBlock + vegetableBlock + filtersBlock + `<div class="pt-8">${productCards}</div>` + transformedBody.slice(nextSectionStart);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        dangerouslySetInnerHTML: {
            __html: transformedBody
        }
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 177,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0samj6n._.js.map