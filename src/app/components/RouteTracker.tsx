'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/track';

// Reports client-side navigations to GA4 / Meta / TikTok. The pixel init
// scripts already report the landing page, so the first render is skipped.
export default function RouteTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
