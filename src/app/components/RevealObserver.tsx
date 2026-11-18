'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Fades [data-reveal] blocks up as they scroll into view (styles in
// globals.css). Server HTML stays fully visible: only blocks still below the
// fold when this runs are hidden, and each is shown again on first sight.
// New blocks (client navigation, tab switches) are armed as they mount.
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-reveal', 'shown');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px' }
    );

    const arm = (el: Element) => {
      if (el.getAttribute('data-reveal') !== '') return;
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.setAttribute('data-reveal', 'hidden');
        io.observe(el);
      } else {
        el.setAttribute('data-reveal', 'shown');
      }
    };
    const scan = (root: ParentNode) => root.querySelectorAll('[data-reveal=""]').forEach(arm);

    scan(document);
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('[data-reveal=""]')) arm(node);
          scan(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
