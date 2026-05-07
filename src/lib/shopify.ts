const rawDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com';
const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
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
      next: { revalidate: 60 }
    });

    return await result.json();
  } catch (error) {
    console.error('Shopify fetch error:', error);
    // Return empty data instead of throwing to prevent build failure
    return { data: null, errors: [{ message: 'Fetch failed' }] };
  }
}

export async function getProducts() {
  const query = `
    query getProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
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

  const response = await shopifyFetch({ query });
  return response.data?.products?.edges || [];
}

export async function getProductsByCollection(handle: string) {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
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
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle } });
  
  if (response.errors) {
    console.error('Shopify collection error:', response.errors);
  }
  
  if (!response.data?.collection) {
    console.log(`Collection "${handle}" not found or empty`);
  }
  
  return response.data?.collection?.products?.edges || [];
}

export async function getProduct(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
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
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle } });
  return response.data?.product;
}

// Cart helper functions
export function getShopifyDomain(): string {
  return domain;
}

export function createCartUrl(items: { variantId: string; quantity: number }[]): string {
  const cartItems = items.map(item => {
    const id = item.variantId.includes('/') ? item.variantId.split('/').pop() : item.variantId;
    return `${id}:${item.quantity}`;
  });
  return `https://${domain}/cart/${cartItems.join(',')}`;
}

export function addToCartUrl(variantId: string, quantity: number = 1): string {
  const id = variantId.includes('/') ? variantId.split('/').pop() : variantId;
  return `https://${domain}/cart/${id}:${quantity}`;
}
