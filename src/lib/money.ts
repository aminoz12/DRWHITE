export function formatMoney(
  amount: string | number | null | undefined,
  currencyCode: string | null | undefined,
  locale = 'en-US'
) {
  const value =
    typeof amount === 'number' ? amount : Number.parseFloat(amount ?? '0');
  const safeValue = Number.isFinite(value) ? value : 0;
  const safeCurrency = currencyCode || 'USD';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: safeCurrency,
    }).format(safeValue);
  } catch {
    return `${safeCurrency} ${safeValue.toFixed(2)}`;
  }
}

export function getDiscountPercent(
  price: string | number | null | undefined,
  compareAtPrice: string | number | null | undefined
) {
  const priceValue =
    typeof price === 'number' ? price : Number.parseFloat(price ?? '0');
  const compareValue =
    typeof compareAtPrice === 'number'
      ? compareAtPrice
      : Number.parseFloat(compareAtPrice ?? '0');

  if (!Number.isFinite(priceValue) || !Number.isFinite(compareValue)) return 0;
  if (compareValue <= priceValue || compareValue <= 0) return 0;

  return Math.round(((compareValue - priceValue) / compareValue) * 100);
}
