'use client';

import { useEffect, useRef, useState } from 'react';
import CTAButton from './CTAButton';
import { PinIcon, WhatsAppIcon, ArrowIcon } from './icons';
import { site, whatsappLink, mapEmbedSrc, mapDirectionsLink } from '@/data/site';
import { stagger, useRevealGroup } from '@/lib/motion';

/**
 * The location sequence: a drafted street grid draws itself, a route traces across it, the
 * pin lands, and only then does the real map fade in underneath. The map is a keyless embed
 * resolved from the address in `site.location`, so there is no API key and no backend, and
 * no coordinates are invented — set `coordinates` later to pin it exactly.
 */
export default function LocationSection() {
  const root = useRef<HTMLElement>(null);
  const reveal = useRevealGroup<HTMLDivElement>();
  const [p, setP] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section's top reaches the bottom of the viewport, 1 once it is centred.
      const prog = (vh - r.top) / (vh * 0.55 + r.height * 0.35);
      setP(Math.min(1, Math.max(0, prog)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // The real map is expensive, so it waits until the section is genuinely near. This is
  // driven by the same scroll measurement as the drawing above rather than by a second
  // observer, which a fast flick can scroll straight past without ever firing.
  useEffect(() => {
    if (p > 0.04) setMapReady(true);
  }, [p]);

  const ease = (x: number) => 1 - Math.pow(1 - x, 3);
  const grid = ease(Math.min(1, p / 0.45));
  const route = ease(Math.min(1, Math.max(0, (p - 0.3) / 0.45)));
  const pin = ease(Math.min(1, Math.max(0, (p - 0.62) / 0.3)));
  const mapFade = Math.min(1, Math.max(0, (p - 0.72) / 0.28));

  return (
    <section
      id="visit"
      ref={root}
      aria-labelledby="location-heading"
      className="section relative overflow-hidden bg-ink"
    >
      <div ref={reveal} className="shell">
        <header className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="t-label text-gold" data-rv>
              Location
            </p>
            <h2 id="location-heading" className="t-display-l mt-6 text-on-ink" data-rv style={stagger(1)}>
              Come to
              <br />
              the floor.
            </h2>
          </div>
          <p className="t-lead text-on-ink-dim md:col-span-5" data-rv style={stagger(2)}>
            Arya Nagar, off Sabji Mandi Road. Message ahead on WhatsApp and we will keep
            something aside for you to try.
          </p>
        </header>

        <div className="mt-[clamp(3rem,7vw,5.5rem)] grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* drafted map */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden border border-line-dark bg-ink-2 sm:aspect-[16/10]">
              {/* the real map, revealed last */}
              {mapReady && (
                <iframe
                  title={`Map showing ${site.name}, ${site.location.full}`}
                  src={mapEmbedSrc()}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: mapFade * 0.94,
                    filter: 'grayscale(1) invert(0.92) contrast(0.86) sepia(0.32) hue-rotate(2deg)',
                  }}
                />
              )}

              {/* drafted grid + route, drawn on scroll */}
              <svg
                viewBox="0 0 800 500"
                className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500"
                style={{ opacity: 1 - mapFade }}
                aria-hidden
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="loc-route" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-gold-dp)" />
                    <stop offset="100%" stopColor="var(--color-gold-lt)" />
                  </linearGradient>
                  <radialGradient id="loc-glow">
                    <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* streets */}
                <g stroke="var(--color-line)" strokeWidth="1" opacity={0.9}>
                  {[70, 160, 250, 340, 430].map((y, i) => {
                    const len = 800;
                    const local = Math.min(1, Math.max(0, grid * 1.4 - i * 0.1));
                    return (
                      <line
                        key={`h${y}`}
                        x1="0"
                        y1={y}
                        x2={len}
                        y2={y}
                        strokeDasharray={len}
                        strokeDashoffset={len * (1 - local)}
                      />
                    );
                  })}
                  {[110, 250, 390, 530, 670].map((x, i) => {
                    const len = 500;
                    const local = Math.min(1, Math.max(0, grid * 1.4 - i * 0.08));
                    return (
                      <line
                        key={`v${x}`}
                        x1={x}
                        y1="0"
                        x2={x}
                        y2={len}
                        strokeDasharray={len}
                        strokeDashoffset={len * (1 - local)}
                      />
                    );
                  })}
                </g>

                {/* blocks */}
                <g fill="var(--color-char-2)" opacity={grid * 0.55}>
                  <rect x="128" y="88" width="104" height="54" />
                  <rect x="272" y="178" width="96" height="54" />
                  <rect x="552" y="88" width="98" height="52" />
                  <rect x="128" y="268" width="104" height="54" />
                  <rect x="412" y="358" width="98" height="54" />
                </g>

                {/* route */}
                <path
                  d="M 40 462 L 250 462 L 250 340 L 390 340 L 390 250 L 530 250 L 530 172"
                  fill="none"
                  stroke="url(#loc-route)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="760"
                  strokeDashoffset={760 * (1 - route)}
                />

                {/* destination */}
                <g transform="translate(530 172)" opacity={pin}>
                  <circle r="46" fill="url(#loc-glow)" opacity={pin} />
                  <circle
                    r={9 + (1 - pin) * 16}
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="1"
                    opacity={pin * (1 - pin) * 3}
                  />
                  <circle r="5" fill="var(--color-gold-lt)" />
                  <circle r="9" fill="none" stroke="var(--color-gold)" strokeWidth="1.25" />
                </g>
              </svg>

              {/* label plate */}
              <div
                className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2.5 border border-gold/45 bg-ink/88 px-3.5 py-2.5 backdrop-blur-sm transition-all duration-[640ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-6 sm:left-6"
                style={{ opacity: pin, transform: `translateY(${(1 - pin) * 10}px)` }}
              >
                <PinIcon className="h-4 w-4 text-gold" />
                <span className="t-label text-on-ink">{site.name}</span>
              </div>

              <div aria-hidden className="pointer-events-none absolute inset-0 border border-line-dark/70" />
            </div>

            <p className="t-label mt-4 text-on-ink-mute">
              {site.location.full} · {site.location.region}
            </p>
          </div>

          {/* address card */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between border border-line-dark bg-ink-2 p-7 sm:p-9" data-rv>
              <div>
                <p className="t-label text-gold">Visit Us</p>
                <address className="mt-7 not-italic">
                  <span className="t-display-m block text-on-ink">{site.location.line1}</span>
                  <span className="mt-2 block text-[1.05rem] leading-relaxed text-on-ink-dim">
                    {site.location.line2}
                    <br />
                    {site.location.city}, {site.location.region}
                  </span>
                </address>

                <div className="hairline my-8" />

                <dl className="space-y-5">
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="t-label text-on-ink-mute">Phone</dt>
                    <dd>
                      <a
                        href={`tel:+${site.whatsappNumber}`}
                        className="text-[1.05rem] text-on-ink transition-colors hover:text-gold"
                      >
                        {site.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="t-label text-on-ink-mute">Segment</dt>
                    <dd className="text-[1.05rem] text-on-ink-dim">{site.segment}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <CTAButton href={mapDirectionsLink()} variant="cream" external>
                  <PinIcon className="h-4 w-4" />
                  Get directions
                  <ArrowIcon />
                </CTAButton>
                <CTAButton
                  href={whatsappLink(
                    `Hi ${site.name}, I would like to visit the store. Could you share your timings?`,
                  )}
                  variant="ghost"
                  external
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Ask before visiting
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
