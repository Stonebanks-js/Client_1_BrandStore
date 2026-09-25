import { site } from '@/data/site';

/**
 * The WhatsApp URL, built once. Every conversion path on the site goes through here,
 * so the number and the message exist in exactly one place.
 */
export function whatsappUrl(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** The only way the site opens WhatsApp. */
export function openWhatsApp(message?: string): void {
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
}
