'use client';

import Image from 'next/image';

import { categoryName, priceLabel, type Product } from '@/data/products';
import { openWhatsApp } from '@/lib/whatsapp';

/** Cards never render wider than ~280px, so the 640px variant is the right source. */
export const thumb = (src: string) => src.replace(/\.webp$/, '@640.webp');

const STRIPES =
  'repeating-linear-gradient(135deg, var(--bg-2) 0 9px, var(--bg) 9px 18px)';

export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <button
      type="button"
      data-tilt="0.9"
      onClick={() => openWhatsApp()}
      aria-label={`${p.name}. Enquire on WhatsApp`}
      className="group block w-full cursor-pointer text-left [transform-style:preserve-3d] hover:[box-shadow:0_24px_48px_rgba(8,7,6,0.22)]"
    >
      <div
        className="relative isolate aspect-[3/4] overflow-hidden rounded-[2px]"
        style={{ background: p.bg || 'var(--bg-2)' }}
      >
        {p.primaryImage ? (
          <>
            <Image
              data-pop
              src={thumb(p.primaryImage)}
              alt={p.name}
              fill
              sizes="(max-width: 1023px) 40vw, 280px"
              className="object-contain object-[center_60%] transition-[scale,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0"
            />
            {p.secondaryImage && (
              <Image
                data-pop
                src={thumb(p.secondaryImage)}
                alt=""
                fill
                sizes="(max-width: 1023px) 40vw, 280px"
                className="object-contain object-[center_60%] opacity-0 transition-opacity duration-[320ms] group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{ background: STRIPES }}
          >
            <span className="font-mono text-[10px] lowercase tracking-[0.18em] text-fg-mute">
              product shot · {categoryName(p.category)}
            </span>
          </div>
        )}

        {p.badge && (
          <span className="absolute left-0 top-0 bg-[#14120f] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f7f6f3]">
            {p.badge}
          </span>
        )}
        {p.offer && (
          <span className="absolute bottom-0 left-0 bg-[#14120f] px-2.5 py-1.5 text-[12px] font-bold text-signal">
            {p.offer}
          </span>
        )}

        {/* Pointer glare, driven by MotionLayer's --mx/--my/--glare. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-300"
          style={{
            opacity: 'var(--glare, 0)',
            background:
              'radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.45), transparent 55%)',
          }}
        />
      </div>

      <div className="pt-4">
        <p className="t-eyebrow text-[10px]">{categoryName(p.category)}</p>
        <h3 className="mt-2 text-[15px] font-semibold leading-snug">{p.name}</h3>
        <p className="mt-1 text-[13px] text-fg-dim">{priceLabel(p)}</p>

        {p.colors.length > 0 && (
          <span className="mt-3 flex items-center gap-1.5" aria-hidden>
            {p.colors.map((c) => (
              <span
                key={c.hex}
                title={c.name}
                className="h-[10px] w-[10px] rounded-full border border-line"
                style={{ background: c.hex }}
              />
            ))}
          </span>
        )}

        <span className="t-btn mt-4 block text-[11px] text-accent">
          Enquire on WhatsApp →
        </span>
      </div>
    </button>
  );
}
