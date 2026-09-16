import { spawn } from "node:child_process";

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

export async function siteServer() {
  if (process.env.BRAMBLE_SITE_ORIGIN) {
    return { origin: process.env.BRAMBLE_SITE_ORIGIN, stop: () => {}, reused: true };
  }

  for (const port of CANDIDATE_PORTS) {
    if (await responds(port)) {
      return { origin: `http://localhost:${port}`, stop: () => {}, reused: true };
    }
  }

  const port = CANDIDATE_PORTS.at(-1) + 1;
  // detached so we can signal the whole process group; `next dev` spawns a child
  // that otherwise survives its parent and keeps the port bound.
  const child = spawn("npx", ["next", "dev", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("next dev did not start in 120s")), 120_000);
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
