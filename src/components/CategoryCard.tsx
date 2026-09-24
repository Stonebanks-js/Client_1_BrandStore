import Link from 'next/link';
import GarmentPlate from './GarmentPlate';
import { ArrowIcon } from './icons';
import type { Category } from '@/data/catalog';

export default function CategoryCard({
  category,
  index,
  ratio = 'aspect-[4/5]',
}: {
  category: Category;
  index: number;
  ratio?: string;
}) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group relative block focus-visible:outline-offset-4"
      data-rv
    >
      <div className={`relative overflow-hidden bg-char ${ratio}`}>
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <GarmentPlate
            category={category}
            view={category.views[0]}
            showLabel={false}
            className="h-full w-full"
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
          />
        </div>

        {/* number plate */}
        <span className="t-label absolute left-4 top-4 z-30 text-cream-mute sm:left-5 sm:top-5">
          {num}
        </span>

        {/* hover wash */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-[520ms] group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(to top, rgba(8,7,6,0.82) 0%, rgba(8,7,6,0.1) 52%, transparent 100%)',
          }}
        />

        {/* gold rule that draws in on hover */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 z-30 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
      </div>

      <div className="flex items-start justify-between gap-6 pt-5">
        <div>
          <h3 className="t-title text-cream">{category.name}</h3>
          <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-relaxed text-cream-mute">
            {category.lede}
          </p>
        </div>
        <ArrowIcon className="mt-1.5 h-4 w-4 shrink-0 -translate-x-1 text-gold opacity-0 transition-all duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
