'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cartStore';
import { formatMoney, getDiscountPercent } from '@/lib/money';
import { getProductReviews } from '@/lib/reviews';

// ─── Deterministic mock data from product handle ─────────────────────────
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ─── Badge helpers ───────────────────────────────────────────────────────
interface BadgeInfo {
  label: string;
  bg: string;
  text: string;
}

function getBadge(tags?: string[]): BadgeInfo | null {
  if (!tags || tags.length === 0) return null;
  const t = tags.map((x) => x.toLowerCase().trim());
  if (t.includes('sale')) return { label: 'SALE', bg: 'bg-[#E85D75]', text: 'text-white' };
  if (t.includes('bestseller') || t.includes('best seller')) return { label: 'BESTSELLER', bg: 'bg-[#4A90D9]', text: 'text-white' };
  if (t.includes('viral')) return { label: 'VIRAL', bg: 'bg-[#E85D75]', text: 'text-white' };
  if (t.includes('2+1 free') || t.includes('2+1') || t.includes('bundle')) return { label: '2+1 FREE', bg: 'bg-[#7C5CFC]', text: 'text-white' };
  // fallback: use first tag as badge
  return { label: tags[0].toUpperCase(), bg: 'bg-gray-400', text: 'text-white' };
}

// ─── Color swatch helper ─────────────────────────────────────────────────
function getColorOption(options?: Array<{ name: string; values: string[] }>) {
  return options?.find((o) => /color|colour/i.test(o.name));
}

// Map common color names to approximate hex values
function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    red: '#ef4444', pink: '#ec4899', rose: '#fb7185',
    orange: '#f97316', amber: '#f59e0b', yellow: '#eab308',
    green: '#22c55e', emerald: '#10b981', teal: '#14b8a6',
    cyan: '#06b6d4', blue: '#3b82f6', indigo: '#6366f1',
    violet: '#8b5cf6', purple: '#a855f7', fuchsia: '#d946ef',
    white: '#f9fafb', black: '#111827', gray: '#9ca3af',
    grey: '#9ca3af', brown: '#92400e', beige: '#fde68a',
    nude: '#fde68a', mint: '#a7f3d0', peach: '#fed7aa',
    coral: '#ff7f50', burgundy: '#7f1d1d', navy: '#1e3a8a',
    lavender: '#c4b5fd', cream: '#fef3c7', ivory: '#fffbeb',
    gold: '#fbbf24', silver: '#e5e7eb',
  };
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(map)) if (key.includes(k)) return v;
  // Hash-based fallback
  const h = hashString(key);
  const hue = h % 360;
  return `hsl(${hue}, 65%, 60%)`;
}

// ─── Star component ────────────────────────────────────────────────────────
function Star({ filled, size = 10 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={filled ? 'text-[#E85D75]' : 'text-gray-300'}>
      <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarRating({ rating, count, size = 10 }: { rating: number; count?: number; size?: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((filled, i) => (
        <Star key={i} filled={filled} size={size} />
      ))}
      {count !== undefined && (
        <span className="text-[11px] text-gray-500 ml-1">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    tags?: string[];
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange?: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{
        node: { url: string; altText: string | null };
      }>;
    };
    options?: Array<{ name: string; values: string[] }>;
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

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const firstVariant = product.variants?.edges[0]?.node;
  const badge = getBadge(product.tags);
  const colorOpt = getColorOption(product.options);
  const reviews = getProductReviews(product.handle);

  const [added, setAdded] = useState(false);
  const { addItem, isLoading } = useCartStore();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant?.id || !firstVariant.availableForSale) return;
    await addItem(firstVariant.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = getDiscountPercent(price.amount, comparePrice?.amount);
  const hasDiscount = discountPercent > 0;
  const formattedPrice = formatMoney(price.amount, price.currencyCode);
  const formattedOriginalPrice = formatMoney(comparePrice?.amount, comparePrice?.currencyCode || price.currencyCode);
  const canQuickAdd = Boolean(firstVariant?.id && firstVariant.availableForSale);

  return (
    <Link href={`/product/${product.handle}`} className="group block">
      {/* Image area — no cadre, product directly */}
      <div className="relative aspect-square overflow-hidden mb-3">
        {/* Badge — positioned at top-left of image */}
        {badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`inline-block ${badge.bg} ${badge.text} text-[8px] font-black tracking-widest uppercase px-2 py-1 rounded-md`}>
              {badge.label}
            </span>
          </div>
        )}

        {/* Product image */}
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Info below image — no card padding */}
      <div className="space-y-1.5">
        {/* Star rating */}
        <StarRating rating={reviews.rating} count={reviews.count} size={10} />

        {/* Product name */}
        <h3 className="text-[11px] font-black text-black uppercase tracking-wide leading-tight line-clamp-2">
          {product.title}
        </h3>

        {/* Color swatches */}
        {colorOpt && colorOpt.values.length > 0 && (
          <div className="flex items-center gap-1">
            {colorOpt.values.slice(0, 4).map((val, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: colorNameToHex(val) }}
                title={val}
              />
            ))}
            {colorOpt.values.length > 4 && (
              <span className="text-[8px] text-gray-400 font-medium ml-0.5">+{colorOpt.values.length - 4}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-black">{formattedPrice}</span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">{formattedOriginalPrice}</span>
          )}
        </div>

        {/* Bottom black stars */}
        <div className="flex items-center gap-0.5 pt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width={9} height={9} viewBox="0 0 24 24" className="text-black">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>
    </Link>
  );
}
