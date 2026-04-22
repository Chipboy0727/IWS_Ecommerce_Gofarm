import type { Metadata } from "next";
// ĐÃ XÓA: import SiteHeader from "@/components/site-header";
import StoreListBrowser from "./store-list-browser";
import { storeItems } from "@/lib/store-list-data";

export const metadata: Metadata = {
  title: "Local Stores | gofarm",
  description: "Find a GoFarm store near you and visit us today.",
};

export default function StoreListPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gofarm-light-green/5 via-white to-gofarm-light-orange/10">
      {/* ĐÃ XÓA: <SiteHeader /> */}
      <main>
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 lg:py-12">
          <StoreListBrowser stores={storeItems} />
        </div>
      </main>
    </div>
  );
}