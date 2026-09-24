'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import GarmentFlat from './GarmentFlat';
import { categoryGallery, type Category } from '@/data/catalog';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * One dominant image with its variants named beneath it, the way you would flip through a
 * lookbook. They crossfade with a short directional drift so moving between them reads as
 * one garment changing rather than pictures swapping.
 *
 * Where the client has photographed the real colourways, those are what is shown — labelled
 * by colour, because that is what they are. Only categories with no photography fall back to
 * the drafted front/side/back flats.
 *
 * Desktop adds a shallow pointer parallax inside the frame; touch gets a swipe. Neither is
 * required to use it — the buttons are the control, everything else is grace.
 */
export default function ProductViewer({ category }: { category: Category }) {
  const gallery = categoryGallery(category.slug);
  const shots = gallery.length
    ? gallery
    : category.views.map((v) => ({
        label: v.label,
        src: v.src,
        srcSmall: v.srcSmall,
        width: v.width,
        height: v.height,
        bg: undefined as string | undefined,
        view: v.key,
      }));
  const isGallery = gallery.length > 0;

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const frame = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const go = useCallback(
    (next: number) => {
      setDir(next > index ? 1 : -1);
      setIndex((next + shots.length) % shots.length);
    },
    [index, shots.length],
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
      setIndex((c) => (c + (dx < 0 ? 1 : -1) + shots.length) % shots.length);
    };

    el.addEventListener('pointerdown', down, { passive: true });
    el.addEventListener('pointerup', up, { passive: true });
    el.addEventListener('pointercancel', () => { live = false; }, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
    };
  }, [shots.length]);

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
        aria-label={
          isGallery
            ? `${category.name} — ${shots.length} colourways. Use the left and right arrow keys to change.`
            : `${category.name} — front, side and back. Use the left and right arrow keys to change view.`
        }
        className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2 outline-none sm:aspect-[3/2] lg:aspect-[4/5]"
        style={{ touchAction: 'pan-y', background: shots[index]?.bg ?? undefined }}
      >
        {shots.map((shot, i) => {
          const current = i === index;
          return (
            <div
              key={shot.label}
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
              {shot.src ? (
                <img
                  src={shot.src}
                  srcSet={shot.srcSmall ? `${shot.srcSmall} 520w, ${shot.src} 900w` : undefined}
                  sizes="(max-width: 1024px) 92vw, 52vw"
                  alt={`${category.name} — ${shot.label}`}
                  width={shot.width ?? undefined}
                  height={shot.height ?? undefined}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`absolute inset-0 h-full w-full ${
                    isGallery ? 'object-contain' : 'scale-[1.04] object-cover'
                  }`}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center p-[10%]">
                  <GarmentFlat
                    garment={category.garment}
                    view={'view' in shot ? shot.view : 'front'}
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

      {/* The control: the names, not a row of thumbnails. Five colourways have to wrap. */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {shots.map((shot, i) => (
          <button
            key={shot.label}
            type="button"
            onClick={() => go(i)}
            aria-pressed={i === index}
            className={`relative pb-2 text-[0.92rem] font-semibold transition-colors duration-200 ${
              i === index ? 'text-on-paper' : 'text-on-paper-mute hover:text-on-paper'
            }`}
          >
            {shot.label}
            <span
              aria-hidden
              className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === index ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        ))}
        <span className="ml-auto text-[0.82rem] text-on-paper-mute">
          {isGallery ? 'Colourways in store' : 'Swipe to turn'}
        </span>
      </div>
    </div>
  );
}
