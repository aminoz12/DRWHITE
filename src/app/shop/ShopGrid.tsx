'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';
import { getProductKind } from '@/lib/productKind';
import { SHOP_CATEGORIES } from '@/lib/categories';
import type { ShopifyProductEdge } from '@/lib/shopify';

const ALL = { id: 'all', label: 'All' };

export default function ShopGrid({
  products,
  initialCategory = 'all',
}: {
  products: ShopifyProductEdge[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(
    SHOP_CATEGORIES.some((c) => c.id === initialCategory) ? initialCategory : 'all'
  );
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const counts = useMemo(
    () =>
      Object.fromEntries([
        ['all', products.length],
        ...SHOP_CATEGORIES.map((c) => [c.id, products.filter((p) => c.kinds.includes(getProductKind(p.node.title))).length]),
      ]),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const kinds = SHOP_CATEGORIES.find((c) => c.id === category)?.kinds;
    let result = kinds ? products.filter((p) => kinds.includes(getProductKind(p.node.title))) : [...products];
    if (inStockOnly) result = result.filter((p) => p.node.variants?.edges.some((v) => v.node.availableForSale));
    const priceOf = (p: ShopifyProductEdge) => parseFloat(p.node.priceRange.minVariantPrice.amount);
    if (sortBy === 'price-low') result.sort((a, b) => priceOf(a) - priceOf(b));
    else if (sortBy === 'price-high') result.sort((a, b) => priceOf(b) - priceOf(a));
    return result;
  }, [products, category, sortBy, inStockOnly]);

  // Keep the address bar in step so a filtered view can be shared or reloaded.
  const choose = (id: string) => {
    setCategory(id);
    const url = new URL(window.location.href);
    if (id === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', id);
    window.history.replaceState(null, '', url);
  };

  const reset = () => {
    choose('all');
    setSortBy('featured');
    setInStockOnly(false);
  };

  // A photo tile promoting the sets breaks up the grid on the full view.
  const showSetsTile = category === 'all' && sortBy === 'featured' && filteredProducts.length > 4;

  return (
    <div>
      {/* Filter bar: sticks under the header and slides up with it. */}
      <div className="sticky top-[var(--header-h,64px)] z-30 -mx-4 border-y border-gray-200 bg-white/95 px-4 backdrop-blur transition-[top] duration-300 supports-[backdrop-filter]:bg-white/85 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-4 py-3">
          <div role="group" aria-label="Filter by category" className="-my-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {[ALL, ...SHOP_CATEGORIES].filter((c) => counts[c.id] > 0).map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => choose(c.id)}
                  aria-pressed={active}
                  className={`type-eyebrow shrink-0 rounded-full px-4 py-2.5 transition-colors ${
                    active ? 'bg-grape text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-soft hover:text-violet'
                  }`}
                >
                  {c.label}
                  <span className={`ml-1.5 ${active ? 'text-white/60' : 'text-gray-400'}`}>{counts[c.id]}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center gap-5 md:flex">
            <label className="flex cursor-pointer items-center gap-2.5">
              <span className="type-eyebrow text-[10px] text-gray-600">In stock</span>
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                role="switch"
                aria-checked={inStockOnly}
                aria-label="Show in-stock products only"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${inStockOnly ? 'bg-grape' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition duration-200 ease-in-out ${inStockOnly ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-5">
        <p className="text-sm text-gray-500" aria-live="polite">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
        <div className="md:hidden">
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center sm:py-20">
          <Search className="mx-auto mb-4 h-8 w-8 text-gray-300" />
          <h2 className="text-lg font-bold text-grape">No products match</h2>
          <p className="mt-1 text-sm text-gray-600">Try another category, or clear the filters.</p>
          <button onClick={reset} className="btn-secondary mt-6">
            Clear all filters
          </button>
        </div>
      ) : (
        // Keyed on the filters so the new set of cards fades up together.
        <div key={`${category}-${sortBy}-${inStockOnly}`} className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product, i) => (
            <FragmentWithTile key={product.node.id} showTile={showSetsTile && i === 3}>
              <div className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <ProductCard product={product.node} />
              </div>
            </FragmentWithTile>
          ))}
        </div>
      )}
    </div>
  );
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-1.5">
      <span className="type-eyebrow text-[10px] text-gray-600">Sort</span>
      <span className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sort products"
          className="type-eyebrow cursor-pointer appearance-none bg-transparent py-1 pl-1 pr-5 text-[11px] text-grape focus:outline-none"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-grape" />
      </span>
    </label>
  );
}

// Renders the sets tile just before a product when asked to.
function FragmentWithTile({ showTile, children }: { showTile: boolean; children: React.ReactNode }) {
  return (
    <>
      {showTile && <SetsTile />}
      {children}
    </>
  );
}

function SetsTile() {
  return (
    <Link
      href="/bundles"
      className="animate-fade-up group relative isolate col-span-2 flex min-h-64 flex-col justify-end overflow-hidden rounded-[1.25rem] bg-grape p-5 md:col-span-1 md:min-h-0"
    >
      <Image
        src="/images/reviews/5.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-grape-deep/90 via-grape-deep/30 to-transparent" />
      <span className="type-eyebrow text-lilac">Bundle &amp; save</span>
      <span className="mt-2 block font-display font-wide text-2xl font-extrabold uppercase leading-[1.02] tracking-[-0.015em] text-white">
        The whole routine in one box
      </span>
      <span className="type-eyebrow mt-4 inline-flex items-center gap-2 text-white">
        Shop the sets <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
