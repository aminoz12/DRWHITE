import { getProducts } from '@/lib/shopify';
import type { ShopifyProductEdge } from '@/lib/shopify';
import SectionHeading from './SectionHeading';
import Marker from './Marker';
import RangeTabs from './RangeTabs';
import { BRAND_NAME, SITE_URL } from '@/lib/siteConfig';
import { getServerCountry } from '@/lib/market-server';
import { displayTitle } from '@/lib/productTitle';

const FEATURED_COUNT = 4;

export default async function ShopTheRange() {
  const country = await getServerCountry();
  const products = (await getProducts(country)) as ShopifyProductEdge[];
  if (products.length === 0) return null;

  // Structured data describes the default tab (the best sellers).
  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, FEATURED_COUNT).map((p, i) => {
      const node = p.node;
      const image = node.images?.edges[0]?.node;
      const price = node.priceRange?.minVariantPrice;
      const available = node.variants?.edges.some((variant) => variant.node.availableForSale);
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: displayTitle(node.title),
          url: `${SITE_URL}/product/${node.handle}`,
          image: image?.url,
          brand: { '@type': 'Brand', name: BRAND_NAME },
          offers: {
            '@type': 'Offer',
            price: price?.amount,
            priceCurrency: price?.currencyCode || 'GBP',
            availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/product/${node.handle}`,
          },
        },
      };
    }),
  };

  return (
    <section aria-labelledby="range-heading" className="bg-white py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="range-heading"
          eyebrow="Customer favourites"
          title={
            <>
              Shop the <Marker>range</Marker>
            </>
          }
        />
        <RangeTabs products={products} />
      </div>
    </section>
  );
}
