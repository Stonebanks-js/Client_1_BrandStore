'use client';

import { useEffect, useMemo, useState } from 'react';

import { categories, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { MaskLine } from '@/components/Masked';

type Filter = 'all' | 'sale' | string;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'On sale' },
  ...categories.map((c) => ({ id: c.id as Filter, label: c.name })),
];

export default function Shop() {
  const [filter, setFilter] = useState<Filter>('all');

  // The categories card links here with ?c=<id>. Read it on mount rather than through
  // useSearchParams, which would force a Suspense boundary in a static export.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('c');
    if (c && FILTERS.some((f) => f.id === c)) setFilter(c);
  }, []);

  const shown = useMemo(() => {
    if (filter === 'all') return products;
    if (filter === 'sale') return products.filter((p) => p.sale);
    return products.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <>
      <section className="shell pt-[clamp(32px,5vw,80px)]">
        <h1 className="t-display" style={{ fontSize: 'clamp(4.4rem, 12vw, 12rem)' }}>
          <MaskLine>Shop</MaskLine>
        </h1>
        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-fg-dim">
          {products.length} lines across eight rails. Everything is sold in store — pick
          what you want here and message us to have it kept aside.
        </p>
      </section>

      <div className="sticky top-[clamp(60px,7vw,76px)] z-30 mt-8 border-y border-line bg-[var(--header-bg)] backdrop-blur-[14px]">
        <div
          className="flex gap-2 overflow-x-auto px-[clamp(16px,5vw,80px)] py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter products"
        >
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`t-btn h-10 shrink-0 rounded-full border px-5 text-[10px] transition-colors ${
                  active
                    ? 'border-btn-bg bg-btn-bg text-btn-fg'
                    : 'border-line text-fg-dim hover:border-gold hover:text-fg'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="shell py-[clamp(32px,5vw,80px)]">
        <div
          className="grid"
          style={{
            gridTemplateColumns:
              'repeat(auto-fill, minmax(clamp(150px, 40vw, 280px), 1fr))',
            gap: 'clamp(28px, 3vw, 48px) clamp(12px, 2vw, 28px)',
          }}
        >
          {shown.map((p) => (
            <div key={p.id} data-reveal>
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="py-16 text-center text-[15px] text-fg-mute">
            Nothing on this rail yet — message us and we will tell you what has just come in.
          </p>
        )}
      </section>
    </>
  );
}
