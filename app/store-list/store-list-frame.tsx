import type { Metadata } from "next";
import StoreListBrowser from "./store-list-browser";
import { storeItems } from "@/lib/store-list-data";

export const metadata: Metadata = {
  title: "Local Stores | gofarm",
  description: "Find a GoFarm store near you and visit us today.",
};

export default function StoreListPage() {
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