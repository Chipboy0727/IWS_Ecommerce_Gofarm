"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <h3 className="font-semibold text-gofarm-black mb-3 sm:mb-4 text-base sm:text-lg">{title}</h3>
      <ul className="space-y-2 sm:space-y-3">
        {items.map((item) => (
          <li key={item}>
            <Link
              href={
                title === "Quick Links"
                  ? quickLinksRoutes[item] ?? "/shop"
                  : categoryRoutes[item] ?? "/collection"
              }
              className="text-gofarm-gray hover:text-gofarm-green text-xs sm:text-sm font-medium hoverEffect capitalize"
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    // Simulate success
    setStatus("success");
    setMessage("Successfully subscribed to our newsletter!");
    setEmail("");

    // Reset status after a few seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  const quickLinks = ["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"];
  const categories = ["Fruits", "Vegetables", "Juices", "Spices & Herbs"];

  return (
    <footer className="bg-gofarm-white border-t border-gofarm-light-gray mt-10">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-5 lg:px-6">

        {/* Contact Info Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-b">

          {/* Visit Us */}
          <a
            href="https://maps.google.com/?q=259,%20Doi%20Can%20Street,%20Lieu%20Giai%20Ward,%20Ba%20Dinh%20District,%20Hanoi,%20Vietnam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 sm:gap-3 group hover:bg-gray-50 p-3 sm:p-4 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-[22px] sm:h-[22px] lg:w-6 lg:h-6 text-gray-600 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base">Visit Us</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 group-hover:text-gray-900 transition-colors break-words">
                259, Doi Can Street, Lieu Giai Ward, Ba Dinh District, Hanoi, Vietnam
              </p>
            </div>
          </a>

          {/* Call Us */}
          <a href="tel:+84123456789" className="flex items-center gap-2 sm:gap-3 group hover:bg-gray-50 p-3 sm:p-4 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-[22px] sm:h-[22px] lg:w-6 lg:h-6 text-gray-600 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base">Call Us</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 group-hover:text-gray-900 transition-colors">+84123456789</p>
            </div>
          </a>

          {/* Working Hours */}
          <div className="flex items-center gap-2 sm:gap-3 group hover:bg-gray-50 p-3 sm:p-4 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-[22px] sm:h-[22px] lg:w-6 lg:h-6 text-gray-600 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base">Working Hours</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 group-hover:text-gray-900 transition-colors">Monday - Friday: 9AM - 6PM</p>
            </div>
          </div>

          {/* Email Us */}
          <a href="mailto:withus@gofarm.com" className="flex items-center gap-2 sm:gap-3 group hover:bg-gray-50 p-3 sm:p-4 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-[22px] sm:h-[22px] lg:w-6 lg:h-6 text-gray-600 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base">Email Us</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 group-hover:text-gray-900 transition-colors break-all">withus@gofarm.com</p>
            </div>
          </a>
        </div>

        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 lg:py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

          {/* Logo & Description */}
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <div className="flex justify-start">
              <Link href="/">
                <img
                  alt="logo"
                  loading="lazy"
                  width="160"
                  height="48"
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
                  src="/images/gofarmnamelogo.png"
                />
              </Link>
            </div>
            <p className="text-gofarm-gray text-xs sm:text-sm leading-relaxed">
              Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links" items={quickLinks} />

          {/* Categories */}
          <FooterColumn title="Categories" items={categories} />

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-gofarm-black mb-3 sm:mb-4 text-base sm:text-lg text-center sm:text-left">Newsletter</h3>
            <p className="text-gofarm-gray text-xs sm:text-sm mb-3 sm:mb-4 text-center sm:text-left">
              Subscribe to our newsletter to receive updates and exclusive offers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gofarm-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-light-green focus:border-gofarm-light-green disabled:bg-gofarm-light-gray/50 disabled:cursor-not-allowed transition-all text-gofarm-black placeholder:text-gofarm-gray"
              />
              <div className="relative">
                <AnimatePresence mode="wait">
                  {status !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className={`text-[10px] sm:text-xs mb-2 font-medium ${status === "success" ? "text-green-600" : "text-red-500"
                        }`}>
                        {message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  layout
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gofarm-green text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-gofarm-light-green transition-colors disabled:bg-gofarm-gray disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 sm:py-6 border-t border-gofarm-light-gray text-center text-[11px] sm:text-sm text-gofarm-gray">
          <p className="break-words">
            © 2026 <span className="text-gofarm-black font-black tracking-wider uppercase hover:text-gofarm-green hoverEffect group font-sans">
              Gofar<span className="text-gofarm-green group-hover:text-gofarm-black hoverEffect">m</span>
            </span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}