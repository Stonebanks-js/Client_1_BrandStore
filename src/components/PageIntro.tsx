'use client';

import { stagger, useRevealGroup } from '@/lib/motion';

/**
 * Interior page opener. Deliberately quieter than the home hero — one rule, one label, one
 * headline, one lead — so the pages behind it never compete with the front door.
 */
export default function PageIntro({
  label,
  title,
  lead,
  aside,
}: {
  label: string;
  title: React.ReactNode;
  lead?: string;
  aside?: React.ReactNode;
}) {
  const ref = useRevealGroup<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden border-b border-line bg-ink pb-[clamp(3rem,7vw,6rem)] pt-[calc(var(--header-h)+clamp(4rem,11vh,9rem))]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 18% 0%, color-mix(in srgb, var(--color-amber) 7%, transparent) 0%, transparent 62%)',
        }}
      />
      <div ref={ref} className="shell relative">
        <div className="flex items-center gap-5" data-rv>
          <span className="t-label text-gold">{label}</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>

        <div className="mt-[clamp(2rem,5vw,3.5rem)] grid gap-8 md:grid-cols-12 md:items-end">
          <h1 className="t-display-l text-cream md:col-span-7" data-rv style={stagger(1)}>
            {title}
          </h1>
          {lead && (
            <p className="t-lead md:col-span-5" data-rv style={stagger(2)}>
              {lead}
            </p>
          )}
          {aside}
        </div>
      </div>
    </section>
  );
}
