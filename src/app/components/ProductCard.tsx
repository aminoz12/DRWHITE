'use client';

import Link from 'next/link';
import Image from 'next/image';

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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block"
    >
      <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden mb-4">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
        {product.title}
      </h3>
      
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg font-semibold text-gray-900">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currencyCode,
          }).format(parseFloat(price.amount))}
        </span>
      </div>
    </Link>
  );
}
