'use client';

import { useEffect, useState } from 'react';

import { site } from '@/data/site';
import { openWhatsApp } from '@/lib/whatsapp';
import { MENU_EVENT } from '@/components/Header';
import { ChatIcon, PhoneIcon } from '@/components/icons';

/**
 * Desktop: a pill in the bottom-right corner. Mobile: a fixed bar with Call beside
 * the catalog button. Both hide while the mobile menu is open.
 */
export default function FloatingCTA() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = (e: Event) => setMenuOpen(Boolean((e as CustomEvent).detail));
    window.addEventListener(MENU_EVENT, on);
    return () => window.removeEventListener(MENU_EVENT, on);
  }, []);

  if (menuOpen) return null;

  return (
    <>
      <button
        type="button"
        data-magnetic
        onClick={() => openWhatsApp()}
        className="t-btn fixed bottom-8 right-8 z-30 hidden h-14 items-center gap-3 rounded-full bg-btn-bg px-7 text-btn-fg shadow-[0_18px_40px_rgba(8,7,6,0.28)] lg:inline-flex"
      >
        <ChatIcon className="h-[18px] w-[18px]" />
        Catalog &amp; Sale
      </button>

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[var(--header-bg)] backdrop-blur-[14px] lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="shell flex items-center gap-2 py-3">
          <a
            href={`tel:${site.phoneTel}`}
            aria-label={`Call ${site.name}`}
            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[2px] border border-line text-fg"
          >
            <PhoneIcon />
          </a>
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="t-btn h-[52px] flex-1 rounded-[2px] bg-btn-bg text-btn-fg"
          >
            Get the Catalog &amp; Sale
          </button>
        </div>
      </div>
    </>
  );
}
