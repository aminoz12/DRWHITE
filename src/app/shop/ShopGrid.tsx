'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';

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

export default function ShopGrid({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.node.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (inStockOnly) {
      result = result.filter(p => 
        p.node.variants?.edges.some(v => v.node.availableForSale)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => 
        parseFloat(a.node.priceRange.minVariantPrice.amount) - 
        parseFloat(b.node.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => 
        parseFloat(b.node.priceRange.minVariantPrice.amount) - 
        parseFloat(a.node.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === 'newest') {
      // In a real Shopify setup, we'd use the publishedAt date
      // For now, we'll just reverse if we assume newest are last or keep as is
      result = [...result].reverse();
    }

    return result;
  }, [products, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="space-y-8">
      {/* Controls Bar - Simplified to match reference */}
      <div className="flex items-center justify-between py-6 border-b border-gray-100 mb-8">
        {/* In Stock Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">In stock only</span>
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            role="switch"
            aria-checked={inStockOnly}
            aria-label="Show in-stock products only"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${inStockOnly ? 'bg-gray-900' : 'bg-gray-200'}`}
          >
            <span
              className={`${inStockOnly ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
            />
          </button>
        </div>

        {/* Sort Dropdown - Refined */}
        <div className="flex items-center gap-1.5 group cursor-pointer">
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sort by</span>
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="appearance-none bg-transparent border-none py-0 pl-1 pr-6 text-[11px] font-black text-black uppercase tracking-tight cursor-pointer focus:ring-0"
            >
              <option value="featured">Price</option>
              <option value="price-low">Low to High</option>
              <option value="price-high">High to Low</option>
            </select>
            <ChevronDown className="absolute right-0 w-3 h-3 text-black pointer-events-none group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No products found</h3>
          <p className="text-sm text-gray-600 mt-1">Try adjusting your filters</p>
          <button
            onClick={() => { setSearchQuery(''); setSortBy('featured'); }}
            className="mt-6 text-sm font-bold text-[#231b50] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.node.id} product={product.node} />
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-center pt-10 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-600 tracking-widest uppercase">
          Showing {filteredProducts.length} of {products.length} Products
        </p>
      </div>
    </div>
  );
}
