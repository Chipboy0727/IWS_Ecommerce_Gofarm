import type { Metadata } from "next";
import StoreListBrowser from "./store-list-browser";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Local Stores | gofarm",
  description: "Find a GoFarm store near you and visit us today.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StoreListPage() {
  const db = await readDb();

  const storeItems = db.stores.map((store) => ({
    id: store.id,
    name: store.name,
    address: store.address,
    phone: store.phone,
    email: store.email,
    country: store.country,
    hours: store.hours || "Monday - Sunday: 8AM - 8PM",
    city: store.city,
    pinX: store.pinX || 0,
    pinY: store.pinY || 0,
    tint: (store.status === "Maintenance" ? "red" : "green") as "green" | "red",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50/30">
      <main>
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <StoreListBrowser stores={storeItems} />
        </div>
      </main>
    </div>
  );
}