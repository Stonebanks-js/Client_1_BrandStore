import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import PageIntro from '@/components/PageIntro';
import LocationSection from '@/components/LocationSection';
import CTAButton from '@/components/CTAButton';
import RevealSection from '@/components/RevealSection';
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons';
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
    n: '01',
    title: 'Style',
    body:
      'Style is the decision, not the garment. The floor is arranged so the decision is easy: ' +
      'top wear on one side, bottom wear on the other, and room to see how they read together.',
  },
  {
    n: '02',
    title: 'Quality',
    body:
      'Quality is something you check with your hands. Every piece here is meant to be taken ' +
      'off the shelf, opened out, held up and looked at properly before it is bought.',
  },
  {
    n: '03',
    title: 'You',
    body:
      'The last word on the wall is the one that matters. Nothing is sold as a look to copy — ' +
      'it is sold as something that has to work on the person standing in the mirror.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        label={`About · ${site.segment}`}
        title={
          <>
            A men&rsquo;s floor
            <br />
            built around <em className="font-normal italic text-cream-dim">three words</em>.
          </>
        }
        lead={`${site.name} is a menswear destination in Kanpur. The whole shop is arranged around the three words on the wall — ${site.tagline}.`}
      />

      {/* showroom spread */}
      <RevealSection className="section bg-ink">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden bg-char" data-rv="media">
              <div className="relative h-full w-full">
                <Image
                  src="/brand/showroom.jpg"
                  alt="The BRAND STORE showroom: illuminated wall sign, lit shelving of folded shirts and a rail of hanging tees"
                  fill
                  sizes="(max-width: 1024px) 92vw, 54vw"
                  className="object-cover"
                />
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-0 border border-line/70" />
            </div>
            <p className="t-label mt-4 text-cream-mute">
              The showroom · {site.location.line1}, {site.location.city}
            </p>
          </div>

          <div className="lg:col-span-5 lg:pt-10">
            <p className="t-label text-gold" data-rv>
              The Showroom
            </p>
            <h2 className="t-display-m mt-6 text-cream" data-rv>
              Warm light, dark wood, and everything within reach.
            </h2>
            <p className="t-body mt-7" data-rv>
              The room was designed for the part of shopping that cannot be done online: seeing
              the real colour under real light, feeling the weight of a fold, and putting two
              things next to each other to see whether they agree.
            </p>
            <p className="t-body mt-5" data-rv>
              Shelving is lit from inside so the tones read true. The rail sits at eye level. The
              counter carries the line the shop was named for.
            </p>

            <p
              className="mt-10 font-display text-[clamp(1.6rem,3vw,2.6rem)] italic leading-snug text-gold"
              data-rv
            >
              {site.phrase}
            </p>
          </div>
        </div>
      </RevealSection>

      {/* philosophy */}
      <RevealSection className="section border-y border-line bg-ink-2">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6">
              <p className="t-label text-gold" data-rv>
                Philosophy
              </p>
              <h2 className="t-display-l mt-6 text-cream" data-rv>
                {site.taglineParts.map((word, i) => (
                  <span key={word} className="block">
                    {i === 2 ? <em className="font-normal italic metal">{word}</em> : word}
                    {i < 2 && <span aria-hidden className="text-gold/60"> ·</span>}
                  </span>
                ))}
              </h2>
            </div>
            <p className="t-lead md:col-span-6" data-rv>
              Three words on a wall, written in that order on purpose. They are the order the
              shop works in too.
            </p>
          </div>

          <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-px border border-line bg-line md:grid-cols-3">
            {PHILOSOPHY.map((item) => (
              <article key={item.n} className="bg-ink-2 p-8 sm:p-10" data-rv>
                <span className="t-label text-gold">{item.n}</span>
                <h3 className="t-display-m mt-6 text-cream">{item.title}</h3>
                <p className="t-body mt-5">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* categories */}
      <RevealSection className="section bg-ink">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="t-label text-gold" data-rv>
                What We Carry
              </p>
              <h2 className="t-display-l mt-6 text-cream" data-rv>
                Two halves of
                <br />
                one outfit.
              </h2>
            </div>
            <p className="t-lead md:col-span-5" data-rv>
              Menswear only, kept to the categories the shop actually stocks.
            </p>
          </div>

          <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid gap-10 md:grid-cols-2 md:gap-16">
            {catalog.map((group) => (
              <div key={group.key} data-rv>
                <div className="flex items-baseline gap-5">
                  <h3 className="t-display-m text-cream">{group.title}</h3>
                  <span aria-hidden className="h-px flex-1 bg-line" />
                </div>
                <p className="t-body mt-5">{group.lede}</p>
                <ul className="mt-8 border-t border-line">
                  {group.categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/catalog/${cat.slug}`}
                        className="group flex items-center justify-between gap-6 border-b border-line py-5 transition-colors duration-200 hover:border-gold/50"
                      >
                        <span className="t-title text-cream-dim transition-colors duration-200 group-hover:text-cream">
                          {cat.name}
                        </span>
                        <ArrowIcon className="h-4 w-4 shrink-0 -translate-x-2 text-gold opacity-0 transition-all duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* contact strip */}
      <RevealSection className="section bg-char">
        <div className="shell-tight text-center">
          <p className="t-label text-gold" data-rv>
            Come and See
          </p>
          <h2 className="t-display-l mx-auto mt-7 max-w-[16ch] text-cream" data-rv>
            The rest of it happens in the room.
          </h2>
          <p className="t-lead mx-auto mt-7 text-center" data-rv>
            Message ahead, or simply walk in. {site.location.full}.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3" data-rv>
            <CTAButton href={whatsappLink()} variant="gold" external>
              <WhatsAppIcon className="h-4 w-4" />
              Message on WhatsApp
            </CTAButton>
            <CTAButton href={site.instagram.url} variant="ghost" external>
              <InstagramIcon className="h-4 w-4" />
              Follow on Instagram
            </CTAButton>
          </div>
        </div>
      </RevealSection>

      <LocationSection />
    </>
  );
}
