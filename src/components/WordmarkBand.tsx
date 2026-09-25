import { site } from '@/data/site';

/**
 * The full-bleed wordmark that closes every page. It drifts horizontally with
 * scroll (`data-scrollx`), so the line is always slightly off-register.
 */
export default function WordmarkBand() {
  return (
    <section
      aria-hidden
      className="overflow-hidden border-t border-line bg-bg py-[clamp(28px,5vw,64px)]"
    >
      <div
        data-scrollx="0.45"
        className="flex w-max items-baseline gap-[0.22em] whitespace-nowrap pl-[6vw] will-change-transform"
        style={{ fontSize: 'clamp(5rem, 17vw, 18rem)' }}
      >
        <span
          className="t-display"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1.5px var(--fg)',
          }}
        >
          {site.name}
        </span>
        <span className="t-serif text-gold" style={{ fontSize: '0.26em' }}>
          Wear your story
        </span>
        <span className="t-display">{site.segment}</span>
      </div>
    </section>
  );
}
