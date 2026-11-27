import type { NextRequest } from 'next/server';
import { getCatalogProducts, type CatalogProduct } from '@/lib/shopify';
import { normalizeCountry } from '@/lib/market';
import { getProductKind, type ProductKind } from '@/lib/productKind';
import { SHOP_CATEGORIES } from '@/lib/categories';
import { displayTitle } from '@/lib/productTitle';
import { BRAND_NAME, SITE_URL } from '@/lib/siteConfig';

// Product catalogue for Pinterest Shopping (Catalogs → data source), in the
// RSS 2.0 + g: namespace format, which Google Merchant Center and Meta also
// read. One feed per market: /feeds/pinterest.xml is US/USD,
// ?country=GB is GBP, ?country=FR is EUR, priced through Shopify @inContext.

// Google product taxonomy (taxonomy-with-ids.en-US.txt), by product type.
const GOOGLE_CATEGORY: Record<ProductKind, string> = {
  strips: 'Health & Beauty > Personal Care > Oral Care > Teeth Whiteners',
  serum: 'Health & Beauty > Personal Care > Oral Care > Teeth Whiteners',
  foam: 'Health & Beauty > Personal Care > Oral Care > Teeth Whiteners',
  powder: 'Health & Beauty > Personal Care > Oral Care > Teeth Whiteners',
  toothpaste: 'Health & Beauty > Personal Care > Oral Care > Toothpaste',
  mouthwash: 'Health & Beauty > Personal Care > Oral Care > Mouthwash',
  toothbrush: 'Health & Beauty > Personal Care > Oral Care > Toothbrushes',
  bundle: 'Health & Beauty > Personal Care > Oral Care',
  other: 'Health & Beauty > Personal Care > Oral Care',
};

const DESCRIPTION_MAX = 10000; // Pinterest's limit

function xml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function money(amount: string, currency: string): string {
  return `${Number(amount).toFixed(2)} ${currency}`;
}

function toItem(product: CatalogProduct): string | null {
  const variant = product.variants?.edges?.[0]?.node;
  const images = product.images.edges.map((e) => e.node.url);
  if (!variant || !images.length) return null;

  const kind = getProductKind(product.title);
  const category = SHOP_CATEGORIES.find((c) => c.kinds.includes(kind));
  const title = displayTitle(product.title);
  const description = product.description.replace(/\s+/g, ' ').trim().slice(0, DESCRIPTION_MAX) || title;

  // Pinterest shows a sale when sale_price is below price, so the compare-at
  // price goes in `price` and the price actually charged in `sale_price`.
  const { price, compareAtPrice } = variant;
  const onSale = compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);

  const fields: [string, string][] = [
    ['g:id', variant.id.split('/').pop() || variant.id],
    ['title', title],
    ['description', description],
    ['link', `${SITE_URL}/product/${product.handle}`],
    ['g:image_link', images[0]],
    ...images.slice(1).map((url): [string, string] => ['g:additional_image_link', url]),
    ['g:price', money(onSale ? compareAtPrice.amount : price.amount, price.currencyCode)],
    ...(onSale ? [['g:sale_price', money(price.amount, price.currencyCode)] as [string, string]] : []),
    ['g:availability', variant.availableForSale ? 'in stock' : 'out of stock'],
    ['g:condition', 'new'],
    ['g:brand', BRAND_NAME],
    ['g:google_product_category', GOOGLE_CATEGORY[kind]],
    ...(category ? [['g:product_type', `Oral care > ${category.label}`] as [string, string]] : []),
  ];

  return `    <item>\n${fields.map(([tag, value]) => `      <${tag}>${xml(value)}</${tag}>`).join('\n')}\n    </item>`;
}

export async function GET(request: NextRequest) {
  const country = normalizeCountry(request.nextUrl.searchParams.get('country'));
  const items = (await getCatalogProducts(country)).map(toItem).filter(Boolean);

  // An empty feed would make Pinterest drop the whole catalogue; a 503 makes
  // it keep the last good ingestion and retry on its next run.
  if (!items.length) {
    return new Response('Catalogue unavailable', { status: 503, headers: { 'Retry-After': '3600' } });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xml(BRAND_NAME)}</title>
    <link>${xml(SITE_URL)}</link>
    <description>${xml(BRAND_NAME)} product catalogue</description>
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
