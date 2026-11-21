import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// The site-wide title style: a ruled eyebrow, a wide uppercase headline (wrap
// the key words in <Marker> to set them in violet), an optional subtitle and
// an optional "see all" link.
//
//   align="left"    stacked, for headings inside a column (the default)
//   split           full-width sections: headline left; subtitle and link sit
//                   bottom-right on desktop, the way an editorial page runs
//   align="center"  for narrow, symmetrical blocks only
export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  split = false,
  as: Tag = 'h2',
  className = 'mb-10 sm:mb-14',
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; href: string };
  align?: 'left' | 'center';
  split?: boolean;
  /** h1 for page titles, h2 for sections. */
  as?: 'h1' | 'h2';
  className?: string;
}) {
  const centered = align === 'center';
  const isSplit = split && !centered;
  const hasAside = Boolean(description || action);

  return (
    <div
      data-reveal=""
      className={`${className} ${centered ? 'text-center' : ''} ${
        isSplit && hasAside ? 'lg:flex lg:items-end lg:justify-between lg:gap-16' : ''
      }`}
    >
      <div className={isSplit ? 'max-w-3xl' : ''}>
        {eyebrow && <Eyebrow centered={centered}>{eyebrow}</Eyebrow>}
        <Tag id={id} className={`type-display scroll-mt-28 text-balance text-grape ${eyebrow ? 'mt-4' : ''}`}>
          {title}
        </Tag>
      </div>
      {hasAside && (
        <div className={centered ? 'mx-auto mt-4 max-w-xl' : isSplit ? 'mt-4 max-w-sm shrink-0 lg:mt-0 lg:pb-1.5' : 'mt-4 max-w-xl'}>
          {description && (
            // Subtitle: one short benefit-led line; wrap the key phrase in <strong>.
            <p
              className={`text-base leading-relaxed text-gray-600 md:text-lg [&_strong]:font-semibold [&_strong]:text-grape ${
                centered ? 'text-balance' : 'text-pretty'
              }`}
            >
              {description}
            </p>
          )}
          {action && (
            <Link
              href={action.href}
              className={`type-eyebrow group inline-flex items-center gap-2 py-2.5 text-grape underline-offset-4 hover:text-violet hover:underline ${
                description ? 'mt-4' : ''
              }`}
            >
              {action.label}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/** Small label with a short leading rule. `tone="dark"` for navy sections. */
export function Eyebrow({
  children,
  centered = false,
  tone = 'light',
  className = '',
}: {
  children: React.ReactNode;
  centered?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <p
      className={`type-eyebrow flex items-center gap-3 ${tone === 'dark' ? 'text-lilac' : 'text-violet'} ${
        centered ? 'justify-center' : ''
      } ${className}`}
    >
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}
