import type { Metadata } from 'next';
import { getProduct, getProducts } from '@/lib/shopify';
import ProductDetails from '@/app/components/ProductDetails';
import FAQ from '@/app/components/FAQ';
import FeaturedCollection from '@/app/components/FeaturedCollection';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { SITE_URL, BRAND_NAME } from '@/lib/siteConfig';

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

function cleanDescription(text: string | undefined, fallback: string): string {
  if (!text) return fallback;
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (!collapsed) return fallback;
  return collapsed.length > 160 ? `${collapsed.slice(0, 157)}…` : collapsed;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  const canonical = `${SITE_URL}/product/${handle}`;

  if (!product) {
    return {
      title: 'Product Not Found',
      alternates: { canonical },
    };
  }

  const title = `${product.title} | ${BRAND_NAME}`;
  const description = cleanDescription(
    product.description,
    `Shop ${product.title} from ${BRAND_NAME} — professional, peroxide-free teeth whitening with zero sensitivity.`
  );
  const image = product.images?.edges?.[0]?.node?.url;

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <main id="main-content" className="py-16">
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

  const price = product.priceRange?.minVariantPrice;
  const anyAvailable = product.variants?.edges?.some(
    (e: any) => e.node.availableForSale
  );

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: cleanDescription(product.description, product.title),
    image: product.images?.edges?.map((e: any) => e.node.url) ?? [],
    brand: { '@type': 'Brand', name: BRAND_NAME },
    url: `${SITE_URL}/product/${handle}`,
    offers: {
      '@type': 'Offer',
      price: price?.amount,
      priceCurrency: price?.currencyCode || 'GBP',
      availability: anyAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${handle}`,
    },
    // NOTE: no aggregateRating/review markup until a real reviews platform
    // (e.g. Judge.me) supplies genuine data — invented values risk a Google
    // structured-data manual action and breach UK consumer-protection rules.
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header />
      <main id="main-content">
        <ProductDetails product={product} />
        <FAQ />
        <FeaturedCollection />
      </main>
      <Footer />
    </div>
  );
}
