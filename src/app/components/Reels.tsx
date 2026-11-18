'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX, X } from 'lucide-react';
import LazyVideo from './LazyVideo';

export interface Reel {
  video: string;
  product: string;
  handle: string;
}

type Cell = { kind: 'review' } | { kind: 'reel'; index: number };

// Each column starts at its own height, so the grid reads as a hand-laid
// wall rather than a row of identical tiles.
const COLUMN_OFFSET = ['pt-14 lg:pt-24', 'pt-0', 'pt-7 lg:pt-12'];

// Customer clips on a staggered wall beside the section's intro. Muted
// previews play in place; tapping one opens a full-screen viewer with sound,
// swipe/arrow navigation and a link to the product shown. The arrows scroll
// the wall where it is wider than the screen and hide where it all fits.
export default function Reels({
  reels,
  intro,
  review,
}: {
  reels: Reel[];
  /** Headline, line of copy and button for the left column. */
  intro: React.ReactNode;
  /** A written customer review that takes the first tile. */
  review: React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ scrollable: false, atStart: true, atEnd: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setScroll({
        scrollable: el.scrollWidth > el.clientWidth + 4,
        atStart: el.scrollLeft <= 4,
        atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    // Fires once on observe, then on every resize.
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const column = el?.querySelector<HTMLElement>('[data-column]');
    if (!el || !column) return;
    el.scrollBy({ left: dir * (column.offsetWidth + 16), behavior: 'smooth' });
  };

  const cells: Cell[] = [{ kind: 'review' }, ...reels.map((_, index) => ({ kind: 'reel' as const, index }))];
  const columns: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 2) columns.push(cells.slice(i, i + 2));

  const arrow = (enabled: boolean) =>
    `flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 ${
      enabled ? 'bg-violet text-white hover:bg-grape' : 'bg-gray-100 text-gray-400'
    }`;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] lg:gap-14">
      <div data-reveal="">
        {intro}
        {scroll.scrollable && (
          <div className="mt-10 flex gap-3">
            <button type="button" onClick={() => step(-1)} disabled={scroll.atStart} aria-label="Previous clips" className={arrow(!scroll.atStart)}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => step(1)} disabled={scroll.atEnd} aria-label="More clips" className={arrow(!scroll.atEnd)}>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:gap-5 lg:px-0"
      >
        {columns.map((column, c) => (
          <div
            key={c}
            data-column=""
            data-reveal=""
            style={{ '--reveal-i': c } as React.CSSProperties}
            className={`flex w-[62%] shrink-0 snap-start flex-col gap-4 sm:w-[38%] lg:w-[calc((100%-2.5rem)/3)] lg:gap-5 ${COLUMN_OFFSET[c % COLUMN_OFFSET.length]}`}
          >
            {column.map((cell) =>
              cell.kind === 'review' ? (
                <div key="review" className="aspect-[3/4]">
                  {review}
                </div>
              ) : (
                <ReelTile
                  key={reels[cell.index].video}
                  reel={reels[cell.index]}
                  onPlay={(button) => {
                    trigger.current = button;
                    setOpen(cell.index);
                  }}
                />
              )
            )}
          </div>
        ))}
      </div>

      {open !== null && (
        <ReelViewer
          reels={reels}
          index={open}
          onIndex={setOpen}
          onClose={() => {
            setOpen(null);
            trigger.current?.focus();
          }}
        />
      )}
    </div>
  );
}

// A muted preview: mute badge top-left, play button top-right, the product
// named on hover. The whole tile opens the viewer.
function ReelTile({ reel, onPlay }: { reel: Reel; onPlay: (button: HTMLButtonElement) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => onPlay(e.currentTarget)}
      aria-label={`Play video with sound: ${reel.product}`}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-grape-deep text-left"
    >
      <LazyVideo
        src={reel.video}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span aria-hidden className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white">
        <VolumeX className="h-4 w-4" />
      </span>
      <span aria-hidden className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-grape transition-transform duration-300 group-hover:scale-110">
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </span>
      <span
        aria-hidden
        className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/95 px-3 py-2 text-center text-sm font-semibold text-grape opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {reel.product}
      </span>
    </button>
  );
}

function ReelViewer({
  reels,
  index,
  onIndex,
  onClose,
}: {
  reels: Reel[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const swipeX = useRef<number | null>(null);
  const reel = reels[index];
  const go = (step: number) => onIndex((index + step + reels.length) % reels.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % reels.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + reels.length) % reels.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, reels.length, onIndex, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${reel.product}`}
      className="animate-fade-up fixed inset-0 z-[70] flex items-center justify-center bg-grape-deep/95 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        type="button"
        autoFocus
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous video"
        className="absolute left-4 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next video"
        className="absolute right-4 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:flex"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        className="relative aspect-[9/16] h-[min(86svh,calc((100vw-2rem)*16/9))] touch-pan-y overflow-hidden rounded-[1.5rem] bg-black"
        onPointerDown={(e) => (swipeX.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <video
          key={reel.video}
          src={reel.video}
          poster={reel.video.replace(/\.mp4$/, '.webp')}
          autoPlay
          loop
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />

        {/* Progress: one segment per clip */}
        <div className="absolute inset-x-3 top-3 flex gap-1.5">
          {reels.map((r, i) => (
            <span key={r.video} className={`h-0.5 flex-1 rounded-full ${i === index ? 'bg-white' : 'bg-white/35'}`} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          className="absolute left-3 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-20">
          <p className="type-eyebrow text-[10px] text-lilac">As seen in this clip</p>
          <p className="mt-1 text-base font-semibold text-white">{reel.product}</p>
          <Link
            href={`/product/${reel.handle}`}
            className="btn-primary mt-4 w-full bg-white text-grape shadow-none hover:bg-lavender"
          >
            Shop now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
