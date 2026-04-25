import Link from "next/link";

import { loadLocalCatalog, type LocalProduct } from "@/lib/local-catalog";
import RealCountdown from "./real-countdown";
import SubscribeButton from "./subscribe-button";
import DealList from "./deal-list";
import ProductShareHandler from "@/components/home/product-share-handler";

export const metadata = {
  title: "Hot Deal | gofarm",
  description: "Weekly hot deals and featured savings at gofarm.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

function Icon({
  children,
  className = "h-5 w-5",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
    </Icon>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </Icon>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </Icon>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </Icon>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icon>
  );
}

function TimerIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </Icon>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M16 10a4 4 0 0 1-8 0" />
      <path d="M3.103 6.034h17.794" />
      <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
    </Icon>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 md:p-4">
      <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 mb-0.5 sm:mb-1">
        <BagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-[10px] sm:text-xs md:text-sm">{label}</span>
      </div>
      <p className="text-base sm:text-xl md:text-2xl font-bold">{value}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  tone,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className={`rounded-xl text-card-foreground shadow-sm ${tone} border-2 hover:shadow-lg transition-all duration-300`}>
      <div className="p-3 sm:p-4 md:p-6 text-center">
        <div className="mx-auto mb-2 sm:mb-3 flex h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-1 sm:mb-2">{title}</h3>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default async function DealPage() {
  const { products } = await loadLocalCatalog();

  const dealSlugs = ["brownie-flavor", "cake-mix", "cauliflower", "fresh-apple", "waffle-homestyle"];
  const dealProducts = dealSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is LocalProduct => Boolean(product));

  return (
    <div className="min-h-screen bg-linear-to-b from-red-50 to-orange-50">
      <main>
        <div className="max-w-(--breakpoint-xl) mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
          <section className="rounded-xl bg-linear-to-r from-red-500 to-orange-500 text-white border-0 shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6 lg:gap-8">
                <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-2 bg-white/20 rounded-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2">
                      <FlameIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-300" />
                      <span className="text-[10px] sm:text-xs md:text-sm font-semibold">HOT DEALS</span>
                    </div>
                    <div className="inline-flex items-center rounded-md bg-red-700/80 px-1.5 sm:px-2 md:px-2.5 py-0.5 text-[9px] sm:text-xs md:text-sm font-semibold shadow-sm">
                      Up to 10% OFF
                    </div>
                  </div>

                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1.5 sm:mb-2 md:mb-4">
                      Weekly Hot Deals
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-2xl">
                      Don&apos;t miss out on these incredible limited-time offers! Save big on your favorite products with discounts up to 10% off. Limited stock available.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    <StatBox label="Products" value="5" />
                    <StatBox label="Avg. Discount" value="10%" />
                    <StatBox label="Happy Customers" value="2.5K+" />
                  </div>
                </div>

                <div className="lg:shrink-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 sm:gap-2 text-red-600">
                        <TimerIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm md:text-base font-semibold">Deal Ends In:</span>
                      </div>
                      <RealCountdown />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="max-w-(--breakpoint-xl) mx-auto px-3 sm:px-4 py-5 sm:py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <FeatureCard
              tone="bg-yellow-50 border-yellow-200"
              title="Lightning Deals"
              description="Flash sales with limited time offers"
              icon={<ZapIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-600" />}
            />
            <FeatureCard
              tone="bg-purple-50 border-purple-200"
              title="Premium Quality"
              description="Top-rated products with best reviews"
              icon={<StarIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" />}
            />
            <FeatureCard
              tone="bg-pink-50 border-pink-200"
              title="Customer Favorites"
              description="Most loved items by our customers"
              icon={<HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-pink-600" />}
            />
            <FeatureCard
              tone="bg-red-50 border-red-200"
              title="Limited Time"
              description="Hurry! These deals won't last long"
              icon={<ClockIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />}
            />
          </div>
        </div>

        <div className="max-w-(--breakpoint-xl) mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <FlameIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-500" />
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-0">Hot Deals Collection</h2>
              <FlameIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Discover amazing deals on premium products. Limited quantities available at these special prices.
            </p>
          </div>

          <DealList products={dealProducts} />
        </div>

        <div className="max-w-(--breakpoint-xl) mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
          <div
            className="rounded-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12 text-center shadow-[0_16px_35px_rgba(37,168,67,0.28)]"
            style={{ background: "linear-gradient(90deg, #2eaf4e 0%, #2ea447 50%, #58a63f 100%)" }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white">Don&apos;t Miss Out on These Amazing Deals!</h3>
            <p className="mx-auto mt-2 sm:mt-3 max-w-3xl text-xs sm:text-sm md:text-base text-white/90 px-2">
              Subscribe to our newsletter to get notified about fresh sales, exclusive deals, and new arrivals.
            </p>
            <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-semibold text-black shadow-sm transition-transform hover:scale-[1.02]"
              >
                Explore All Products
              </Link>
              <SubscribeButton />
            </div>
          </div>
        </div>
      </main>

      {/* ProductShareHandler and ShareModal */}
      <ProductShareHandler products={dealProducts} />
    </div>
  );
}