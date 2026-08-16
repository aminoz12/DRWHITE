import { DEFAULT_COUNTRY, getClientCountry } from './market';

const rawDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com';
const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export const SHOPIFY_DOMAIN = domain;

// Domain that actually serves a working Shopify checkout. The Storefront API
// returns checkoutUrl on the store's *primary* domain, which for this store is
// a dead Vercel deployment (drwhitecare.com → 404). We rewrite the host to the
// canonical myshopify.com domain (always serves checkout), or to an explicit
// override if one is configured (e.g. shop.cliniwhite.com once that subdomain
// is connected in Shopify admin — see .env.example).
const CHECKOUT_DOMAIN = (
  process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN || domain
)
  .replace(/^https?:\/\//, '')
  .replace(/\/+$/, '');

// Customer-facing Shopify pages (checkout, account login) live on the branded
// storefront domain when one is configured, else on the myshopify.com domain.
export const SHOPIFY_ACCOUNT_URL = `https://${CHECKOUT_DOMAIN}/account`;

/**
 * Force a Shopify checkoutUrl onto a domain that resolves. Keeps the cart
 * token/path intact and only swaps the host, so the checkout session survives.
 * Returns the original string unchanged if it can't be parsed.
 */
export function normalizeCheckoutUrl(url: string | null | undefined): string | null {
  if (!url) return url ?? null;
  try {
    const parsed = new URL(url);
    // Already on a known-good Shopify host → leave it alone.
    if (parsed.hostname === CHECKOUT_DOMAIN || parsed.hostname.endsWith('.myshopify.com')) {
      return url;
    }
    parsed.hostname = CHECKOUT_DOMAIN;
    parsed.protocol = 'https:';
    parsed.port = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductImage {
  url: string;
  altText: string | null;
}

export interface ShopifyProductVariant {
  id: string;
  title?: string;
  sku?: string | null;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  updatedAt?: string;
  description: string;
  tags?: string[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
  };
  images: {
    edges: Array<{ node: ShopifyProductImage }>;
  };
  options?: Array<{
    name: string;
    values: string[];
  }>;
  variants?: {
    edges: Array<{ node: ShopifyProductVariant }>;
  };
}

export interface ShopifyProductEdge {
  node: ShopifyProductNode;
}

export async function shopifyFetch({ query, variables }: { query: string; variables?: Record<string, unknown> }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  // Skip fetch during build if credentials not configured
  if (!storefrontAccessToken || domain.includes('your-store')) {
    console.log('Shopify not configured, returning empty data');
    return { data: null };
  }

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    });

    return await result.json();
  } catch (error) {
    console.error('Shopify fetch error:', error);
    return { data: null, errors: [{ message: 'Fetch failed' }] };
  }
}

// ─── CLIENT-SAFE FETCH (no next.revalidate) ────────────────────────────────
export async function shopifyClientFetch({ query, variables }: { query: string; variables?: Record<string, unknown> }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  const token = storefrontAccessToken;

  if (!token || domain.includes('your-store')) {
    throw new Error('Shopify not configured');
  }

  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  return await result.json();
}

// ─── PRODUCT QUERIES ───────────────────────────────────────────────────────
export async function getProducts(country: string = DEFAULT_COUNTRY) {
  const query = `
    query getProducts($country: CountryCode) @inContext(country: $country) {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            updatedAt
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            options {
              name
              values
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
              id
              availableForSale
              sku
              price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { country } });
  return response.data?.products?.edges || [];
}

export async function getProductsByCollection(handle: string, country: string = DEFAULT_COUNTRY) {
  const query = `
    query getCollection($handle: String!, $country: CountryCode) @inContext(country: $country) {
      collection(handle: $handle) {
        id
        title
        products(first: 10) {
          edges {
            node {
            id
            title
            handle
            updatedAt
            description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              tags
              options {
                name
                values
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
              id
              availableForSale
              sku
              price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle, country } });

  if (response.errors) {
    console.error('Shopify collection error:', response.errors);
  }

  if (!response.data?.collection) {
    console.log(`Collection "${handle}" not found or empty`);
  }

  return response.data?.collection?.products?.edges || [];
}

export async function getProduct(handle: string, country: string = DEFAULT_COUNTRY) {
  const query = `
    query getProduct($handle: String!, $country: CountryCode) @inContext(country: $country) {
      product(handle: $handle) {
        id
        title
        handle
        updatedAt
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
          id
          title
          sku
          price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
              # Subscription offers attached to this variant. Empty until a
              # selling plan exists in Shopify — see docs/subscriptions.md.
              # The allocation carries the real recurring price, so we never
              # compute a discount the checkout would not honour.
              sellingPlanAllocations(first: 10) {
                edges {
                  node {
                    sellingPlan {
                      id
                      name
                      recurringDeliveries
                    }
                    priceAdjustments {
                      price { amount currencyCode }
                      compareAtPrice { amount currencyCode }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle, country } });
  return response.data?.product;
}

// ─── CART MUTATIONS ────────────────────────────────────────────────────────

/** A line to add to the cart. `sellingPlanId` turns it into a subscription. */
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
    };
    image?: {
      url: string;
      altText: string | null;
    };
  };
  /** Present only on subscription lines — carries the plan's display name. */
  sellingPlanAllocation?: {
    sellingPlan: {
      id: string;
      name: string;
      recurringDeliveries: boolean;
    };
  } | null;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{ node: CartLine }>;
  };
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { amount currencyCode }
          }
          sellingPlanAllocation {
            sellingPlan { id name recurringDeliveries }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function createCart(
  lines: CartLineInput[]
): Promise<Cart | null> {
  const query = `
    mutation cartCreate($input: CartInput!, $country: CountryCode) @inContext(country: $country) {
      cartCreate(input: $input) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `;

  const country = getClientCountry();
  const response = await shopifyClientFetch({
    query,
    variables: { input: { lines, buyerIdentity: { countryCode: country } }, country },
  });

  if (response.errors || response.data?.cartCreate?.userErrors?.length) {
    console.error('Cart create errors:', response.errors || response.data?.cartCreate?.userErrors);
    return null;
  }

  return response.data?.cartCreate?.cart ?? null;
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart | null> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode) @inContext(country: $country) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `;

  const response = await shopifyClientFetch({
    query,
    variables: { cartId, lines, country: getClientCountry() },
  });

  if (response.errors || response.data?.cartLinesAdd?.userErrors?.length) {
    console.error('Cart add errors:', response.errors || response.data?.cartLinesAdd?.userErrors);
    return null;
  }

  return response.data?.cartLinesAdd?.cart ?? null;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart | null> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode) @inContext(country: $country) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `;

  const response = await shopifyClientFetch({
    query,
    variables: { cartId, lines, country: getClientCountry() },
  });

  return response.data?.cartLinesUpdate?.cart ?? null;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart | null> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode) @inContext(country: $country) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `;

  const response = await shopifyClientFetch({
    query,
    variables: { cartId, lineIds, country: getClientCountry() },
  });

  return response.data?.cartLinesRemove?.cart ?? null;
}

/**
 * Reprice an existing cart in another market's currency by updating the
 * buyer identity's country. Used by the currency switcher.
 */
export async function updateCartBuyerCountry(
  cartId: string,
  country: string
): Promise<Cart | null> {
  const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!, $country: CountryCode) @inContext(country: $country) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `;

  const response = await shopifyClientFetch({
    query,
    variables: { cartId, buyerIdentity: { countryCode: country }, country },
  });

  if (response.errors || response.data?.cartBuyerIdentityUpdate?.userErrors?.length) {
    console.error(
      'Cart buyer identity errors:',
      response.errors || response.data?.cartBuyerIdentityUpdate?.userErrors
    );
    return null;
  }

  return response.data?.cartBuyerIdentityUpdate?.cart ?? null;
}

// ─── LEGACY HELPERS (kept as fallback) ────────────────────────────────────
export function getShopifyDomain(): string {
  return domain;
}

export function createCartUrl(items: { variantId: string; quantity: number }[]): string {
  const cartItems = items.map((item) => {
    const id = item.variantId.includes('/') ? item.variantId.split('/').pop() : item.variantId;
    return `${id}:${item.quantity}`;
  });
  return `https://${domain}/cart/${cartItems.join(',')}`;
}

export function addToCartUrl(variantId: string, quantity: number = 1): string {
  const id = variantId.includes('/') ? variantId.split('/').pop() : variantId;
  return `https://${domain}/cart/${id}:${quantity}`;
}
