'use client';

import { useState } from 'react';
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
  'w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none focus:border-[#231b50] focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all';

const labelClass =
  'block text-[11px] font-black uppercase tracking-widest text-gray-900 mb-2';

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
      <div className="text-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-[#231b50] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-200">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3
          className="font-display text-2xl md:text-3xl font-extrabold text-black mb-4 uppercase tracking-tight"
        >
          Message sent!
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          Thanks for reaching out, {fields.name.split(' ')[0] || 'friend'}. Our team will get
          back to you at <span className="font-bold text-[#231b50]">{fields.email}</span> within
          24 hours (Mon&ndash;Fri).
        </p>
        <button
          type="button"
          onClick={() => {
            setFields({ name: '', email: '', order: '', topic: TOPICS[0], message: '' });
            setStatus('idle');
          }}
          className="inline-flex items-center gap-2 text-[#231b50] font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
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
            Full name <span className="text-[#231b50]">*</span>
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
            Email address <span className="text-[#231b50]">*</span>
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
        <div>
          <label htmlFor="contact-topic" className={labelClass}>
            Topic <span className="text-[#231b50]">*</span>
          </label>
          <div className="relative">
            <select
              id="contact-topic"
              name="topic"
              required
              value={fields.topic}
              onChange={handleChange}
              className={`${inputClass} appearance-none pr-12 cursor-pointer`}
            >
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Your message <span className="text-[#231b50]">*</span>
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
          <p className="text-xs text-red-600 font-bold leading-relaxed">
            Something went wrong sending your message. Please try again, or email us directly
            at{' '}
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`[${fields.topic}] Contact from ${fields.name}`)}&body=${encodeURIComponent(fields.message)}`}
              className="underline text-[#231b50]"
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
        className="w-full inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#231b50] text-white text-sm font-black tracking-widest uppercase rounded-full hover:bg-[#1a1440] transition-all hover:scale-[1.02] shadow-2xl shadow-violet-200 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-geist-sans), system-ui' }}
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

      <p className="text-[11px] text-gray-600 text-center leading-relaxed">
        We typically reply within 24 hours, Monday to Friday. By submitting this form you agree
        to our privacy policy.
      </p>
    </form>
  );
}
