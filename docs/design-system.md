# BRAND STORE — Design System

Derived from the client's real assets: the illuminated showroom wall, the Didone B/S
monogram, and the black + gold catalog card.

## 1. Art direction

**Statement.** A menswear showroom photographed at night. Warm light raking across dark
wood, cream fabric folded under it, and one metal-gold line holding the composition.
The site is that room: mostly dark and quiet, with light arriving where it matters.

**Rules.**
- Black is the page, not a section. Cream is the ink. Gold is punctuation, never fill.
- Imagery is lit, never flat: every photo carries a warm key light and a deep falloff.
- Type is editorial — Didone display against a grotesque caption. No third voice.
- Motion is camera work: drift, focus, reveal. Nothing bounces.
- Empty space is the luxury signal. If a section feels full, remove something.

## 2. Colour

| Token | Value | Use |
|---|---|---|
| `--ink` | `#080706` | Page base, deepest shadow |
| `--ink-2` | `#0E0C0A` | Alternating section base |
| `--char` | `#171310` | Warm charcoal — cards, plates |
| `--char-2` | `#241D17` | Raised surface, hover plate |
| `--line` | `#2C241D` | Hairlines, dividers, borders |
| `--gold` | `#C9973F` | Primary metal — labels, rules, accents |
| `--gold-lt` | `#E3BE79` | Gold highlight / gradient top stop |
| `--gold-dp` | `#8A6425` | Gold shadow / gradient bottom stop |
| `--amber` | `#FFB65C` | Light source colour (glows, lamp wash) |
| `--cream` | `#F3EDE2` | Primary text on dark |
| `--cream-dim` | `#BCB3A5` | Secondary text |
| `--cream-mute` | `#8A8175` | Tertiary / meta text |
| `--ember` | `#D2662F` | Reserved warm accent |
| `--signal` | `#F5D90A` | Sale only. Sampled from the client's Off Season Sale artwork (`#F8E000`) and deepened so it sits inside the palette. Used as metal, never as fill. |
| `--signal-lt` | `#FFEE5C` | Signal highlight / gradient top stop |
| `--signal-dp` | `#A98F04` | Signal shadow / gradient bottom stop |

Contrast: `--cream` on `--ink` = 15.9:1. `--cream-dim` on `--ink` = 8.6:1.
`--cream-mute` on `--ink` = 4.7:1 (meta text ≥ 14px only). `--gold` on `--ink` = 6.4:1.

Gold is applied as a **metal gradient** (`--gold-lt` → `--gold` → `--gold-dp`) on display
type, and flat `--gold` on rules and small caps. Never as a background fill.

## 3. Typography

- **Display — Bodoni Moda.** High-contrast Didone, echoing the monogram's ball terminals
  and thin/thick stress. Used for headlines, category titles, the SALE numerals, and
  italic for brand phrases ("Good Clothes Better Mood").
- **Grotesque — Archivo.** Nav, labels, body, buttons, address. Wide weight range, slightly
  condensed cut — closest available match to the showroom's sign lettering.

Scale (fluid, `clamp`):

| Token | Size | Tracking | Use |
|---|---|---|---|
| `display-xl` | 5.5–13rem | -0.03em | Hero wordmark, SALE numerals |
| `display-l` | 3–6.5rem | -0.025em | Section headlines |
| `display-m` | 2–3.25rem | -0.02em | Category titles |
| `title` | 1.25–1.75rem | -0.01em | Card titles |
| `body-l` | 1.0625–1.25rem | 0 | Lead paragraphs |
| `body` | 1rem | 0 | Body |
| `label` | 0.6875–0.75rem | 0.22em | Small caps, eyebrows, nav |

Body measure caps at 62ch. Display line-height 0.9–1.0; body 1.65.

## 4. Space & grid

8px base. Scale: 4 8 12 16 24 32 48 64 96 128 176 240.
Section rhythm: `clamp(5.5rem, 10vw, 11rem)` vertical padding; hero and pinned sections are
viewport-driven instead.

Grid: 12 columns desktop (max 1440px content, 1680px bleed), 8 tablet, 4 mobile.
Gutter `clamp(16px, 3vw, 40px)`. Page gutter `clamp(20px, 5vw, 80px)`.

Radii: `2px` default (near-sharp, editorial), `0` on full-bleed media, `999px` for pills.
Elevation is light, not shadow: raised surfaces gain a warm inner top hairline.

## 5. Motion system

Easings
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` — entrances, reveals
- `--ease-io`: `cubic-bezier(0.65, 0, 0.35, 1)` — transforms, menus
- `--ease-cam`: `cubic-bezier(0.33, 0, 0.1, 1)` — scroll-linked camera moves

Durations: `120ms` micro · `320ms` element · `640ms` reveal · `900ms` section · `1200ms` page

Vocabulary
- **Type reveal** — mask up, per-line, 80ms stagger, `--ease-out`.
- **Image reveal** — clip-path inset with a 1.08 → 1.0 scale counter-move, 900ms.
- **Camera drift** — scrubbed parallax, 2–8% travel, never more.
- **Hover** — 120ms intent, gold hairline draw, 1.03 media scale under a fixed mask.
- **Page transition** — cream/ink curtain wipe, 600ms out / 600ms in.

Reduced motion: every reveal resolves to its end state immediately, Lenis is not mounted,
the WebGL hero is replaced by the still image, scrubbed sections become static stacks.

## 6. 3D strategy

3D earns its place in exactly one place: the hero. A single full-screen plane renders the
real showroom photograph through a shader that adds pointer- and scroll-driven parallax
depth, a breathing lens vignette, chromatic edge falloff, and film grain — the room appears
to be filmed rather than photographed. One draw call, no models, no post-processing pass.

Not mounted when: viewport < 900px, `prefers-reduced-motion`, no WebGL, or `saveData`.
Fallback is the same photograph with a CSS Ken-Burns drift, visually continuous.
The canvas is `aria-hidden`; the hero's meaning lives entirely in the DOM behind it.

## 7. Components

`SiteHeader` · `CatalogMegaMenu` · `MobileNav` · `Hero` (+ `HeroCanvas`) · `Marquee` ·
`SaleSection` (+ `OfferCard`) · `FeaturedCollection` · `CategoryCard` · `ShowroomStory` ·
`LocationSection` · `ProductViewer` (front/side/back) · `GarmentPlate` · `GarmentFlat` ·
`WhatsAppFab` · `CTAButton` · `SiteFooter` · `PageTransition` · `Grain`

Content lives in `src/data/`. Presentation never hardcodes a phone number, a URL, a
category, an address or a price.

## 8. The sale

`src/data/sale.ts` transcribes the client's Off Season Sale creative. The four offers are
reproduced exactly as printed — quantity, price and qualifier — and nothing on the site
states a price that is not one of those four. The artwork itself appears only as a leaning
printed flyer beside the masthead: a supporting visual, never the content, so every offer
stays selectable text that reflows, translates and is read out correctly.

Yellow is allowed in this section and nowhere else, and only as metal type, a hairline, a
1px hover rule and a 13%-opacity wash. Black, gold and cream still carry the section.

## 9. Catalog photography

`src/data/catalog-images.json` is the contract between the generator and the site. A
category present in the manifest renders photographs through `GarmentPlate`; a category
absent from it renders the drafted `GarmentFlat`. Nothing else in the UI changes, so
imagery can arrive one category at a time without a redesign.

Photographs ship as `.webp` at two widths (1200 and 640) and are served through a native
`srcset`, because the static export runs with the Next image optimiser disabled.
