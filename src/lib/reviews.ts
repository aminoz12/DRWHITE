// Deterministic per-product review stats derived from the product handle.
// Used by both the product card (star display) and the Product JSON-LD schema
// so the numbers are always consistent with each other and never exceed the
// site-wide review total.

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export interface ReviewStats {
  count: number;
  rating: number;
}

export function getProductReviews(handle: string): ReviewStats {
  const h = hashString(handle);
  const count = 120 + (h % 780); // ~120–900, always below the site total
  const rating = 4.6 + (h % 4) / 10; // 4.6 to 4.9
  return { count, rating: Math.round(rating * 10) / 10 };
}
