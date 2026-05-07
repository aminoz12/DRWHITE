'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'IS IT SAFE FOR SENSITIVE TEETH?',
    answer: 'Yes! Our formula is specifically designed for sensitive teeth. We use PAP (Phthalimidoperoxycaproic acid) instead of harsh peroxides, which means no pain or sensitivity during or after whitening.',
  },
  {
    question: 'HOW DO I KEEP MY RESULTS LOOKING GOOD?',
    answer: 'Avoid staining foods and drinks (coffee, tea, red wine) for 24 hours after treatment. For maintenance, use our products 1-2 times per week.',
  },
  {
    question: 'CAN I USE IT WITH CROWNS OR VENEERS?',
    answer: 'Yes, our products are safe to use with dental work including crowns, veneers, and fillings. However, please note that only natural teeth will whiten.',
  },
  {
    question: 'HOW OFTEN SHOULD I USE IT?',
    answer: 'For best results, use daily for 14 consecutive days. For maintenance, use 1-2 times per week.',
  },
  {
    question: "WHAT'S YOUR RETURN POLICY?",
    answer: 'We offer a 30-day money-back guarantee. If you are not satisfied with your results, contact us for a full refund.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#EBF2FA]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center text-[#1A1A1A] mb-10 tracking-tight"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          FAQ
        </h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <span 
                  className="text-xs font-medium text-[#1A1A1A] uppercase tracking-wide"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {faq.question}
                </span>
                <span className="text-[#0047AB] ml-4 shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Contact Box */}
        <div className="mt-8 bg-[#0047AB] text-white p-6 text-center">
          <h3 
            className="text-sm font-bold uppercase tracking-wide mb-2"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            STILL HAVE QUESTIONS?
          </h3>
          <p className="text-sm text-white/80 mb-3">
            Our experts are here to help.
          </p>
          <a 
            href="mailto:support@drwhite.co" 
            className="text-sm underline hover:text-white/80 transition-colors"
          >
            support@drwhite.co
          </a>
        </div>
      </div>
    </section>
  );
}
