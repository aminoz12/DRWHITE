'use client';

import Link from 'next/link';

const benefits = [
  {
    title: 'ULTRA-CONFORMING FIT',
    description: 'Flexible design molds to your teeth for even, no-slip coverage.',
  },
  {
    title: 'PAP-POWERED WHITENING',
    description: 'The strips that took over TikTok. There\'s a reason thousands made the switch.',
  },
  {
    title: '30-MINUTE ROUTINE',
    description: 'Put them on while you get ready, scroll, or do nothing at all. Your easiest beauty upgrade.',
  },
];

export default function WhyDrDent() {
  return (
    <section>
      {/* Scrolling Banner */}
      <div className="bg-[#0047AB] text-white py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 text-sm font-bold tracking-wider">
              100% MONEY-BACK GUARANTEE
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#C5D5F0] pt-0 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:pr-8">
              <p className="text-[#0047AB] text-xs font-bold tracking-widest uppercase mb-3">
                ADVANCED TECHNOLOGY
              </p>

              <h2 className="text-4xl font-black text-black mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                WHY DR.WHITE?
              </h2>

              <p className="text-sm text-gray-800 mb-8 max-w-md leading-relaxed">
                DR.WHITE&apos;s strips are powered by PAP, a next-generation whitening ingredient that targets surface stains. 30 minutes a day. That&apos;s the whole commitment.
              </p>

              <div className="space-y-5 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-black font-black text-lg">{index + 1}</span>
                    <div>
                      <h3 className="font-black text-black text-sm uppercase tracking-wide mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-800 text-xs leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/product/purple-whitening-strips"
                className="inline-block w-full max-w-md bg-[#0047AB] text-white text-xs font-bold tracking-wider py-3 text-center hover:bg-[#003a8c] transition-colors"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                GET YOURS NOW
              </Link>
            </div>

            {/* Right Content - Image */}
            <div className="relative h-full">
              <img
                src="/PIC1.png"
                alt="Product Benefits"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
