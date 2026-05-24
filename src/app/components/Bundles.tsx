import { getProductsByCollection } from '@/lib/shopify';
import type { ShopifyProductEdge } from '@/lib/shopify';
import ProductCard from './ProductCard';

export default async function Bundles() {
  const products = (await getProductsByCollection('huge-savings')) as ShopifyProductEdge[];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#0047AB] text-xs font-black tracking-[0.3em] uppercase mb-4">
            EXCLUSIVE OFFERS
          </p>
          <h2 
            className="text-4xl md:text-5xl font-black text-black leading-none uppercase tracking-tighter"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            HUGE <span className="text-[#0047AB]">SAVINGS</span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(({ node }) => (
              <ProductCard key={node.id} product={node} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
