import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Archivo } from 'next/font/google';
import './globals.css';

import SmoothScroll from '@/components/SmoothScroll';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import WhatsAppFab from '@/components/WhatsAppFab';
import Grain from '@/components/Grain';
import PageTransition from '@/components/PageTransition';
import { site } from '@/data/site';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
});

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://brandstore.example'),
  title: {
    default: `${site.name} — ${site.segment} in Kanpur`,
    template: `%s — ${site.name}`,
  },
  description:
    `${site.name} is a ${site.segment.toLowerCase()} showroom on Sabji Mandi Road, Arya Nagar, ` +
    `Kanpur. Top wear and bottom wear, chosen for style, quality and the man wearing it.`,
  keywords: [
    'menswear Kanpur',
    'BRAND STORE Kanpur',
    'shirts Kanpur',
    'jeans Kanpur',
    'Arya Nagar clothing store',
  ],
  openGraph: {
    title: `${site.name} — ${site.segment}`,
    description: site.tagline,
    type: 'website',
    locale: 'en_IN',
    images: ['/brand/showroom.jpg'],
  },
  icons: {
    icon: '/brand/monogram.jpg',
    apple: '/brand/monogram.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: '#080706',
  colorScheme: 'dark',
};

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: site.name,
  slogan: site.tagline,
  image: '/brand/showroom.jpg',
  telephone: site.phoneDisplay,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${site.location.line1}, ${site.location.line2}`,
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: 'IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bodoni.variable} ${archivo.variable}`}>
      <body>
        {/* Without JavaScript nothing adds `.is-in`, so the reveal states must resolve
            themselves rather than leaving the page blank. */}
        <noscript>
          <style>{`[data-rv]{opacity:1!important;transform:none!important}[data-rv='media']>*{clip-path:none!important;transform:none!important}.rv-line>span{transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <a
          href="#main"
          className="t-label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <PageTransition />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
        <Grain />
      </body>
    </html>
  );
}
