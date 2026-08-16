import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ShopGrid from './ShopGrid';


export const metadata: Metadata = {
  title: 'Shop All Products',
  alternates: { canonical: '/shop' },
  description: 'Explore our full range of professional-grade teeth whitening kits, strips, and accessories.',
};

export default async function ShopPage() {
  const country = await getServerCountry();
  const products = await getProducts(country);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main id="main-content">
        {/* Product Listing Section */}
        <section className="pt-10 sm:pt-16 pb-14 sm:pb-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="sr-only">Shop All CLINI WHITE Teeth Whitening Products</h1>
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xl">
                <p className="text-gray-600 font-medium">
                  No products found. Please check your Shopify connection.
                </p>
              </div>
            ) : (
              <ShopGrid products={products} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
