"use client";

import { useState, useEffect } from "react";
import ShareModal from "@/app/share/share-modal";

interface ProductShareHandlerProps {
  products: any[];
}

export default function ProductShareHandler({ products }: ProductShareHandlerProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleShareClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const shareBtn = target.closest('[aria-label="Share product"]') as HTMLElement;
      
      if (shareBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        // Find parent product card
        const productCard = shareBtn.closest('[data-product-id]') as HTMLElement;
        if (productCard) {
          const productId = productCard.getAttribute('data-product-id');
          const product = products.find(p => p.id === productId);
          
          if (product) {
            setSelectedProduct(product);
            setShowModal(true);
          }
        }
      }
    };

    document.addEventListener('click', handleShareClick);
    return () => document.removeEventListener('click', handleShareClick);
  }, [products]);

  const shareUrl = selectedProduct && typeof window !== 'undefined' 
    ? `${window.location.origin}/shop/${selectedProduct.slug}` 
    : '';

  return (
    <>
      {showModal && selectedProduct && (
        <ShareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          url={shareUrl}
          title={selectedProduct.name}
        />
      )}
    </>
  );
}
