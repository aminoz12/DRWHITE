import { Check, X } from 'lucide-react';
import { getProducts, type ShopifyProductEdge } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import { formatMoney } from '@/lib/money';
import Marker from './Marker';
import SectionHeading from './SectionHeading';

type Cell = boolean | string;

// Only claims that hold by definition: peroxide strips and in-chair whitening
// use peroxide, aren't brushed on, and in-chair isn't done at home.
const ROWS: { label: string; us: Cell; strips: Cell; dentist: Cell }[] = [
  { label: 'Peroxide-free formula', us: true, strips: false, dentist: false },
  { label: 'Brightens every time you brush', us: true, strips: false, dentist: false },
  { label: 'Done at home, on your schedule', us: true, strips: true, dentist: false },
  { label: '30-day money-back guarantee', us: true, strips: 'Varies', dentist: 'Varies' },
];

function Mark({ value, highlight = false }: { value: Cell; highlight?: boolean }) {
  if (typeof value === 'string') {
    return <span className={`type-eyebrow ${highlight ? 'text-white' : 'text-gray-500'}`}>{value}</span>;
  }
  return value ? (
    <span
      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${
        highlight ? 'bg-white text-violet' : 'bg-gray-100 text-grape'
      }`}
    >
      <Check className="h-4 w-4" strokeWidth={3} />
      <span className="sr-only">Yes</span>
    </span>
  ) : (
    <span className="mx-auto flex h-8 w-8 items-center justify-center text-gray-300">
      <X className="h-5 w-5" strokeWidth={2.5} />
      <span className="sr-only">No</span>
    </span>
  );
}

export default async function CompareTable() {
  const country = await getServerCountry();
  const products = (await getProducts(country)) as ShopifyProductEdge[];
  const prices = products.map((p) => p.node.priceRange.minVariantPrice);
  const cheapest = prices.reduce<(typeof prices)[number] | null>(
    (min, p) => (!min || Number(p.amount) < Number(min.amount) ? p : min),
    null
  );
  const currency = cheapest?.currencyCode || 'GBP';
  const symbol =
    // narrowSymbol: "$" rather than "US$", so "$$" reads as a price tier.
    new Intl.NumberFormat('en-GB', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? '£';

  // Phones get Mona Sans's narrow cut so "CLINIWHITE" fits a quarter-width column.
  const headCell =
    'type-eyebrow px-1 py-5 text-center text-[10px] leading-tight tracking-[0.04em] font-stretch-[75%] sm:px-4 sm:text-[11px] sm:tracking-[0.12em]';
  const rowHead = 'p-3 text-[13px] font-semibold leading-snug text-grape sm:p-5 sm:text-[15px]';

  return (
    <section aria-labelledby="compare-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="compare-heading"
          eyebrow="The honest comparison"
          title={
            <>
              Why people <Marker>switch</Marker>
            </>
          }
          description={
            <>
              <strong className="whitespace-nowrap">No peroxide.</strong>{' '}
              <strong className="whitespace-nowrap">No appointment.</strong>{' '}
              <strong className="whitespace-nowrap">No big bill.</strong>
              <br />
              Just a brighter-looking smile.
            </>
          }
        />

        <div className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white">
          <table className="w-full table-fixed border-collapse text-left [overflow-wrap:normal]">
            <caption className="sr-only">CLINIWHITE compared with peroxide strips and dentist whitening</caption>
            <colgroup>
              <col className="w-[38%] sm:w-[40%]" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="p-3 sm:p-5">
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className={`${headCell} bg-grape text-white sm:font-wide`}>
                  CLINIWHITE
                </th>
                <th scope="col" className={`${headCell} text-gray-500 sm:font-semiwide`}>Peroxide strips</th>
                <th scope="col" className={`${headCell} text-gray-500 sm:font-semiwide`}>Dentist whitening</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-gray-200">
                  <th scope="row" className={rowHead}>
                    {row.label}
                  </th>
                  <td className="border-t border-white/10 bg-grape p-3 text-center sm:p-5">
                    <Mark value={row.us} highlight />
                  </td>
                  <td className="p-3 text-center sm:p-5">
                    <Mark value={row.strips} />
                  </td>
                  <td className="p-3 text-center sm:p-5">
                    <Mark value={row.dentist} />
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-200">
                <th scope="row" className={rowHead}>
                  Price
                </th>
                <td className="border-t border-white/10 bg-grape p-3 text-center text-xs font-bold text-white sm:p-5 sm:text-base">
                  {cheapest ? `From ${formatMoney(cheapest.amount, currency)}` : '—'}
                </td>
                <td className="p-3 text-center text-sm font-bold text-gray-500 sm:p-5">{symbol.repeat(2)}</td>
                <td className="p-3 text-center text-sm font-bold text-gray-500 sm:p-5">{symbol.repeat(3)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
