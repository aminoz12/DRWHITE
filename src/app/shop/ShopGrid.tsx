'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';
import { getProductKind, type ProductKind } from '@/lib/productKind';

interface Product {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants?: {
      edges: Array<{
        node: {
          id: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
        };
      }>;
    };
  };
}

// Shopping by goal, not by SKU — the same groups as the homepage tiles.
const CATEGORIES: { id: string; label: string; kinds: ProductKind[] | null }[] = [
  { id: 'all', label: 'All', kinds: null },
  { id: 'instant', label: 'Instant brightening', kinds: ['serum', 'foam'] },
  { id: 'everyday', label: 'Everyday care', kinds: ['toothpaste', 'powder', 'mouthwash', 'toothbrush'] },
  { id: 'strips', label: 'Whitening strips', kinds: ['strips'] },
  { id: 'sets', label: 'Sets', kinds: ['bundle'] },
];

export default function ShopGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((c) => [
          c.id,
          c.kinds ? products.filter((p) => c.kinds!.includes(getProductKind(p.node.title))).length : products.length,
        ])
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const kinds = CATEGORIES.find((c) => c.id === category)?.kinds;
    let result = kinds ? products.filter((p) => kinds.includes(getProductKind(p.node.title))) : [...products];

    if (inStockOnly) {
      result = result.filter((p) => p.node.variants?.edges.some((v) => v.node.availableForSale));
    }

    const priceOf = (p: Product) => parseFloat(p.node.priceRange.minVariantPrice.amount);
    if (sortBy === 'price-low') result.sort((a, b) => priceOf(a) - priceOf(b));
    else if (sortBy === 'price-high') result.sort((a, b) => priceOf(b) - priceOf(a));

    return result;
  }, [products, category, sortBy, inStockOnly]);

  return (
    <div className="space-y-8">
      {/* Category chips */}
      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {CATEGORIES.filter((c) => counts[c.id] > 0).map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className={`type-eyebrow shrink-0 rounded-full px-4 py-2.5 transition-colors ${
                active ? 'bg-grape text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-soft hover:text-violet'
              }`}
            >
              {c.label} <span className={active ? 'text-white/70' : 'text-gray-500'}>({counts[c.id]})</span>
            </button>
          );
        })}
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between border-b border-gray-100 py-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-tight text-gray-900">In stock only</span>
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            role="switch"
            aria-checked={inStockOnly}
            aria-label="Show in-stock products only"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${inStockOnly ? 'bg-gray-900' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition duration-200 ease-in-out ${inStockOnly ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="group flex cursor-pointer items-center gap-1.5">
          <span className="type-eyebrow text-[10px] text-gray-600">Sort by</span>
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="cursor-pointer appearance-none border-none bg-transparent py-0 pl-1 pr-6 text-[11px] font-bold uppercase tracking-tight text-grape focus:ring-0"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Low to High</option>
              <option value="price-high">High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-3 w-3 text-black transition-transform group-hover:translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center sm:py-20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <Search className="h-8 w-8 text-gray-300" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No products found</h2>
          <p className="mt-1 text-sm text-gray-600">Try adjusting your filters</p>
          <button
            onClick={() => { setCategory('all'); setSortBy('featured'); setInStockOnly(false); }}
            className="mt-6 text-sm font-bold text-grape hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.node.id} product={product.node} />
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="border-t border-gray-100 pt-10 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-600" aria-live="polite">
          Showing {filteredProducts.length} of {products.length} Products
        </p>
      </div>
    </div>
  );
}
