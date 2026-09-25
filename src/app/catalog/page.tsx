import type { Metadata } from 'next';

import Shop from '@/components/Shop';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Shop',
  description: `Shirts, polos, round-neck and oversized tees, jeans, chinos and lowers at ${site.name}, Arya Nagar, Kanpur. Enquire on WhatsApp.`,
};

export default function ShopPage() {
  return <Shop />;
}
