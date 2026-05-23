'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How many shades different should I see?',
    answer: 'Most customers see a difference of 2-8 shades after a full 14-day treatment. Individual results vary depending on the initial shade of your teeth and your lifestyle habits (like coffee or wine consumption).',
  },
  {
    question: 'How do I use them?',
    answer: 'Simply peel the strips from the backing, apply to your upper and lower teeth, and leave for 30 minutes. Once finished, peel off and rinse your mouth. For best results, use once daily for 14 days.',
  },
  {
    question: 'Is it safe for sensitive teeth?',
    answer: 'Yes! Our formula is peroxide-free and specifically designed to be gentle on tooth enamel and gums, meaning zero sensitivity.',
  },
  {
    question: 'Can I use it with crowns or veneers?',
    answer: 'Our products are safe for dental work, but please note that only natural teeth will whiten. Crowns and veneers will remain their original shade.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    <section className="py-24 bg-[#F8FAFC]" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#0047AB] text-xs font-black tracking-[0.3em] uppercase mb-4">
            FREQUENTLY ASKED
          </p>
          <h2 
            id="faq-heading"
            className="text-4xl md:text-5xl font-black text-black leading-none uppercase tracking-tighter"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            GOT QUESTIONS?<br />
            <span className="text-[#0047AB]">WE&apos;VE GOT ANSWERS</span>
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                openIndex === index 
                ? 'border-[#0047AB] shadow-xl shadow-blue-900/5' 
                : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 md:px-8 flex items-center justify-between text-left group"
              >
                <span className={`text-sm md:text-base font-black uppercase tracking-wider transition-colors ${
                  openIndex === index ? 'text-[#0047AB]' : 'text-gray-900'
                }`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? 'bg-[#0047AB] text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-[#0047AB]'
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
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
            STILL HAVE QUESTIONS?
          </p>
          <a 
            href="mailto:contact@cliniwhite.com"
            className="inline-flex items-center gap-2 text-[#0047AB] font-black text-sm uppercase tracking-wider hover:gap-3 transition-all"
          >
            Contact our support team <Plus className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
