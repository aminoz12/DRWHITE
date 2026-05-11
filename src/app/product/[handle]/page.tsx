import { getProduct, getProducts } from '@/lib/shopify';
import ProductDetails from '@/app/components/ProductDetails';
import FAQ from '@/app/components/FAQ';
import FeaturedCollection from '@/app/components/FeaturedCollection';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product: any) => ({
      handle: product.node.handle,
    }));
  } catch (error) {
    console.log('generateStaticParams: Shopify fetch failed, returning empty array');
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-gray-600 mt-4">
              The product you are looking for does not exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main>
        <ProductDetails product={product} />
        <FAQ />
        <FeaturedCollection />
      </main>
      <Footer />
    </div>
  );
}
