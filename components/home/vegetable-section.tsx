import type { LocalProduct } from "@/lib/local-catalog";
import { productCardHtml } from "@/components/home/product-card";

type SectionCarouselProps = {
  title: string;
  href: string;
  products: LocalProduct[];
  productCount: number;
};

export function sectionCarouselHtml({ title, href, products, productCount }: SectionCarouselProps) {
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
          onclick="(function(el){if(el){el.scrollBy({left:-el.clientWidth,behavior:'smooth'})}})(document.getElementById('veg-carousel'))"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          class="absolute right-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green"
          aria-label="Next products"
          onclick="(function(el){if(el){el.scrollBy({left:el.clientWidth,behavior:'smooth'})}})(document.getElementById('veg-carousel'))"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div id="veg-carousel" class="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-20 pr-16">
          <div class="pb-2" style="display:grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 64px) / 5); gap: 16px;">
            ${items
              .map(
                (product, index) => `
                  <div id="veg-item-${index}" class="snap-start">
                    <a href="/shop/${product.slug}" class="block">
                      ${productCardHtml(product)}
                    </a>
                  </div>
                `
              )
              .join("")}
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

export function vegetableSectionHtml(products: LocalProduct[], productCount: number) {
  return sectionCarouselHtml({
    title: "Vegetables",
    href: "/shop",
    products,
    productCount,
  });
}

export function VegetableSection({ products, productCount }: { products: LocalProduct[]; productCount: number }) {
  return <div dangerouslySetInnerHTML={{ __html: vegetableSectionHtml(products, productCount) }} />;
}