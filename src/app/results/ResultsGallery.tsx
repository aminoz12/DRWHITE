'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

const ALL_RESULTS = [
  {
    id: 1,
    name: 'Ruby P.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'Incredible results in just 2 weeks. My teeth are so much brighter!',
    shade: '8 shades',
    image: '/images/reviews/teeth/1.png',
    tags: ['No Sensitivity', 'Fast Results'],
  },
  {
    id: 2,
    name: 'James L.',
    product: 'Ultimate Bundle',
    weeks: 1,
    rating: 5,
    text: 'No pain or tingling at all. First whitening product that actually worked.',
    shade: '6 shades',
    image: '/images/reviews/teeth/2.png',
    tags: ['No Sensitivity', 'Easy To Use'],
  },
  {
    id: 3,
    name: 'Grace F.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'Absolutely love the results. No sensitivity and great taste.',
    shade: '7 shades',
    image: '/images/reviews/teeth/3.png',
    tags: ['No Sensitivity'],
  },
  {
    id: 4,
    name: 'Emily C.',
    product: 'Glow Bundle',
    weeks: 3,
    rating: 5,
    text: 'I drink coffee daily and still got amazing results. Strips stay on perfectly.',
    shade: '10 shades',
    image: '/images/reviews/teeth/4.png',
    tags: ['Fast Results', 'Easy To Use'],
  },
  {
    id: 5,
    name: 'Mia T.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'TikTok made me buy it and I have zero regrets. Results exceeded my expectations.',
    shade: '9 shades',
    image: '/images/reviews/teeth/5.png',
    tags: ['Fast Results'],
  },
  {
    id: 6,
    name: 'Liam B.',
    product: 'Ultimate Bundle',
    weeks: 4,
    rating: 5,
    text: 'The full bundle is worth every penny. Teeth feel clean and look amazing.',
    shade: '12 shades',
    image: '/images/reviews/teeth/6.png',
    tags: ['Best Value', 'No Sensitivity'],
  },
  {
    id: 7,
    name: 'Sophie H.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'I was skeptical but these actually work. My smile is so much whiter now.',
    shade: '7 shades',
    image: '/images/reviews/teeth/7.png',
    tags: ['Fast Results'],
  },
  {
    id: 8,
    name: 'David W.',
    product: 'Ultimate Bundle',
    weeks: 3,
    rating: 5,
    text: 'The best whitening kit I have ever used. Simple, effective, and painless.',
    shade: '11 shades',
    image: '/images/reviews/teeth/8.png',
    tags: ['Easy To Use', 'No Sensitivity'],
  },
  {
    id: 9,
    name: 'Chloe R.',
    product: 'Glow Bundle',
    weeks: 2,
    rating: 5,
    text: 'Perfect for maintenance and getting that extra brightness for events.',
    shade: '5 shades',
    image: '/images/reviews/teeth/9.png',
    tags: ['Fast Results'],
  },
  {
    id: 10,
    name: 'Marcus G.',
    product: 'Whitening Strips',
    weeks: 1,
    rating: 5,
    text: 'Quick and easy. I saw a difference after the third application.',
    shade: '4 shades',
    image: '/images/reviews/teeth/10.png',
    tags: ['Easy To Use'],
  },
  {
    id: 11,
    name: 'Olivia S.',
    product: 'Ultimate Bundle',
    weeks: 4,
    rating: 5,
    text: 'My teeth are gleaming. I get compliments on my smile all the time now.',
    shade: '12 shades',
    image: '/images/reviews/teeth/11.png',
    tags: ['Best Value'],
  },
  {
    id: 12,
    name: 'Nathan P.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'Great product. No sensitivity and the results are long-lasting.',
    shade: '9 shades',
    image: '/images/reviews/teeth/12.png',
    tags: ['No Sensitivity'],
  },
  {
    id: 13,
    name: 'Hannah B.',
    product: 'Glow Bundle',
    weeks: 3,
    rating: 5,
    text: 'The toothpaste is a game changer. It keeps my teeth white between strips.',
    shade: '7 shades',
    image: '/images/reviews/teeth/13.png',
    tags: ['Easy To Use'],
  },
];

export default function ResultsGallery() {
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? ALL_RESULTS : ALL_RESULTS.slice(0, 4);

  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayed.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Single Result Image (Already contains before/after) */}
            <div className="relative">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={result.image}
                  alt={`${result.name} result`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Shades badge */}
              <div className="absolute top-3 right-3 bg-[#231b50] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                +{result.shade}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(result.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-[#231b50] fill-current" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-xs text-gray-700 leading-relaxed mb-3 flex-1">
                &ldquo;{result.text}&rdquo;
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#F5F3FF] text-[#231b50] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs font-black text-gray-900">{result.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {result.product} · {result.weeks}w results
                  </p>
                </div>
                <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">
                  ✓ Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more */}
      {ALL_RESULTS.length > 4 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#231b50] text-[#231b50] text-xs font-black tracking-wider rounded-full hover:bg-[#F5F3FF] transition-colors"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {showAll ? (
              <>SHOW LESS <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>LOAD MORE RESULTS <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}

      {/* CTA strip */}
      <div className="mt-14 bg-[#F5F3FF] rounded-2xl p-8 text-center">
        <p
          className="text-lg font-black text-black mb-2 uppercase tracking-wide"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          See results like these for yourself
        </p>
        <p className="text-sm text-gray-500 mb-6">
          30-day money-back guarantee · Free shipping · No sensitivity formula
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#231b50] text-white text-xs font-black tracking-wider rounded-full hover:bg-[#1a1440] transition-colors shadow-lg shadow-violet-200"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}
