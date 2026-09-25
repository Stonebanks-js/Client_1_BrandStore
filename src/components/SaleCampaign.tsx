'use client';

import Image from 'next/image';

import { sale } from '@/data/products';
import { site } from '@/data/site';
import { openWhatsApp } from '@/lib/whatsapp';
import { MaskLine } from '@/components/Masked';

const NUMBERS = ['01', '02', '03', '04'];

export default function SaleCampaign() {
  return (
    <>
      <section className="bg-band py-[clamp(40px,6vw,96px)] text-on-band">
        <div className="shell grid items-center gap-[clamp(32px,5vw,80px)] lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="t-btn inline-block rounded-full border border-band-line px-4 py-2 text-[10px] text-on-band-dim">
              {sale.badge}
            </span>

            <h1 className="mt-6">
              <MaskLine className="t-serif">
                <span style={{ fontSize: 'clamp(1.8rem, 4vw, 3.4rem)' }}>Off Season</span>
              </MaskLine>
              <MaskLine className="t-display text-signal">
                <span style={{ fontSize: 'clamp(6rem, 19vw, 15rem)' }}>Sale</span>
              </MaskLine>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-on-band-dim">
              {sale.lead}
            </p>

            <button
              type="button"
              data-magnetic
              onClick={() => openWhatsApp()}
              className="t-btn mt-8 inline-flex h-14 items-center rounded-[2px] bg-btn-bg px-8 text-btn-fg"
            >
              Catalog on WhatsApp →
            </button>
          </div>

          <div
            data-tilt="1.4"
            data-tilt-base="rotate(-2.5deg)"
            className="relative mx-auto w-full max-w-[420px]"
            style={{
              transform: 'rotate(-2.5deg)',
              filter: 'drop-shadow(0 28px 56px rgba(8,7,6,0.45))',
            }}
          >
            <Image
              src={site.images.poster}
              alt={`${sale.title} — ${sale.offers.map((o) => `${o.title} ${o.quantity} ${o.price}`).join(', ')}`}
              width={900}
              height={1200}
              sizes="(max-width: 1023px) 86vw, 420px"
              className="h-auto w-full rounded-[2px]"
            />
          </div>
        </div>
      </section>

      {sale.offers.map((o, i) => (
        <section key={o.id} className="shell py-[clamp(40px,5vw,88px)]">
          <div
            data-reveal
            className="grid items-center gap-[clamp(24px,4vw,72px)] lg:grid-cols-2"
          >
            <div
              data-tilt="0.6"
              className={`relative aspect-[5/4] overflow-hidden rounded-[2px] ${
                i % 2 ? 'lg:order-2' : ''
              }`}
              style={{ background: o.bg }}
            >
              <Image
                data-pop
                src={o.image}
                alt={o.title}
                fill
                sizes="(max-width: 1023px) 92vw, 46vw"
                className="object-contain object-[center_60%] transition-[scale] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <span className="absolute left-5 top-4 text-[11px] font-semibold tracking-[0.18em] text-[#14120f]">
                {NUMBERS[i]}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{
                  opacity: 'var(--glare, 0)',
                  background:
                    'radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.45), transparent 55%)',
                }}
              />
            </div>

            <div>
              <p className="t-eyebrow">{o.quantity}</p>
              <p
                data-scroll3d
                className="t-serif mt-2 leading-none will-change-transform"
                style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)' }}
              >
                {o.price}
              </p>
              <h2 className="mt-5 text-[clamp(1.2rem,2vw,1.6rem)] font-semibold">
                {o.title}
                {o.qualifier && (
                  <span className="ml-3 text-[11px] font-normal uppercase tracking-[0.18em] text-fg-mute">
                    {o.qualifier}
                  </span>
                )}
              </h2>

              <ul className="mt-5 space-y-2 text-[15px] text-fg-dim">
                {o.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span aria-hidden className="h-[6px] w-[6px] rounded-full bg-gold" />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="t-serif mt-6 text-[clamp(1.2rem,2vw,1.6rem)] text-fg-mute">
                {o.line}
              </p>

              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="t-btn mt-7 inline-flex h-14 items-center rounded-[2px] border border-line px-8 hover:border-gold"
              >
                Ask for this offer →
              </button>
            </div>
          </div>
        </section>
      ))}

      <section className="border-y border-line bg-bg-2 py-6">
        <div className="shell flex flex-wrap justify-center gap-x-10 gap-y-3">
          {sale.marks.map((m) => (
            <span key={m} className="t-btn text-[10px] text-fg-dim">
              {m}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
