import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ShopGrid from './ShopGrid';


export const metadata: Metadata = {
  title: 'Shop All Products | CLINI WHITE',
  description: 'Explore our full range of professional-grade teeth whitening kits, strips, and accessories.',
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Product Listing Section */}
        <section className="pt-16 pb-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xl">
                <p className="text-gray-500 font-medium">
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
