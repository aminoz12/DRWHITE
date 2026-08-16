'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CONTACT } from '@/lib/siteConfig';
import { getProductKind, USAGE_ANSWER } from '@/lib/productKind';

// `productTitle` tailors the usage answer to the product being viewed. Without
// it (homepage) the answer describes the strips, the flagship product.
function buildFaqs(productTitle?: string) {
  const kind = getProductKind(productTitle ?? 'strips');
  const productName = productTitle ?? 'CLINI WHITE whitening strips';
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
    <section className="py-10 sm:py-16 bg-[#F8FAFC]" aria-labelledby="faq-heading">
      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
            FREQUENTLY ASKED
          </p>
          <h2 
            id="faq-heading"
            className="font-display text-3xl md:text-4xl font-extrabold text-black leading-tight uppercase tracking-tight"
          >
            GOT QUESTIONS?<br />
            <span className="text-[#231b50]">WE&apos;VE GOT ANSWERS</span>
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                openIndex === index 
                ? 'border-[#231b50] shadow-xl shadow-[#231b50]/5'
                : 'border-gray-100 hover:border-violet-200'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 md:px-8 flex items-center justify-between text-left group"
              >
                <span className={`text-sm md:text-base font-black uppercase tracking-wider transition-colors ${
                  openIndex === index ? 'text-[#231b50]' : 'text-gray-900'
                }`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? 'bg-[#231b50] text-white rotate-180' : 'bg-gray-50 text-gray-600 group-hover:bg-[#F5F3FF] group-hover:text-[#231b50]'
                }`}>
                  <Plus className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-8 md:px-8 md:pb-10">
                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Link */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-4">
            STILL HAVE QUESTIONS?
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-2 text-[#231b50] font-black text-sm uppercase tracking-wider hover:gap-3 transition-all"
          >
            Contact our support team <Plus className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
