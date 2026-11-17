import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// The site-wide title style: a small tag, a wide uppercase headline (wrap the
// key words in <Marker> to set them in violet), an optional subtitle and an
// optional "see all" link.
export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  align = 'center',
  as: Tag = 'h2',
  className = 'mb-10 sm:mb-12',
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; href: string };
  align?: 'left' | 'center';
  /** h1 for page titles, h2 for sections. */
  as?: 'h1' | 'h2';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div className={`${className} ${centered ? 'text-center' : 'text-left'}`}>
      {eyebrow && <span className="tag">{eyebrow}</span>}
      <Tag id={id} className={`type-display scroll-mt-28 text-balance text-grape ${eyebrow ? 'mt-4' : ''}`}>
        {title}
      </Tag>
      {description && (
        // Subtitle: one short benefit-led line; wrap the key phrase in <strong>.
        <p
          className={`mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg [&_strong]:font-semibold [&_strong]:text-grape ${
            centered ? 'mx-auto text-balance' : 'text-pretty'
          }`}
        >
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="type-eyebrow group mt-5 inline-flex items-center gap-2 text-grape underline-offset-4 hover:text-violet hover:underline"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
