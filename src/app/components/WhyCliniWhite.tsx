'use client';

import Link from 'next/link';
import Image from 'next/image';

const PERKS = [
  '100% Money-Back Guarantee',
  'Peroxide-Free PAP Formula',
  'Zero Sensitivity',
  'Free Tracked Shipping',
  'Clinically Tested',
];

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

export default function WhyCliniWhite() {
  return (
    <section>
      {/* Scrolling banner — five rotating perks instead of one repeated phrase */}
      <div className="bg-[#231b50] text-white py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap w-max">
          {[...PERKS, ...PERKS].map((perk, i) => (
            <span
              key={i}
              aria-hidden={i >= PERKS.length}
              className="mx-6 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-6"
            >
              {perk}
              <span className="opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#E5E1F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
                ADVANCED TECHNOLOGY
              </p>

              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-black mb-5 uppercase tracking-tight">
                WHY <span className="text-[#231b50]">CLINI WHITE?</span>
              </h2>

              <p className="text-sm md:text-base text-gray-700 mb-10 max-w-md leading-relaxed">
                CLINI WHITE&apos;s strips are powered by PAP, a next-generation whitening
                ingredient that targets surface stains. 30 minutes a day. That&apos;s the
                whole commitment.
              </p>

              <ol className="space-y-6 mb-10">
                {benefits.map((benefit, index) => (
                  <li key={benefit.title} className="flex items-start gap-4">
                    <span className="w-9 h-9 shrink-0 rounded-full bg-[#231b50] text-white font-display font-extrabold text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-display font-extrabold text-black text-sm uppercase tracking-wide mb-1.5">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed max-w-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href="/product/v34-colour-corrector-strips-12-strip"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-10 py-5 bg-[#231b50] text-white text-sm font-black tracking-widest uppercase rounded-full hover:bg-[#1a1440] transition-all hover:scale-[1.02] shadow-xl shadow-[#231b50]/15"
              >
                Get yours now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {/* Right Content - Image */}
            <div className="order-1 lg:order-2 relative w-full aspect-[4/3] lg:aspect-square max-h-[560px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/PIC1.png"
                alt="CLINI WHITE V34 whitening strips applied to teeth"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
