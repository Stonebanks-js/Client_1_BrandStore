import type { GarmentKind, ViewKey } from '@/data/catalog';

/**
 * Drafted garment flats — technical fashion drawings generated parametrically so all
 * twenty-four views (eight categories × front/side/back) share one drawing hand.
 *
 * These stand in for photography that does not exist yet. They are deliberately drawings,
 * not fake photographs: nothing here implies a real garment, a fabric or a stock item.
 * When real or generated imagery arrives, `CategoryView.src` takes over and these retire.
 */

const W = 420;
const H = 600;

interface TopSpec {
  shoulder: number;
  hem: number;
  topY: number;
  hemY: number;
  neckW: number;
  neckDrop: number;
  sleeveLen: number;
  sleeveFlare: number;
  dropShoulder: number;
  collar: 'shirt' | 'polo' | 'crew';
  placket: number;
  pocket: boolean;
  cuff: boolean;
}

interface BottomSpec {
  waist: number;
  hip: number;
  knee: number;
  ankle: number;
  topY: number;
  hemY: number;
  riseY: number;
  fly: boolean;
  elastic: boolean;
  pockets: 'five' | 'slant' | 'none';
  seam: boolean;
}

const TOPS: Record<string, TopSpec> = {
  shirt: {
    shoulder: 150,
    hem: 158,
    topY: 100,
    hemY: 474,
    neckW: 48,
    neckDrop: 18,
    sleeveLen: 188,
    sleeveFlare: 24,
    dropShoulder: 0,
    collar: 'shirt',
    placket: 1,
    pocket: true,
    cuff: true,
  },
  polo: {
    shoulder: 146,
    hem: 144,
    topY: 104,
    hemY: 444,
    neckW: 50,
    neckDrop: 18,
    sleeveLen: 112,
    sleeveFlare: 22,
    dropShoulder: 0,
    collar: 'polo',
    placket: 0.28,
    pocket: false,
    cuff: false,
  },
  crew: {
    shoulder: 144,
    hem: 142,
    topY: 106,
    hemY: 438,
    neckW: 56,
    neckDrop: 24,
    sleeveLen: 104,
    sleeveFlare: 20,
    dropShoulder: 0,
    collar: 'crew',
    placket: 0,
    pocket: false,
    cuff: false,
  },
  oversized: {
    shoulder: 182,
    hem: 178,
    topY: 112,
    hemY: 478,
    neckW: 60,
    neckDrop: 22,
    sleeveLen: 150,
    sleeveFlare: 30,
    dropShoulder: 34,
    collar: 'crew',
    placket: 0,
    pocket: false,
    cuff: false,
  },
};

const BOTTOMS: Record<string, BottomSpec> = {
  jeans: {
    waist: 122,
    hip: 142,
    knee: 96,
    ankle: 82,
    topY: 92,
    hemY: 540,
    riseY: 250,
    fly: true,
    elastic: false,
    pockets: 'five',
    seam: true,
  },
  chinos: {
    waist: 118,
    hip: 136,
    knee: 92,
    ankle: 74,
    topY: 92,
    hemY: 540,
    riseY: 248,
    fly: true,
    elastic: false,
    pockets: 'slant',
    seam: false,
  },
  lower: {
    waist: 126,
    hip: 146,
    knee: 96,
    ankle: 62,
    topY: 94,
    hemY: 534,
    riseY: 256,
    fly: false,
    elastic: true,
    pockets: 'slant',
    seam: false,
  },
  dryfit: {
    waist: 120,
    hip: 138,
    knee: 88,
    ankle: 58,
    topY: 94,
    hemY: 534,
    riseY: 252,
    fly: false,
    elastic: true,
    pockets: 'none',
    seam: true,
  },
};

const CX = W / 2;

/* --- tops ---------------------------------------------------------------- */

function topPaths(spec: TopSpec, view: ViewKey) {
  const side = view === 'side';
  const back = view === 'back';
  const sh = side ? spec.shoulder * 0.46 : spec.shoulder;
  const hm = side ? spec.hem * 0.5 : spec.hem;
  const { topY, hemY } = spec;
  const armY = topY + 12 + spec.dropShoulder;
  const pits = topY + 118 + spec.dropShoulder * 0.7;

  const neckW = side ? spec.neckW * 0.42 : spec.neckW;
  const neckDrop = back ? spec.neckDrop * 0.45 : spec.neckDrop;

  const outline =
    `M ${CX - neckW / 2} ${topY}` +
    ` C ${CX - neckW / 2 - 22} ${topY + 4} ${CX - sh / 2 + 18} ${topY + 6} ${CX - sh / 2} ${armY}` +
    ` L ${CX - hm / 2} ${hemY}` +
    ` Q ${CX} ${hemY + 16} ${CX + hm / 2} ${hemY}` +
    ` L ${CX + sh / 2} ${armY}` +
    ` C ${CX + sh / 2 - 18} ${topY + 6} ${CX + neckW / 2 + 22} ${topY + 4} ${CX + neckW / 2} ${topY}` +
    (back
      ? ` Q ${CX} ${topY + neckDrop} ${CX - neckW / 2} ${topY} Z`
      : ` C ${CX + neckW / 2 - 6} ${topY + neckDrop} ${CX - neckW / 2 + 6} ${topY + neckDrop} ${CX - neckW / 2} ${topY} Z`);

  const sleeves: string[] = [];
  const flare = side ? spec.sleeveFlare * 0.2 : spec.sleeveFlare;
  const sleeveEnd = armY + spec.sleeveLen;
  const mk = (dir: 1 | -1) => {
    const shx = CX + dir * (sh / 2);
    const outX = shx + dir * (flare + (side ? 6 : 14));
    const cuffIn = CX + dir * (sh / 2 - 20);
    return (
      `M ${shx} ${armY}` +
      ` C ${outX} ${armY + 22} ${outX + dir * 4} ${sleeveEnd - 60} ${outX - dir * 8} ${sleeveEnd}` +
      ` L ${cuffIn} ${sleeveEnd + 6}` +
      ` C ${cuffIn + dir * 4} ${sleeveEnd - 70} ${shx - dir * 2} ${pits + 20} ${shx - dir * 2} ${pits}`
    );
  };
  if (side) {
    sleeves.push(mk(1));
  } else {
    sleeves.push(mk(-1), mk(1));
  }

  const details: string[] = [];

  // collar
  if (spec.collar === 'shirt' && !side) {
    if (back) {
      details.push(
        `M ${CX - neckW / 2 - 6} ${topY - 2} Q ${CX} ${topY + 20} ${CX + neckW / 2 + 6} ${topY - 2}` +
          ` L ${CX + neckW / 2 + 4} ${topY - 14} Q ${CX} ${topY + 6} ${CX - neckW / 2 - 4} ${topY - 14} Z`,
      );
    } else {
      details.push(
        `M ${CX - neckW / 2} ${topY} L ${CX - 10} ${topY + 54} L ${CX - neckW / 2 - 16} ${topY + 20} Z`,
        `M ${CX + neckW / 2} ${topY} L ${CX + 10} ${topY + 54} L ${CX + neckW / 2 + 16} ${topY + 20} Z`,
      );
    }
  } else if (spec.collar === 'polo' && !side) {
    details.push(
      `M ${CX - neckW / 2 - 4} ${topY + 2} Q ${CX} ${topY + neckDrop + 12} ${CX + neckW / 2 + 4} ${topY + 2}` +
        ` L ${CX + neckW / 2 + 2} ${topY - 10} Q ${CX} ${topY + neckDrop} ${CX - neckW / 2 - 2} ${topY - 10} Z`,
    );
  } else if (spec.collar === 'crew' && !side) {
    details.push(
      `M ${CX - neckW / 2 - 7} ${topY - 1} C ${CX - neckW / 2 - 3} ${topY + neckDrop + 10} ${CX + neckW / 2 + 3} ${topY + neckDrop + 10} ${CX + neckW / 2 + 7} ${topY - 1}`,
    );
  } else if (side) {
    details.push(`M ${CX - neckW / 2 - 4} ${topY + 2} Q ${CX + 6} ${topY + 16} ${CX + neckW / 2 + 6} ${topY + 2}`);
  }

  // placket / buttons / yoke
  if (spec.placket > 0 && !back && !side) {
    const end = topY + (hemY - topY) * spec.placket;
    details.push(`M ${CX - 9} ${topY + 18} L ${CX - 9} ${end}`, `M ${CX + 9} ${topY + 18} L ${CX + 9} ${end}`);
  }
  if (back && spec.collar === 'shirt') {
    details.push(`M ${CX - sh / 2 + 6} ${topY + 66} Q ${CX} ${topY + 80} ${CX + sh / 2 - 6} ${topY + 66}`);
    details.push(`M ${CX} ${topY + 76} L ${CX} ${hemY + 4}`);
  }
  if (spec.pocket && !back && !side) {
    details.push(
      `M ${CX - 76} ${topY + 96} L ${CX - 28} ${topY + 96} L ${CX - 28} ${topY + 140} L ${CX - 52} ${topY + 152} L ${CX - 76} ${topY + 140} Z`,
    );
  }
  if (spec.cuff) {
    const cuffTop = sleeveEnd - 26;
    const dirs: Array<1 | -1> = side ? [1] : [-1, 1];
    dirs.forEach((dir) => {
      const outX = CX + dir * (sh / 2) + dir * (flare + (side ? 2 : 6));
      const inX = CX + dir * (sh / 2 - 20);
      details.push(`M ${outX} ${cuffTop} L ${inX} ${cuffTop + 4}`);
    });
  }
  if (side) {
    details.push(`M ${CX - hm / 2 + 8} ${topY + 40} L ${CX - hm / 2 + 4} ${hemY - 6}`);
  }

  const buttons =
    spec.placket > 0 && !back && !side
      ? Array.from({ length: spec.placket === 1 ? 6 : 2 }, (_, i) => topY + 58 + i * ((hemY - topY) * (spec.placket === 1 ? 0.13 : 0.1)))
      : [];

  return { outline, sleeves, details, buttons };
}

/* --- bottoms ------------------------------------------------------------- */

function bottomPaths(spec: BottomSpec, view: ViewKey) {
  const side = view === 'side';
  const back = view === 'back';
  const f = side ? 0.5 : 1;
  const { topY, hemY, riseY } = spec;
  const waist = spec.waist * f;
  const hip = spec.hip * f;
  const knee = spec.knee * (side ? 0.9 : 1);
  const ankle = spec.ankle * (side ? 0.95 : 1);
  const kneeY = topY + (hemY - topY) * 0.62;

  const leg = (dir: 1 | -1) => {
    const outerTop = CX + dir * waist;
    const outerHip = CX + dir * hip;
    const innerTop = CX + dir * 4;
    const outerKnee = CX + dir * (knee + (side ? 0 : 2));
    const innerKnee = CX + dir * (knee - (side ? knee * 0.92 : 52));
    const outerHem = CX + dir * ankle;
    const innerHem = CX + dir * (ankle - (side ? ankle * 0.92 : 44));
    return (
      `M ${outerTop} ${topY}` +
      ` C ${outerHip} ${topY + 54} ${outerKnee + dir * 10} ${kneeY - 70} ${outerKnee} ${kneeY}` +
      ` C ${outerKnee - dir * 2} ${kneeY + 60} ${outerHem} ${hemY - 40} ${outerHem} ${hemY}` +
      ` L ${innerHem} ${hemY}` +
      ` C ${innerHem} ${hemY - 40} ${innerKnee} ${kneeY + 60} ${innerKnee} ${kneeY}` +
      ` C ${innerKnee} ${kneeY - 80} ${innerTop} ${riseY + 30} ${innerTop} ${riseY}` +
      ` L ${CX} ${riseY - (side ? 0 : 6)}` +
      ` L ${CX} ${topY}` +
      ` Z`
    );
  };

  const outline = side ? [leg(1)] : [leg(-1), leg(1)];
  const waistBand =
    `M ${CX - waist} ${topY} Q ${CX} ${topY - (side ? 4 : 10)} ${CX + waist} ${topY}` +
    ` L ${CX + waist - 2} ${topY + 26} Q ${CX} ${topY + 16} ${CX - waist + 2} ${topY + 26} Z`;

  const details: string[] = [];
  details.push(`M ${CX - waist + 2} ${topY + 26} Q ${CX} ${topY + 16} ${CX + waist - 2} ${topY + 26}`);

  if (spec.elastic) {
    for (let i = 0; i < 5; i += 1) {
      const x = CX - waist + 10 + i * ((waist * 2 - 20) / 4);
      details.push(`M ${x} ${topY + 4} L ${x - 3} ${topY + 24}`);
    }
  }
  if (spec.fly && !back && !side) {
    details.push(`M ${CX + 4} ${topY + 26} C ${CX + 16} ${topY + 66} ${CX + 12} ${riseY - 40} ${CX + 2} ${riseY - 6}`);
  }
  if (spec.pockets === 'five' && !side) {
    if (back) {
      details.push(
        `M ${CX - 86} ${topY + 40} L ${CX - 26} ${topY + 40} L ${CX - 30} ${topY + 96} L ${CX - 82} ${topY + 96} Z`,
        `M ${CX + 26} ${topY + 40} L ${CX + 86} ${topY + 40} L ${CX + 82} ${topY + 96} L ${CX + 30} ${topY + 96} Z`,
        `M ${CX - waist + 4} ${topY + 34} Q ${CX} ${topY + 50} ${CX + waist - 4} ${topY + 34}`,
      );
    } else {
      details.push(
        `M ${CX - waist + 6} ${topY + 30} C ${CX - waist + 34} ${topY + 72} ${CX - 56} ${topY + 84} ${CX - 40} ${topY + 82}`,
        `M ${CX + waist - 6} ${topY + 30} C ${CX + waist - 34} ${topY + 72} ${CX + 56} ${topY + 84} ${CX + 40} ${topY + 82}`,
        `M ${CX + waist - 46} ${topY + 30} L ${CX + waist - 20} ${topY + 30} L ${CX + waist - 24} ${topY + 58} L ${CX + waist - 46} ${topY + 54} Z`,
      );
    }
  } else if (spec.pockets === 'slant' && !side && !back) {
    details.push(
      `M ${CX - waist + 8} ${topY + 32} L ${CX - 48} ${topY + 88}`,
      `M ${CX + waist - 8} ${topY + 32} L ${CX + 48} ${topY + 88}`,
    );
  } else if (spec.pockets === 'slant' && side) {
    details.push(`M ${CX + waist - 6} ${topY + 34} L ${CX + 26} ${topY + 86}`);
  }
  if (spec.seam) {
    const dirs: Array<1 | -1> = side ? [1] : [-1, 1];
    dirs.forEach((dir) => {
      details.push(
        `M ${CX + dir * (hip * 0.82)} ${topY + 62} C ${CX + dir * (knee * 0.84)} ${kneeY - 60} ${CX + dir * (ankle * 0.86)} ${hemY - 90} ${CX + dir * (ankle * 0.82)} ${hemY - 10}`,
      );
    });
  }
  const hemLine = side
    ? [`M ${CX + ankle - 2} ${hemY - 26} L ${CX + ankle * 0.08 + 4} ${hemY - 26}`]
    : [
        `M ${CX - ankle - 2} ${hemY - 26} L ${CX - ankle + 46} ${hemY - 26}`,
        `M ${CX + ankle + 2} ${hemY - 26} L ${CX + ankle - 46} ${hemY - 26}`,
      ];
  details.push(...hemLine);

  return { outline, waistBand, details };
}

export interface GarmentFlatProps {
  garment: GarmentKind;
  view: ViewKey;
  tone: string;
  className?: string;
}

export default function GarmentFlat({ garment, view, tone, className }: GarmentFlatProps) {
  const isTop = garment in TOPS;
  const uid = `${garment}-${view}`;

  const stroke = tone;
  const thin = 1.1;
  const thick = 2.1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.3" />
          <stop offset="55%" stopColor={tone} stopOpacity="0.15" />
          <stop offset="100%" stopColor={tone} stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`edge-${uid}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
          <stop offset="38%" stopColor={tone} stopOpacity="0.95" />
          <stop offset="100%" stopColor={tone} stopOpacity="0.62" />
        </linearGradient>
      </defs>

      {isTop
        ? (() => {
            const spec = TOPS[garment];
            const { outline, sleeves, details, buttons } = topPaths(spec, view);
            return (
              <g
                fill="none"
                stroke={`url(#edge-${uid})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              >
                {sleeves.map((d, i) => (
                  <path key={`s${i}`} d={d} fill={`url(#fill-${uid})`} strokeWidth={thick} />
                ))}
                <path d={outline} fill={`url(#fill-${uid})`} strokeWidth={thick} />
                {details.map((d, i) => (
                  <path key={`d${i}`} d={d} strokeWidth={thin} opacity={0.7} />
                ))}
                {buttons.map((cy, i) => (
                  <circle key={`b${i}`} cx={CX} cy={cy} r={3.2} strokeWidth={thin} opacity={0.75} />
                ))}
              </g>
            );
          })()
        : (() => {
            const spec = BOTTOMS[garment];
            const { outline, waistBand, details } = bottomPaths(spec, view);
            return (
              <g
                fill="none"
                stroke={`url(#edge-${uid})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              >
                {outline.map((d, i) => (
                  <path key={`l${i}`} d={d} fill={`url(#fill-${uid})`} strokeWidth={thick} />
                ))}
                <path d={waistBand} fill={`url(#fill-${uid})`} strokeWidth={thick} />
                {details.map((d, i) => (
                  <path key={`d${i}`} d={d} strokeWidth={thin} opacity={0.65} />
                ))}
              </g>
            );
          })()}
    </svg>
  );
}

export { W as FLAT_W, H as FLAT_H };
