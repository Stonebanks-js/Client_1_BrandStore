/**
 * Prompt definitions for the catalog photography.
 *
 * One shop, one light, one look. Each category keeps a single model and a single
 * garment across front/side/back — that consistency is enforced at generation time by
 * feeding the front frame back in as a reference for the other two views.
 *
 * Where the client's own product photography exists (cropped out of the Off Season Sale
 * creative), it is passed in as the primary visual reference so the generated garment
 * matches the real product rather than inventing one.
 */

/** Shared setup — repeated verbatim so every frame belongs to the same shoot. */
export const SETUP = [
  'A natural, professional user-generated-content style photograph of a real man, taken',
  'inside a modern menswear showroom. The setting is warm and real: a dark wood slat wall,',
  'warm LED strip lighting along the shelving, folded clothes stacked on lit shelves out of',
  'focus in the background, and soft daylight coming in from the shopfront to the left.',
  'Shot handheld on a recent flagship smartphone at roughly eye level, with the natural',
  'slightly wide rendering and gentle depth of field that a phone camera gives. Available',
  'light only — no studio strobes, no softbox, no seamless paper backdrop. The exposure is',
  'good and the framing is deliberate, but it reads as a real photo taken in a real shop,',
  'not as a studio campaign: mildly uneven light, a warm cast from the shop lighting, honest',
  'colour, and a little natural grain in the shadows.',
].join(' ');

/** Realism constraints, applied to every frame. */
export const REALISM = [
  'Absolute photorealism. The man must look like an ordinary real person photographed on a',
  'real day, not a model in a campaign: visible skin texture and pores, natural uneven skin',
  'tone, faint stubble, slightly imperfect hair, a small natural asymmetry to the face.',
  'Real fabric behaviour — natural creases where the garment folds, a slightly rumpled hem,',
  'the way cotton actually sits on a body rather than a perfectly pressed sample. Hands',
  'fully visible and anatomically correct with exactly five fingers each, relaxed and',
  'naturally positioned. Correct human body proportions. Relaxed, natural, understated',
  'posture with the weight on one leg and the shoulders easy — the way someone stands when a',
  'friend takes their photo. Not an exaggerated influencer pose, no jumping, no dramatic',
  'gesture, no hand framing the face. A calm, everyday, slightly reserved expression with a',
  'hint of ease. No beauty retouching, no skin smoothing, no plastic or waxy skin, no',
  'airbrushing, no HDR glow, no CGI or 3D render look, no illustration, no AI artefacts, no',
  'warped hands or fingers, no extra limbs, no distorted face, no uncanny symmetry.',
  'No text, captions, watermarks, labels, price tags or graphics anywhere in the frame.',
].join(' ');

/** Framing per view. The model and garment are held constant by the reference image. */
export const VIEWS = {
  front: [
    'Full-length front view, the man facing the camera straight on, head and both feet in',
    'frame, centred with a little headroom. Looking toward the camera with a relaxed,',
    'unforced expression.',
  ].join(' '),
  side: [
    'Exactly the same man, same garment, same colour, same styling, same studio, same',
    'lighting and same showroom background as the reference image. Only the camera has moved:',
    'this is a full-length side profile, the man turned 90 degrees to his left so his right',
    'shoulder faces the camera. Head and both feet in frame, same distance and same framing as',
    'before. Do not change the garment, its colour, its print, its fit, the background or the',
    'model. Same face, same haircut, same skin tone, same build.',
  ].join(' '),
  back: [
    'Exactly the same man, same garment, same colour, same styling, same studio, same',
    'lighting and same showroom background as the reference image. Only the camera has moved:',
    'this is a full-length back view, the man turned away from the camera so his back faces the',
    'lens. Head and both feet in frame, same distance and same framing as before. Do not change',
    'the garment, its colour, its print, its fit, the background or the model. Same haircut,',
    'same skin tone, same build.',
  ].join(' '),
};

/**
 * `reference` points at a crop of the client's real product taken from their sale creative.
 * Categories without one are marked `referenceNote` so it is obvious in the manifest which
 * images are a real product and which are a tasteful category representation.
 */
export const CATEGORIES = [
  {
    slug: 'shirts',
    model:
      'A 28 year old Indian man with a short neat haircut, light stubble, medium-brown skin, slim athletic build, around 5 foot 11',
    garment:
      'wearing a plain deep-indigo cotton casual shirt, long sleeves rolled twice to just below the elbow, a soft point collar, a clean button placket, worn open at the top button and tucked loosely into the trousers',
    styling: 'paired with stone-beige straight-leg trousers and plain white leather sneakers',
    reference: null,
    referenceNote: 'Category representation — no client product photograph supplied',
  },
  {
    slug: 'polo-t-shirts',
    model:
      'A 26 year old Indian man with a clean fade haircut, neatly trimmed beard, warm medium-brown skin, athletic build, around 5 foot 10',
    garment:
      'wearing the navy blue cotton pique polo shirt from the reference image. Reproduce that polo exactly: the same navy body, the same ribbed collar and short sleeve cuffs with their thin white and black twin tipping stripes, the same two-button placket, and the same small embroidered crowned BS monogram on the left chest in the same position and the same size',
    styling: 'paired with charcoal slim chinos and white minimal sneakers',
    reference: 'product-polo.png',
    referenceStrength:
      'The second image is the client\'s actual product photograph. The polo on the model must match it exactly in colour, collar tipping, placket and chest logo. Do not redesign it, do not move or restyle the logo, and do not add any other logo, brand name or text.',
  },
  {
    slug: 'round-neck-t-shirts',
    model:
      'A 27 year old Indian man with slightly wavy medium-length hair, light stubble, medium-brown skin, lean build, around 5 foot 10',
    garment:
      'wearing the plain olive-green round neck cotton t-shirt from the reference image: a regular fit, a flat ribbed crew neckline, short sleeves ending mid-bicep, completely plain with no print, no logo and no graphic of any kind',
    styling: 'paired with dark indigo straight jeans and off-white canvas sneakers',
    reference: 'product-round-neck.png',
    referenceStrength:
      'The second image shows the client\'s actual round neck t-shirts. Match the olive-green colourway, the plain unbranded body and the flat ribbed neckline exactly. The t-shirt must stay completely plain — no print, no logo, no text.',
  },
  {
    slug: 'oversized-t-shirts',
    model:
      'A 25 year old Indian man with a modern textured haircut, clean shaven, medium-brown skin, average build, around 5 foot 9',
    garment:
      'wearing the black oversized cotton t-shirt from the reference image: a genuinely oversized boxy fit with the shoulder seam dropped well down the upper arm, a wide straight body, short wide sleeves and a plain front with no print on the chest',
    styling: 'paired with charcoal relaxed trousers and black low-top sneakers',
    reference: 'product-oversized.png',
    referenceStrength:
      'The second image shows the client\'s actual oversized t-shirts, which are printed on the back only. The front of the t-shirt must be completely plain. Match the black colourway and the dropped-shoulder oversized cut exactly.',
    backExtra:
      'The back of this oversized t-shirt carries the client\'s back print, exactly as shown in the reference image: the words GOOD THINGS TAKE TIME set in four lines of bold white handwritten-style capitals across the upper back, with a small white smiley face after the final word. Reproduce that print faithfully in the same position, scale and style. Add nothing else.',
  },
  {
    slug: 'jeans',
    model:
      'A 29 year old Indian man with short cropped hair, a short beard, medium-brown skin, athletic build, around 6 foot',
    garment:
      'wearing mid-blue straight-fit denim jeans with a standard five-pocket construction, a plain button fly, subtle natural fading at the thighs and a clean unrolled hem, completely unbranded with no patches, no embroidery and no visible labels',
    styling: 'paired with a plain white crew neck t-shirt tucked loosely, and tan suede shoes',
    reference: null,
    referenceNote: 'Category representation — no client product photograph supplied',
  },
  {
    slug: 'chinos',
    model:
      'A 27 year old Indian man with a neat side-parted haircut, light stubble, medium-brown skin, slim build, around 5 foot 11',
    garment:
      'wearing stone-beige cotton chinos with a clean flat waistband, slanted side pockets, a slim straight leg and a clean hem breaking just on the shoe, completely unbranded',
    styling: 'paired with a plain navy round neck t-shirt tucked in, and white leather sneakers',
    reference: null,
    referenceNote: 'Category representation — no client product photograph supplied',
  },
  {
    slug: 'lower',
    model:
      'A 26 year old Indian man with a short fade haircut, clean shaven, medium-brown skin, athletic build, around 5 foot 10',
    garment:
      'wearing the black track pants from the reference image: a soft cotton-blend fabric, an elasticated waistband with a visible black drawstring, side zip pockets, two thin white stripes running down the full length of the outer leg, and a tapered leg ending at the ankle. The garment must be completely unbranded — do not reproduce the triangular logo from the reference or add any other logo, badge or text',
    styling: 'paired with a plain charcoal round neck t-shirt and black sneakers',
    reference: 'product-lower.png',
    referenceStrength:
      'The second image is the client\'s actual track pant. Match the black colourway, the twin white side stripes, the elasticated drawstring waist, the side pockets and the tapered leg exactly. Leave the garment unbranded: no logo of any kind anywhere on it.',
  },
  {
    slug: 'cotton-dry-fit',
    model:
      'A 28 year old Indian man with very short hair, light stubble, medium-brown skin, lean athletic build, around 5 foot 11',
    garment:
      'wearing plain slate-grey active track pants in a smooth lightweight technical fabric, with a flat elasticated waistband, a clean tapered leg ending at the ankle and no side stripe, completely unbranded with no logo or text',
    styling: 'paired with a plain black short sleeve training t-shirt and grey running shoes',
    reference: null,
    referenceNote: 'Category representation — no client product photograph supplied',
  },
];

/** Builds the full prompt for one view of one category. */
export function buildPrompt(category, view) {
  const parts = [
    SETUP,
    `Subject: ${category.model}, ${category.garment}, ${category.styling}.`,
    VIEWS[view],
  ];

  if (view === 'back' && category.backExtra) parts.push(category.backExtra);
  if (category.reference && category.referenceStrength) parts.push(category.referenceStrength);

  parts.push(REALISM);
  parts.push(
    'The garment is the subject of the photograph and must be clearly and completely visible,',
    'well lit and unobstructed, even though the photograph itself should feel casual and real.',
  );

  return parts.join('\n\n');
}
