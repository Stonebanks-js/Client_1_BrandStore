import type { Metadata } from 'next';

import CategoryTile from '@/components/CategoryTile';
import SectionHead from '@/components/SectionHead';
import RevealSection from '@/components/RevealSection';
import { WhatsAppIcon } from '@/components/icons';
import { catalog } from '@/data/catalog';
import { site, whatsappLink } from '@/data/site';

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Top wear and bottom wear at BRAND STORE, Kanpur — shirts, polos, round neck and oversized ' +
    'tees, jeans, chinos, lowers and cotton / dry-fit.',
};

export default function CatalogPage() {
  return (
    <>
      {/* Opening: one line, then straight into the clothes. */}
      <section className="bg-paper pb-[clamp(2rem,4vw,3rem)] pt-[calc(var(--header-h)+clamp(3rem,7vw,5.5rem))]">
        <div className="shell">
          <h1 className="t-h1 text-on-paper">Catalog</h1>
          <p className="t-lead mt-5 text-on-paper-dim">
            Explore the collection. Eight categories on the floor in Arya Nagar — open one to see
            it properly, then message us about what you want to try.
          </p>
        </div>
      </section>

      {catalog.map((group) => (
        <RevealSection
          key={group.key}
          id={group.key}
          className="scroll-mt-[var(--header-h)] bg-paper"
        >
          <div className="shell pb-[clamp(3rem,6vw,5rem)]">
            <SectionHead title={group.title} lead={group.lede} />

            <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {group.categories.map((cat, i) => (
                <li key={cat.slug} data-rv style={{ ['--rv-delay' as string]: `${i * 60}ms` }}>
                  <CategoryTile
                    category={cat}
                    priority={i < 2}
                    sizes="(max-width: 1024px) 46vw, 24vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        </RevealSection>
      ))}

      {/* Close on the one action the site actually has. */}
      <RevealSection className="bg-ink">
        <div className="shell py-[clamp(3.5rem,8vw,6rem)]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <h2 className="t-h1 text-on-ink">Ask for what you are looking for</h2>
              <p className="t-lead mt-5 text-on-ink-dim">
                Tell us the category and we will tell you what is on the floor today. Nothing is
                ordered online — this is a showroom.
              </p>
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-paper px-7 py-4 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:bg-gold-lt"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Enquire on WhatsApp
            </a>
          </div>
          <p className="t-small mt-8 text-on-ink-mute">
            {site.location.full} · {site.phoneDisplay}
          </p>
        </div>
      </RevealSection>
    </>
  );
}
