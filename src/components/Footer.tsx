import Link from 'next/link';

import { addressFull, nav, site } from '@/data/site';
import { whatsappUrl } from '@/lib/whatsapp';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons';

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="t-btn text-[11px] text-on-band-dim">{title}</h2>
      <div className="mt-5 space-y-3 text-[14px] text-on-band-dim">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-band text-on-band">
      <div className="shell grid gap-12 pt-[clamp(48px,6vw,88px)] pb-[clamp(120px,14vw,64px)] lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16 lg:pb-[clamp(48px,6vw,88px)]">
        <div>
          <p className="t-display text-[clamp(1.6rem,3vw,2.4rem)]">{site.name}</p>
          <p className="t-serif mt-3 text-[clamp(1.1rem,2vw,1.4rem)] text-gold">
            {site.signoff}
          </p>
          <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-on-band-dim">
            A menswear floor in Arya Nagar. Come in, try it on, and take it home the
            same afternoon.
          </p>
        </div>

        <Column title="Explore">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block hover:text-on-band">
              {item.short}
            </Link>
          ))}
        </Column>

        <Column title="Visit">
          <address className="not-italic leading-relaxed">
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            {site.address.city}, {site.address.region}
          </address>
          <a href={`tel:${site.phoneTel}`} className="block hover:text-on-band">
            {site.phoneDisplay}
          </a>
        </Column>

        <Column title="Follow">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-on-band"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-on-band"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp us
          </a>
        </Column>
      </div>

      <div className="border-t border-band-line">
        <div className="shell flex flex-col gap-2 py-6 text-[11px] uppercase tracking-[0.16em] text-on-band-dim lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {addressFull}
          </p>
          <p>In-store purchase only · Enquiries on WhatsApp</p>
        </div>
      </div>
    </footer>
  );
}
