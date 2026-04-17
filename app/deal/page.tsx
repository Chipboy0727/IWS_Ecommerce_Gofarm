import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { loadLocalCatalog, type LocalProduct } from "@/lib/local-catalog";

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

function DealCard({ product }: { product: LocalProduct }) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";

  return (
    <article className="group overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] bg-white">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
            {status}
          </span>
          {product.discount ? (
            <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
              -{product.discount}%
            </span>
          ) : null}
        </div>

        <img
          src={product.imageSrc}
          alt={product.imageAlt}
          className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="px-4 pb-4">
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="text-[16px] font-bold text-gofarm-black group-hover:text-gofarm-green transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1 text-[12px] text-gofarm-gray">
          <span className="text-gofarm-orange">★</span>
          <span className="font-semibold text-gofarm-black">{product.rating.toFixed(1)}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-2 flex items-end gap-2 flex-wrap">
          <span className="text-[20px] font-bold text-gofarm-green leading-none">{formatPrice(salePrice)}</span>
          {product.discount ? (
            <>
              <span className="text-[16px] font-semibold text-gray-500 line-through leading-none">
                {formatPrice(product.price)}
              </span>
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">
                -{product.discount}%
              </span>
            </>
          ) : null}
        </div>

        <button className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-gofarm-light-green/35 bg-white px-4 py-2.5 text-sm font-semibold text-gofarm-black transition-all duration-200 hover:border-gofarm-green hover:bg-gofarm-light-orange/10">
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
}

function FeatureBox({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white px-5 py-5 shadow-sm">
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-xl">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="text-sm font-bold text-gofarm-black">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-gofarm-gray">{description}</p>
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="text-sm font-bold text-gofarm-black">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-gofarm-gray">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/12 px-4 py-3">
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">{label}</div>
    </div>
  );
}

function CountBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-white px-2 py-2 shadow-sm">
      <div className="text-lg font-extrabold text-gofarm-green">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gofarm-gray">{label}</div>
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
    <div className="min-h-screen bg-[#f8efe6]">
      <SiteHeader />

      <main className="max-w-(--breakpoint-xl) mx-auto px-4 py-8 lg:py-10">
        <section
          className="mx-auto max-w-4xl rounded-2xl px-6 py-6 text-white shadow-[0_18px_45px_rgba(255,105,0,0.28)] lg:px-8 lg:py-8"
          style={{ background: "linear-gradient(90deg, #ff4d21 0%, #ff6a00 100%)" }}
        >
          <div className="flex flex-wrap items-center gap-3 text-white/90">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              Hot Deal
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Up to 10% off</span>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight lg:text-5xl">Weekly Hot Deals</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 lg:text-base">
                Don&apos;t miss our incredible limited-time offers. Save big on our favorite products with discounts up to 10% off.
                Limited stock available.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniStat label="Products" value="5" />
                <MiniStat label="Discount" value="10%" />
                <MiniStat label="Happy Customers" value="2.5k+" />
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white/15 px-4 py-3">
                <div className="text-sm font-semibold">Deal ends in</div>
                <div className="grid grid-cols-4 gap-2 text-center text-gofarm-black">
                  <CountBox value="02" label="Days" />
                  <CountBox value="14" label="Hours" />
                  <CountBox value="35" label="Mins" />
                  <CountBox value="38" label="Secs" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureBox icon="⚡" title="Lightning Deals" description="Flash sales with limited time offers" />
          <FeatureBox icon="✨" title="Premium Quality" description="Hand-picked products with best values" />
          <FeatureBox icon="♡" title="Customer Favorites" description="Most loved items by our customers" />
          <FeatureBox icon="⏱" title="Limited Time" description="Hurry! These deals won't last long" />
        </section>

        <section className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 text-[#ff4d21]">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl font-extrabold text-gofarm-black lg:text-3xl">Hot Deals Collection</h2>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="mt-2 text-sm text-gofarm-gray lg:text-base">
            Discover amazing deals on premium products. Limited quantities available at these special prices.
          </p>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {dealProducts.map((product) => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-2xl bg-[#25a843] px-6 py-8 text-center text-white shadow-[0_16px_35px_rgba(37,168,67,0.28)]">
            <h3 className="text-2xl font-extrabold">Don&apos;t Miss Out on These Amazing Deals!</h3>
            <p className="mt-2 text-sm text-white/90">
              Subscribe to our newsletter to get notified about fresh sales, exclusive deals, and new arrivals.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gofarm-black"
              >
                Explore All Products
              </Link>
              <button className="inline-flex items-center justify-center rounded-md border border-white/60 px-5 py-2.5 text-sm font-semibold text-white">
                Subscribe for Deals
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-8 rounded-t-3xl bg-white px-4 py-8 shadow-[0_-1px_10px_rgba(15,23,42,0.04)] lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1.2fr_1.2fr_1.1fr]">
            <div>
              <Link href="/" className="inline-flex items-center">
                <img src="/images/logo.svg" alt="gofarm" className="h-8 w-auto" />
              </Link>
              <p className="mt-4 text-sm leading-6 text-gofarm-gray">
                Your trusted online shopping destination for quality products, fast delivery, and dependable service.
              </p>
            </div>
            <FooterColumn title="Quick Links" items={["About Us", "Contact Us", "Terms & Conditions", "Privacy Policy", "Track Order", "Help"]} />
            <FooterColumn title="Categories" items={["Ice and Cold", "Dry Food", "Fast Food", "Fruits", "Fish", "Vegetables"]} />
            <div>
              <h4 className="text-sm font-bold text-gofarm-black">Newsletter</h4>
              <p className="mt-3 text-sm leading-6 text-gofarm-gray">
                Subscribe to stay updated with our latest offers and product news.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
                <button className="rounded-xl bg-gofarm-green px-4 py-3 text-sm font-semibold text-white hover:bg-gofarm-light-green">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-5 text-center text-sm text-gofarm-gray">
            © 2026 gofarm. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
