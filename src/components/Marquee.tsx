import { site } from '@/data/site';

/**
 * A running band of the two phrases already painted on the shop wall. Duplicated once so the
 * loop is seamless; the copy is hidden from assistive tech so the line is announced only once.
 */
export default function Marquee() {
  const items = [site.phrase, site.tagline, site.segment, site.phrase, site.tagline, site.name];

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((text, i) => (
        <span key={`${text}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-8 font-display text-[clamp(1.4rem,2.4vw,2.4rem)] italic text-cream-dim/70">
            {text}
          </span>
          <span aria-hidden className="block h-1 w-1 rotate-45 bg-gold/70" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-2 py-7">
      <div className="marquee-track flex w-max" style={{ ['--marquee-dur' as string]: '48s' }}>
        {row(false)}
        {row(true)}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--color-ink-2) 0%, transparent 12%, transparent 88%, var(--color-ink-2) 100%)',
        }}
      />
    </div>
  );
}
