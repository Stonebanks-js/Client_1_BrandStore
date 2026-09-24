'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { sale, type SaleOffer } from '@/data/sale';
import { site, whatsappLink } from '@/data/site';
import { stagger, usePrefersReducedMotion, useRevealGroup } from '@/lib/motion';
import { ArrowIcon, WhatsAppIcon } from './icons';

/**
 * The Off Season Sale, played as a campaign.
 *
 * The client's poster is present as a supporting visual — a printed flyer leaning against
 * the wall — but every offer is real text: readable, responsive, selectable, translatable
 * and announced correctly. Nothing here is an image of words.
 */
export default function SaleSection() {
  const root = useRef<HTMLElement>(null);
  const reveal = useRevealGroup<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  // One scrubbed move: the masthead drifts against the flyer as the section passes.
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { gsap, ScrollTrigger } = await import('@/lib/motion').then((m) => m.loadGsap());
      if (cancelled) return;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 860px)', () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: '[data-sale-masthead]',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            })
            .fromTo('[data-sale-word]', { yPercent: 12 }, { yPercent: -12, ease: 'none' }, 0)
            .fromTo('[data-sale-flyer]', { yPercent: -8, rotate: -3.4 }, { yPercent: 8, rotate: -1.2, ease: 'none' }, 0)
            .fromTo('[data-sale-wash]', { opacity: 0.35 }, { opacity: 1, ease: 'none' }, 0);
        });

        ScrollTrigger.refresh();
      }, el);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section
      id="sale"
      ref={root}
      aria-labelledby="sale-heading"
      className="relative isolate scroll-mt-[var(--header-h)] overflow-hidden bg-ink"
    >
      {/* the one place yellow is allowed to light the room */}
      <div
        data-sale-wash
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(68% 46% at 26% 18%, color-mix(in srgb, var(--color-signal) 13%, transparent) 0%, transparent 64%),' +
            'radial-gradient(80% 60% at 84% 96%, color-mix(in srgb, var(--color-amber) 10%, transparent) 0%, transparent 62%)',
        }}
      />

      <div ref={reveal} className="shell section">
        {/* masthead */}
        <div data-sale-masthead className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5" data-rv>
              <span className="t-label text-signal">{sale.eyebrow}</span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>

            <h2 id="sale-heading" className="sr-only">
              {sale.eyebrow} — {sale.badge}. Four offers in store.
            </h2>

            <p
              data-sale-word
              aria-hidden
              className="t-numeral signal-metal mt-[clamp(1.5rem,4vh,3rem)] block"
            >
              {sale.word}
            </p>

            <div className="mt-[clamp(1.5rem,4vh,2.5rem)] flex flex-wrap items-center gap-4" data-rv>
              <span className="t-label inline-flex items-center gap-2.5 rounded-full border border-signal/55 px-4 py-2.5 text-signal">
                <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-signal" />
                {sale.badge}
              </span>
              <span className="t-label text-cream-mute">{sale.kicker}</span>
            </div>

            <p className="t-lead mt-7 max-w-[44ch]" data-rv style={stagger(1)}>
              {sale.lead}
            </p>
          </div>

          {/* the client's own artwork, as a printed flyer rather than a background */}
          <div className="lg:col-span-5">
            <figure
              data-sale-flyer
              className="relative mx-auto w-[min(78%,20rem)] lg:w-full lg:max-w-[22rem]"
              data-rv="media"
            >
              <div className="relative aspect-[2/3] -rotate-[2.4deg] overflow-hidden border border-line bg-char shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]">
                <Image
                  src={sale.poster.src}
                  alt={sale.poster.alt}
                  fill
                  sizes="(max-width: 1024px) 60vw, 22rem"
                  className="object-cover object-top"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(200deg, rgba(255,255,255,0.1) 0%, transparent 34%),' +
                      'linear-gradient(to top, rgba(8,7,6,0.5) 0%, transparent 42%)',
                  }}
                />
              </div>
              <figcaption className="t-label mt-4 text-center text-cream-mute lg:text-left">
                The original campaign
              </figcaption>
            </figure>
          </div>
        </div>

        {/* offers */}
        <ul className="mt-[clamp(3.5rem,9vw,7rem)] grid gap-px border border-line bg-line sm:grid-cols-2">
          {sale.offers.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} />
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" data-rv>
          <p className="t-label flex flex-wrap items-center gap-x-4 gap-y-2 text-cream-mute">
            {sale.marks.map((mark, i) => (
              <span key={mark} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden className="h-2.5 w-px bg-gold/45" />}
                {mark}
              </span>
            ))}
          </p>
          <p className="t-label text-cream-mute">In store only · While stocks last</p>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, index }: { offer: SaleOffer; index: number }) {
  const enquiry = whatsappLink(
    `Hi ${site.name}, I saw the Off Season Sale on your website. I am interested in the ` +
      `${offer.title} offer — ${offer.quantity} ${offer.price}. Please share the available options.`,
  );

  return (
    <li
      className="group relative flex flex-col justify-between gap-8 bg-ink-2 p-7 transition-colors duration-[420ms] hover:bg-char sm:p-9 lg:p-10"
      data-rv
      style={stagger(index, 90)}
    >
      {/* the rule that draws on hover, in the campaign's yellow */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="t-label text-cream-mute">{offer.quantity}</p>
            <p className="mt-3 font-display text-[clamp(2.6rem,5.6vw,4.2rem)] leading-[0.9] tracking-[-0.03em]">
              <span className="signal-metal">{offer.price}</span>
            </p>
          </div>
          <span className="t-label shrink-0 text-cream-mute">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 className="t-display-m mt-7 text-cream">
          {offer.title}
          {offer.qualifier && (
            <span className="mt-2 block font-sans text-[0.72rem] uppercase tracking-[0.22em] text-signal">
              {offer.qualifier}
            </span>
          )}
        </h3>

        <p className="mt-4 font-display text-[clamp(1.05rem,1.5vw,1.3rem)] italic text-cream-dim">
          {offer.line}
        </p>

        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
          {offer.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-[0.9rem] text-cream-mute">
              <span aria-hidden className="block h-1 w-1 rotate-45 bg-signal/80" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5">
        <span className="flex items-center gap-2" aria-hidden>
          {offer.swatches.map((hex) => (
            <span
              key={hex}
              className="block h-4 w-4 rounded-full border border-line"
              style={{ background: hex }}
            />
          ))}
        </span>

        <span className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={`/catalog/${offer.slug}`}
            className="t-label inline-flex items-center gap-2 text-cream-dim transition-colors duration-200 hover:text-cream"
          >
            View category
            <ArrowIcon className="h-3.5 w-3.5 text-signal" />
          </Link>
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label group/cta relative inline-flex items-center gap-2.5 overflow-hidden rounded-[2px] border border-signal/55 px-4 py-2.5 text-signal transition-colors duration-200 hover:text-ink"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/cta:scale-y-100"
            />
            <WhatsAppIcon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">Enquire</span>
          </a>
        </span>
      </div>
    </li>
  );
}
