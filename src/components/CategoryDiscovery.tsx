'use client';

import CategoryTile from './CategoryTile';
import SectionHead from './SectionHead';
import { catalog } from '@/data/catalog';
import { useRevealGroup } from '@/lib/motion';

/**
 * Category discovery, on paper rather than in the dark. Two rows of garment photography,
 * four across on a desktop and a swipeable rail on a phone — the shop's range in one screen
 * instead of eight identical cards stacked down a black page.
 */
export default function CategoryDiscovery() {
  const ref = useRevealGroup<HTMLDivElement>();

  return (
    <section id="collection" aria-labelledby="collection-heading" className="bg-paper">
      <div ref={ref} className="shell section">
        <h2 id="collection-heading" className="sr-only">
          Shop by category
        </h2>

        {catalog.map((group, gi) => (
          <div key={group.key} className={gi > 0 ? 'mt-[clamp(3.5rem,7vw,6rem)]' : undefined}>
            <SectionHead
              title={group.title}
              lead={group.lede}
              link={{ href: '/catalog', label: 'View all' }}
            />

            {/* Rail on a phone, grid from tablet up. */}
            <ul
              className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4"
            >
              {group.categories.map((cat, i) => (
                <li
                  key={cat.slug}
                  className="w-[68vw] shrink-0 snap-start xs:w-[58vw] sm:w-auto"
                  data-rv
                  style={{ ['--rv-delay' as string]: `${i * 70}ms` }}
                >
                  <CategoryTile category={cat} priority={gi === 0 && i < 2} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
