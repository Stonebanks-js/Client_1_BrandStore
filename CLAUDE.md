# Client_1_BrandStore

Environment tuned for **premium interactive web**: cinematic landing pages, Apple-style
scroll storytelling, 3D product showcases, high-end motion and UI/UX.

## Default stack

Next.js (App Router) · React · TypeScript · Tailwind CSS
Motion: GSAP + ScrollTrigger (scroll choreography), Motion/Framer Motion (component +
layout transitions), Lenis (smooth scroll, only when it earns its place)
3D: Three.js · React Three Fiber · Drei — GLSL only when a material/effect needs it

Install runtime packages **per project, never globally**. Add 3D only when it carries the story.

## Skill routing

| When | Use |
|---|---|
| Visual direction, palette, type, UX, landing patterns, stack rules | `ui-ux-pro-max` (`design`, `design-system`, `ui-styling`) |
| Interface craft, avoiding generic AI aesthetics | `frontend-design` |
| Full art-direction pipeline + anti-slop / 60fps gates | `auteur` |
| Motion + visual systems (GSAP, Motion, R3F, CSS native) | `genjutsu` → `/genjutsu:cast`, `/genjutsu:paint` |
| Cinematic sequencing & animation concepts (knowledge only) | `remotion-markup`, `remotion-best-practices` |
| Build pipeline for a premium site end to end | `premium-web` (project skill) |

Remotion is a **reference for motion thinking**. Never add it as a runtime dependency
unless the project actually renders video.

## Browser + performance testing

`playwright` MCP · `chrome-devtools` MCP · Claude in Chrome. Never ship a page that has
only been read as JSX — run it, screenshot it at 390 / 834 / 1440 / 1920, read the console,
trace the animation frames.

## Hard rules

- Design system before components. No JSX until direction is committed.
- Motion is intentional: easing, timing and hierarchy over quantity.
- Honour `prefers-reduced-motion` with a real static fallback, not a dead page.
- Mobile gets a deliberately reduced experience, not the desktop scene at low FPS.
- "$10k premium" means art direction and engineering quality — not gradients,
  glassmorphism, giant text and animation everywhere.
