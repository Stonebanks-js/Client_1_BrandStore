---
name: premium-web
description: End-to-end pipeline for building premium, award-level interactive websites — cinematic landing pages, Apple-style scroll storytelling, 3D product showcases, scroll-driven animation, WebGL/R3F scenes, premium micro-interactions. Use whenever the user asks for a premium/high-end/$10k/Awwwards-level/Apple-style site, a cinematic landing page, scroll storytelling, a 3D product page, or a major motion pass on an existing page.
---

# Premium web build pipeline

## Decoding the brief

"Build this as a $10k premium website" means: custom art direction, premium typography,
sophisticated UX, Apple-level restraint, responsive implementation, smooth intentional
motion, scroll storytelling, optional high-quality 3D, thoughtful micro-interactions,
real accessibility, optimised performance, visual browser testing, multiple polish passes.

It does **not** mean gradients, glassmorphism, 120px headlines and animation on everything.
Restraint reads as expensive. Noise reads as cheap.

## Pipeline

Run in order. Do not skip to implementation.

1. **Discover** — audience, product, tone, references, the one feeling the page must land,
   content inventory, constraints. Ask only what changes the work.
2. **Design system** — invoke `ui-ux-pro-max` (`design`, `design-system`). Commit:
   palette + semantic tokens, type scale and pairing, spacing scale, grid, radii, elevation,
   section rhythm. Write it to `docs/design-system.md` before any component.
3. **Visual direction** — reference board, art direction statement, layout language,
   imagery treatment. `frontend-design` and `auteur` for the commit-sheet discipline.
4. **Motion system** — `genjutsu` (`/genjutsu:paint` from scratch, `/genjutsu:cast` to add
   motion). Define the easing set, duration tiers, stagger rhythm, entrance vocabulary,
   hover language, and the reduced-motion fallback — as a system, not per component.
5. **3D strategy** — decide whether 3D earns its place. If yes: asset format, poly budget,
   camera path, lighting, material approach, mobile fallback. If no, say so and move on.
6. **Component architecture** — small composable sections. One `ScrollTrigger`/timeline per
   section, owned by that section. Never one god component.
7. **Implement** — build section by section, with real content, mobile-first.
8. **Visual test** — run the dev server, open it, screenshot 390 / 834 / 1440 / 1920,
   read the console, check layout shift and frame timing. Fix. Repeat.
9. **Performance** — measure against the budgets below and fix what fails.
10. **Polish** — at least two passes: spacing/optical alignment/type detail, then motion
    timing and micro-interaction feel.

## Motion rules

Favour: smooth custom easing, carefully timed entrances, scroll-linked storytelling, subtle
parallax and depth, masking and clip-path reveals, staggered typography, cinematic image
reveals, sticky sections, controlled camera movement, contextual micro-interactions.

Avoid: everything animating, bounce-by-default, motion with no hierarchy, animation that
delays reading, scroll-jacking that fights the user.

- **GSAP + ScrollTrigger** — timeline precision, pinning, scrubbed choreography, complex sequences.
- **Motion / Framer Motion** — component enter/exit, layout animation, gestures, React state transitions.
- **Lenis** — only when smooth scroll genuinely improves the piece; verify it does not break
  ScrollTrigger sync, anchor links, or focus scrolling.
- Always `gsap.context()` / `matchMedia` scoping and kill timelines on unmount.

## Apple-style scroll storytelling

Hero reveal → pinned product with changing copy → scroll-driven camera orbit → exploded /
component breakdown → masked typography and depth transition → interactive feature demos →
final cinematic shot and CTA.

Architecture: scroll progress → ScrollTrigger timeline → normalised 0-1 progress values →
R3F scene state → camera / model / material → optional post-processing.

Drive R3F from scroll progress stored in a ref, applied in `useFrame` with damping. Never
trigger React re-renders per scroll frame.

## Performance budgets

LCP < 2.5s · CLS < 0.1 · INP < 200ms · 60fps sustained during scroll animation.

3D: GLB with Draco or Meshopt, KTX2 textures, keep draw calls low, instance repeats,
lazy-load the scene below the fold, cap DPR (`min(devicePixelRatio, 2)`), pause the render
loop when offscreen or tab-hidden, dispose geometries/materials/textures on unmount.

Mobile: lower DPR, simpler lighting, fewer particles, or swap the 3D scene for a pre-rendered
image sequence or video. Serve an intentional reduced experience, never a throttled desktop one.

Also: code split, `next/image` with correct sizes, subset and preload fonts with
`font-display: swap`, reserve space for media, keep shader complexity honest, and check for
listener/timeline/GPU leaks on route change.

## Accessibility

`prefers-reduced-motion` renders the final state immediately — never an empty page. Keyboard
paths through every interaction, visible focus, AA contrast, real semantics and landmarks,
alt text, and 3D canvases marked decorative with the meaning available in text.

## Testing loop

Build → run dev server → open in browser → screenshot the breakpoints → read console →
inspect layout shift and animation frames → fix → repeat until it holds up.
Use the `playwright` and `chrome-devtools` MCP servers, or Claude in Chrome.
