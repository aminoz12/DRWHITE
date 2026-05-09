import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ShopGrid from './ShopGrid';


export const metadata: Metadata = {
  title: 'Shop All Products | DR.WHITE',
  description: 'Explore our full range of professional-grade teeth whitening kits, strips, and accessories.',
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Reference Image Style Hero Section */}
        <section className="pt-24 pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-5xl md:text-7xl font-[900] text-black mb-6 leading-[0.9] tracking-tight uppercase"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              GET STARTED WITH <br className="hidden md:block" /> TEETH WHITENING
            </h1>
            <p className="text-sm md:text-base font-medium text-gray-600 max-w-2xl mx-auto">
              The best DrDent products to kickstart your whitening journey!
            </p>
          </div>
        </section>

        {/* Product Listing Section */}
        <section className="pb-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xl">
                <p className="text-gray-500 font-medium">
                  No products found. Please check your Shopify connection.
                </p>
              </div>
            ) : (
              <ShopGrid products={products} />
            )}
          </div>
        </section>

        {/* Trust Badge Section */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
                  value: "98%", 
                  label: "Success Rate",
                  desc: "Visible results in 7 days"
                },
                { 
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                  value: "5.0", 
                  label: "Trustpilot Score",
                  desc: "Based on 5,600+ reviews"
                },
                { 
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-4.446-3.61-8.125-8.125-8.125H11.25M11.25 18.75V3.125" /></svg>,
                  value: "FAST", 
                  label: "Worldwide Delivery",
                  desc: "Tracked shipping on all orders"
                },
                { 
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
                  value: "100%", 
                  label: "Vegan & Cruelty Free",
                  desc: "Peroxide-free formula"
                }
              ]
.map((badge, index) => (
                <div key={index} className="group p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 mb-4 mx-auto group-hover:bg-purple-700 group-hover:text-white transition-all duration-300">
                    {badge.icon}
                  </div>
                  <div className="text-3xl font-black text-black mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {badge.value}
                  </div>
                  <div className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-2">
                    {badge.label}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {badge.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
