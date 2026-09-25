'use client';

import { useEffect } from 'react';

/**
 * Every scroll- and pointer-driven effect on the site, in one rAF loop.
 *
 * The design reference implements the whole motion layer this way — one frame callback
 * reading `data-*` markers — and the maths below is that reference's, unchanged. Keeping
 * it as a single controller rather than a hook per component means one listener set, one
 * frame, and exact parity with the handoff values.
 *
 * Markers:
 *   data-progress      scroll progress bar (scaleX)
 *   data-parallax="n"  translateY against the parent, clamped to ±4.5% of its height
 *   data-scroll3d      rotateX/translateZ as the parent crosses the viewport
 *   data-scrollx="n"   horizontal drift with scroll
 *   data-ticker        marquee; scroll velocity drives rate and skew
 *   data-tilt="n"      pointer tilt + glare (fine pointers only)
 *   data-magnetic      pull toward the pointer
 *   data-reveal        enter from below on first intersection
 *   data-word          masked headline line
 *   data-hero-photo    intro scale/brightness
 *
 * Everything here is skipped under prefers-reduced-motion; the progress bar still tracks.
 */

const EASE = 'cubic-bezier(0.16,1,0.3,1)';
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function MotionLayer() {
  useEffect(() => {
    let raf = 0;
    let lastY: number | null = null;
    let tickerAnim: Animation | null = null;
    let tickerEl: HTMLElement | null = null;
    let tickerTimer: number | undefined;
    let tilt: HTMLElement | null = null;
    let mag: HTMLElement | null = null;

    /* --- hero intro + ticker start ------------------------------------- */
    const startOnce = () => {
      document
        .querySelectorAll<HTMLElement>('[data-hero-photo]:not([data-done])')
        .forEach((el) => {
          el.dataset.done = '1';
          el.style.scale = '1.1';
          if (reduced()) return;
          el.animate(
            [
              { scale: '1.3', filter: 'brightness(0.4)' },
              { scale: '1.1', filter: 'brightness(1)' },
            ],
            { duration: 2400, easing: 'cubic-bezier(0.22,1,0.36,1)' },
          );
        });

      const t = document.querySelector<HTMLElement>('[data-ticker]');
      if (t && t !== tickerEl) {
        tickerEl = t;
        if (!reduced()) {
          tickerAnim = t.animate(
            [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
            { duration: 32000, iterations: Infinity },
          );
        }
      }
    };

    /* --- masked headline lines ------------------------------------------ */
    const animateWords = () => {
      if (reduced()) return;
      document
        .querySelectorAll<HTMLElement>('[data-word]:not([data-done])')
        .forEach((el, i) => {
          el.dataset.done = '1';
          el.animate(
            [{ transform: 'translateY(115%) rotate(5deg)' }, { transform: 'none' }],
            { duration: 1100, delay: 120 + i * 110, easing: EASE, fill: 'backwards' },
          );
        });
    };

    /* --- reveal ---------------------------------------------------------- */
    let io: IntersectionObserver | null = null;
    const reveal = () => {
      if (reduced() || !('IntersectionObserver' in window)) {
        document
          .querySelectorAll<HTMLElement>('[data-reveal][data-hidden]')
          .forEach((el) => el.removeAttribute('data-hidden'));
        return;
      }
      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            entries
              .filter((en) => en.isIntersecting)
              .forEach((en, i) => {
                const el = en.target as HTMLElement;
                io!.unobserve(el);
                el.removeAttribute('data-hidden');
                el.animate(
                  [
                    {
                      opacity: 0,
                      transform:
                        'perspective(1200px) translateY(64px) rotateX(-14deg) scale(0.96)',
                    },
                    { opacity: 1, transform: 'none' },
                  ],
                  { duration: 1000, delay: i * 90, easing: EASE, fill: 'backwards' },
                );
              });
          },
          { rootMargin: '0px 0px -6% 0px' },
        );
      }
      const vh = window.innerHeight;
      document
        .querySelectorAll<HTMLElement>('[data-reveal]:not([data-watched])')
        .forEach((el) => {
          el.dataset.watched = '1';
          if (el.getBoundingClientRect().top > vh * 0.94) {
            el.setAttribute('data-hidden', '');
            io!.observe(el);
          }
        });
    };

    /* --- frame ----------------------------------------------------------- */
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const vel = y - (lastY == null ? y : lastY);
      lastY = y;

      const bar = document.querySelector<HTMLElement>('[data-progress]');
      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }

      if (reduced()) return;

      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const off = r.top + r.height / 2 - vh / 2;
        const lim = r.height * 0.045;
        const speed = Number(el.dataset.parallax) || 0;
        el.style.translate = `0 ${clamp(-off * speed, -lim, lim).toFixed(1)}px`;
      });

      document.querySelectorAll<HTMLElement>('[data-scroll3d]').forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 1.6), -1, 1);
        el.style.transformOrigin = '0% 100%';
        el.style.transform = `perspective(1200px) rotateX(${(p * 32).toFixed(2)}deg) translateZ(${(-Math.abs(p) * 80).toFixed(1)}px)`;
        el.style.opacity = String(1 - Math.max(0, p - 0.4) * 0.8);
      });

      document.querySelectorAll<HTMLElement>('[data-scrollx]').forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const speed = Number(el.dataset.scrollx) || 0;
        el.style.transform = `translate3d(${((r.top - vh * 0.3) * speed).toFixed(1)}px,0,0)`;
      });

      if (tickerEl && tickerAnim) {
        const k = clamp(vel, -60, 60);
        tickerAnim.playbackRate = (vel >= 0 ? 1 : -1) * (1 + Math.abs(k) / 8);
        const wrap = tickerEl.parentElement;
        if (wrap) wrap.style.transform = `skewX(${(-k / 6).toFixed(2)}deg)`;
        window.clearTimeout(tickerTimer);
        tickerTimer = window.setTimeout(() => {
          if (tickerAnim) tickerAnim.playbackRate = 1;
          if (wrap) wrap.style.transform = '';
        }, 140);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    /* --- pointer: tilt + magnetic ---------------------------------------- */
    const resetTilt = (t: HTMLElement) => {
      t.style.transition = `transform 700ms ${EASE}`;
      t.style.transform = t.dataset.tiltBase || '';
      t.style.setProperty('--glare', '0');
      t.querySelectorAll<HTMLElement>('[data-pop]').forEach((i) => {
        i.style.scale = '';
      });
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || reduced()) return;
      const target = e.target as HTMLElement | null;

      const t = target?.closest?.('[data-tilt]') as HTMLElement | null;
      if (tilt && tilt !== t) resetTilt(tilt);
      tilt = t;
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const amt = Number(t.dataset.tilt) || 1;
        t.style.transition = 'transform 140ms ease-out';
        t.style.transform = `perspective(1000px) ${t.dataset.tiltBase || ''} rotateX(${((0.5 - py) * 10 * amt).toFixed(2)}deg) rotateY(${((px - 0.5) * 12 * amt).toFixed(2)}deg) translateY(-6px)`;
        t.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        t.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
        t.style.setProperty('--glare', '1');
        t.querySelectorAll<HTMLElement>('[data-pop]').forEach((i) => {
          i.style.scale = '1.07';
        });
      }

      const m = target?.closest?.('[data-magnetic]') as HTMLElement | null;
      if (mag && mag !== m) {
        mag.style.transition = `translate 500ms ${EASE}`;
        mag.style.translate = '';
      }
      mag = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.transition = 'translate 160ms ease-out';
        m.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('pointermove', onPointer, { passive: true });

    startOnce();
    const kick = window.setTimeout(() => {
      reveal();
      animateWords();
      frame();
    }, 60);

    // Route changes swap the tree without remounting this component.
    const mo = new MutationObserver(() => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        startOnce();
        reveal();
        animateWords();
        frame();
      }, 40);
    });
    let settle = 0;
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(kick);
      window.clearTimeout(settle);
      window.clearTimeout(tickerTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointermove', onPointer);
      mo.disconnect();
      io?.disconnect();
      tickerAnim?.cancel();
    };
  }, []);

  return null;
}
