import { getProducts } from '@/lib/shopify';
import ProductCard from '@/app/components/ProductCard';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Shop All Products
          </h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Professional teeth whitening solutions for your brightest smile
          </p>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No products found. Please check your Shopify connection or add products to your store.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.node.id} product={product.node} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
