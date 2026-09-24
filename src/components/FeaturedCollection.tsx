'use client';

import Link from 'next/link';
import CategoryCard from './CategoryCard';
import { catalog } from '@/data/catalog';
import { stagger, useRevealGroup } from '@/lib/motion';
import { ArrowIcon } from './icons';

/**
 * The catalog, laid out as a collection rather than a product grid: the two groups the client
 * actually sells, in the order they sell them, with nothing invented between.
 */
export default function FeaturedCollection() {
  const ref = useRevealGroup<HTMLDivElement>();
  let running = -1;

  return (
    <section
      id="collection"
      aria-labelledby="collection-heading"
      className="section relative bg-ink"
    >
      <div ref={ref} className="shell">
        <header className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="t-label text-gold" data-rv>
              The Collection
            </p>
            <h2 id="collection-heading" className="t-display-l mt-6 text-cream" data-rv style={stagger(1)}>
              Featured
              <br />
              <em className="font-normal italic text-cream-dim">Collection</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="t-lead" data-rv style={stagger(2)}>
              Eight categories, two halves of an outfit. Everything on this page can be seen,
              held and tried on the floor in Arya Nagar.
            </p>
          </div>
        </header>

        <div className="mt-[clamp(3.5rem,8vw,7rem)] space-y-[clamp(3.5rem,8vw,7rem)]">
          {catalog.map((group) => (
            <div key={group.key}>
              <div className="mb-10 flex flex-wrap items-baseline gap-x-6 gap-y-3" data-rv>
                <h3 className="t-display-m text-cream">{group.title}</h3>
                <span aria-hidden className="hidden h-px flex-1 bg-line sm:block" />
                <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-cream-mute">
                  {group.lede}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {group.categories.map((cat, i) => {
                  running += 1;
                  return (
                    <div key={cat.slug} style={stagger(i, 90)}>
                      <CategoryCard category={cat} index={running} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(3rem,7vw,6rem)] flex justify-start" data-rv>
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-4 border-b border-line pb-3 transition-colors duration-200 hover:border-gold"
          >
            <span className="t-display-m text-cream transition-colors duration-200 group-hover:text-gold-lt">
              Open the catalog
            </span>
            <ArrowIcon className="h-5 w-5 text-gold transition-transform duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
