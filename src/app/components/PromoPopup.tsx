'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { WELCOME_OFFER } from '@/lib/siteConfig';
import WelcomeOfferForm from './WelcomeOfferForm';
import { useCartStore } from '@/lib/cartStore';
import { OPEN_WELCOME_OFFER } from '@/lib/events';

const DISMISSED_KEY = 'clini_white_promo_dismissed';

// Storage can throw (private mode, blocked site data) — never let that break
// the page; worst case the popup simply shows again next visit.
function hasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) !== null;
  } catch {
    return false;
  }
}
function rememberDismissed() {
  try {
    localStorage.setItem(DISMISSED_KEY, 'true');
  } catch {
    // ignore
  }
}

const OFF_LABEL = `-${WELCOME_OFFER.percentOff}%`;

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  // Number of completed scratch strokes (press → drag → release). The prize
  // only shows after the third one so the interaction feels earned.
  const [strokes, setStrokes] = useState(0);
  const [isClaimed, setIsClaimed] = useState(false);
  // The offer lives in a small floating "Get 10%" bubble; the dialog only opens
  // when the shopper taps it — never on a timer over the page.
  const [showBubble, setShowBubble] = useState(false);
  const isApplied = useCartStore((s) => s.appliedDiscountCode === WELCOME_OFFER.code);
  const cartOpen = useCartStore((s) => s.isOpen);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const strokeMoved = useRef(false);
  const strokeCount = useRef(0);

  useEffect(() => {
    if (!hasDismissed()) {
      const timer = setTimeout(() => setShowBubble(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const openOffer = () => {
    setShouldRender(true);
    setTimeout(() => setIsVisible(true), 50);
  };

  // Other CTAs (e.g. the homepage welcome tile) open the same dialog.
  useEffect(() => {
    const open = () => {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 50);
    };
    window.addEventListener(OPEN_WELCOME_OFFER, open);
    return () => window.removeEventListener(OPEN_WELCOME_OFFER, open);
  }, []);

  // The bubble's own × hides the offer for good.
  const hideBubble = () => {
    setShowBubble(false);
    rememberDismissed();
  };

  // Initialize scratch canvas
  useEffect(() => {
    if (!shouldRender || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Fill with metallic purple foil
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#5B21B6');
    gradient.addColorStop(0.3, '#8B5CF6');
    gradient.addColorStop(0.5, '#C4B5FD');
    gradient.addColorStop(0.7, '#8B5CF6');
    gradient.addColorStop(1, '#4C1D95');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add noise/grain texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Add diagonal shine lines
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 20;
    for (let i = -rect.height; i < rect.width + rect.height; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + rect.height * 0.5, rect.height);
      ctx.stroke();
    }

    // "SCRATCH HERE" text
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', rect.width / 2, rect.height / 2);

    const reveal = () => {
      setIsScratched(true);
      ctx.clearRect(0, 0, rect.width, rect.height);
    };

    const handleMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      strokeMoved.current = true;
    };

    // A stroke counts once the pointer lifts after actually scratching.
    // The third completed stroke reveals the prize.
    const endStroke = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      if (!strokeMoved.current) return;
      strokeMoved.current = false;
      strokeCount.current += 1;
      setStrokes(strokeCount.current);
      if (strokeCount.current >= 3) reveal();
    };

    const onMouseDown = () => { isDrawing.current = true; strokeMoved.current = false; };
    const onMouseUp = () => { endStroke(); };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      handleMove(e.clientX, e.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      isDrawing.current = true;
      strokeMoved.current = false;
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => { endStroke(); };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [shouldRender, isScratched]);

  // Closing the dialog keeps the bubble, so the offer is one tap away later.
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 300);
  }, []);

  // Escape closes the dialog; page scroll is locked while it is open.
  useEffect(() => {
    if (!shouldRender) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [shouldRender, handleDismiss]);

  const handleClaimed = () => {
    setIsClaimed(true);
    setShowBubble(false);
    rememberDismissed();
  };

  if (!shouldRender) {
    if (!showBubble || cartOpen) return null;
    return (
      <div className="fixed bottom-24 left-4 z-[90] lg:bottom-6 lg:left-6">
        <button
          type="button"
          onClick={openOffer}
          aria-haspopup="dialog"
          aria-label={`Get ${WELCOME_OFFER.percentOff}% off your first order`}
          className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-grape shadow-xl ring-1 ring-black/5 transition-transform hover:scale-105"
        >
          <span className="text-[11px] font-bold leading-none">Get</span>
          <span className="text-lg font-black leading-tight">{WELCOME_OFFER.percentOff}%</span>
        </button>
        <button
          type="button"
          onClick={hideBubble}
          aria-label="Hide the welcome offer"
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-grape text-white shadow"
        >
          <X className="h-3 w-3" strokeWidth={3} />
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-title"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div aria-hidden className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleDismiss} />

      {/* my-auto + max-h keeps the panel reachable on short viewports (small
          phones, landscape) instead of overflowing past the screen edge. */}
      <div className={`relative my-auto max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl transition-transform duration-500 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        {/* Close */}
        <button onClick={handleDismiss} className="absolute left-3 top-3 z-20 p-1.5 text-black transition-opacity hover:opacity-60" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center px-5 pb-7 pt-9 text-center sm:px-8 sm:pb-8 sm:pt-10">
          {/* Brand */}
          <p className="mb-2 font-display font-wide text-xl font-black tracking-[-0.02em] text-grape">
            CLINIWHITE
          </p>

          {!isScratched ? (
            <>
              <h2 id="promo-popup-title" className="mb-1 font-display font-wide text-3xl font-extrabold leading-tight text-grape">
                Try your luck
              </h2>
              <p className="mb-8 text-base text-gray-600">Scratch below to see what you win</p>

              {/* Scratch card area */}
              <div ref={containerRef} className="relative mx-auto aspect-[3/2] w-full max-w-[360px] select-none overflow-hidden rounded-xl">
                {/* Hidden prize */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-grape to-[#6d28d9]">
                  <div className="text-5xl font-black leading-none text-white drop-shadow-lg">{OFF_LABEL}</div>
                  <div className="mt-1 text-sm font-bold uppercase tracking-wider text-white/90">Offered</div>
                </div>
                {/* Scratch canvas layer */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />
              </div>

              <p className="mt-5 text-xs text-gray-600">
                {strokes === 0
                  ? 'Scratch the purple area to reveal your prize'
                  : `${strokes} of 3 scratches — keep going!`}
              </p>

              {/* Keyboard/AT-accessible path to the same offer */}
              <button
                type="button"
                onClick={() => setIsScratched(true)}
                className="mt-3 text-xs font-bold text-grape underline underline-offset-2 transition-opacity hover:opacity-70"
              >
                Reveal my prize without scratching
              </button>
            </>
          ) : (
            <div className="w-full max-w-xs">
              <span className="tag mb-3 bg-violet text-white">You won {OFF_LABEL}</span>
              <h2 id="promo-popup-title" className="mb-1 text-3xl font-black leading-tight text-black">
                {isClaimed ? `Here's your ${WELCOME_OFFER.percentOff}% off` : 'Congratulations!'}
              </h2>
              <p className="mb-5 text-xs text-gray-600">
                {!isClaimed
                  ? 'Enter your email to claim your exclusive discount'
                  : isApplied
                    ? 'Copy it, or just shop — it’s already in your cart.'
                    : 'Copy it and use it at checkout.'}
              </p>

              <WelcomeOfferForm layout="stacked" onClaimed={handleClaimed} />

              {isClaimed && (
                <button type="button" onClick={handleDismiss} className="btn-primary mt-5 w-full">
                  Start shopping
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
