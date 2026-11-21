// Market/currency handling. The visitor's pricing country lives in a cookie:
// set on first visit by the proxy from Vercel's geo header, overridable at
// any time via the currency switcher. It drives Shopify @inContext pricing
// site-wide (product pages, shop grid, cart and checkout).
//
// UK visitors price in GBP, EU visitors in EUR (or their own currency, see
// LOCAL_CURRENCY_EU), and everyone else — US and the rest of the world — in
// USD, the Shopify store's base currency.

export const COUNTRY_COOKIE = 'cw_country';
export const DEFAULT_COUNTRY = 'US';

export const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
]);

export interface Market {
  /** Representative CountryCode sent to Shopify @inContext. */
  country: string;
  currency: string;
  symbol: string;
  label: string;
}

/** The options offered in the currency switcher (must match active Shopify markets). */
export const MARKETS: Market[] = [
  { country: 'GB', currency: 'GBP', symbol: '£', label: 'United Kingdom (GBP £)' },
  { country: 'FR', currency: 'EUR', symbol: '€', label: 'Europe (EUR €)' },
  { country: 'US', currency: 'USD', symbol: '$', label: 'United States (USD $)' },
];

/**
 * EU members Shopify's Europe market prices in their own currency rather than
 * in euros. Their @inContext prices come back in these currencies, so the
 * switcher pill must say so instead of claiming "EUR €" next to a CZK price.
 */
const LOCAL_CURRENCY_EU: Record<string, { currency: string; symbol: string; label: string }> = {
  CZ: { currency: 'CZK', symbol: 'Kč', label: 'Czechia (CZK Kč)' },
  DK: { currency: 'DKK', symbol: 'kr', label: 'Denmark (DKK kr)' },
  HU: { currency: 'HUF', symbol: 'Ft', label: 'Hungary (HUF Ft)' },
  PL: { currency: 'PLN', symbol: 'zł', label: 'Poland (PLN zł)' },
  RO: { currency: 'RON', symbol: 'lei', label: 'Romania (RON lei)' },
  SE: { currency: 'SEK', symbol: 'kr', label: 'Sweden (SEK kr)' },
};

/** Map any ISO country code to a supported pricing country. */
export function normalizeCountry(code: string | null | undefined): string {
  const c = (code || '').toUpperCase().trim();
  if (!c) return DEFAULT_COUNTRY;
  if (c === 'GB' || c === 'UK') return 'GB';
  if (EU_COUNTRIES.has(c)) return c; // EU members price through the Europe market
  return DEFAULT_COUNTRY; // the US and the rest of the world price in USD
}

export function marketForCountry(country: string): Market {
  const c = normalizeCountry(country);
  const local = LOCAL_CURRENCY_EU[c];
  if (local) return { country: c, ...local };
  if (EU_COUNTRIES.has(c)) return MARKETS[1];
  if (c === 'US') return MARKETS[2];
  return MARKETS[0];
}

/** Client-side cookie read (returns DEFAULT_COUNTRY during SSR). */
export function getClientCountry(): string {
  if (typeof document === 'undefined') return DEFAULT_COUNTRY;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([^;]+)`));
  return normalizeCountry(match?.[1]);
}

export function setClientCountry(country: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${COUNTRY_COOKIE}=${normalizeCountry(country)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}
