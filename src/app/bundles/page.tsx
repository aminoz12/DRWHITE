import { getProducts, getProductsByCollection } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BundlesGrid from './BundlesGrid';
import { PiggyBank, Sparkles, Truck, BadgeCheck } from 'lucide-react';

export const metadata = {
  title: 'Bundle & Save — Professional Teeth Whitening',
  alternates: { canonical: '/bundles' },
  description: 'Save more when you bundle CLINI WHITE professional whitening products. Stack your routine and get the best value on strips, kits, and accessories.',
};

const PERKS = [
  { icon: PiggyBank, text: 'Up to 40% off single prices' },
  { icon: Truck, text: 'Free shipping on bundles' },
  { icon: BadgeCheck, text: '30-day money-back guarantee' },
];

const WHY_BUNDLE = [
  {
    icon: PiggyBank,
    title: 'MAXIMUM SAVINGS',
    desc: 'Bundles are priced below individual product totals — always.',
  },
  {
    icon: Sparkles,
    title: 'COMPLETE ROUTINE',
    desc: 'Whiten, maintain, and protect. Every bundle is expertly curated.',
  },
  {
    icon: Truck,
    title: 'FREE SHIPPING',
    desc: 'Every bundle ships free, no minimum spend required.',
  },
];

export default async function BundlesPage() {
  // Try the dedicated collections first, then fall back to any product
  // with "bundle" in its title so the page never renders empty.
  const country = await getServerCountry();
  const products = await getProductsByCollection('bundles', country);
  const fallback = products.length > 0 ? products : await getProductsByCollection('huge-savings', country);
  const allProducts =
    fallback.length > 0
      ? fallback
      : (await getProducts(country)).filter((p: { title: string }) => /bundle/i.test(p.title));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        {/* Page head — compact, no hero */}
        <section className="pt-16 pb-10 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
              Curated Combinations
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-black mb-4 uppercase tracking-tight">
              Bundle <span className="text-[#231b50]">&amp; Save</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Stack your whitening routine and unlock serious savings. The more you bundle,
              the more you save.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8">
              {PERKS.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 text-gray-600 text-[11px] font-bold uppercase tracking-widest"
                >
                  <Icon className="w-4 h-4 text-[#231b50]" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bundles Grid — client component for cart */}
        <section className="pb-16 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <BundlesGrid products={allProducts} />
          </div>
        </section>

        {/* Why Bundle */}
        <section className="bg-[#F5F3FF] py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-black text-center uppercase tracking-tight mb-10">
              Why <span className="text-[#231b50]">Bundle?</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {WHY_BUNDLE.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-8 text-center shadow-sm border border-violet-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#231b50] flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display text-sm font-extrabold text-[#231b50] uppercase tracking-wider mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee Strip */}
        <section className="bg-[#231b50] py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-display text-white text-xl font-extrabold mb-2 uppercase tracking-tight">
              Not happy? We&apos;ll make it right.
            </p>
            <p className="text-white/70 text-sm max-w-lg mx-auto">
              Every bundle comes with our 30-day money-back guarantee. If you&apos;re not seeing
              results, contact us for a full refund — no questions asked.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
