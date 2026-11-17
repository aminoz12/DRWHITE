import { shopifyClientFetch } from './shopify';

// Email signups (footer newsletter, welcome popup) are stored as Shopify
// customers with marketing consent, so they show up in Shopify admin →
// Customers ("Email subscribers" segment) and flow into any email tool
// connected to the store. No third-party form service involved — works on
// any static host.
const CUSTOMER_CREATE = `
  mutation newsletterSignup($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id }
      customerUserErrors { code message }
    }
  }
`;

function randomPassword() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Subscribes an email to marketing. Throws if Shopify did not accept it. */
export async function subscribeEmail(email: string): Promise<void> {
  const result = await shopifyClientFetch({
    query: CUSTOMER_CREATE,
    variables: {
      input: { email, password: randomPassword(), acceptsMarketing: true },
    },
  });
  const payload = result?.data?.customerCreate;
  const errors: { code?: string; message?: string }[] = payload?.customerUserErrors ?? [];
  // An already-registered email still counts as subscribed.
  if (payload?.customer || errors.some((err) => err.code === 'TAKEN')) return;
  throw new Error(errors[0]?.message || 'customerCreate returned no customer');
}
