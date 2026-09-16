/**
 * One-shot source-asset optimisation.
 *
 * The Claude Design export ships every photograph as a 2-3 MB PNG, which is the
 * worst possible container for photographic content. next/image re-encodes to
 * AVIF/WebP at request time regardless, so the only thing those PNGs buy us is
 * 23 MB of git history.
 *
 * This script rewrites public/images in place from the pristine originals held
 * in the design export. It is idempotent: it always reads from the export, never
 * from its own output, so re-running it cannot compound generation loss.
 *
 *   node scripts/optimize-assets.mjs <path-to-extracted-design-folder>
 */
import { mkdir, readdir, stat, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/optimize-assets.mjs <extracted-design-folder>");
  process.exit(1);
}

const OUT = "public/images";

/**
 * `maxWidth` is set from the largest width the asset is ever *rendered* at,
 * doubled for 2x displays - not from the width it happens to arrive at.
 */
const PLAN = [
  // Photographs. Used as section banners and card tiles up to the 1280px band.
  { in: "assets/photo-1.png", out: "photo-1.webp", maxWidth: 1536, quality: 82 },
  { in: "assets/photo-2.png", out: "photo-2.webp", maxWidth: 1536, quality: 82 },
  { in: "assets/photo-3.png", out: "photo-3.webp", maxWidth: 1536, quality: 82 },
  { in: "assets/photo-4.png", out: "photo-4.webp", maxWidth: 1536, quality: 82 },

  // Heroes. Full-bleed, so they keep their native width and a higher quality.
  { in: "assets/hero-lifestyle.png", out: "hero-lifestyle.webp", maxWidth: 1920, quality: 86 },
  { in: "assets/hero-mobile-shower.png", out: "hero-mobile-shower.webp", maxWidth: 1374, quality: 86 },

  // A technical site plan: fine linework, so it gets the highest quality here.
  { in: "assets/takeoff-plan.png", out: "takeoff-plan.webp", maxWidth: 1467, quality: 92 },

  // Mascots. Illustration with alpha, never rendered above 262px CSS.
  { in: "assets/brambie-leaning.png", out: "brambie-leaning.webp", maxWidth: 640, quality: 88 },
  { in: "assets/brambie-peering.png", out: "brambie-peering.webp", maxWidth: 640, quality: 88 },
  { in: "assets/brambie-pointing.png", out: "brambie-pointing.webp", maxWidth: 640, quality: 88 },

  // Partner mark, rendered at 34px.
  { in: "assets/xero-mark.png", out: "xero-mark.webp", maxWidth: 160, quality: 90 },

  // Already a well-compressed 71 KB JPEG; re-encoding would only degrade it.
  { in: "_ds/canvas-botanical.jpg", out: "canvas-botanical.jpg", copy: true },
];

async function resolveBotanical() {
  const dsRoot = join(source, "_ds");
  for (const entry of await readdir(dsRoot)) {
    const candidate = join(dsRoot, entry, "assets/empty/canvas-botanical.jpg");
    try {
      await stat(candidate);
      return candidate;
    } catch {}
  }
  throw new Error("canvas-botanical.jpg not found in the design export");
}

await mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;
const rows = [];

for (const item of PLAN) {
  const from = item.in.startsWith("_ds/") ? await resolveBotanical() : join(source, item.in);
  const to = join(OUT, item.out);
  const sourceBytes = (await stat(from)).size;

  if (item.copy) {
    await writeFile(to, await sharp(from).toBuffer());
  } else {
    const image = sharp(from);
    const { width } = await image.metadata();
    await image
      .resize({ width: Math.min(width, item.maxWidth), withoutEnlargement: true })
      .webp({ quality: item.quality, effort: 6 })
      .toFile(to);
  }

  const outBytes = (await stat(to)).size;
  before += sourceBytes;
  after += outBytes;
  rows.push([item.out, sourceBytes, outBytes]);
}

// Drop the PNG originals now that their WebP replacements exist.
for (const name of await readdir(OUT)) {
  if (name.endsWith(".png")) await rm(join(OUT, name));
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
for (const [name, b, a] of rows) {
  console.log(`${name.padEnd(28)} ${kb(b).padStart(9)} -> ${kb(a).padStart(8)}  (-${(100 - (a / b) * 100).toFixed(1)}%)`);
}
console.log(`${"TOTAL".padEnd(28)} ${kb(before).padStart(9)} -> ${kb(after).padStart(8)}  (-${(100 - (after / before) * 100).toFixed(1)}%)`);
