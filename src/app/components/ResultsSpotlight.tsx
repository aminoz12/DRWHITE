'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { CUSTOMER_RESULTS, resultProductHref } from '@/lib/results';
import BeforeAfter from './BeforeAfter';

// Strips results first (the flagship), then the sets; only photos whose two
// halves share a framing, so the slider compares like with like.
const SPOTLIGHT = [...CUSTOMER_RESULTS]
  .filter((r) => r.aligned)
  .sort((a, b) => Number(/strips/i.test(b.product)) - Number(/strips/i.test(a.product)))
  .slice(0, 4);

export default function ResultsSpotlight({ heading }: { heading: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const result = SPOTLIGHT[index];
  if (!result) return null;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <div className="min-w-0">
        <BeforeAfter
          key={result.id}
          before={result.before}
          after={result.after}
          alt={`${result.name}, ${result.product}`}
          className="aspect-[3/2] rounded-[2rem]"
        />
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="type-eyebrow text-gray-500">
            Drag to compare · {result.weeks} {result.weeks === 1 ? 'week' : 'weeks'}
          </p>
          <ul className="flex gap-2" aria-label="Choose a customer result">
            {SPOTLIGHT.map((r, i) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  aria-label={`${r.name}, ${r.product}`}
                  className={`relative block h-11 w-14 overflow-hidden rounded-xl ring-offset-2 transition-all ${
                    i === index ? 'ring-2 ring-grape' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={r.after} alt="" fill sizes="56px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        {heading}
        {/* Keyed on the result so the quote fades in when it changes. */}
        <div key={result.id} className="animate-fade-up">
          <span className="flex gap-1" aria-label={`${result.rating} out of 5 stars`}>
            {[...Array(result.rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-violet text-violet" aria-hidden />
            ))}
          </span>
          <blockquote className="mt-5 text-pretty text-2xl font-medium leading-snug tracking-[-0.01em] text-grape md:text-[2rem] md:leading-[1.25]">
            &ldquo;{result.text}&rdquo;
          </blockquote>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-base font-semibold text-grape">
            {result.name}
            <span className="font-normal text-gray-500">· {result.product}</span>
            <span className="tag bg-white text-grape">+{result.shade}</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">Shared with permission. Individual results may vary.</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={resultProductHref(result.product)} className="btn-primary w-full sm:w-auto">
              Shop {/strips/i.test(result.product) ? 'the strips' : 'this set'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/results"
              className="type-eyebrow text-center text-grape underline underline-offset-4 hover:text-violet sm:ml-3"
            >
              See all results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
