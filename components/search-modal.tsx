"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/context/cart-context";

import { ProductModal } from "@/components/product-modal";
import type { LocalProduct } from "@/lib/local-catalog";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// Toast Message Component
function ToastMessage({ productName, onClose }: { productName: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-[60] animate-in slide-in-from-right-5 duration-300">
      <div className="bg-gofarm-green text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm">
        <div className="bg-white/20 p-1 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>{productName} added to cart!</span>
      </div>
    </div>
  );
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastProductName, setToastProductName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}&limit=10`);
      const data = await res.json();
      setResults(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const salePrice = product.discount
      ? product.price - (product.price * product.discount) / 100
      : product.price;

    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      imageSrc: product.imageSrc,
      slug: product.slug,
    });

    setToastProductName(product.name);
    setShowToast(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl bg-white rounded-2xl sm:rounded-[32px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header Area */}
            <div
              style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
              className="p-4 sm:p-6 lg:p-8 text-white"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/20">
                    <IconSearch className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Search Products</h2>
                  <div className="hidden sm:flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-lg text-[11px] font-mono border border-white/20 font-bold">
                    <span>⌘</span>
                    <span>+</span>
                    <span>K</span>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                  <IconX className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-[#16a34a]">
                  <IconSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type product name, category, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-14 pr-10 sm:pr-12 py-3 sm:py-4 bg-white text-gray-900 rounded-xl sm:rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-base sm:text-lg font-medium"
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-white p-3 sm:p-4 lg:p-6 no-scrollbar">
              {!searchTerm && !loading ? (
                <div className="py-12 sm:py-16 lg:py-20 flex flex-col items-center text-center">
                  <div style={{ backgroundColor: "#22c55e" }} className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-xl">
                    <IconSearch className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Discover Amazing Products</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Start typing to search through our fresh catalog</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-4 min-w-[600px] sm:min-w-[700px]">
                    <thead>
                      <tr style={{ backgroundColor: "#22c55e" }} className="text-white">
                        <th className="p-2.5 sm:p-4 rounded-l-xl sm:rounded-l-2xl font-extrabold uppercase text-[10px] sm:text-xs tracking-wider">Image</th>
                        <th className="p-2.5 sm:p-4 font-extrabold uppercase text-[10px] sm:text-xs tracking-wider">Product Name</th>
                        <th className="p-2.5 sm:p-4 font-extrabold uppercase text-[10px] sm:text-xs tracking-wider">Price</th>
                        <th className="p-2.5 sm:p-4 font-extrabold uppercase text-[10px] sm:text-xs tracking-wider hidden sm:table-cell">Status</th>
                        <th className="p-2.5 sm:p-4 rounded-r-xl sm:rounded-r-2xl font-extrabold uppercase text-[10px] sm:text-xs tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} className="text-center py-12 sm:py-20 text-gray-400 text-sm sm:text-base">Searching...</td></tr>
                      ) : results.length > 0 ? (
                        results.map((product) => {
                          const salePrice = product.discount
                            ? product.price - (product.price * product.discount) / 100
                            : product.price;
                          return (
                            <tr
                              key={product.id}
                              onClick={() => setSelectedProduct(product)}
                              className="group hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <td className="p-2.5 sm:p-4">
                                <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-1.5 sm:p-2 shadow-sm">
                                  <img src={product.imageSrc} alt={product.name} className="w-full h-full object-contain" />
                                  {product.discount > 0 && (
                                    <div className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-white shadow-sm">
                                      -{product.discount}%
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 sm:p-4">
                                <h4 className="font-extrabold text-gray-900 group-hover:text-[#22c55e] transition-colors text-sm sm:text-base">{product.name}</h4>
                              </td>
                              <td className="p-2.5 sm:p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                                  <span className="text-[#22c55e] font-black text-base sm:text-xl">${salePrice.toFixed(2)}</span>
                                  {product.discount > 0 && (
                                    <span className="text-gray-400 line-through text-xs sm:text-sm font-bold">${product.price.toFixed(2)}</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 sm:p-4 hidden sm:table-cell">
                                <div style={{ backgroundColor: "#22c55e" }} className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                                  <IconStar /> Sale
                                </div>
                              </td>
                              <td className="p-2.5 sm:p-4 text-center">
                                <button
                                  onClick={(e) => handleAddToCart(e, product)}
                                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-white border-2 border-[#22c55e] hover:!bg-[#16a34a] hover:!text-white text-[#22c55e] font-bold py-1.5 sm:py-2.5 px-3 sm:px-5 rounded-xl sm:rounded-2xl transition-all shadow-sm active:scale-95"
                                >
                                  <span className="text-xs sm:text-sm">Add to Cart</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan={5} className="text-center py-12 sm:py-20 text-gray-500 font-bold text-sm sm:text-base">No products found for "{searchTerm}"</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {showToast && (
              <ToastMessage productName={toastProductName} onClose={() => setShowToast(false)} />
            )}
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </AnimatePresence>
  );
}
