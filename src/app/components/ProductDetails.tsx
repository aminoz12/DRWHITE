'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { addToCartUrl } from '@/lib/shopify';

interface ProductDetailsProps {
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
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
        };
      }>;
    };
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node
  );
  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  const handleAddToCart = () => {
    if (selectedVariant?.id) {
      const checkoutUrl = addToCartUrl(selectedVariant.id, quantity);
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl bg-gray-100 overflow-hidden">
            {product.images.edges[0] ? (
              <Image
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          
          {product.images.edges.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.edges.map((image, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={image.node.url}
                    alt={image.node.altText || `${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Trust Badges */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">4.8 (5,642+ reviews)</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">30-Day Money Back</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-purple-600">{formattedPrice}</span>
          </div>

          {/* Description */}
          <div 
            className="prose prose-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* Variant Selector */}
          {product.variants.edges.length > 1 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.edges.map(({ node: variant }) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 text-gray-700 hover:border-purple-300'
                    }`}
                    disabled={!variant.availableForSale}
                  >
                    {variant.title}
                    {!variant.availableForSale && ' (Out of Stock)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart - {formattedPrice}
          </button>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-100">
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-xs text-gray-600">Secure Payment</p>
            </div>
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-xs text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-xs text-gray-600">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
