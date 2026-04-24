"use client";

import { useEffect } from "react";
import type { LocalProduct } from "@/lib/local-catalog";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function renderProductCard(product: LocalProduct) {
  const salePrice =
    product.discount && product.discount > 0
      ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
      : product.price;

  const badge = product.status ?? (product.discount ? `${product.discount}% off` : "Featured");

  return `
    <article class="group overflow-hidden rounded-2xl border border-gofarm-light-green/15 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div class="relative h-52 overflow-hidden bg-white flex items-center justify-center p-4">
        <img
          src="${escapeHtml(product.imageSrc)}"
          alt="${escapeHtml(product.imageAlt)}"
          class="max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute left-4 top-4 rounded-full bg-gofarm-green px-3 py-1 text-xs font-semibold text-white shadow">
          ${escapeHtml(badge)}
        </div>
      </div>
      <div class="space-y-3 p-5">
        <div class="flex items-center justify-between gap-3 text-xs font-medium text-gofarm-gray">
          <span>${escapeHtml(product.brand ?? "Sanity import")}</span>
          <span>${product.stock !== null ? `${product.stock} in stock` : "In stock"}</span>
        </div>
        <h3 class="line-clamp-2 min-h-[3rem] text-lg font-semibold text-gofarm-black">${escapeHtml(product.name)}</h3>
        <p class="line-clamp-2 text-sm leading-6 text-gofarm-gray">${escapeHtml(product.description)}</p>
        <div class="flex items-end justify-between gap-4 pt-1">
          <div>
            <div class="text-xl font-bold text-gofarm-green">${formatPrice(salePrice)}</div>
            ${
              product.discount && product.discount > 0
                ? `<div class="text-sm text-gofarm-gray line-through">${formatPrice(product.price)}</div>`
                : ""
            }
          </div>
          <div class="flex items-center gap-1 text-sm text-gofarm-orange">
            <span>★</span>
            <span class="font-semibold text-gofarm-black">${product.rating.toFixed(1)}</span>
            <span class="text-gofarm-gray">(${product.reviews})</span>
          </div>
        </div>
        <a href="/shop/${escapeHtml(product.slug)}" class="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gofarm-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gofarm-light-green">
          View product
        </a>
      </div>
    </article>
  `;
}

export default function LocalProductPatcher({
  products,
}: {
  products: LocalProduct[];
}) {
  useEffect(() => {
    const patch = () => {
      const skeleton = document.querySelector("div.space-y-6.mb-12");

      if (skeleton && products.length > 0) {
        const cardsHtml = products.slice(0, 8).map(renderProductCard).join("");
        const grid = document.createElement("div");
        grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12";
        grid.innerHTML = cardsHtml;
        skeleton.replaceWith(grid);
      } else if (products.length > 0) {
        const heading = Array.from(document.querySelectorAll("h2")).find((node) =>
          node.textContent?.includes("Featured Products")
        );
        const wrapper = heading?.closest("section, div");
        if (wrapper && !wrapper.querySelector(".gofarm-local-products")) {
          const grid = document.createElement("div");
          grid.className = "gofarm-local-products grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12";
          grid.innerHTML = products.slice(0, 8).map(renderProductCard).join("");
          wrapper.appendChild(grid);
        }
      }

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.nodeValue?.includes("0 products")) {
          node.nodeValue = node.nodeValue.replace("0 products", `${products.length} products`);
        }
      }
    };

    patch();
    const timer = window.setTimeout(patch, 500);
    return () => window.clearTimeout(timer);
  }, [products]);

  return null;
}
