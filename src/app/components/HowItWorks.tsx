'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, Play } from 'lucide-react';
import LazyVideo from './LazyVideo';

// Each card links to the real catalog product featured in the clip.
const testimonials = [
  {
    id: 1,
    video: '/videos/video1.mp4',
    views: '32.9K',
    hasPlay: false,
    productName: 'V34 Colour Corrector Strips',
    handle: 'v34-colour-corrector-strips-12-strip',
  },
  {
    id: 2,
    video: '/videos/video2.mp4',
    views: '14.6K',
    hasPlay: false,
    productName: 'V34 Purple Whitening Toothpaste',
    handle: 'clini-white-v34-purple-whitening-toothpaste',
  },
  {
    id: 3,
    video: '/videos/video3.mp4',
    views: '7.2K',
    hasPlay: true,
    productName: 'V34 Colour Corrector Serum',
    handle: 'v34-colour-corrector-serum',
  },
  {
    id: 4,
    video: '/videos/video4.mp4',
    views: '11K',
    hasPlay: false,
    productName: 'V34 Colour Corrector Foam',
    handle: 'cliniwhite-v34-colour-corrector-foam',
  },
  {
    id: 5,
    video: '/videos/video5.mp4',
    views: '5.5K',
    hasPlay: false,
    productName: 'V34 Colour Corrector Powder',
    handle: 'cliniwhite-v34-colour-corrector-powder',
  }
];

export default function HowItWorks() {
  return (
    <section className="py-12 bg-[#F3F6F9]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
            SOCIAL PROOF
          </p>
          <h2 
            className="font-display text-3xl md:text-4xl font-extrabold text-center text-[#1A1A1A] leading-tight uppercase tracking-tight"
          >
            PEOPLE CAN&apos;T STOP <span className="text-[#231b50]">SHARING</span><br />
            THEIR SMILE JOURNEY
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {testimonials.map((item) => (
            <Link key={item.id} href={`/product/${item.handle}`} className="relative rounded-xl overflow-hidden aspect-[9/16] max-h-[450px] group cursor-pointer shadow-sm bg-black block">
              {/* Video Background — lazy-loaded */}
              <LazyVideo
                src={item.video}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* View Count Badge */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white flex items-center gap-1 z-10">
                <Eye className="w-3 h-3" />
                <span className="text-[10px] font-bold">{item.views}</span>
              </div>

              {/* Play Button Overlay */}
              {item.hasPlay && (
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-lg z-10">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              )}

              {/* Bottom Gradient and Product Info */}
              <div className="absolute inset-x-0 bottom-0 pt-20 pb-3 px-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 bg-white rounded flex-shrink-0 p-1">
                    <Image src="/pic.png" alt="Product" fill className="object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold leading-tight">{item.productName}</span>
                    <span className="text-white/80 text-[11px] font-bold group-hover:text-white transition-colors">
                      Shop now →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
