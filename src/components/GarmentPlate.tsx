import GarmentFlat from './GarmentFlat';
import type { Category, CategoryView } from '@/data/catalog';

/**
 * One framed view of a category. Renders the photograph when `view.src` exists, and the
 * drafted flat when it does not — the surrounding art direction is identical either way,
 * so adding imagery later changes nothing about the layout.
 *
 * Photographs use a plain `<img>` with a real `srcset` rather than `next/image`: the site is
 * a static export with the optimiser turned off, so `next/image` would emit one source and
 * phones would download the 1200px file. The generator writes a 640px variant for exactly
 * this reason. Intrinsic dimensions come from the manifest, so the frame reserves its space
 * and nothing shifts.
 */
export default function GarmentPlate({
  category,
  view,
  priority = false,
  showLabel = true,
  className = '',
  sizes = '(max-width: 860px) 92vw, 42vw',
}: {
  category: Category;
  view: CategoryView;
  priority?: boolean;
  showLabel?: boolean;
  className?: string;
  sizes?: string;
}) {
  const srcSet = view.src
    ? [view.srcSmall ? `${view.srcSmall} 640w` : null, `${view.src} 1200w`]
        .filter(Boolean)
        .join(', ')
    : undefined;

  return (
    <figure
      className={`relative isolate overflow-hidden bg-char ${className}`}
      style={{ ['--tone' as string]: category.tone }}
    >
      {/* warm key light, top-left, matching the showroom's lighting direction */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(105% 80% at 28% 6%, color-mix(in srgb, var(--tone) 24%, transparent) 0%, transparent 62%),' +
            'radial-gradient(85% 65% at 78% 104%, rgba(0,0,0,0.6) 0%, transparent 62%)',
        }}
      />

      {view.src ? (
        <img
          src={view.src}
          srcSet={srcSet}
          sizes={sizes}
          alt={view.alt}
          width={view.width ?? undefined}
          height={view.height ?? undefined}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 z-10 grid place-items-center p-[5%]">
          <GarmentFlat
            garment={category.garment}
            view={view.key}
            tone={category.tone}
            className="h-full w-full"
          />
        </div>
      )}

      {/* hairline frame */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 border border-line/80" />

      {showLabel && (
        <figcaption className="absolute bottom-0 left-0 z-20 flex w-full items-end justify-between p-4 sm:p-5">
          <span className="t-label text-cream-mute">{view.label}</span>
          {!view.src && (
            <span className="t-label text-cream-mute" title="Technical drawing, not a photograph">
              Drafted
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
