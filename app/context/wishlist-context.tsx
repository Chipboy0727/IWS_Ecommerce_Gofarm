"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  slug: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function fallbackSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeWishlistItem(item: Partial<WishlistItem> & { id?: string; name?: string }) {
  const base = item.slug?.trim() || item.name || item.id || "product";
  return {
    id: item.id || "",
    name: item.name || "Product",
    price: typeof item.price === "number" ? item.price : 0,
    imageSrc: item.imageSrc || "/images/logo.svg",
    slug: fallbackSlug(base) || "product",
  } satisfies WishlistItem;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const normalized = Array.isArray(parsed) ? parsed.map(normalizeWishlistItem) : [];
        setItems(normalized);
      } catch (e) {
        console.error("Failed to parse wishlist:", e);
      }
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items, storageReady]);

  const addToWishlist = (item: WishlistItem) => {
    const normalizedItem = normalizeWishlistItem(item);
    setItems(prev => {
      if (prev.some(i => i.id === normalizedItem.id)) return prev;
      return [...prev, normalizedItem];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ 
      items, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      totalItems,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
