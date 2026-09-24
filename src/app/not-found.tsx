import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import { ArrowIcon, WhatsAppIcon } from '@/components/icons';
import { site, whatsappLink } from '@/data/site';

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink pt-[var(--header-h)]">
      <div className="shell">
        <p className="t-label text-gold">404</p>
        <h1 className="t-display-l mt-6 max-w-[18ch] text-on-ink">
          That rail is <em className="font-normal italic text-on-ink-dim">empty</em>.
        </h1>
        <p className="t-lead mt-7 text-on-ink-dim">
          The page you were looking for is not here. The catalog is, though — eight categories,
          front, side and back.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton href="/catalog" variant="cream">
            Open the catalog
            <ArrowIcon />
          </CTAButton>
          <CTAButton href={whatsappLink()} variant="ghost" external>
            <WhatsAppIcon className="h-4 w-4" />
            Message {site.name}
          </CTAButton>
        </div>
        <Link href="/" className="t-label mt-10 inline-block text-on-ink-mute transition-colors hover:text-on-ink">
          Back to home
        </Link>
      </div>
    </section>
  );
}
