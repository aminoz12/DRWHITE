// Shopify titles mix "CLINIWHITE", "CLINI WHITE" and no brand at all.
//   displayTitle(): the full name with the one official brand spelling, for
//                   page headings, metadata and structured data.
//   shortTitle():   the same without the brand prefix, for cards and the cart,
//                   where the brand is already obvious.

// Catalogue data known to be wrong. Remove an entry once the product is renamed
// in Shopify: the whitening strips pack holds 14 strips, not 12.
const FIXES: [RegExp, string][] = [[/\(12-Strip\)/i, '(14-Strip)']];

export function displayTitle(title: string): string {
  let t = title.replace(/\bclini\s+white\b/gi, 'CLINIWHITE');
  for (const [pattern, replacement] of FIXES) t = t.replace(pattern, replacement);
  return t.trim();
}

export function shortTitle(title: string): string {
  return displayTitle(title).replace(/^CLINIWHITE\s+/i, '');
}
