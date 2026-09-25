import Image from 'next/image';
import Link from 'next/link';

import { site } from '@/data/site';

/**
 * The store as a place, not a product. Desktop puts the photograph beside the copy;
 * mobile turns the whole thing into one tall image card that links to the store page.
 */
export default function Editorial() {
  return (
    <section className="shell pb-[clamp(56px,7vw,112px)]">
      {/* desktop */}
      <div className="hidden items-center gap-[clamp(32px,4vw,80px)] lg:grid lg:grid-cols-[7fr_5fr]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[2px] bg-bg-2">
          <div data-parallax="0.12" className="absolute inset-0 will-change-transform">
            <Image
              src={site.images.showroom}
              alt="The Brand Store floor, Arya Nagar"
              fill
              sizes="60vw"
              className="scale-[1.1] object-cover object-[15%_60%]"
            />
          </div>
        </div>

        <div data-reveal>
          <p className="t-eyebrow">The store</p>
          <h2 className="t-serif mt-4 text-[clamp(2rem,3.4vw,3.4rem)]">
            Everyday menswear, chosen properly
          </h2>
          <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-fg-dim">
            One floor, eight rails, and someone on hand who knows which one you want.
            Nothing ships — you try it on, you take it home. That is the whole idea.
          </p>
          <Link href="/about" className="t-btn mt-8 inline-block text-[11px] text-accent">
            Visit the store →
          </Link>
        </div>
      </div>

      {/* mobile */}
      <Link
        href="/about"
        className="relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-bg-2 lg:hidden"
      >
        <Image
          src={site.images.showroom}
          alt="The Brand Store floor, Arya Nagar"
          fill
          sizes="100vw"
          className="object-cover object-[15%_60%]"
        />
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,18,15,.92) 0%, rgba(20,18,15,.55) 45%, transparent 80%)',
          }}
        />
        <span className="absolute inset-x-0 bottom-0 block p-6 text-[#f7f6f3]">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e3be79]">
            The store
          </span>
          <span className="t-serif mt-3 block text-[clamp(1.7rem,7vw,2.4rem)]">
            Everyday menswear, chosen properly
          </span>
          <span className="t-btn mt-5 block text-[11px] text-[#e3be79]">
            Visit the store →
          </span>
        </span>
      </Link>
    </section>
  );
}
