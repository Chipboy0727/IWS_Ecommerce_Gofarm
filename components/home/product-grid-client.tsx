"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
import { ProductModal } from "@/components/product-modal";

export function ProductGridClient({ products }: { products: any[] }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const animateCarouselScroll = (element: HTMLElement, distance: number) => {
      const start = element.scrollLeft;
      const target = start + distance;
      const duration = 450;
      let startTime: number | null = null;

      const easeInOutCubic = (progress: number) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        element.scrollLeft = start + distance * eased;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          element.scrollLeft = target;
        }
      };

      window.requestAnimationFrame(step);
    };

    const normalizeProductCardImages = () => {
      const images = Array.from(
        document.querySelectorAll('[data-product-card-image="true"]')
      ) as HTMLImageElement[];

      for (const image of images) {
        const applyFit = () => {
          if (!image.naturalWidth || !image.naturalHeight) return;

          const isPortrait = image.naturalHeight > image.naturalWidth * 1.15;
          image.classList.toggle("object-cover", isPortrait);
          image.classList.toggle("w-full", isPortrait);
          image.classList.toggle("h-full", isPortrait);
          image.classList.toggle("max-w-none", isPortrait);
          image.classList.toggle("max-h-none", isPortrait);

          image.classList.toggle("object-contain", !isPortrait);
          image.classList.toggle("w-auto", !isPortrait);
          image.classList.toggle("h-auto", !isPortrait);
          image.classList.toggle("max-w-[70%]", !isPortrait);
          image.classList.toggle("max-h-[70%]", !isPortrait);
        };

        if (image.complete) {
          applyFit();
          continue;
        }

        image.addEventListener("load", applyFit, { once: true });
      }
    };

    normalizeProductCardImages();

    // Show toast notification
    const showToast = (message: string) => {
      const existingToast = document.querySelector('.product-toast');
      if (existingToast) existingToast.remove();
      
      const toast = document.createElement('div');
      toast.className = 'product-toast fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300';
      toast.innerHTML = `
        <div class="bg-gofarm-green text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>${message}</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    };

    // Update cart count on header
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('gofarm_cart') || '[]');
        const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        const cartBadges = document.querySelectorAll('.absolute.-top-1.-right-1');
        cartBadges.forEach((badge) => {
          if (badge.textContent !== undefined) {
            badge.textContent = totalItems.toString();
          }
        });
      } catch(e) {}
    };

    // Handle Add to Cart
    const handleAddToCart = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.add-to-cart-btn') as HTMLElement;
      if (btn && btn.dataset.productId) {
        e.preventDefault();
        e.stopPropagation();
        
        const id = btn.dataset.productId;
        const name = btn.dataset.productName;
        const price = parseFloat(btn.dataset.productPrice || '0');
        const imageSrc = btn.dataset.productImage;
        const slug = btn.dataset.productSlug;
        
        if (id && name && price && imageSrc && slug) {
          addToCart({ id, name, price, imageSrc, slug });
          showToast('Added to cart!');
          setTimeout(() => updateCartCount(), 100);
        }
      }
    };

    // Handle Wishlist toggle
    const handleWishlist = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.wishlist-btn') as HTMLElement;
      if (btn && btn.dataset.productId) {
        e.preventDefault();
        e.stopPropagation();
        
        const id = btn.dataset.productId;
        const name = btn.dataset.productName;
        const price = parseFloat(btn.dataset.productPrice || '0');
        const imageSrc = btn.dataset.productImage;
        const slug = btn.dataset.productSlug;
        
        if (id && name && price && imageSrc && slug) {
          if (isInWishlist(id)) {
            removeFromWishlist(id);
            showToast('Removed from wishlist!');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.classList.remove('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.style.fill = 'none';
          } else {
            addToWishlist({ id, name, price, imageSrc, slug });
            showToast('Added to wishlist!');
            btn.style.backgroundColor = '#dc2626';
            btn.style.color = 'white';
            btn.classList.add('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.style.fill = 'currentColor';
          }
        }
      }
    };

    // Handle Share
    const handleShare = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.share-btn') as HTMLElement;
      if (btn && btn.dataset.productId) {
        e.preventDefault();
        e.stopPropagation();
        
        const productName = btn.dataset.productName || 'Product';
        const productSlug = btn.dataset.productSlug || '';
        const url = window.location.origin + '/shop/' + productSlug;
        
        if (navigator.share) {
          navigator.share({ title: productName, url: url }).catch(() => {});
        } else {
          navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard!');
          }).catch(() => {
            alert('Share: ' + url);
          });
        }
      }
    };

    // Handle Quick View (click on product link)
    const handleQuickView = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Skip if click was on an action button
      if (target.closest('.add-to-cart-btn') || target.closest('.wishlist-btn') || target.closest('.share-btn')) {
        return;
      }
      
      const link = target.closest('a[href^="/shop/"]') as HTMLAnchorElement;
      if (link) {
        const article = link.closest('article');
        if (article && article.dataset.productId) {
          e.preventDefault();
          const product = products.find(p => p.id === article.dataset.productId);
          if (product) {
            setSelectedProduct(product);
          }
        }
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

      const firstItem = carousel.querySelector('[id*="-item-"]') as HTMLElement | null;
      const itemWidth = firstItem?.getBoundingClientRect().width ?? carousel.clientWidth / 5;
      const computedStyle = window.getComputedStyle(carousel.firstElementChild as Element);
      const gap = Number.parseFloat(computedStyle.columnGap || computedStyle.gap || "16") || 16;
      const visibleCards = window.innerWidth < 768 ? 1 : window.innerWidth < 1280 ? 2 : 3;
      const scrollAmount = visibleCards * (itemWidth + gap);

      animateCarouselScroll(carousel, direction === "prev" ? -scrollAmount : scrollAmount);
    };

    // Attach event listeners
    document.addEventListener('click', handleAddToCart);
    document.addEventListener('click', handleWishlist);
    document.addEventListener('click', handleShare);
    document.addEventListener('click', handleQuickView);
    document.addEventListener('click', handleCarouselNav);

    return () => {
      document.removeEventListener('click', handleAddToCart);
      document.removeEventListener('click', handleWishlist);
      document.removeEventListener('click', handleShare);
      document.removeEventListener('click', handleQuickView);
      document.removeEventListener('click', handleCarouselNav);
    };
  }, [addToCart, addToWishlist, removeFromWishlist, isInWishlist, products]);

  return (
    <ProductModal 
      product={selectedProduct} 
      isOpen={!!selectedProduct} 
      onClose={() => setSelectedProduct(null)} 
    />
  );
}
