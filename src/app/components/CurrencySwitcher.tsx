'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import { MARKETS, getClientCountry, setClientCountry, marketForCountry } from '@/lib/market';
import { useCartStore } from '@/lib/cartStore';

// Round flag badges, inline so the header never waits on an image request.
function Flag({ country, className = 'w-5 h-5' }: { country: string; className?: string }) {
  const common = `${className} rounded-full shrink-0 ring-1 ring-black/10`;
  const clipId = useId();
  if (country === 'US') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <clipPath id={clipId}><circle cx="12" cy="12" r="12" /></clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="24" height="24" fill="#fff" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={i * (24 / 13)} width="24" height={24 / 13} fill="#B22234" />
          ))}
          <rect width="11" height="12.9" fill="#3C3B6E" />
        </g>
      </svg>
    );
  }
  if (country === 'GB') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <clipPath id={clipId}><circle cx="12" cy="12" r="12" /></clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="24" height="24" fill="#012169" />
          <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="4.5" />
          <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.8" />
          <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="7" />
          <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="4" />
        </g>
      </svg>
    );
  }
  // EU
  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={12 + Math.sin(a) * 7} cy={12 - Math.cos(a) * 7} r="1.1" fill="#FFCC00" />;
      })}
    </svg>
  );
}

const subscribeNoop = () => () => {};

// Country/currency selector — a flag pill that opens a small menu. Defaults
// to the geo-detected cookie set by the middleware; changing it rewrites the
// cookie, reprices any existing cart via Shopify buyer identity, and
// re-renders server components in the new market.
export default function CurrencySwitcher() {
  const router = useRouter();
  const setCartCountry = useCartStore((s) => s.setCountry);
  // Cookie-backed country. Server snapshot is the default market so SSR HTML
  // matches; the client reads the real cookie on hydration. Once the user
  // picks something we hold it in state so the pill updates immediately.
  const cookieCountry = useSyncExternalStore(
    subscribeNoop,
    () => marketForCountry(getClientCountry()).country,
    () => MARKETS[0].country
  );
  const [chosen, setChosen] = useState<string | null>(null);
  const country = chosen ?? cookieCountry;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = async (next: string) => {
    setOpen(false);
    if (next === country) return;
    setChosen(next);
    setClientCountry(next);
    await setCartCountry(next);
    router.refresh();
  };

  const current = marketForCountry(country);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${current.currency}. Change currency`}
        className="flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 pl-1 sm:pl-1.5 pr-1.5 sm:pr-2 rounded-full border border-gray-200 bg-white hover:border-gray-400 transition-colors"
      >
        <Flag country={current.country} className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-[11px] sm:text-xs font-black text-black tracking-wide whitespace-nowrap">
          {current.currency} {current.symbol}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-black transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Choose currency"
          className="absolute right-0 mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-[60]"
        >
          {MARKETS.map((m) => {
            const active = m.country === current.country;
            return (
              <li key={m.country} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => select(m.country)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${active ? 'bg-gray-50' : ''}`}
                >
                  <Flag country={m.country} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-black text-black">
                      {m.currency} {m.symbol}
                    </span>
                    <span className="block text-[11px] text-gray-500 truncate">{m.label.replace(/\s*\(.*\)$/, '')}</span>
                  </span>
                  {active && <Check className="w-4 h-4 text-black shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
