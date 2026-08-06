import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_COOKIE, normalizeCountry } from './lib/market';

// First visit: default the pricing country from Vercel's geo header
// (x-vercel-ip-country). The footer currency switcher overwrites the
// cookie afterwards, and we never override an existing choice.
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.get(COUNTRY_COOKIE)) {
    const geo = request.headers.get('x-vercel-ip-country');
    response.cookies.set(COUNTRY_COOKIE, normalizeCountry(geo), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }
  return response;
}

export const config = {
  // Skip static assets and API routes.
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
