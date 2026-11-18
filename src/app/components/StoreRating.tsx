import { Star } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';

// The store-wide customer rating as five boxed stars, the last one filled to
// the decimal (4.8 → 80%). It is the brand's rating, not one product's, so
// next to a product it must be labelled as such ("Store rating").
//
// Deliberately CLINIWHITE violet, not Trustpilot green: the figure isn't a
// Trustpilot score yet. Once the account is live, <TrustpilotWidget> shows the
// official stars beside it.
export default function StoreRating({
  size = 'sm',
  className = '',
  children,
}: {
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  /** Text after the stars, e.g. "4.8 · Store rating". */
  children?: React.ReactNode;
}) {
  const box = { xs: 'h-[13px] w-[13px] rounded-[2px]', sm: 'h-4 w-4 rounded-[3px]', md: 'h-[22px] w-[22px] rounded-[4px]' }[size];
  const icon = { xs: 'h-2 w-2', sm: 'h-2.5 w-2.5', md: 'h-3.5 w-3.5' }[size];

  return (
    <span className={`inline-flex items-center ${size === 'xs' ? 'gap-1.5' : 'gap-2'} ${className}`}>
      <span className={`flex ${size === 'xs' ? 'gap-0.5' : 'gap-[3px]'}`} role="img" aria-label={`Rated ${STATS.ratingLabel} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, STATS.rating - i));
          return (
            <span key={i} className={`relative flex items-center justify-center overflow-hidden bg-gray-300 ${box}`}>
              <span className="absolute inset-y-0 left-0 bg-violet" style={{ width: `${fill * 100}%` }} />
              <Star className={`relative fill-white text-white ${icon}`} strokeWidth={0} />
            </span>
          );
        })}
      </span>
      {children}
    </span>
  );
}
