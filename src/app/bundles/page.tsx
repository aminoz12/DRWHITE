import { getProducts, getProductsByCollection, type ShopifyProductEdge } from '@/lib/shopify';
import { getDiscountPercent } from '@/lib/money';
import { getServerCountry } from '@/lib/market-server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BundlesGrid from './BundlesGrid';
import GuaranteeBand from '@/app/components/GuaranteeBand';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import { PiggyBank, Sparkles, Truck, BadgeCheck } from 'lucide-react';

export const metadata = {
  title: 'Bundle & Save — Professional Teeth Whitening',
  alternates: { canonical: '/bundles' },
  description: 'Save more when you bundle CLINIWHITE professional whitening products. Stack your routine and get the best value on strips, kits, and accessories.',
};

const WHY_BUNDLE = [
  {
    icon: PiggyBank,
    title: 'Bigger savings',
    desc: 'Each set is priced below buying its items separately.',
  },
  {
    icon: Sparkles,
    title: 'A complete routine',
    desc: 'Products chosen to work together, from daily care to deeper whitening.',
  },
  {
    icon: Truck,
    title: 'Free express shipping',
    desc: 'Every set ships free and fast — no minimum spend.',
  },
];

export default async function BundlesPage() {
  // "huge-savings" is the store's bundle collection — same one the homepage
  // section reads. Falls back to any product with "bundle" in its title so
  // the page never renders empty.
  const country = await getServerCountry();
  const products = await getProductsByCollection('huge-savings', country);
  const allProducts =
    products.length > 0
      ? products
      : (await getProducts(country)).filter((p: ShopifyProductEdge) =>
          /bundle|kit/i.test(p.node.title)
        );

  // The headline saving is read from the live prices, so it can never claim
  // more than the biggest "SAVE x%" badge actually shown on the cards.
  const maxSaving = Math.max(
    0,
    ...(allProducts as ShopifyProductEdge[]).map(({ node }) =>
      getDiscountPercent(
        node.priceRange.minVariantPrice.amount,
        node.compareAtPriceRange?.minVariantPrice?.amount
      )
    )
  );
  const perks = [
    ...(maxSaving > 0 ? [{ icon: PiggyBank, text: `Save up to ${maxSaving}%` }] : []),
    { icon: Truck, text: 'Free shipping on bundles' },
    { icon: BadgeCheck, text: '30-day money-back guarantee' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header country={country} />
      <main id="main-content">
        {/* Page head — compact, no hero */}
        <section className="px-4 pb-10 pt-10 text-center sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              as="h1"
              eyebrow="Curated combinations"
              className="mb-0"
              title={
                <>
                  Bundle <Marker>&amp; save</Marker>
                </>
              }
              description={
                <>
                  Your whole routine in one box — <strong>for less, and shipped free.</strong>
                </>
              }
            />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {perks.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-600"
                >
                  <Icon className="h-4 w-4 text-grape" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bundles Grid — client component for cart */}
        <section className="bg-white px-4 pb-10 sm:pb-16">
          <div className="mx-auto max-w-7xl">
            <BundlesGrid products={allProducts} />
          </div>
        </section>

        {/* Why Bundle */}
        <section className="bg-lavender px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="Better together"
              title={
                <>
                  Why <Marker>bundle?</Marker>
                </>
              }
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {WHY_BUNDLE.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-grape">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 font-display font-wide text-sm font-extrabold uppercase tracking-wider text-grape">{title}</h3>
                  <p className="text-xs leading-relaxed text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GuaranteeBand />
      </main>
      <Footer country={country} />
    </div>
  );
}
