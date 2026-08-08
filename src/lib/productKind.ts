// Product-type detection shared by the buy box and the FAQ, so a serum is
// never given strip instructions and a mouthwash is never counted in tubes.

export type ProductKind =
  | 'strips'
  | 'toothpaste'
  | 'serum'
  | 'foam'
  | 'powder'
  | 'mouthwash'
  | 'toothbrush'
  | 'bundle'
  | 'other';

export function getProductKind(title: string): ProductKind {
  const t = title.toLowerCase();
  if (t.includes('bundle') || t.includes('kit') || t.includes('7-in-1')) return 'bundle';
  if (t.includes('strip')) return 'strips';
  if (t.includes('toothpaste')) return 'toothpaste';
  if (t.includes('serum')) return 'serum';
  if (t.includes('foam')) return 'foam';
  if (t.includes('powder')) return 'powder';
  if (t.includes('mouthwash')) return 'mouthwash';
  if (t.includes('toothbrush')) return 'toothbrush';
  return 'other';
}

/** Answer to the "How do I use it?" FAQ, written per product type. */
export const USAGE_ANSWER: Record<ProductKind, string> = {
  strips:
    'Peel the strip from its backing, press it onto clean, dry upper and lower teeth, and leave it for 30 minutes. Peel it off and rinse. Use once daily for best results.',
  toothpaste:
    'Squeeze a pea-sized amount onto a dry toothbrush and brush gently for 2-3 minutes so the V34 pigments can neutralise yellow tones, then rinse thoroughly. Use once or twice daily.',
  serum:
    'Add a thin layer of serum to your toothbrush, either on its own or on top of your toothpaste, brush gently for 2-3 minutes, then rinse thoroughly. Use daily for an instant brightening boost.',
  foam:
    'Pump the foam directly onto your toothbrush, brush for 1-2 minutes to let the V34 formula work, then spit and rinse. Use daily — ideal after coffee, tea or red wine.',
  powder:
    'Dip a clean, damp toothbrush into the powder, brush gently for 2-3 minutes to lift surface stains, then rinse thoroughly. Use once daily alongside your regular routine.',
  mouthwash:
    'Empty one sachet into a glass of water, swish for 30-60 seconds so it coats every surface, then spit out — do not swallow. Use once daily after brushing.',
  toothbrush:
    'Charge the toothbrush fully before first use, then brush for the full 2-minute timer using your preferred mode. Rinse the head afterwards and replace it every 3 months.',
  bundle:
    'Start with the core whitening product in your set, then layer in the colour-correcting products as part of your daily routine. Each item includes its own directions — use as directed and stay consistent for 7-14 days.',
  other:
    'Use as directed on the packaging, once daily for best results. Every CLINI WHITE product is designed to work alongside the rest of the V34 range.',
};
