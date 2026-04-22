"use client";

import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export function ProductGridClient({ products }: { products: any[] }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Xử lý sự kiện cho Add to Cart buttons
    const handleAddToCart = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.add-to-cart-btn') as HTMLElement;
      if (btn) {
        e.preventDefault();
        const id = btn.dataset.productId;
        const name = btn.dataset.productName;
        const price = parseFloat(btn.dataset.productPrice || '0');
        const imageSrc = btn.dataset.productImage;
        const slug = btn.dataset.productSlug;
        
        if (id && name && price && imageSrc && slug) {
          addToCart({ id, name, price, imageSrc, slug });
          
          // Hiển thị toast
          const toast = document.createElement('div');
          toast.className = 'fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300';
          toast.innerHTML = `
            <div class="bg-gofarm-green text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to cart!</span>
            </div>
          `;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        }
      }
    };

    // Xử lý sự kiện cho Wishlist buttons
    const handleWishlist = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.wishlist-btn') as HTMLElement;
      if (btn) {
        e.preventDefault();
        const id = btn.dataset.productId;
        const name = btn.dataset.productName;
        const price = parseFloat(btn.dataset.productPrice || '0');
        const imageSrc = btn.dataset.productImage;
        const slug = btn.dataset.productSlug;
        
        if (id && name && price && imageSrc && slug) {
          if (isInWishlist(id)) {
            removeFromWishlist(id);
            btn.classList.remove('bg-gofarm-green', 'text-white');
            btn.classList.add('bg-white/90', 'text-gofarm-gray');
          } else {
            addToWishlist({ id, name, price, imageSrc, slug });
            btn.classList.add('bg-gofarm-green', 'text-white');
            btn.classList.remove('bg-white/90', 'text-gofarm-gray');
          }
        }
      }
    };

    document.addEventListener('click', handleAddToCart);
    document.addEventListener('click', handleWishlist);

    return () => {
      document.removeEventListener('click', handleAddToCart);
      document.removeEventListener('click', handleWishlist);
    };
  }, [addToCart, addToWishlist, removeFromWishlist, isInWishlist]);

  return null;
}