/**
 * Soft blurred edge for a photo, on phones and tablets only.
 *
 * A full-bleed photo ends abruptly against flat colour on a small screen. This
 * overlay blurs what sits beneath it, then masks itself so it is fully
 * transparent through the middle and only reaches full strength at the border:
 * the photo stays sharp where it matters and feathers out at the edges.
 *
 * Drop it inside any `relative` (or `absolute`) image container, after the
 * <Image>. Anything that must stay legible above it — a caption, a badge —
 * needs its own z-index, since this sits on top of everything before it.
 *
 * The blur and mask are inline rather than utility classes on purpose: the CSS
 * minifier strips the unprefixed `backdrop-filter` when both forms appear in a
 * stylesheet, which silently drops the effect in Firefox. Inline styles are
 * emitted verbatim, so both spellings survive.
 */
const FEATHER = 'radial-gradient(115% 115% at 50% 50%, transparent 56%, #000 100%)';

export default function PhotoSoftEdge() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 lg:hidden"
      style={{
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        maskImage: FEATHER,
        WebkitMaskImage: FEATHER,
        boxShadow: 'inset 0 0 2.5rem rgba(35, 27, 80, 0.15)',
      }}
    />
  );
}
