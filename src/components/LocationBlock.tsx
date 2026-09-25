import { addressFull, directionsUrl, mapEmbedSrc, site } from '@/data/site';
import { whatsappUrl } from '@/lib/whatsapp';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4">
      <dt className="t-btn text-[10px] text-fg-mute">{label}</dt>
      <dd className="mt-2 text-[15px] leading-relaxed">{children}</dd>
    </div>
  );
}

export default function LocationBlock() {
  return (
    <section className="shell pb-[clamp(56px,7vw,112px)]">
      <div className="grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div data-reveal>
          <p className="t-eyebrow">Find us</p>
          <h2
            className="t-display mt-3"
            style={{ fontSize: 'clamp(2.4rem, 5.4vw, 5rem)' }}
          >
            Come in, try it on
          </h2>

          <dl className="mt-8">
            <Row label="Address">
              <address className="not-italic">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.city}, {site.address.region}
              </address>
            </Row>
            <Row label="Phone">
              <a href={`tel:${site.phoneTel}`} className="hover:text-accent">
                {site.phoneDisplay}
              </a>
            </Row>
            <Row label="Instagram">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                {site.instagramHandle}
              </a>
            </Row>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="t-btn inline-flex h-14 items-center rounded-[2px] bg-btn-bg px-8 text-btn-fg"
            >
              Directions
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="t-btn inline-flex h-14 items-center rounded-[2px] border border-line px-8 hover:border-gold"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-line bg-bg-2 lg:aspect-[4/3.4]">
          <iframe
            src={mapEmbedSrc}
            title={`Map to ${site.name}, ${addressFull}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map-frame absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
