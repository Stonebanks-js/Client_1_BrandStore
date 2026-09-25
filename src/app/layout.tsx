import type { Metadata, Viewport } from 'next';
import { Archivo, Bodoni_Moda } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import MotionLayer from '@/components/MotionLayer';
import WordmarkBand from '@/components/WordmarkBand';
import { themeScript } from '@/components/ThemeToggle';
import { addressFull, site } from '@/data/site';

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
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
});

const description =
  `${site.name} is a ${site.segment.toLowerCase()} showroom on Sabji Mandi Road, Arya Nagar, ` +
  `Kanpur. Shirts, tees, polos, jeans, chinos and lowers — chosen for style, quality and the ` +
  `man wearing them.`;

export const metadata: Metadata = {
  metadataBase: new URL('https://brandstore.example'),
  title: {
    default: `${site.name} — ${site.segment} in Kanpur`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    'menswear Kanpur',
    'BRAND STORE Kanpur',
    'off season sale Kanpur',
    'oversized t-shirts Kanpur',
    'Arya Nagar clothing store',
  ],
  openGraph: {
    title: `${site.name} — ${site.segment}`,
    description,
    type: 'website',
    locale: 'en_IN',
    images: [site.images.showroom],
  },
  icons: { icon: site.images.monogram, apple: site.images.monogram },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f3' },
    { media: '(prefers-color-scheme: dark)', color: '#080706' },
  ],
};

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: site.name,
  slogan: site.phrase,
  image: site.images.showroom,
  telephone: site.phoneDisplay,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: 'IN',
  },
  description: `${site.name}, ${addressFull}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bodoni.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets data-theme before first paint so the page never flashes the wrong one. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-word]{transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />

        <a
          href="#main"
          className="t-btn sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-btn-bg focus:px-4 focus:py-3 focus:text-btn-fg"
        >
          Skip to content
        </a>

        <MotionLayer />
        <Header />
        <main id="main" className="pt-[clamp(60px,7vw,76px)]">
          {children}
        </main>
        <WordmarkBand />
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
