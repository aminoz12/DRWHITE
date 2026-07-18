import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import ResultsGallery from './ResultsGallery';

export const metadata = {
  title: 'Real Results | CLINI WHITE — See Before & After Transformations',
  description: 'See real customer before and after results from CLINI WHITE professional teeth whitening. Over 5,600 verified reviews and transformations.',
};

const STATS = [
  { value: '5,642+', label: 'Verified Reviews' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '94%', label: 'Would Recommend' },
  { value: '14 days', label: 'Avg. Visible Results' },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-[#7C3AED] py-12 px-4 text-center overflow-hidden">
          <Image
            src="/hero3.png"
            alt=""
            aria-hidden
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/90 via-[#7C3AED]/60 to-[#7C3AED]/90" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block bg-white/20 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full mb-4 uppercase">
              Verified Customer Photos
            </span>
            <h1
              className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4 leading-none tracking-tight"
            >
              REAL<br />
              <span className="text-[#DDD6FE]">RESULTS</span>
            </h1>
            <p className="text-white/80 text-base max-w-md mx-auto mb-8">
              No filters. No editing. Just real customers sharing their genuine CLINI WHITE transformations.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl md:text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/60 font-bold tracking-wider uppercase mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works strip */}
        <section className="bg-[#F5F3FF] py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { step: '01', title: 'DAY 1', desc: 'Apply the strips for 30 minutes while you carry on with your routine.' },
              { step: '02', title: 'WEEK 1', desc: 'Surface stains start to lift. Customers notice a visible brightening effect.' },
              { step: '03', title: 'WEEK 2+', desc: 'Full whitening results achieved. Smile up to 10 shades brighter.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <span className="text-[#7C3AED] text-xs font-black tracking-widest block mb-2">{item.step}</span>
                <h3
                  className="text-sm font-black text-black uppercase tracking-wide mb-2"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#7C3AED] text-xs font-black tracking-widest uppercase mb-3">
                UNFILTERED &amp; UNEDITED
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-extrabold text-black tracking-tight"
              >
                CUSTOMER TRANSFORMATIONS
              </h2>
            </div>
            <ResultsGallery />
          </div>
        </section>

        {/* Trustpilot-style social proof */}
        <section className="bg-[#F5F3FF] py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[#7C3AED] text-xs font-black tracking-widest uppercase mb-3">
              WHAT THEY&apos;RE SAYING
            </p>
            <h2
              className="font-display text-2xl md:text-3xl font-extrabold text-black mb-12 tracking-tight"
            >
              FEATURED REVIEWS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sarah M.',
                  verified: true,
                  rating: 5,
                  time: '2 weeks ago',
                  text: '"I\'ve tried everything. CLINI WHITE is genuinely the first whitening product that worked for me without any sensitivity. My teeth are visibly brighter after just 10 days."',
                  product: 'Whitening Strips',
                },
                {
                  name: 'James K.',
                  verified: true,
                  rating: 5,
                  time: '1 week ago',
                  text: '"Coffee drinker for 15 years. The staining was bad. After 2 weeks of CLINI WHITE strips I genuinely can\'t believe the difference. 100% recommend."',
                  product: 'Ultimate Bundle',
                },
                {
                  name: 'Priya L.',
                  verified: true,
                  rating: 5,
                  time: '3 weeks ago',
                  text: '"Super easy to use. I put them on while watching TV. No pain at all and the results are amazing. I\'ve already bought a second box and gifted one to my mum."',
                  product: 'Whitening Strips',
                },
              ].map((review) => (
                <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 text-left">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-[#7C3AED] text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">{review.text}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-900">{review.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{review.product} · {review.time}</p>
                    </div>
                    {review.verified && (
                      <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-1 rounded-full border border-green-200">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-24 px-4 text-center border-t border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-display text-3xl font-extrabold text-black mb-4 tracking-tight"
            >
              READY FOR YOUR TRANSFORMATION?
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto font-medium">
              Join over 5,600 customers who have already changed their smile. 30-day money-back guarantee.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#7C3AED] text-white font-black text-sm tracking-widest rounded-full hover:bg-[#6D28D9] transition-all shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 active:scale-95"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              SHOP NOW → START YOUR JOURNEY
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
