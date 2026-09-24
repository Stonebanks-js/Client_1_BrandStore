/**
 * Catalog is data-driven: add a category or swap in real photography without touching a
 * component. Categories are exactly those supplied by the client — nothing invented.
 *
 * Photography is wired up through `catalog-images.json`, which `npm run generate:catalog`
 * writes. A category listed there renders photographs; one that is not falls back to the
 * drafted garment flat, so the site is never broken by a missing image. To use the client's
 * own product photography instead, drop the files into `public/catalog/<slug>/` as
 * `front.webp` / `side.webp` / `back.webp` (plus optional `@640` variants) and add the
 * entry to that manifest by hand — nothing else needs to change.
 */

import imageManifest from './catalog-images.json';

export type ViewKey = 'front' | 'side' | 'back';

export type GarmentKind =
  | 'shirt'
  | 'polo'
  | 'crew'
  | 'oversized'
  | 'jeans'
  | 'chinos'
  | 'lower'
  | 'dryfit';

export interface CategoryView {
  key: ViewKey;
  label: string;
  /** Real or generated photograph. Null → drafted garment flat is rendered instead. */
  src: string | null;
  /** Narrower variant for phones, served through srcset. */
  srcSmall: string | null;
  /** Intrinsic size, so the frame reserves space and never shifts layout. */
  width: number | null;
  height: number | null;
  alt: string;
}

interface ManifestView {
  src: string;
  srcSmall: string | null;
  width: number;
  height: number;
}

interface ManifestEntry {
  /** The client's own product photograph for this category, when one exists. */
  product?: ManifestView;
  views?: Partial<Record<ViewKey, ManifestView>>;
  source: string;
}

export interface CategoryImage {
  src: string;
  srcSmall: string | null;
  width: number;
  height: number;
}

const manifest = imageManifest as {
  generatedAt: string | null;
  model: string | null;
  categories: Record<string, ManifestEntry>;
};

/** How a category's imagery came about, shown to the visitor so nothing is implied falsely. */
export function imageProvenance(slug: string): string | null {
  return manifest.categories[slug]?.source ?? null;
}

export function hasPhotography(slug: string): boolean {
  const entry = manifest.categories[slug];
  return Boolean(entry?.views?.front || entry?.product);
}

/**
 * The image that represents a category anywhere it is shown as a whole — tiles, the
 * mega-menu preview, the catalog. Prefers the client's real product photograph, falls
 * back to the front model view, and returns null when only the drafted flat exists.
 */
export function categoryImage(slug: string): CategoryImage | null {
  const entry = manifest.categories[slug];
  return entry?.product ?? entry?.views?.front ?? null;
}

export interface Category {
  slug: string;
  name: string;
  group: 'top' | 'bottom';
  garment: GarmentKind;
  /** Short editorial line used on cards and in the mega menu. */
  lede: string;
  /** Two paragraphs of styling-led copy. No prices, fabrics, stock or specifications. */
  body: [string, string];
  /** Styling notes — how the category is worn, not what it is made of. */
  notes: string[];
  /** Tonal identity for the drafted flat and card lighting. */
  tone: string;
  views: CategoryView[];
}

export interface CategoryGroup {
  key: 'top' | 'bottom';
  title: string;
  lede: string;
  categories: Category[];
}

function buildViews(slug: string, name: string): CategoryView[] {
  const defs: Array<[ViewKey, string]> = [
    ['front', 'Front'],
    ['side', 'Side'],
    ['back', 'Back'],
  ];
  const entry = manifest.categories[slug];

  return defs.map(([key, label]) => {
    const shot = entry?.views?.[key];
    return {
      key,
      label,
      src: shot?.src ?? null,
      srcSmall: shot?.srcSmall ?? null,
      width: shot?.width ?? null,
      height: shot?.height ?? null,
      alt: shot
        ? `A model wearing ${name.toLowerCase()} from BRAND STORE, ${label.toLowerCase()} view`
        : `${name} — ${label.toLowerCase()} view`,
    };
  });
}

const topWear: Category[] = [
  {
    slug: 'shirts',
    name: 'Shirts',
    group: 'top',
    garment: 'shirt',
    lede: 'Collar, cuff, and a clean vertical line.',
    body: [
      'The shirt is the most decisive thing a man puts on. It sets the shoulder, frames the face, and decides whether the rest of the outfit reads considered or accidental.',
      'Buttoned for the evening, rolled to the forearm for the afternoon, or worn open over a plain tee when the day runs long — one garment, three different men.',
    ],
    notes: ['Collar sits clean', 'Sleeve rolls to the forearm', 'Wears tucked or loose'],
    tone: '#D8C7A8',
    views: buildViews('shirts', 'Shirts'),
  },
  {
    slug: 'polo-t-shirts',
    name: 'Polo T-Shirts',
    group: 'top',
    garment: 'polo',
    lede: 'The collar that makes casual look deliberate.',
    body: [
      'A polo does the quiet work of a shirt with none of the ceremony. The placket and the ribbed collar are exactly enough structure to hold a look together.',
      'It is the garment for the day that starts casual and turns formal without warning — and the easiest way to raise a pair of chinos.',
    ],
    notes: ['Ribbed collar holds shape', 'Short placket', 'Pairs with chinos or denim'],
    tone: '#B9C4C0',
    views: buildViews('polo-t-shirts', 'Polo T-Shirts'),
  },
  {
    slug: 'round-neck-t-shirts',
    name: 'Round Neck T-Shirts',
    group: 'top',
    garment: 'crew',
    lede: 'The foundation everything else is built on.',
    body: [
      'A round neck is the plainest thing in a wardrobe and the hardest to get right. Everything depends on where the neckline sits and where the sleeve ends.',
      'Get those two lines correct and it works under a shirt, under a jacket, or entirely on its own.',
    ],
    notes: ['Neckline sits flat', 'Sleeve ends mid-bicep', 'Layers under everything'],
    tone: '#DCD6CC',
    views: buildViews('round-neck-t-shirts', 'Round Neck T-Shirts'),
  },
  {
    slug: 'oversized-t-shirts',
    name: 'Oversized T-Shirts',
    group: 'top',
    garment: 'oversized',
    lede: 'Volume, dropped shoulder, deliberate ease.',
    body: [
      'Oversized is a silhouette, not an accident of sizing. The shoulder seam falls down the arm on purpose and the body hangs instead of following it.',
      'It reshapes the whole outfit — wear it with something narrow below and the proportion does the styling for you.',
    ],
    notes: ['Dropped shoulder seam', 'Straight, unfitted body', 'Balance with a narrow leg'],
    tone: '#8E8A84',
    views: buildViews('oversized-t-shirts', 'Oversized T-Shirts'),
  },
];

const bottomWear: Category[] = [
  {
    slug: 'jeans',
    name: 'Jeans',
    group: 'bottom',
    garment: 'jeans',
    lede: 'The pair that earns its shape over years.',
    body: [
      'Denim is the only thing in a wardrobe that improves by being worn badly. It takes the shape of the person in it and keeps a record of everything since.',
      'The only decision that really matters is the line from hip to hem — everything after that is taste.',
    ],
    notes: ['Five-pocket construction', 'Straight through the thigh', 'Cuffs or breaks clean'],
    tone: '#7F8DA0',
    views: buildViews('jeans', 'Jeans'),
  },
  {
    slug: 'chinos',
    name: 'Chinos',
    group: 'bottom',
    garment: 'chinos',
    lede: 'Smarter than denim, easier than trousers.',
    body: [
      'Chinos sit exactly between the two things most men already own, which is why they end up being worn more than either of them.',
      'Clean at the waist, quiet at the ankle — they take a polo in the afternoon and a shirt in the evening without changing character.',
    ],
    notes: ['Clean waistband', 'Slanted side pockets', 'Takes a shirt or a tee'],
    tone: '#C2A882',
    views: buildViews('chinos', 'Chinos'),
  },
  {
    slug: 'lower',
    name: 'Lower',
    group: 'bottom',
    garment: 'lower',
    lede: 'Ease, cut properly.',
    body: [
      'Comfort only reads as style when the cut is honest. A lower should taper, sit at the waist without gathering, and end where it is supposed to.',
      'The garment for the long day at home and the short walk out — without looking like you gave up on either.',
    ],
    notes: ['Elasticated waist', 'Tapered through the leg', 'Wears with any top'],
    tone: '#9C8E80',
    views: buildViews('lower', 'Lower'),
  },
  {
    slug: 'cotton-dry-fit',
    name: 'Cotton / Dry-Fit',
    group: 'bottom',
    garment: 'dryfit',
    lede: 'Built to move, cut to be seen in.',
    body: [
      'Active wear spends most of its life outside the gym, so it should hold a line standing still as well as it does in motion.',
      'A clean taper, a flat waistband, nothing shouting — the piece you can keep on for the rest of the day.',
    ],
    notes: ['Made for movement', 'Flat waistband', 'Clean taper to the ankle'],
    tone: '#7FA39B',
    views: buildViews('cotton-dry-fit', 'Cotton / Dry-Fit'),
  },
];

export const catalog: CategoryGroup[] = [
  {
    key: 'top',
    title: 'Top Wear',
    lede: 'Shoulder, collar and line — the half of the outfit people actually look at.',
    categories: topWear,
  },
  {
    key: 'bottom',
    title: 'Bottom Wear',
    lede: 'Proportion, taper and hem — the half that holds the whole thing together.',
    categories: bottomWear,
  },
];

export const allCategories: Category[] = [...topWear, ...bottomWear];

export function getCategory(slug: string): Category | undefined {
  return allCategories.find((c) => c.slug === slug);
}

export function adjacentCategories(slug: string) {
  const i = allCategories.findIndex((c) => c.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: allCategories[(i - 1 + allCategories.length) % allCategories.length],
    next: allCategories[(i + 1) % allCategories.length],
  };
}
