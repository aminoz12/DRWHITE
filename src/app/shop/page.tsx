import { Metadata } from 'next';
import { getProducts, type ShopifyProductEdge } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import ShopGrid from './ShopGrid';


export const metadata: Metadata = {
  title: 'Shop All Products',
  alternates: { canonical: '/shop' },
  description: 'Explore our full range of professional-grade teeth whitening kits, strips, and accessories.',
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const country = await getServerCountry();
  const products = (await getProducts(country)) as ShopifyProductEdge[];
  const { category } = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      <Header country={country} />

      <main id="main-content">
        <section className="pb-14 pt-10 sm:pb-24 sm:pt-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              as="h1"
              eyebrow="Peroxide-free, every one"
              split
              className="mb-8 sm:mb-10"
              title={
                <>
                  Shop <Marker>all</Marker>
                </>
              }
              description={
                <>
                  Whitening and colour-correcting care, <strong>covered by our 30-day money-back guarantee.</strong>
                </>
              }
            />
            {products.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 p-12 text-center">
                <p className="font-medium text-gray-600">
                  We couldn&apos;t load the products just now. Please refresh in a moment.
                </p>
              </div>
            ) : (
              // Keyed on the category so a Shop-menu link while already on
              // /shop restarts the grid on the chosen filter.
              <ShopGrid key={category ?? 'all'} products={products} initialCategory={category} />
            )}
          </div>
        </section>
      </main>

      <Footer country={country} />
    </div>
  );
}
