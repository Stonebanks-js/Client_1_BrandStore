import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProductViewer from '@/components/ProductViewer';
import RevealSection from '@/components/RevealSection';
import CategoryTile from '@/components/CategoryTile';
import SectionHead from '@/components/SectionHead';
import GarmentFlat from '@/components/GarmentFlat';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons';
import {
  allCategories,
  getCategory,
  adjacentCategories,
  catalog,
  categoryImage,
  imageProvenance,
} from '@/data/catalog';
import { site, whatsappLink } from '@/data/site';

export function generateStaticParams() {
  return allCategories.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: 'Catalog' };
  return {
    title: category.name,
    description: `${category.name} at ${site.name}, ${site.location.city}. ${category.lede}`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const { prev, next } = adjacentCategories(slug);
  const siblings = catalog
    .find((g) => g.key === category.group)!
    .categories.filter((c) => c.slug !== category.slug);

  const hero = categoryImage(category.slug);
  const provenance = imageProvenance(category.slug);
  const enquiry = whatsappLink(
    `Hi ${site.name}, I am interested in the ${category.name} collection. ` +
      `Please share the available options.`,
  );

  return (
    <>
      {/* Opening: the garment at size, the name beside it. */}
      <section className="bg-paper pt-[calc(var(--header-h)+clamp(1.5rem,4vw,3rem))]">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="text-[0.85rem] text-on-paper-mute">
            <Link href="/catalog" className="transition-colors hover:text-on-paper">
              Catalog
            </Link>
            <span aria-hidden> / </span>
            <span>{category.group === 'top' ? 'Top Wear' : 'Bottom Wear'}</span>
          </nav>

          <div className="mt-8 grid items-center gap-10 pb-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:gap-16">
            <div
              className="relative aspect-[4/5] overflow-hidden bg-paper-2"
              style={hero?.bg ? { background: hero.bg } : undefined}
            >
              {hero ? (
                <img
                  src={hero.src}
                  srcSet={hero.srcSmall ? `${hero.srcSmall} 640w, ${hero.src} 1200w` : undefined}
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  alt={`${category.name} at ${site.name}`}
                  width={hero.width}
                  height={hero.height}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center p-[12%]">
                  <GarmentFlat
                    garment={category.garment}
                    view="front"
                    tone="#3B352D"
                    onLight
                    className="h-full w-full"
                  />
                </div>
              )}
            </div>

            <div>
              <h1 className="t-h1 text-on-paper">{category.name}</h1>
              <p className="t-phrase mt-5 text-[clamp(1.2rem,1.9vw,1.6rem)] text-on-paper-dim">
                {category.lede}
              </p>
              <p className="t-body mt-7 text-on-paper-dim">{category.body[0]}</p>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {category.notes.map((note) => (
                  <li key={note} className="text-[0.92rem] text-on-paper-dim">
                    {note}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={enquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-ink px-7 py-4 text-[0.95rem] font-semibold text-on-ink transition-colors duration-200 hover:bg-gold-ink"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  Enquire on WhatsApp
                </a>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 border border-line-light px-6 py-4 text-[0.95rem] font-semibold text-on-paper transition-colors duration-200 hover:border-on-paper"
                >
                  <InstagramIcon className="h-[18px] w-[18px]" />
                  Follow
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Front, side, back. */}
      <RevealSection className="bg-paper-2">
        <div className="shell py-[clamp(3rem,7vw,5.5rem)]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,52%)_minmax(0,48%)] lg:gap-16">
            <ProductViewer category={category} />

            <div className="lg:pt-6">
              <SectionHead title="How it is cut" />
              <p className="t-body mt-7 text-on-paper-dim">{category.body[1]}</p>
              <p className="t-small mt-8 text-on-paper-mute">
                {hero
                  ? 'Colours and prints on the floor change through the season — message us and we will tell you exactly what is in today.'
                  : 'These views are drafted illustrations of the category, not photographs of one item. Message us and we will tell you exactly what is in today.'}
              </p>
              {provenance && (
                <p className="t-small mt-3 text-on-paper-mute">{provenance}</p>
              )}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* The rest of the half. */}
      <RevealSection className="bg-paper">
        <div className="shell py-[clamp(3rem,7vw,5.5rem)]">
          <SectionHead
            title={category.group === 'top' ? 'More top wear' : 'More bottom wear'}
            link={{ href: '/catalog', label: 'All categories' }}
          />
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {siblings.map((cat, i) => (
              <li key={cat.slug} data-rv style={{ ['--rv-delay' as string]: `${i * 60}ms` }}>
                <CategoryTile category={cat} sizes="(max-width: 1024px) 46vw, 30vw" />
              </li>
            ))}
          </ul>
        </div>
      </RevealSection>

      {prev && next && (
        <nav aria-label="Category pagination" className="border-t border-line-light bg-paper">
          <div className="shell grid sm:grid-cols-2">
            <Link
              href={`/catalog/${prev.slug}`}
              className="group py-8 sm:border-r sm:border-line-light sm:pr-10"
            >
              <span className="t-small block text-on-paper-mute">Previous</span>
              <span className="t-h3 mt-2 block text-on-paper-dim transition-colors group-hover:text-on-paper">
                {prev.name}
              </span>
            </Link>
            <Link
              href={`/catalog/${next.slug}`}
              className="group border-t border-line-light py-8 text-right sm:border-t-0 sm:pl-10"
            >
              <span className="t-small block text-on-paper-mute">Next</span>
              <span className="t-h3 mt-2 block text-on-paper-dim transition-colors group-hover:text-on-paper">
                {next.name}
              </span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
