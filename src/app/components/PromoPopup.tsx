'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, Loader2, Sparkles } from 'lucide-react';

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem('clini_white_promo_dismissed');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setShouldRender(true);
        setTimeout(() => setIsVisible(true), 50);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

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

    // Fill with gold gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.3, '#FFD700');
    gradient.addColorStop(0.5, '#F0E68C');
    gradient.addColorStop(0.7, '#FFD700');
    gradient.addColorStop(1, '#B8860B');
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
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', rect.width / 2, rect.height / 2);

    // Track scratched area
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const totalPixels = imageData.data.length / 4;

    const checkScratched = () => {
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 3; i < current.data.length; i += 4) {
        if (current.data[i] === 0) transparent++;
      }
      const percent = (transparent / totalPixels) * 100;
      setScratchedPercent(percent);
      if (percent > 35 && !isScratched) {
        setIsScratched(true);
        // Fade out remaining scratch layer
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    const handleMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      checkScratched();
    };

    const onMouseDown = () => { isDrawing.current = true; };
    const onMouseUp = () => { isDrawing.current = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      handleMove(e.clientX, e.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      isDrawing.current = true;
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => { isDrawing.current = false; };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      localStorage.setItem('clini_white_promo_dismissed', 'true');
    }, 300);
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    localStorage.setItem('clini_white_promo_dismissed', 'true');
    setTimeout(() => handleDismiss(), 2500);
  };

  if (!shouldRender) return null;

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
      <div className={`relative my-auto max-h-[92svh] w-full max-w-xl overflow-y-auto bg-white rounded-2xl shadow-2xl transition-transform duration-500 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        {/* Close */}
        <button onClick={handleDismiss} className="absolute top-3 left-3 z-20 p-1.5 text-black hover:opacity-60 transition-opacity" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="pt-9 pb-7 px-5 sm:pt-10 sm:pb-8 sm:px-8 flex flex-col items-center text-center">
          {/* Brand */}
          <h3 className="text-black font-black text-xl tracking-tighter italic mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            CLINI WHITE
          </h3>

          {!isScratched ? (
            <>
              <h2 id="promo-popup-title" className="font-display text-3xl font-extrabold text-black leading-tight mb-1">
                Try your luck
              </h2>
              <p className="text-base text-gray-600 mb-8">Scratch below to see what you win</p>

              {/* Scratch card area */}
              <div ref={containerRef} className="relative w-full max-w-[360px] aspect-[3/2] mx-auto rounded-xl overflow-hidden select-none">
                {/* Hidden prize */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-pink-600">
                  <div className="text-white font-black text-5xl leading-none drop-shadow-lg">
                    -60%
                  </div>
                  <div className="text-white/90 font-bold text-sm uppercase tracking-wider mt-1">
                    OFFERED
                  </div>
                </div>
                {/* Scratch canvas layer */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />
              </div>

              <p className="text-xs text-gray-600 mt-5">Scratch the golden area to reveal your prize</p>

              {/* Keyboard/AT-accessible path to the same offer */}
              <button
                type="button"
                onClick={() => setIsScratched(true)}
                className="mt-3 text-xs font-bold text-[#231b50] underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                Reveal my prize without scratching
              </button>
            </>
          ) : !isSubmitted ? (
            <div className="animate-in fade-in zoom-in duration-500 w-full">
              <h2 className="text-3xl font-black text-black leading-tight mb-1">
                Congratulations!!
              </h2>
              <div className="flex items-center justify-center gap-1 mb-4">
                <span className="text-red-500 font-black text-2xl">-60%</span>
                <span className="text-gray-600 font-bold text-sm uppercase tracking-wider">OFF</span>
              </div>
              <p className="text-xs text-gray-600 mb-5">Enter your email to claim your exclusive discount</p>

              <form onSubmit={handleClaim} className="space-y-3 w-full max-w-xs mx-auto">
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  autoComplete="email"
                  aria-label="Email address to claim your discount"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:bg-white outline-none transition-all text-sm font-medium text-center"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim'}
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500 py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black text-black mb-1">Offer Claimed!</h3>
              <p className="text-sm text-gray-600">Check your inbox for the -60% discount code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
