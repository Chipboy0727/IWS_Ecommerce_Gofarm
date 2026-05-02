"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
import { ProductModal } from "@/components/product-modal";

function ToastMessage({ productName, onClose }: { productName: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div data-cart-toast className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-gofarm-green text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{productName} added to cart!</span>
      </div>
    </div>
  );
}

export function ProductGridClient({ products }: { products: any[] }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastProductName, setToastProductName] = useState("");

  useEffect(() => {
    const carouselAnimations = new WeakMap<HTMLElement, number>();

    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("gofarm_cart") || "[]");
        const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        const cartBadges = document.querySelectorAll(".absolute.-top-1.-right-1");
        cartBadges.forEach((badge) => {
          if (badge.textContent !== undefined) {
            badge.textContent = totalItems.toString();
          }
        });
      } catch {}
    };

    const getCarouselStep = (carousel: HTMLElement) => {
      const firstItem = carousel.querySelector('[id*="-item-"]') as HTMLElement | null;
      const itemWidth = firstItem?.getBoundingClientRect().width ?? carousel.clientWidth;
      const computedStyle = window.getComputedStyle(carousel.firstElementChild as Element);
      const gap = Number.parseFloat(computedStyle.columnGap || computedStyle.gap || "16") || 16;
      const visibleCards = window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : 5;
      return Math.max(itemWidth + gap, visibleCards * (itemWidth + gap));
    };

    const updateCarouselDots = (carousel: HTMLElement) => {
      const dots = document.querySelectorAll(`[data-carousel-target="${carousel.id}"][data-carousel-dot]`);
      if (!dots.length) return;

      const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
      const rawIndex = maxScroll === 0 ? 0 : Math.round((carousel.scrollLeft / maxScroll) * (dots.length - 1));
      const activeIndex = Math.max(0, Math.min(dots.length - 1, rawIndex));

      dots.forEach((dot, index) => {
        dot.classList.toggle("w-8", index === activeIndex);
        dot.classList.toggle("bg-gofarm-green", index === activeIndex);
        dot.classList.toggle("w-3", index !== activeIndex);
        dot.classList.toggle("bg-gray-200", index !== activeIndex);
      });
    };

    const initCarousels = () => {
      const carousels = document.querySelectorAll("[id^='carousel-']");
      carousels.forEach((node) => updateCarouselDots(node as HTMLElement));
    };

    const animateCarouselScroll = (carousel: HTMLElement, nextLeft: number) => {
      const startLeft = carousel.scrollLeft;
      const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
      const targetLeft = Math.max(0, Math.min(maxScroll, nextLeft));
      const distance = targetLeft - startLeft;
      if (Math.abs(distance) < 1) {
        carousel.scrollLeft = targetLeft;
        updateCarouselDots(carousel);
        return;
      }

      const previousAnimation = carouselAnimations.get(carousel);
      if (previousAnimation) {
        cancelAnimationFrame(previousAnimation);
      }

      const previousSnapType = carousel.style.scrollSnapType;
      carousel.style.scrollSnapType = "none";
      const startTime = performance.now();
      const duration = 460;
      const easeInOutCubic = (progress: number) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);
        carousel.scrollLeft = startLeft + distance * eased;
        updateCarouselDots(carousel);

        if (progress < 1) {
          const frameId = requestAnimationFrame(step);
          carouselAnimations.set(carousel, frameId);
          return;
        }

        carousel.scrollLeft = targetLeft;
        carousel.style.scrollSnapType = previousSnapType;
        updateCarouselDots(carousel);
        carouselAnimations.delete(carousel);
      };

      const frameId = requestAnimationFrame(step);
      carouselAnimations.set(carousel, frameId);
    };

    const handleAddToCart = async (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".add-to-cart-btn") as HTMLElement | null;
      if (!btn?.dataset.productId) return;

      e.preventDefault();
      e.stopPropagation();

      const id = btn.dataset.productId;
      const name = btn.dataset.productName || "Product";
      const price = parseFloat(btn.dataset.productPrice || "0");
      const imageSrc = btn.dataset.productImage;
      const slug = btn.dataset.productSlug;

      if (id && name && price && imageSrc && slug) {
        await addToCart({ id, name, price, imageSrc, slug });
        setToastProductName(name);
        setShowToast(true);
        setTimeout(() => {
          updateCartCount();
        }, 100);
      }
    };

    const handleWishlist = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".wishlist-btn") as HTMLElement | null;
      if (!btn?.dataset.productId) return;

      e.preventDefault();
      e.stopPropagation();

      const id = btn.dataset.productId;
      const name = btn.dataset.productName;
      const price = parseFloat(btn.dataset.productPrice || "0");
      const imageSrc = btn.dataset.productImage;
      const slug = btn.dataset.productSlug;

      if (id && name && price && imageSrc && slug) {
        const svg = btn.querySelector("svg") as SVGElement | null;
        if (isInWishlist(id)) {
          removeFromWishlist(id);
          btn.classList.remove("active", "wishlisted");
          if (svg) {
            svg.style.fill = "none";
            svg.style.color = "#6b7280";
            svg.style.stroke = "#6b7280";
          }
        } else {
          addToWishlist({ id, name, price, imageSrc, slug });
          btn.classList.add("active", "wishlisted");
          if (svg) {
            svg.style.fill = "#ef4444";
            svg.style.color = "#ef4444";
            svg.style.stroke = "#ef4444";
          }
        }
      }
    };

    const initWishlistButtons = () => {
      const wishlistBtns = document.querySelectorAll(".wishlist-btn");
      wishlistBtns.forEach((btn) => {
        const id = btn.getAttribute("data-product-id");
        const svg = btn.querySelector("svg") as SVGElement | null;
        if (id && isInWishlist(id)) {
          btn.classList.add("wishlisted");
          if (svg) {
            svg.style.fill = "#ef4444";
            svg.style.color = "#ef4444";
            svg.style.stroke = "#ef4444";
          }
        } else if (svg) {
          svg.style.fill = "none";
          svg.style.color = "#6b7280";
          svg.style.stroke = "#6b7280";
        }
      });
    };

    const handleShare = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".share-btn") as HTMLElement | null;
      if (!btn?.dataset.productId) return;

      e.preventDefault();
      e.stopPropagation();

      const productName = btn.dataset.productName || "Product";
      const productSlug = btn.dataset.productSlug || "";
      const url = `${window.location.origin}/shop/${productSlug}`;

      if (navigator.share) {
        navigator.share({ title: productName, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url).then(() => {
          alert("Link copied to clipboard!");
        }).catch(() => {
          alert(`Share: ${url}`);
        });
      }
    };

    const handleQuickView = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(".add-to-cart-btn") || target.closest(".wishlist-btn") || target.closest(".share-btn")) {
        return;
      }

      const link = target.closest('a[href^="/shop/"]') as HTMLAnchorElement | null;
      if (!link) return;

      const article = link.closest("article");
      if (!article?.dataset.productId) return;

      e.preventDefault();
      const product = products.find((item) => item.id === article.dataset.productId);
      if (product) {
        setSelectedProduct(product);
      }
    };

    const handleCarouselNav = (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest("[data-carousel-target][data-carousel-direction]") as HTMLElement | null;
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();

      const carouselTarget = button.dataset.carouselTarget;
      const direction = button.dataset.carouselDirection;
      if (!carouselTarget || !direction) return;

      const carousel = document.getElementById(carouselTarget);
      if (!carousel) return;

      const step = getCarouselStep(carousel);
      const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
      const nextLeft = direction === "prev"
        ? Math.max(0, carousel.scrollLeft - step)
        : Math.min(maxScroll, carousel.scrollLeft + step);

      animateCarouselScroll(carousel, nextLeft);
    };

    const handleCarouselDot = (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest("[data-carousel-target][data-carousel-dot]") as HTMLElement | null;
      if (!button || button.dataset.carouselDirection) return;

      e.preventDefault();
      e.stopPropagation();

      const carouselTarget = button.dataset.carouselTarget;
      const dotIndex = Number(button.dataset.carouselDot ?? "-1");
      if (!carouselTarget || dotIndex < 0) return;

      const carousel = document.getElementById(carouselTarget);
      if (!carousel) return;

      const dots = document.querySelectorAll(`[data-carousel-target="${carouselTarget}"][data-carousel-dot]`);
      const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
      const nextLeft = dots.length <= 1 ? 0 : (maxScroll / (dots.length - 1)) * dotIndex;

      animateCarouselScroll(carousel, nextLeft);
    };

    document.addEventListener("click", handleAddToCart);
    document.addEventListener("click", handleWishlist);
    document.addEventListener("click", handleShare);
    document.addEventListener("click", handleQuickView);
    document.addEventListener("click", handleCarouselNav);
    document.addEventListener("click", handleCarouselDot);
    window.addEventListener("resize", initCarousels);

    const carousels = Array.from(document.querySelectorAll("[id^='carousel-']")) as HTMLElement[];
    const scrollHandlers = carousels.map((carousel) => {
      const handler = () => updateCarouselDots(carousel);
      carousel.addEventListener("scroll", handler, { passive: true });
      return { carousel, handler };
    });

    setTimeout(initWishlistButtons, 100);
    setTimeout(initCarousels, 100);

    return () => {
      document.removeEventListener("click", handleAddToCart);
      document.removeEventListener("click", handleWishlist);
      document.removeEventListener("click", handleShare);
      document.removeEventListener("click", handleQuickView);
      document.removeEventListener("click", handleCarouselNav);
      document.removeEventListener("click", handleCarouselDot);
      window.removeEventListener("resize", initCarousels);
      carousels.forEach((carousel) => {
        const frameId = carouselAnimations.get(carousel);
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      });
      scrollHandlers.forEach(({ carousel, handler }) => {
        carousel.removeEventListener("scroll", handler);
      });
    };
  }, [addToCart, addToWishlist, removeFromWishlist, isInWishlist, products]);

  return (
    <>
      {showToast ? (
        <ToastMessage productName={toastProductName} onClose={() => setShowToast(false)} />
      ) : null}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
