'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
  if (!current) return null;

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter the range"
        className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
      >
        {groups.map((g) => {
          const selected = g.id === current.id;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`range-tab-${g.id}`}
              aria-selected={selected}
              aria-controls="range-panel"
              onClick={() => setActive(g.id)}
              className={`type-eyebrow shrink-0 rounded-full px-4 py-2.5 transition-colors ${
                selected ? 'bg-grape text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-soft hover:text-violet'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="range-panel"
        aria-labelledby={`range-tab-${current.id}`}
        className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-4"
      >
        {current.items.slice(0, SHOWN).map((product) => (
          <ProductCard key={product.node.id} product={product.node} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop" className="btn-secondary">
          Shop all {products.length} products <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  );
}
