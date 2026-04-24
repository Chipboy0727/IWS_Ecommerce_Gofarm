import Link from "next/link";

export const metadata = {
  title: "FAQs | GoFarm",
  description: "Frequently asked questions about GoFarm services and products.",
};

export default function FAQsPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse our products, add items to your cart, and proceed to checkout. Enter your delivery address and payment information to complete your order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards (Visa, Mastercard), debit cards, digital wallets, and other payment methods displayed during checkout.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 2-3 business days. We also offer express delivery in select areas. Delivery time is calculated from order confirmation.",
    },
    {
      question: "Are your products organic?",
      answer:
        "Many of our products are organic and sourced directly from local farmers. Product descriptions clearly indicate whether items are organic certified.",
    },
    {
      question: "Can I return products?",
      answer:
        "Non-perishable items can be returned within 7 days in original condition. Fresh produce has a limited return window due to its perishable nature. Contact support for assistance.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can track your order using the tracking link sent to your email after shipment. You can also view your order status in your account dashboard.",
    },
    {
      question: "Is there a minimum order amount?",
      answer:
        "We offer flexible ordering with no strict minimum. However, some regions may have minimum purchase requirements for delivery eligibility.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our support team via email at support@gofarm.com, call +1 (555) 123-4567, or use the contact form on our website.",
    },
    {
      question: "Do you deliver to my area?",
      answer:
        "Enter your ZIP code during checkout to check delivery availability. We're constantly expanding our service areas. Contact support if your area isn't covered yet.",
    },
    {
      question: "How do I unsubscribe from newsletters?",
      answer:
        "Click the 'Unsubscribe' link at the bottom of any newsletter email, or go to your account settings to manage email preferences.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-gofarm-light-orange/10">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gofarm-black mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about GoFarm and our services.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gofarm-green text-white rounded-2xl p-12 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still have questions?
          </h2>

          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Our support team is here to help. Contact us anytime!
          </p>

          <Link
            href="/contact"
            className="inline-block bg-gofarm-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
      <summary className="flex items-center justify-between cursor-pointer select-none">
        <h3 className="text-lg font-bold text-gofarm-black">
          {question}
        </h3>

        {/* Icon xoay khi mở */}
        <svg
          className="w-5 h-5 text-gofarm-green flex-shrink-0 ml-4 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </summary>

      <p className="text-gray-600 mt-4 leading-relaxed">
        {answer}
      </p>
    </details>
  );
}
