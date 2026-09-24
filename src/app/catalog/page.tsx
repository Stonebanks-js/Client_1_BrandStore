import type { Metadata } from 'next';

import PageIntro from '@/components/PageIntro';
import CategoryCard from '@/components/CategoryCard';
import RevealSection from '@/components/RevealSection';
import CTAButton from '@/components/CTAButton';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons';
import { catalog, allCategories } from '@/data/catalog';
import { site, whatsappLink } from '@/data/site';

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Top wear and bottom wear at BRAND STORE, Kanpur — shirts, polos, round neck and oversized ' +
    'tees, jeans, chinos, lowers and cotton / dry-fit.',
};

export default function CatalogPage() {
  let running = -1;

  return (
    <>
      <PageIntro
        label={`Catalog · ${allCategories.length} Categories`}
        title={
          <>
            Everything
            <br />
            on the <em className="font-normal italic text-cream-dim">floor</em>.
          </>
        }
        lead="Two groups, eight categories. Open one to see it front, side and back, then message us about what you want to try."
      />

      {/* group index */}
      <RevealSection className="border-b border-line bg-ink-2 py-7">
        <div className="shell flex flex-wrap items-center gap-x-8 gap-y-4">
          <span className="t-label text-cream-mute">Jump to</span>
          {catalog.map((group) => (
            <a
              key={group.key}
              href={`#${group.key}`}
              className="t-label text-cream transition-colors duration-200 hover:text-gold"
            >
              {group.title}
            </a>
          ))}
          <span aria-hidden className="hidden h-px flex-1 bg-line sm:block" />
          <span className="t-label text-cream-mute">{site.tagline}</span>
        </div>
      </RevealSection>

      {catalog.map((group, gi) => (
        <RevealSection
          key={group.key}
          id={group.key}
          className={`section scroll-mt-[var(--header-h)] ${gi % 2 === 0 ? 'bg-ink' : 'bg-ink-2'}`}
        >
          <div className="shell">
            <header className="grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="t-label text-gold" data-rv>
                  {String(gi + 1).padStart(2, '0')} — {group.title}
                </p>
                <h2 className="t-display-l mt-6 text-cream" data-rv>
                  {group.title}
                </h2>
              </div>
              <p className="t-lead md:col-span-5" data-rv>
                {group.lede}
              </p>
            </header>

            <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {group.categories.map((cat, i) => {
                running += 1;
                return (
                  <div
                    key={cat.slug}
                    style={{ ['--rv-delay' as string]: `${i * 90}ms` }}
                    className={i % 2 === 1 ? 'lg:mt-16' : undefined}
                  >
                    <CategoryCard category={cat} index={running} />
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>
      ))}

      <RevealSection className="section border-t border-line bg-char">
        <div className="shell-tight text-center">
          <p className="t-label text-gold" data-rv>
            Enquire
          </p>
          <h2 className="t-display-l mx-auto mt-7 max-w-[18ch] text-cream" data-rv>
            Ask for what you are looking for.
          </h2>
          <p className="t-lead mx-auto mt-7" data-rv>
            Tell us the category and we will tell you what is on the floor today. No ordering
            online — this is a showroom.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3" data-rv>
            <CTAButton href={whatsappLink()} variant="gold" external>
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
    </>
  );
}
