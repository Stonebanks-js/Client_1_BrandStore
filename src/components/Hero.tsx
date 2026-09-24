'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { site, whatsappLink } from '@/data/site';
import { usePrefersReducedMotion } from '@/lib/motion';
import { WhatsAppIcon } from './icons';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

/**
 * A split opening: the shop on the right, who it is and where it is on the left.
 *
 * The photograph is the point, so it keeps its own half of the frame at full strength
 * instead of being buried under a scrim and a wall of display type. The left panel is
 * ink so the two halves read as one composition rather than a caption on a picture.
 *
 * On a phone the order flips to photograph first, because that is the thing worth seeing
 * before anything else.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const [webgl, setWebgl] = useState(false);
  const [inView, setInView] = useState(true);
  const [entered, setEntered] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (!wide || nav.connection?.saveData) return;
    let ok = false;
    try {
      const c = document.createElement('canvas');
      ok = Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
    } catch {
      ok = false;
    }
    setWebgl(ok);
  }, [reduced]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.offsetHeight || 1;
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => {
        const r = e.boundingClientRect;
        setInView(r.height === 0 || (r.top < window.innerHeight && r.bottom > 0));
      },
      { threshold: 0, rootMargin: '120px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate grid min-h-[100svh] grid-cols-1 overflow-hidden bg-ink pt-[var(--header-h)] lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:pt-0"
    >
      {/* photograph — first on a phone, right-hand half on a desktop */}
      <div className="relative order-1 min-h-[44svh] lg:order-2 lg:min-h-0">
        {webgl ? (
          <HeroCanvas src="/brand/showroom.jpg" scrollRef={scrollRef} active={inView} />
        ) : (
          <Image
            src="/brand/showroom.jpg"
            alt="The BRAND STORE showroom on Sabji Mandi Road: lit shelving of folded shirts, a rail of tees, and the illuminated wall sign"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className={`object-cover object-center ${reduced ? '' : 'kenburns'}`}
          />
        )}
        {/* just enough falloff on the inner edge to join the two halves */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/0 lg:to-transparent"
        />
      </div>

      {/* wordmark and orientation */}
      <div className="relative order-2 flex flex-col justify-center gap-8 px-[var(--gutter)] py-[clamp(2.5rem,6vh,4.5rem)] lg:order-1 lg:py-0 lg:pl-[max(var(--gutter),4vw)] lg:pr-[clamp(2rem,4vw,4rem)]">
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(16px)' }}
        >
          <p className="t-small font-semibold uppercase tracking-[0.28em] text-gold-lt">
            {site.segment}
          </p>

          <h1 className="t-hero mt-5 text-on-ink">
            Brand
            <br />
            Store
          </h1>

          <p className="t-phrase mt-6 text-[clamp(1.25rem,2vw,1.7rem)] text-on-ink-dim">
            {site.tagline}
          </p>
        </div>

        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'none' : 'translateY(16px)',
            transitionDelay: '140ms',
          }}
        >
          <p className="t-lead text-on-ink-dim">
            A menswear floor in Arya Nagar, Kanpur. Come in, try things on properly, and leave
            with something that fits.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center bg-paper px-7 py-4 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:bg-gold-lt"
            >
              Shop the collection
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 border border-on-ink/30 px-6 py-4 text-[0.95rem] font-semibold text-on-ink transition-colors duration-200 hover:border-on-ink"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
