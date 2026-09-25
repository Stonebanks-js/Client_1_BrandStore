'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@/components/icons';

export const THEME_KEY = 'bs-theme';

/**
 * Runs before first paint, from <head>, so the page never flashes the wrong theme.
 * Kept as a string because it has to execute ahead of React.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('${THEME_KEY}');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const read = () =>
      (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    setTheme(read());

    // Follow the OS only while the visitor hasn't made a choice of their own.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onOS = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {}
      if (stored === 'light' || stored === 'dark') return;
      const next = mq.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      setTheme(next);
    };
    mq.addEventListener('change', onOS);
    return () => mq.removeEventListener('change', onOS);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`grid h-10 w-10 place-items-center rounded-[2px] border border-line text-fg-dim transition-colors hover:border-gold hover:text-fg ${className}`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
