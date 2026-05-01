"use client";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { Pill, SectionCard } from "@/components/admin/admin-shell";

type ProductFormState = {
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  discount: string;
  origin: string;
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
    origin: "",
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
    origin: product.origin ?? "",
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const pageSize = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<null | "category" | "stock">(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [modalError, setModalError] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const resolveCategory = (product: LocalProduct) => {
    const rawId = (product.categoryId ?? "").trim();
    const rawTitle = (product.categoryTitle ?? "").trim().toLowerCase();
    return (
      categories.find((item) => item.id === rawId || item.slug === rawId) ??
      categories.find((item) => item.title.trim().toLowerCase() === rawTitle) ??
      null
    );
  };

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

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !form.categoryId || categories.length === 0) return;
    const matched = categories.find((item) => item.id === form.categoryId || item.slug === form.categoryId);
    if (matched && form.categoryId !== matched.id) {
      setForm((current) => ({ ...current, categoryId: matched.id, categoryTitle: matched.title }));
    }
  }, [isOpen, form.categoryId, categories]);

  const openCreate = () => {
    setEditingSlug(null);
    setForm(emptyForm());
    setError("");
    setModalError("");
    setPreviewError(false);
    setNotice("");
    setIsOpen(true);
  };

  const openEdit = (product: LocalProduct) => {
    setEditingSlug(product.slug);
    setForm(toForm(product));
    setError("");
    setModalError("");
    setPreviewError(false);
    setNotice("");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSaving(false);
    setError("");
    setModalError("");
    setPreviewError(false);
  };

  const updateField = (field: keyof ProductFormState, value: string) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "imageSrc") {
        setPreviewError(false);
      }
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
    setModalError("");
    setSaving(true);
    setError("");
    setNotice("");

    const normalizedName = form.name.trim();
    if (!normalizedName) {
      setModalError("Product name is required.");
      setSaving(false);
      return;
    }

    const parsedPrice = Number(form.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setModalError("Price must be zero or greater.");
      setSaving(false);
      return;
    }

    if (!form.imageSrc.trim()) {
      setModalError("Image URL is required.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      name: normalizedName,
      price: parsedPrice,
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
      setModalError("");
      setIsOpen(false);
      await loadData();
    } catch (err: any) {
      const message = err.message || "Failed to save product";
      setError(message);
      setModalError(message);
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

  const handleExport = () => {
    const headers = ["SKU", "Name", "Category", "Stock", "Status", "Price"];
    const rows = filteredProducts.map(p => [
      p.slug.toUpperCase(),
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.categoryTitle || 'Uncategorized'}"`,
      p.stock || 0,
      (p.status || "ACTIVE").toUpperCase(),
      p.price.toFixed(2)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    const matchesSearch = !search || (
      p.name.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      (p.categoryTitle && p.categoryTitle.toLowerCase().includes(term))
    );
    const resolvedCategory = resolveCategory(p);
    const matchesCategory = categoryFilter === "All" || resolvedCategory?.id === categoryFilter;
    
    let matchesStock = true;
    const stock = p.stock || 0;
    if (stockFilter === "Low") matchesStock = stock <= 25;
    else if (stockFilter === "Medium") matchesStock = stock > 25 && stock <= 100;
    else if (stockFilter === "High") matchesStock = stock > 100;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <SectionCard
        title="Product Management"
        subtitle="Manage your agricultural catalog and monitor stock levels in real-time."
        right={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="pm-add-button" onClick={openCreate}>
              <span className="pm-add-icon">+</span>
              <span>Add New Product</span>
            </button>
          </div>
        }
      >
        <div className="pm-toolbar">
          <label className="pm-search">
            <IconSearch />
            <input 
              type="text" 
              placeholder="Search products, SKU or category..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pm-input"
            />
          </label>

          <div className="pm-dropdown-group" ref={dropdownRef}>
            <div className="pm-filter-wrap">
              <button
                type="button"
                className={`pm-filter pm-filter-select${openDropdown === "category" ? " is-open" : ""}`}
                onClick={() => setOpenDropdown((c) => (c === "category" ? null : "category"))}
              >
                <IconFilter />
                <span>{categoryFilter === "All" ? "Category" : categories.find(c => c.id === categoryFilter)?.title || categoryFilter}</span>
                <span className="pm-select-arrow" aria-hidden="true">
                  <IconChevronDown />
                </span>
              </button>
              {openDropdown === "category" ? (
                <div className="pm-menu">
                  <button
                    type="button"
                    className={`pm-menu-item${categoryFilter === "All" ? " active" : ""}`}
                    onClick={() => { setCategoryFilter("All"); setPage(1); setOpenDropdown(null); }}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`pm-menu-item${categoryFilter === c.id ? " active" : ""}`}
                      onClick={() => { setCategoryFilter(c.id); setPage(1); setOpenDropdown(null); }}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="pm-filter-wrap">
              <button
                type="button"
                className={`pm-filter pm-filter-select${openDropdown === "stock" ? " is-open" : ""}`}
                onClick={() => setOpenDropdown((c) => (c === "stock" ? null : "stock"))}
              >
                <IconFilter />
                <span>{stockFilter === "All" ? "Stock Level" : stockFilter === "Low" ? "Low Stock" : stockFilter === "Medium" ? "Medium Stock" : "High Stock"}</span>
                <span className="pm-select-arrow" aria-hidden="true">
                  <IconChevronDown />
                </span>
              </button>
              {openDropdown === "stock" ? (
                <div className="pm-menu">
                  {[
                    ["All", "All Levels"],
                    ["Low", "Low Stock (≤ 25)"],
                    ["Medium", "Medium Stock (26-100)"],
                    ["High", "High Stock (> 100)"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`pm-menu-item${stockFilter === value ? " active" : ""}`}
                      onClick={() => { setStockFilter(value); setPage(1); setOpenDropdown(null); }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <button type="button" className="pm-filter pm-filter-button" onClick={handleExport}>
            <IconExport />
            <span>Export</span>
          </button>
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
            <div className="overflow-hidden rounded-[18px] border border-[#e1ebd4] bg-white shadow-[0_14px_28px_rgba(77,107,53,0.08)]">
              <div className="max-h-[800px] overflow-y-auto">
                <table className="page-table min-w-full text-left">
                <thead className="bg-[#f0f5e4]">
                  <tr className="text-[11px] uppercase tracking-[0.18em] text-[#748171]">
                    <th className="px-5 py-4">SKU</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Stock Level</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => {
                    const stock = typeof product.stock === "number" ? product.stock : 0;
                    const tone = stockTone(stock);
                    return (
                      <tr key={product.id} className={index === paginatedProducts.length - 1 ? "" : "border-b border-[#edf1e5]"}>
                        <td className="px-5 py-4 text-[13px] font-medium text-[#748171]">
                          {product.slug.toUpperCase()}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageSrc || "/images/logo.svg"}
                              alt={product.name}
                              className="h-10 w-10 rounded-[10px] object-cover"
                              onError={(e) => (e.currentTarget.src = "/images/logo.svg")}
                            />
                            <div className="text-[13px] font-semibold text-[#243322]">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Pill tone="green">{resolveCategory(product)?.title ?? product.categoryTitle ?? "Uncategorized"}</Pill>
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
          </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#6f7b6d] px-2">
                <div>Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} products</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f2f6ea] hover:bg-[#e4ebd8] disabled:opacity-50"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    let pageNum = i + 1;
                    if (pageCount > 5) {
                      if (page > 3 && page < pageCount - 2) pageNum = page - 2 + i;
                      else if (page >= pageCount - 2) pageNum = pageCount - 4 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          backgroundColor: page === pageNum ? '#0b7312' : '',
                          color: page === pageNum ? '#ffffff' : ''
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-md ${
                          page !== pageNum 
                            ? "bg-white ring-1 ring-black/10 hover:bg-black/5 text-[#243322]" 
                            : "font-bold"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => setPage(Math.min(pageCount, page + 1))}
                    disabled={page === pageCount}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f2f6ea] hover:bg-[#e4ebd8] disabled:opacity-50"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2619]/60 p-4 backdrop-blur-md">
          <div className="pm-modal-shell flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[38px] bg-white shadow-[0_30px_70px_-10px_rgba(38,64,30,0.28)]">
            {/* Header */}
            <div className="pm-modal-header flex items-center justify-between border-b border-[#dfead2] px-8 py-6">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1a2619]">{editingSlug ? "Edit Product" : "Create New Product"}</h3>
                <p className="text-[14px] text-[#547252]">{editingSlug ? "Update the product details below." : "Add a fresh new product to your catalog."}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-[#4d5d4b] ring-1 ring-[#d7e5c8] transition-all hover:bg-white hover:text-[#1a2619] hover:ring-[#b9d6ab] active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="pm-modal-body flex-1 overflow-y-auto p-8">
              {modalError ? (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {modalError}
                </div>
              ) : null}
              <form id="product-form" onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
                <div className="pm-form-panel md:col-span-2 space-y-6 rounded-[30px] bg-[#f8fbf2] p-8 border border-[#edf1e5]">
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

                <div className="pm-form-panel space-y-6 rounded-[30px] bg-white p-8 border border-[#edf1e5] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between border-b border-[#edf1e5] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2efda] text-[#16781f]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </div>
                      <h4 className="text-[14px] font-bold uppercase tracking-widest text-[#1a2619]">Media</h4>
                    </div>
                    <div className="flex rounded-full bg-[#f0f5e4] p-1 scale-90">
                      <button type="button" onClick={() => setImageMode("url")} className={`pm-toggle-btn ${imageMode === "url" ? "is-active" : ""}`}>LINK</button>
                      <button type="button" onClick={() => setImageMode("upload")} className={`pm-toggle-btn ${imageMode === "upload" ? "is-active" : ""}`}>UPLOAD</button>
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
                    {form.imageSrc && !previewError ? (
                      <div className="relative mt-3 group overflow-hidden rounded-[24px] border border-[#dce4d1]">
                        <img
                          src={form.imageSrc}
                          alt="Preview"
                          className="h-32 w-full object-cover"
                          onError={() => setPreviewError(true)}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Image Preview</span>
                        </div>
                      </div>
                    ) : form.imageSrc ? (
                      <div className="mt-3 flex h-32 items-center justify-center rounded-[24px] border border-dashed border-[#d3dfc5] bg-[#f7fbf1] text-[13px] font-semibold text-[#6f7b6d]">
                        Invalid image URL. Please use another link or upload a file.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="pm-form-panel space-y-6 rounded-[30px] bg-white p-8 border border-[#edf1e5] shadow-sm hover:shadow-md transition-shadow">
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

                <div className="pm-form-panel md:col-span-2 space-y-6 rounded-[30px] bg-[#f8fbf2] p-8 border border-[#edf1e5]">
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
                    <Field label="Origin">
                      <input value={form.origin} onChange={(e) => updateField("origin", e.target.value)} className="input" placeholder="Origin..." />
                    </Field>
                    <Field label="Initial Rating">
                      <input type="number" step="0.1" value={form.rating} onChange={(e) => updateField("rating", e.target.value)} className="input" placeholder="0-5" />
                    </Field>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="pm-modal-footer border-t border-[#e2ecd8] px-8 py-7">
              <div className="pm-footer-actions flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="pm-cancel-btn flex items-center justify-center rounded-xl px-7 py-2.5 text-[14px] font-bold transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  disabled={saving || !form.name.trim() || !form.imageSrc.trim()}
                  className="pm-save-btn flex items-center justify-center rounded-xl px-7 py-2.5 text-[14px] font-bold transition-all disabled:opacity-50"
                >
                  {saving ? "Saving Product..." : editingSlug ? "Save Changes" : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .pm-modal-shell {
          background:
            radial-gradient(circle at top right, rgba(161, 227, 139, 0.24), transparent 38%),
            radial-gradient(circle at bottom left, rgba(195, 240, 177, 0.22), transparent 40%),
            #ffffff;
          border: 1px solid #dbe8cf;
        }
        .pm-modal-header {
          background: linear-gradient(180deg, #f7fcef 0%, #eef7e3 100%);
        }
        .pm-modal-body {
          background: linear-gradient(180deg, #fdfefb 0%, #f7fbf2 100%);
          padding-bottom: 14px;
        }
        .pm-modal-footer {
          background: linear-gradient(180deg, #f7fbf2 0%, #f2f8e8 100%);
          overflow: visible;
          border-top: 0 !important;
          margin-top: -6px;
          padding-top: 16px;
        }
        .pm-footer-actions {
          padding-right: 24px;
        }
        .pm-form-panel {
          border-radius: 42px !important;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(83, 112, 58, 0.07);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .pm-form-panel:hover {
          transform: translateY(-2px);
          border-color: #d8e7ca;
          box-shadow: 0 18px 34px rgba(83, 112, 58, 0.12);
        }
        .pm-save-btn {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          min-height: 42px;
          min-width: 140px;
          white-space: nowrap;
          color: #ffffff;
          background: linear-gradient(180deg, #21ad1b 0%, #138e13 100%);
          box-shadow: 0 6px 10px rgba(18, 142, 19, 0.18);
        }
        .pm-save-btn:hover:not(:disabled) {
          filter: saturate(1.03) brightness(1.01);
          box-shadow: 0 7px 11px rgba(18, 142, 19, 0.2);
        }
        .pm-save-btn:disabled {
          cursor: not-allowed;
          filter: grayscale(0.08);
          box-shadow: 0 8px 16px rgba(18, 142, 19, 0.18);
        }
        .pm-cancel-btn {
          flex: 0 0 auto;
          min-height: 42px;
          min-width: 96px;
          white-space: nowrap;
          color: #4f5d4d;
          background: linear-gradient(180deg, #ffffff 0%, #f3f8eb 100%);
          box-shadow: inset 0 0 0 1px rgba(146, 168, 126, 0.35), 0 6px 10px rgba(96, 122, 70, 0.1);
        }
        .pm-cancel-btn:hover {
          color: #2f3f2c;
          box-shadow: inset 0 0 0 1px rgba(120, 150, 98, 0.45), 0 8px 12px rgba(96, 122, 70, 0.12);
        }
        .pm-toggle-btn {
          border: 0;
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 800;
          color: #6f7b6d;
          background: transparent;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .pm-toggle-btn:hover {
          color: #2f5f2a;
          background: rgba(255, 255, 255, 0.58);
        }
        .pm-toggle-btn.is-active {
          background: #ffffff;
          color: #16781f;
          box-shadow: 0 6px 12px rgba(90, 117, 66, 0.18);
        }
        .pm-add-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 46px;
          border: 0;
          border-radius: 12px;
          padding: 0 16px;
          cursor: pointer;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          background: linear-gradient(180deg, #21ad1b 0%, #138e13 100%);
          box-shadow: 0 14px 24px rgba(18, 142, 19, 0.25);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }
        .pm-add-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 28px rgba(18, 142, 19, 0.3);
          filter: saturate(1.03);
        }
        .pm-add-button:active {
          transform: translateY(0);
        }
        .pm-add-icon {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          line-height: 1;
          font-size: 14px;
        }
        .input {
          width: 100%;
          border-radius: 22px;
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
          box-shadow: 0 0 0 4px rgba(15, 151, 22, 0.14), 0 6px 16px rgba(15, 151, 22, 0.1);
        }
        .input:hover:not(:focus) {
          border-color: #b5c4a7;
        }
        .pm-toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 0 16px;
        }
        .pm-search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 52px;
          padding: 0 16px;
          border-radius: 8px;
          background: linear-gradient(180deg, #e8f0dc 0%, #e2ecd3 100%);
          color: #6f7d6c;
          font-size: 17px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.62), 0 8px 16px rgba(112, 137, 83, 0.06);
          transition: box-shadow 0.18s ease, transform 0.18s ease;
          cursor: text;
        }
        .pm-search:focus-within {
          box-shadow: inset 0 0 0 1px rgba(25, 136, 22, 0.18), 0 10px 22px rgba(57, 130, 47, 0.12);
        }
        .pm-input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #4f5f4b;
          font-size: 16px;
        }
        .pm-input::placeholder {
          color: #7a8677;
        }
        .pm-dropdown-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pm-filter-wrap {
          position: relative;
          flex: 0 0 auto;
        }
        .pm-filter {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 48px;
          padding: 0 14px;
          border-radius: 12px;
          background: linear-gradient(180deg, #f4f8ed 0%, #eaf2de 100%);
          color: #4f604b;
          font-size: 15px;
          text-decoration: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.82), 0 10px 18px rgba(117, 139, 89, 0.08);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .pm-filter:hover {
          transform: translateY(-1px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 22px rgba(98, 125, 69, 0.12);
          background: linear-gradient(180deg, #f7fbf0 0%, #edf5e2 100%);
        }
        .pm-filter:focus-within {
          box-shadow: inset 0 0 0 1px rgba(23, 137, 29, 0.22), 0 12px 22px rgba(98, 125, 69, 0.12);
        }
        .pm-filter-select {
          min-width: 190px;
          position: relative;
          justify-content: space-between;
          border: 1px solid transparent;
          padding-right: 40px;
        }
        .pm-filter-select.is-open {
          border-color: rgba(47, 151, 42, 0.24);
          background: linear-gradient(180deg, #f8fcf3 0%, #eef7e5 100%);
          box-shadow: inset 0 0 0 1px rgba(23, 137, 29, 0.08), 0 16px 28px rgba(98, 125, 69, 0.14);
        }
        .pm-filter-button {
          border: 0;
          cursor: pointer;
          font-weight: 700;
        }
        .pm-select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #73916c;
          pointer-events: none;
          transition: transform 0.18s ease, color 0.18s ease;
        }
        .pm-filter-select.is-open .pm-select-arrow {
          transform: translateY(-50%) rotate(180deg);
          color: #2d8c2f;
        }
        .pm-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          min-width: 190px;
          padding: 6px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(173, 191, 152, 0.55);
          box-shadow: 0 14px 24px rgba(93, 118, 67, 0.12), 0 4px 10px rgba(93, 118, 67, 0.06);
          backdrop-filter: blur(16px);
          overflow: hidden;
          box-sizing: border-box;
          z-index: 20;
          animation: pmMenuIn 0.18s ease;
        }
        .pm-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          border: 0;
          background: transparent;
          border-radius: 9px;
          padding: 9px 12px;
          color: #4d6247;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.25;
          text-align: left;
          cursor: pointer;
          transition: background 0.16s ease, color 0.16s ease;
        }
        .pm-menu-item:hover {
          background: linear-gradient(180deg, #f3f9ea 0%, #ebf5df 100%);
          color: #24752a;
        }
        .pm-menu-item.active {
          background: linear-gradient(180deg, #25a01d 0%, #1e8e18 100%);
          color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .icon-actions button {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: linear-gradient(180deg, #ffffff 0%, #f3f8eb 100%);
          box-shadow: inset 0 0 0 1px rgba(146, 168, 126, 0.32);
          transition: transform 0.16s ease, box-shadow 0.16s ease, color 0.16s ease, background 0.16s ease;
        }
        .icon-actions button:hover {
          transform: translateY(-1px);
          color: #1f7d16;
          background: linear-gradient(180deg, #fbfff7 0%, #eef8e1 100%);
          box-shadow: inset 0 0 0 1px rgba(23, 126, 20, 0.25), 0 8px 14px rgba(96, 122, 70, 0.14);
        }
        @keyframes pmMenuIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 1200px) {
          .pm-toolbar {
            flex-wrap: wrap;
          }
          .pm-dropdown-group {
            width: 100%;
            flex-wrap: wrap;
          }
          .pm-filter-wrap {
            flex: 1 1 calc(50% - 8px);
          }
          .pm-filter-select,
          .pm-menu {
            width: 100%;
            min-width: 0;
          }
          .pm-search {
            width: 100%;
            flex: 1 1 100%;
          }
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
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M5 7h14M8 12h8m-5 5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconExport() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M12 5v9m0 0-3-3m3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 16.5V18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
