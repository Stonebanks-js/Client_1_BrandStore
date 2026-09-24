'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site, whatsappLink } from '@/data/site';
import { usePrefersReducedMotion } from '@/lib/motion';
import CTAButton from './CTAButton';
import { ArrowIcon, WhatsAppIcon } from './icons';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

const HEADLINE = ['Walk in.', 'Everything here', 'was chosen.'];

/**
 * Two deliberate compositions, not one design squeezed twice.
 *
 * Desktop: the showroom fills the frame through the shader plate, and the headline sits in
 * the dark lower-left where the room falls away.
 * Mobile: the same photograph becomes a framed 4:3 plate in the flow — cropping a landscape
 * photograph to portrait puts the viewer inside two letters of the shop sign — with the type
 * running beneath it on solid black.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const [webgl, setWebgl] = useState(false);
  const [inView, setInView] = useState(true);
  const [entered, setEntered] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Decide once whether the shader plate is worth mounting at all.
  useEffect(() => {
    if (reduced) {
      setWebgl(false);
      return;
    }
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

  // Hero scroll progress, written to a ref so the shader reads it without re-rendering.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.offsetHeight || 1;
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / h));
      el.style.setProperty('--hero-p', scrollRef.current.toFixed(4));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Stop rendering the canvas once the hero has left the viewport. Visibility is read from
  // the reported rect rather than `isIntersecting`: the first callback can land before
  // layout with an empty rect, and parking the loop there freezes the opening black frame.
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

  // The headline is the LCP element, so the intro starts on the very next frame rather
  // than after a timer — the choreography is in the per-line delays, not in waiting.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const rise = (delay: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'none' : 'translateY(14px)',
    transitionDelay: `${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-ink"
      style={{ ['--hero-p' as string]: 0 }}
    >
      {/* Desktop backdrop. Decorative — the same photograph is presented with a real
          caption further down the page and on the About page. */}
      <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block">
        {webgl ? (
          // Mounted once and parked when offscreen. Unmounting it instead would throw the
          // WebGL context away and rebuild it every time the hero scrolls back into view.
          <HeroCanvas src="/brand/showroom.jpg" scrollRef={scrollRef} active={inView} />
        ) : (
          <Image
            src="/brand/showroom.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover object-center ${reduced ? '' : 'kenburns'}`}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(8,7,6,0.96) 0%, rgba(8,7,6,0.76) 28%, rgba(8,7,6,0.26) 58%, rgba(8,7,6,0.56) 84%, rgba(8,7,6,0.88) 100%)',
          }}
        />
      </div>

      <div className="shell relative flex min-h-[100svh] flex-col pb-[clamp(3.5rem,9vh,7rem)] pt-[calc(var(--header-h)+clamp(1rem,4vh,2.5rem))]">
        {/* eyebrow */}
        <div className="flex items-center gap-4">
          <span
            className="t-label text-gold transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={rise(0)}
          >
            {site.location.line1} · {site.location.city}
          </span>
          <span
            aria-hidden
            className="h-px flex-1 origin-left bg-line transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: entered ? 'scaleX(1)' : 'scaleX(0)' }}
          />
          <span
            className="t-label hidden items-center gap-3 text-cream-mute transition-opacity duration-[900ms] sm:flex"
            style={{ opacity: entered ? 1 : 0, transitionDelay: '200ms' }}
          >
            {site.taglineParts.map((word, i) => (
              <span key={word} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-2.5 w-px bg-gold/45" />}
                {word}
              </span>
            ))}
          </span>
        </div>

        {/* mobile / tablet plate */}
        <figure
          data-rv="media"
          className={`mt-7 lg:hidden ${entered ? 'is-in' : ''}`}
          aria-hidden
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-line/70 bg-char">
            <Image
              src="/brand/showroom.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center ${reduced ? '' : 'kenburns'}`}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(8,7,6,0.9) 0%, rgba(8,7,6,0.14) 44%, rgba(8,7,6,0.32) 100%)',
              }}
            />
          </div>
        </figure>

        {/* headline block */}
        <div
          className="mt-auto pt-[clamp(2.25rem,6vh,4rem)]"
          style={{
            transform: reduced ? undefined : 'translate3d(0, calc(var(--hero-p) * -3rem), 0)',
            opacity: reduced ? 1 : 'calc(1 - var(--hero-p) * 1.15)',
          }}
        >
          <h1 className="t-display-xl max-w-[16ch] text-cream">
            {HEADLINE.map((line, i) => (
              <span
                key={line}
                className={`rv-line ${entered ? 'is-in' : ''}`}
                style={{ ['--rv-delay' as string]: `${90 + i * 100}ms` }}
              >
                <span>
                  {i === 2 ? (
                    <>
                      was <em className="metal font-normal italic">chosen</em>.
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p
              className="t-lead max-w-[46ch] transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={rise(660)}
            >
              {site.name} is a {site.segment.toLowerCase()} floor on Sabji Mandi Road, Arya
              Nagar. Top wear, bottom wear, and the time to try them properly.
            </p>

            <div
              className="flex flex-wrap gap-3 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:shrink-0"
              style={rise(800)}
            >
              <CTAButton href="/catalog" variant="cream">
                Explore the catalog
                <ArrowIcon />
              </CTAButton>
              <CTAButton href={whatsappLink()} variant="ghost" external>
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
        style={{ opacity: reduced ? 1 : 'calc(1 - var(--hero-p) * 3)' }}
      >
        <span className="t-label text-cream-mute">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 block h-4 animate-[cue_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gold" />
        </span>
      </div>
    </section>
  );
}
