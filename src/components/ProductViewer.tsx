'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import GarmentFlat from './GarmentFlat';
import type { Category } from '@/data/catalog';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * One dominant image with the three views named beneath it, the way you would flip through
 * a lookbook. Views crossfade with a short directional drift so turning the garment reads as
 * one object moving rather than three pictures swapping.
 *
 * Desktop adds a shallow pointer parallax inside the frame; touch gets a swipe. Neither is
 * required to use it — the buttons are the control, everything else is grace.
 */
export default function ProductViewer({ category }: { category: Category }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const frame = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const go = useCallback(
    (next: number) => {
      setDir(next > index ? 1 : -1);
      setIndex((next + category.views.length) % category.views.length);
    },
    [index, category.views.length],
  );

  useEffect(() => setIndex(0), [category.slug]);

  // Swipe on touch; vertical drags stay with the page.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let sx = 0;
    let sy = 0;
    let live = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      sx = e.clientX;
      sy = e.clientY;
      live = true;
    };
    const up = (e: PointerEvent) => {
      if (!live) return;
      live = false;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      setDir(dx < 0 ? 1 : -1);
      setIndex((c) => (c + (dx < 0 ? 1 : -1) + category.views.length) % category.views.length);
    };

    el.addEventListener('pointerdown', down, { passive: true });
    el.addEventListener('pointerup', up, { passive: true });
    el.addEventListener('pointercancel', () => { live = false; }, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
    };
  }, [category.views.length]);

  // Shallow parallax inside the frame, fine pointers only.
  useEffect(() => {
    if (reduced) return;
    const el = frame.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--px', `${(((e.clientX - r.left) / r.width - 0.5) * -14).toFixed(1)}px`);
        el.style.setProperty('--py', `${(((e.clientY - r.top) / r.height - 0.5) * -14).toFixed(1)}px`);
      });
    };
    const leave = () => {
      el.style.setProperty('--px', '0px');
      el.style.setProperty('--py', '0px');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1);
    if (e.key === 'ArrowLeft') go(index - 1);
  };

  return (
    <div>
      <div
        ref={frame}
        tabIndex={0}
        onKeyDown={onKey}
        role="group"
        aria-roledescription="Garment views"
        aria-label={`${category.name} — front, side and back. Use the left and right arrow keys to change view.`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2 outline-none sm:aspect-[3/2] lg:aspect-[4/5]"
        style={{ touchAction: 'pan-y' }}
      >
        {category.views.map((view, i) => {
          const current = i === index;
          return (
            <div
              key={view.key}
              aria-hidden={!current}
              className="absolute inset-0 transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: current ? 1 : 0,
                transform: current
                  ? 'translate3d(var(--px, 0px), var(--py, 0px), 0)'
                  : `translate3d(${dir * 4}%, 0, 0)`,
                pointerEvents: current ? 'auto' : 'none',
              }}
            >
              {view.src ? (
                <img
                  src={view.src}
                  srcSet={view.srcSmall ? `${view.srcSmall} 640w, ${view.src} 1200w` : undefined}
                  sizes="(max-width: 1024px) 92vw, 52vw"
                  alt={view.alt}
                  width={view.width ?? undefined}
                  height={view.height ?? undefined}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center p-[10%]">
                  <GarmentFlat
                    garment={category.garment}
                    view={view.key}
                    tone="#3B352D"
                    onLight
                    className="h-full w-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* The control: three words, not three thumbnails. */}
      <div className="mt-5 flex items-center gap-7">
        {category.views.map((view, i) => (
          <button
            key={view.key}
            type="button"
            onClick={() => go(i)}
            aria-pressed={i === index}
            className={`relative pb-2 text-[0.92rem] font-semibold transition-colors duration-200 ${
              i === index ? 'text-on-paper' : 'text-on-paper-mute hover:text-on-paper'
            }`}
          >
            {view.label}
            <span
              aria-hidden
              className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === index ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        ))}
        <span className="ml-auto text-[0.82rem] text-on-paper-mute">
          <span className="hidden sm:inline">Drag to turn</span>
          <span className="sm:hidden">Swipe</span>
        </span>
      </div>
    </div>
  );
}
