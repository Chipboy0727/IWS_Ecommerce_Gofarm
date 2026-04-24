import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | GoFarm",
  description: "Read GoFarm's privacy policy to understand how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          

          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-gofarm-black mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-12">Last updated: April 23, 2026</p>

          {/* Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
            <Section
              title="1. Information We Collect"
              content="We collect information you provide directly, such as name, email address, shipping address, and payment information. We also automatically collect certain information about your device and how you interact with our website, including IP address and browsing activity."
            />

            <Section
              title="2. How We Use Your Information"
              content="We use collected information to process orders, provide customer service, send promotional emails (if opted-in), and improve our services. We may also use anonymized data for analytics and business purposes."
            />

            <Section
              title="3. Data Protection"
              content="We implement industry-standard security measures to protect your personal information. Your data is encrypted during transmission and stored securely. However, no system is completely secure, and we cannot guarantee absolute security."
            />

            <Section
              title="4. Third-Party Sharing"
              content="We do not sell your personal information. We may share information with trusted third parties such as payment processors, shipping partners, and service providers necessary to complete transactions. These parties are bound by confidentiality agreements."
            />

            <Section
              title="5. Cookies"
              content="We use cookies to enhance your browsing experience. Cookies help us remember your preferences and analyze site traffic. You can disable cookies through your browser settings, but some features may not work properly."
            />

            <Section
              title="6. Your Rights"
              content="You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at privacy@gofarm.com. We will respond to your request within 30 days."
            />

            <Section
              title="7. Children's Privacy"
              content="GoFarm is not intended for users under 18 years old. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information immediately."
            />

            <Section
              title="8. Policy Changes"
              content="We may update this Privacy Policy periodically. Changes will be posted on this page with an updated 'Last updated' date. Your continued use of GoFarm indicates acceptance of any changes."
            />

            <Section
              title="9. Contact Us"
              content="If you have privacy concerns or questions, please contact us at privacy@gofarm.com or call +1 (555) 123-4567."
            />
          </div>
        </div>
      </main>
      {/* Footer is rendered by root layout */}
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