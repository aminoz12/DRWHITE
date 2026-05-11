'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or claimed the offer
    const hasSeenPromo = localStorage.getItem('clini_white_promo_dismissed');
    
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setShouldRender(true);
        // Small delay for entrance animation
        setTimeout(() => setIsVisible(true), 50);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setShouldRender(false);
      localStorage.setItem('clini_white_promo_dismissed', 'true');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    localStorage.setItem('clini_white_promo_dismissed', 'true');

    // Auto-close after success message
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300);
    }, 3000);
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-transform duration-500 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors shadow-sm"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-gradient-to-br from-[#003c8f] to-[#001f4d] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             {/* Decorative pattern or glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
          </div>
          
          <div className="relative z-0 w-3/4 h-3/4">
            <Image
              src="/product.png"
              alt="CLINI WHITE Product"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* Offer Badge */}
          <div className="absolute top-6 left-6 bg-white text-[#003c8f] font-black px-4 py-2 rounded-full text-sm uppercase tracking-wider shadow-lg transform -rotate-6">
            LIMITED OFFER
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center">
          <div className="mb-6">
            <h3 className="text-[#003c8f] font-black text-xl tracking-tighter mb-2">CLINI WHITE</h3>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-none mb-4 tracking-tighter">
              BUY 1 GET 1 <br />
              <span className="text-[#003c8f]">FOR FREE</span>
            </h2>
            <p className="text-gray-600 font-medium">
              Join our list and we'll send your exclusive <br className="hidden md:block" /> limited offer straight to your email.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
              </div>
              <h4 className="font-black text-lg uppercase tracking-tight">Offer Sent!</h4>
              <p className="text-sm font-medium">Check your inbox for the discount code.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#003c8f] focus:bg-white outline-none transition-all text-gray-900 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#003c8f] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-900/20 hover:bg-[#002b66] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  'CLAIM OFFER'
                )}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors pt-2"
              >
                NO THANKS, I'LL PAY FULL PRICE
              </button>
            </form>
          )}

          <p className="mt-8 text-[10px] text-gray-400 font-medium leading-relaxed">
            By continuing, you agree to receive marketing emails from CLINI WHITE. <br />
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
