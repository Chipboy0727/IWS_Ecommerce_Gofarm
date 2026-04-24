import Link from "next/link";

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  const categoryRoutes: Record<string, string> = {
    Fruits: "/collection?category=fruits",
    Vegetables: "/collection?category=vegetables",
    Juices: "/collection?category=juices",
    "Spices & Herbs": "/collection?category=spices-herbs",
  };

  const quickLinksRoutes: Record<string, string> = {
    "About us": "/about",
    "Contact us": "/contact",
    "Terms & Conditions": "/terms",
    "Privacy Policy": "/privacy",
    FAQs: "/faqs",
    Help: "/help",
  };

  return (
    <div>
      <h3 className="font-semibold text-gofarm-black mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <Link
              href={
                title === "Quick Links"
                  ? quickLinksRoutes[item] ?? "/shop"
                  : categoryRoutes[item] ?? "/collection"
              }
              className="text-gofarm-gray hover:text-gofarm-green text-sm font-medium hoverEffect capitalize"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  const quickLinks = ["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"];
  const categories = ["Fruits", "Vegetables", "Juices", "Spices & Herbs"];

  return (
    <footer className="bg-gofarm-white border-t border-gofarm-light-gray mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
          <a
            href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Visit Us</h3>
              <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">123 Shopping Street, Commerce District, New York, NY 10001, USA</p>
            </div>
          </a>

          <a href="tel:15551234567" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Call Us</h3>
              <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">+1 (555) 123-4567</p>
            </div>
          </a>

          <div className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Working Hours</h3>
              <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">Monday - Friday: 9AM - 6PM</p>
            </div>
          </div>

          <a href="mailto:support@gofarm.com" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Email Us</h3>
              <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">support@gofarm.com</p>
            </div>
          </a>
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="mb-2">
              <Link href="/">
                <img alt="logo" loading="lazy" width="200" height="60" className="h-16 w-auto" src="/images/gofarmnamelogo.png" />
              </Link>
            </div>
            <p className="text-gofarm-gray text-sm">Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.</p>
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
              <button type="submit" className="w-full bg-gofarm-green text-gofarm-white px-4 py-2 rounded-lg hover:bg-gofarm-light-green transition-colors disabled:bg-gofarm-gray disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="py-6 border-t border-gofarm-light-gray text-center text-sm text-gofarm-gray">
          <p>© 2026 <span className="text-gofarm-black font-black tracking-wider uppercase hover:text-gofarm-green hoverEffect group font-sans">Gofar<span className="text-gofarm-green group-hover:text-gofarm-black hoverEffect">m</span></span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
