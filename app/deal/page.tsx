import Link from "next/link";
// ĐÃ XÓA: import SiteHeader from "@/components/site-header";
import { loadLocalCatalog, type LocalProduct } from "@/lib/local-catalog";
import RealCountdown from "./RealCountDown";
import SubscribeButton from "./SubscribeButton";
import DealList from "./DealList";
import ProductShareHandler from "@/components/home/ProductShareHandler"; // THÊM DÒNG NÀY

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

function salePriceFor(product: LocalProduct) {
  return product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
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

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </Icon>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </Icon>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </Icon>
  );
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </Icon>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
      <div className="flex items-center gap-2 text-white/80 mb-1">
        <BagIcon className="w-4 h-4" />
        <span className="text-xs sm:text-sm">{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-bold">{value}</p>
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
      <div className="p-4 sm:p-6 text-center">
        <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10">
          {icon}
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function FooterContactCard({
  href,
  icon,
  title,
  description,
  target = "_self",
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  target?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer"
    >
      <div className="text-gray-600 group-hover:text-primary transition-colors">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">{description}</p>
      </div>
    </a>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-gofarm-black mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <a className="text-gofarm-gray hover:text-gofarm-green text-sm font-medium hoverEffect capitalize" href="#">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DealPage() {
  const { products } = await loadLocalCatalog();

  const dealSlugs = ["brownie-flavor", "cake-mix", "cauliflower", "fresh-apple", "waffle-homestyle"];
  const dealProducts = dealSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is LocalProduct => Boolean(product));

  const quickLinks = ["About Us", "Contact Us", "Terms & Conditions", "Privacy Policy", "Track Order", "Help"];
  const categories = ["Ice and Cold", "Dry Food", "Fast Food", "Fruits", "Fish", "Vegetables"];

  return (
    <div className="min-h-screen bg-linear-to-b from-red-50 to-orange-50">
      <main>
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 py-8 sm:py-12">
          <section className="rounded-xl bg-linear-to-r from-red-500 to-orange-500 text-white border-0 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-2 bg-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-2">
                      <FlameIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                      <span className="text-xs sm:text-sm font-semibold">HOT DEALS</span>
                    </div>
                    <div className="inline-flex items-center rounded-md bg-red-700/80 px-2.5 py-0.5 text-xs sm:text-sm font-semibold shadow-sm">
                      Up to 10% OFF
                    </div>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                      Weekly Hot Deals
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                      Don&apos;t miss out on these incredible limited-time offers! Save big on your favorite products with discounts up to 10% off. Limited stock available.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <StatBox label="Products" value="5" />
                    <StatBox label="Avg. Discount" value="10%" />
                    <StatBox label="Happy Customers" value="2.5K+" />
                  </div>
                </div>

                <div className="lg:shrink-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 sm:gap-2 text-red-600">
                        <TimerIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base font-semibold">Deal Ends In:</span>
                      </div>
                      <RealCountdown />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="max-w-(--breakpoint-xl) mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCard
              tone="bg-yellow-50 border-yellow-200"
              title="Lightning Deals"
              description="Flash sales with limited time offers"
              icon={<ZapIcon className="w-8 h-8 text-yellow-600" />}
            />
            <FeatureCard
              tone="bg-purple-50 border-purple-200"
              title="Premium Quality"
              description="Top-rated products with best reviews"
              icon={<StarIcon className="w-8 h-8 text-purple-600" />}
            />
            <FeatureCard
              tone="bg-pink-50 border-pink-200"
              title="Customer Favorites"
              description="Most loved items by our customers"
              icon={<HeartIcon className="w-8 h-8 text-pink-600" />}
            />
            <FeatureCard
              tone="bg-red-50 border-red-200"
              title="Limited Time"
              description="Hurry! These deals won't last long"
              icon={<ClockIcon className="w-8 h-8 text-red-600" />}
            />
          </div>
        </div>

        <div className="max-w-(--breakpoint-xl) mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <FlameIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0">Hot Deals Collection</h2>
              <FlameIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Discover amazing deals on premium products. Limited quantities available at these special prices.
            </p>
          </div>

          <DealList products={dealProducts} />
        </div>

        <div className="max-w-(--breakpoint-xl) mx-auto px-4 py-8 sm:py-12">
          <div
            className="rounded-2xl px-6 py-8 text-center shadow-[0_16px_35px_rgba(37,168,67,0.28)] sm:px-10 sm:py-12"
            style={{ background: "linear-gradient(90deg, #2eaf4e 0%, #2ea447 50%, #58a63f 100%)" }}
          >
            <h3 className="text-2xl font-extrabold sm:text-3xl text-white">Don&apos;t Miss Out on These Amazing Deals!</h3>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-white/90 sm:text-base">
              Subscribe to our newsletter to get notified about fresh sales, exclusive deals, and new arrivals.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm transition-transform hover:scale-[1.02]"
              >
                Explore All Products
              </Link>
              <SubscribeButton />
            </div>
          </div>
        </div>

        <footer className="bg-gofarm-white border-t border-gofarm-light-gray mt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
              <FooterContactCard
                href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA"
                target="_blank"
                icon={<MapPinIcon className="h-6 w-6" />}
                title="Visit Us"
                description="123 Shopping Street, Commerce District, New York, NY 10001, USA"
              />
              <FooterContactCard
                href="tel:15551234567"
                icon={<PhoneIcon className="h-6 w-6" />}
                title="Call Us"
                description="+1 (555) 123-4567"
              />
              <div className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
                <div className="text-gray-600 group-hover:text-primary transition-colors">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Working Hours</h3>
                  <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">Monday - Friday: 9AM - 6PM</p>
                </div>
              </div>
              <FooterContactCard
                href="mailto:support@gofarm.com"
                icon={<MailIcon className="h-6 w-6" />}
                title="Email Us"
                description="support@gofarm.com"
              />
            </div>

            <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="mb-2">
                  <Link href="/">
                    <img alt="logo" loading="lazy" width="150" height="150" className="h-8 w-32" src="/images/logo.svg" />
                  </Link>
                </div>
                <p className="text-gofarm-gray text-sm">
                  Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.
                </p>
                <div className="flex items-center gap-3.5 text-gofarm-black/60">
                </div>
              </div>

              <FooterColumn title="Quick Links" items={quickLinks} />
              <FooterColumn title="Categories" items={categories} />

              <div>
                <h3 className="font-semibold text-gofarm-black mb-4">Newsletter</h3>
                <p className="text-gofarm-gray text-sm mb-4">Subscribe to our newsletter to receive updates and exclusive offers.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gofarm-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-light-green focus:border-gofarm-light-green disabled:bg-gofarm-light-gray/50 disabled:cursor-not-allowed transition-all text-gofarm-black placeholder:text-gofarm-gray"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gofarm-green text-gofarm-white px-4 py-2 rounded-lg hover:bg-gofarm-light-green transition-colors disabled:bg-gofarm-gray disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                  >
                    Subscribe
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            <div className="py-6 border-t border-gofarm-light-gray text-center text-sm text-gofarm-gray">
              <p>
                © 2026{" "}
                <span className="text-gofarm-black font-black tracking-wider uppercase hover:text-gofarm-green hoverEffect group font-sans">
                  Gofar<span className="text-gofarm-green group-hover:text-gofarm-black hoverEffect">m</span>
                </span>
                . All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
      
      {/* THÊM ProductShareHandler VÀO ĐÂY */}
      <ProductShareHandler products={dealProducts} />
    </div>
  );
}