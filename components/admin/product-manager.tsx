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
                          className="h-10 w-10 rounded-[10px] object-cover"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#243322]">{editingSlug ? "Edit Product" : "Create Product"}</h3>
                <p className="mt-1 text-sm text-[#6f7b6d]">Use the API-backed form to persist changes.</p>
              </div>
              <button type="button" onClick={closeModal} className="text-sm font-semibold text-[#6f7b6d] hover:text-[#243322]">
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <Field label="Name">
                <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="input" required />
              </Field>
              <Field label="Slug">
                <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="input" />
              </Field>
              <Field label="Image URL">
                <input value={form.imageSrc} onChange={(e) => updateField("imageSrc", e.target.value)} className="input" required />
              </Field>
              <Field label="Image Alt">
                <input value={form.imageAlt} onChange={(e) => updateField("imageAlt", e.target.value)} className="input" required />
              </Field>
              <Field label="Price">
                <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="input" required />
              </Field>
              <Field label="Discount">
                <input type="number" min="0" step="1" value={form.discount} onChange={(e) => updateField("discount", e.target.value)} className="input" />
              </Field>
              <Field label="Brand">
                <input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} className="input" />
              </Field>
              <Field label="Category">
                <select value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className="input">
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Rating">
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => updateField("rating", e.target.value)} className="input" />
              </Field>
              <Field label="Reviews">
                <input type="number" min="0" step="1" value={form.reviews} onChange={(e) => updateField("reviews", e.target.value)} className="input" />
              </Field>
              <Field label="Stock">
                <input type="number" min="0" step="1" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} className="input" />
              </Field>
              <Field label="Status">
                <input value={form.status} onChange={(e) => updateField("status", e.target.value)} className="input" />
              </Field>
              <Field label="Description" className="md:col-span-2">
                <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="input min-h-28" />
              </Field>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="rounded-xl border border-[#dce4d1] px-5 py-3 text-sm font-semibold text-[#4d5d4b]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#0f9716] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? "Saving..." : editingSlug ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #dce4d1;
          background: #fff;
          padding: 12px 14px;
          font-size: 14px;
          color: #243322;
          outline: none;
        }
        .input:focus {
          border-color: #0f9716;
          box-shadow: 0 0 0 3px rgba(15, 151, 22, 0.12);
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#748171]">{label}</span>
      {children}
    </label>
  );
}
