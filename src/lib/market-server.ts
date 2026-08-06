import { cookies } from 'next/headers';
import { COUNTRY_COOKIE, DEFAULT_COUNTRY, normalizeCountry } from './market';

/**
 * Pricing country for the current request. Falls back to DEFAULT_COUNTRY in
 * build-time contexts (generateStaticParams) where no request scope exists.
 */
export async function getServerCountry(): Promise<string> {
  try {
    const store = await cookies();
    return normalizeCountry(store.get(COUNTRY_COOKIE)?.value);
  } catch {
    return DEFAULT_COUNTRY;
  }
}
