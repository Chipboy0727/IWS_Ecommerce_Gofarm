import Link from "next/link";

const quickLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/deal", label: "Hot Deal" },
  { href: "/store-list", label: "Local Stores" },
  { href: "/contact", label: "Contact" },
];

const supportLinks = [
  { href: "/contact", label: "Help Center" },
  { href: "/contact", label: "Shipping" },
  { href: "/contact", label: "Returns" },
  { href: "/contact", label: "Privacy Policy" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-gofarm-light-gray bg-white">
      <div className="mx-auto grid max-w-(--breakpoint-xl) gap-10 px-4 py-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <img alt="gofarm" src="/images/logo.svg" className="h-9 w-auto" />
          </Link>
          <p className="max-w-md text-sm leading-6 text-gofarm-gray">
            A React/Next.js storefront organized around reusable components, clean routes, and API-driven data.
          </p>
        </div>

        <FooterColumn title="Quick Links" links={quickLinks} />
        <FooterColumn title="Support" links={supportLinks} />
      </div>

      <div className="border-t border-gofarm-light-gray bg-gofarm-light-green/5">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-4 text-sm text-gofarm-gray">
          Built with Next.js, React components, and REST-style API routes.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gofarm-black">{title}</div>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-gofarm-gray transition-colors hover:text-gofarm-green">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
