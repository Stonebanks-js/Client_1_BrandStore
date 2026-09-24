/**
 * Single source of truth for everything the client may want to change.
 * Nothing in the UI hardcodes a number, a URL, an address or a discount.
 */

export const site = {
  name: 'BRAND STORE',
  segment: 'Menswear',
  tagline: 'Style • Quality • You',
  taglineParts: ['Style', 'Quality', 'You'] as const,
  phrase: 'Good Clothes Better Mood',

  /** Digits only, with country code, no +, no spaces. */
  whatsappNumber: '918004490534',
  /** Human-readable form used in text and tel: links. */
  phoneDisplay: '+91 80044 90534',
  whatsappMessage:
    'Hi BRAND STORE, I found your website and would like to explore the latest collection.',

  /**
   * PLACEHOLDER — replace with the real Instagram profile URL when the client provides it.
   * Everything downstream (buttons, footer, product CTAs) reads this value.
   */
  instagram: {
    url: 'https://instagram.com/__BRANDSTORE_INSTAGRAM_HANDLE__',
    handle: '@brandstore',
    isPlaceholder: true,
  },

  location: {
    line1: '8/81 A, Arya Nagar',
    line2: 'Sabji Mandi Road',
    city: 'Kanpur',
    region: 'Uttar Pradesh',
    country: 'India',
    get full() {
      return `${this.line1}, ${this.line2}, ${this.city}`;
    },
    /**
     * Left null on purpose — no coordinates have been supplied by the client, and the map
     * resolves the address by query instead. Fill in as [lat, lng] to pin exactly.
     */
    coordinates: null as [number, number] | null,
  },

} as const;

/** Builds the WhatsApp deep link, optionally with a context-specific message. */
export function whatsappLink(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Keyless Google Maps embed resolved by address query — no API key, no backend. */
export function mapEmbedSrc(): string {
  const q = site.location.coordinates
    ? site.location.coordinates.join(',')
    : `${site.location.full}, ${site.location.region}, ${site.location.country}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
}

/** Opens the location in the visitor's preferred maps app. */
export function mapDirectionsLink(): string {
  const q = site.location.coordinates
    ? site.location.coordinates.join(',')
    : `${site.name}, ${site.location.full}, ${site.location.region}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export { nav } from './nav';
export type { NavItem } from './nav';
