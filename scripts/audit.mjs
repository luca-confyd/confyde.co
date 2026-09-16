#!/usr/bin/env node
/**
 * Accessibility and console audit.
 *
 *   node scripts/audit.mjs [--widths 1440,390]
 *
 * Runs axe against the built page at each width, in both motion preferences,
 * and reports every console message the page produced along the way. The QA
 * gate for a section is: zero axe violations, zero console errors or warnings.
 */
import { spawn } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const PORT = 3101;
const args = process.argv.slice(2);
const widths = (args[args.indexOf("--widths") + 1] ?? "1440,1024,390")
  .split(",")
  .map(Number);

const site = spawn("npx", ["next", "dev", "--port", String(PORT)], {
  stdio: ["ignore", "pipe", "pipe"],
});
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("next dev did not start")), 60_000);
  site.stdout.on("data", (b) => {
    if (b.toString().includes("Ready")) {
      clearTimeout(timer);
      resolve();
    }
  });
});

let failures = 0;

try {
  const browser = await chromium.launch();

  for (const width of widths) {
    for (const motion of ["no-preference", "reduce"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: motion === "reduce" ? "reduce" : "no-preference",
      });
      const page = await context.newPage();

      const noise = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") noise.push(`${m.type()}: ${m.text()}`);
      });
      page.on("pageerror", (e) => noise.push(`pageerror: ${e.message}`));

      await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      // Walk the page so lazy content and scroll-triggered sections mount.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });

      // Let the entrance animations finish before measuring.
      //
      // axe computes contrast by compositing an element's colour through every
      // ancestor's opacity, so a reveal caught at opacity 0.96 reports a lighter
      // foreground than the page ever presents - enough to take a colour that
      // measures 4.63:1 at rest down to 4.22:1 and fail it. WCAG 1.4.3 is about
      // the text a reader reads, not a frame 400ms into a 500ms entrance, so
      // the audit waits for the settled page rather than racing it.
      //
      // Infinite animations - the marquee tracks, the hero's float-card cycle -
      // never finish, so they are excluded; the reduced-motion pass is what
      // pins those to a known frame.
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter(
              (a) =>
                a.playState === "running" &&
                a.effect?.getComputedTiming().iterations !== Infinity,
            )
            .map((a) => a.finished.catch(() => {})),
        ),
      );

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const label = `${width}px / ${motion}`;
      if (violations.length === 0 && noise.length === 0) {
        console.log(`PASS  ${label}`);
      } else {
        failures += violations.length + noise.length;
        console.log(`FAIL  ${label}`);
        for (const v of violations) {
          console.log(`  axe [${v.impact}] ${v.id}: ${v.help}`);
          for (const node of v.nodes.slice(0, 4)) {
            console.log(`       ${node.target.join(" ")}`);
          }
        }
        for (const message of new Set(noise)) console.log(`  console ${message}`);
      }

      await context.close();
    }
  }

  await browser.close();
} finally {
  site.kill();
}

process.exit(failures ? 1 : 0);
