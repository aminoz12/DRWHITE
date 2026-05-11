'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Check,
  Loader2,
  Truck,
  RotateCcw,
  ChevronDown,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useRouter } from 'next/navigation';
import PaymentIcons from './PaymentIcons';

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
          compareAtPrice?: {
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
  const [activeAccordion, setActiveAccordion] = useState<string | null>('desc');
  const [added, setAdded] = useState(false);
  const { addItem, isLoading } = useCartStore();
  const router = useRouter();

  const images = product.images.edges.map(e => e.node);

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) return;
    await addItem(selectedVariant.id, 1);
    setAdded(true);
    // Redirect to cart page after a short delay to show the "Added" state
    setTimeout(() => {
        setAdded(false);
        router.push('/cart');
    }, 800);
  };

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const comparePrice = selectedVariant?.compareAtPrice?.amount || (parseFloat(price.amount) * 1.1).toFixed(2);

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(parseFloat(price.amount));

  const formattedComparePrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(parseFloat(comparePrice as string));

  const savings = Math.round(((parseFloat(comparePrice as string) - parseFloat(price.amount)) / parseFloat(comparePrice as string)) * 100);

  return (
    <section className="bg-white py-8 lg:py-12 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-6">
            <div className="relative aspect-square flex items-center justify-center">
              <Image
                src={images[0]?.url || ''}
                alt={images[0]?.altText || product.title}
                width={800}
                height={800}
                className="object-contain w-full h-full transform scale-100"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square group cursor-pointer">
                  <Image
                    src={img.url}
                    alt={img.altText || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-5">
              <h1 className="text-4xl lg:text-[42px] font-black uppercase tracking-tighter text-[#1a1a1a] leading-none">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-sm font-bold text-red-500 line-through opacity-70">{formattedComparePrice}</span>
                <span className="text-3xl font-black text-black tracking-tight">{formattedPrice}</span>
                <span className="bg-[#21bc64] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase">SAVE {savings}%</span>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </div>
                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wide">Almost sold out</span>
              </div>
            </div>

            {/* PURCHASE SECTION */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              {/* VARIANTS */}
              <div className="space-y-3">
                {product.variants.edges.map(({ node }, index) => (
                  <label
                    key={node.id}
                    className={`group relative flex items-center justify-between p-5 rounded-md border-2 cursor-pointer transition-all ${selectedVariant?.id === node.id ? 'border-[#003c8f] bg-[#f0f4f8]' : 'border-[#eee] bg-white hover:border-gray-200'}`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      className="hidden"
                      checked={selectedVariant?.id === node.id}
                      onChange={() => setSelectedVariant(node)}
                    />
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedVariant?.id === node.id ? 'border-[#003c8f] bg-[#003c8f]' : 'border-[#ddd]'}`}>
                        {selectedVariant?.id === node.id && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                      </div>
                      <div>
                        <p className="font-black text-black text-lg leading-none">
                          {index === 0 ? 'BUY 1' : index === 1 ? 'BUY 1 GET 1' : 'BUY 2 GET 2'}
                        </p>
                        <p className="text-[10px] font-black text-[#003c8f] mt-2 uppercase">
                          {index === 0 ? '14 STRIPS IN TOTAL' : index === 1 ? '28 STRIPS IN TOTAL' : '56 STRIPS IN TOTAL'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-black text-lg leading-none">
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(parseFloat(node.price.amount))}
                      </p>
                      {node.compareAtPrice && (
                        <p className="text-[11px] font-bold text-[#f44336] line-through mt-0.5 opacity-60">
                          {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(parseFloat(node.compareAtPrice.amount))}
                        </p>
                      )}
                    </div>

                    {(index === 1 || index === 2) && (
                      <div className="absolute -top-[10px] right-2 bg-[#f44336] text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase italic">
                        BOGO DEAL
                      </div>
                    )}
                  </label>
                ))}
              </div>

              {/* ADD TO CART */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !selectedVariant?.availableForSale}
                  className={`w-full h-16 bg-[#003c8f] text-white font-black text-sm tracking-[0.1em] uppercase rounded-sm shadow-xl shadow-blue-900/10 transition-all hover:bg-[#002b66] active:scale-[0.98] flex items-center justify-center gap-3 ${added ? 'bg-[#21bc64]' : ''
                    }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : added ? (
                    <>
                      <Check className="w-6 h-6" strokeWidth={3} />
                      Added to bag
                    </>
                  ) : (
                    'Add to cart'
                  )}
                </button>

                {/* Payment Icons */}
                <div className="flex flex-col items-center gap-3 py-2">
                  <PaymentIcons className="justify-center" />
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Secure Checkout</div>
                </div>
              </div>
            </div>

            {/* CHECKLIST */}
            <div className="space-y-4 pt-4">
              {[
                'Peroxide-free formula',
                'Made in FDA-registered facilities',
                'PAP formula',
                '30-day money back guarantee'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Check className="w-5 h-5 text-[#003c8f]" strokeWidth={4} />
                  <span className="text-[13px] font-black text-[#333] uppercase tracking-wider">{text}</span>
                </div>
              ))}
            </div>

            {/* TRUST ICONS */}
            <div className="grid grid-cols-3 gap-2 py-8 border-y border-gray-100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f9f9f9]">
                  <Clock className="w-6 h-6 text-black stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-black uppercase leading-tight">30-60 Minute Sessions</p>
                  <p className="text-[9px] text-[#999] leading-tight">Apply and go about your day</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 border-x border-gray-100">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f9f9f9]">
                  <Truck className="w-6 h-6 text-black stroke-[1.5]" />
                </div>
                <div className="space-y-1 px-2">
                  <p className="text-[10px] font-black text-black uppercase leading-tight">1-2 Day Free Express Shipping</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f9f9f9]">
                  <RotateCcw className="w-6 h-6 text-black stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-black uppercase leading-tight">30 Day Returns</p>
                  <p className="text-[9px] text-[#999] leading-tight">Risk-free satisfaction</p>
                </div>
              </div>
            </div>

            {/* ACCORDION SECTION */}
            <div className="pt-8 divide-y divide-gray-200">
              <Accordion title="Description" id="desc" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-sm leading-relaxed text-[#4a4a4a]">
                  {product.description}
                </div>
              </Accordion>
              <Accordion title="Key Benefits" id="benefits" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <ul className="pb-6 space-y-3">
                  {['Professional level results', 'Peroxide-free for zero sensitivity', 'Safe for enamel', 'Clinically proven results'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#4a4a4a]">
                      <div className="w-1 h-1 rounded-full bg-black" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="How to use" id="how" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-8 space-y-6 text-sm text-black">
                  <div className="space-y-1">
                    <p><span className="font-bold">1. Peel & Apply:</span> Gently press the strip onto clean, dry teeth.</p>
                  </div>
                  <div className="space-y-1">
                    <p><span className="font-bold">2. Wait 30-60 Minutes:</span> Leave the strips on while you go about your day.</p>
                  </div>
                  <div className="space-y-1">
                    <p><span className="font-bold">3. Remove & Rinse:</span> Discard the strip and rinse any residue.</p>
                  </div>
                  <div className="space-y-1">
                    <p><span className="font-bold">4. Repeat:</span> Use once daily. Most people use them for 7 consecutive days, then as needed for maintenance.</p>
                  </div>
                </div>
              </Accordion>
              <Accordion title="What is PAP" id="pap" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-sm leading-relaxed text-[#4a4a4a]">
                  Phthalimidoperoxycaproic acid (PAP) is a non-peroxide whitening agent that is clinically proven to whiten teeth without sensitivity or damage to enamel.
                </div>
              </Accordion>
              <Accordion title="Premium Ingredients" id="ingredients" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-[11px] font-mono leading-relaxed text-[#666]">
                  Glycerin, Aqua/Water, Cellulose Gum, Hydroxypropyl Methylcellulose, Phthalimidoperoxycaproic Acid, Disodium EDTA, Sodium Hydroxide, Menthol, Monosodium Citrate, Xanthan Gum, PVM/MA Copolymer.
                </div>
              </Accordion>
              <Accordion title="Guarantee & Support" id="guarantee" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-sm leading-relaxed text-[#4a4a4a]">
                  We offer a 30-day money back guarantee. If you're not satisfied with your results, contact our support team.
                </div>
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      {/* REELS SECTION */}
      <div className="mt-12 lg:mt-20 border-t border-gray-100 pt-12 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 mb-10">
          <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-center">
            Can't STOP SMILING WITH CLINI WHITE
          </h2>
        </div>

        <div className="relative overflow-hidden group">
          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] py-4">
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((id, i) => (
              <div key={i} className="flex-none w-[200px] sm:w-[250px] aspect-[9/16] mx-3 rounded-2xl overflow-hidden bg-gray-100 relative shadow-md">
                <video
                  src={`/vid${id}.mp4`}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

function Accordion({
  title,
  id,
  children,
  activeId,
  onToggle
}: {
  title: string,
  id: string,
  children: React.ReactNode,
  activeId: string | null,
  onToggle: (id: string | null) => void
}) {
  const isOpen = activeId === id;
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => onToggle(isOpen ? null : id)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-[13px] font-black uppercase tracking-widest text-black group-hover:text-[#003c8f] transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-black transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}
