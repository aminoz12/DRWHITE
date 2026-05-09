import { getProductsByCollection } from '@/lib/shopify';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BundlesGrid from './BundlesGrid';

export const metadata = {
  title: 'Bundle & Save | DR.WHITE — Professional Teeth Whitening',
  description: 'Save more when you bundle DR.WHITE professional whitening products. Stack your routine and get the best value on strips, kits, and accessories.',
};

export default async function BundlesPage() {
  const products = await getProductsByCollection('bundles');
  // Fallback to huge-savings collection if bundles doesn't exist
  const allProducts = products.length > 0 ? products : await getProductsByCollection('huge-savings');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="bg-[#0047AB] text-white py-20 px-4 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block bg-white/20 text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-full mb-6 uppercase">
              LIMITED TIME
            </span>
            <h1
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-none"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}
            >
              BUNDLE<br />
              <span className="text-[#A5C8FF]">&amp; SAVE</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Stack your whitening routine and unlock serious savings. The more you bundle, the more you save.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { value: 'Up to 40%', label: 'Off Single Prices' },
                { value: 'Free', label: 'Shipping on Bundles' },
                { value: '30-Day', label: 'Money-Back Guarantee' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-white/60 font-bold tracking-wider uppercase mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Bundle */}
        <section className="bg-[#EBF2FA] py-12 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '💰',
                title: 'MAXIMUM SAVINGS',
                desc: 'Bundles are priced below individual product totals — always.',
              },
              {
                icon: '🦷',
                title: 'COMPLETE ROUTINE',
                desc: 'Whiten, maintain, and protect. Every bundle is expertly curated.',
              },
              {
                icon: '🚚',
                title: 'FREE SHIPPING',
                desc: 'Every bundle ships free, no minimum spend required.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100"
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3
                  className="text-sm font-black text-[#0047AB] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bundles Grid — client component for cart */}
        <section className="py-16 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#0047AB] text-xs font-black tracking-widest uppercase mb-3">
                CURATED COMBINATIONS
              </p>
              <h2
                className="text-4xl md:text-5xl font-black text-black"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}
              >
                SHOP BUNDLES
              </h2>
            </div>

            <BundlesGrid products={allProducts} />
          </div>
        </section>

        {/* Guarantee Strip */}
        <section className="bg-[#0047AB] py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p
              className="text-white text-xl font-black mb-2"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              NOT HAPPY? WE&apos;LL MAKE IT RIGHT.
            </p>
            <p className="text-white/70 text-sm max-w-lg mx-auto">
              Every bundle comes with our 30-day money-back guarantee. If you&apos;re not seeing results,
              contact us for a full refund — no questions asked.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
