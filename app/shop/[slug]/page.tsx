import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { loadLocalCatalog } from "@/lib/local-catalog";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

export async function generateStaticParams() {
  const { products } = await loadLocalCatalog();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ShopProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { products } = await loadLocalCatalog();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const salePrice =
    product.discount && product.discount > 0
      ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
      : product.price;

  const relatedProducts = products
    .filter((item) => item.slug !== product.slug && item.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10">
      <SiteHeader />
      <main className="max-w-(--breakpoint-xl) mx-auto px-4 py-10 lg:py-14">
        <nav className="text-sm text-gofarm-gray">
          <Link href="/" className="hover:text-gofarm-green">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link href="/shop" className="hover:text-gofarm-green">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-gofarm-black">{product.name}</span>
        </nav>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-gofarm-light-green/20 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <div className="flex h-full items-center justify-center rounded-[24px] bg-gofarm-light-gray/20 p-8">
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="max-h-[540px] w-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-gofarm-light-green/20 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="inline-flex items-center rounded-full bg-gofarm-light-orange/40 px-4 py-2 text-sm font-semibold text-gofarm-green">
                {product.categoryTitle ?? "Shop"}
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-gofarm-black">{product.name}</h1>
              <p className="mt-4 text-gofarm-gray leading-7">{product.description}</p>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <div className="text-3xl font-bold text-gofarm-green">{formatPrice(salePrice)}</div>
                {product.discount ? (
                  <>
                    <div className="text-lg text-gofarm-gray line-through">{formatPrice(product.price)}</div>
                    <div className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-500">-{product.discount}%</div>
                  </>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex flex-1 items-center justify-center rounded-xl bg-gofarm-green px-5 py-3 text-sm font-semibold text-white hover:bg-gofarm-light-green">
                  Add to Cart
                </button>
                <button className="inline-flex flex-1 items-center justify-center rounded-xl border border-gofarm-light-green/25 px-5 py-3 text-sm font-semibold text-gofarm-black hover:border-gofarm-green">
                  Save for later
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-gofarm-light-green/20 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-bold text-gofarm-black">Product details</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gofarm-gray">Brand</dt>
                  <dd className="mt-1 font-semibold text-gofarm-black">{product.brand ?? "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gofarm-gray">Stock</dt>
                  <dd className="mt-1 font-semibold text-gofarm-black">{product.stock ?? "In stock"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gofarm-gray">Rating</dt>
                  <dd className="mt-1 font-semibold text-gofarm-black">{product.rating.toFixed(1)} / 5</dd>
                </div>
                <div>
                  <dt className="text-sm text-gofarm-gray">Reviews</dt>
                  <dd className="mt-1 font-semibold text-gofarm-black">{product.reviews}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-12">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-bold text-gofarm-black">Related products</h2>
              <Link href="/shop" className="text-gofarm-green font-semibold hover:text-gofarm-light-green">
                View all
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/shop/${item.slug}`}
                  className="group rounded-2xl border border-gofarm-light-green/15 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-gofarm-light-gray/20">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-gofarm-black group-hover:text-gofarm-green">{item.name}</h3>
                    <p className="text-sm text-gofarm-gray">{formatPrice(item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
