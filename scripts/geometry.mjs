#!/usr/bin/env node
/**
 * Geometry comparison.
 *
 * A pixel diff over a hero is mostly noise: the photograph dominates the frame
 * and it is re-encoded twice on our side (source WebP, then next/image), so tens
 * of thousands of pixels differ by a value or two and tell you nothing. What
 * actually matters in a port is whether the type and the boxes land in the same
 * places.
 *
 * So this walks both trees, matches elements by their visible text, and reports
 * the ones whose position, size or type has drifted. Text is the join key
 * because it survives a completely different class and DOM structure, which is
 * exactly the situation here.
 *
 *   node scripts/geometry.mjs <width> [--tolerance 2]
 */
import { chromium } from "playwright";
import { serveStatic } from "./lib/serve.mjs";
import { siteServer } from "./lib/site-server.mjs";
import { ARTBOARDS, ARTBOARD_READY, SECTIONS } from "./sections.mjs";

const DESIGN_ROOT =
  process.env.BRAMBLE_DESIGN_ROOT ??
  "/private/tmp/claude-501/-Applications-sites-confyd/79c7e3e0-24d6-4968-941b-c266f02210a5/scratchpad/design";

const args = process.argv.slice(2);
const width = Number(args.find((a) => !a.startsWith("--")) ?? 1280);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const tolerance = Number(flag("tolerance", 2));
// Scope to one section, or the comparison drowns in the sections not built yet.
const scope = flag("scope", null);
/**
 * Freeze every running animation at this time (ms) before measuring.
 *
 * Needed wherever the artboard animates but has no reduced-motion rule of its
 * own - the marquee and the before/after phones both do. Without it the
 * artboard is mid-slide when measured and every element reports a drift that is
 * really just the phase of its animation.
 */
const freezeAt = flag("freeze", null);
/**
 * Scroll the scoped section to this progress (0..1) before measuring.
 *
 * The pinned CTA stage is a pure function of scroll position, so comparing it at
 * the top of the page compares two different frames of the same animation and
 * every chip reports a drift. This scrolls both documents until the section has
 * travelled the same fraction of its own scrollable height.
 */
const progress = flag("progress", null);
/**
 * "reduce" (default) or "none". Reduced motion makes most comparisons
 * deterministic, but where our build honours it and the artboard does not - the
 * CTA stage's post-settle drift, the marquee - the two legitimately differ, and
 * comparing them needs motion enabled on both sides.
 */
const motion = flag("motion", "reduce");
/**
 * Which motion preference to measure under. `reduce` is right wherever both
 * sides settle to the same resting state, which is every section but this one:
 * the before/after artboard's own reduced-motion block is broken, so its resting
 * frame is a smear our port deliberately does not reproduce (RULINGS.md §05
 * ruling 3). `--motion none` measures the live loop instead, which is only
 * meaningful together with a matched `--freeze`.
 */
const isDesktop = width >= 1024;

const collect = (root) => `((root) => {
  const scope = root ? document.querySelector(root) : document.body;
  if (!scope) throw new Error("scope not found: " + root);
  // Measure relative to the section's own origin, not the page's. The desktop
  // artboard never resets the browser's default 8px body margin (the mobile one
  // does), so page-absolute coordinates would report that artefact as an 8px
  // drift on every single element.
  const origin = scope.getBoundingClientRect();
  const out = [];
  const seen = new Map();
  for (const el of scope.querySelectorAll("*")) {
    if (el.children.length > 0) continue;              // leaves only
    const text = (el.textContent || "")
      .trim()
      .replace(/\\s+/g, " ")
      // Straight and curly quotes are the same string for matching purposes -
      // we normalise to curly on purpose, so the artboard's straight ones would
      // otherwise all report as absent.
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
    if (!text || text.length > 200) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    // Disambiguate repeated strings by occurrence.
    const n = (seen.get(text) ?? 0) + 1;
    seen.set(text, n);
    out.push({
      key: n > 1 ? text + " #" + n : text,
      x: Math.round(r.x - origin.x), y: Math.round(r.y - origin.y),
      w: Math.round(r.width), h: Math.round(r.height),
      size: Math.round(parseFloat(cs.fontSize) * 10) / 10,
      // A variable font's rendered weight comes from font-variation-settings
      // when it is set, and that overrides font-weight. Comparing font-weight
      // alone reports a difference where the two render identically.
      weight: (cs.fontVariationSettings || "").includes("wght")
        ? cs.fontVariationSettings
        : cs.fontWeight,
      family: cs.fontFamily.split(",")[0].replace(/"/g, ""),
    });
  }
  return out;
})(${JSON.stringify(root)})`;

const design = await serveStatic(DESIGN_ROOT, 4340);
const site = await siteServer();
const browser = await chromium.launch();

async function measure(url, wait, rootSelector) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: motion === "none" ? "no-preference" : "reduce",
  });
  const page = await ctx.newPage();
  // "load" rather than "networkidle": with several dev servers and agents
  // running concurrently the network rarely goes quiet inside the timeout, and
  // the explicit font/image waits below are the conditions we actually need.
  await page.goto(url, { waitUntil: "load", timeout: 120_000 });
  await page.waitForTimeout(600);
  if (wait) {
    await page.waitForSelector(wait);
    // The desktop artboard never resets the browser's default 8px body margin -
    // the mobile one does, which is how we know it is an oversight rather than
    // a decision. Left in place it shrinks the whole page by 16px and reports
    // as a drift on every element. Normalised so the comparison is like for like.
    await page.evaluate(() => { document.body.style.margin = "0"; });
    await page.waitForTimeout(150);
  }
  if (progress !== null && rootSelector) {
    await page.evaluate(
      ([sel, frac]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const travel = Math.max(0, el.offsetHeight - window.innerHeight);
        window.scrollTo(0, top + travel * Number(frac));
      },
      [rootSelector, progress],
    );
    // Two frames for a rAF-coalesced scrub to settle.
    await page.waitForTimeout(400);
  }
  if (freezeAt !== null) {
    await page.evaluate((t) => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        try {
          animation.currentTime = t;
        } catch {
          /* a finite animation shorter than t rejects the seek */
        }
      }
    }, Number(freezeAt));
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const data = await page.evaluate(collect(rootSelector));
  await ctx.close();
  return new Map(data.map((d) => [d.key, d]));
}

let artboard, build;
try {
const section = scope ? SECTIONS[scope] : null;
if (scope && !section) throw new Error(`unknown section: ${scope}`);
artboard = await measure(
  design.origin + (isDesktop ? ARTBOARDS.web : ARTBOARDS.mobile),
  ARTBOARD_READY,
  section ? (isDesktop ? section.web : section.mobile) : null,
);
build = await measure(
  `${site.origin}/`,
  null,
  section ? (isDesktop ? (section.siteWeb ?? section.site) : (section.siteMobile ?? section.site)) : null,
);
} finally {
  // Always tear these down, or the next run fails to bind the port.
  await browser.close().catch(() => {});
  await design.close().catch(() => {});
  site.stop();
}

const drifted = [];
const missing = [];

for (const [key, a] of artboard) {
  const b = build.get(key);
  if (!b) { missing.push(key); continue; }
  const deltas = [];
  const centre = (v) => v.x + v.w / 2;
  const centred = Math.abs(centre(a) - centre(b)) <= tolerance;
  // A centred box that gains symmetric padding moves its edges but not its ink.
  if (Math.abs(a.x - b.x) > tolerance && !centred) deltas.push(`x ${a.x}->${b.x}`);
  if (Math.abs(a.y - b.y) > tolerance) deltas.push(`y ${a.y}->${b.y}`);
  if (Math.abs(a.w - b.w) > tolerance && !centred) deltas.push(`w ${a.w}->${b.w}`);
  if (Math.abs(a.size - b.size) > 0.6) deltas.push(`size ${a.size}->${b.size}`);
  if (a.weight !== b.weight) deltas.push(`weight ${a.weight}->${b.weight}`);
  if (a.family !== b.family) deltas.push(`font ${a.family}->${b.family}`);
  if (deltas.length) drifted.push({ key, deltas });
}

console.log(`\n${width}px — ${artboard.size} artboard text nodes, ${build.size} in the build\n`);
if (drifted.length === 0 && missing.length === 0) {
  console.log("No drift beyond tolerance.");
} else {
  for (const d of drifted) console.log(`DRIFT  ${d.key.slice(0, 52).padEnd(54)} ${d.deltas.join("  ")}`);
  for (const m of missing.slice(0, 25)) console.log(`ABSENT ${m.slice(0, 60)}`);
  if (missing.length > 25) console.log(`       ... and ${missing.length - 25} more absent`);
}
console.log(`\n${drifted.length} drifted, ${missing.length} absent (tolerance ${tolerance}px)`);
