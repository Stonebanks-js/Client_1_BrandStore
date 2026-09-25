'use client';

import Image from 'next/image';
import Link from 'next/link';

import { site } from '@/data/site';
import { openWhatsApp } from '@/lib/whatsapp';
import { MaskLine } from '@/components/Masked';

const EYEBROW = `${site.segment} · ${site.address.line1}, ${site.address.city}`;

/** The showroom photograph: parallax on the frame, intro scale/brightness on the plate. */
function Photo({ className = '', priority = true }: { className?: string; priority?: boolean }) {
  return (
    <div className={`overflow-hidden bg-bg-2 ${className}`}>
      <div data-parallax="0.2" className="absolute inset-0 will-change-transform">
        <div data-hero-photo className="absolute inset-0">
          <Image
            src={site.images.showroom}
            alt="Inside the Brand Store floor in Arya Nagar, Kanpur"
            fill
            priority={priority}
            sizes="(max-width: 1023px) 100vw, 60vw"
            className="object-cover object-[50%_42%]"
          />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section>
      {/* ------------------------------- desktop ------------------------------- */}
      <div
        className="hidden lg:grid lg:grid-cols-[5fr_7fr]"
        style={{ minHeight: 'min(calc(100svh - 76px), 940px)' }}
      >
        <div className="flex flex-col justify-center gap-8 py-[clamp(48px,6vw,96px)] pl-[clamp(16px,5vw,80px)] pr-[clamp(32px,4vw,72px)]">
          <p className="t-eyebrow">{EYEBROW}</p>

          <h1>
            <MaskLine className="t-serif">
              <span style={{ fontSize: 'clamp(2.8rem, 4.6vw, 6rem)' }}>Good Clothes</span>
            </MaskLine>
            <span
              className="t-display mt-2 block"
              style={{ fontSize: 'clamp(3.6rem, 7.4vw, 9.6rem)' }}
            >
              <MaskLine>Better</MaskLine>
              <MaskLine className="text-gold">Mood</MaskLine>
            </span>
          </h1>

          <p className="max-w-[42ch] text-[16px] leading-relaxed text-fg-dim">
            Top wear and bottom wear for men, picked one rail at a time — cotton that
            holds its shape, fits that sit where they should, and prices that make sense
            on Sabji Mandi Road.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-magnetic
              onClick={() => openWhatsApp()}
              className="t-btn inline-flex h-14 items-center rounded-[2px] bg-btn-bg px-8 text-btn-fg"
            >
              Catalog on WhatsApp →
            </button>
            <Link
              href="/sale"
              className="t-btn inline-flex h-14 items-center rounded-[2px] border border-line px-8 hover:border-gold"
            >
              Off Season Sale
            </Link>
          </div>

          <p className="t-serif text-[clamp(1.1rem,1.5vw,1.5rem)] text-fg-mute">
            {site.tagline.map((word) => `— ${word} `)}
          </p>
        </div>

        <div className="relative">
          <Photo className="relative h-full w-full" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background: 'linear-gradient(to top, rgba(20,18,15,.8), transparent)',
            }}
          />
          <p className="absolute bottom-6 left-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e6e2d8]">
            The floor · {site.address.line1}
          </p>
        </div>
      </div>

      {/* -------------------------------- mobile -------------------------------- */}
      <div className="lg:hidden">
        <div
          className="relative"
          style={{
            height: 'calc(100svh - clamp(60px,7vw,76px) - 76px)',
            minHeight: '420px',
          }}
        >
          <Photo className="absolute inset-0" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #14120f 0%, rgba(20,18,15,.92) 38%, rgba(20,18,15,.7) 62%, rgba(20,18,15,.15) 88%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 px-[clamp(16px,5vw,80px)] pb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e3be79]">
              {EYEBROW}
            </p>
            <h1 className="mt-4 text-[#f7f6f3]">
              <MaskLine className="t-serif">
                <span style={{ fontSize: 'clamp(2.2rem, 10vw, 3.4rem)' }}>Good Clothes</span>
              </MaskLine>
              <span
                className="t-display mt-1 block"
                style={{ fontSize: 'clamp(3.6rem, 19vw, 6.4rem)' }}
              >
                <MaskLine>Better</MaskLine>
                <MaskLine>
                  <span style={{ color: '#e3be79' }}>Mood</span>
                </MaskLine>
              </span>
            </h1>
          </div>
        </div>

        <Link
          href="/sale"
          className="flex items-center gap-3 border-b border-line bg-bg px-[clamp(16px,5vw,80px)] py-5"
        >
          <span
            className="t-display text-[22px] text-signal"
            style={{ WebkitTextStroke: '0.6px var(--fg)' }}
          >
            Sale
          </span>
          <span className="text-[13px] text-fg-dim">Four offers from ₹999 →</span>
        </Link>
      </div>
    </section>
  );
}
