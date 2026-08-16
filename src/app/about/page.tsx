import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { ShieldCheck, Award, Leaf, Microscope, Heart, Star, Users, Sparkles, Clock, BadgeCheck } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';

export const metadata = {
  title: 'About Us — Professional Teeth Whitening',
  alternates: { canonical: '/about' },
  description: "CLINI WHITE is the UK's leading professional at-home teeth whitening brand. Learn about our mission, science, and commitment to a brighter, healthier smile.",
};

const CERTIFICATIONS = [
  { icon: ShieldCheck, label: 'ISO 22716 Certified', sub: 'Cosmetic GMP' },
  { icon: Leaf, label: '100% PAP Formula', sub: 'Peroxide-Free' },
  { icon: Microscope, label: 'Clinically Tested', sub: 'Dentist Approved' },
  { icon: Award, label: 'CE Marked', sub: 'EU Safety Compliant' },
];

const TIMELINE = [
  { year: '2020', event: 'First PAP whitening strip formula launched. 1,000 units sold in the first month.' },
  { year: '2021', event: 'Featured on BBC, Cosmopolitan, and Vogue. Community grows past 2,000 happy customers.' },
  { year: '2022', event: 'Launched the full oral care range. Awarded "Best Whitening Brand" by Beauty Bible.' },
  { year: '2023', event: 'Expanded to 12 countries. TikTok viral moment — 10M+ views. 3,000+ reviews.' },
  { year: '2024', event: `Over ${STATS.reviewsLabel} verified reviews. Proudly the UK's #1 at-home whitening brand.` },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        {/* Mission */}
        <section className="py-12 sm:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:col-span-1">
              <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-6">
                OUR MISSION
              </p>
              <h1
                className="font-display text-3xl md:text-4xl font-extrabold text-black mb-8 leading-[1.1] tracking-tight"
              >
                PROFESSIONAL RESULTS,<br />
                WITHOUT THE PAIN
              </h1>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#F5F3FF] border border-violet-100 flex items-center justify-center">
                    <Microscope className="w-5 h-5 text-[#231b50]" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-[#231b50] uppercase tracking-wide mb-2">
                      3 years of PAP research
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Traditional whitening treatments use hydrogen peroxide — effective, but notorious for causing tooth sensitivity and gum irritation. We spent 3 years developing a PAP-based alternative that delivers the same dramatic whitening results, <span className="font-bold text-[#231b50]">completely sensitivity-free.</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#F5F3FF] border border-violet-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#231b50]" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-[#231b50] uppercase tracking-wide mb-2">
                      Trusted by {STATS.customers} customers
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Today, CLINI WHITE is trusted by {STATS.customers} customers across the UK, Europe, and beyond. We&apos;re proud to be the whitening brand that people actually stick with — <span className="font-bold text-[#231b50]">because it works, and because it doesn&apos;t hurt.</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-[#231b50] text-white text-sm font-black tracking-widest rounded-full hover:bg-[#1a1440] transition-all hover:scale-105 shadow-2xl shadow-violet-200"
                  style={{ fontFamily: 'var(--font-geist-sans), system-ui' }}
                >
                  SHOP THE RANGE
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>

            {/* Stats card grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: STATS.customers, label: 'Happy Customers' },
                { icon: Star, value: `${STATS.ratingLabel}★`, label: 'Average Rating' },
                { icon: Sparkles, value: '10 shades', label: 'Max Whitening', dark: true },
                { icon: Clock, value: '30 min', label: 'Daily Routine' },
                { icon: Leaf, value: '0%', label: 'Peroxide' },
                { icon: BadgeCheck, value: '30-day', label: 'Money-Back', dark: true },
              ].map(({ icon: Icon, value, label, dark }) => (
                <div
                  key={label}
                  className={`flex items-center gap-4 rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    dark
                      ? 'bg-[#231b50] border-[#231b50] hover:shadow-[#231b50]/25'
                      : 'bg-[#F5F3FF] border-violet-100 hover:shadow-violet-100'
                  }`}
                >
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${
                      dark ? 'bg-white/10' : 'bg-white shadow-sm'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${dark ? 'text-[#C4B5FD]' : 'text-[#231b50]'}`} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`font-display text-xl md:text-2xl font-extrabold leading-none ${
                        dark ? 'text-white' : 'text-[#231b50]'
                      }`}
                    >
                      {value}
                    </p>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                        dark ? 'text-white/60' : 'text-gray-600'
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-10 sm:py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[#231b50] text-xs font-black tracking-widest uppercase mb-10">
              TRUSTED &amp; CERTIFIED
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {CERTIFICATIONS.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#F5F3FF] border border-violet-100"
                >
                  <div className="w-12 h-12 rounded-full bg-[#231b50] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 text-center">{label}</p>
                    <p className="text-[10px] text-gray-600 text-center mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-14 sm:py-24 px-4 bg-white relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#231b50_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-24">
              <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-6">
                OUR JOURNEY
              </p>
              <h2
                className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold text-black mb-10 leading-[1.05] tracking-tight"
              >
                MAKING HISTORY<br />
                <span className="text-[#231b50]">SINCE DAY ONE</span>
              </h2>
              <div className="max-w-2xl mx-auto">
                <p 
                  className="text-2xl md:text-3xl font-black text-gray-900 leading-tight italic"
                  style={{ fontFamily: 'var(--font-geist-sans), system-ui', letterSpacing: '-0.02em' }}
                >
                  "CLINI WHITE is founded by a team of cosmetic scientists and dental professionals."
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Vertical line with gradient */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#231b50] via-violet-100 to-transparent md:-translate-x-1/2" />
              
              <div className="space-y-12 md:space-y-20">
                {TIMELINE.map((item, index) => (
                  <div 
                    key={item.year} 
                    className={`flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center relative ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Content Card */}
                    <div className={`flex-1 w-full pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_40px_rgba(35,27,80,0.06)] border border-violet-50 relative group hover:shadow-[0_40px_80px_rgba(35,27,80,0.12)] hover:border-violet-200 transition-all duration-700 hover:-translate-y-1 md:hover:-translate-y-2">
                        <div className="relative z-10">
                          <h3 
                            className="text-2xl md:text-3xl font-black text-[#231b50] mb-2 md:mb-4 tracking-tighter"
                            style={{ fontFamily: 'var(--font-geist-sans), system-ui' }}
                          >
                            {item.year}
                          </h3>
                          <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-bold">
                            {item.event}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="absolute left-4 md:relative md:left-0 md:mx-auto z-10 flex-shrink-0 -translate-x-1/2 md:translate-x-0">
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#231b50] ring-[8px] md:ring-[12px] ring-violet-50 shadow-xl shadow-violet-100 group-hover:scale-125 transition-transform duration-500" />
                    </div>

                    {/* Spacer for balancing the grid */}
                    <div className="hidden md:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social proof + CTA */}
        <section className="py-14 sm:py-24 px-4 bg-white text-center border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-[#231b50] fill-current" />
              ))}
            </div>
            <p
              className="font-display text-3xl md:text-4xl font-extrabold text-black mb-6 leading-tight tracking-tight"
            >
              &ldquo;CLINI WHITE CHANGED MY SMILE AND MY CONFIDENCE&rdquo;
            </p>
            <p className="text-gray-600 text-sm font-bold tracking-widest uppercase mb-12">— Sarah M., Verified Customer</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/shop"
                className="px-10 py-5 bg-[#231b50] text-white font-black text-sm tracking-widest rounded-full hover:bg-[#1a1440] transition-all hover:scale-105 shadow-2xl shadow-violet-100"
                style={{ fontFamily: 'var(--font-geist-sans), system-ui' }}
              >
                SHOP NOW
              </Link>
              <Link
                href="/results"
                className="px-10 py-5 border-2 border-[#231b50] text-[#231b50] font-black text-sm tracking-widest rounded-full hover:bg-violet-50 transition-all hover:scale-105"
                style={{ fontFamily: 'var(--font-geist-sans), system-ui' }}
              >
                SEE REAL RESULTS
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
