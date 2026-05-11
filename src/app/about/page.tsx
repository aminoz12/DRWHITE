import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { ShieldCheck, Award, Leaf, Microscope, Heart, Star } from 'lucide-react';

export const metadata = {
  title: 'About Us | CLINI WHITE — Professional Teeth Whitening',
  description: "CLINI WHITE is the UK's leading professional at-home teeth whitening brand. Learn about our mission, science, and commitment to a brighter, healthier smile.",
};

const CERTIFICATIONS = [
  { icon: ShieldCheck, label: 'ISO 22716 Certified', sub: 'Cosmetic GMP' },
  { icon: Leaf, label: '100% PAP Formula', sub: 'Peroxide-Free' },
  { icon: Microscope, label: 'Clinically Tested', sub: 'Dentist Approved' },
  { icon: Award, label: 'CE Marked', sub: 'EU Safety Compliant' },
];

const VALUES = [
  {
    emoji: '🦷',
    title: 'SCIENCE-BACKED',
    desc: 'Our PAP formula is the result of years of cosmetic research. We use only ingredients proven to whiten safely and effectively.',
  },
  {
    emoji: '💚',
    title: 'SENSITIVITY-FREE',
    desc: 'Traditional peroxide whitening causes pain. We replaced it entirely. CLINI WHITE works just as well — with zero sensitivity.',
  },
  {
    emoji: '🌍',
    title: 'SUSTAINABLY MADE',
    desc: 'Recyclable packaging, cruelty-free formulas, and carbon-neutral shipping. Whitening your smile shouldn\'t cost the planet.',
  },
  {
    emoji: '🏆',
    title: 'RESULTS GUARANTEED',
    desc: 'We\'re so confident in CLINI WHITE that every order comes with a 30-day money-back guarantee. No questions. No hassle.',
  },
];

const TIMELINE = [
  { year: '2020', event: 'First PAP whitening strip formula launched. 1,000 units sold in the first month.' },
  { year: '2021', event: 'Featured on BBC, Cosmopolitan, and Vogue. Over 50,000 customers served.' },
  { year: '2022', event: 'Launched the full oral care range. Awarded "Best Whitening Brand" by Beauty Bible.' },
  { year: '2023', event: 'Expanded to 12 countries. TikTok viral moment — 10M+ views. 5,000+ reviews.' },
  { year: '2024', event: 'Over 5,600 verified reviews. Proudly the UK\'s #1 at-home whitening brand.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-[#0047AB] py-24 px-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="inline-block bg-white/20 text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-full mb-6 uppercase">
              Our Story
            </span>
            <h1
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-none"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}
            >
              WE BELIEVE EVERYONE DESERVES A<br />
              <span className="text-[#A5C8FF]">BRILLIANT SMILE</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              CLINI WHITE was built on a simple belief: professional-grade teeth whitening shouldn&apos;t require a dentist visit, cause pain, or cost a fortune.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:col-span-1">
              <p className="text-[#0047AB] text-xs font-black tracking-[0.3em] uppercase mb-6">
                OUR MISSION
              </p>
              <h2
                className="text-5xl md:text-6xl font-black text-black mb-14 leading-[1.1]"
                style={{ fontFamily: 'var(--font-geist-sans), system-ui', letterSpacing: '-0.05em' }}
              >
                PROFESSIONAL RESULTS,<br />
                WITHOUT THE PAIN
              </h2>
              
              <div className="space-y-14 relative pl-4">
                <div className="relative">
                  <span className="absolute -left-4 top-0 w-1 h-full bg-blue-50" />
                  <p className="text-gray-700 text-2xl font-light leading-relaxed pl-8">
                    Traditional whitening treatments use hydrogen peroxide — effective, but notorious for causing tooth sensitivity and gum irritation. We spent 3 years developing a PAP-based alternative that delivers the same dramatic whitening results, <span className="font-bold text-[#0047AB]">completely sensitivity-free.</span>
                  </p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-4 top-0 w-1 h-full bg-blue-50" />
                  <p className="text-gray-700 text-2xl font-light leading-relaxed pl-8">
                    Today, CLINI WHITE is trusted by over 5,600 customers across the UK, Europe, and beyond. We&apos;re proud to be the whitening brand that people actually stick with — <span className="font-bold text-[#0047AB]">because it works, and because it doesn&apos;t hurt.</span>
                  </p>
                </div>
              </div>

              <div className="mt-16">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-[#0047AB] text-white text-sm font-black tracking-widest rounded-full hover:bg-[#003a8c] transition-all hover:scale-105 shadow-2xl shadow-blue-200"
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
                { value: '5,642+', label: 'Happy Customers', color: '#EBF2FA' },
                { value: '4.8★', label: 'Average Rating', color: '#EBF2FA' },
                { value: '10 shades', label: 'Max Whitening', color: '#0047AB', light: true },
                { value: '30 min', label: 'Daily Routine', color: '#EBF2FA' },
                { value: '0%', label: 'Peroxide', color: '#EBF2FA' },
                { value: '30-day', label: 'Money-Back', color: '#0047AB', light: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square"
                  style={{ backgroundColor: stat.color }}
                >
                  <span
                    className="text-2xl font-black mb-1"
                    style={{ color: stat.light ? 'white' : '#0047AB' }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{ color: stat.light ? 'rgba(255,255,255,0.7)' : '#64748b' }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 bg-[#EBF2FA]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#0047AB] text-xs font-black tracking-widest uppercase mb-3">
                WHAT WE STAND FOR
              </p>
              <h2
                className="text-4xl md:text-5xl font-black text-black"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}
              >
                OUR VALUES
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val) => (
                <div
                  key={val.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-4xl mb-4 block">{val.emoji}</span>
                  <h3
                    className="text-sm font-black text-[#0047AB] uppercase tracking-wide mb-3"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {val.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[#0047AB] text-xs font-black tracking-widest uppercase mb-10">
              TRUSTED &amp; CERTIFIED
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {CERTIFICATIONS.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#EBF2FA] border border-blue-100"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0047AB] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 text-center">{label}</p>
                    <p className="text-[10px] text-gray-500 text-center mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 px-4 bg-white relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0047AB_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-24">
              <p className="text-[#0047AB] text-xs font-black tracking-[0.3em] uppercase mb-6">
                OUR JOURNEY
              </p>
              <h2
                className="text-5xl md:text-7xl font-black text-black mb-10 leading-[1.05]"
                style={{ fontFamily: 'var(--font-geist-sans), system-ui', letterSpacing: '-0.05em' }}
              >
                MAKING HISTORY<br />
                <span className="text-[#0047AB]">SINCE DAY ONE</span>
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
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0047AB] via-blue-100 to-transparent md:-translate-x-1/2" />
              
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
                      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_40px_rgba(0,71,171,0.06)] border border-blue-50 relative group hover:shadow-[0_40px_80px_rgba(0,71,171,0.12)] hover:border-blue-200 transition-all duration-700 hover:-translate-y-1 md:hover:-translate-y-2">
                        <div className="relative z-10">
                          <h3 
                            className="text-2xl md:text-3xl font-black text-[#0047AB] mb-2 md:mb-4 tracking-tighter"
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
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#0047AB] ring-[8px] md:ring-[12px] ring-blue-50 shadow-xl shadow-blue-100 group-hover:scale-125 transition-transform duration-500" />
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
        <section className="py-24 px-4 bg-white text-center border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-[#0047AB] fill-current" />
              ))}
            </div>
            <p
              className="text-4xl md:text-5xl font-black text-black mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-geist-sans), system-ui', letterSpacing: '-0.04em' }}
            >
              &ldquo;CLINI WHITE CHANGED MY SMILE AND MY CONFIDENCE&rdquo;
            </p>
            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-12">— Sarah M., Verified Customer</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/shop"
                className="px-10 py-5 bg-[#0047AB] text-white font-black text-sm tracking-widest rounded-full hover:bg-[#003a8c] transition-all hover:scale-105 shadow-2xl shadow-blue-100"
                style={{ fontFamily: 'var(--font-geist-sans), system-ui' }}
              >
                SHOP NOW
              </Link>
              <Link
                href="/results"
                className="px-10 py-5 border-2 border-[#0047AB] text-[#0047AB] font-black text-sm tracking-widest rounded-full hover:bg-blue-50 transition-all hover:scale-105"
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
