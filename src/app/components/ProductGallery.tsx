'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  url: string;
  altText: string | null;
}

// Product photos. Phones: a swipeable strip with dots. Desktop: one large
// frame that zooms under the cursor, arrows, and thumbnails. The first image
// is the packshot, its white melted into the lavender tile; the lifestyle
// photos after it keep their true colours.
export default function ProductGallery({
  images,
  title,
  badge,
}: {
  images: GalleryImage[];
  title: string;
  badge?: string;
}) {
  const shown = images.slice(0, 6);
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const altFor = (i: number) => shown[i]?.altText || (i === 0 ? title : `${title} — view ${i + 1}`);
  const go = (i: number) => setActive((i + shown.length) % shown.length);

  if (shown.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[1.75rem] bg-lavender text-xs uppercase tracking-widest text-gray-400">
        No image
      </div>
    );
  }

  const badgeEl = badge && <span className="tag absolute left-4 top-4 z-10 bg-violet text-white">{badge}</span>;

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Phones and tablets: swipe */}
      <div className="relative lg:hidden">
        {badgeEl}
        <div
          ref={strip}
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== active) setActive(i);
          }}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-[1.75rem] scrollbar-none"
        >
          {shown.map((img, i) => (
            <div key={img.url} className="relative aspect-square w-full shrink-0 snap-center bg-lavender">
              <Image
                src={img.url}
                alt={altFor(i)}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={i === 0 ? 'object-contain p-8 mix-blend-multiply' : 'object-cover'}
              />
            </div>
          ))}
        </div>
        {shown.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {shown.map((img, i) => (
              <button
                key={img.url}
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                onClick={() => strip.current?.scrollTo({ left: i * strip.current.clientWidth, behavior: 'smooth' })}
                className="flex h-6 items-center"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-grape' : 'w-1.5 bg-gray-300'}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: zoom on hover */}
      <div
        className="group relative hidden aspect-square cursor-zoom-in overflow-hidden rounded-[1.75rem] bg-lavender lg:block"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
      >
        {badgeEl}
        <Image
          key={shown[active].url}
          src={shown[active].url}
          alt={altFor(active)}
          fill
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`animate-fade-up transition-transform duration-200 ease-out ${
            active === 0 ? 'object-contain p-10 mix-blend-multiply' : 'object-cover'
          }`}
          style={{
            transform: zoom ? 'scale(1.9)' : 'scale(1)',
            transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : 'center',
          }}
        />
        {shown.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-grape opacity-0 shadow-md transition-opacity hover:bg-lavender focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-grape opacity-0 shadow-md transition-opacity hover:bg-lavender focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {shown.length > 1 && (
        <div className="hidden gap-2.5 lg:flex">
          {shown.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View product image ${i + 1}`}
              aria-pressed={active === i}
              className={`relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl border bg-lavender transition-all ${
                active === i ? 'border-grape ring-2 ring-grape ring-offset-2' : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
