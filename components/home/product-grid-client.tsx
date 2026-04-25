"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
import { ProductModal } from "@/components/product-modal";

// Toast Component
function ToastMessage({ productName, onClose }: { productName: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
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
    const handleAddToCart = async (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.add-to-cart-btn') as HTMLElement;
      if (btn && btn.dataset.productId) {
        e.preventDefault();
        e.stopPropagation();
        
        const id = btn.dataset.productId;
        const name = btn.dataset.productName || "Product";
        const price = parseFloat(btn.dataset.productPrice || '0');
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
      }
    };

    // Handle Wishlist toggle - CHỈ ĐỔI MÀU TIM, VIỀN GIỮ NGUYÊN
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
            // Bỏ chọn - tim xám, fill none
            btn.classList.remove('active', 'wishlisted');
            const svg = btn.querySelector('svg');
            if (svg) {
              svg.style.fill = 'none';
              svg.style.color = '#6b7280';
              svg.style.stroke = '#6b7280';
            }
          } else {
            addToWishlist({ id, name, price, imageSrc, slug });
            // Đã chọn - tim đỏ, fill đỏ
            btn.classList.add('active', 'wishlisted');
            const svg = btn.querySelector('svg');
            if (svg) {
              svg.style.fill = '#ef4444';
              svg.style.color = '#ef4444';
              svg.style.stroke = '#ef4444';
            }
          }
        }
      }
    };

    // Khởi tạo trạng thái wishlist ban đầu cho các button
    const initWishlistButtons = () => {
      const wishlistBtns = document.querySelectorAll('.wishlist-btn');
      wishlistBtns.forEach((btn) => {
        const id = btn.getAttribute('data-product-id');
        if (id && isInWishlist(id)) {
          btn.classList.add('wishlisted');
          const svg = btn.querySelector('svg');
          if (svg) {
            svg.style.fill = '#ef4444';
            svg.style.color = '#ef4444';
            svg.style.stroke = '#ef4444';
          }
        } else {
          const svg = btn.querySelector('svg');
          if (svg) {
            svg.style.fill = 'none';
            svg.style.color = '#6b7280';
            svg.style.stroke = '#6b7280';
          }
        }
      });
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
            alert('Link copied to clipboard!');
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

    // Attach event listeners
    document.addEventListener('click', handleAddToCart);
    document.addEventListener('click', handleWishlist);
    document.addEventListener('click', handleShare);
    document.addEventListener('click', handleQuickView);
    
    // Khởi tạo trạng thái ban đầu cho wishlist buttons
    setTimeout(initWishlistButtons, 100);

    return () => {
      document.removeEventListener('click', handleAddToCart);
      document.removeEventListener('click', handleWishlist);
      document.removeEventListener('click', handleShare);
      document.removeEventListener('click', handleQuickView);
    };
  }, [addToCart, addToWishlist, removeFromWishlist, isInWishlist, products]);

  return (
    <>
      {showToast && (
        <ToastMessage productName={toastProductName} onClose={() => setShowToast(false)} />
      )}
      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </>
  );
}