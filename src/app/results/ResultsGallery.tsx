'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Star } from 'lucide-react';
import { CUSTOMER_RESULTS, type CustomerResult } from '@/lib/results';
import BeforeAfter from '@/app/components/BeforeAfter';

const FILTERS = [
  { id: 'all', label: 'All results', test: () => true },
  { id: 'strips', label: 'Whitening strips', test: (r: CustomerResult) => /strips/i.test(r.product) },
  { id: 'sets', label: 'Sets', test: (r: CustomerResult) => /bundle/i.test(r.product) },
];

const FIRST_PAGE = 6;

export default function ResultsGallery() {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const matching = useMemo(
    () => CUSTOMER_RESULTS.filter(FILTERS.find((f) => f.id === filter)!.test),
    [filter]
  );
  const displayed = showAll ? matching : matching.slice(0, FIRST_PAGE);

  return (
    <div>
      <div role="group" aria-label="Filter results" className="-mx-4 mb-10 flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const count = CUSTOMER_RESULTS.filter(f.test).length;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setFilter(f.id);
                setShowAll(false);
              }}
              className={`type-eyebrow shrink-0 rounded-full px-4 py-2.5 transition-colors ${
                active ? 'bg-grape text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-soft hover:text-violet'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${active ? 'text-white/60' : 'text-gray-400'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div key={filter} className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((result, i) => (
          <article key={result.id} className="animate-fade-up flex flex-col" style={{ animationDelay: `${(i % FIRST_PAGE) * 50}ms` }}>
            {result.aligned ? (
              <BeforeAfter
                before={result.before}
                after={result.after}
                alt={`${result.name}, ${result.product}`}
                hint={i === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="aspect-[4/3] rounded-[1.25rem]"
              />
            ) : (
              <SideBySide result={result} />
            )}

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="flex gap-0.5" aria-label={`${result.rating} out of 5 stars`}>
                {[...Array(result.rating)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-violet text-violet" aria-hidden />
                ))}
              </span>
              <span className="tag">+{result.shade}</span>
            </div>
            <blockquote className="mt-3 flex-1 text-pretty text-[17px] font-medium leading-snug text-grape">
              &ldquo;{result.text}&rdquo;
            </blockquote>
            <p className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-500">
              <span className="font-semibold text-grape">{result.name}</span> · {result.product} · {result.weeks}{' '}
              {result.weeks === 1 ? 'week' : 'weeks'}
            </p>
            <p className="type-eyebrow mt-2 text-[10px] text-gray-400">{result.tags.join(' · ')}</p>
          </article>
        ))}
      </div>

      {matching.length > FIRST_PAGE && (
        <div className="mt-12 text-center">
          <button type="button" onClick={() => setShowAll(!showAll)} aria-expanded={showAll} className="btn-secondary">
            {showAll ? 'Show fewer' : `Show all ${matching.length} results`}
            <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-gray-500">
        Photos and reviews shared by customers with their permission. Individual results may vary.
      </p>
    </div>
  );
}

// Two photos taken from different angles: shown side by side, not on a slider.
function SideBySide({ result }: { result: CustomerResult }) {
  return (
    <div className="grid aspect-[4/3] grid-cols-2 gap-1 overflow-hidden rounded-[1.25rem]">
      {[
        { src: result.before, label: 'Before' },
        { src: result.after, label: 'After' },
      ].map(({ src, label }) => (
        <div key={label} className="relative">
          <Image src={src} alt={`${label}: ${result.name}, ${result.product}`} fill sizes="(max-width: 640px) 50vw, 17vw" className="object-cover" />
          <span className={`tag absolute bottom-3 left-3 ${label === 'Before' ? 'bg-grape/85 text-white' : 'bg-white text-grape'}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}
