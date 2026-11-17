import { getProducts, getProductsByCollection } from '@/lib/shopify';
import type { ShopifyProductEdge } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import ProductCard from './ProductCard';
import Marker from './Marker';
import SectionHeading from './SectionHeading';

// "People also love" cross-sell strip on the product page. Rendered on the
// server so the links to sibling products are in the HTML Google crawls, not
// injected after hydration. Reads the store's "frontpage" collection (the
// one that actually exists in Shopify admin — there is no "featured"
// collection) and falls back to the full catalogue.
export default async function FeaturedCollection({
  excludeHandle,
}: {
  /** The product being viewed — never recommend it to itself. */
  excludeHandle?: string;
}) {
  const country = await getServerCountry();
  let products = (await getProductsByCollection('frontpage', country)) as ShopifyProductEdge[];
  if (products.length === 0) {
    products = (await getProducts(country)) as ShopifyProductEdge[];
  }
  products = products
    .filter((p) => p.node.handle !== excludeHandle)
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section className="border-t border-gray-100 bg-white py-14 sm:py-24" aria-labelledby="also-love-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="also-love-heading"
          eyebrow="Customer favourites"
          title={
            <>
              People also <Marker>love</Marker>
            </>
          }
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.node.id} product={product.node} />
          ))}
        </div>
      </div>
    </section>
  );
}
