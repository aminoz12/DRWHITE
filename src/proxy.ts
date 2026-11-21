import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_COOKIE, normalizeCountry } from './lib/market';

// Next 16 "proxy" (formerly middleware). First visit: default the pricing country from Vercel's geo header
// (x-vercel-ip-country): UK → GBP, EU → EUR, everyone else → USD. The
// currency switcher overwrites the cookie afterwards, and we never override
// an existing choice.
export function proxy(request: NextRequest) {
  if (request.cookies.get(COUNTRY_COOKIE)) return NextResponse.next();

  const country = normalizeCountry(request.headers.get('x-vercel-ip-country'));
  // Hand the country to this request as well as storing it: otherwise the
  // very first page would render in the default currency and only switch to
  // the visitor's own on their next click.
  request.cookies.set(COUNTRY_COOKIE, country);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(COUNTRY_COOKIE, country, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  // Skip static assets and API routes.
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
