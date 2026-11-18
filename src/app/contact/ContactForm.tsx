'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { CONTACT } from '@/lib/siteConfig';

const TOPICS = [
  'Order & Shipping',
  'Product Question',
  'Returns & Refunds',
  'Wholesale & Partnerships',
  'Other',
];

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-grape placeholder:text-gray-400 transition-colors hover:border-gray-300 focus:border-grape focus:outline-none focus:ring-2 focus:ring-violet/20';

const labelClass =
  'type-eyebrow mb-2 block text-grape';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [fields, setFields] = useState({
    name: '',
    email: '',
    order: '',
    topic: TOPICS[0],
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honeypot: bots that fill the hidden field get a fake success.
    const honeypot = (e.currentTarget.elements.namedItem('bot-field') as HTMLInputElement | null)?.value;
    if (honeypot) {
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      // FormSubmit relays the submission to CONTACT.email — keyless, static-host
      // friendly. First-ever submission triggers a one-time activation email.
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[${fields.topic}] Contact from ${fields.name}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: fields.email,
          ...fields,
        }),
      });
      if (!res.ok) throw new Error(`Form submission failed: ${res.status}`);
      const json = await res.json();
      if (json.success !== 'true' && json.success !== true) {
        throw new Error(json.message || 'FormSubmit rejected the submission');
      }
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="animate-fade-up py-6 sm:py-10">
        <CheckCircle2 className="mb-6 h-10 w-10 text-violet" strokeWidth={1.75} />
        <h3 className="mb-4 font-display font-wide text-2xl font-extrabold uppercase tracking-tight text-grape md:text-3xl">
          Message sent
        </h3>
        <p className="mb-8 max-w-sm text-base leading-relaxed text-gray-600">
          Thanks for reaching out, {fields.name.split(' ')[0] || 'friend'}. Our team will get
          back to you at <span className="font-semibold text-grape">{fields.email}</span> within
          24 hours (Mon&ndash;Fri).
        </p>
        <button
          type="button"
          onClick={() => {
            setFields({ name: '', email: '', order: '', topic: TOPICS[0], message: '' });
            setStatus('idle');
          }}
          className="type-eyebrow inline-flex items-center gap-2 text-grape transition-all hover:gap-3"
        >
          Send another message
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot spam trap — hidden from humans, tempting for bots */}
      <p className="hidden" aria-hidden="true">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Full name <span className="text-violet">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            value={fields.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email address <span className="text-violet">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-order" className={labelClass}>
            Order number <span className="text-gray-600 normal-case font-bold">(optional)</span>
          </label>
          <input
            id="contact-order"
            type="text"
            name="order"
            value={fields.order}
            onChange={handleChange}
            placeholder="#CW-12345"
            className={inputClass}
          />
        </div>
      </div>

      {/* Topic: one tap instead of a dropdown */}
      <fieldset>
        <legend className={labelClass}>
          What&apos;s it about? <span className="text-violet">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <label
              key={topic}
              className="cursor-pointer rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-grape has-[:checked]:border-grape has-[:checked]:bg-grape has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet has-[:focus-visible]:ring-offset-2"
            >
              <input
                type="radio"
                name="topic"
                value={topic}
                checked={fields.topic === topic}
                onChange={handleChange}
                className="sr-only"
              />
              {topic}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Your message <span className="text-violet">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={fields.message}
          onChange={handleChange}
          placeholder="Tell us how we can help..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <div role="alert" className="bg-red-50 border border-red-100 rounded-xl px-5 py-4">
          <p className="text-sm text-red-600 font-bold leading-relaxed">
            Something went wrong sending your message. Please try again, or email us directly
            at{' '}
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`[${fields.topic}] Contact from ${fields.name}`)}&body=${encodeURIComponent(fields.message)}`}
              className="text-grape underline"
            >
              {CONTACT.email}
            </a>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary min-h-14 w-full"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-sm leading-relaxed text-gray-500">
        We typically reply within 24 hours, Monday to Friday. By submitting this form you agree
        to our{' '}
        <Link href="/policies/privacy-policy" className="underline hover:text-grape">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
