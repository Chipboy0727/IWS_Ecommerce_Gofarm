import Link from "next/link";

export const metadata = {
  title: "About Us | GoFarm",
  description: "Learn more about GoFarm, your trusted online destination for fresh farm products.",
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
         

          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gofarm-black mb-6">About GoFarm</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              We're committed to bringing fresh, organic farm products directly to your doorstep while supporting local farmers and sustainable agriculture.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Our Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-gofarm-green/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gofarm-black mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To revolutionize online grocery shopping by providing access to the freshest farm products, supporting local farmers, and promoting sustainable agriculture practices. We believe in quality, transparency, and customer satisfaction.
              </p>
            </div>

            {/* Our Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-gofarm-green/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gofarm-black mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the leading online platform connecting consumers with local farmers, making fresh, organic produce accessible to everyone while building a sustainable food ecosystem that benefits both communities and the environment.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-2xl p-12 shadow-lg mb-16">
            <h2 className="text-3xl font-bold text-gofarm-black mb-8">Why Choose GoFarm?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🌱",
                  title: "Fresh & Organic",
                  description: "Direct from local farms to your table"
                },
                {
                  icon: "🚚",
                  title: "Fast Delivery",
                  description: "Quick and reliable shipping options"
                },
                {
                  icon: "💚",
                  title: "Sustainable",
                  description: "Supporting eco-friendly farming practices"
                },
                {
                  icon: "🤝",
                  title: "Support Local",
                  description: "Helping local farmers and communities"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gofarm-black mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gofarm-green text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Start shopping fresh, organic farm products today and support sustainable agriculture.
            </p>
            <Link href="/shop" className="inline-block bg-gofarm-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </main>
      {/* Footer is rendered by root layout */}
    </>
  );
}