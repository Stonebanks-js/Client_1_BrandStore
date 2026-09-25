/**
 * Catalog, categories and the Off Season Sale.
 *
 * Image paths point at what is actually in `public/` — the six sale items use the
 * client's own product photography cut from their sale creative; the four remaining
 * categories have no photography yet and carry `primaryImage: null`, which renders the
 * striped placeholder. Adding a path is all it takes to switch one on.
 */

export type CategoryId =
  | 'shirts'
  | 'polo'
  | 'round-neck'
  | 'oversized'
  | 'jeans'
  | 'chinos'
  | 'lower'
  | 'dry-fit';

export interface Category {
  id: CategoryId;
  name: string;
  group: 'top' | 'bottom';
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number | null;
  salePrice: number | null;
  offer: string | null;
  description: string;
  primaryImage: string | null;
  secondaryImage: string | null;
  gallery: string[];
  badge: string | null;
  featured: boolean;
  sale: boolean;
  sizes: string[];
  colors: ProductColor[];
  /** Tint behind the garment in the image panel. */
  bg?: string | null;
}

export const categories: Category[] = [
  { id: 'shirts', name: 'Shirts', group: 'top' },
  { id: 'polo', name: 'Polo T-Shirts', group: 'top' },
  { id: 'round-neck', name: 'Round Neck T-Shirts', group: 'top' },
  { id: 'oversized', name: 'Oversized T-Shirts', group: 'top' },
  { id: 'jeans', name: 'Jeans', group: 'bottom' },
  { id: 'chinos', name: 'Chinos', group: 'bottom' },
  { id: 'lower', name: 'Lower', group: 'bottom' },
  { id: 'dry-fit', name: 'Cotton / Dry-Fit', group: 'bottom' },
];

export function categoryName(id: CategoryId | string): string {
  return categories.find((c) => c.id === id)?.name ?? String(id);
}

const C = {
  black: { name: 'Black', hex: '#14140F' },
  white: { name: 'White', hex: '#F2F0EA' },
  olive: { name: 'Olive', hex: '#4A5340' },
  navy: { name: 'Navy', hex: '#1E2A44' },
  beige: { name: 'Beige', hex: '#C8B394' },
  cream: { name: 'Cream', hex: '#EDE6D2' },
  forest: { name: 'Forest', hex: '#24402C' },
  charcoal: { name: 'Charcoal', hex: '#4A4A4C' },
} satisfies Record<string, ProductColor>;

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const RN = '/catalog/round-neck-t-shirts';
const OS = '/catalog/oversized-t-shirts';
const PO = '/catalog/polo-t-shirts';
const LO = '/catalog/lower';

export const products: Product[] = [
  {
    id: 'round-neck-pack',
    name: 'Round Neck T-Shirts',
    category: 'round-neck',
    price: null,
    salePrice: 999,
    offer: '5 for ₹999',
    description: '100% cotton. Soft & breathable. All day comfort.',
    primaryImage: `${RN}/black.webp`,
    secondaryImage: `${RN}/white.webp`,
    gallery: ['black', 'white', 'olive', 'navy', 'beige'].map((c) => `${RN}/${c}.webp`),
    badge: 'Pack of 5',
    featured: true,
    sale: true,
    sizes: SIZES,
    colors: [C.black, C.white, C.olive, C.navy, C.beige],
    bg: '#fbedd1',
  },
  {
    id: 'oversized-good-things',
    name: 'Oversized Tee — Good Things Take Time',
    category: 'oversized',
    price: null,
    salePrice: 999,
    offer: '3 for ₹999',
    description: 'Bigger fits, bolder prints. Printed at the back.',
    primaryImage: `${OS}/good-things-take-time.webp`,
    secondaryImage: null,
    gallery: [`${OS}/good-things-take-time.webp`],
    badge: 'Back print',
    featured: true,
    sale: true,
    sizes: SIZES,
    colors: [C.black],
    bg: '#cdebfd',
  },
  {
    id: 'polo-pack',
    name: 'Polo T-Shirts',
    category: 'polo',
    price: null,
    salePrice: 1299,
    offer: '3 for ₹1,299',
    description: '100% cotton. Stylish & durable. Breathable.',
    primaryImage: `${PO}/navy.webp`,
    secondaryImage: `${PO}/white.webp`,
    gallery: ['navy', 'white', 'black'].map((c) => `${PO}/${c}.webp`),
    badge: 'Pack of 3',
    featured: true,
    sale: true,
    sizes: SIZES,
    colors: [C.navy, C.white, C.black],
    bg: '#fde4e1',
  },
  {
    id: 'track-pants-pack',
    name: 'Track Pants (Lowers)',
    category: 'lower',
    price: null,
    salePrice: 999,
    offer: '2 for ₹999',
    description: 'Soft fabric. Breathable. Comfort fit. Perfect for daily wear.',
    primaryImage: `${LO}/black.webp`,
    secondaryImage: `${LO}/charcoal.webp`,
    gallery: ['black', 'charcoal'].map((c) => `${LO}/${c}.webp`),
    badge: 'Pack of 2',
    featured: true,
    sale: true,
    sizes: SIZES,
    colors: [C.black, C.charcoal],
    bg: '#d1f1d9',
  },
  {
    id: 'oversized-explore-more',
    name: 'Oversized Tee — Explore More',
    category: 'oversized',
    price: null,
    salePrice: 999,
    offer: '3 for ₹999',
    description: 'Bigger fits, bolder prints. Printed at the back.',
    primaryImage: `${OS}/explore-more.webp`,
    secondaryImage: null,
    gallery: [`${OS}/explore-more.webp`],
    badge: 'Back print',
    featured: true,
    sale: true,
    sizes: SIZES,
    colors: [C.cream],
    bg: '#cdebfd',
  },
  {
    id: 'oversized-stay-real',
    name: 'Oversized Tee — Stay Real',
    category: 'oversized',
    price: null,
    salePrice: 999,
    offer: '3 for ₹999',
    description: 'Bigger fits, bolder prints. Printed at the back.',
    primaryImage: `${OS}/stay-real.webp`,
    secondaryImage: null,
    gallery: [`${OS}/stay-real.webp`],
    badge: 'Back print',
    featured: true,
    sale: true,
    sizes: SIZES,
    colors: [C.forest],
    bg: '#cdebfd',
  },

  /* No photography yet. Add a primaryImage path to switch one on. */
  {
    id: 'shirts-01',
    name: 'Shirts',
    category: 'shirts',
    price: null,
    salePrice: null,
    offer: null,
    description: 'Collar, cuff, and a clean vertical line.',
    primaryImage: null,
    secondaryImage: null,
    gallery: [],
    badge: null,
    featured: false,
    sale: false,
    sizes: ['38', '40', '42', '44'],
    colors: [C.white, C.navy, C.beige],
    bg: null,
  },
  {
    id: 'jeans-01',
    name: 'Jeans',
    category: 'jeans',
    price: null,
    salePrice: null,
    offer: null,
    description: 'The pair that earns its shape over years.',
    primaryImage: null,
    secondaryImage: null,
    gallery: [],
    badge: null,
    featured: false,
    sale: false,
    sizes: ['30', '32', '34', '36'],
    colors: [C.navy, C.black],
    bg: null,
  },
  {
    id: 'chinos-01',
    name: 'Chinos',
    category: 'chinos',
    price: null,
    salePrice: null,
    offer: null,
    description: 'Smarter than denim, easier than trousers.',
    primaryImage: null,
    secondaryImage: null,
    gallery: [],
    badge: null,
    featured: false,
    sale: false,
    sizes: ['30', '32', '34', '36'],
    colors: [C.beige, C.olive, C.navy],
    bg: null,
  },
  {
    id: 'dry-fit-01',
    name: 'Cotton / Dry-Fit Lower',
    category: 'dry-fit',
    price: null,
    salePrice: null,
    offer: null,
    description: 'Built to move, cut to be seen in.',
    primaryImage: null,
    secondaryImage: null,
    gallery: [],
    badge: null,
    featured: false,
    sale: false,
    sizes: SIZES,
    colors: [C.black, C.charcoal],
    bg: null,
  },
];

export interface SaleOffer {
  id: string;
  category: CategoryId;
  quantity: string;
  price: string;
  title: string;
  qualifier?: string;
  features: string[];
  line: string;
  image: string;
  bg: string;
}

/** Transcribed verbatim from the Off Season Sale creative. */
export const sale = {
  title: 'Off Season Sale',
  badge: 'Limited Time Only',
  lead: 'Better outfits, bigger vibes. Four offers, in store only, for as long as they last.',
  kicker: 'Stylish looks at unbeatable prices',
  marks: ['Trendy Collection', 'Premium Quality', 'Customer Satisfaction'],
  offers: [
    {
      id: 'round-neck',
      category: 'round-neck',
      quantity: '5 for',
      price: '₹999',
      title: 'Round Neck T-Shirts',
      features: ['100% Cotton', 'Soft & breathable', 'All day comfort'],
      line: 'Simple classics, always.',
      image: `${RN}/black.webp`,
      bg: '#fbedd1',
    },
    {
      id: 'oversized',
      category: 'oversized',
      quantity: '3 for',
      price: '₹999',
      title: 'Oversized T-Shirts',
      qualifier: 'Back Print',
      features: ['Bigger fits', 'Bolder prints', 'Printed at the back'],
      line: 'Make your style stand out.',
      image: `${OS}/good-things-take-time.webp`,
      bg: '#cdebfd',
    },
    {
      id: 'track-pants',
      category: 'lower',
      quantity: '2 for',
      price: '₹999',
      title: 'Track Pants',
      qualifier: 'Lowers',
      features: ['Soft fabric', 'Breathable', 'Comfort fit', 'Perfect for daily wear'],
      line: 'Move freely, live better.',
      image: `${LO}/black.webp`,
      bg: '#d1f1d9',
    },
    {
      id: 'polo',
      category: 'polo',
      quantity: '3 for',
      price: '₹1,299',
      title: 'Polo T-Shirts',
      features: ['100% Cotton', 'Stylish & durable', 'Breathable'],
      line: 'Smart look, everyday.',
      image: `${PO}/navy.webp`,
      bg: '#fde4e1',
    },
  ] satisfies SaleOffer[] as SaleOffer[],
};

export const featuredProducts = products.filter((p) => p.featured);
export const saleProducts = products.filter((p) => p.sale);

export function priceLabel(p: Product): string {
  return p.salePrice ? `₹${p.salePrice.toLocaleString('en-IN')}` : 'Price on request';
}
