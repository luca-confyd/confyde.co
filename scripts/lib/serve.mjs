import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

/**
 * Minimal static server for the extracted design export, so the original
 * artboards can be rendered with their own relative asset and support.js paths
 * intact. Dev-time only - nothing here ships.
 */
export async function serveStatic(root, port = 4321) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ""));
    try {
      const info = await stat(file);
      if (info.isDirectory()) throw new Error("directory");
      res.writeHead(200, {
        "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
        "content-length": info.size,
      });
      createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404).end("not found");
    }
  });

  await new Promise((resolve) => server.listen(port, resolve));
  return {
    origin: `http://localhost:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
