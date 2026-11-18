import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Eyebrow } from '@/app/components/SectionHeading';

// The root layout's title template appends "| CLINIWHITE" itself.
export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

const WAYS_ON = [
  { label: 'Shop all products', note: 'The full V34 range', href: '/shop' },
  { label: 'Bundles & sets', note: 'The whole routine, shipped free', href: '/bundles' },
  { label: 'Real results', note: 'Customer before & afters', href: '/results' },
  { label: 'Contact us', note: 'A real human replies', href: '/contact' },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main-content" className="flex-1 py-14 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <Eyebrow>Error 404</Eyebrow>
            <h1 className="type-display mt-4 text-balance text-grape">
              This page has <span className="text-violet">gone missing</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
              The page you&apos;re looking for doesn&apos;t exist or has moved. Your brighter smile,
              however, is right where you left it.
            </p>
            <Link href="/" className="btn-secondary mt-8">
              Back to home
            </Link>
          </div>

          <nav aria-label="Popular pages">
            <ul className="border-t-2 border-grape">
              {WAYS_ON.map((w) => (
                <li key={w.href} className="border-b border-gray-200">
                  <Link href={w.href} className="group flex items-center justify-between gap-6 py-5">
                    <span>
                      <span className="block font-display font-wide text-lg font-extrabold uppercase tracking-[-0.01em] text-grape transition-colors group-hover:text-violet">
                        {w.label}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">{w.note}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-grape transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
