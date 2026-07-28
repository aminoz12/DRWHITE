'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'newsletter', email }).toString(),
      });
      if (!res.ok) throw new Error(`Newsletter signup failed: ${res.status}`);
      setStatus('sent');
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
    <form
      name="newsletter"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="relative"
    >
      <input type="hidden" name="form-name" value="newsletter" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        disabled={status === 'sending'}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        aria-label="Subscribe"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
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
        <p className="mt-2 text-[10px] text-red-500 font-bold">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}
