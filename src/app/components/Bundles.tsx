import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProductsByCollection } from '@/lib/shopify';
import type { ShopifyProductEdge } from '@/lib/shopify';
import ProductCard from './ProductCard';
import { getServerCountry } from '@/lib/market-server';

const FEATURED_COUNT = 4;

export default async function Bundles() {
  const country = await getServerCountry();
  const products = (await getProductsByCollection('huge-savings', country)) as ShopifyProductEdge[];
  const featured = products.slice(0, FEATURED_COUNT);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
            EXCLUSIVE OFFERS
          </p>
          <h2 
            className="font-display text-3xl md:text-4xl font-extrabold text-black leading-none uppercase tracking-tight"
          >
            HUGE <span className="text-[#231b50]">SAVINGS</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-4 max-w-lg mx-auto">
            Bundle your favorite products and unlock professional whitening for less.
          </p>
        </div>
        
        {products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products found. Create a collection named &quot;huge-savings&quot; in your Shopify admin.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map(({ node }) => (
                <ProductCard key={node.id} product={node} />
              ))}
            </div>

            {products.length > FEATURED_COUNT && (
              <div className="text-center mt-10">
                <Link
                  href="/bundles"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#231b50] px-8 text-[11px] font-black uppercase tracking-widest text-[#231b50] transition-colors hover:bg-[#231b50] hover:text-white"
                >
                  See all {products.length} bundles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
