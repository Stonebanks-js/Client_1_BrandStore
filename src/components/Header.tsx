'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { addressFull, nav, site } from '@/data/site';
import { openWhatsApp } from '@/lib/whatsapp';
import ThemeToggle from '@/components/ThemeToggle';
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon } from '@/components/icons';

/** The floating CTA listens for this so it can get out of the menu's way. */
export const MENU_EVENT = 'bs:menu';

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-3" aria-label={site.name}>
      <Image
        src={site.images.monogram}
        alt=""
        width={40}
        height={40}
        priority
        className="h-10 w-10 rounded-[2px] object-cover"
      />
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-[0.02em]">{site.name}</span>
        <span className="mt-[3px] block text-[9px] font-semibold uppercase tracking-[0.46em] text-accent">
          {site.segment}
        </span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(MENU_EVENT, { detail: open }));
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-[var(--header-bg)] backdrop-blur-[14px]">
        <div className="shell header-h flex items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`t-btn relative py-2 transition-colors ${
                  isActive(item.href) ? 'text-fg' : 'text-fg-dim hover:text-fg'
                }`}
              >
                {item.short}
                <span
                  className={`absolute inset-x-0 -bottom-[1px] h-[2px] bg-gold transition-transform duration-300 ${
                    isActive(item.href) ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on Instagram`}
              className="hidden h-10 w-10 place-items-center rounded-[2px] border border-line text-fg-dim transition-colors hover:border-gold hover:text-fg lg:grid"
            >
              <InstagramIcon />
            </a>

            <ThemeToggle />

            <button
              type="button"
              data-magnetic
              onClick={() => openWhatsApp()}
              className="t-btn hidden h-11 items-center rounded-[2px] bg-btn-bg px-6 text-btn-fg lg:inline-flex"
            >
              Get the catalog
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-[2px] border border-line text-fg lg:hidden"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Scroll progress — driven by MotionLayer. */}
        <span
          data-progress
          aria-hidden
          className="absolute inset-x-0 -bottom-[2px] h-[2px] origin-left scale-x-0 bg-gold"
        />
      </header>

      {/* Mobile menu */}
      <div
        id="site-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-bg pt-[clamp(60px,7vw,76px)] lg:hidden"
      >
        <nav className="shell flex-1 overflow-y-auto pb-10 pt-8" aria-label="Mobile">
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 py-5"
                >
                  <span className="t-eyebrow text-[10px]">{item.num}</span>
                  <span className="t-serif text-[40px]">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="t-btn flex h-12 items-center justify-center gap-2 rounded-[2px] border border-line"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
            <a
              href={`tel:${site.phoneTel}`}
              className="t-btn flex h-12 items-center justify-center gap-2 rounded-[2px] border border-line"
            >
              <PhoneIcon className="h-4 w-4" />
              Call
            </a>
          </div>

          <address className="mt-8 not-italic text-[13px] leading-relaxed text-fg-mute">
            {addressFull}
            <br />
            {site.address.region}
          </address>
        </nav>
      </div>
    </>
  );
}
