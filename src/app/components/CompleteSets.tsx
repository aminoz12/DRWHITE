import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProductsByCollection, type ShopifyProductEdge } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import { getDiscountPercent } from '@/lib/money';
import ProductCard from './ProductCard';
import SectionHeading from './SectionHeading';
import Marker from './Marker';

export default async function CompleteSets() {
  const country = await getServerCountry();
  const sets = ((await getProductsByCollection('huge-savings', country)) as ShopifyProductEdge[]).slice(0, 3);
  if (sets.length === 0) return null;

  // Headline saving is read from live prices — never more than the cards show.
  const maxSaving = Math.max(
    0,
    ...sets.map(({ node }) =>
      getDiscountPercent(node.priceRange.minVariantPrice.amount, node.compareAtPriceRange?.minVariantPrice?.amount)
    )
  );

  return (
    <section aria-labelledby="sets-heading" className="bg-porcelain py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="sets-heading"
          eyebrow="Exclusive offers"
          title={
            <>
              Complete <Marker>sets</Marker>
            </>
          }
          description={
            <>
              Your whole routine in one box —{' '}
              <strong>{maxSaving > 0 ? `save up to ${maxSaving}%` : 'for less'} and ship free.</strong>
            </>
          }
        />

        {/* Swipe on phones (three cards would orphan one in a 2-up grid). */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
          {sets.map(({ node }) => (
            <div key={node.id} className="w-[68%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={node} tile="white" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/bundles" className="btn-primary">
            Shop the bundles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <p className="mt-5 text-[13px] text-gray-500">Free express shipping on bundles · 30-day money-back guarantee</p>
        </div>
      </div>
    </section>
  );
}
