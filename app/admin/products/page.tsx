import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import ProductManager from "@/components/admin/product-manager";

export const metadata: Metadata = {
  title: "Product Management | GoFarm",
  description: "Product management screen for GoFarm admin.",
};

export default function ProductsPage() {
  return (
    <AdminShell
      activeHref="/admin/products"
      title="Product Management"
      subtitle=""
      searchPlaceholder="Search products, brands, categories..."
      userName="Admin"
      userRole="Catalog Manager"
      userLabel=""
    >
      <ProductManager />
    </AdminShell>
  );
}
