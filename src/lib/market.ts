// Market/currency handling. The visitor's pricing country lives in a cookie:
// set on first visit by middleware from Vercel's geo header, overridable at
// any time via the footer currency switcher. It drives Shopify @inContext
// pricing site-wide (product pages, shop grid, cart and checkout).

export const COUNTRY_COOKIE = 'cw_country';
export const DEFAULT_COUNTRY = 'GB';

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

/** Map any ISO country code to a supported pricing country. */
export function normalizeCountry(code: string | null | undefined): string {
  const c = (code || '').toUpperCase().trim();
  if (!c) return DEFAULT_COUNTRY;
  if (c === 'GB' || c === 'UK') return 'GB';
  if (EU_COUNTRIES.has(c)) return c; // any EU member prices in EUR
  if (c === 'US') return 'US';
  return DEFAULT_COUNTRY;
}

export function marketForCountry(country: string): Market {
  const c = normalizeCountry(country);
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
