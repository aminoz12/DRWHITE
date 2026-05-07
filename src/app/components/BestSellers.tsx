import Link from 'next/link';
import { getProducts } from '@/lib/shopify';

export default async function BestSellers() {
  const products = await getProducts();

  return (
    <section className="py-12 bg-[#EBF2FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trustpilot */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg className="w-5 h-5 text-[#00B67A]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-sm font-medium text-gray-800">Trustpilot</span>
        </div>

        {/* Heading */}
        <h2
          className="text-3xl font-black text-black text-center mb-10"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          BEST SELLERS
        </h2>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products found. Add your Shopify credentials to .env.local</p>
            <p className="text-sm mt-2">SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.slice(0, 5).map((product: any) => {
              const node = product.node;
              const image = node.images?.edges[0]?.node;
              const price = node.priceRange?.minVariantPrice;

              return (
                <Link key={node.id} href={`/product/${node.handle}`} className="group block">
                  {/* Image - No Card Frame */}
                  <div className="relative aspect-square mb-4">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || node.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="font-black text-black text-xs leading-tight mb-2 uppercase tracking-wide">
                      {node.title}
                    </h3>

                    <span className="font-black text-black text-sm">
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: price?.currencyCode || 'MAD',
                      }).format(parseFloat(price?.amount || '0'))}
                    </span>
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
