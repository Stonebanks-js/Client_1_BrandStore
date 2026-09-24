import Link from 'next/link';
import GarmentFlat from './GarmentFlat';
import { categoryImage, type Category } from '@/data/catalog';

/**
 * The way a category is shown anywhere it appears as a whole: the garment photograph
 * filling the frame, with its name on a solid bar across the foot. No number, no eyebrow,
 * no hover arrow — the picture is the thing, the bar tells you what it is.
 *
 * Categories the client has not photographed yet fall back to the drafted flat on a light
 * plate, so the row stays even and nothing looks broken.
 */
export default function CategoryTile({
  category,
  priority = false,
  ratio = 'aspect-[4/5]',
  sizes = '(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 24vw',
}: {
  category: Category;
  priority?: boolean;
  ratio?: string;
  sizes?: string;
}) {
  const image = categoryImage(category.slug);

  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group block focus-visible:outline-offset-4"
      aria-label={`${category.name} — view the collection`}
    >
      <div
        className={`relative overflow-hidden bg-paper-2 ${ratio}`}
        style={image?.bg ? { background: image.bg } : undefined}
      >
        {image ? (
          <img
            src={image.src}
            srcSet={image.srcSmall ? `${image.srcSmall} 640w, ${image.src} 1200w` : undefined}
            sizes={sizes}
            alt=""
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-paper-2 p-[14%]">
            <GarmentFlat
              garment={category.garment}
              view="front"
              tone="#3B352D"
              onLight
              className="h-full w-full"
            />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-paper/92 px-4 py-3 backdrop-blur-[2px] sm:px-5 sm:py-3.5">
          <span className="t-tile block text-on-paper">{category.name}</span>
        </div>
      </div>
    </Link>
  );
}
