import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { readDb } from "@/lib/backend/db";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/backend/auth";
import ProductManager from "@/components/admin/product-manager";

export const metadata: Metadata = {
  title: "Product Management | GoFarm",
  description: "Product management screen for GoFarm admin.",
};

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  
  const db = await readDb();
  const currentUser = session ? db.users.find((u) => u.id === session.sub) : null;
  const adminName = currentUser?.name || "Admin";
  const adminRole = currentUser?.role === "admin" ? "Catalog Manager" : "Staff";

  return (
    <AdminShell
      activeHref="/admin/products"
      title="Product Management"
      subtitle=""
      searchPlaceholder="Search products, brands, categories..."
      userName={adminName}
      userRole={adminRole}
      userLabel=""
    >
      <ProductManager />
    </AdminShell>
  );
}
