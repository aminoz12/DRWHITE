'use client';

import { useState } from 'react';
import { shopifyClientFetch } from '@/lib/shopify';

// Newsletter signups are stored as Shopify customers with marketing consent,
// so they show up in Shopify admin → Customers ("Email subscribers" segment)
// and flow into any email tool connected to the store. No third-party form
// service involved — works on any static host.
const CUSTOMER_CREATE = `
  mutation newsletterSignup($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id }
      customerUserErrors { code message }
    }
  }
`;

function randomPassword() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const result = await shopifyClientFetch({
        query: CUSTOMER_CREATE,
        variables: {
          input: { email, password: randomPassword(), acceptsMarketing: true },
        },
      });
      const payload = result?.data?.customerCreate;
      const errors: { code?: string; message?: string }[] = payload?.customerUserErrors ?? [];
      // An already-registered email still counts as subscribed.
      if (payload?.customer || errors.some((err) => err.code === 'TAKEN')) {
        setStatus('sent');
      } else {
        throw new Error(errors[0]?.message || 'customerCreate returned no customer');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-2 bg-[#F5F3FF] border border-violet-100 rounded-lg px-4 py-3">
        <svg className="w-4 h-4 shrink-0 text-[#231b50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <p className="text-xs font-bold text-[#231b50]">
          You&apos;re on the list! Watch your inbox for exclusive offers.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        aria-label="Email address for newsletter"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        disabled={status === 'sending'}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-12 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        aria-label="Subscribe"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-3 text-gray-500 hover:text-black transition-colors"
      >
        {status === 'sending' ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        )}
      </button>
      {status === 'error' && (
        <p role="alert" className="mt-2 text-[11px] text-red-600 font-bold">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}
