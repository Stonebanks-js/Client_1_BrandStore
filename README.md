# BRAND STORE — Menswear, Kanpur

A static, catalog-and-showroom website for BRAND STORE. No cart, no checkout, no accounts —
every enquiry goes to WhatsApp, and the visit ends at the door on Sabji Mandi Road.

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis ·
Three.js / React Three Fiber. Exported as plain HTML — there is no Node server in production.

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

## What to change, and where

Everything the client is likely to change lives in two files. Nothing in the UI hardcodes a
number, a URL, an address or a discount.

### `src/data/site.ts`

| Value | Field |
|---|---|
| WhatsApp number | `whatsappNumber` (digits only, with country code) and `phoneDisplay` |
| Default WhatsApp message | `whatsappMessage` |
| **Instagram URL** | `instagram.url` — **currently a placeholder**, see below |
| Address | `location.line1` / `line2` / `city` / `region` |
| Map pin | `location.coordinates` — `null` today, so the map resolves the address by search |
| Tagline and brand phrase | `tagline`, `taglineParts`, `phrase` |

### `src/data/sale.ts`

The Off Season Sale, transcribed from the client's creative. Four offers, each with its
quantity, price, qualifier, feature list, handwritten line and colourways. Editing an offer
here updates the home section, its WhatsApp message and its colour swatches together. No
price appears anywhere on the site that is not one of these four.

### `src/data/catalog.ts`

The eight categories, their copy and their front/side/back views. Adding a category adds it
to the mega menu, the home page collection, the catalog page, the footer and its own page —
no components need touching.

---

## The Instagram placeholder

`site.instagram.url` is set to:

```
https://instagram.com/__BRANDSTORE_INSTAGRAM_HANDLE__
```

Every Instagram button, hover state and link on the site reads that one value. Replace it
with the real profile URL, set `instagram.handle`, and set `isPlaceholder: false`. Nothing
else needs to change.

---

## Catalog photography

Each category has three views: front, side and back.

`src/data/catalog-images.json` is the contract. A category listed there renders
photographs; one that is not falls back to a **drafted garment flat** — a technical fashion
drawing produced parametrically in `src/components/GarmentFlat.tsx`. So imagery can arrive
one category at a time and nothing ever renders broken.

### Generating it

```bash
cp .env.example .env.local          # then paste your Google AI Studio key in
npm run generate:catalog            # only what is missing
npm run generate:catalog -- --force # regenerate everything
npm run generate:catalog -- --only polo-t-shirts,lower
npm run generate:catalog -- --views front
```

`scripts/generate-catalog.mjs` runs on your machine, in Node, and nowhere else. It:

1. reads `GEMINI_API_KEY` from `.env.local` (git-ignored) or the shell;
2. generates the **front** frame first — for the four categories the client photographed on
   the sale creative, their real product crop from `assets/reference/` goes in as a visual
   reference so the garment matches the actual product;
3. generates **side** and **back** by passing that front frame back in as a reference, so
   the same man in the same clothes under the same light simply turns around instead of
   being re-imagined from the text;
4. writes the raw PNG to `assets/generated/` (git-ignored) and optimised `.webp` at 1200px
   and 640px into `public/catalog/<slug>/`;
5. rewrites `src/data/catalog-images.json`.

Prompts live in `scripts/catalog-prompts.mjs` — one shared studio setup, one shared realism
block, per-category model and garment descriptions. Edit the prompt, re-run with `--force`.

The script tries `gemini-3-pro-image` (Nano Banana Pro), then `gemini-3.1-flash-image`, then
`gemini-2.5-flash-image`, and reports which one answered. Pin one with `GEMINI_IMAGE_MODEL`.

### Using the client's own photography instead

Drop `front.webp` / `side.webp` / `back.webp` (plus optional `@640` variants) into
`public/catalog/<slug>/`, add the entry to `catalog-images.json`, rebuild. Real product
photographs always beat generated ones and should replace them as they arrive.

### The API key

- Lives only in `.env.local`, which `.gitignore` excludes along with every other `.env`
  variant except the checked-in `.env.example` template.
- Is read only by a Node script. It is never imported by anything under `src/`, never
  prefixed `NEXT_PUBLIC_`, never inlined into the bundle and never sent to a browser.
- Only the script's *output* — `.webp` files — is deployed.

---

## Structure

```
src/
  app/                    home · about · catalog · catalog/[slug] · 404
  components/             one component per section, each owning its own timeline
  data/                   site · sale · catalog · nav  (content, never presentation)
  data/catalog-images.json  written by the generator; the site reads it
  lib/motion.ts           reveal observer, reduced-motion + breakpoint hooks, lazy GSAP
scripts/                  generate-catalog.mjs + catalog-prompts.mjs (local only)
assets/reference/         the client's sale creative and product crops taken from it
assets/generated/         raw generation output (git-ignored, never deployed)
public/brand/             the client's real assets: showroom, monogram, sale poster
public/catalog/<slug>/    generated front/side/back .webp, two widths each
docs/design-system.md     palette, type, spacing, motion, 3D, sale and imagery rules
```

## Motion and 3D

- GSAP + ScrollTrigger drives the scrubbed sale masthead — the word and the flyer drift
  against each other as the section passes. The section owns and reverts its own
  `gsap.context` on unmount, and `matchMedia` switches it off below 860px.
- Lenis is mounted only on fine-pointer devices with motion allowed, and is driven from
  GSAP's ticker so ScrollTrigger stays in sync.
- The only WebGL on the site is the hero: one full-screen shader plane rendering the real
  showroom photograph with pointer/scroll parallax, a breathing lens, chromatic edge falloff
  and a warm grade. One draw call, no models. It is not mounted below 1024px, under
  `prefers-reduced-motion`, without WebGL, or on Save-Data; the fallback is the same
  photograph with a CSS drift. Its render loop parks when the hero scrolls away.
- `prefers-reduced-motion` renders every section in its final state: no Lenis, no pinning,
  no canvas, no scrubbing — and never a blank page. A `<noscript>` rule does the same if
  JavaScript never runs.

## Verified

Production build served as static files from `out/`:

- Home, About, Catalog, all eight category pages, and 404 load directly by URL
- Catalog mega menu (hover + keyboard), mobile accordion, front/side/back viewer
- WhatsApp deep links (general, sale, per-category, visit) and the Instagram placeholder
- Location section: drafted map sequence hands over to the live keyless Google Maps embed
- 390 / 834 / 1440 viewports, no horizontal overflow
- Sale section: four offers as live text, per-offer WhatsApp links, poster as supporting visual
- Lighthouse (mobile): Accessibility 100, Best Practices 100, SEO 100
- LCP 932 ms, CLS 0.00, no console errors
- No `GEMINI_` reference anywhere in `src/` or in the built output
