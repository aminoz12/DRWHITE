'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProductKind, type ProductKind } from '@/lib/productKind';
import type { ShopifyProductEdge } from '@/lib/shopify';

// Same groups as the shop page filters, so "Strips" means the same thing everywhere.
const TABS: { id: string; label: string; kinds: ProductKind[] | null }[] = [
  { id: 'best', label: 'Best sellers', kinds: null },
  { id: 'instant', label: 'Instant brightening', kinds: ['serum', 'foam'] },
  { id: 'everyday', label: 'Everyday care', kinds: ['toothpaste', 'powder', 'mouthwash', 'toothbrush'] },
  { id: 'strips', label: 'Strips', kinds: ['strips'] },
  { id: 'sets', label: 'Sets', kinds: ['bundle'] },
];

const SHOWN = 4;

export default function RangeTabs({ products }: { products: ShopifyProductEdge[] }) {
  const groups = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        items: tab.kinds ? products.filter((p) => tab.kinds!.includes(getProductKind(p.node.title))) : products,
      })).filter((tab) => tab.items.length > 0),
    [products]
  );
  const [active, setActive] = useState(groups[0]?.id ?? 'best');
  const current = groups.find((g) => g.id === active) ?? groups[0];

  // A navy pill slides between tabs instead of each tab repainting.
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const el = current && tabRefs.current.get(current.id);
    if (!el) return;
    // Fires once on observe, then whenever the tab's size changes.
    const ro = new ResizeObserver(() => setPill({ left: el.offsetLeft, width: el.offsetWidth }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [current]);

  if (!current) return null;

  const select = (id: string) => {
    setActive(id);
    tabRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <>
      {/* A segmented track: scrolls sideways on phones, hugs its tabs on wider
          screens. Each tab shows a real product from its group. */}
      <div className="-mx-4 mb-10 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label="Filter the range"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const i = groups.findIndex((g) => g.id === current.id);
            const next = groups[(i + (e.key === 'ArrowRight' ? 1 : groups.length - 1)) % groups.length];
            select(next.id);
            tabRefs.current.get(next.id)?.focus();
          }}
          className="relative inline-flex gap-1 rounded-full bg-gray-100 p-1.5"
        >
          {pill && (
            <span
              aria-hidden
              className="absolute bottom-1.5 top-1.5 rounded-full bg-grape shadow-[0_8px_18px_-10px_rgba(18,13,46,0.7)] transition-[left,width] duration-300 ease-[cubic-bezier(0.3,1.2,0.5,1)]"
              style={{ left: pill.left, width: pill.width }}
            />
          )}
          {groups.map((g) => {
            const selected = g.id === current.id;
            const thumb = g.items[0]?.node.images.edges[0]?.node.url;
            return (
              <button
                key={g.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(g.id, el);
                  else tabRefs.current.delete(g.id);
                }}
                type="button"
                role="tab"
                id={`range-tab-${g.id}`}
                aria-selected={selected}
                aria-controls="range-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(g.id)}
                className={`group/tab relative flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3.5 text-sm font-semibold transition-colors duration-300 sm:pr-4 sm:text-sm ${
                  selected ? 'text-white' : 'text-gray-700 hover:text-violet'
                } ${selected && !pill ? 'bg-grape' : ''}`}
              >
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
                  {thumb && (
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-contain p-0.5 transition-transform duration-300 group-hover/tab:scale-110"
                    />
                  )}
                </span>
                <span className="whitespace-nowrap">{g.label}</span>
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none transition-colors duration-300 ${
                    selected ? 'bg-white/15 text-white' : 'bg-white text-gray-500'
                  }`}
                >
                  {g.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyed on the tab so the new cards fade up together. */}
      <div
        key={current.id}
        role="tabpanel"
        id="range-panel"
        aria-labelledby={`range-tab-${current.id}`}
        className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-4"
      >
        {current.items.slice(0, SHOWN).map((product, i) => (
          <div key={product.node.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <ProductCard product={product.node} />
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-start gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base text-gray-600">
          Every formula is <strong className="font-semibold text-grape">peroxide-free</strong> and covered by our 30-day guarantee.
        </p>
        <Link href="/shop" className="btn-secondary">
          Shop all {products.length} products <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  );
}
