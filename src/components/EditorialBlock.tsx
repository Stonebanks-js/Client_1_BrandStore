'use client';

import Link from 'next/link';
import { useRevealGroup } from '@/lib/motion';

/**
 * A campaign band: one photograph at half width, a short piece of copy opposite it. The
 * side the image sits on alternates down the page so the rhythm never settles into a grid.
 */
export default function EditorialBlock({
  title,
  body,
  image,
  imageAlt,
  link,
  side = 'left',
  tone = 'paper',
}: {
  title: string;
  body: string;
  image: { src: string; srcSmall?: string | null; width?: number; height?: number };
  imageAlt: string;
  link?: { href: string; label: string };
  side?: 'left' | 'right';
  tone?: 'paper' | 'ink';
}) {
  const ref = useRevealGroup<HTMLDivElement>();
  const dark = tone === 'ink';

  return (
    <section className={dark ? 'bg-ink' : 'bg-paper'}>
      <div ref={ref} className="shell section">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            className={`relative aspect-[4/3] overflow-hidden ${dark ? 'bg-ink-2' : 'bg-paper-2'} ${
              side === 'right' ? 'lg:order-2' : ''
            }`}
            data-rv="media"
          >
            <img
              src={image.src}
              srcSet={image.srcSmall ? `${image.srcSmall} 640w, ${image.src} 1200w` : undefined}
              sizes="(max-width: 1024px) 92vw, 46vw"
              alt={imageAlt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className={side === 'right' ? 'lg:order-1' : ''}>
            <h2 className={`t-h1 ${dark ? 'text-on-ink' : 'text-on-paper'}`}>{title}</h2>
            <p className={`t-lead mt-6 ${dark ? 'text-on-ink-dim' : 'text-on-paper-dim'}`}>
              {body}
            </p>
            {link && (
              <Link
                href={link.href}
                className={`mt-8 inline-flex items-center px-7 py-4 text-[0.95rem] font-semibold transition-colors duration-200 ${
                  dark
                    ? 'bg-paper text-ink hover:bg-gold-lt'
                    : 'bg-ink text-on-ink hover:bg-gold-ink'
                }`}
              >
                {link.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
