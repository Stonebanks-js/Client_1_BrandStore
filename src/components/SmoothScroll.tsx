'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * Lenis + ScrollTrigger, mounted only when smooth scroll actually helps: pointer-fine
 * devices, motion allowed. Touch keeps native momentum — Lenis on mobile costs frames and
 * fights the platform. ScrollTrigger is driven from Lenis' own RAF so the two stay in sync.
 */
export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let lenis: import('lenis').default | undefined;
    let rafId = 0;
    let cancelled = false;
    let cleanupTriggers: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('@/lib/motion').then((m) => m.loadGsap()),
      ]);
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.9,
        touchMultiplier: 1.6,
      });

      const onScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onScroll);

      const tick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Anchor links and skip links must still work through Lenis.
      const onAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement | null)?.closest('a[href*="#"]');
        if (!target) return;
        const href = target.getAttribute('href') ?? '';
        const hash = href.slice(href.indexOf('#'));
        if (hash.length < 2) return;
        const base = href.slice(0, href.indexOf('#'));
        if (base && base !== window.location.pathname && base !== '/') return;
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        lenis?.scrollTo(el as HTMLElement, { offset: -80 });
        history.replaceState(null, '', hash);
      };
      document.addEventListener('click', onAnchorClick);

      ScrollTrigger.refresh();

      cleanupTriggers = () => {
        document.removeEventListener('click', onAnchorClick);
        gsap.ticker.remove(tick);
        lenis?.off('scroll', onScroll);
      };
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanupTriggers?.();
      lenis?.destroy();
    };
  }, [reduced]);

  // Route changes: jump to top and re-measure every trigger on the new page.
  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    const id = window.setTimeout(async () => {
      if (cancelled) return;
      try {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        ScrollTrigger.refresh();
      } catch {
        /* GSAP never loaded — nothing to refresh. */
      }
    }, 240);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [pathname]);

  return null;
}
