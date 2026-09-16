import { execFileSync, spawn } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Give the harness a dev server to shoot against.
 *
 * Reuses one that is already listening before starting its own. Several agents
 * and harness runs share this machine, and killing whatever holds a port to
 * claim it caused more failures than it solved - orphaned `next dev` children
 * outlive their npm parent, so the port stays bound after the parent is killed
 * and the next run then times out navigating to a server that is not there.
 */
/**
 * 3200 is the long-lived production server the harness prefers: `next build`
 * once, `next start` once, and every verification run reuses it. Dev mode was
 * recompiling on every file change while other work was in flight, which made
 * navigations time out for reasons that had nothing to do with the page.
 * Override with BRAMBLE_SITE_ORIGIN to point at your own.
 */
const CANDIDATE_PORTS = [3200, 3100, 3108];

async function responds(port) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`http://localhost:${port}/`, { signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

const SOURCE_DIRS = ["app", "components", "content", "lib", "styles"];

/**
 * Newest mtime across the source tree.
 *
 * `next start` serves whatever is in .next, so a server left running from an
 * earlier build will happily serve stale output - and a verification run against
 * stale output is worse than no verification, because it reports a pass. This is
 * not hypothetical: it silently reproduced a already-fixed 62-node drift.
 */
function newestSourceMtime() {
  let newest = 0;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else newest = Math.max(newest, statSync(path).mtimeMs);
    }
  };
  for (const dir of SOURCE_DIRS) {
    try {
      walk(dir);
    } catch {
      /* a directory that does not exist yet is not a staleness signal */
    }
  }
  return newest;
}

function buildIsStale() {
  try {
    return statSync(`${process.env.NEXT_DIST_DIR ?? ".next"}/BUILD_ID`).mtimeMs < newestSourceMtime();
  } catch {
    return true;
  }
}

export async function siteServer() {
  if (process.env.BRAMBLE_SITE_ORIGIN) {
    return { origin: process.env.BRAMBLE_SITE_ORIGIN, stop: () => {}, reused: true };
  }

  const stale = buildIsStale();
  if (stale) {
    console.log("build is older than the source tree - rebuilding before measuring");
    execFileSync("npx", ["next", "build"], { stdio: "inherit" });
  }

  for (const port of CANDIDATE_PORTS) {
    if (await responds(port)) {
      // A server that predates the build we just made is serving the old one.
      if (stale) {
        try {
          execFileSync("sh", ["-c", `lsof -ti:${port} | xargs kill -9`], { stdio: "ignore" });
        } catch {
          /* nothing listening is fine */
        }
        break;
      }
      return { origin: `http://localhost:${port}`, stop: () => {}, reused: true };
    }
  }

  const port = CANDIDATE_PORTS.at(-1) + 1;
  // detached so we can signal the whole process group; `next dev` spawns a child
  // that otherwise survives its parent and keeps the port bound.
  const child = spawn("npx", ["next", "start", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("next start did not come up in 120s")), 120_000);
    child.stdout.on("data", (b) => {
      if (b.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });

  // Warm the route so the first real navigation is not waiting on a dev compile.
  await fetch(`http://localhost:${port}/`).catch(() => {});

  return {
    origin: `http://localhost:${port}`,
    stop: () => {
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {
        child.kill();
      }
    },
    reused: false,
  };
}
