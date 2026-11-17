'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { TRUSTPILOT } from '@/lib/siteConfig';

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, forceReload?: boolean) => void };
  }
}

// A Trustpilot TrustBox. Renders nothing until the business unit ID is set, so
// the site never shows an empty or fake review widget. The bootstrap script is
// loaded once (next/script dedupes by src) after the page is interactive.
export default function TrustpilotWidget({
  template,
  height,
  className = '',
}: {
  template: keyof typeof TRUSTPILOT.templates;
  /** The TrustBox's own height, as given in its Trustpilot snippet. */
  height: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Client-side navigation: the script is already loaded, so initialise this
  // widget directly instead of waiting for a script load event.
  useEffect(() => {
    if (ref.current && window.Trustpilot) window.Trustpilot.loadFromElement(ref.current, true);
  }, []);

  if (!TRUSTPILOT.businessUnitId) return null;

  return (
    <>
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (ref.current && window.Trustpilot) window.Trustpilot.loadFromElement(ref.current, true);
        }}
      />
      <div
        ref={ref}
        className={`trustpilot-widget ${className}`}
        data-locale="en-GB"
        data-template-id={TRUSTPILOT.templates[template]}
        data-businessunit-id={TRUSTPILOT.businessUnitId}
        data-style-height={height}
        data-style-width="100%"
        data-theme="light"
      >
        <a href={TRUSTPILOT.reviewUrl} target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
    </>
  );
}
