'use client';

import { useEffect, useState } from 'react';

const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='180' height='180' filter='url(#n)' opacity='0.55'/>
    </svg>`.replace(/\s+/g, ' '),
  );

/**
 * A single fixed grain layer. It is what stops large flat blacks from banding and gives the
 * page the texture of a photographed room rather than a painted div. Skipped on coarse
 * pointers, where it costs a composited layer for almost no visual return.
 */
export default function Grain() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(window.matchMedia('(pointer: fine)').matches);
  }, []);

  if (!on) return null;

  return <div className="grain" aria-hidden style={{ ['--grain-url' as string]: `url("${NOISE}")` }} />;
}
