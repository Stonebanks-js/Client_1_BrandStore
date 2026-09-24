'use client';

import { useEffect, useState } from 'react';
import { site, whatsappLink } from '@/data/site';
import { WhatsAppIcon } from './icons';

/**
 * The one action that must never be more than a thumb away. It arrives after the hero has
 * had its moment, expands its label on hover and on first appearance, and collapses to a
 * disc once the visitor has seen it.
 */
export default function WhatsAppFab() {
  const [shown, setShown] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.5;
      setShown(past);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!shown) return;
    setExpanded(true);
    const id = window.setTimeout(() => setExpanded(false), 2600);
    return () => window.clearTimeout(id);
  }, [shown]);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Message ${site.name} on WhatsApp`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      className={`fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full border border-gold/45 bg-char/92 py-3 pl-3.5 text-gold shadow-[0_18px_48px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md transition-[transform,opacity,padding] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-gold hover:text-gold-lt sm:bottom-8 sm:right-8 ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      } ${expanded ? 'pr-5' : 'pr-3.5'}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 0%, rgba(255,182,92,0.18), transparent 70%)',
        }}
      />
      <WhatsAppIcon className="h-[22px] w-[22px] shrink-0" />
      <span
        className={`t-label overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          expanded ? 'max-w-[13rem] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Chat on WhatsApp
      </span>
    </a>
  );
}
