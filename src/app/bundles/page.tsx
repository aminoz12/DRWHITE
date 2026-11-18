import { getProducts, getProductsByCollection, type ShopifyProductEdge } from '@/lib/shopify';
import { getDiscountPercent } from '@/lib/money';
import { getServerCountry } from '@/lib/market-server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BundlesGrid from './BundlesGrid';
import GuaranteeBand from '@/app/components/GuaranteeBand';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import { PiggyBank, Truck, BadgeCheck } from 'lucide-react';

export const metadata = {
  title: 'Bundle & Save — Professional Teeth Whitening',
  alternates: { canonical: '/bundles' },
  description: 'Save more when you bundle CLINIWHITE professional whitening products. Stack your routine and get the best value on strips, kits, and accessories.',
};

const WHY_BUNDLE = [
  {
    title: 'Bigger savings',
    desc: 'Each set is priced below buying its items separately.',
  },
  {
    title: 'A complete routine',
    desc: 'Products chosen to work together, from daily care to deeper whitening.',
  },
  {
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
        <section className="pb-8 pt-10 sm:pt-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              as="h1"
              eyebrow="Curated combinations"
              split
              className="mb-8"
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
            <ul className="flex flex-wrap gap-x-8 gap-y-3 border-y border-gray-200 py-4">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="type-eyebrow inline-flex items-center gap-2 text-grape">
                  <Icon className="h-4 w-4 text-violet" strokeWidth={1.75} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bundles Grid — client component for cart */}
        <section className="bg-white pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BundlesGrid products={allProducts} />
          </div>
        </section>

        {/* Why bundle */}
        <section aria-labelledby="why-bundle-heading" className="bg-porcelain py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="why-bundle-heading"
              eyebrow="Better together"
              title={
                <>
                  Why <Marker>bundle?</Marker>
                </>
              }
            />
            <ol className="grid gap-x-10 md:grid-cols-3">
              {WHY_BUNDLE.map(({ title, desc }, i) => (
                <li
                  key={title}
                  data-reveal=""
                  style={{ '--reveal-i': i } as React.CSSProperties}
                  className="border-t-2 border-grape py-6"
                >
                  <span aria-hidden className="font-display font-wide text-sm font-extrabold text-violet">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display font-wide text-xl font-extrabold uppercase leading-tight tracking-[-0.01em] text-grape">
                    {title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <GuaranteeBand />
      </main>
      <Footer country={country} />
    </div>
  );
}
