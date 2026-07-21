'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsByCollection } from '@/lib/shopify';
import type { ShopifyProductEdge } from '@/lib/shopify';
import { formatMoney } from '@/lib/money';

export default function FeaturedCollection() {
  const [products, setProducts] = useState<ShopifyProductEdge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = (await getProductsByCollection('featured')) as ShopifyProductEdge[];
        setProducts(data.slice(0, 4)); // Show 4 products
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:text-left">
          <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
            CUSTOMER FAVORITES
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900 leading-none uppercase tracking-tight">
            PEOPLE ALSO <span className="text-[#231b50]">LOVE</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => {
            const node = product.node;
            const price = node.priceRange.minVariantPrice;
            const formattedPrice = formatMoney(price.amount, price.currencyCode);

            return (
              <Link
                key={node.id}
                href={`/product/${node.handle}`}
                className="group flex flex-col space-y-4"
              >
                <div className="relative aspect-[4/5] rounded-2xl bg-gray-50 overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                  {node.images.edges[0] && (
                    <Image
                      src={node.images.edges[0].node.url}
                      alt={node.images.edges[0].node.altText || node.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-[#231b50] transition-colors line-clamp-1">
                    {node.title}
                  </h3>
                  <p className="text-[#231b50] font-black">{formattedPrice}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
