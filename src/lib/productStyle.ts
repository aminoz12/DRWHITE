import { getProductKind, type ProductKind } from './productKind';

// Per-type copy shared by product cards and the product page, so a serum
// always reads the same everywhere.

/** One-line descriptor shown under the product name on cards. */
const TAGLINE: Record<ProductKind, string> = {
  serum: 'Instant colour-correcting serum',
  foam: 'Brightening colour-correcting foam',
  toothpaste: 'Daily purple toothpaste',
  powder: 'Colour-correcting powder',
  mouthwash: 'On-the-go rinse sachets',
  strips: '30-minute PAP strips',
  toothbrush: 'Sonic toothbrush',
  bundle: 'Complete routine set',
  other: 'Colour-correcting care',
};

/** What the product does, in plain words — used for the "Key benefits" list. */
const BENEFITS: Record<ProductKind, string[]> = {
  serum: [
    'Instantly neutralises yellow tones',
    'Use on its own or on top of your toothpaste',
    'Peroxide-free formula',
  ],
  foam: [
    'Neutralises yellow tones as you brush',
    'Ideal after coffee, tea or red wine',
    'Peroxide-free formula',
  ],
  toothpaste: [
    'Purple pigments counter yellow tones',
    'Use in place of, or after, your usual toothpaste',
    'Peroxide-free formula',
  ],
  powder: [
    'Helps lift surface stains',
    'Colour-correcting purple pigments',
    'Peroxide-free formula',
  ],
  mouthwash: [
    'One sachet per use — easy on the go',
    'Colour-correcting rinse after brushing',
    'Peroxide-free formula',
  ],
  strips: [
    'PAP whitening — peroxide-free',
    '30 minutes a day for 14 days',
    'Targets surface stains',
  ],
  toothbrush: [
    'Multiple smart brushing modes',
    'Built-in 2-minute timer',
    'Pairs with the V34 range',
  ],
  bundle: [
    'A complete colour-correcting routine',
    'Free express shipping',
    'Every item includes its own directions',
  ],
  other: [
    'Colour-correcting V34 care',
    'Designed for an everyday routine',
    'Peroxide-free formula',
  ],
};

/**
 * Card copy: a benefit-led headline, one or two plain sentences, and the short
 * name used on the card's "Shop …" button. Everything restates what the
 * product page already says (directions, benefits) — no new claims.
 */
const CARD: Record<ProductKind, { headline: string; description: string; name: string }> = {
  serum: {
    headline: 'Your instant brightener',
    description: 'Purple pigments cancel yellow tones as you brush. Use it alone or over your toothpaste.',
    name: 'Serum',
  },
  foam: {
    headline: 'Your after-coffee fix',
    description: 'A brightening foam that neutralises yellow tones in a quick brush. Ideal after coffee, tea or wine.',
    name: 'Foam',
  },
  toothpaste: {
    headline: 'Your everyday upgrade',
    description: 'Swap it in for your usual paste: purple pigments counter yellow tones every time you brush.',
    name: 'Toothpaste',
  },
  powder: {
    headline: 'Your stain lifter',
    description: 'A colour-correcting powder that helps lift surface stains alongside your daily routine.',
    name: 'Powder',
  },
  mouthwash: {
    headline: 'Your on-the-go boost',
    description: 'Single sachets of colour-correcting rinse. One after brushing, wherever you are.',
    name: 'Mouthwash',
  },
  strips: {
    headline: 'Your 14-day reset',
    description: 'Peroxide-free PAP strips: 30 minutes a day for 14 days, while you get on with yours.',
    name: 'Strips',
  },
  toothbrush: {
    headline: 'Your smarter brush',
    description: 'A sonic toothbrush with smart brushing modes and a built-in 2-minute timer.',
    name: 'Toothbrush',
  },
  bundle: {
    headline: 'Your complete routine',
    description: 'The V34 routine in one box, priced below buying each item, with free express shipping.',
    name: 'the Set',
  },
  other: {
    headline: 'Your colour-correcting care',
    description: 'V34 colour-correcting care, made for an everyday routine.',
    name: 'Now',
  },
};

// Three sets sit side by side, so each gets its own line from its title.
const SET_CARD: { match: RegExp; headline: string; description: string; name: string }[] = [
  {
    match: /ultimate|7-in-1/i,
    headline: 'Everything, in one box',
    description: 'The complete 7-in-1 V34 routine, shipped free with express delivery.',
    name: 'Ultimate Set',
  },
  {
    match: /essential|4-step/i,
    headline: 'Your 4-step starter',
    description: 'Four steps to a brighter-looking smile in one box, shipped free.',
    name: 'Essential Kit',
  },
  {
    match: /advanced/i,
    headline: 'Your next-level routine',
    description: 'A fuller V34 routine for daily care, shipped free with express delivery.',
    name: 'Advanced Set',
  },
];

export function productCardCopy(title: string): { headline: string; description: string; name: string } {
  const kind = getProductKind(title);
  if (kind === 'bundle') {
    const set = SET_CARD.find((s) => s.match.test(title));
    if (set) return set;
  }
  return CARD[kind];
}

export function productTagline(title: string): string {
  return TAGLINE[getProductKind(title)];
}

export function productBenefits(title: string): string[] {
  return BENEFITS[getProductKind(title)];
}
