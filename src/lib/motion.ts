'use client';

import { useEffect, useRef, useState } from 'react';

export const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

/** Tracks the reduced-motion preference live, including mid-session changes. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_QUERY);
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return reduced;
}

/** True once the viewport is at least `min` wide. Starts false, so mobile is the default. */
export function useMinWidth(min: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${min}px)`);
    const apply = () => setMatches(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [min]);

  return matches;
}

/**
 * Adds `.is-in` to every `[data-rv]` descendant as it enters the viewport.
 * One observer per section rather than one per element.
 */
export function useRevealGroup<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const pending = new Set<HTMLElement>(
      Array.from(root.querySelectorAll<HTMLElement>('[data-rv]')),
    );
    if (root.hasAttribute('data-rv')) pending.add(root);
    if (!pending.size) return;

    const revealAll = () => pending.forEach((el) => el.classList.add('is-in'));

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia(REDUCED_QUERY).matches
    ) {
      revealAll();
      return;
    }

    const reveal = (el: HTMLElement) => {
      el.classList.add('is-in');
      pending.delete(el);
      io.unobserve(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          // A fast flick can scroll an element clean past the viewport between two
          // observer deliveries, so anything already level with or above the fold is
          // revealed whether or not it was ever reported as intersecting.
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            reveal(el);
          }
        });
      },
      {
        threshold: options?.threshold ?? 0,
        rootMargin: options?.rootMargin ?? '0px 0px -10% 0px',
      },
    );

    pending.forEach((el) => io.observe(el));

    // Safety sweep: whatever the observer missed is caught on the next scroll frame.
    // It costs nothing once everything has been revealed and the listener detaches.
    let raf = 0;
    const sweep = () => {
      raf = 0;
      const limit = window.innerHeight;
      Array.from(pending).forEach((el) => {
        if (el.getBoundingClientRect().top < limit) reveal(el);
      });
      if (!pending.size) window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, [options?.threshold, options?.rootMargin]);

  return ref;
}

/** Stagger helper: `style={stagger(i)}` on a reveal element. */
export function stagger(index: number, step = 80, base = 0): React.CSSProperties {
  return { ['--rv-delay' as string]: `${base + index * step}ms` };
}

/**
 * Loads GSAP + ScrollTrigger on demand so they stay out of the initial bundle,
 * and never loads them at all under reduced motion.
 */
export async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
