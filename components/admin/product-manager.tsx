"use client";
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

function stockTone(stock: number) {
  if (stock <= 25) return "red";
  if (stock <= 100) return "amber";
  return "green";
}

function stockWidth(stock: number) {
  if (stock <= 25) return 14;
  if (stock <= 100) return 36;
  if (stock <= 300) return 62;
  return 86;
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
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        updateField("imageSrc", data.url);
        setImageMode("url"); // Switch to URL view to show the result
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
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
        title="Product Management"
        subtitle="Manage your agricultural catalog and monitor stock levels in real-time."
        right={
          <div className="flex flex-wrap gap-2">
            <AdminActionButton tone="primary" onClick={openCreate}>+ Add New Product</AdminActionButton>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[18px] border border-[#edf1e5] bg-white px-4 py-4">
          <div className="flex min-w-[320px] flex-1 items-center gap-3 rounded-[14px] bg-[#e9f0db] px-4 py-3 text-[#6f7b6d]">
            <IconSearch />
            <span className="text-[13px]">Search products, SKU or category...</span>
          </div>
          <button className="rounded-[10px] bg-[#eef4e7] px-4 py-3 text-[13px] font-medium text-[#536451]">Category</button>
          <button className="rounded-[10px] bg-[#eef4e7] px-4 py-3 text-[13px] font-medium text-[#536451]">Stock Level</button>
          <button className="rounded-[10px] bg-[#eef4e7] px-4 py-3 text-[13px] font-medium text-[#536451]">Export</button>
        </div>

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
          <>
            <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
              <table className="page-table min-w-full text-left">
                <thead className="bg-[#f0f5e4]">
                  <tr className="text-[11px] uppercase tracking-[0.18em] text-[#748171]">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Stock Level</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const stock = typeof product.stock === "number" ? product.stock : 0;
                    const tone = stockTone(stock);
                    return (
                      <tr key={product.id} className={index === products.length - 1 ? "" : "border-b border-[#edf1e5]"}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageSrc || "/images/logo.svg"}
                              alt={product.name}
                              className="h-10 w-10 rounded-[10px] object-cover"
                              onError={(e) => (e.currentTarget.src = "/images/logo.svg")}
                            />
                            <div>
                              <div className="text-[13px] font-semibold text-[#243322]">{product.name}</div>
                              <div className="text-[12px] text-[#748171]">SKU: {product.slug.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Pill tone="green">{product.categoryTitle ?? "Uncategorized"}</Pill>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#4d5d4b]">
                          <div className="flex items-center gap-3">
                            <div className="progress">
                              <span
                                className={tone === "green" ? "status-green" : tone === "amber" ? "status-amber" : "status-red"}
                                style={{ width: `${stockWidth(stock)}%` }}
                              />
                            </div>
                            <div className="text-[13px] font-semibold text-[#243322]">{stock}</div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Pill tone={tone}>{(product.status ?? "ACTIVE").toUpperCase()}</Pill>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-semibold text-[#253323]">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="icon-actions">
                            <button type="button" onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`}>
                              <IconPen />
                            </button>
                            <button type="button" onClick={() => handleDelete(product)} aria-label={`Delete ${product.name}`}>
                              <IconTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-2 pt-4 text-[12px] text-[#6f7b6d]">
              <div>Showing 1-4 of {products.length.toLocaleString("en-US")} products</div>
              <div className="flex items-center gap-2">
                <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea] text-[#7f8d7d]">‹</button>
                <button className="grid h-9 w-9 place-items-center rounded-md bg-[#0b7312] text-white">1</button>
                <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">2</button>
                <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">3</button>
                <span className="px-1 text-[#919d90]">…</span>
                <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">321</button>
                <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea] text-[#7f8d7d]">›</button>
              </div>
            </div>
          </>
        )}
      </SectionCard>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2619]/60 p-4 backdrop-blur-md">
          <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_30px_70px_-10px_rgba(0,0,0,0.4)] ring-1 ring-black/5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#edf1e5] bg-white px-8 py-6">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1a2619]">{editingSlug ? "Edit Product" : "Create New Product"}</h3>
                <p className="text-[14px] text-[#6f7b6d]">{editingSlug ? "Update the product details below." : "Add a fresh new product to your catalog."}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f5e4] text-[#4d5d4b] transition-all hover:bg-[#e2efda] hover:text-[#1a2619] active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-white p-8">
              <form id="product-form" onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
                <div className="md:col-span-2 space-y-6 rounded-[24px] bg-[#f8fbf2] p-8 border border-[#edf1e5]">
                  <div className="flex items-center gap-3 border-b border-[#edf1e5] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2efda] text-[#16781f]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <h4 className="text-[14px] font-bold uppercase tracking-widest text-[#1a2619]">Basic Information</h4>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Product Name">
                      <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="input" placeholder="e.g. Fresh Organic Apples" required />
                    </Field>
                    <Field label="URL Slug">
                      <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="input" placeholder="fresh-organic-apples" />
                    </Field>
                    <Field label="Description" className="md:col-span-2">
                      <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="input min-h-[120px] resize-none" placeholder="Describe the product features, origin, and quality..." />
                    </Field>
                  </div>
                </div>

                <div className="space-y-6 rounded-[24px] bg-white p-8 border border-[#edf1e5] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between border-b border-[#edf1e5] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2efda] text-[#16781f]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </div>
                      <h4 className="text-[14px] font-bold uppercase tracking-widest text-[#1a2619]">Media</h4>
                    </div>
                    <div className="flex rounded-full bg-[#f0f5e4] p-1 scale-90">
                      <button type="button" onClick={() => setImageMode("url")} className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-all ${imageMode === "url" ? "bg-white text-[#16781f] shadow-sm" : "text-[#6f7b6d]"}`}>LINK</button>
                      <button type="button" onClick={() => setImageMode("upload")} className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-all ${imageMode === "upload" ? "bg-white text-[#16781f] shadow-sm" : "text-[#6f7b6d]"}`}>UPLOAD</button>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {imageMode === "url" ? (
                      <Field label="Image URL">
                        <input value={form.imageSrc} onChange={(e) => updateField("imageSrc", e.target.value)} className="input" placeholder="https://..." required />
                      </Field>
                    ) : (
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#dce4d1] bg-[#f8fbf2] p-8 text-center transition-all hover:border-[#16781f]">
                          {uploading ? (
                            <svg className="h-8 w-8 animate-spin text-[#16781f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          ) : (
                            <>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#16781f] mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                              <span className="text-[13px] font-bold text-[#1a2619]">Click to Upload</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    <Field label="Alt Text">
                      <input value={form.imageAlt} onChange={(e) => updateField("imageAlt", e.target.value)} className="input" placeholder="Image description" required />
                    </Field>
                    {form.imageSrc && (
                      <div className="relative group overflow-hidden rounded-2xl border border-[#dce4d1]">
                        <img src={form.imageSrc} alt="Preview" className="h-32 w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Image Preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6 rounded-[24px] bg-white p-8 border border-[#edf1e5] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 border-b border-[#edf1e5] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2efda] text-[#16781f]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <h4 className="text-[14px] font-bold uppercase tracking-widest text-[#1a2619]">Pricing</h4>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Price ($)">
                      <input type="number" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="input" placeholder="0.00" required />
                    </Field>
                    <Field label="Stock">
                      <input type="number" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} className="input" placeholder="0" />
                    </Field>
                    <Field label="Discount">
                      <input type="number" value={form.discount} onChange={(e) => updateField("discount", e.target.value)} className="input" placeholder="0" />
                    </Field>
                    <Field label="Status Tag">
                      <input value={form.status} onChange={(e) => updateField("status", e.target.value)} className="input" placeholder="e.g. sale" />
                    </Field>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6 rounded-[24px] bg-[#f8fbf2] p-8 border border-[#edf1e5]">
                  <div className="flex items-center gap-3 border-b border-[#edf1e5] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2efda] text-[#16781f]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                    <h4 className="text-[14px] font-bold uppercase tracking-widest text-[#1a2619]">Classification</h4>
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Field label="Category">
                      <select value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className="input appearance-none">
                        <option value="">Choose...</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </Field>
                    <Field label="Brand">
                      <input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} className="input" placeholder="Brand..." />
                    </Field>
                    <Field label="Initial Rating">
                      <input type="number" step="0.1" value={form.rating} onChange={(e) => updateField("rating", e.target.value)} className="input" placeholder="0-5" />
                    </Field>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 border-t border-[#edf1e5] bg-white px-8 py-6">
              <button
                type="button"
                onClick={closeModal}
                style={{ backgroundColor: "#0f9716", color: "#ffffff" }}
                className="rounded-xl px-8 py-3 text-[14px] font-bold shadow-lg shadow-green-100 transition-all hover:bg-[#0d8213] active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={saving}
                style={{ backgroundColor: "#0f9716", color: "#ffffff" }}
                className="flex items-center justify-center rounded-xl px-10 py-3 text-[14px] font-bold shadow-lg shadow-green-100 transition-all hover:bg-[#0d8213] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingSlug ? "Save Changes" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 16px;
          border: 1.5px solid #dce4d1;
          background: #fff;
          padding: 14px 18px;
          font-size: 15px;
          color: #243322;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .input::placeholder {
          color: #a4b3a2;
        }
        .input:focus {
          border-color: #0f9716;
          box-shadow: 0 0 0 4px rgba(15, 151, 22, 0.1), 0 2px 4px rgba(0,0,0,0.02);
        }
        .input:hover:not(:focus) {
          border-color: #b5c4a7;
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
    <label className={className}>
      <span className="mb-2.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#6f7b6d]">{label}</span>
      {children}
    </label>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconPen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m13 6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 7h14M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7m-8 0 .8 12a1.8 1.8 0 0 0 1.8 1.7h4.6a1.8 1.8 0 0 0 1.8-1.7L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
