'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useCurrencyStore } from '@/lib/currencyStore';

interface ProductCardProps {
  product: {
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

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const firstVariantId = product.variants?.edges[0]?.node?.id;

  const [added, setAdded] = useState(false);
  const { addItem, isLoading } = useCartStore();
  const { currency, rate, symbol } = useCurrencyStore();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariantId) return;
    await addItem(firstVariantId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const colors = [
    'bg-[#D9CFFF]', // Lavender
    'bg-[#E5D9FF]', // Light Purple
    'bg-[#C6EFFF]', // Light Blue
    'bg-[#A5C9FF]', // Sky Blue
    'bg-[#8E94F2]', // Periwinkle
    'bg-[#7AA1D2]'  // Steel Blue
  ];

  // Pick a color based on the handle to keep it consistent
  const colorClass = colors[product.handle.length % colors.length];

  // Mocking discount data for visual parity with the reference image
  // Converting from GBP base to selected currency
  const basePrice = parseFloat(price.amount);
  const currentPriceConverted = basePrice * rate;
  const originalPriceConverted = currentPriceConverted * 1.2;
  const discountPercent = 15;

  const formatPrice = (amount: number) => {
    // Custom formatting to handle "US$" style if needed
    if (currency === 'USD') return `US$${amount.toFixed(2)}`;
    if (currency === 'EUR') return `€${amount.toFixed(2)}`;
    return `£${amount.toFixed(2)}`;
  };

  const formattedPrice = formatPrice(currentPriceConverted);
  const formattedOriginalPrice = formatPrice(originalPriceConverted);

  const hasDiscount = true; 

  return (
    <Link href={`/product/${product.handle}`} className="group block relative">
      {/* Colored Image Container - Tighter for mobile */}
      <div className={`relative aspect-[4/5] rounded-lg ${colorClass} overflow-hidden mb-3 transition-transform duration-500 group-hover:scale-[1.02]`}>
        {/* Discount Overlay at top */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
             <span className="bg-[#00B67A] text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-sm leading-none uppercase tracking-tighter shadow-sm">
                {discountPercent}% Off
              </span>
              <span className="text-[10px] md:text-[12px] text-red-600 line-through font-bold bg-white/60 backdrop-blur-[2px] px-1.5 py-0.5 rounded-sm">
                {formattedOriginalPrice}
              </span>
          </div>
        )}

        {image ? (
          <div className="relative w-full h-full p-4 md:p-6 flex items-center justify-center">
            <Image
              src={image.url}
              alt={image.altText || product.title}
              width={400}
              height={500}
              className="object-contain w-full h-full drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Quick Add Overlay - Simplified for smaller cards */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <button
            onClick={handleQuickAdd}
            disabled={isLoading}
            className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            {isLoading ? '...' : added ? '✓' : 'ADD +'}
          </button>
        </div>
      </div>

      {/* Product Info - Simplified pricing below title */}
      <div className="text-center px-1">
        <h3 className="text-[12px] md:text-[14px] font-[800] text-black mb-1 leading-tight tracking-tight line-clamp-2 uppercase">
          {product.title}
        </h3>

        <div className="flex items-center justify-center">
          <span className="text-[14px] md:text-[18px] font-[900] text-black">
            {formattedPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
