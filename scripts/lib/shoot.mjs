import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { chromium } from "playwright";

/**
 * Screenshot helper shared by the comparison harness.
 *
 * Two things here exist specifically because the homepage runs ~29 looping
 * animation systems at once:
 *
 *   motion: "reduce"  - both the artboards and our port define a resting state
 *                       under prefers-reduced-motion. Diffing against that state
 *                       is the only way a structural comparison is deterministic.
 *
 *   freezeAt: <ms>    - for verifying the loops themselves. Every running
 *                       animation is paused and scrubbed to the same currentTime
 *                       on both sides, so a 15s take-off sequence can be compared
 *                       frame for frame rather than eyeballed.
 */
export async function shoot({
  url,
  out,
  width,
  height = 900,
  selector,
  fullPage = false,
  motion = "reduce",
  freezeAt,
  waitFor,
  settle = 400,
  onConsole,
}) {
  await mkdir(dirname(out), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: motion === "reduce" ? "reduce" : "no-preference",
  });
  const page = await context.newPage();

  const messages = [];
  page.on("console", (m) => messages.push({ type: m.type(), text: m.text() }));
  page.on("pageerror", (e) => messages.push({ type: "pageerror", text: e.message }));

  // See scripts/geometry.mjs - "networkidle" is unreliable under concurrent
  // load, and the explicit font and image waits below are the real conditions.
  await page.goto(url, { waitUntil: "load", timeout: 120_000 });
  await page.waitForTimeout(600);
  if (waitFor) {
    await page.waitForSelector(waitFor, { timeout: 30_000 });
    // See scripts/geometry.mjs: the desktop artboard leaves the browser's
    // default body margin in place, which offsets the entire page by 8px.
    await page.evaluate(() => { document.body.style.margin = "0"; });
  }
  await page.evaluate(() => document.fonts.ready);

  if (freezeAt !== undefined) {
    await page.evaluate((t) => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        try {
          animation.currentTime = t;
        } catch {
          /* finite-duration animations shorter than t reject the seek */
        }
      }
    }, freezeAt);
  }

  // Force every lazily-decoded image to resolve before we capture.
  //
  // Bounded on purpose. The page ships the desktop and mobile compositions as
  // siblings, so at any width roughly half the images sit inside a
  // `display: none` subtree where `decode()` can simply never settle - it
  // neither resolves nor rejects, and an unbounded wait here hangs the whole
  // run. Those images are also, by definition, not in the shot.
  await page.evaluate(async () => {
    const settle = (img) =>
      Promise.race([
        img.decode().catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    await Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(settle),
    );
  });
  await page.waitForTimeout(settle);

  const target = selector ? page.locator(selector).first() : page;
  await target.screenshot({ path: out, ...(selector ? {} : { fullPage }) });

  await browser.close();
  onConsole?.(messages);
  return messages;
}
