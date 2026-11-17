'use client';

import { OPEN_WELCOME_OFFER } from '@/lib/events';

// Any CTA that should open the welcome-offer dialog (the popup listens for it).
export default function OpenWelcomeOfferButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_WELCOME_OFFER))}
    >
      {children}
    </button>
  );
}
