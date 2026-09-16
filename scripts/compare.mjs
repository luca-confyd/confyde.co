#!/usr/bin/env node
/**
 * Visual comparison harness.
 *
 *   node scripts/compare.mjs <section> [--motion none] [--freeze 4000,8000]
 *
 * For each width it screenshots the original artboard and our port, writes them
 * as one side-by-side composite, and reports the pixel delta. The composite is
 * the point: review happens by looking at the pair, not by reading a number.
 *
 * Output lands in review/<section>/ and is gitignored.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import sharp from "sharp";
import { serveStatic } from "./lib/serve.mjs";
import { shoot } from "./lib/shoot.mjs";
import { ARTBOARDS, ARTBOARD_READY, DESKTOP_WIDTHS, MOBILE_WIDTHS, SECTIONS } from "./sections.mjs";

const DESIGN_ROOT =
  process.env.BRAMBLE_DESIGN_ROOT ??
  "/private/tmp/claude-501/-Applications-sites-confyd/79c7e3e0-24d6-4968-941b-c266f02210a5/scratchpad/design";
const SITE_PORT = 3100;
const DESIGN_PORT = 4321;

const args = process.argv.slice(2);
const sectionId = args.find((a) => !a.startsWith("--")) ?? "page";
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

const section = SECTIONS[sectionId];
if (!section) {
  console.error(`unknown section "${sectionId}". known: ${Object.keys(SECTIONS).join(", ")}`);
  process.exit(1);
}

const motion = flag("motion") ?? "reduce";
const freezes = flag("freeze")?.split(",").map(Number) ?? [undefined];
const outDir = join("review", sectionId);

async function startSite() {
  const child = spawn("npx", ["next", "dev", "--port", String(SITE_PORT)], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("next dev did not start in 60s")), 60_000);
    child.stdout.on("data", (buffer) => {
      if (buffer.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
  return child;
}

/** Pad both images to a common canvas so pixelmatch can compare them at all. */
async function padTo(buffer, width, height) {
  return sharp({
    create: { width, height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([{ input: buffer, top: 0, left: 0 }])
    .png()
    .toBuffer();
}

async function composite(artboardPath, sitePath, outPath, width) {
  const [a, b] = await Promise.all([sharp(artboardPath).metadata(), sharp(sitePath).metadata()]);
  const height = Math.max(a.height, b.height);

  const [aPad, bPad] = await Promise.all([
    padTo(await sharp(artboardPath).png().toBuffer(), width, height),
    padTo(await sharp(sitePath).png().toBuffer(), width, height),
  ]);

  const aPng = PNG.sync.read(aPad);
  const bPng = PNG.sync.read(bPad);
  const diff = new PNG({ width, height });
  const changed = pixelmatch(aPng.data, bPng.data, diff.data, width, height, {
    threshold: 0.12,
    includeAA: false,
  });

  const label = async (text, w) =>
    sharp({
      create: { width: w, height: 34, channels: 4, background: "#15301f" },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${w}" height="34"><text x="12" y="23" font-family="monospace" font-size="15" fill="#c8e84a">${text}</text></svg>`,
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

  const gap = 16;
  const totalWidth = width * 3 + gap * 2;
  await sharp({
    create: {
      width: totalWidth,
      height: height + 34,
      channels: 4,
      background: { r: 222, g: 216, b: 198, alpha: 1 },
    },
  })
    .composite([
      { input: await label("ARTBOARD", width), top: 0, left: 0 },
      { input: await label("BUILD", width), top: 0, left: width + gap },
      { input: await label(`DIFF  ${changed} px`, width), top: 0, left: (width + gap) * 2 },
      { input: aPad, top: 34, left: 0 },
      { input: bPad, top: 34, left: width + gap },
      { input: PNG.sync.write(diff), top: 34, left: (width + gap) * 2 },
    ])
    .png()
    .toFile(outPath);

  return { changed, total: width * height };
}

const design = await serveStatic(DESIGN_ROOT, DESIGN_PORT);
const site = await startSite();
const consoleIssues = [];
const results = [];

try {
  await mkdir(outDir, { recursive: true });

  for (const width of [...DESKTOP_WIDTHS, ...MOBILE_WIDTHS]) {
    const isDesktop = width >= 1024;
    const artboardUrl = design.origin + (isDesktop ? ARTBOARDS.web : ARTBOARDS.mobile);
    const artboardSel = isDesktop ? section.web : section.mobile;

    for (const freezeAt of freezes) {
      const tag = freezeAt === undefined ? `${width}` : `${width}-t${freezeAt}`;
      const artboardPath = join(outDir, `${tag}.artboard.png`);
      const sitePath = join(outDir, `${tag}.build.png`);

      await shoot({
        url: artboardUrl,
        out: artboardPath,
        width,
        selector: artboardSel ?? undefined,
        fullPage: section.fullPage ?? false,
        waitFor: ARTBOARD_READY,
        motion,
        freezeAt,
      });

      await shoot({
        url: `http://localhost:${SITE_PORT}/`,
        out: sitePath,
        width,
        selector: section.site ?? undefined,
        fullPage: section.fullPage ?? false,
        motion,
        freezeAt,
        onConsole: (messages) => {
          for (const m of messages) {
            if (m.type === "error" || m.type === "pageerror" || m.type === "warning") {
              consoleIssues.push(`[${width}px] ${m.type}: ${m.text}`);
            }
          }
        },
      });

      const { changed, total } = await composite(
        artboardPath,
        sitePath,
        join(outDir, `${tag}.compare.png`),
        width,
      );
      results.push({ tag, changed, pct: ((changed / total) * 100).toFixed(2) });
      console.log(`${tag.padEnd(14)} ${String(changed).padStart(9)} px differ  (${((changed / total) * 100).toFixed(2)}%)`);
    }
  }

  if (consoleIssues.length) {
    console.log("\nConsole issues on the build:");
    for (const issue of new Set(consoleIssues)) console.log(`  ${issue}`);
  } else {
    console.log("\nConsole clean on the build.");
  }

  await writeFile(
    join(outDir, "result.json"),
    JSON.stringify({ section: sectionId, motion, results, consoleIssues: [...new Set(consoleIssues)] }, null, 2),
  );
  console.log(`\nComposites in ${outDir}/*.compare.png`);
} finally {
  site.kill();
  await design.close();
}
