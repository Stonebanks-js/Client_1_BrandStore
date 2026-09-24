'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import GarmentPlate from './GarmentPlate';
import type { Category } from '@/data/catalog';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * The category experience: one large plate, three views, and a pointer-driven tilt that gives
 * the frame a shallow sense of depth without ever moving the garment off-centre. Views
 * crossfade rather than slide, so front/side/back read as the same object turning.
 *
 * Desktop gets the tilt and the hover states; touch gets a horizontal swipe and large tap
 * targets, with no hover dependency anywhere. Both share the same crossfade.
 */
export default function ProductViewer({ category }: { category: Category }) {
  const [index, setIndex] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const go = useCallback(
    (next: number) => setIndex((next + category.views.length) % category.views.length),
    [category.views.length],
  );

  // Reset when the visitor moves to another category.
  useEffect(() => setIndex(0), [category.slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    const el = frame.current;
    el?.addEventListener('keydown', onKey as EventListener);
    return () => el?.removeEventListener('keydown', onKey as EventListener);
  }, [go, index]);

  // Touch: swipe left/right through the views. Vertical drags are left to the page so
  // swiping past the viewer never traps the scroll.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      startX = e.clientX;
      startY = e.clientY;
      tracking = true;
    };
    const onUp = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      setIndex((current) => {
        const next = dx < 0 ? current + 1 : current - 1;
        return (next + category.views.length) % category.views.length;
      });
    };

    el.addEventListener('pointerdown', onDown, { passive: true });
    el.addEventListener('pointerup', onUp, { passive: true });
    el.addEventListener('pointercancel', () => { tracking = false; }, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
    };
  }, [category.views.length]);

  useEffect(() => {
    if (reduced) return;
    const el = frame.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
        el.style.setProperty('--shift-x', `${(x * -10).toFixed(1)}px`);
        el.style.setProperty('--shift-y', `${(y * -10).toFixed(1)}px`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
      el.style.setProperty('--shift-x', '0px');
      el.style.setProperty('--shift-y', '0px');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* stage */}
      <div className="lg:col-span-8">
        <div
          ref={frame}
          tabIndex={0}
          role="group"
          aria-roledescription="Garment views"
          aria-label={`${category.name} — front, side and back views. Use the left and right arrow keys to change view.`}
          className="relative aspect-[4/5] w-full overflow-hidden bg-char outline-none transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:aspect-[3/2] lg:aspect-[7/8]"
          style={{
            perspective: '1400px',
            touchAction: 'pan-y',
            transform:
              'rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translate3d(0,0,0)',
            transformStyle: 'preserve-3d',
          }}
        >
          {category.views.map((view, i) => (
            <div
              key={view.key}
              aria-hidden={i !== index}
              className="absolute inset-0 transition-[opacity,transform] duration-[760ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: i === index ? 1 : 0,
                transform:
                  i === index
                    ? 'translate3d(var(--shift-x, 0px), var(--shift-y, 0px), 0) scale(1)'
                    : 'translate3d(0,0,0) scale(1.05)',
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              <GarmentPlate
                category={category}
                view={view}
                priority={i === 0}
                showLabel={false}
                className="h-full w-full"
                sizes="(max-width: 1024px) 92vw, 62vw"
              />
            </div>
          ))}

          {/* view label */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 p-5 sm:p-7">
            <span className="t-label text-cream">{category.views[index].label} view</span>
            <span className="t-label flex items-center gap-4 text-cream-mute">
              <span className="hidden sm:inline">Drag to turn</span>
              <span className="sm:hidden">Swipe</span>
              <span aria-hidden className="h-2.5 w-px bg-gold/45" />
              {String(index + 1).padStart(2, '0')} / {String(category.views.length).padStart(2, '0')}
            </span>
          </div>

          <div aria-hidden className="pointer-events-none absolute inset-0 z-30 border border-line/70" />
        </div>

        {/* thumbnails */}
        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          {category.views.map((view, i) => (
            <button
              key={view.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              className={`group relative aspect-[4/5] overflow-hidden border transition-colors duration-[320ms] sm:aspect-square ${
                i === index ? 'border-gold' : 'border-line hover:border-gold/50'
              }`}
            >
              <GarmentPlate
                category={category}
                view={view}
                showLabel={false}
                className={`h-full w-full transition-opacity duration-[320ms] ${
                  i === index ? 'opacity-100' : 'opacity-55 group-hover:opacity-85'
                }`}
                sizes="30vw"
              />
              <span className="t-label absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink/90 to-transparent p-3 text-left text-cream">
                {view.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* notes */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
          <p className="t-label text-gold">
            {category.group === 'top' ? 'Top Wear' : 'Bottom Wear'}
          </p>
          <h2 className="t-display-m mt-5 text-cream">{category.name}</h2>
          <p className="mt-5 font-display text-[clamp(1.15rem,1.7vw,1.45rem)] italic text-cream-dim">
            {category.lede}
          </p>

          <div className="hairline my-8" />

          {category.body.map((para) => (
            <p key={para.slice(0, 24)} className="t-body mt-5 first:mt-0">
              {para}
            </p>
          ))}

          <ul className="mt-9 border-t border-line">
            {category.notes.map((note) => (
              <li
                key={note}
                className="flex items-center gap-4 border-b border-line py-4 text-[0.975rem] text-cream-dim"
              >
                <span aria-hidden className="block h-1 w-1 rotate-45 bg-gold" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
