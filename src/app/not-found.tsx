import Link from 'next/link';

import { site } from '@/data/site';
import { whatsappUrl } from '@/lib/whatsapp';
import { MaskLine } from '@/components/Masked';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-[clamp(56px,8vw,120px)]">
      <p className="t-eyebrow">404</p>
      <h1 className="t-display mt-5" style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}>
        <MaskLine>That rail</MaskLine>
        <MaskLine className="text-gold">is empty</MaskLine>
      </h1>
      <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-fg-dim">
        The page you were looking for is not here. The shop is, though — eight rails and
        four sale offers, all waiting on the floor in Arya Nagar.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          href="/catalog"
          className="t-btn inline-flex h-14 items-center rounded-[2px] bg-btn-bg px-8 text-btn-fg"
        >
          Open the shop
        </Link>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="t-btn inline-flex h-14 items-center rounded-[2px] border border-line px-8 hover:border-gold"
        >
          Message {site.name}
        </a>
      </div>
    </section>
  );
}
