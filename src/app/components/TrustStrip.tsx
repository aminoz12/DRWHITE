import { Leaf, MessageCircle, Truck, Globe2 } from 'lucide-react';
import { CONTACT } from '@/lib/siteConfig';

// Four true, policy-backed reasons to buy. It sits just above the guarantee
// band, so the guarantee itself is left to the band and not repeated here.
const ITEMS = [
  { icon: Leaf, title: 'Peroxide-free', text: 'Gentle formulas for every day' },
  { icon: Truck, title: 'Free express shipping', text: 'On every bundle' },
  { icon: Globe2, title: 'Tracked worldwide', text: 'Tracking on every order' },
  { icon: MessageCircle, title: 'Real human support', text: `Replies ${CONTACT.responseTime.toLowerCase()}` },
];

export default function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="border-t border-gray-200 bg-white">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-7 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-gray-200 lg:px-8">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3 lg:justify-center lg:px-4">
            <Icon className="h-6 w-6 shrink-0 text-violet" strokeWidth={1.6} aria-hidden />
            <span className="min-w-0">
              <span className="type-eyebrow block text-grape">{title}</span>
              <span className="mt-1 block text-sm leading-snug text-gray-500">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
