"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

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

type CategoryFormState = {
  title: string;
  slug: string;
  imageSrc: string;
};

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

const emptyForm = (): ProductFormState => ({
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
});

const emptyCategoryForm = (): CategoryFormState => ({
  title: "",
  slug: "",
  imageSrc: "",
});

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function salePrice(product: LocalProduct) {
  return product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Request failed";
}

function mapProductToForm(product: LocalProduct): ProductFormState {
  return {
    name: product.name ?? "",
    slug: product.slug ?? "",
    imageSrc: product.imageSrc ?? "/images/logo.svg",
    imageAlt: product.imageAlt ?? "",
    price: String(product.price ?? 0),
    discount: product.discount === null || product.discount === undefined ? "" : String(product.discount),
    brand: product.brand ?? "",
    categoryId: product.categoryId ?? "",
    categoryTitle: product.categoryTitle ?? "",
    description: product.description ?? "",
    rating: String(product.rating ?? 0),
    reviews: String(product.reviews ?? 0),
    stock: product.stock === null || product.stock === undefined ? "" : String(product.stock),
    status: product.status ?? "new",
  };
}

function mapCategoryToForm(category: LocalCategory): CategoryFormState {
  return {
    title: category.title ?? "",
    slug: category.slug ?? "",
    imageSrc: category.imageSrc ?? "",
  };
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loginEmail, setLoginEmail] = useState("admin@gofarm.local");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [usersError, setUsersError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm());
  const [notice, setNotice] = useState("");

  const selectedProduct = useMemo(
    () => products.find((product) => product.slug === selectedSlug) ?? null,
    [products, selectedSlug]
  );

  async function fetchMe() {
    setLoadingAuth(true);
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = (await response.json()) as { user: AdminUser };
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function fetchProducts() {
    setLoadingProducts(true);
    setProductsError("");
    try {
      const response = await fetch("/api/products?paginated=true&page=1&limit=100", {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Failed to load products (${response.status})`);
      }
      const data = (await response.json()) as {
        products: LocalProduct[];
        categories: LocalCategory[];
      };
      setProducts(data.products);
      setCategories(data.categories);
    } catch (error) {
      setProductsError(getErrorMessage(error));
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchUsers() {
    setLoadingUsers(true);
    setUsersError("");
    try {
      const response = await fetch("/api/users", {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Failed to load users (${response.status})`);
      }
      const data = (await response.json()) as { users: AdminUserRow[] };
      setUsers(data.users);
    } catch (error) {
      setUsersError(getErrorMessage(error));
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    void fetchMe();
  }, []);

  useEffect(() => {
    if (!user?.role) return;
    void fetchProducts();
    void fetchUsers();
  }, [user?.role]);

  function resetForm() {
    setForm(emptyForm());
    setSelectedSlug(null);
    setNotice("");
  }

  function startEdit(product: LocalProduct) {
    setSelectedSlug(product.slug);
    setForm(mapProductToForm(product));
    setNotice("");
  }

  function resetCategoryForm() {
    setCategoryForm(emptyCategoryForm());
    setSelectedCategorySlug(null);
  }

  function startEditCategory(category: LocalCategory) {
    setSelectedCategorySlug(category.slug);
    setCategoryForm(mapCategoryToForm(category));
    setNotice("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setLoadingAuth(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = (await response.json()) as { error?: string; user?: AdminUser };
      if (!response.ok) {
        throw new Error(data.error ?? "Login failed");
      }

      const nextUser = data.user ?? null;
      setUser(nextUser);
      setLoadingAuth(false);
      if (nextUser?.role === "admin") {
        void fetchProducts();
        void fetchUsers();
      }
    } catch (error) {
      setAuthError(getErrorMessage(error));
      setLoadingAuth(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setProducts([]);
    setCategories([]);
    resetForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setProductsError("");

    const payload = {
      name: form.name,
      slug: form.slug,
      imageSrc: form.imageSrc,
      imageAlt: form.imageAlt,
      price: Number(form.price || 0),
      discount: form.discount === "" ? null : Number(form.discount),
      brand: form.brand || null,
      categoryId: form.categoryId || null,
      categoryTitle: form.categoryTitle || null,
      description: form.description,
      rating: Number(form.rating || 0),
      reviews: Number(form.reviews || 0),
      stock: form.stock === "" ? null : Number(form.stock),
      status: form.status || null,
    };

    const method = selectedProduct ? "PATCH" : "POST";
    const endpoint = selectedProduct ? `/api/products/${selectedProduct.slug}` : "/api/products";

    try {
      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save product");
      }

      setNotice(selectedProduct ? "Product updated." : "Product created.");
      resetForm();
      await fetchProducts();
    } catch (error) {
      setProductsError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setProductsError("");
    try {
      const method = selectedCategorySlug ? "PATCH" : "POST";
      const endpoint = selectedCategorySlug ? `/api/categories/${selectedCategorySlug}` : "/api/categories";
      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save category");
      }
      setNotice(selectedCategorySlug ? "Category updated." : "Category created.");
      resetCategoryForm();
      await fetchProducts();
    } catch (error) {
      setProductsError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(category: LocalCategory) {
    const confirmed = window.confirm(`Delete category ${category.title}?`);
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/categories/${category.slug}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete category");
      }
      if (selectedCategorySlug === category.slug) {
        resetCategoryForm();
      }
      setNotice("Category deleted.");
      await fetchProducts();
    } catch (error) {
      setProductsError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: LocalProduct) {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/products/${product.slug}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete product");
      }
      if (selectedSlug === product.slug) {
        resetForm();
      }
      setNotice("Product deleted.");
      await fetchProducts();
    } catch (error) {
      setProductsError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const stats = [
    { label: "Products", value: products.length },
    { label: "Categories", value: categories.length },
    { label: "Featured", value: products.filter((product) => product.rating >= 4).length },
    { label: "Low stock", value: products.filter((product) => typeof product.stock === "number" && product.stock <= 10).length },
  ];

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-gofarm-light-green/40 bg-white px-6 py-5 text-gofarm-gray shadow-lg">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-gofarm-light-green/40 bg-white/95 p-8 shadow-[0_20px_60px_rgba(16,185,129,0.12)]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gofarm-green">Admin Access</p>
              <h1 className="mt-4 text-4xl font-black text-gofarm-black">Green admin panel for gofarm</h1>
              <p className="mt-4 max-w-2xl text-base text-gofarm-gray">
                Sign in to manage products, review categories, and operate the REST backend from a dashboard that matches the storefront style.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "RESTful product CRUD",
                  "Session-based auth",
                  "Pagination and sorting",
                  "Green themed UI",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-gofarm-light-green/30 bg-gofarm-light-orange/10 px-4 py-3 text-sm font-semibold text-gofarm-black">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <Link href="/" className="rounded-full border border-gofarm-green px-5 py-2.5 text-sm font-semibold text-gofarm-green transition-colors hover:bg-gofarm-green hover:text-white">
                  Back to storefront
                </Link>
                <span className="text-sm text-gofarm-gray">Use admin@gofarm.local / admin123</span>
              </div>
            </div>

            <div className="rounded-[28px] border border-gofarm-light-green/40 bg-white p-8 shadow-[0_20px_60px_rgba(16,185,129,0.12)]">
              <div className="rounded-2xl bg-linear-to-br from-gofarm-green to-emerald-600 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Sign In</p>
                <h2 className="mt-3 text-3xl font-black">Access dashboard</h2>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gofarm-black">Email</label>
                  <input
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    type="email"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-gofarm-green"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gofarm-black">Password</label>
                  <input
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    type="password"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-gofarm-green"
                  />
                </div>
                {authError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {authError}
                  </div>
                ) : null}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gofarm-green px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gofarm-green/50 transition hover:bg-gofarm-light-green"
                >
                  Sign in to admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10">
      <div className="border-b border-gofarm-light-green/40 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gofarm-green">gofarm admin</p>
            <h1 className="mt-1 text-2xl font-black text-gofarm-black">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-gofarm-light-orange/40 px-4 py-2 text-sm font-semibold text-gofarm-green md:inline-flex">
              {user.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-gofarm-green px-4 py-2 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="rounded-[30px] border border-gofarm-light-green/40 bg-white p-6 shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl bg-gofarm-light-orange/10 p-5">
                <p className="text-sm font-semibold text-gofarm-gray">{item.label}</p>
                <p className="mt-2 text-4xl font-black text-gofarm-black">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[30px] border border-gofarm-light-green/40 bg-white p-6 shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gofarm-green">
                  {selectedProduct ? "Edit product" : "New product"}
                </p>
                <h2 className="mt-1 text-2xl font-black text-gofarm-black">
                  {selectedProduct ? selectedProduct.name : "Create a product"}
                </h2>
              </div>
              {selectedProduct ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-gofarm-green px-4 py-2 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
                >
                  New
                </button>
              ) : null}
            </div>

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              {[
                ["name", "Name"],
                ["slug", "Slug"],
                ["imageSrc", "Image URL"],
                ["imageAlt", "Image Alt"],
                ["price", "Price"],
                ["discount", "Discount %"],
                ["brand", "Brand"],
                ["categoryId", "Category ID"],
                ["categoryTitle", "Category Title"],
                ["rating", "Rating"],
                ["reviews", "Reviews"],
                ["stock", "Stock"],
                ["status", "Status"],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-semibold text-gofarm-black">{label}</span>
                  <input
                    value={form[key as keyof ProductFormState]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gofarm-green"
                    placeholder={label}
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-gofarm-black">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows={5}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gofarm-green"
                  placeholder="Product description"
                />
              </label>

              {productsError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                  {productsError}
                </div>
              ) : null}
              {notice ? (
                <div className="rounded-2xl border border-gofarm-green/25 bg-gofarm-green/5 px-4 py-3 text-sm font-medium text-gofarm-green sm:col-span-2">
                  {notice}
                </div>
              ) : null}

              <div className="flex items-center gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gofarm-green px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gofarm-green/50 transition hover:bg-gofarm-light-green disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : selectedProduct ? "Update product" : "Create product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-gofarm-light-green px-5 py-3.5 text-sm font-semibold text-gofarm-black transition hover:border-gofarm-green hover:text-gofarm-green"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[30px] border border-gofarm-light-green/40 bg-white p-6 shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gofarm-green">Products</p>
                <h2 className="mt-1 text-2xl font-black text-gofarm-black">Catalog data</h2>
              </div>
              <button
                type="button"
                onClick={fetchProducts}
                className="rounded-full border border-gofarm-green px-4 py-2 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200">
              <div className="max-h-[780px] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="sticky top-0 bg-gofarm-light-orange/20">
                    <tr className="text-xs uppercase tracking-[0.2em] text-gofarm-gray">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {loadingProducts ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-gofarm-gray">
                          Loading products...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-gofarm-gray">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const isSelected = product.slug === selectedSlug;
                        return (
                          <tr key={product.id} className={isSelected ? "bg-gofarm-light-orange/10" : ""}>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.imageSrc}
                                  alt={product.imageAlt}
                                  className="h-14 w-14 rounded-2xl border border-gray-200 object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-gofarm-black">{product.name}</p>
                                  <p className="text-sm text-gofarm-gray">{product.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-gofarm-green">{currency(salePrice(product))}</span>
                                {product.discount ? (
                                  <span className="text-sm text-gofarm-gray line-through">{currency(product.price)}</span>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="rounded-full bg-gofarm-light-orange/30 px-3 py-1 text-sm font-semibold text-gofarm-black">
                                {typeof product.stock === "number" ? product.stock : "n/a"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gofarm-gray">{product.categoryTitle ?? "Uncategorized"}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEdit(product)}
                                  className="rounded-full border border-gofarm-green px-3 py-1.5 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDelete(product)}
                                  className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[30px] border border-gofarm-light-green/40 bg-white p-6 shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gofarm-green">Categories</p>
                <h2 className="mt-1 text-2xl font-black text-gofarm-black">
                  {selectedCategorySlug ? "Edit category" : "New category"}
                </h2>
              </div>
              {selectedCategorySlug ? (
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="rounded-full border border-gofarm-green px-4 py-2 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
                >
                  New
                </button>
              ) : null}
            </div>

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleCategorySubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gofarm-black">Title</span>
                <input
                  value={categoryForm.title}
                  onChange={(event) => setCategoryForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gofarm-green"
                  placeholder="Category title"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gofarm-black">Slug</span>
                <input
                  value={categoryForm.slug}
                  onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gofarm-green"
                  placeholder="Category slug"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-gofarm-black">Image URL</span>
                <input
                  value={categoryForm.imageSrc}
                  onChange={(event) => setCategoryForm((current) => ({ ...current, imageSrc: event.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gofarm-green"
                  placeholder="/images/..."
                />
              </label>

              <div className="flex items-center gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gofarm-green px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gofarm-green/50 transition hover:bg-gofarm-light-green disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : selectedCategorySlug ? "Update category" : "Create category"}
                </button>
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="rounded-2xl border border-gofarm-light-green px-5 py-3.5 text-sm font-semibold text-gofarm-black transition hover:border-gofarm-green hover:text-gofarm-green"
                >
                  Clear
                </button>
              </div>
            </form>

            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200">
              <div className="max-h-[520px] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="sticky top-0 bg-gofarm-light-orange/20">
                    <tr className="text-xs uppercase tracking-[0.2em] text-gofarm-gray">
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Count</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-gofarm-gray">
                          No categories found.
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => {
                        const isSelected = category.slug === selectedCategorySlug;
                        return (
                          <tr key={category.id} className={isSelected ? "bg-gofarm-light-orange/10" : ""}>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={category.imageSrc ?? "/images/logo.svg"}
                                  alt={category.title}
                                  className="h-12 w-12 rounded-2xl border border-gray-200 object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-gofarm-black">{category.title}</p>
                                  <p className="text-sm text-gofarm-gray">{category.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="rounded-full bg-gofarm-light-orange/30 px-3 py-1 text-sm font-semibold text-gofarm-black">
                                {category.count}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditCategory(category)}
                                  className="rounded-full border border-gofarm-green px-3 py-1.5 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteCategory(category)}
                                  className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-gofarm-light-green/40 bg-white p-6 shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gofarm-green">Users</p>
                <h2 className="mt-1 text-2xl font-black text-gofarm-black">Access list</h2>
              </div>
              <button
                type="button"
                onClick={fetchUsers}
                className="rounded-full border border-gofarm-green px-4 py-2 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200">
              <div className="max-h-[520px] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="sticky top-0 bg-gofarm-light-orange/20">
                    <tr className="text-xs uppercase tracking-[0.2em] text-gofarm-gray">
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-gofarm-gray">
                          Loading users...
                        </td>
                      </tr>
                    ) : usersError ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-red-500">
                          {usersError}
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-gofarm-gray">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-semibold text-gofarm-black">{item.name}</p>
                              <p className="text-sm text-gofarm-gray">{item.id.slice(0, 8)}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-gofarm-light-orange/30 px-3 py-1 text-sm font-semibold text-gofarm-black">
                              {item.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gofarm-gray">{item.email}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
