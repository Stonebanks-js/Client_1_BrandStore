/**
 * Single source of truth for config and conversion. Nothing in the UI hardcodes a URL,
 * a number or a price — it all comes from here.
 */

export const site = {
  name: 'BRAND STORE',
  segment: 'Menswear',
  tagline: ['Style', 'Quality', 'You'] as const,
  phrase: 'Good Clothes Better Mood',
  signoff: 'Brand Store — Wear Your Story',

  whatsappNumber: '918004490534',
  whatsappMessage: 'Hi Brand Store ! Please send me the Catalog and current Sale ?',
  phoneDisplay: '+91 80044 90534',
  phoneTel: '+918004490534',

  /** PLACEHOLDER — replace with the real profile. Every Instagram link reads this value. */
  instagramUrl: 'https://www.instagram.com/brandstore',
  instagramHandle: '@brandstore',

  address: {
    line1: '8/81 A, Arya Nagar',
    locality: 'Arya Nagar',
    line2: 'Sabji Mandi Road',
    city: 'Kanpur',
    region: 'Uttar Pradesh',
  },

  images: {
    monogram: '/brand/monogram.jpg',
    showroom: '/brand/showroom.jpg',
    poster: '/brand/sale-poster.webp',
  },
} as const;

export const addressFull = `${site.address.line1}, ${site.address.line2}, ${site.address.city}`;

const mapQuery = encodeURIComponent(
  `${site.name}, ${addressFull}, ${site.address.region}, India`,
);

export const mapEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`;
export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

export const nav = [
  { label: 'Home', short: 'Home', href: '/', num: '01' },
  { label: 'Shop', short: 'Shop', href: '/catalog', num: '02' },
  { label: 'Sale', short: 'Sale', href: '/sale', num: '03' },
  { label: 'Visit the store', short: 'Store', href: '/about', num: '04' },
] as const;
