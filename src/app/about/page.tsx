import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import Link from 'next/link';
import { Leaf, Microscope, Heart, Star, Users, Globe2, Clock, BadgeCheck } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';

export const metadata = {
  title: 'About Us — Professional Teeth Whitening',
  alternates: { canonical: '/about' },
  description: "CLINIWHITE makes peroxide-free, at-home teeth whitening and colour-correcting oral care. Learn about our mission and our approach to a brighter-looking smile.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        {/* Mission */}
        <section className="py-12 sm:py-20 px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:col-span-1">
              <SectionHeading
                as="h1"
                align="left"
                eyebrow="Our mission"
                className="mb-8"
                title={
                  <>
                    Professional results,
                    <br />
                    <Marker>without the pain</Marker>
                  </>
                }
              />

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#F5F3FF] border border-violet-100 flex items-center justify-center">
                    <Microscope className="w-5 h-5 text-[#231b50]" />
                  </div>
                  <div>
                    <h3 className="font-display font-wide text-sm font-extrabold text-grape uppercase tracking-wide mb-2">
                      Peroxide-free by design
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Traditional whitening treatments rely on hydrogen peroxide — effective, but known for leaving teeth feeling sensitive. Our range is built on peroxide-free formulas instead: PAP whitening and V34 colour-correcting care, <span className="font-bold text-[#231b50]">designed to be gentle enough for every day.</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#F5F3FF] border border-violet-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#231b50]" />
                  </div>
                  <div>
                    <h3 className="font-display font-wide text-sm font-extrabold text-grape uppercase tracking-wide mb-2">
                      Trusted by {STATS.customers} customers
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Today, CLINIWHITE is trusted by {STATS.customers} customers across the UK, Europe, and beyond. We&apos;re proud to be the whitening brand that people actually stick with — <span className="font-bold text-[#231b50]">because it fits easily into everyday life.</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/shop"
                  className="btn-primary"
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
                { icon: Globe2, value: STATS.countries, label: 'Countries Shipped To', dark: true },
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
                      className={`font-display font-wide text-xl md:text-2xl font-extrabold leading-none ${
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

        {/* CTA */}
        <section className="py-14 sm:py-24 px-4 text-center border-t-2 border-grape/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-wide text-3xl md:text-4xl font-extrabold text-grape mb-12 leading-tight tracking-tight">
              READY FOR A BRIGHTER-LOOKING SMILE?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/shop"
                className="btn-primary"
              >
                SHOP NOW
              </Link>
              <Link
                href="/results"
                className="btn-secondary"
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
