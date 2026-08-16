import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import FAQ from '@/app/components/FAQ';
import Link from 'next/link';
import { Mail, MapPin, Clock, Package, HelpCircle, RotateCcw } from 'lucide-react';
import ContactForm from './ContactForm';
import { CONTACT, COMPANY, SOCIALS, SITE_URL } from '@/lib/siteConfig';

export const metadata = {
  title: 'Contact Us',
  alternates: { canonical: '/contact' },
  description:
    'Get in touch with the CLINI WHITE team. Questions about your order, our PAP whitening products, or partnerships — we reply within 24 hours.',
};

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: 'Email us',
    lines: [CONTACT.email],
    sub: 'For orders, products & everything else',
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: Clock,
    title: 'Response time',
    lines: [CONTACT.responseTime],
    sub: CONTACT.supportHours,
  },
  {
    icon: MapPin,
    title: 'Our office',
    lines: [COMPANY.displayName, ...COMPANY.addressLines],
    sub: 'Registered in the United Kingdom',
  },
];

const QUICK_HELP = [
  {
    icon: Package,
    title: 'TRACK MY ORDER',
    desc: 'Already ordered? Check your inbox for your shipping confirmation and tracking link.',
    href: '/account',
    cta: 'Go to my account',
  },
  {
    icon: HelpCircle,
    title: 'PRODUCT QUESTIONS',
    desc: 'How to use the strips, results timeline, sensitivity — most answers are in our FAQ below.',
    href: '#faq-heading',
    cta: 'Read the FAQ',
  },
  {
    icon: RotateCcw,
    title: 'RETURNS & REFUNDS',
    desc: 'Every order is covered by our 30-day money-back guarantee. No questions, no hassle.',
    href: '/policies/refund-policy',
    cta: 'See our guarantee',
  },
];

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact CLINI WHITE',
  url: `${SITE_URL}/contact`,
  mainEntity: {
    '@type': 'Organization',
    name: 'CLINI WHITE',
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      addressLocality: COMPANY.city,
      postalCode: COMPANY.postalCode,
      addressCountry: COMPANY.country,
    },
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Header />
      <main id="main-content">
        {/* Contact info + form */}
        <section className="py-12 sm:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Info column */}
            <div className="lg:col-span-2">
              <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-6">
                CONTACT DETAILS
              </p>
              <h1
                className="font-display text-3xl md:text-4xl font-extrabold text-black mb-10 leading-[1.05] tracking-tight"
              >
                TALK TO A<br />
                <span className="text-[#231b50]">REAL HUMAN</span>
              </h1>

              <div className="space-y-4">
                {CONTACT_CARDS.map(({ icon: Icon, title, lines, sub, href }) => {
                  const card = (
                    <div className="flex items-start gap-5 bg-[#F5F3FF] border border-violet-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-[#231b50] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-[#231b50] uppercase tracking-widest mb-1.5">
                          {title}
                        </h3>
                        {lines.map((line) => (
                          <p key={line} className="text-sm font-bold text-gray-900 leading-relaxed">
                            {line}
                          </p>
                        ))}
                        <p className="text-[11px] text-gray-600 mt-1.5">{sub}</p>
                      </div>
                    </div>
                  );
                  return href ? (
                    <a key={title} href={href} className="block">
                      {card}
                    </a>
                  ) : (
                    <div key={title}>{card}</div>
                  );
                })}
              </div>

              {/* Socials */}
              <div className="mt-10">
                <p className="text-gray-600 text-[11px] font-black uppercase tracking-widest mb-4">
                  Or find us on social
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={SOCIALS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-11 h-11 rounded-full border-2 border-[#231b50] text-[#231b50] flex items-center justify-center hover:bg-[#231b50] hover:text-white transition-all hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href={SOCIALS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-11 h-11 rounded-full border-2 border-[#231b50] text-[#231b50] flex items-center justify-center hover:bg-[#231b50] hover:text-white transition-all hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Form column */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_60px_rgba(35,27,80,0.08)] border border-violet-50">
                <div className="mb-8">
                  <h2
                    className="font-display text-2xl font-extrabold text-black uppercase tracking-tight mb-2"
                  >
                    Send us a message
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Fill in the form and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Quick help */}
        <section className="py-12 sm:py-20 px-4 bg-[#F5F3FF]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#231b50] text-xs font-black tracking-widest uppercase mb-3">
                NEED A FASTER ANSWER?
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-extrabold text-black tracking-tight"
              >
                QUICK HELP
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {QUICK_HELP.map(({ icon: Icon, title, desc, href, cta }) => (
                <Link
                  key={title}
                  href={href}
                  className="group bg-white rounded-2xl p-8 shadow-sm border border-violet-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-full bg-[#231b50] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-black text-[#231b50] uppercase tracking-wide mb-3">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6 flex-1">{desc}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest group-hover:gap-3 group-hover:text-[#231b50] transition-all">
                    {cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
