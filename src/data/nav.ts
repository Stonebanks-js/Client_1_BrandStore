export interface NavItem {
  label: string;
  href: string;
  /** Opens the catalog mega menu on hover/focus rather than only navigating. */
  mega?: boolean;
}

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Catalog', href: '/catalog', mega: true },
  { label: 'Sale', href: '/#sale' },
];
