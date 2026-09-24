'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { catalog, allCategories, categoryImage, type Category } from '@/data/catalog';
import { nav, site, whatsappLink } from '@/data/site';
import { InstagramIcon, WhatsAppIcon } from './icons';
import GarmentFlat from './GarmentFlat';

/**
 * The header sits over the hero on the home page and on paper everywhere else, so it
 * carries two colour schemes and swaps between them on scroll rather than fading a blur
 * panel in over everything.
 *
 * The mega menu keeps a featured image that follows whichever category is under the
 * pointer — the reason to open it is to see the clothes, not to read a list twice.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [preview, setPreview] = useState<Category>(allCategories[0]);
  const closeTimer = useRef<number | undefined>(undefined);

  const overHero = pathname === '/';
  const onDark = overHero && !scrolled && !mega;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMega(false);
      setMobile(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMega = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  }, []);

  const closeMega = useCallback((delay = 140) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), delay);
  }, []);

  const previewImage = categoryImage(preview.slug);

  return (
    <>
      <header
        onMouseLeave={() => closeMega()}
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-300 ${
          onDark ? 'bg-transparent text-on-ink' : 'border-b border-line-light bg-paper text-on-paper'
        }`}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
            <span className="relative block h-10 w-10 shrink-0 overflow-hidden bg-ink">
              <Image src="/brand/monogram.jpg" alt="" fill sizes="40px" className="object-cover" />
            </span>
            <span className="text-[1.05rem] font-bold uppercase leading-none tracking-[0.16em]">
              Brand Store
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {nav.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : item.href.startsWith('/#')
                    ? false
                    : pathname.startsWith(item.href);
              return (
                <div
                  key={item.label}
                  onMouseEnter={item.mega ? openMega : () => closeMega(0)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    aria-expanded={item.mega ? mega : undefined}
                    aria-controls={item.mega ? 'catalog-mega' : undefined}
                    onFocus={item.mega ? openMega : undefined}
                    className={`relative block py-2 text-[0.95rem] font-semibold transition-opacity duration-200 ${
                      active || (item.mega && mega) ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active || (item.mega && mega) ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on Instagram`}
              data-instagram-placeholder={site.instagram.isPlaceholder ? 'true' : undefined}
              className="hidden opacity-70 transition-opacity hover:opacity-100 sm:block"
            >
              <InstagramIcon className="h-[21px] w-[21px]" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden items-center gap-2.5 px-5 py-2.5 text-[0.9rem] font-semibold transition-colors duration-200 sm:inline-flex ${
                onDark
                  ? 'bg-paper text-ink hover:bg-gold-lt'
                  : 'bg-ink text-on-ink hover:bg-gold-ink'
              }`}
            >
              <WhatsAppIcon className="h-[17px] w-[17px]" />
              Enquire
            </a>

            <button
              type="button"
              onClick={() => setMobile((v) => !v)}
              aria-expanded={mobile}
              aria-controls="mobile-nav"
              aria-label={mobile ? 'Close menu' : 'Open menu'}
              className="grid h-11 w-11 place-items-center lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 block h-[2px] w-full bg-current transition-transform duration-300 ${
                    mobile ? 'top-[6px] rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-full bg-current transition-transform duration-300 ${
                    mobile ? 'top-[6px] -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* mega menu */}
        <div
          id="catalog-mega"
          onMouseEnter={openMega}
          aria-hidden={!mega}
          className={`absolute inset-x-0 top-full hidden overflow-hidden border-b border-line-light bg-paper text-on-paper transition-[max-height,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
            mega ? 'max-h-[30rem] opacity-100' : 'invisible max-h-0 opacity-0'
          }`}
        >
          <div className="shell grid grid-cols-12 gap-10 py-10">
            {catalog.map((group) => (
              <div key={group.key} className="col-span-3">
                <p className="t-small font-bold uppercase tracking-[0.16em] text-on-paper">
                  {group.title}
                </p>
                <ul className="mt-5 space-y-1">
                  {group.categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/catalog/${cat.slug}`}
                        onMouseEnter={() => setPreview(cat)}
                        onFocus={() => setPreview(cat)}
                        className="block py-1.5 text-[0.97rem] text-on-paper-dim transition-colors duration-150 hover:text-on-paper"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-6">
              <Link href={`/catalog/${preview.slug}`} className="group block">
                <div className="relative aspect-[16/9] overflow-hidden bg-paper-2">
                  {previewImage ? (
                    <img
                      key={preview.slug}
                      src={previewImage.src}
                      alt=""
                      className="absolute inset-0 h-full w-full animate-[fadeIn_320ms_cubic-bezier(0.16,1,0.3,1)] object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center p-10">
                      <GarmentFlat
                        garment={preview.garment}
                        view="front"
                        tone="#3B352D"
                        onLight
                        className="h-full w-full opacity-80"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-6">
                  <span className="t-h3 text-on-paper">{preview.name}</span>
                  <span className="t-small font-semibold text-on-paper-dim transition-colors group-hover:text-on-paper">
                    View collection
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* mobile nav */}
      <div
        id="mobile-nav"
        aria-hidden={!mobile}
        className={`fixed inset-0 z-[79] bg-paper text-on-paper transition-[opacity,visibility] duration-300 lg:hidden ${
          mobile ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+1.5rem)]">
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobile(false)}
                className="t-h2 border-b border-line-light py-5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-9 grid grid-cols-2 gap-4">
            {allCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                onClick={() => setMobile(false)}
                className="text-[0.97rem] text-on-paper-dim"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-ink px-6 py-4 text-[0.95rem] font-semibold text-on-ink"
              >
                <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border border-line-light px-6 py-4 text-[0.95rem] font-semibold"
              >
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
            </div>
            <p className="t-small mt-6 text-on-paper-mute">
              {site.location.full}
              <br />
              {site.phoneDisplay}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
