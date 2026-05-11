import Link from 'next/link';
import { getProductsByCollection } from '@/lib/shopify';

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(parseFloat(amount));
}

function calculateDiscount(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export default async function Bundles() {
  const products = await getProductsByCollection('huge-savings');

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map(({ node }: { node: any }) => {
              const price = parseFloat(node.priceRange.minVariantPrice.amount);
              const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount 
                ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
                : null;
              const discount = comparePrice ? calculateDiscount(price, comparePrice) : 0;
              const imageUrl = node.images.edges[0]?.node.url || '/product-1.jpg';
              return (
                <Link
                  key={node.id}
                  href={`/product/${node.handle}`}
                  className="group block"
                >
                  {/* Image - No Card Frame */}
                  <div className="relative aspect-square mb-4">
                    <img
                      src={imageUrl}
                      alt={node.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="font-black text-black text-xs leading-tight mb-2 uppercase tracking-wide">
                      {node.title}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span className="font-black text-black text-sm">
                        {formatPrice(node.priceRange.minVariantPrice.amount, 'MAD')}
                      </span>
                      {comparePrice && comparePrice > price && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(comparePrice.toString(), 'MAD')}
                        </span>
                      )}
                    </div>
                    
                    {discount > 0 && (
                      <div className="mt-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
                        {discount}% OFF
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
