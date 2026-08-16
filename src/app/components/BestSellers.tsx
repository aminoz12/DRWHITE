import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/shopify';
import type { ShopifyProductEdge } from '@/lib/shopify';
import ProductCard from './ProductCard';
import { STATS, SITE_URL } from '@/lib/siteConfig';
import { getServerCountry } from '@/lib/market-server';

const FEATURED_COUNT = 4;

export default async function BestSellers() {
  const country = await getServerCountry();
  const products = (await getProducts(country)) as ShopifyProductEdge[];
  const featured = products.slice(0, FEATURED_COUNT);

  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: featured.map((p, i) => {
      const node = p.node;
      const image = node.images?.edges[0]?.node;
      const price = node.priceRange?.minVariantPrice;
      const available = node.variants?.edges.some(
        (variant) => variant.node.availableForSale
      );
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: node.title,
          url: `${SITE_URL}/product/${node.handle}`,
          image: image?.url,
          brand: { '@type': 'Brand', name: 'CLINI WHITE' },
          offers: {
            '@type': 'Offer',
            price: price?.amount,
            priceCurrency: price?.currencyCode || 'GBP',
            availability: available
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/product/${node.handle}`,
          },
        },
      };
    }),
  };

  return (
    <section className="py-10 bg-[#F5F3FF]" aria-labelledby="bestsellers-heading">
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating summary */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-[#231b50]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="text-sm font-black text-gray-900">{STATS.ratingLabel}</span>
          <span className="text-sm text-gray-600">· {STATS.reviewsLabel} reviews</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
            SHOP THE RANGE
          </p>
          <h2
            id="bestsellers-heading"
            className="font-display text-3xl md:text-4xl font-extrabold text-black leading-none uppercase tracking-tight"
          >
            OUR BEST <span className="text-[#231b50]">SELLERS</span>
          </h2>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No products found. Add your Shopify credentials to .env.local</p>
            <p className="text-sm mt-2">SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.node.id} product={product.node} />
              ))}
            </div>

            {products.length > FEATURED_COUNT && (
              <div className="text-center mt-10">
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#231b50] px-8 text-[11px] font-black uppercase tracking-widest text-[#231b50] transition-colors hover:bg-[#231b50] hover:text-white"
                >
                  Shop all {products.length} products
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
