'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { CUSTOMER_RESULTS as ALL_RESULTS } from '@/lib/results';

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
                <Image
                  src={result.image}
                  alt={`${result.name} result`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Shades badge */}
              <div className="tag absolute right-3 top-3 bg-white text-grape shadow-sm">
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
                    className="tag px-2 py-1 text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[13px] font-semibold text-grape">{result.name}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">
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
            className="btn-secondary"
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
          className="mb-2 font-display font-wide text-xl font-extrabold uppercase text-grape"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          See results like these for yourself
        </p>
        <p className="text-sm text-gray-600 mb-6">
          30-day money-back guarantee · Free shipping on bundles · Peroxide-free formula
        </p>
        <Link
          href="/shop"
          className="btn-primary"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}
