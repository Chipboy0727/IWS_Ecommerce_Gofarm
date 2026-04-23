import Link from "next/link";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Terms & Conditions | GoFarm",
  description: "Read GoFarm's terms and conditions for using our platform.",
};

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-gofarm-green">Home</Link>
            <span>/</span>
            <span className="text-gofarm-green font-semibold">Terms & Conditions</span>
          </div>

          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-gofarm-black mb-2">Terms & Conditions</h1>
          <p className="text-gray-600 mb-12">Last updated: April 23, 2026</p>

          {/* Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
            <Section
              title="1. Introduction"
              content="Welcome to GoFarm. These Terms and Conditions govern your use of our website and services. By accessing and using GoFarm, you accept and agree to be bound by the terms and provision of this agreement."
            />

            <Section
              title="2. User Accounts"
              content="When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
            />

            <Section
              title="3. Product Information"
              content="We strive to provide accurate descriptions and pricing for all products. However, we do not warrant that product descriptions, pricing, or other content on our website is accurate, complete, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions."
            />

            <Section
              title="4. Order and Payment"
              content="All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be received before items are shipped. We accept various payment methods as indicated during checkout."
            />

            <Section
              title="5. Shipping and Delivery"
              content="We aim to process and ship orders within 1-2 business days. Delivery times depend on your location and selected shipping method. GoFarm is not responsible for delays caused by third-party carriers or unforeseen circumstances."
            />

            <Section
              title="6. Returns and Refunds"
              content="Products must be returned within 7 days of delivery in original, unused condition. Refunds will be processed within 5-7 business days after inspection. Non-perishable items may be eligible for return; however, fresh produce may have limited return options."
            />

            <Section
              title="7. Limitation of Liability"
              content="GoFarm shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of or inability to use our services or products."
            />

            <Section
              title="8. Changes to Terms"
              content="We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of GoFarm signifies your acceptance of the updated Terms and Conditions."
            />

            <Section
              title="9. Contact Us"
              content="If you have questions about these Terms and Conditions, please contact us at support@gofarm.com or call +1 (555) 123-4567."
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gofarm-black mb-3">{title}</h2>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}
