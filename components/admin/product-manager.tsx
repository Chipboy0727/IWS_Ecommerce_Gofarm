"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { AdminActionButton, Pill, SectionCard } from "@/components/admin/admin-shell";

type ProductFormState = {
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  discount: string;
  brand: string;
  categoryId: string;
  categoryTitle: string;
  description: string;
  rating: string;
  reviews: string;
  stock: string;
  status: string;
};

function emptyForm(): ProductFormState {
  return {
    name: "",
    slug: "",
    imageSrc: "/images/logo.svg",
    imageAlt: "",
    price: "0",
    discount: "",
    brand: "",
    categoryId: "",
    categoryTitle: "",
    description: "",
    rating: "0",
    reviews: "0",
    stock: "",
    status: "new",
  };
}

function toForm(product: LocalProduct): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    price: String(product.price),
    discount: product.discount === null ? "" : String(product.discount),
    brand: product.brand ?? "",
    categoryId: product.categoryId ?? "",
    categoryTitle: product.categoryTitle ?? "",
    description: product.description ?? "",
    rating: String(product.rating),
    reviews: String(product.reviews),
    stock: product.stock === null ? "" : String(product.stock),
    status: product.status ?? "",
  };
}

export default function ProductManager() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/products?paginated=true&limit=100&sortBy=featured&sortOrder=desc"),
        fetch("/api/categories?paginated=true&limit=100&sortBy=title&sortOrder=asc"),
      ]);

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setProducts(Array.isArray(productsData.products) ? productsData.products : []);
      setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : []);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingSlug(null);
    setForm(emptyForm());
    setNotice("");
    setIsOpen(true);
  };

  const openEdit = (product: LocalProduct) => {
    setEditingSlug(product.slug);
    setForm(toForm(product));
    setNotice("");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSaving(false);
  };

  const updateField = (field: keyof ProductFormState, value: string) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "categoryId") {
        const category = categories.find((item) => item.id === value || item.slug === value);
        next.categoryTitle = category?.title ?? "";
      }
      return next;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      updateField("imageSrc", data.url);
      if (!form.imageAlt) {
        updateField("imageAlt", file.name.split(".")[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      price: Number(form.price),
      discount: form.discount ? Number(form.discount) : null,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      stock: form.stock ? Number(form.stock) : null,
    };

    try {
      const response = await fetch(
        editingSlug ? `/api/products/${encodeURIComponent(editingSlug)}` : "/api/products",
        {
          method: editingSlug ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setNotice(editingSlug ? "Product updated successfully." : "Product created successfully.");
      setIsOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: LocalProduct) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(product.slug)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setNotice("Product deleted successfully.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <>
      <SectionCard
        title="Catalog Management"
        subtitle="Create, update, and remove products using the live API."
        right={
          <div className="flex flex-wrap gap-2">
            <AdminActionButton tone="primary" onClick={openCreate}>+ Add New Product</AdminActionButton>
          </div>
        }
      >
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        {notice ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>
        ) : null}

        {loading ? (
          <div className="rounded-[18px] bg-[#f8fbf2] px-6 py-12 text-center text-sm text-[#6f7b6d]">
            Loading products...
          </div>
        ) : (
          <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-[#f0f5e4]">
                <tr className="text-[11px] uppercase tracking-[0.18em] text-[#748171]">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className={index === products.length - 1 ? "" : "border-b border-[#edf1e5]"}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageSrc || "/images/logo.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-[10px] object-cover"
                          onError={(e) => (e.currentTarget.src = "/images/logo.svg")}
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-[#243322]">{product.name}</div>
                          <div className="text-[12px] text-[#748171]">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[13px] text-[#4d5d4b]">{product.categoryTitle ?? "Uncategorized"}</div>
                      {product.status ? (
                        <div className="mt-2">
                          <Pill tone="gray">{product.status.toUpperCase()}</Pill>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-[#253323]">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-[#4d5d4b]">
                      {product.stock ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="rounded-full bg-[#edf6e8] px-4 py-2 text-[12px] font-semibold text-[#16781f] hover:bg-[#e2efda]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="rounded-full bg-[#fbe3e0] px-4 py-2 text-[12px] font-semibold text-[#c13d36] hover:bg-[#f7d0cc]"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col h-full max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header - Fixed */}
            <div className="shrink-0 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{editingSlug ? "Update Product" : "New Product"}</h3>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Product Name">
                    <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="input-modern" required />
                  </Field>
                  <Field label="URL Slug">
                    <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="input-modern" />
                  </Field>
                  <Field label="Category">
                    <select value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className="input-modern bg-white">
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </Field>
                  <Field label="Brand">
                    <input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} className="input-modern" />
                  </Field>
                </div>

                {/* Media Section */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-white space-y-4">
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                    <button type="button" onClick={() => setImageMode("url")} className={`px-4 py-1.5 rounded-md text-xs font-bold ${imageMode === "url" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}>URL</button>
                    <button type="button" onClick={() => setImageMode("upload")} className={`px-4 py-1.5 rounded-md text-xs font-bold ${imageMode === "upload" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}>UPLOAD</button>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      {imageMode === "url" ? (
                        <input value={form.imageSrc} onChange={(e) => updateField("imageSrc", e.target.value)} className="input-modern" placeholder="Image URL" required />
                      ) : (
                        <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <span className="text-sm font-medium text-gray-400">{uploading ? "Uploading..." : "Click to select"}</span>
                        </div>
                      )}
                    </div>
                    <div className="h-32 w-32 border rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={form.imageSrc || "/images/logo.svg"} className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Field label="Price ($)">
                    <input type="number" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="input-modern" required />
                  </Field>
                  <Field label="Discount %">
                    <input type="number" value={form.discount} onChange={(e) => updateField("discount", e.target.value)} className="input-modern" />
                  </Field>
                  <Field label="Stock">
                    <input type="number" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} className="input-modern" />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="input-modern min-h-[120px] resize-none" />
                </Field>
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="shrink-0 flex items-center justify-end gap-4 border-t border-gray-100 bg-white px-8 py-5">
              <button onClick={closeModal} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button 
                type="submit" 
                form="product-form" 
                disabled={saving || uploading} 
                className="px-10 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingSlug ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .input-modern {
          width: 100%;
          border-radius: 18px;
          border: 1.5px solid #f0f4f0;
          background: #f9fbf9;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 500;
          color: #1a2b1a;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-modern:focus {
          border-color: #0f9716;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(15, 151, 22, 0.08);
        }
        .input-modern::placeholder {
          color: #a0aca0;
          font-weight: 400;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8e2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cfd8cf;
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  icon,
  children,
  className = "",
}: {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="flex items-center gap-2.5 px-0.5">
        {icon && <span className="text-[#0f9716] flex-shrink-0">{icon}</span>}
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6f7b6d] leading-none">{label}</span>
      </label>
      {children}
    </div>
  );
}
