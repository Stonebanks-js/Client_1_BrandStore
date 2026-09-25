'use client';

import Image from 'next/image';
import Link from 'next/link';

import { sale } from '@/data/products';
import { openWhatsApp } from '@/lib/whatsapp';
import { thumb } from '@/components/ProductCard';

export default function HomeSaleBand() {
  return (
    <section className="bg-band py-[clamp(56px,7vw,112px)] text-on-band">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <div data-scroll3d className="will-change-transform">
              <p className="t-serif text-[clamp(1.6rem,3vw,2.6rem)] text-on-band-dim">
                Off Season
              </p>
              <p
                className="t-display text-signal"
                style={{ fontSize: 'clamp(5rem, 12vw, 11rem)' }}
              >
                Sale
              </p>
            </div>
          </div>

          <div data-reveal className="lg:pb-4">
            <span className="t-btn inline-block rounded-full border border-band-line px-4 py-2 text-[10px] text-on-band-dim">
              {sale.badge}
            </span>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-on-band-dim">
              {sale.lead}
            </p>
            <Link href="/sale" className="t-btn mt-6 inline-block text-[11px] text-gold">
              All four offers →
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal snap scroller — the four offers read as a rail, not a grid. */}
      <div className="mt-[clamp(32px,4vw,64px)] overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-4 px-[clamp(16px,5vw,80px)]">
          {sale.offers.map((o) => (
            <article
              key={o.id}
              data-tilt="0.8"
              className="relative flex shrink-0 snap-start flex-col rounded-[2px] border border-band-line bg-band-2 p-4"
              style={{ flex: '1 0 min(76vw, 260px)' }}
            >
              <div
                className="relative aspect-square overflow-hidden rounded-[2px]"
                style={{ background: o.bg }}
              >
                <Image
                  data-pop
                  src={thumb(o.image)}
                  alt={o.title}
                  fill
                  sizes="(max-width: 1023px) 76vw, 260px"
                  className="object-contain object-[center_60%] transition-[scale] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  style={{
                    opacity: 'var(--glare, 0)',
                    background:
                      'radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.45), transparent 55%)',
                  }}
                />
              </div>

              <p className="t-btn mt-5 text-[11px] text-signal">{o.quantity}</p>
              <p
                className="t-serif mt-1 leading-none"
                style={{ fontSize: 'clamp(3rem, 4.2vw, 4rem)' }}
              >
                {o.price}
              </p>
              <h3 className="mt-3 text-[15px] font-semibold">
                {o.title}
                {o.qualifier && (
                  <span className="ml-2 text-[11px] font-normal uppercase tracking-[0.18em] text-on-band-dim">
                    {o.qualifier}
                  </span>
                )}
              </h3>
              <p className="t-serif mt-2 flex-1 text-[15px] text-on-band-dim">{o.line}</p>

              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="t-btn mt-5 h-12 rounded-[2px] border border-band-line text-[11px] hover:border-gold"
              >
                Ask for this offer →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
