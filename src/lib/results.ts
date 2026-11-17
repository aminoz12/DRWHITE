// Customer before/after submissions — genuine, shared with permission.
// Read by the Results page gallery and the homepage "Real results" section.

export interface CustomerResult {
  id: number;
  name: string;
  product: string;
  weeks: number;
  rating: number;
  text: string;
  shade: string;
  image: string;
  tags: string[];
}

export const CUSTOMER_RESULTS: CustomerResult[] = [
  {
    id: 1,
    name: 'Ruby P.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'Incredible results in just 2 weeks. My teeth are so much brighter!',
    shade: '8 shades',
    image: '/images/teeth/4.webp',
    tags: ['No Sensitivity', 'Fast Results'],
  },
  {
    id: 2,
    name: 'James L.',
    product: 'Ultimate Bundle',
    weeks: 1,
    rating: 5,
    text: 'No pain or tingling at all. First whitening product that actually worked.',
    shade: '6 shades',
    image: '/images/teeth/6.webp',
    tags: ['No Sensitivity', 'Easy To Use'],
  },
  {
    id: 3,
    name: 'Grace F.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'Absolutely love the results. No sensitivity and great taste.',
    shade: '7 shades',
    image: '/images/teeth/8.webp',
    tags: ['No Sensitivity'],
  },
  {
    id: 4,
    name: 'Emily C.',
    product: 'Glow Bundle',
    weeks: 3,
    rating: 5,
    text: 'I drink coffee daily and still got amazing results. Strips stay on perfectly.',
    shade: '10 shades',
    image: '/images/teeth/9.webp',
    tags: ['Fast Results', 'Easy To Use'],
  },
  {
    id: 5,
    name: 'Mia T.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'TikTok made me buy it and I have zero regrets. Results exceeded my expectations.',
    shade: '9 shades',
    image: '/images/teeth/10.webp',
    tags: ['Fast Results'],
  },
  {
    id: 6,
    name: 'Liam B.',
    product: 'Ultimate Bundle',
    weeks: 4,
    rating: 5,
    text: 'The full bundle is worth every penny. Teeth feel clean and look amazing.',
    shade: '12 shades',
    image: '/images/teeth/11.webp',
    tags: ['Best Value', 'No Sensitivity'],
  },
  {
    id: 7,
    name: 'Sophie H.',
    product: 'Whitening Strips',
    weeks: 2,
    rating: 5,
    text: 'I was skeptical but these actually work. My smile is so much whiter now.',
    shade: '7 shades',
    image: '/images/teeth/12.webp',
    tags: ['Fast Results'],
  },
  {
    id: 8,
    name: 'David W.',
    product: 'Ultimate Bundle',
    weeks: 3,
    rating: 5,
    text: 'The best whitening kit I have ever used. Simple, effective, and painless.',
    shade: '11 shades',
    image: '/images/teeth/20.webp',
    tags: ['Easy To Use', 'No Sensitivity'],
  },
  {
    id: 9,
    name: 'Chloe R.',
    product: 'Glow Bundle',
    weeks: 2,
    rating: 5,
    text: 'Perfect for maintenance and getting that extra brightness for events.',
    shade: '5 shades',
    image: '/images/teeth/21.webp',
    tags: ['Fast Results'],
  },
];
