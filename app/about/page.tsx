import Link from "next/link";

export const metadata = {
  title: "About Us | GoFarm",
  description: "Learn more about GoFarm, your trusted online destination for fresh farm products.",
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          
          {/* Header */}
          <div className="mb-10 sm:mb-14 md:mb-16 lg:mb-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gofarm-black mb-3 sm:mb-4 md:mb-5">
              About GoFarm
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
              We're committed to bringing fresh, organic farm products directly to your doorstep while supporting local farmers and sustainable agriculture.
            </p>
          </div>

          {/* Content Grid - Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mb-10 sm:mb-14 md:mb-16 lg:mb-20">
            
            {/* Our Mission */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gofarm-green/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gofarm-black mb-2 sm:mb-3">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
                To revolutionize online grocery shopping by providing access to the freshest farm products, supporting local farmers, and promoting sustainable agriculture practices. We believe in quality, transparency, and customer satisfaction.
              </p>
            </div>

            {/* Our Vision */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gofarm-green/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gofarm-black mb-2 sm:mb-3">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
                To become the leading online platform connecting consumers with local farmers, making fresh, organic produce accessible to everyone while building a sustainable food ecosystem that benefits both communities and the environment.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-md mb-10 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gofarm-black mb-5 sm:mb-6 md:mb-8 text-center sm:text-left">
              Why Choose GoFarm?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
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
                <div 
                  key={index} 
                  className="text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl hover:bg-gofarm-light-orange/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 md:mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gofarm-black mb-1 sm:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gofarm-green text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
              Join Our Community
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-3 sm:px-4">
              Start shopping fresh, organic farm products today and support sustainable agriculture.
            </p>
            <Link 
              href="/shop" 
              className="inline-block bg-gofarm-black text-white px-5 sm:px-6 md:px-7 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-sm sm:text-base md:text-lg"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}