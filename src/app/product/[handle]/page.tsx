import type { Metadata } from 'next';
import { getProduct, getProducts, type ShopifyProductEdge } from '@/lib/shopify';
import ProductDetails from '@/app/components/ProductDetails';
import FAQ from '@/app/components/FAQ';
import FeaturedCollection from '@/app/components/FeaturedCollection';
import RealResults from '@/app/components/RealResults';
import UgcReels from '@/app/components/UgcReels';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { SITE_URL, BRAND_NAME } from '@/lib/siteConfig';
import { getServerCountry } from '@/lib/market-server';
import { displayTitle, shortTitle } from '@/lib/productTitle';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product: ShopifyProductEdge) => ({
      handle: product.node.handle,
    }));
  } catch {
    console.log('generateStaticParams: Shopify fetch failed, returning empty array');
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ subscribe?: string }>;
}

function cleanDescription(text: string | undefined, fallback: string): string {
  if (!text) return fallback;
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (!collapsed) return fallback;
  return collapsed.length > 160 ? `${collapsed.slice(0, 157)}…` : collapsed;
}

function schemaDescription(text: string | undefined, fallback: string): string {
  const collapsed = text?.replace(/\s+/g, ' ').trim();
  return collapsed || fallback;
}

// Google truncates <title> around 60 characters. Bundle names blow past that
// once the "| CLINIWHITE" template is appended, so append the brand only when
// it fits, then fall back to the bare title, then to a word-boundary trim.
const TITLE_MAX = 60;

function seoTitle(productTitle: string): string {
  const branded = `${productTitle} | ${BRAND_NAME}`;
  if (branded.length <= TITLE_MAX) return branded;
  if (productTitle.length <= TITLE_MAX) return productTitle;

  const trimmed = productTitle.slice(0, TITLE_MAX);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 30 ? trimmed.slice(0, lastSpace) : trimmed).replace(/[\s–-]+$/, '');
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

  const name = displayTitle(product.title);
  const title = `${name} | ${BRAND_NAME}`;
  const description = cleanDescription(
    product.description,
    `Shop ${name} from ${BRAND_NAME}. See product-specific directions, ingredients, price, and availability.`
  );
  const image = product.images?.edges?.[0]?.node?.url;

  return {
    // `absolute` so the layout's "%s | CLINIWHITE" template cannot re-append
    // the brand and push the tag back over 60 characters.
    title: { absolute: seoTitle(name) },
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { handle } = await params;
  const { subscribe } = await searchParams;
  const country = await getServerCountry();
  const product = await getProduct(handle, country);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header country={country} />
        <main id="main-content" className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-gray-600 mt-4">
              The product you are looking for does not exist.
            </p>
          </div>
        </main>
        <Footer country={country} />
      </div>
    );
  }

  const price = product.priceRange?.minVariantPrice;
  const firstVariant = product.variants?.edges?.[0]?.node;
  const anyAvailable = product.variants?.edges?.some(
    (e: { node: { availableForSale: boolean } }) => e.node.availableForSale
  );

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle(product.title),
    description: schemaDescription(product.description, product.title),
    image: product.images?.edges?.map((e: { node: { url: string } }) => e.node.url) ?? [],
    brand: { '@type': 'Brand', name: BRAND_NAME },
    url: `${SITE_URL}/product/${handle}`,
    ...(firstVariant?.sku ? { sku: firstVariant.sku } : {}),
    offers: {
      '@type': 'Offer',
      price: price?.amount,
      priceCurrency: price?.currencyCode || 'GBP',
      availability: anyAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE_URL}/product/${handle}`,
    },
    // NOTE: no aggregateRating/review markup until a real reviews platform
    // (e.g. Judge.me) supplies genuine data — invented values risk a Google
    // structured-data manual action and breach UK consumer-protection rules.
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header country={country} />
      <main id="main-content">
        <ProductDetails product={product} startWithSubscription={subscribe === '1'} />
        <RealResults />
        <UgcReels />
        <FAQ productTitle={shortTitle(product.title)} />
        <FeaturedCollection excludeHandle={handle} />
      </main>
      <Footer country={country} />
    </div>
  );
}
