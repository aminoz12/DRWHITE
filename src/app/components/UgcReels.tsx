import Link from 'next/link';
import LazyVideo from './LazyVideo';
import SectionHeading from './SectionHeading';
import Marker from './Marker';

// Each clip is labelled with the product actually shown in it.
const REELS = [
  { video: '/videos/video1.mp4', product: 'V34 Whitening Strips', handle: 'v34-colour-corrector-strips-12-strip' },
  { video: '/videos/video3.mp4', product: 'V34 Purple Whitening Toothpaste', handle: 'clini-white-v34-purple-whitening-toothpaste' },
  { video: '/videos/video2.mp4', product: 'Ultimate 7-in-1 Set', handle: 'cliniwhite-ultimate-v34-whitening-bundle-complete-7-in-1' },
  { video: '/videos/video4.mp4', product: 'Advanced Care Set', handle: 'clini-white-v34-whitening-bundle-advanced-care-set' },
  { video: '/videos/video5.mp4', product: 'V34 Whitening Strips', handle: 'v34-colour-corrector-strips-12-strip' },
];

export default function UgcReels() {
  return (
    <section aria-labelledby="reels-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="reels-heading"
          eyebrow="Community"
          title={
            <>
              People can&apos;t stop <Marker>sharing</Marker>
              <br />
              their smile journey
            </>
          }
        />

        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-6 sm:px-6 md:gap-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {REELS.map((reel) => (
            <li key={reel.video} className="w-[58%] shrink-0 snap-start sm:w-[36%] lg:w-auto">
              <Link
                href={`/product/${reel.handle}`}
                className="group relative block aspect-[9/16] max-h-[450px] overflow-hidden rounded-[1.25rem] bg-grape-deep"
              >
                <LazyVideo
                  src={reel.video}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-grape-deep/85 via-grape-deep/40 to-transparent px-4 pb-4 pt-16">
                  <span className="block text-[13px] font-semibold leading-tight text-white">{reel.product}</span>
                  <span className="type-eyebrow mt-1.5 block text-[10px] text-lilac transition-colors group-hover:text-white">
                    Shop now →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
