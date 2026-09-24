/**
 * The Off Season Sale, transcribed from the client's official creative
 * (`assets/reference/sale-poster.jpg`).
 *
 * The four offers below are exactly what the artwork states. Nothing here is rounded,
 * rephrased into a percentage, or extended with an offer the client did not publish —
 * and no price appears anywhere on the site that is not one of these four.
 */

export interface SaleOffer {
  id: string;
  /** Catalog slug this offer points at, so the card can link to the real category. */
  slug: string;
  /** Quantity wording exactly as the creative has it, e.g. "5 for". */
  quantity: string;
  /** Price as printed. Never computed, never discounted further. */
  price: string;
  title: string;
  /** Optional qualifier printed on the creative, e.g. "Back Print". */
  qualifier?: string;
  /** The client's own product claims, taken verbatim from the artwork. */
  features: string[];
  /** The handwritten line on that panel of the creative. */
  line: string;
  /** Colourways shown in that panel, used for the swatch row. */
  swatches: string[];
}

export const sale = {
  eyebrow: 'Off Season Sale',
  word: 'Sale',
  badge: 'Limited Time Only',
  lead: 'Better outfits, bigger vibes. Four offers, in store only, for as long as they last.',
  kicker: 'Stylish looks at unbeatable prices',
  /** Trust line from the foot of the creative. */
  marks: ['Trendy Collection', 'Premium Quality', 'Customer Satisfaction'],
  /** The original artwork, shown as a supporting visual — never as the content itself. */
  poster: {
    src: '/brand/sale-poster.webp',
    alt: 'The BRAND STORE Off Season Sale poster, listing all four offers',
  },
  offers: [
    {
      id: 'round-neck',
      slug: 'round-neck-t-shirts',
      quantity: '5 for',
      price: '₹999',
      title: 'Round Neck T-Shirts',
      features: ['100% Cotton', 'Soft & breathable', 'All day comfort'],
      line: 'Simple classics, always.',
      swatches: ['#14140F', '#F2F0EA', '#4A5340', '#1E2A44', '#C8B394'],
    },
    {
      id: 'oversized',
      slug: 'oversized-t-shirts',
      quantity: '3 for',
      price: '₹999',
      title: 'Oversized T-Shirts',
      qualifier: 'Back Print',
      features: ['Bigger fits', 'Bolder prints', 'Printed at the back'],
      line: 'Make your style stand out.',
      swatches: ['#131313', '#EDE6D2', '#24402C'],
    },
    {
      id: 'track-pants',
      slug: 'lower',
      quantity: '2 for',
      price: '₹999',
      title: 'Track Pants',
      qualifier: 'Lowers',
      features: ['Soft fabric', 'Breathable', 'Comfort fit', 'Perfect for daily wear'],
      line: 'Move freely, live better.',
      swatches: ['#141414', '#4A4A4C'],
    },
    {
      id: 'polo',
      slug: 'polo-t-shirts',
      quantity: '3 for',
      price: '₹1,299',
      title: 'Polo T-Shirts',
      features: ['100% Cotton', 'Stylish & durable', 'Breathable'],
      line: 'Smart look, everyday.',
      swatches: ['#1B2B4B', '#F5F5F3', '#121212'],
    },
  ] satisfies SaleOffer[] as SaleOffer[],
} as const;

export type Sale = typeof sale;
