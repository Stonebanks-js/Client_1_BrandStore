# BRAND STORE — Menswear, Kanpur

A static catalog-and-showroom website for BRAND STORE. No cart, no checkout, no accounts —
every enquiry goes to WhatsApp, and the visit ends at the door on Sabji Mandi Road.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4. Exported as plain HTML;
there is no Node server in production and there are no runtime dependencies beyond React.

---

## Deploying to cPanel / MilesWeb

```bash
npm install
npm run build      # writes the site to out/
```

**Upload the entire contents of `out/` into `public_html/`.**

Upload the *contents*, not the folder itself: `public_html/index.html`, `public_html/_next/…`,
`public_html/about/…`, and so on. The export includes a `.htaccess` that sets the 404
document, adds the trailing slash where a visitor types a path without one, and sets cache
headers. Make sure hidden files are visible in the cPanel File Manager so `.htaccess` is
actually uploaded (Settings → Show Hidden Files).

Nothing else is required: no Node app, no database, no API keys, no environment variables.

To check the production build locally before uploading:

```bash
npm run serve      # serves out/ on http://localhost:4178
```

---

## Routes

| Path | Page | Nav label |
|---|---|---|
| `/` | Home — hero, sale ticker, sale band, featured rail, editorial, categories, location | Home |
| `/catalog/` | Shop — sticky filter bar over the full product grid | Shop |
| `/sale/` | Off Season Sale campaign — poster, four offer rows, marks strip | Sale |
| `/about/` | Visit the store — photo hero, categories card, location and map | Store |

The mobile menu labels the last one "Visit the store". Every page closes with the wordmark
band and the footer, and carries the floating WhatsApp CTA.

---

## What to change, and where

Everything the client is likely to change lives in two files. Nothing in the UI hardcodes a
number, a URL, an address or a price.

### `src/data/site.ts`

| Value | Field |
|---|---|
| WhatsApp number | `whatsappNumber` (digits only, with country code) |
| Default WhatsApp message | `whatsappMessage` |
| Phone | `phoneDisplay`, `phoneTel` |
| **Instagram URL** | `instagramUrl` — **currently a placeholder**, see below |
| Address | `address.line1` / `line2` / `locality` / `city` / `region` |
| Tagline and brand phrase | `tagline`, `phrase`, `signoff` |
| Navigation | `nav` |

### `src/data/products.ts`

The eight categories, the ten product lines, and the four Off Season Sale offers
transcribed from the client's creative. Editing an offer here updates the ticker, the home
sale band and the sale page together. No price appears anywhere on the site that is not in
this file.

A product with `primaryImage: null` renders a striped placeholder captioned
`product shot · {category}` rather than a broken image, so photography can arrive one
category at a time. Four categories — shirts, jeans, chinos and cotton/dry-fit — are in that
state today.

### `src/lib/whatsapp.ts`

`openWhatsApp()` and `whatsappUrl()`. Every conversion path on the site goes through one of
them, so the number and the message exist in exactly one place:

```
https://wa.me/918004490534?text=Hi%20Brand%20Store%20!%20Please%20send%20me%20the%20Catalog%20and%20current%20Sale%20%3F
```

---

## The Instagram placeholder

`site.instagramUrl` is set to `https://www.instagram.com/brandstore`. Every Instagram
button and link on the site — header, mobile menu, location block, footer — reads that one
value. Replace it and `instagramHandle` with the real profile; nothing else needs to change.

---

## Theme

Light and dark are both first-class. The choice is stored in `localStorage['bs-theme']`,
defaults to the operating system's `prefers-color-scheme`, and is applied before first paint
by a small inline script in `<head>` so the page never flashes the wrong theme. While the
visitor has not chosen for themselves, the site keeps following the OS.

Tokens live on `:root` and `[data-theme='dark']` in `src/app/globals.css` as plain custom
properties, and Tailwind maps its utilities onto them with `@theme inline` — so
`bg-bg`, `text-fg` and the rest resolve to `var()` at runtime and switch with the theme.

---

## Motion

`src/components/MotionLayer.tsx` is the whole motion system: one `requestAnimationFrame`
loop and one pointer listener, reading `data-*` markers off the DOM.

| Marker | Effect |
|---|---|
| `data-progress` | scroll progress bar under the header |
| `data-parallax="n"` | translateY against the parent, clamped to ±4.5% of its height |
| `data-scroll3d` | rotateX / translateZ as the parent crosses the viewport |
| `data-scrollx="n"` | horizontal drift with scroll (the wordmark band) |
| `data-ticker` | 32s marquee; scroll velocity drives its rate and skew |
| `data-tilt="n"` | pointer tilt with a radial glare, fine pointers only |
| `data-magnetic` | pull toward the pointer |
| `data-reveal` | enter from below on first intersection |
| `data-word` | masked headline line |
| `data-hero-photo` | intro scale and brightness |

Every one of them is skipped under `prefers-reduced-motion`; only the progress bar keeps
tracking. The route transition is a CSS keyframe (`.route-in`) for the same reason — a
JavaScript branch on the motion preference makes the server and client trees disagree, and
a keyframe is collapsed to nothing by the global reduced-motion block.

---

## Catalog photography

`public/catalog/<category>/<colour>.webp` plus a `@640` variant of each. Product cards and
the home sale rail load the `@640` file; the large sale rows load the full-size one.

The current photographs were cut from the client's own Off Season Sale creative, which is
why a few garments carry a visible edge where they overlapped a neighbour in the original
artwork. Replacing a file in place is all that is needed to improve one.

`scripts/generate-catalog.mjs` remains in the repo for generating the missing four
categories from a text prompt once an image-capable API key is available. It reads
`GEMINI_API_KEY` from `.env.local`, which is git-ignored and must never be committed.
