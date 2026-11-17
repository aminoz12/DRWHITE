import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

// The root layout's title template appends "| CLINIWHITE" itself.
export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-14 sm:py-24">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-display font-wide text-7xl md:text-8xl font-extrabold text-grape leading-none mb-6">
            404
          </p>
          <h1 className="font-display font-wide text-2xl md:text-3xl font-extrabold text-grape uppercase tracking-tight mb-4">
            This page has gone missing
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Your brighter
            smile, however, is right where you left it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="btn-primary"
            >
              Shop the range
            </Link>
            <Link
              href="/"
              className="btn-secondary"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
