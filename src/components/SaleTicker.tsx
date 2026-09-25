import Link from 'next/link';

import { sale } from '@/data/products';

/**
 * The yellow band under the hero. One link, one duplicated list; MotionLayer runs the
 * 32s loop and lets scroll velocity push the speed and skew.
 */
export default function SaleTicker() {
  const items = [...sale.offers, ...sale.offers];

  return (
    <Link
      href="/sale"
      aria-label={`${sale.title} — see all four offers`}
      className="block overflow-hidden border-y border-[#14120f] bg-[#f5d90a] py-3 text-[#14120f]"
    >
      <div className="transition-transform duration-200">
        <div data-ticker className="flex w-max items-center gap-8 will-change-transform">
          {items.map((o, i) => (
            <span key={`${o.id}-${i}`} className="flex items-center gap-8">
              <span className="flex items-baseline gap-3">
                <span
                  className="t-display"
                  style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3.6rem)' }}
                >
                  {o.quantity} {o.price}
                </span>
                <span className="t-serif text-[clamp(1rem,1.4vw,1.4rem)]">{o.title}</span>
              </span>
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#14120f]" />
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
