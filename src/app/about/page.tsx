import type { Metadata } from 'next';
import Image from 'next/image';

import CategoriesCard from '@/components/CategoriesCard';
import LocationBlock from '@/components/LocationBlock';
import { MaskLine } from '@/components/Masked';
import { addressFull, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Visit the store',
  description: `${site.name} is at ${addressFull}. Come in, try it on, take it home the same afternoon.`,
};

export default function StorePage() {
  return (
    <>
      <section className="relative" style={{ height: '72svh' }}>
        <div className="absolute inset-0 overflow-hidden bg-bg-2">
          <div data-parallax="0.2" className="absolute inset-0 will-change-transform">
            <div data-hero-photo className="absolute inset-0">
              <Image
                src={site.images.showroom}
                alt={`Inside ${site.name}, ${addressFull}`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[50%_45%]"
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,18,15,.92) 0%, rgba(20,18,15,.6) 45%, rgba(20,18,15,.15) 85%)',
          }}
        />
        <div className="shell absolute inset-x-0 bottom-0 pb-[clamp(28px,4vw,64px)] text-[#f7f6f3]">
          <h1>
            <MaskLine className="t-serif">
              <span style={{ fontSize: 'clamp(1.8rem, 4vw, 3.4rem)' }}>
                {site.address.locality},
              </span>
            </MaskLine>
            <MaskLine className="t-display">
              <span style={{ fontSize: 'clamp(4rem, 13vw, 13rem)' }}>
                {site.address.city}
              </span>
            </MaskLine>
          </h1>
          <p className="t-btn mt-4 text-[11px] text-[#e3be79]">
            {site.tagline.join(' | ')}
          </p>
        </div>
      </section>

      <CategoriesCard />
      <LocationBlock />
    </>
  );
}
