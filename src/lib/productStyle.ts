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

export function productTagline(title: string): string {
  return TAGLINE[getProductKind(title)];
}

export function productBenefits(title: string): string[] {
  return BENEFITS[getProductKind(title)];
}
