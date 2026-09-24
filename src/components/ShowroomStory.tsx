'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { stagger, useRevealGroup } from '@/lib/motion';

const BEATS = [
  {
    label: 'The Room',
    title: 'Warm light, dark wood, and a wall that says it plainly.',
    body:
      'The floor was built to be walked, not scrolled. Light falls on the fold, the rail sits ' +
      'at eye level, and nothing is stacked so high that you cannot reach it.',
  },
  {
    label: 'The Fit',
    title: 'Trying it on is the whole point.',
    body:
      'A photograph cannot tell you where a shoulder seam lands or how a hem breaks. That is ' +
      'what the mirror at the back is for — take the time, it is included.',
  },
  {
    label: 'The Feeling',
    title: site.phrase,
    body:
      'It is written on the counter because it is the honest version of what a clothing store ' +
      'does. You leave holding something, and you walk differently for the rest of the day.',
  },
];

/**
 * A sticky, Apple-style beat sequence built around the one real photograph of the store.
 * The image holds while the copy moves past it; each beat lights its own caption.
 */
export default function ShowroomStory() {
  const ref = useRevealGroup<HTMLDivElement>();
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = beatRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.beat);
          if (!Number.isNaN(i)) setActive(i);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="showroom-heading" className="relative bg-ink-2">
      <div ref={ref} className="shell section">
        <header className="mb-[clamp(3rem,7vw,6rem)] grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="t-label text-gold" data-rv>
              The Showroom
            </p>
            <h2 id="showroom-heading" className="t-display-l mt-6 text-cream" data-rv style={stagger(1)}>
              A floor, not a feed.
            </h2>
          </div>
          <p className="t-lead md:col-span-5" data-rv style={stagger(2)}>
            Everything below is the same room you will walk into on Sabji Mandi Road.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* sticky media */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-char sm:aspect-[3/2] lg:aspect-[4/5]" data-rv>
                <Image
                  src="/brand/showroom.jpg"
                  alt="Inside the BRAND STORE showroom: folded shirts on lit shelving, hanging tees, and the illuminated wall sign"
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(8,7,6,0.88) 0%, rgba(8,7,6,0.1) 45%, transparent 75%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                  {BEATS.map((beat, i) => (
                    <span
                      key={beat.label}
                      className={`t-label transition-all duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        i === active ? 'text-gold opacity-100' : 'text-cream-mute opacity-45'
                      }`}
                    >
                      {beat.label}
                    </span>
                  ))}
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 border border-line/70" />
              </div>

              {/* progress rule */}
              <div aria-hidden className="mt-4 h-px w-full bg-line">
                <div
                  className="h-px bg-gold transition-[width] duration-[640ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: `${((active + 1) / BEATS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* beats */}
          <div className="lg:col-span-6">
            {BEATS.map((beat, i) => (
              <div
                key={beat.label}
                data-beat={i}
                ref={(el) => {
                  beatRefs.current[i] = el;
                }}
                className="border-t border-line py-[clamp(2.5rem,7vh,5rem)] first:border-t-0 first:pt-0 lg:min-h-[64vh] lg:py-0 lg:pt-[clamp(3rem,9vh,7rem)]"
              >
                <span
                  className={`t-label block transition-colors duration-[520ms] ${
                    i === active ? 'text-gold' : 'text-cream-mute'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')} — {beat.label}
                </span>
                <h3
                  className={`t-display-m mt-6 max-w-[18ch] transition-colors duration-[520ms] ${
                    i === active ? 'text-cream' : 'text-cream-dim/55'
                  } ${i === 2 ? 'italic' : ''}`}
                >
                  {beat.title}
                </h3>
                <p className="t-body mt-6">{beat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
