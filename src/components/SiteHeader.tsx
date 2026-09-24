'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { catalog, allCategories, type Category } from '@/data/catalog';
import { nav, site, whatsappLink } from '@/data/site';
import { InstagramIcon, WhatsAppIcon, ArrowIcon } from './icons';
import GarmentFlat from './GarmentFlat';

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [preview, setPreview] = useState<Category>(allCategories[0]);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const closeMega = useCallback((delay = 160) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), delay);
  }, []);

  const onCatalogPage = pathname.startsWith('/catalog');

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled || mega || onCatalogPage
            ? 'border-b border-line/70 bg-ink/82 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
        onMouseLeave={() => closeMega()}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          {/* wordmark */}
          <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-[2px] border border-gold/35 bg-ink">
              <Image
                src="/brand/monogram.jpg"
                alt=""
                fill
                sizes="36px"
                className="object-cover transition-transform duration-[640ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
              />
            </span>
            <span className="font-sans text-[0.9rem] font-bold uppercase leading-[1.45] tracking-[0.3em] text-cream">
              Brand
              <br />
              Store
            </span>
          </Link>

          {/* desktop nav */}
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
                    className={`t-label relative block py-2 transition-colors duration-200 ${
                      active || (item.mega && mega) ? 'text-cream' : 'text-cream-mute hover:text-cream'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active || (item.mega && mega) ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* persistent actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on Instagram`}
              data-instagram-placeholder={site.instagram.isPlaceholder ? 'true' : undefined}
              className="group relative hidden h-10 w-10 place-items-center rounded-full border border-line text-cream-dim transition-colors duration-200 hover:border-gold/70 hover:text-gold sm:grid"
            >
              <InstagramIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label group relative hidden items-center gap-2.5 overflow-hidden rounded-[2px] border border-gold/60 px-4 py-2.5 text-gold transition-colors duration-200 hover:text-ink sm:inline-flex"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100"
              />
              <WhatsAppIcon className="relative z-10 h-[16px] w-[16px]" />
              <span className="relative z-10">WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setMobile((v) => !v)}
              aria-expanded={mobile}
              aria-controls="mobile-nav"
              aria-label={mobile ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-cream transition-colors duration-200 hover:border-gold/70 lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                    mobile ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                    mobile ? 'top-1.5 -rotate-45' : 'top-3'
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
          className={`absolute inset-x-0 top-full hidden overflow-hidden border-b border-line/70 bg-ink transition-[max-height,opacity] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
            mega ? 'max-h-[34rem] opacity-100' : 'invisible max-h-0 opacity-0'
          }`}
          aria-hidden={!mega}
        >
          <div className="shell grid grid-cols-12 gap-10 py-12">
            {catalog.map((group, gi) => (
              <div key={group.key} className="col-span-4">
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="t-label text-gold">{group.title}</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <ul className="space-y-1">
                  {group.categories.map((cat, i) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/catalog/${cat.slug}`}
                        onMouseEnter={() => setPreview(cat)}
                        onFocus={() => setPreview(cat)}
                        className="group flex items-baseline justify-between gap-6 border-b border-transparent py-2.5 transition-colors duration-200 hover:border-line"
                        style={{
                          transitionDelay: mega ? `${(gi * 4 + i) * 26}ms` : '0ms',
                          opacity: mega ? 1 : 0,
                          transform: mega ? 'none' : 'translateY(10px)',
                          transitionProperty: 'opacity, transform, border-color',
                          transitionDuration: '520ms',
                          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                        }}
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

            {/* live preview */}
            <div className="col-span-4">
              <div className="relative h-full min-h-[17rem] overflow-hidden border border-line bg-char">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(110% 80% at 25% 5%, color-mix(in srgb, ${preview.tone} 13%, transparent), transparent 60%)`,
                  }}
                />
                <div key={preview.slug} className="absolute inset-0 grid place-items-center p-8">
                  <GarmentFlat
                    garment={preview.garment}
                    view="front"
                    tone={preview.tone}
                    className="h-full w-full animate-[fadeIn_420ms_cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="t-label text-gold">
                      {preview.group === 'top' ? 'Top Wear' : 'Bottom Wear'}
                    </p>
                    <p className="t-title mt-2 text-cream">{preview.name}</p>
                  </div>
                  <Link
                    href={`/catalog/${preview.slug}`}
                    className="t-label whitespace-nowrap text-cream-mute transition-colors hover:text-gold"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="shell flex items-center justify-between border-t border-line/70 py-5">
            <p className="t-label text-cream-mute">{site.tagline}</p>
            <Link href="/catalog" className="t-label text-gold transition-colors hover:text-gold-lt">
              View the full catalog
            </Link>
          </div>
        </div>
      </header>

      {/* mobile nav */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[79] bg-ink transition-[opacity,visibility] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          mobile ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!mobile}
      >
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+1.5rem)]">
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobile(false)}
                  className="t-display-m border-b border-line/70 py-5 text-cream"
                  style={{
                    opacity: mobile ? 1 : 0,
                    transform: mobile ? 'none' : 'translateY(16px)',
                    transition: `opacity 520ms cubic-bezier(0.16,1,0.3,1) ${i * 60 + 80}ms, transform 520ms cubic-bezier(0.16,1,0.3,1) ${i * 60 + 80}ms`,
                  }}
                >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            className="mt-8"
            style={{
              opacity: mobile ? 1 : 0,
              transform: mobile ? 'none' : 'translateY(16px)',
              transition:
                'opacity 520ms cubic-bezier(0.16,1,0.3,1) 260ms, transform 520ms cubic-bezier(0.16,1,0.3,1) 260ms',
            }}
          >
            {catalog.map((group) => (
              <details key={group.key} className="group border-b border-line/70">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                  <span className="t-label text-gold">{group.title}</span>
                  <span className="relative block h-3 w-3 text-cream-mute">
                    <span className="absolute left-0 top-1.5 block h-px w-3 bg-current" />
                    <span className="absolute left-1.5 top-0 block h-3 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <ul className="pb-4">
                  {group.categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/catalog/${cat.slug}`}
                        onClick={() => setMobile(false)}
                        className="flex items-center justify-between py-2.5 text-[1.05rem] text-cream-dim"
                      >
                        {cat.name}
                        <ArrowIcon className="h-4 w-4 text-gold/70" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <div className="hairline mb-6" />
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label inline-flex items-center gap-2.5 rounded-[2px] border border-gold/60 px-5 py-3.5 text-gold"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label inline-flex items-center gap-2.5 rounded-[2px] border border-line px-5 py-3.5 text-cream-dim"
              >
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
            </div>
            <p className="t-body mt-6 text-[0.9rem] text-cream-mute">
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
