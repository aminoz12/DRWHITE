import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import FAQ from '@/app/components/FAQ';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ContactForm from './ContactForm';
import CopyEmail from './CopyEmail';
import SocialIcon, { socialLabel } from '@/app/components/SocialIcon';
import { CONTACT, COMPANY, SOCIALS, FOLLOW_US, SITE_URL } from '@/lib/siteConfig';

export const metadata = {
  title: 'Contact Us',
  alternates: { canonical: '/contact' },
  description:
    'Get in touch with the CLINIWHITE team. Questions about your order, our PAP whitening products, or partnerships — we reply within 24 hours.',
};

const QUICK_HELP = [
  {
    title: 'Track my order',
    desc: 'Already ordered? Your shipping confirmation email has the tracking link, or check your account.',
    href: '/account',
  },
  {
    title: 'Product questions',
    desc: 'How to use the strips, results timeline, sensitivity: most answers are in the FAQ below.',
    href: '#faq-heading',
  },
  {
    title: 'Returns & refunds',
    desc: "Every order has a 30-day money-back guarantee. Contact us within 30 days of delivery and we'll guide you through it.",
    href: '/policies/refund-policy',
  },
];

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact CLINIWHITE',
  url: `${SITE_URL}/contact`,
  mainEntity: {
    '@type': 'Organization',
    name: 'CLINIWHITE',
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
  const details = [
    { label: 'Email', value: <CopyEmail email={CONTACT.email} /> },
    { label: 'Reply time', value: CONTACT.responseTime },
    { label: 'Hours', value: CONTACT.supportHours },
    {
      label: 'Office',
      value: (
        <>
          {COMPANY.displayName}
          {COMPANY.addressLines.map((line) => (
            <span key={line} className="block font-normal text-gray-600">
              {line}
            </span>
          ))}
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <Header />
      <main id="main-content">
        <section className="pb-16 pt-10 sm:pb-24 sm:pt-14">
          <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:px-8">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Contact"
                className="mb-10"
                title={
                  <>
                    Talk to a
                    <br />
                    <Marker>real human</Marker>
                  </>
                }
                description="Questions about an order, a product or a partnership? Write to us and a member of the team replies."
              />

              <dl className="border-t border-gray-200">
                {details.map((d) => (
                  <div key={d.label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-gray-200 py-4 text-base">
                    <dt className="type-eyebrow pt-1 text-gray-500">{d.label}</dt>
                    <dd className="min-w-0 font-semibold text-grape">{d.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex items-center gap-3">
                <span className="type-eyebrow mr-2 text-gray-500">Follow us</span>
                {FOLLOW_US.map((name) => (
                  <a
                    key={name}
                    href={SOCIALS[name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabel(name)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-grape transition-colors hover:border-grape hover:bg-grape hover:text-white"
                  >
                    <SocialIcon name={name} className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-gray-200 p-6 sm:p-10">
              <h2 className="font-display font-wide text-2xl font-extrabold uppercase tracking-tight text-grape">Send us a message</h2>
              <p className="mb-8 mt-2 text-base text-gray-600">We&apos;ll reply to the email address you give us.</p>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Quick help */}
        <section aria-labelledby="help-heading" className="bg-porcelain py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="help-heading"
              eyebrow="Need a faster answer?"
              title={
                <>
                  Quick <Marker>help</Marker>
                </>
              }
            />
            <ul className="border-t-2 border-grape">
              {QUICK_HELP.map(({ title, desc, href }, i) => (
                <li key={title} data-reveal="" style={{ '--reveal-i': i } as React.CSSProperties} className="border-b border-gray-200">
                  <Link
                    href={href}
                    className="group grid items-center gap-2 py-6 sm:grid-cols-[1fr_1.4fr_auto] sm:gap-10 sm:py-8"
                  >
                    <span className="font-display font-wide text-xl font-extrabold uppercase tracking-[-0.01em] text-grape transition-colors group-hover:text-violet sm:text-2xl">
                      {title}
                    </span>
                    <span className="text-base leading-relaxed text-gray-600">{desc}</span>
                    <span className="hidden h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-grape transition-all group-hover:border-grape group-hover:bg-grape group-hover:text-white sm:flex">
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
