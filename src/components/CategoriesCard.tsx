import Link from 'next/link';

import { categories } from '@/data/products';
import { site } from '@/data/site';

function Column({ title, group }: { title: string; group: 'top' | 'bottom' }) {
  return (
    <div>
      <h3 className="t-btn rounded-[6px] border border-gold px-4 py-3 text-[10px] text-gold">
        {title}
      </h3>
      <ul className="mt-2">
        {categories
          .filter((c) => c.group === group)
          .map((c) => (
            <li key={c.id} className="border-b border-band-line last:border-b-0">
              <Link
                href={`/catalog/?c=${c.id}`}
                className="flex h-12 items-center gap-3 text-[14px] text-on-band-dim transition-colors hover:text-on-band"
              >
                <span aria-hidden className="h-[6px] w-[6px] rounded-full bg-gold" />
                <span className="flex-1">{c.name}</span>
                <span aria-hidden className="text-gold">
                  →
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

/**
 * The eight rails, printed like the card in the window. The double gold frame is two
 * borders with a 6px gap between them, so it reads as letterpress rather than a box.
 */
export default function CategoriesCard() {
  return (
    <section className="shell py-[clamp(56px,7vw,112px)]">
      <div data-reveal className="rounded-[2px] border border-gold p-[6px]">
        <div className="rounded-[2px] border border-band-line bg-band px-[clamp(20px,4vw,56px)] py-[clamp(28px,4vw,56px)] text-on-band">
          <div className="text-center">
            <p className="t-display text-[clamp(1.4rem,3vw,2.2rem)]">{site.name}</p>
            <p className="t-btn mt-2 text-[10px] text-gold">{site.segment}</p>
          </div>

          <div className="mt-[clamp(28px,4vw,56px)] grid gap-8 sm:grid-cols-2 sm:gap-12">
            <Column title="Top wear" group="top" />
            <Column title="Bottom wear" group="bottom" />
          </div>
        </div>
      </div>
    </section>
  );
}
