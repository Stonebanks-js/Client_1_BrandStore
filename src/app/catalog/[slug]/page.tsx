import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProductViewer from '@/components/ProductViewer';
import RevealSection from '@/components/RevealSection';
import CTAButton from '@/components/CTAButton';
import CategoryCard from '@/components/CategoryCard';
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons';
import {
  allCategories,
  getCategory,
  adjacentCategories,
  catalog,
  hasPhotography,
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

  // Contextual enquiry: the message names the category the visitor is actually looking at.
  const enquiry = whatsappLink(
    `Hi ${site.name}, I am interested in the ${category.name} collection. ` +
      `Please share the available options.`,
  );

  const photographed = hasPhotography(category.slug);
  const provenance = imageProvenance(category.slug);

  return (
    <>
      {/* breadcrumb + title */}
      <RevealSection className="border-b border-line bg-ink pb-[clamp(2.5rem,5vw,4rem)] pt-[calc(var(--header-h)+clamp(3rem,8vh,6rem))]">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="t-label flex flex-wrap items-center gap-3 text-cream-mute">
            <Link href="/catalog" className="transition-colors hover:text-cream">
              Catalog
            </Link>
            <span aria-hidden>/</span>
            <span>{category.group === 'top' ? 'Top Wear' : 'Bottom Wear'}</span>
            <span aria-hidden>/</span>
            <span className="text-cream">{category.name}</span>
          </nav>

          <div className="mt-[clamp(2rem,4vw,3rem)] grid gap-6 md:grid-cols-12 md:items-end">
            <h1 className="t-display-l text-cream md:col-span-8" data-rv>
              {category.name}
            </h1>
            <div className="flex gap-3 md:col-span-4 md:justify-end">
              <CTAButton href={enquiry} variant="gold" external>
                <WhatsAppIcon className="h-4 w-4" />
                Enquire on WhatsApp
              </CTAButton>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* viewer */}
      <RevealSection className="section bg-ink pt-[clamp(3rem,7vw,5rem)]">
        <div className="shell">
          <ProductViewer category={category} />
        </div>
      </RevealSection>

      {/* honesty note + CTAs */}
      <RevealSection className="border-y border-line bg-ink-2 py-[clamp(3rem,7vw,5rem)]">
        <div className="shell grid gap-8 md:grid-cols-12 md:items-center">
          <p className="t-body md:col-span-7" data-rv>
            {photographed
              ? 'The views above show how this category is worn, not a photograph of one specific item on the shelf. Colours and prints on the floor change — message us and we will tell you exactly what is in today.'
              : 'The views above are drafted illustrations of the category, not photographs of a specific item. What is on the floor changes — message us and we will tell you exactly what is in today.'}
            {provenance && (
              <span className="mt-3 block text-[0.85rem] text-cream-mute">{provenance}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end" data-rv>
            <CTAButton href={enquiry} variant="gold" external>
              <WhatsAppIcon className="h-4 w-4" />
              Enquire on WhatsApp
            </CTAButton>
            <CTAButton href={site.instagram.url} variant="ghost" external>
              <InstagramIcon className="h-4 w-4" />
              Follow on Instagram
            </CTAButton>
          </div>
        </div>
      </RevealSection>

      {/* siblings */}
      <RevealSection className="section bg-ink">
        <div className="shell">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3" data-rv>
            <h2 className="t-display-m text-cream">
              More {category.group === 'top' ? 'top wear' : 'bottom wear'}
            </h2>
            <span aria-hidden className="hidden h-px flex-1 bg-line sm:block" />
            <Link href="/catalog" className="t-label text-gold transition-colors hover:text-gold-lt">
              All categories
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3">
            {siblings.map((cat, i) => (
              <div key={cat.slug} style={{ ['--rv-delay' as string]: `${i * 90}ms` }}>
                <CategoryCard category={cat} index={allCategories.indexOf(cat)} />
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* prev / next */}
      {prev && next && (
        <nav aria-label="Category pagination" className="border-t border-line bg-ink-2">
          <div className="shell grid gap-px sm:grid-cols-2">
            <Link
              href={`/catalog/${prev.slug}`}
              className="group flex items-center gap-5 py-10 transition-colors duration-200 sm:border-r sm:border-line sm:pr-10"
            >
              <ArrowIcon className="h-5 w-5 rotate-180 text-gold transition-transform duration-[320ms] group-hover:-translate-x-2" />
              <span>
                <span className="t-label block text-cream-mute">Previous</span>
                <span className="t-title mt-2 block text-cream-dim transition-colors group-hover:text-cream">
                  {prev.name}
                </span>
              </span>
            </Link>
            <Link
              href={`/catalog/${next.slug}`}
              className="group flex items-center justify-end gap-5 border-t border-line py-10 text-right transition-colors duration-200 sm:border-t-0 sm:pl-10"
            >
              <span>
                <span className="t-label block text-cream-mute">Next</span>
                <span className="t-title mt-2 block text-cream-dim transition-colors group-hover:text-cream">
                  {next.name}
                </span>
              </span>
              <ArrowIcon className="h-5 w-5 text-gold transition-transform duration-[320ms] group-hover:translate-x-2" />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
