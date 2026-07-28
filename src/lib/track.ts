// Lightweight wrappers around the analytics globals injected by
// components/Analytics.tsx. Every call is a safe no-op when the
// corresponding pixel isn't configured (its global never exists).

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;
interface Ttq {
  page: () => void;
  track: (event: string, params?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    ttq?: Ttq;
  }
}

export function trackPageView(path: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'page_view', { page_path: path });
  window.fbq?.('track', 'PageView');
  window.ttq?.page();
}

export interface AddToCartPayload {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  quantity: number;
}

export function trackAddToCart({ contentId, contentName, value, currency, quantity }: AddToCartPayload) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'add_to_cart', {
    currency,
    value,
    items: [{ item_id: contentId, item_name: contentName, quantity }],
  });
  window.fbq?.('track', 'AddToCart', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value,
    currency,
  });
  window.ttq?.track('AddToCart', {
    content_id: contentId,
    content_name: contentName,
    content_type: 'product',
    value,
    currency,
    quantity,
  });
}
