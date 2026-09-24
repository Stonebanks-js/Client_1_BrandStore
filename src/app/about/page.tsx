import type { Metadata } from 'next';
import Image from 'next/image';

import RevealSection from '@/components/RevealSection';
import SectionHead from '@/components/SectionHead';
import CategoryTile from '@/components/CategoryTile';
import LocationSection from '@/components/LocationSection';
import { WhatsAppIcon, InstagramIcon } from '@/components/icons';
import { catalog } from '@/data/catalog';
import { site, whatsappLink } from '@/data/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    `${site.name} is a menswear showroom in Arya Nagar, Kanpur — built around style, quality ` +
    `and the man wearing the clothes.`,
};

const PHILOSOPHY = [
  {
    word: 'Style',
    body:
      'Style is the decision, not the garment. The floor is arranged so the decision is easy: tops on one side, bottoms on the other, and room to hold both up together.',
  },
  {
    word: 'Quality',
    body:
      'Quality is something you check with your hands. Everything here is meant to be taken off the shelf, opened out and looked at properly before it is bought.',
  },
  {
    word: 'You',
    body:
      'The last word is the one that matters. Nothing is sold as a look to copy — it is sold as something that has to work on the person in the mirror.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Opening: the name, the line under it, and the room. */}
      <section className="bg-paper pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4.5rem))]">
        <div className="shell">
          <h1 className="t-h1 max-w-[18ch] text-on-paper">
            A men&rsquo;s floor in Arya Nagar, Kanpur
          </h1>
          <p className="t-phrase mt-6 text-[clamp(1.4rem,2.6vw,2.1rem)] text-on-paper-dim">
            {site.tagline}
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-2 sm:aspect-[21/9]">
            <Image
              src="/brand/showroom.jpg"
              alt="The BRAND STORE showroom: lit shelving of folded shirts, a rail of hanging tees, and the illuminated wall sign"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Philosophy — the three words, given room rather than three identical cards. */}
      <RevealSection className="bg-paper">
        <div className="shell py-[clamp(3.5rem,8vw,6rem)]">
          <SectionHead
            title="What the three words mean"
            lead="They are painted on the wall in that order on purpose. It is the order the shop works in too."
          />

          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {PHILOSOPHY.map((item, i) => (
              <div key={item.word} data-rv style={{ ['--rv-delay' as string]: `${i * 80}ms` }}>
                <p className="t-phrase text-[clamp(1.75rem,3vw,2.5rem)] text-on-paper">
                  {item.word}
                </p>
                <p className="t-body mt-4 text-on-paper-dim">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* The room, told against the photograph. */}
      <RevealSection className="bg-ink">
        <div className="shell py-[clamp(3.5rem,8vw,6rem)]">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div data-rv="media" className="relative aspect-[4/3] overflow-hidden bg-ink-2">
              <Image
                src="/brand/showroom.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover object-right"
              />
            </div>
            <div>
              <h2 className="t-h1 text-on-ink">The part that cannot be done online</h2>
              <p className="t-body mt-6 text-on-ink-dim">
                The room was built for seeing real colour under real light, feeling the weight of a
                fold, and putting two things next to each other to see whether they agree.
              </p>
              <p className="t-body mt-5 text-on-ink-dim">
                Shelving is lit from inside so the tones read true. The rail sits at eye level. The
                counter carries the line the shop was named for.
              </p>
              <p className="t-phrase mt-8 text-[clamp(1.5rem,2.6vw,2.1rem)] text-gold-lt">
                {site.phrase}
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* What is actually on the floor. */}
      <RevealSection className="bg-paper">
        <div className="shell py-[clamp(3.5rem,8vw,6rem)]">
          <SectionHead
            title="What we carry"
            lead="Menswear only, kept to the categories the shop actually stocks."
            link={{ href: '/catalog', label: 'Open the catalog' }}
          />
          {catalog.map((group) => (
            <div key={group.key} className="mt-10">
              <h3 className="t-h3 text-on-paper">{group.title}</h3>
              <ul className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {group.categories.map((cat, i) => (
                  <li key={cat.slug} data-rv style={{ ['--rv-delay' as string]: `${i * 60}ms` }}>
                    <CategoryTile category={cat} sizes="(max-width: 1024px) 46vw, 24vw" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Contact, before the map. */}
      <RevealSection className="bg-ink">
        <div className="shell py-[clamp(3rem,7vw,5rem)]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <h2 className="t-h1 text-on-ink">Come and see</h2>
              <p className="t-lead mt-5 text-on-ink-dim">
                Message ahead, or simply walk in. {site.location.full}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-paper px-7 py-4 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:bg-gold-lt"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border border-on-ink/30 px-6 py-4 text-[0.95rem] font-semibold text-on-ink transition-colors duration-200 hover:border-on-ink"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </RevealSection>

      <LocationSection />
    </>
  );
}
