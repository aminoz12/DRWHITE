'use client';

import { useState } from 'react';
import { ArrowRight, Check, Copy, Loader2 } from 'lucide-react';
import { subscribeEmail } from '@/lib/newsletter';
import { useCartStore } from '@/lib/cartStore';
import { WELCOME_OFFER } from '@/lib/siteConfig';

// Email capture for the welcome offer, shared by the popup and the footer
// band. Claiming subscribes the email in Shopify, then hands over the code
// right here and applies it to the cart — nothing depends on an email arriving.
export default function WelcomeOfferForm({
  layout = 'inline',
  tone = 'light',
  onClaimed,
}: {
  /** inline: field and button side by side (from sm up); stacked: always stacked. */
  layout?: 'inline' | 'stacked';
  /** dark: for navy backgrounds such as the footer. */
  tone?: 'light' | 'dark';
  onClaimed?: () => void;
}) {
  const dark = tone === 'dark';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'claimed' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const applyDiscountCode = useCartStore((s) => s.applyDiscountCode);
  // Only say "added to your bag" once Shopify has actually accepted the code.
  const isApplied = useCartStore((s) => s.appliedDiscountCode === WELCOME_OFFER.code);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      await subscribeEmail(email);
    } catch {
      setStatus('error');
      return;
    }
    setStatus('claimed');
    applyDiscountCode(WELCOME_OFFER.code);
    onClaimed?.();
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(WELCOME_OFFER.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the code stays visible on screen to type in.
    }
  };

  if (status === 'claimed') {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={copyCode}
          aria-label={`Copy discount code ${WELCOME_OFFER.code}`}
          className="flex w-full items-center justify-between gap-3 rounded-lg border-2 border-dashed border-grape bg-white px-4 py-3 transition-colors hover:bg-lavender"
        >
          <span className="font-wide text-lg font-extrabold tracking-[0.14em] text-grape">
            {WELCOME_OFFER.code}
          </span>
          <span className="type-eyebrow flex items-center gap-1.5 text-[10px] text-gray-600">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>
        <p role="status" className={`mt-2.5 text-xs font-semibold ${dark ? 'text-lilac' : 'text-grape'}`}>
          {isApplied
            ? `Added to your cart — your ${WELCOME_OFFER.percentOff}% off shows at checkout.`
            : `Use this code at checkout for ${WELCOME_OFFER.percentOff}% off your first order.`}
        </p>
      </div>
    );
  }

  const stacked = layout === 'stacked';
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex gap-2.5 ${stacked ? 'flex-col' : 'flex-col sm:flex-row'}`}>
        <input
          type="email"
          required
          autoComplete="email"
          aria-label="Email address"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'sending'}
          className={`min-h-12 min-w-0 flex-1 rounded-full border px-5 text-[15px] transition-colors focus:outline-none disabled:opacity-60 ${
            dark
              ? 'border-white/20 bg-white/[0.06] text-white placeholder:text-white/50 focus:border-lilac'
              : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-grape'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`btn-primary shrink-0 ${dark ? 'bg-white text-grape shadow-none hover:bg-lavender' : ''}`}
        >
          {status === 'sending' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Get {WELCOME_OFFER.percentOff}% off <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p role="alert" className={`mt-2.5 text-xs font-semibold ${dark ? 'text-red-300' : 'text-red-600'}`}>
          We couldn&apos;t save your email — please check it and try again.
        </p>
      )}
      <p className={`mt-3 text-xs leading-relaxed ${dark ? 'text-white/50' : 'text-gray-500'}`}>
        One code per customer. By signing up you agree to receive emails from us — unsubscribe any time.
      </p>
    </form>
  );
}
