'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * A curtain that wipes up as the new route settles. Purely decorative and pointer-inert, so
 * it can never intercept a click; under reduced motion it is not rendered at all.
 */
export default function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const first = useRef(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el) return;

    el.animate(
      [
        { transform: 'scaleY(1)', opacity: 1 },
        { transform: 'scaleY(0)', opacity: 1 },
      ],
      { duration: 760, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
    );
  }, [pathname, reduced]);

  if (reduced) return null;

  return <div ref={ref} className="curtain" aria-hidden style={{ transform: 'scaleY(0)' }} />;
}
