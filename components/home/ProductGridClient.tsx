"use client";

import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export function ProductGridClient({ products }: { products: any[] }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Hiển thị toast notification
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

    // Cập nhật số lượng cart trên header
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

    // Xử lý Add to Cart
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

    // Xử lý Wishlist
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

    // Xử lý Share
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

    // Gắn sự kiện
    document.addEventListener('click', handleAddToCart);
    document.addEventListener('click', handleWishlist);
    document.addEventListener('click', handleShare);

    return () => {
      document.removeEventListener('click', handleAddToCart);
      document.removeEventListener('click', handleWishlist);
      document.removeEventListener('click', handleShare);
    };
  }, [addToCart, addToWishlist, removeFromWishlist, isInWishlist]);

  return null;
}