import Image from 'next/image';
import Link from 'next/link';
import { catalog } from '@/data/catalog';
import { site, whatsappLink, mapDirectionsLink } from '@/data/site';
import { InstagramIcon, WhatsAppIcon, ArrowIcon } from './icons';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line-dark bg-ink-2">
      <div className="shell py-[clamp(4rem,9vw,8rem)]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* mark */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <span className="relative block h-14 w-14 overflow-hidden rounded-[2px] border border-gold/35 bg-ink">
                <Image
                  src="/brand/monogram.jpg"
                  alt={`${site.name} monogram`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <span className="font-sans text-[1rem] font-bold uppercase leading-[1.5] tracking-[0.3em] text-on-ink">
                Brand
                <br />
                Store
              </span>
            </div>

            <p className="mt-8 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] italic leading-snug text-on-ink-dim">
              {site.phrase}
            </p>

            <p className="t-label mt-8 flex flex-wrap items-center gap-3 text-gold">
              {site.taglineParts.map((word, i) => (
                <span key={word} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="h-3 w-px bg-gold/45" />}
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* catalog */}
          <nav className="lg:col-span-5" aria-label="Catalog">
            <div className="grid gap-10 sm:grid-cols-2">
              {catalog.map((group) => (
                <div key={group.key}>
                  <p className="t-label text-on-ink-mute">{group.title}</p>
                  <ul className="mt-5 space-y-2.5">
                    {group.categories.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/catalog/${cat.slug}`}
                          className="group inline-flex items-center gap-2 text-[0.975rem] text-on-ink-dim transition-colors duration-200 hover:text-on-ink"
                        >
                          {cat.name}
                          <ArrowIcon className="h-3.5 w-3.5 -translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* contact */}
          <div className="lg:col-span-3">
            <p className="t-label text-on-ink-mute">Find Us</p>
            <address className="mt-5 not-italic text-[0.975rem] leading-relaxed text-on-ink-dim">
              {site.location.line1}
              <br />
              {site.location.line2}
              <br />
              {site.location.city}, {site.location.region}
            </address>

            <a
              href={`tel:+${site.whatsappNumber}`}
              className="mt-5 inline-block text-[0.975rem] text-on-ink transition-colors hover:text-gold"
            >
              {site.phoneDisplay}
            </a>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Message ${site.name} on WhatsApp`}
                className="grid h-11 w-11 place-items-center rounded-full border border-line-dark text-on-ink-dim transition-colors duration-200 hover:border-gold/70 hover:text-gold"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} on Instagram`}
                data-instagram-placeholder={site.instagram.isPlaceholder ? 'true' : undefined}
                className="grid h-11 w-11 place-items-center rounded-full border border-line-dark text-on-ink-dim transition-colors duration-200 hover:border-gold/70 hover:text-gold"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={mapDirectionsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label inline-flex items-center rounded-full border border-line-dark px-5 text-on-ink-dim transition-colors duration-200 hover:border-gold/70 hover:text-gold"
              >
                Directions
              </a>
            </div>
          </div>
        </div>

        <div className="hairline mt-[clamp(3rem,6vw,5rem)]" />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-label text-on-ink-mute">
            © {year} {site.name} · {site.segment}
          </p>
          <nav aria-label="Secondary" className="flex flex-wrap gap-6">
            <Link href="/" className="t-label text-on-ink-mute transition-colors hover:text-on-ink">
              Home
            </Link>
            <Link href="/about" className="t-label text-on-ink-mute transition-colors hover:text-on-ink">
              About
            </Link>
            <Link href="/catalog" className="t-label text-on-ink-mute transition-colors hover:text-on-ink">
              Catalog
            </Link>
            <Link href="/#sale" className="t-label text-on-ink-mute transition-colors hover:text-on-ink">
              Sale
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
