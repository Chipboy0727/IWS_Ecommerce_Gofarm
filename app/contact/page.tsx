import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contact Us | gofarm",
  description: "Get in touch with the GoFarm team for support, questions, or feedback.",
};

function IconMapPin({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPhone({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a1 1 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  );
}

function IconMail({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconMessageCircle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
    </svg>
  );
}

function IconExternalLink({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function IconSend({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  );
}

type ContactItem = {
  title: string;
  value: React.ReactNode;
  note: string;
  href?: string;
  icon: React.ReactNode;
  boxClass: string;
  titleClass: string;
};

const contactItems: ContactItem[] = [
  {
    title: "Visit Our Store",
    value: (
      <>
        123 Shopping Street, Commerce District
        <br />
        New York, NY 10001, USA
      </>
    ),
    note: "",
    href: "https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA",
    icon: <IconMapPin className="h-5 w-5 text-gofarm-green" />,
    boxClass: "bg-gofarm-green/10",
    titleClass: "text-gofarm-green",
  },
  {
    title: "Call Us",
    value: "+1 (555) 123-4567",
    note: "Monday - Friday: 9AM - 6PM",
    href: "tel:15551234567",
    icon: <IconPhone className="h-5 w-5 text-gofarm-light-green" />,
    boxClass: "bg-gofarm-light-green/10",
    titleClass: "text-gofarm-green",
  },
  {
    title: "Email Support",
    value: "support@gofarm.com",
    note: "We reply within 24 hours",
    href: "mailto:support@gofarm.com",
    icon: <IconMail className="h-5 w-5 text-gofarm-orange" />,
    boxClass: "bg-gofarm-orange/10",
    titleClass: "text-gofarm-green",
  },
  {
    title: "Business Hours",
    value: "Monday - Friday: 9AM - 6PM",
    note: "Saturday - Sunday: 10AM - 4PM",
    icon: <IconClock className="h-5 w-5 text-purple-600" />,
    boxClass: "bg-purple-600/10",
    titleClass: "text-gofarm-green",
  },
];

const faqs = [
  {
    question: "What are your shipping policies?",
    answer:
      "We offer free shipping on orders over $50 within the continental US. International shipping is available with additional charges.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can also track orders in your account dashboard.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of purchase. Items must be unused and in original packaging for a full refund.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes. Our customer service team is available Monday-Friday 9AM-6PM EST via phone, email, or live chat.",
  },
];

function Footer() {
  return (
    <footer className="mt-10 border-t border-gofarm-light-gray bg-gofarm-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 border-b md:grid-cols-2 lg:grid-cols-4">
          <a
            href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50 group"
          >
            <IconMapPin className="h-6 w-6 text-gray-600 transition-colors group-hover:text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary">Visit Us</h3>
              <p className="mt-1 text-sm text-gray-600 transition-colors group-hover:text-gray-900">
                123 Shopping Street, Commerce District, New York, NY 10001, USA
              </p>
            </div>
          </a>
          <a href="tel:15551234567" className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50 group">
            <IconPhone className="h-6 w-6 text-gray-600 transition-colors group-hover:text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary">Call Us</h3>
              <p className="mt-1 text-sm text-gray-600 transition-colors group-hover:text-gray-900">+1 (555) 123-4567</p>
            </div>
          </a>
          <div className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50 group">
            <IconClock className="h-6 w-6 text-gray-600 transition-colors group-hover:text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary">Working Hours</h3>
              <p className="mt-1 text-sm text-gray-600 transition-colors group-hover:text-gray-900">Monday - Friday: 9AM - 6PM</p>
            </div>
          </div>
          <a href="mailto:support@gofarm.com" className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50 group">
            <IconMail className="h-6 w-6 text-gray-600 transition-colors group-hover:text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary">Email Us</h3>
              <p className="mt-1 text-sm text-gray-600 transition-colors group-hover:text-gray-900">support@gofarm.com</p>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="mb-2">
              <Link href="/">
                <img alt="logo" loading="lazy" width="150" height="150" className="h-8 w-32" src="/images/logo.svg" />
              </Link>
            </div>
            <p className="text-sm text-gofarm-gray">
              Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gofarm-black">Quick Links</h3>
            <ul className="space-y-3">
              {["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"].map((item) => (
                <li key={item} className="text-sm font-medium text-gofarm-gray hover:text-gofarm-green">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gofarm-black">Categories</h3>
            <ul className="space-y-3">
              {["Ice and Cold", "Dry Food", "Fast Food", "Frozen", "Meat", "Fish", "Vegetables"].map((item) => (
                <li key={item} className="text-sm font-medium text-gofarm-gray hover:text-gofarm-green capitalize">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gofarm-black">Newsletter</h3>
            <p className="mb-4 text-sm text-gofarm-gray">Subscribe to our newsletter to receive updates and exclusive offers.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gofarm-light-gray px-4 py-2 text-gofarm-black outline-none focus:border-gofarm-light-green focus:ring-2 focus:ring-gofarm-light-green"
              />
              <button type="submit" className="w-full rounded-lg bg-gofarm-green px-4 py-2 font-semibold text-white transition-colors hover:bg-gofarm-light-green">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gofarm-light-gray py-6 text-center text-sm text-gofarm-gray">
          <p>© 2026 gofarm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <SiteHeader />

      <section className="bg-linear-to-r from-gofarm-green to-gofarm-light-green py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-md border border-white/30 bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-white/30">
              We're Here to Help
            </div>
            <h1 className="mb-6 text-5xl font-bold lg:text-6xl">Contact Us</h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 lg:text-2xl">
              Have questions about our products or need assistance? We'd love to hear from you. Our team is here to help with any inquiries you may have.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-(--breakpoint-xl) px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <section className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:p-8">
              <h2 className="mb-6 text-2xl font-bold text-gofarm-green">Contact Information</h2>
              <div className="space-y-6">
                {contactItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${item.boxClass}`}>{item.icon}</div>
                    <div className="flex-1">
                      <h3 className={`mb-1 font-semibold ${item.titleClass}`}>{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : "_self"}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="group mb-1 flex items-center gap-1 text-sm text-dark-text transition-colors duration-200 hover:text-gofarm-green"
                        >
                          <span>{item.value}</span>
                          {item.href.startsWith("http") ? <IconExternalLink className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" /> : null}
                        </a>
                      ) : (
                        <p className="mb-1 text-sm text-dark-text">{item.value}</p>
                      )}
                      {item.note ? <p className="text-xs text-gofarm-gray">{item.note}</p> : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg bg-gofarm-light-orange p-4">
                <div className="mb-2 flex items-center gap-2">
                  <IconMessageCircle className="h-4 w-4 text-gofarm-green" />
                  <h4 className="font-semibold text-gofarm-green">Quick Response</h4>
                </div>
                <p className="text-sm text-dark-text">2-4 hours during business hours</p>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:p-8">
              <h2 className="mb-6 text-2xl font-bold text-gofarm-green">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gofarm-green">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gofarm-green">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      className="h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gofarm-green">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Brief description of your inquiry"
                    className="h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gofarm-green">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Please provide detailed information about your inquiry..."
                    className="flex min-h-[60px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full transform items-center justify-center gap-2 rounded-lg bg-gofarm-green px-8 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gofarm-light-green hover:shadow-xl disabled:transform-none sm:w-auto"
                >
                  <IconSend className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>
          </section>
        </div>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gofarm-green lg:text-3xl">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-xl text-dark-text">Find quick answers to common questions about our services and policies.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-semibold text-gofarm-green">{faq.question}</h3>
                <p className="text-sm text-dark-text">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
