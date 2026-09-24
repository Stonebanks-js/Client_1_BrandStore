#!/usr/bin/env node
/**
 * Catalog photography generator — runs locally, never in the browser and never at build time.
 *
 *   npm run generate:catalog                  # only what is missing
 *   npm run generate:catalog -- --force       # regenerate everything
 *   npm run generate:catalog -- --only polo-t-shirts,lower
 *   npm run generate:catalog -- --views front
 *
 * The API key is read from .env.local (git-ignored) or the shell environment. It is never
 * written into source, never inlined into the bundle, and never reaches the client: this
 * file is a Node script, and only its *output* — optimised .webp files — is shipped.
 *
 * Consistency across front/side/back is the hard part. It is handled by generating the
 * front frame first and then passing that frame back in as a reference image for the side
 * and back, so the model, garment, colour, styling and light carry over instead of being
 * re-imagined from the text each time.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

import { CATEGORIES, buildPrompt } from './catalog-prompts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFERENCE_DIR = path.join(ROOT, 'assets', 'reference');
const RAW_DIR = path.join(ROOT, 'assets', 'generated');
const OUT_DIR = path.join(ROOT, 'public', 'catalog');
const MANIFEST = path.join(ROOT, 'src', 'data', 'catalog-images.json');

const VIEW_ORDER = ['front', 'side', 'back'];

/** Widths shipped per view: the large one for the viewer, the small one for phones. */
const SIZES = [
  { suffix: '', width: 1200 },
  { suffix: '@640', width: 640 },
];

/* --- env ----------------------------------------------------------------- */

function loadEnvLocal() {
  for (const name of ['.env.local', '.env']) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnvLocal();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error(
    '\nGEMINI_API_KEY is not set.\n\n' +
      '  1. cp .env.example .env.local\n' +
      '  2. put your Google AI Studio key in it as GEMINI_API_KEY=...\n' +
      '  3. npm run generate:catalog\n\n' +
      '.env.local is git-ignored, so the key stays on this machine.\n',
  );
  process.exit(1);
}

/* --- cli ----------------------------------------------------------------- */

const argv = process.argv.slice(2);
const flag = (name) => {
  const hit = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return undefined;
  if (hit.includes('=')) return hit.split('=').slice(1).join('=');
  const next = argv[argv.indexOf(hit) + 1];
  return next && !next.startsWith('--') ? next : true;
};

const FORCE = Boolean(flag('force'));
const ONLY = typeof flag('only') === 'string' ? String(flag('only')).split(',').map((s) => s.trim()) : null;
const VIEWS = typeof flag('views') === 'string' ? String(flag('views')).split(',').map((s) => s.trim()) : VIEW_ORDER;

/* --- model --------------------------------------------------------------- */

const DEFAULT_CHAIN = ['gemini-3-pro-image', 'gemini-3.1-flash-image', 'gemini-2.5-flash-image'];

// A pinned model is preferred, not exclusive: if it is unavailable on this account's tier
// the script still falls through to one that works rather than failing outright.
const MODEL_CHAIN = process.env.GEMINI_IMAGE_MODEL
  ? [process.env.GEMINI_IMAGE_MODEL, ...DEFAULT_CHAIN.filter((m) => m !== process.env.GEMINI_IMAGE_MODEL)]
  : DEFAULT_CHAIN;

const ai = new GoogleGenAI({ apiKey: API_KEY });

let resolvedModel = null;

/** Pulls image bytes out of whichever response shape the installed SDK returns. */
function extractImage(response) {
  if (response?.output_image?.data) {
    return Buffer.from(response.output_image.data, 'base64');
  }
  const outputs = response?.output ?? response?.outputs ?? [];
  for (const item of Array.isArray(outputs) ? outputs : [outputs]) {
    if (item?.type === 'image' && item?.data) return Buffer.from(item.data, 'base64');
    if (item?.image?.data) return Buffer.from(item.image.data, 'base64');
  }
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = part.inlineData ?? part.inline_data;
    if (inline?.data) return Buffer.from(inline.data, 'base64');
  }
  return null;
}

function refusalText(response) {
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text).filter(Boolean).join(' ').trim();
  return text || response?.output_text || '';
}

/**
 * One generation call. Tries the current `interactions` API first and falls back to
 * `models.generateContent`, so the script keeps working across SDK versions.
 */
async function generate({ model, prompt, images }) {
  const input = [{ type: 'text', text: prompt }];
  for (const img of images) {
    input.push({ type: 'image', mime_type: img.mimeType, data: img.data.toString('base64') });
  }

  try {
    const res = await ai.interactions.create({
      model,
      input,
      response_format: { type: 'image', aspect_ratio: '4:5', image_size: '2K' },
    });
    const bytes = extractImage(res);
    if (bytes) return bytes;
    const why = refusalText(res);
    throw new Error(`no image returned${why ? ` — ${why.slice(0, 220)}` : ''}`);
  } catch (err) {
    if (!/not.*(found|supported)|unknown|interactions|404|400/i.test(String(err?.message))) throw err;

    const parts = [{ text: prompt }];
    for (const img of images) {
      parts.push({ inlineData: { mimeType: img.mimeType, data: img.data.toString('base64') } });
    }
    const res = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '4:5' } },
    });
    const bytes = extractImage(res);
    if (bytes) return bytes;
    const why = refusalText(res);
    throw new Error(`no image returned${why ? ` — ${why.slice(0, 220)}` : ''}`);
  }
}

async function generateWithFallback(opts) {
  if (resolvedModel) return generate({ ...opts, model: resolvedModel });

  let lastError;
  for (const model of MODEL_CHAIN) {
    try {
      const bytes = await generate({ ...opts, model });
      resolvedModel = model;
      console.log(`   model: ${model}`);
      return bytes;
    } catch (err) {
      lastError = err;
      console.log(`   ${model} unavailable (${String(err?.message).slice(0, 110)})`);
    }
  }
  throw lastError;
}

const isQuotaError = (err) => /429|quota|rate limit/i.test(String(err?.message));

async function withRetry(label, fn, attempts = 3) {
  let lastError;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      // "limit: 0 per day" will not become true by waiting four seconds.
      if (/limit: 0/i.test(String(err?.message))) throw err;
      const wait = isQuotaError(err) ? 20000 * i : 4000 * i;
      console.log(`   ${label} attempt ${i} failed: ${String(err?.message).slice(0, 160)}`);
      if (i < attempts) await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastError;
}

/* --- output -------------------------------------------------------------- */

async function writeVariants(pngBuffer, slug, view) {
  const dir = path.join(OUT_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  const written = [];
  for (const { suffix, width } of SIZES) {
    const file = path.join(dir, `${view}${suffix}.webp`);
    const info = await sharp(pngBuffer)
      .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
      .webp({ quality: suffix ? 68 : 76, effort: 6 })
      .toFile(file);
    written.push({ file, width: info.width, height: info.height, size: info.size });
  }
  return written;
}

/* --- run ----------------------------------------------------------------- */

async function main() {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
    : { generatedAt: null, model: null, categories: {} };

  const targets = CATEGORIES.filter((c) => !ONLY || ONLY.includes(c.slug));
  if (!targets.length) {
    console.error(`No categories matched --only. Known: ${CATEGORIES.map((c) => c.slug).join(', ')}`);
    process.exit(1);
  }

  for (const category of targets) {
    console.log(`\n${category.slug}`);

    const productRef = category.reference
      ? {
          data: fs.readFileSync(path.join(REFERENCE_DIR, category.reference)),
          mimeType: 'image/png',
        }
      : null;

    let frontRaw = path.join(RAW_DIR, `${category.slug}-front.png`);
    let frontBuffer = fs.existsSync(frontRaw) ? fs.readFileSync(frontRaw) : null;

    for (const view of VIEW_ORDER) {
      if (!VIEWS.includes(view)) continue;

      const target = path.join(OUT_DIR, category.slug, `${view}.webp`);
      if (!FORCE && fs.existsSync(target)) {
        console.log(`   ${view}: exists, skipping`);
        if (view === 'front' && !frontBuffer && fs.existsSync(frontRaw)) {
          frontBuffer = fs.readFileSync(frontRaw);
        }
        continue;
      }

      // Front is built from the client's product reference; side and back are built from
      // the front frame so the same man in the same clothes simply turns around.
      const images = [];
      if (view === 'front') {
        if (productRef) images.push(productRef);
      } else {
        if (!frontBuffer) {
          console.log(`   ${view}: no front frame to match, skipping`);
          continue;
        }
        images.push({ data: frontBuffer, mimeType: 'image/png' });
        if (productRef) images.push(productRef);
      }

      const prompt = buildPrompt(category, view);
      process.stdout.write(`   ${view}: generating…\n`);

      const bytes = await withRetry(view, () => generateWithFallback({ prompt, images }));

      const rawPath = path.join(RAW_DIR, `${category.slug}-${view}.png`);
      fs.writeFileSync(rawPath, bytes);
      if (view === 'front') {
        frontBuffer = bytes;
        frontRaw = rawPath;
      }

      const written = await writeVariants(bytes, category.slug, view);
      console.log(
        `   ${view}: ${written
          .map((w) => `${path.basename(w.file)} ${w.width}×${w.height} ${Math.round(w.size / 1024)}KB`)
          .join('  ')}`,
      );
    }

    const views = {};
    for (const view of VIEW_ORDER) {
      const file = path.join(OUT_DIR, category.slug, `${view}.webp`);
      if (!fs.existsSync(file)) continue;
      const meta = await sharp(file).metadata();
      views[view] = {
        src: `/catalog/${category.slug}/${view}.webp`,
        srcSmall: fs.existsSync(path.join(OUT_DIR, category.slug, `${view}@640.webp`))
          ? `/catalog/${category.slug}/${view}@640.webp`
          : null,
        width: meta.width,
        height: meta.height,
      };
    }

    if (Object.keys(views).length) {
      manifest.categories[category.slug] = {
        views,
        source: category.reference
          ? `Generated from the client's product photograph (${category.reference})`
          : category.referenceNote ?? 'Category representation',
      };
    }
  }

  manifest.generatedAt = new Date().toISOString();
  manifest.model = resolvedModel ?? manifest.model;
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nmanifest → ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((err) => {
  console.error('\nGeneration failed:', err?.message ?? err);
  process.exit(1);
});
