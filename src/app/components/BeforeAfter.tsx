'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';

// Drag-to-compare before/after. Both photos are halves of one customer
// submission cropped to the same framing (public/images/teeth/ba), so the line
// sweeps across a single smile. Drag anywhere on the frame (touch still
// scrolls the page vertically); keyboard and screen-reader users get a real
// range input. The first time it scrolls into view the handle sways once to
// show that it moves.
export default function BeforeAfter({
  before,
  after,
  alt,
  sizes = '(max-width: 1024px) 100vw, 50vw',
  priority = false,
  hint = true,
  className = '',
}: {
  before: string;
  after: string;
  /** Who and what, e.g. "Ruby P., Whitening Strips". */
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Sway the handle once on first sight. Turn off for all but one in a grid. */
  hint?: boolean;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);

  const moveTo = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  useEffect(() => {
    const el = frame.current;
    if (!el || !hint || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / 1400);
          setPos(50 + Math.sin(t * Math.PI * 2) * 14 * (1 - t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [hint]);

  const grab = () => {
    touched.current = true;
  };

  return (
    <div
      ref={frame}
      className={`group relative isolate cursor-ew-resize touch-pan-y select-none overflow-hidden bg-gray-100 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet has-[:focus-visible]:ring-offset-2 ${className}`}
      onPointerDown={(e) => {
        grab();
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after} alt={`After: ${alt}`} fill sizes={sizes} priority={priority} draggable={false} className="pointer-events-none object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`Before: ${alt}`} fill sizes={sizes} priority={priority} draggable={false} className="pointer-events-none object-cover" />
      </div>

      <span
        aria-hidden
        className="tag pointer-events-none absolute bottom-3 left-3 bg-grape/85 text-white transition-opacity"
        style={{ opacity: pos < 18 ? 0 : 1 }}
      >
        Before
      </span>
      <span
        aria-hidden
        className="tag pointer-events-none absolute bottom-3 right-3 bg-white text-grape transition-opacity"
        style={{ opacity: pos > 82 ? 0 : 1 }}
      >
        After
      </span>

      {/* The dividing line and its knob */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-grape shadow-[0_6px_18px_-6px_rgba(18,13,46,0.55)] transition-transform duration-150 group-active:scale-90">
          <ChevronsLeftRight className="h-4 w-4" strokeWidth={2.25} />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => {
          grab();
          setPos(Number(e.target.value));
        }}
        aria-label={`Before and after: ${alt}`}
        aria-valuetext={`${Math.round(pos)}% before`}
        className="sr-only"
      />
    </div>
  );
}
