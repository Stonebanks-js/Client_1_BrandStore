/**
 * template.tsx remounts on every navigation, which is exactly the hook a route
 * transition needs: the new page fades up 32px over 700ms.
 *
 * This is a CSS animation rather than a Framer one on purpose. Framer's
 * `useReducedMotion` returns false during the static render and true on a client that
 * asks for reduced motion, so branching on it made the server and client trees differ
 * and hydration failed. A keyframe has no such split, and the global
 * `prefers-reduced-motion` block already collapses its duration to nothing.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-in">{children}</div>;
}
