"use client";

import { useState } from "react";
import Link from "next/link";
// ĐÃ XÓA: import SiteHeader from "@/components/site-header";

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  const categoryRoutes: Record<string, string> = {
    "Ice and Cold": "/category/ice-and-cold",
    "Dry Food": "/category/dry-food",
    "Fast Food": "/category/fast-food",
    Frozen: "/category/frozen",
    Meat: "/category/meat",
    Fish: "/category/fish",
    Vegetables: "/category/vegetables",
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
                  ? item === "About us"
                    ? "/about"
                    : item === "Contact us"
                      ? "/contact"
                      : item === "Terms & Conditions"
                        ? "/terms"
                        : item === "Privacy Policy"
                          ? "/privacy"
                          : item === "FAQs"
                            ? "/faqs"
                            : "/help"
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

const helpCategories = [
  {
    id: "orders",
    title: "Orders & Tracking",
    description: "Track your order, cancel or modify orders",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    detailedContent: {
      title: "Orders & Tracking",
      sections: [
        { title: "How to track your order", content: "After placing your order, you'll receive a confirmation email with a tracking number. Click the tracking link or go to My Orders in your account to see real-time updates." },
        { title: "Cancel or modify order", content: "You can cancel or modify your order within 30 minutes of placing it. Go to My Orders, select the order, and click 'Cancel' or 'Modify'." },
        { title: "Order status meanings", content: "• Pending: Order received\n• Confirmed: Order verified\n• Preparing: Being packed\n• Shipped: On the way\n• Delivered: Successfully delivered" }
      ]
    }
  },
  {
    id: "account",
    title: "Account Management",
    description: "Update profile, password, email settings",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    detailedContent: {
      title: "Account Management",
      sections: [
        { title: "How to update your profile", content: "Go to Account Settings > Profile Information. You can update your name, phone number, and delivery addresses." },
        { title: "Change your password", content: "Navigate to Account Settings > Security. Enter your current password, then your new password twice." },
        { title: "Email preferences", content: "In Account Settings > Notifications, you can choose which emails you receive." }
      ]
    }
  },
  {
    id: "payment",
    title: "Payment & Billing",
    description: "Payment methods, invoices, refunds",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    detailedContent: {
      title: "Payment & Billing",
      sections: [
        { title: "Accepted payment methods", content: "We accept Credit/Debit Cards, PayPal, Apple Pay, Google Pay, and Bank Transfers." },
        { title: "How to get an invoice", content: "After purchase, an invoice will be sent to your email. You can also download from My Orders." },
        { title: "Refund process", content: "Refunds are processed within 5-7 business days after we receive your returned item." }
      ]
    }
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    description: "Delivery times, shipping costs, tracking",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    detailedContent: {
      title: "Shipping & Delivery",
      sections: [
        { title: "Delivery times", content: "Standard: 3-5 days. Express: 1-2 days. Same-day available in select areas." },
        { title: "Shipping costs", content: "Free standard on orders $50+. Standard: $5.99. Express: $12.99. Same-day: $9.99." },
        { title: "International shipping", content: "Currently US only. International coming soon!" }
      ]
    }
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    description: "Return policy, refund process, exchanges",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    detailedContent: {
      title: "Returns & Refunds",
      sections: [
        { title: "Return policy", content: "30-day return window. Items must be unused, in original packaging." },
        { title: "How to start a return", content: "Go to My Orders, select item, click 'Return Item'. Print label and drop off." },
        { title: "Exchange process", content: "Return original item and place new order. We'll refund original upon receipt." }
      ]
    }
  },
  {
    id: "products",
    title: "Products & Quality",
    description: "Product info, quality guarantee, sourcing",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    detailedContent: {
      title: "Products & Quality",
      sections: [
        { title: "Product sourcing", content: "We partner with local organic farms and trusted suppliers." },
        { title: "Quality guarantee", content: "Full refund or replacement for any quality issues within 7 days." },
        { title: "Organic certification", content: "Look for the green 'Organic' badge on certified products." }
      ]
    }
  },
];

const popularTopics = [
  { question: "How to track my order?", answer: "Go to 'My Orders' in your account dashboard. Click on the order number to view detailed tracking information. You'll also receive email updates." },
  { question: "Change or cancel my order", answer: "Orders can be changed or cancelled within 30 minutes of placement. Go to 'My Orders', find your order, and click 'Modify' or 'Cancel'." },
  { question: "Return policy explained", answer: "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Start a return from 'My Orders'." },
  { question: "Payment methods accepted", answer: "We accept Credit/Debit Cards, PayPal, Apple Pay, Google Pay, and Bank Transfers. All transactions are encrypted and secure." },
  { question: "Shipping time and costs", answer: "Standard (3-5 days): $5.99 or free on $50+. Express (1-2 days): $12.99. Same-day: $9.99." },
  { question: "How to reset password?", answer: "Click 'Forgot Password' on login page. Enter your email and we'll send a reset link. Follow instructions to create new password." },
];

const faqs = [
  { category: "Orders", question: "How do I place an order?", answer: "Browse products, add to cart, proceed to checkout. You'll receive confirmation via email." },
  { category: "Orders", question: "Can I cancel or change my order?", answer: "Within 1 hour of placing. Contact support with order number." },
  { category: "Payment", question: "What payment methods do you accept?", answer: "Credit/Debit cards, PayPal, Apple Pay, Google Pay, bank transfers." },
  { category: "Payment", question: "Is my payment information secure?", answer: "Yes, SSL encryption. We never store full card details." },
  { category: "Shipping", question: "How long does delivery take?", answer: "Standard 2-5 days. Express 1-2 days. Free shipping on $50+." },
  { category: "Shipping", question: "Do you ship internationally?", answer: "Currently US only. International coming soon." },
  { category: "Returns", question: "What is your return policy?", answer: "30 days. Unused, original packaging. Free returns for defective items." },
  { category: "Returns", question: "How do I request a refund?", answer: "Go to orders page, select item, follow instructions. Processed in 5-7 days." },
  { category: "Account", question: "How do I reset my password?", answer: "Click 'Forgot Password' on sign-in page. Follow email instructions." },
  { category: "Account", question: "How to delete my account?", answer: "Contact support. Permanent action removes all data." },
  { category: "Products", question: "Are your products organic?", answer: "Yes, partnered with certified organic farms. Look for 'Organic' badge." },
  { category: "Products", question: "What if I receive a damaged item?", answer: "Contact support within 48 hours with photos. Free replacement or refund." },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedHelpTopic, setSelectedHelpTopic] = useState<any>(null);
  const [selectedPopularTopic, setSelectedPopularTopic] = useState<any>(null);

  const quickLinks = ["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"];
  const categories = ["Ice and Cold", "Dry Food", "Fast Food", "Frozen", "Meat", "Fish", "Vegetables"];
  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter(f => f.category.toLowerCase() === activeCategory.toLowerCase());
  const uniqueCategories = ["all", ...new Set(faqs.map(f => f.category))];

  const Modal = ({ isOpen, onClose, title, content }: any) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-slideUp">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gofarm-black">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-6">
            {content.sections?.map((section: any, idx: number) => (
              <div key={idx}>
                <h4 className="text-lg font-semibold text-gofarm-green mb-2">{section.title}</h4>
                <p className="text-gofarm-gray leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
            {content.answer && <p className="text-gofarm-gray leading-relaxed text-lg">{content.answer}</p>}
          </div>
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-100">
            <button onClick={onClose} className="w-full bg-gofarm-green text-white py-3 rounded-xl font-semibold hover:bg-gofarm-light-green transition-colors">Got it, thanks!</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ĐÃ XÓA: <SiteHeader /> */}
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10">
        <section className="bg-gradient-to-r from-gofarm-green to-gofarm-light-green text-white py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">How can we help?</h1>
            <p className="text-xl text-white/90">Find answers, request support, or get in touch with our team</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gofarm-green/10 text-gofarm-green px-4 py-1.5 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                24/7 Support
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gofarm-black mb-4">Help Center</h2>
              <p className="text-gofarm-gray max-w-2xl mx-auto text-lg">Find answers, get support, and resolve issues quickly. We're here to help you have the best shopping experience.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category) => (
                <button key={category.id} onClick={() => setSelectedHelpTopic(category)} className="group bg-white rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 shadow-md">
                  <div className="w-14 h-14 bg-gofarm-green/10 rounded-xl flex items-center justify-center text-gofarm-green mb-4 group-hover:bg-gofarm-green group-hover:text-white transition-colors">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gofarm-black mb-2 group-hover:text-gofarm-green transition-colors">{category.title}</h3>
                  <p className="text-gofarm-gray">{category.description}</p>
                  <div className="mt-4 flex items-center text-sm text-gofarm-green font-medium group-hover:gap-2 transition-all">Browse articles<svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gofarm-green/10 text-gofarm-green px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Most Asked
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gofarm-black mb-2">Popular Topics</h2>
              <p className="text-gofarm-gray">Most frequently asked questions by our customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {popularTopics.map((topic, index) => (
                <button key={index} onClick={() => setSelectedPopularTopic(topic)} className="flex items-center justify-between gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 group border border-gray-100">
                  <span className="text-gofarm-black group-hover:text-gofarm-green transition-colors font-medium">{topic.question}</span>
                  <svg className="w-5 h-5 text-gofarm-green opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gofarm-black mb-2">Frequently Asked Questions</h2>
              <p className="text-gofarm-gray">Quick answers to common questions</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {uniqueCategories.map((category) => (
                <button key={category} onClick={() => setActiveCategory(category)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === category ? "bg-gofarm-green text-white shadow-md" : "bg-gray-100 text-gofarm-gray hover:bg-gofarm-light-green/20"}`}>
                  {category === "all" ? "All Topics" : category}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredFaqs.map((faq, index) => (
                  <div key={index}>
                    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-gofarm-green bg-gofarm-light-green/10 px-2 py-1 rounded mb-2 inline-block">{faq.category}</span>
                        <h3 className="font-semibold text-gofarm-black mt-1">{faq.question}</h3>
                      </div>
                      <svg className={`w-6 h-6 text-gofarm-gray transition-transform flex-shrink-0 ml-4 ${openIndex === index ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openIndex === index && (<div className="px-6 pb-5 animate-fadeIn"><p className="text-gofarm-gray leading-relaxed">{faq.answer}</p></div>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-gofarm-light-green/10 via-white to-gofarm-light-orange/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gofarm-green/10 text-gofarm-green px-4 py-1.5 rounded-full text-sm font-semibold mb-4 animate-pulse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                We're Here to Help
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gofarm-black mb-2">Still Need Help?</h2>
              <p className="text-gofarm-gray">Our support team is ready to assist you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/contact" className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all hover:-translate-y-2 hover:bg-gofarm-green cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-gofarm-green/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-8 h-8 text-gofarm-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gofarm-black mb-2 group-hover:text-white">Live Chat</h3>
                <p className="text-gofarm-gray group-hover:text-white/90">Chat with our support team</p>
                <div className="mt-4 inline-flex items-center gap-1 text-gofarm-green group-hover:text-white font-semibold group-hover:gap-2 transition-all">Start chatting<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
              </Link>
              <Link href="/contact" className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all hover:-translate-y-2 hover:bg-gofarm-green cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-gofarm-green/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-8 h-8 text-gofarm-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gofarm-black mb-2 group-hover:text-white">Call Us</h3>
                <p className="text-gofarm-gray text-lg font-semibold group-hover:text-white/90">+1 (555) 123-4567</p>
                <p className="text-sm text-gofarm-gray mt-2 group-hover:text-white/80">Mon-Fri, 9AM - 6PM EST</p>
              </Link>
              <Link href="/contact" className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all hover:-translate-y-2 hover:bg-gofarm-green cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-gofarm-green/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-8 h-8 text-gofarm-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gofarm-black mb-2 group-hover:text-white">Email Us</h3>
                <p className="text-gofarm-gray group-hover:text-white/90">support@gofarm.com</p>
                <p className="text-sm text-gofarm-gray mt-2 group-hover:text-white/80">24/7 response within 24 hours</p>
              </Link>
            </div>
          </div>
        </section>

        <footer className="bg-gofarm-white border-t border-gofarm-light-gray">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
              <a href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                <div><h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Visit Us</h3><p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">123 Shopping Street, Commerce District, New York, NY 10001, USA</p></div>
              </a>
              <a href="tel:15551234567" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
                <div><h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Call Us</h3><p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">+1 (555) 123-4567</p></div>
              </a>
              <div className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                <div><h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Working Hours</h3><p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">Monday - Friday: 9AM - 6PM</p></div>
              </div>
              <a href="mailto:support@gofarm.com" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                <div><h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Email Us</h3><p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">support@gofarm.com</p></div>
              </a>
            </div>
            <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="mb-2"><Link href="/"><img alt="logo" loading="lazy" width="150" height="150" className="h-8 w-32" src="/images/logo.svg" /></Link></div>
                <p className="text-gofarm-gray text-sm">Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.</p>
                <div className="flex items-center gap-3.5 text-gofarm-black/60">
                  <a href="https://www.youtube.com/@reactjsBD" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">YouTube</span></a>
                  <a href="https://www.youtube.com/@reactjsBD" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Social</span></a>
                  <a href="https://www.youtube.com/@reactjsBD" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Social</span></a>
                </div>
              </div>
              <FooterColumn title="Quick Links" items={quickLinks} />
              <FooterColumn title="Categories" items={categories} />
              <div><h3 className="font-semibold text-gofarm-black mb-4">Newsletter</h3><p className="text-gofarm-gray text-sm mb-4">Subscribe to our newsletter to receive updates and exclusive offers.</p><form className="space-y-3"><input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gofarm-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-light-green focus:border-gofarm-light-green transition-all text-gofarm-black placeholder:text-gofarm-gray" /><button type="submit" className="w-full bg-gofarm-green text-gofarm-white px-4 py-2 rounded-lg hover:bg-gofarm-light-green transition-colors flex items-center justify-center gap-2 font-semibold">Subscribe</button></form></div>
            </div>
            <div className="py-6 border-t border-gofarm-light-gray text-center text-sm text-gofarm-gray"><p>© 2026 <span className="text-gofarm-black font-black tracking-wider uppercase hover:text-gofarm-green hoverEffect group font-sans">Gofar<span className="text-gofarm-green group-hover:text-gofarm-black hoverEffect">m</span></span>. All rights reserved.</p></div>
          </div>
        </footer>
      </div>
      <Modal isOpen={selectedHelpTopic !== null} onClose={() => setSelectedHelpTopic(null)} title={selectedHelpTopic?.detailedContent.title} content={selectedHelpTopic?.detailedContent} />
      <Modal isOpen={selectedPopularTopic !== null} onClose={() => setSelectedPopularTopic(null)} title={selectedPopularTopic?.question} content={{ answer: selectedPopularTopic?.answer }} />
    </>
  );
}