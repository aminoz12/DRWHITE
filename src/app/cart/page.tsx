'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Star } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PaymentIcons from '@/app/components/PaymentIcons';
import { getProducts } from '@/lib/shopify';

const OFFERS = [
  { discount: 30, text: 'EXTRA 30% OFF' },
  { discount: 50, text: 'MEGA 50% OFF' },
  { discount: 75, text: 'INSANE 75% OFF' },
  { discount: 80, text: 'ALMOST FREE 80% OFF' },
  { discount: 90, text: 'GIVEAWAY 90% OFF' },
];

export default function CartPage() {
  const { items, subtotal, totalQuantity, removeItem, updateQuantity, addItem, isLoading } = useCartStore();
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
  const [offerIndex, setOfferIndex] = useState(0);
  const [currentOfferProduct, setCurrentOfferProduct] = useState<any>(null);
  const [isOfferLoading, setIsOfferLoading] = useState(false);

  useEffect(() => {
    async function fetchUpsells() {
      const products = await getProducts();
      setUpsellProducts(products);
      if (products.length > 0) {
        // Pick a random product for the first offer that isn't already in the cart (ideally)
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        setCurrentOfferProduct(randomProduct.node);
      }
    }
    fetchUpsells();
  }, []);

  const handleAddOffer = async () => {
    if (!currentOfferProduct) return;
    setIsOfferLoading(true);
    const variantId = currentOfferProduct.variants.edges[0].node.id;
    await addItem(variantId, 1);
    
    // Move to next offer
    const nextIndex = Math.min(offerIndex + 1, OFFERS.length - 1);
    setOfferIndex(nextIndex);
    
    // Pick a new random product
    if (upsellProducts.length > 1) {
        let nextProduct;
        do {
            nextProduct = upsellProducts[Math.floor(Math.random() * upsellProducts.length)].node;
        } while (nextProduct.id === currentOfferProduct.id);
        setCurrentOfferProduct(nextProduct);
    }
    
    setIsOfferLoading(false);
  };

  const currentOffer = OFFERS[offerIndex];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-black uppercase tracking-tight mb-8 text-[#1a1a1a]">
                Your cart <span className="text-gray-400 font-medium">({totalQuantity})</span>
              </h1>

              {items.length === 0 ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Your cart is empty</p>
                  <Link 
                    href="/shop"
                    className="inline-block bg-[#0047AB] text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#003c8f] transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.lineId} className="py-6 first:pt-0 last:pb-0 flex gap-4 md:gap-6">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-2" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-black text-black uppercase text-sm md:text-base leading-tight">
                              {item.title}
                            </h3>
                            {item.variantTitle && item.variantTitle !== 'Default Title' && (
                              <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{item.variantTitle}</p>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              removeItem(item.lineId);
                              setOfferIndex(prev => Math.max(0, prev - 1));
                            }}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-2 text-xs font-black min-w-[3rem] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-black text-lg text-black">
                              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: item.currencyCode }).format(parseFloat(item.price))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SUMMARY & OFFERS */}
          <div className="space-y-6">
            {/* Checkout Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-[#0047AB]">
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: items[0]?.currencyCode || 'GBP' }).format(parseFloat(subtotal))}
                </span>
              </div>
              
              <button 
                disabled={items.length === 0}
                className="w-full bg-[#0047AB] text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#003c8f] shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                Checkout
              </button>
              
              <PaymentIcons className="mt-6 justify-center" />
            </div>

            {/* Dynamic Offer Card */}
            {currentOfferProduct && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-blue-100 relative group">
                <div className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest inline-block rounded-br-xl">
                  Super Value
                </div>
                
                <div className="p-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <h4 className="text-2xl font-black leading-none uppercase italic mb-1">
                        Get {currentOffer.discount}% OFF
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-4">
                        Instant saving on your next item
                      </p>
                      
                      <button 
                        onClick={handleAddOffer}
                        disabled={isOfferLoading}
                        className="bg-white text-pink-600 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                      >
                        {isOfferLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim Offer'}
                      </button>
                    </div>
                    
                    <div className="relative w-24 h-24 flex-shrink-0 bg-white/10 rounded-xl backdrop-blur-sm p-2">
                        <Image 
                            src={currentOfferProduct.images.edges[0]?.node.url} 
                            alt={currentOfferProduct.title} 
                            fill 
                            className="object-contain p-2"
                        />
                    </div>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 text-[8px] text-gray-400 font-medium uppercase text-center">
                    *Discount applies to this product only. One use per customer.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BEST SELLERS SECTION */}
        <div className="mt-24">
          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2 text-[#1a1a1a]">Shop our best sellers</h2>
            <p className="text-gray-700 text-sm font-medium">Explore our range of fan-favourites</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {upsellProducts.slice(0, 4).map(({ node }) => (
              <div key={node.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col group">
                <div className="relative aspect-square mb-6 bg-gray-50 rounded-xl overflow-hidden">
                  <Image 
                    src={node.images.edges[0]?.node.url} 
                    alt={node.title} 
                    fill 
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black px-2 py-1 rounded uppercase shadow-sm">
                    Best Seller
                  </div>
                </div>
                
                <h3 className="font-black text-black uppercase text-xs md:text-sm mb-2 line-clamp-1">{node.title}</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />)}
                </div>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-black text-black">
                    {new Intl.NumberFormat('en-GB', { style: 'currency', currency: node.priceRange.minVariantPrice.currencyCode }).format(parseFloat(node.priceRange.minVariantPrice.amount))}
                  </span>
                  <button 
                    onClick={() => addItem(node.variants.edges[0].node.id, 1)}
                    className="bg-black text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
