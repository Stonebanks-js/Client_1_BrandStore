# BRAND STORE — Design System

Derived from the client's real assets: the illuminated showroom wall, the Didone B/S
monogram, and the Off Season Sale creative.

## 1. Art direction

**Statement.** Photography first, product second, type third, brand fourth, motion last.
The store is a floor in Arya Nagar with warm light on dark wood and folded cotton under it;
the site is that floor, not a luxury design system with clothes in it.

**Rules.**
- Light and dark alternate. Light carries browsing and product; dark carries the brand
  statement, the sale and the close of every page.
- Gold is punctuation — an underline, a dot, a rule. It never outlines a component.
- Yellow `--signal` belongs to the sale and nothing else.
- Imagery dominates. If a section reads as decoration around a heading, cut the decoration.
- Two typographic voices, no third: Archivo and Bodoni Moda.
- Motion is camera work: drift, reveal, tilt. Nothing bounces.

## 2. Colour

Tokens are declared on `:root` (light) and `[data-theme='dark']` in `src/app/globals.css`,
then mapped into Tailwind with `@theme inline` so every utility resolves to `var()` and
follows the theme.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f7f6f3` | `#080706` | Page base |
| `--bg-2` | `#edebe5` | `#171310` | Alternating surface, image panel fallback |
| `--fg` | `#14120f` | `#f3ede2` | Primary text |
| `--fg-dim` | `#56514a` | `#bcb3a5` | Secondary text |
| `--fg-mute` | `#7d776d` | `#8a8175` | Tertiary / meta |
| `--line` | `#dcd8d0` | `#2c241d` | Hairlines, borders |
| `--accent` | `#7a5a20` | `#c9973f` | Eyebrows, inline links |
| `--gold` | `#b8863b` | `#c9973f` | Metal: underline, dots, focus ring |
| `--band` | `#14120f` | `#120f0c` | Dark band base (sale, footer, categories card) |
| `--band-2` | `#1e1b17` | `#241d17` | Raised surface on a band |
| `--on-band` | `#f7f6f3` | `#f3ede2` | Text on a band |
| `--on-band-dim` | `#bab4aa` | `#bcb3a5` | Secondary text on a band |
| `--band-line` | `#302b24` | `#2c241d` | Hairlines on a band |
| `--signal` | `#f5d90a` | `#f5d90a` | Sale only |
| `--btn-bg` / `--btn-fg` | `#14120f` / `#f7f6f3` | `#f3ede2` / `#080706` | Solid button |
| `--header-bg` | `rgba(247,246,243,.9)` | `rgba(8,7,6,.88)` | Blurred header and sticky bars |

## 3. Type

Two families, loaded through `next/font/google` as `--font-archivo` and `--font-bodoni`.

| Class | Definition |
|---|---|
| `.t-display` | Archivo 900, uppercase, letter-spacing `-0.045em`, line-height `0.84` |
| `.t-serif` | Bodoni Moda italic 400, letter-spacing `-0.02em`, line-height `1` |
| `.t-eyebrow` | Archivo 600, 11px, `0.28em`, uppercase, `--accent` |
| `.t-btn` | Archivo 700, 12px, `0.18em`, uppercase |

Button heights: 56px in a hero, 44px in the header, 52px in the mobile bar.

Masked headline lines use `.mask-line`, which carries the font-size plus a
`padding-bottom: .2em` / `margin-bottom: -.2em` pair so caps and descenders are never
cropped by the overflow that makes the mask work.

## 4. Layout

- Container `.shell`: max-width 1680px, gutter `clamp(16px, 5vw, 80px)`.
- Header height `clamp(60px, 7vw, 76px)`; `main` is padded by the same amount.
- Radius: 2px on cards and buttons, 999px on pills and the floating CTA.
- Focus: 2px `--gold` outline, offset 3px.
- Breakpoint: mobile and tablet art direction ≤1023px, desktop ≥1024px (Tailwind `lg:`).
- Product grid: `repeat(auto-fill, minmax(clamp(150px, 40vw, 280px), 1fr))`, gap
  `clamp(28px,3vw,48px) clamp(12px,2vw,28px)`.

## 5. Cascade

Tailwind v4 orders its layers `theme, base, components, utilities`, and anything left
unlayered outranks all four. The site's own rules are therefore filed deliberately:
element styles into `@layer base`, the `.shell` / `.t-*` / `.mask-line` classes into
`@layer components`. Without that, an unlayered `a { color: inherit }` silently beats
`text-btn-fg` and solid link-buttons render their label in the background colour.

## 6. Motion

Ease `cubic-bezier(0.16, 1, 0.3, 1)` unless noted. All values live in
`src/components/MotionLayer.tsx`.

| Effect | Values |
|---|---|
| Headline masks | y `115%`→0, rotate `5°`→0, 1100ms, delay `120 + i·110`ms |
| Hero photo intro | scale `1.3`→`1.1`, brightness `.4`→`1`, 2400ms `cubic-bezier(0.22,1,0.36,1)` |
| Parallax | `-(centre − viewportCentre) × speed`, clamped to ±4.5% of the container (hero `.2`, editorial `.12`) |
| Scroll 3D | `p = clamp((centre − vh/2)/(vh/1.6), −1, 1)`; `rotateX(p·32°) translateZ(−|p|·80px)`; opacity `1 − max(0, p−.4)·.8` |
| Reveal | opacity 0, `translateY(64px) rotateX(-14°) scale(.96)` → rest, 1000ms, 90ms stagger |
| Ticker | `translateX(0 → −50%)` over 32s; velocity scales the rate by `1 + |v|/8` and skews `−v/6°`, resetting after 140ms idle |
| Wordmark | `translateX = (sectionTop − 0.3vh) × 0.45` |
| Tilt | `rotateX((.5−py)·10·amt) rotateY((px−.5)·12·amt) translateY(-6px)`, 140ms follow / 700ms release; amounts: card `0.9`, home offer `0.8`, sale panel `0.6`, poster `1.4` |
| Magnetic | `dx·.22, dy·.35`, 160ms follow / 500ms release |
| Route change | fade up 32px over 700ms (`.route-in`) |

Under `prefers-reduced-motion: reduce` every one of these is skipped and the page renders
in its rest state. Only the scroll progress bar keeps tracking.
