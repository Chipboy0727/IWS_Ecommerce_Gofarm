import Link from "next/link";
import type { LocalCategory } from "@/lib/local-catalog";

export function CategoryHighlights({ categories }: { categories: LocalCategory[] }) {
  return (
    <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-12 lg:py-16">
      <div className="mb-6 flex flex-col gap-3">
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-gofarm-green">Collections</div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gofarm-black">Shop by category</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href="/shop"
            className="group rounded-2xl border border-gofarm-light-green/15 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-gofarm-black group-hover:text-gofarm-green">{category.title}</div>
                <div className="mt-1 text-sm text-gofarm-gray">{category.count} products available</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gofarm-light-orange/20 text-2xl text-gofarm-green">
                +
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
