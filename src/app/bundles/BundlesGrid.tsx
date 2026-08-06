'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, Tag, Star } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { formatMoney } from '@/lib/money';

function calculateDiscount(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

interface BundleProduct {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange?: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants?: {
      edges: Array<{
        node: { id: string; price: { amount: string; currencyCode: string }; availableForSale: boolean };
      }>;
    };
  };
}

const FALLBACK_BUNDLES = [
  {
    title: 'STARTER KIT',
    subtitle: 'Perfect for first-timers',
    includes: ['Whitening Strips (2 week supply)', 'Whitening Toothpaste', 'Bamboo Toothbrush'],
    price: '29.99',
    comparePrice: '49.99',
    currencyCode: 'GBP',
    discount: 40,
    badge: 'BEST VALUE',
    badgeColor: '#231b50',
    stars: 4.9,
    reviews: 1284,
    handle: '/shop',
  },
  {
    title: 'GLOW BUNDLE',
    subtitle: 'For the dedicated whitener',
    includes: ['Whitening Strips (4 week supply)', 'Whitening Toothpaste', 'Whitening Mouthwash'],
    price: '44.99',
    comparePrice: '69.99',
    currencyCode: 'GBP',
    discount: 36,
    badge: 'MOST POPULAR',
    badgeColor: '#231b50',
    stars: 4.8,
    reviews: 892,
    handle: '/shop',
  },
  {
    title: 'ULTIMATE SMILE',
    subtitle: 'The full CLINI WHITE experience',
    includes: ['Whitening Strips (8 week supply)', 'Whitening Toothpaste', 'Whitening Mouthwash', 'LED Accelerator Light'],
    price: '79.99',
    comparePrice: '129.99',
    currencyCode: 'GBP',
    discount: 38,
    badge: 'PRO PICK',
    badgeColor: '#059669',
    stars: 4.9,
    reviews: 2156,
    handle: '/shop',
  },
];

export default function BundlesGrid({ products }: { products: BundleProduct[] }) {
  const { addItem, isLoading } = useCartStore();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = async (variantId: string) => {
    await addItem(variantId, 1);
    setAddedIds((prev) => new Set(prev).add(variantId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }, 2000);
  };

  if (products.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(({ node }) => {
          const price = parseFloat(node.priceRange.minVariantPrice.amount);
          const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
            ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
            : null;
          const discount = comparePrice ? calculateDiscount(price, comparePrice) : 0;
          const image = node.images.edges[0]?.node;
          const variant = node.variants?.edges[0]?.node;
          const currency = node.priceRange.minVariantPrice.currencyCode;

          return (
            <div
              key={node.id}
              className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-[#231b50] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  SAVE {discount}%
                </div>
              )}

              {/* White image area with a light frame ("cadre") */}
              <div className="relative aspect-square bg-white p-4">
                <div className="relative w-full h-full rounded-xl border border-gray-100 bg-white overflow-hidden">
                  {image ? (
                    <img
                      src={image.url}
                      alt={image.altText || node.title}
                      className="w-full h-full object-contain p-5"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="text-lg font-black text-black uppercase tracking-wide mb-1"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {node.title}
                </h3>
                {node.description && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{node.description}</p>
                )}

                <div className="flex items-baseline gap-3 mb-5 mt-auto">
                  <span className="text-2xl font-black text-[#231b50]">
                    {formatMoney(node.priceRange.minVariantPrice.amount, currency)}
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatMoney(
                        comparePrice.toString(),
                        node.compareAtPriceRange?.minVariantPrice?.currencyCode || currency
                      )}
                    </span>
                  )}
                </div>

                {variant?.id ? (
                  <button
                    onClick={() => handleAdd(variant.id)}
                    disabled={isLoading || !variant.availableForSale}
                    className={`w-full py-3 rounded-full text-xs font-black tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 ${
                      addedIds.has(variant.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-[#231b50] text-white hover:bg-[#1a1440]'
                    }`}
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : addedIds.has(variant.id) ? (
                      'ADDED TO CART'
                    ) : variant.availableForSale ? (
                      <>
                        <ShoppingBag className="w-4 h-4" /> ADD TO CART
                      </>
                    ) : (
                      'SOLD OUT'
                    )}
                  </button>
                ) : (
                  <Link
                    href={`/product/${node.handle}`}
                    className="w-full py-3 rounded-full text-xs font-black tracking-wider text-center bg-[#231b50] text-white hover:bg-[#1a1440] transition-colors block"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    VIEW BUNDLE
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {FALLBACK_BUNDLES.map((bundle) => (
        <div
          key={bundle.title}
          className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <div
            className="absolute top-4 right-4 z-10 text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest"
            style={{ backgroundColor: bundle.badgeColor }}
          >
            {bundle.badge}
          </div>

          <div className="bg-[#F5F3FF] p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-9 h-9 text-[#231b50]" />
            </div>
            <h3
              className="text-xl font-black text-black uppercase tracking-wide mb-1"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {bundle.title}
            </h3>
            <p className="text-xs text-gray-500">{bundle.subtitle}</p>
          </div>

          <div className="p-6 flex flex-col flex-1">
            <ul className="space-y-2 mb-6">
              {bundle.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-[#F5F3FF] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#231b50] font-black text-[10px]">&#10003;</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-[#231b50] fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {bundle.stars} ({bundle.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-5 mt-auto">
              <span className="text-3xl font-black text-[#231b50]">
                {formatMoney(bundle.price, bundle.currencyCode)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatMoney(bundle.comparePrice, bundle.currencyCode)}
              </span>
              <span className="text-xs font-black text-green-600">SAVE {bundle.discount}%</span>
            </div>

            <Link
              href={bundle.handle}
              className="w-full py-3 rounded-full text-xs font-black tracking-wider text-center bg-[#231b50] text-white hover:bg-[#1a1440] transition-colors flex items-center justify-center gap-2 active:scale-95"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <ShoppingBag className="w-4 h-4" /> SHOP NOW
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
