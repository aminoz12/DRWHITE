'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CONTACT } from '@/lib/siteConfig';
import { getProductKind, USAGE_ANSWER } from '@/lib/productKind';
import Marker from './Marker';
import SectionHeading from './SectionHeading';

// `productTitle` tailors the usage answer to the product being viewed. Without
// it (homepage) the answer describes the strips, the flagship product.
// Shipping and refund answers mirror the policies word for word in substance.
function buildFaqs(productTitle?: string) {
  const kind = getProductKind(productTitle ?? 'strips');
  const productName = productTitle ?? 'CLINIWHITE whitening strips';
  return [
    {
      question: 'How many shades different should I see?',
      answer: 'Most customers see a difference of 2-8 shades after a full 14-day treatment. Individual results vary depending on the initial shade of your teeth and your lifestyle habits (like coffee or wine consumption).',
    },
    {
      question: `How do I use ${productName}?`,
      answer: USAGE_ANSWER[kind],
    },
    {
      question: 'Is it safe for sensitive teeth?',
      answer: 'Our peroxide-free products are designed to be gentle. Individual response can vary, so follow the directions on the pack, discontinue use if irritation occurs, and consult a dental professional if you have concerns.',
    },
    {
      question: 'Can I use it with crowns or veneers?',
      answer: 'Our products are safe for dental work, but please note that only natural teeth will whiten. Crowns and veneers will remain their original shade.',
    },
    {
      question: 'How much is shipping, and how fast is it?',
      answer: 'Every bundle ships free with express delivery. For single items, shipping is calculated at checkout based on your destination. Orders are processed within 1–2 business days; UK delivery usually takes 1–3 business days, Europe 3–7 and the rest of the world 7–14.',
    },
    {
      question: 'What if it doesn’t work for me?',
      answer: 'Every order is covered by our 30-day money-back guarantee. If you’re not satisfied, contact us within 30 days of delivery and we’ll guide you through your refund — see our refund policy for the details.',
    },
  ];
}

// withSchema: emit the FAQPage JSON-LD only once site-wide (on the homepage) —
// duplicating the same FAQPage entity on many URLs dilutes it for Google.
export default function FAQ({
  withSchema = false,
  productTitle,
}: {
  withSchema?: boolean;
  productTitle?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = buildFaqs(productTitle);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="bg-white py-16 sm:py-24" aria-labelledby="faq-heading">
      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* Phones: heading, questions, support. Desktop: heading and support on
          the left, questions on the right. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:px-8">
        <SectionHeading
          id="faq-heading"
          align="left"
          eyebrow="Frequently asked"
          className="lg:col-start-1 lg:row-start-1"
          title={
            <>
              Got questions? <Marker>We&apos;ve got answers</Marker>
            </>
          }
        />

        <ul className="border-t border-gray-200 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <li key={faq.question} className="border-b border-gray-200">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={`text-base font-semibold leading-snug transition-colors md:text-lg ${open ? 'text-violet' : 'text-grape'}`}>
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        open ? 'rotate-45 border-grape bg-grape text-white' : 'border-gray-300 text-grape group-hover:border-grape'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  inert={!open}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-12 text-base leading-relaxed text-gray-600 md:text-base">{faq.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Support */}
        <div className="rounded-[1.75rem] bg-porcelain p-6 sm:p-8 lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="type-eyebrow text-grape">Still have questions?</p>
          <p className="mt-2 text-base leading-relaxed text-gray-600">
            Real humans reply {CONTACT.responseTime.toLowerCase()}, {CONTACT.supportHours.replace('Monday to Friday', 'Mon–Fri')}.
          </p>
          <Link href="/contact" className="btn-secondary mt-6">
            Contact our support team
          </Link>
        </div>
      </div>
    </section>
  );
}
