import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Page Not Found | CLINI WHITE',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-display text-7xl md:text-8xl font-extrabold text-[#231b50] leading-none mb-6">
            404
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-black uppercase tracking-tight mb-4">
            This page has gone missing
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Your brighter
            smile, however, is right where you left it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-[#231b50] text-white text-xs font-black tracking-widest uppercase rounded-full hover:bg-[#1a1440] transition-all hover:scale-105 shadow-xl shadow-violet-200"
            >
              Shop the range
            </Link>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-[#231b50] text-[#231b50] text-xs font-black tracking-widest uppercase rounded-full hover:bg-violet-50 transition-all hover:scale-105"
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
