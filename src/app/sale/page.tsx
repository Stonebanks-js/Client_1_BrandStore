import type { Metadata } from 'next';

import SaleCampaign from '@/components/SaleCampaign';
import Featured from '@/components/Featured';
import { sale, saleProducts } from '@/data/products';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: sale.title,
  description: `${sale.kicker} at ${site.name}, Arya Nagar, Kanpur — ${sale.offers
    .map((o) => `${o.title} ${o.quantity} ${o.price}`)
    .join(', ')}. In store only.`,
};

export default function SalePage() {
  return (
    <>
      <SaleCampaign />
      <Featured eyebrow="Also in store" title="More from the rail" items={saleProducts} />
    </>
  );
}
