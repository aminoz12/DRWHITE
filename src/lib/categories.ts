import type { ProductKind } from './productKind';

// Shopping by goal, not by SKU. One list feeds the shop filters, the header's
// Shop menu and /shop?category=… deep links, so a category always means the
// same products everywhere.
export interface ShopCategory {
  id: string;
  label: string;
  /** One line for the Shop menu. */
  blurb: string;
  /** Real photography for the Shop menu tile. */
  image: string;
  kinds: ProductKind[];
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: 'instant',
    label: 'Instant brightening',
    blurb: 'Serum and foam that colour-correct as you brush',
    image: '/images/reviews/7.webp',
    kinds: ['serum', 'foam'],
  },
  {
    id: 'everyday',
    label: 'Everyday care',
    blurb: 'Toothpaste, powder, mouthwash and brush',
    image: '/images/reviews/15.webp',
    kinds: ['toothpaste', 'powder', 'mouthwash', 'toothbrush'],
  },
  {
    id: 'strips',
    label: 'Whitening strips',
    blurb: 'Peroxide-free PAP strips, 30 minutes a day',
    image: '/images/reviews/2.webp',
    kinds: ['strips'],
  },
  {
    id: 'sets',
    label: 'Sets',
    blurb: 'The whole routine in one box, shipped free',
    image: '/images/reviews/5.webp',
    kinds: ['bundle'],
  },
];

export function getCategory(id: string | undefined): ShopCategory | undefined {
  return SHOP_CATEGORIES.find((c) => c.id === id);
}
