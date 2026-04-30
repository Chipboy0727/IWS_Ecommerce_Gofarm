"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

export default function ContactPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setLoading(false);
    setShowSuccess(true);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white overflow-x-hidden">
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed top-24 right-4 sm:right-8 z-50 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-2xl border border-gofarm-green/10 min-w-[280px] sm:min-w-[320px]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gofarm-green text-white shadow-lg shadow-gofarm-green/20">
              <IconCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gofarm-green">Message Sent!</p>
              <p className="text-xs text-gray-500">We'll get back to you shortly.</p>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-linear-to-r from-gofarm-green to-gofarm-light-green py-12 sm:py-16 lg:py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center rounded-md border border-white/30 bg-white/20 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm transition-colors hover:bg-white/30">
              We're Here to Help
            </div>
            <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Contact Us</h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-white/90 px-2">
              Have questions about our products or need assistance? We'd love to hear from you. Our team is here to help with any inquiries you may have.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-(--breakpoint-xl) px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-12">
          <section className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 lg:p-8 shadow-lg h-full">
              <h2 className="mb-5 sm:mb-6 text-xl sm:text-2xl font-bold text-gofarm-green">Contact Information</h2>
              <div className="space-y-5 sm:space-y-6">
                {contactItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 sm:gap-4">
                    <div className={`rounded-lg p-2.5 sm:p-3 shrink-0 ${item.boxClass}`}>{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`mb-1 font-semibold text-sm sm:text-base ${item.titleClass}`}>{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : "_self"}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="group mb-1 flex flex-wrap items-center gap-1 text-xs sm:text-sm text-dark-text transition-colors duration-200 hover:text-gofarm-green break-words"
                        >
                          <span>{item.value}</span>
                          {item.href.startsWith("http") ? <IconExternalLink className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 shrink-0" /> : null}
                        </a>
                      ) : (
                        <p className="mb-1 text-xs sm:text-sm text-dark-text break-words">{item.value}</p>
                      )}
                      {item.note ? <p className="text-[10px] sm:text-xs text-gofarm-gray">{item.note}</p> : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 rounded-lg bg-gofarm-light-orange p-3 sm:p-4">
                <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                  <IconMessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gofarm-green" />
                  <h4 className="font-semibold text-gofarm-green text-sm sm:text-base">Quick Response</h4>
                </div>
                <p className="text-xs sm:text-sm text-dark-text">2-4 hours during business hours</p>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 lg:p-8 shadow-lg h-full flex flex-col">
              <h2 className="mb-5 sm:mb-6 text-xl sm:text-2xl font-bold text-gofarm-green">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="name" className="text-xs sm:text-sm font-medium text-gofarm-green">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      className="h-10 sm:h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-colors placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="email" className="text-xs sm:text-sm font-medium text-gofarm-green">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      className="h-10 sm:h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-colors placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="subject" className="text-xs sm:text-sm font-medium text-gofarm-green">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Brief description of your inquiry"
                    className="h-10 sm:h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-colors placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
                  <label htmlFor="message" className="text-xs sm:text-sm font-medium text-gofarm-green">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Please provide detailed information about your inquiry..."
                    className="flex min-h-[120px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm sm:text-base shadow-xs placeholder:text-muted-foreground focus:border-gofarm-light-green focus:ring-1 focus:ring-gofarm-light-green/20 flex-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 sm:h-12 w-full sm:w-auto transform items-center justify-center gap-2 rounded-lg bg-gofarm-green px-5 sm:px-8 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gofarm-light-green hover:shadow-xl disabled:transform-none disabled:opacity-70 text-sm sm:text-base"
                >
                  <IconSend className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-pulse' : ''}`} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </section>
        </div>

        <section className="mt-12 sm:mt-16">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl lg:text-3xl font-bold text-gofarm-green">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-xl text-sm sm:text-base text-dark-text px-3">Find quick answers to common questions about our services and policies.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
                <h3 className="mb-1.5 sm:mb-2 font-semibold text-gofarm-green text-sm sm:text-base">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-dark-text leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}