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
} from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useRouter } from 'next/navigation';
import PaymentIcons from './PaymentIcons';
import LazyVideo from './LazyVideo';
import { formatMoney, getDiscountPercent } from '@/lib/money';

type ProductKind =
  | 'strips'
  | 'toothpaste'
  | 'serum'
  | 'foam'
  | 'powder'
  | 'mouthwash'
  | 'toothbrush'
  | 'bundle'
  | 'other';

function getProductKind(title: string): ProductKind {
  const t = title.toLowerCase();
  if (t.includes('bundle') || t.includes('kit') || t.includes('7-in-1')) return 'bundle';
  if (t.includes('strip')) return 'strips';
  if (t.includes('toothpaste')) return 'toothpaste';
  if (t.includes('serum')) return 'serum';
  if (t.includes('foam')) return 'foam';
  if (t.includes('powder')) return 'powder';
  if (t.includes('mouthwash')) return 'mouthwash';
  if (t.includes('toothbrush')) return 'toothbrush';
  return 'other';
}

// What one purchased unit contains, per product type, so the buy box never
// claims "strips" on a serum. n = number of units in the offer tier.
function unitLabel(kind: ProductKind, n: number): string {
  switch (kind) {
    case 'strips':
      return `${14 * n} STRIPS IN TOTAL`;
    case 'mouthwash':
      return `${12 * n} SACHETS IN TOTAL`;
    case 'toothpaste':
      return n === 1 ? '1 TUBE IN TOTAL' : `${n} TUBES IN TOTAL`;
    case 'serum':
    case 'foam':
      return n === 1 ? '1 BOTTLE IN TOTAL' : `${n} BOTTLES IN TOTAL`;
    case 'powder':
      return n === 1 ? '1 JAR IN TOTAL' : `${n} JARS IN TOTAL`;
    case 'toothbrush':
      return n === 1 ? '1 TOOTHBRUSH' : `${n} TOOTHBRUSHES`;
    case 'bundle':
      return n === 1 ? '1 COMPLETE SET' : `${n} COMPLETE SETS`;
    default:
      return n === 1 ? '1 PACK IN TOTAL' : `${n} PACKS IN TOTAL`;
  }
}

const HOW_TO: Record<ProductKind, { step: string; text: string }[]> = {
  strips: [
    { step: '1. Peel & Apply:', text: 'Gently press the strip onto clean, dry teeth.' },
    { step: '2. Wait 30-60 Minutes:', text: 'Leave the strips on while you go about your day.' },
    { step: '3. Remove & Rinse:', text: 'Discard the strip and rinse any residue.' },
    { step: '4. Repeat:', text: 'Use once daily. Most people use them for 7 consecutive days, then as needed for maintenance.' },
  ],
  toothpaste: [
    { step: '1. Apply:', text: 'Squeeze a pea-sized amount onto a dry toothbrush.' },
    { step: '2. Brush:', text: 'Brush gently for 2-3 minutes so the V34 pigments can neutralise yellow tones.' },
    { step: '3. Rinse:', text: 'Rinse thoroughly with water.' },
    { step: '4. Repeat:', text: 'Use once or twice daily in place of, or after, your regular toothpaste.' },
  ],
  serum: [
    { step: '1. Apply:', text: 'Add a thin layer of serum to your toothbrush, alone or on top of toothpaste.' },
    { step: '2. Brush:', text: 'Brush gently for 2-3 minutes, letting the colour-correcting pigments coat every surface.' },
    { step: '3. Rinse:', text: 'Rinse thoroughly with water.' },
    { step: '4. Repeat:', text: 'Use daily for an instant brightening boost before events or photos.' },
  ],
  foam: [
    { step: '1. Dispense:', text: 'Pump the foam directly onto your toothbrush.' },
    { step: '2. Brush:', text: 'Brush for 1-2 minutes to let the V34 formula work.' },
    { step: '3. Rinse:', text: 'Spit and rinse with water.' },
    { step: '4. Repeat:', text: 'Use daily — ideal after coffee, tea or red wine.' },
  ],
  powder: [
    { step: '1. Dip:', text: 'Dip a clean, damp toothbrush into the powder.' },
    { step: '2. Brush:', text: 'Brush gently for 2-3 minutes to lift surface stains.' },
    { step: '3. Rinse:', text: 'Rinse thoroughly with water.' },
    { step: '4. Repeat:', text: 'Use once daily alongside your regular toothpaste routine.' },
  ],
  mouthwash: [
    { step: '1. Prepare:', text: 'Empty one sachet into your mouth, or dissolve as directed on the pack.' },
    { step: '2. Swish:', text: 'Swish for 30-60 seconds, coating all surfaces of your teeth.' },
    { step: '3. Spit:', text: 'Spit out — do not swallow.' },
    { step: '4. Repeat:', text: 'Use once daily after brushing for colour correction on the go.' },
  ],
  toothbrush: [
    { step: '1. Charge:', text: 'Fully charge the toothbrush before first use.' },
    { step: '2. Brush:', text: 'Brush for the full 2-minute timer using your preferred smart mode.' },
    { step: '3. Rinse:', text: 'Rinse the brush head and let it air-dry.' },
    { step: '4. Maintain:', text: 'Replace the brush head every 3 months for best results.' },
  ],
  bundle: [
    { step: '1. Start:', text: 'Begin with the core whitening product in your set.' },
    { step: '2. Layer:', text: 'Add the colour-correcting products (serum, foam or powder) to your daily routine.' },
    { step: '3. Follow:', text: 'Each product in the set includes its own directions — use as directed.' },
    { step: '4. Repeat:', text: 'Stay consistent daily for 7-14 days for the full transformation.' },
  ],
  other: [
    { step: '1. Follow:', text: 'Use as directed on the packaging.' },
    { step: '2. Be Consistent:', text: 'Use daily for best results.' },
    { step: '3. Maintain:', text: 'Continue as needed to maintain your results.' },
    { step: '4. Combine:', text: 'Pairs perfectly with the rest of the CLINI WHITE V34 range.' },
  ],
};

// Units contained in each offer tier: BUY 1, BUY 1 GET 1, BUY 2 GET 2.
const TIER_UNITS = [1, 2, 4];

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

  const [activeImage, setActiveImage] = useState(0);

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const comparePrice = selectedVariant?.compareAtPrice;
  const formattedPrice = formatMoney(price.amount, price.currencyCode);
  const formattedComparePrice = formatMoney(
    comparePrice?.amount,
    comparePrice?.currencyCode || price.currencyCode
  );
  const savings = getDiscountPercent(price.amount, comparePrice?.amount);

  return (
    <section className="bg-white py-8 lg:py-12 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-6">
            <div className="relative aspect-square flex items-center justify-center">
              <Image
                src={images[activeImage]?.url || images[0]?.url || ''}
                alt={images[activeImage]?.altText || product.title}
                width={800}
                height={800}
                className="object-contain w-full h-full transform scale-100"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(activeImage === i + 1 ? 0 : i + 1)}
                  aria-label={`View product image ${i + 2}`}
                  className={`relative aspect-square group overflow-hidden rounded-md transition-shadow ${
                    activeImage === i + 1 ? 'ring-2 ring-[#231b50] ring-offset-2' : ''
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-5">
              <h1 className="font-display text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#1a1a1a] leading-none">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                {savings > 0 && (
                  <span className="text-sm font-bold text-red-500 line-through opacity-70">{formattedComparePrice}</span>
                )}
                <span className="text-3xl font-black text-black tracking-tight">{formattedPrice}</span>
                {savings > 0 && (
                  <span className="bg-[#21bc64] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase">SAVE {savings}%</span>
                )}
              </div>

            </div>

            {/* PURCHASE SECTION */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              {/* VARIANTS */}
              <div className="space-y-3">
                {product.variants.edges.map(({ node }, index) => (
                  <label
                    key={node.id}
                    className={`group relative flex items-center justify-between p-5 rounded-md border-2 cursor-pointer transition-all ${selectedVariant?.id === node.id ? 'border-[#231b50] bg-[#F5F3FF]' : 'border-[#eee] bg-white hover:border-gray-200'}`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      className="sr-only"
                      checked={selectedVariant?.id === node.id}
                      onChange={() => setSelectedVariant(node)}
                    />
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedVariant?.id === node.id ? 'border-[#231b50] bg-[#231b50]' : 'border-[#ddd]'}`}>
                        {selectedVariant?.id === node.id && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                      </div>
                      <div>
                        <p className="font-black text-black text-lg leading-none">
                          {index === 0 ? 'BUY 1' : index === 1 ? 'BUY 1 GET 1' : 'BUY 2 GET 2'}
                        </p>
                        <p className="text-[10px] font-black text-[#231b50] mt-2 uppercase">
                          {unitLabel(getProductKind(product.title), TIER_UNITS[index] ?? index + 1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-black text-lg leading-none">
                        {formatMoney(node.price.amount, node.price.currencyCode)}
                      </p>
                      {node.compareAtPrice && (
                        <p className="text-[11px] font-bold text-[#f44336] line-through mt-0.5 opacity-60">
                          {formatMoney(node.compareAtPrice.amount, node.compareAtPrice.currencyCode)}
                        </p>
                      )}
                    </div>

                    {(index === 1 || index === 2) && (
                      <div className="absolute -top-[10px] right-2 bg-[#f44336] text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase italic">
                        LIMITED OFFER
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
                  className={`w-full h-16 bg-[#231b50] text-white font-black text-sm tracking-[0.1em] uppercase rounded-sm shadow-xl shadow-[#231b50]/10 transition-all hover:bg-[#1a1440] active:scale-[0.98] flex items-center justify-center gap-3 ${added ? 'bg-[#21bc64]' : ''
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
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secure Checkout</div>
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
                  <Check className="w-5 h-5 text-[#231b50]" strokeWidth={4} />
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
                  <p className="text-[11px] text-gray-500 leading-tight">Apply and go about your day</p>
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
                  <p className="text-[11px] text-gray-500 leading-tight">Risk-free satisfaction</p>
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
                  {HOW_TO[getProductKind(product.title)].map(({ step, text }) => (
                    <div key={step} className="space-y-1">
                      <p><span className="font-bold">{step}</span> {text}</p>
                    </div>
                  ))}
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
                  We offer a 30-day money back guarantee. If you&apos;re not satisfied with your results, contact our support team.
                </div>
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      {/* REELS SECTION */}
      <div className="mt-12 lg:mt-20 border-t border-gray-100 pt-12 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 mb-10">
          <h2 className="font-display text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-center">
            Can&apos;t STOP SMILING WITH CLINI WHITE
          </h2>
        </div>

        <div className="relative overflow-hidden group">
          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] py-4">
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((id, i) => (
              <div key={i} className="flex-none w-[200px] sm:w-[250px] aspect-[9/16] mx-3 rounded-2xl overflow-hidden bg-gray-100 relative shadow-md">
                <LazyVideo src={`/vid${id}.mp4`} className="w-full h-full object-cover" />
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
        <span className="text-[13px] font-black uppercase tracking-widest text-black group-hover:text-[#231b50] transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-black transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}
