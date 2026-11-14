// Local preview of the built site that resolves addresses the way GitHub Pages does:
// /work -> work.html, /work/ -> work/index.html, unknown -> 404.html.
//   node tools/build.mjs && node tools/serve.mjs [port]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(import.meta.dirname, "..", "_site");
const port = Number(process.argv[2] || 4173);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".woff2": "font/woff2",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8" };

const find = (p) => {
  const base = path.join(dir, decodeURIComponent(p));
  if (!base.startsWith(dir)) return null;
  for (const c of p.endsWith("/") ? [path.join(base, "index.html")] : [base, base + ".html"]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
};

http.createServer((req, res) => {
  const p = new URL(req.url, "http://x").pathname;
  const file = find(p);
  const target = file || path.join(dir, "404.html");
  const stat = fs.statSync(target);
  const type = TYPES[path.extname(target)] || "application/octet-stream";
  const range = req.headers.range && /bytes=(\d+)-(\d*)/.exec(req.headers.range);
  if (range && file) {
    const start = Number(range[1]), end = range[2] ? Number(range[2]) : stat.size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
    fs.createReadStream(target, { start, end }).pipe(res);
    return;
  }
  res.writeHead(file ? 200 : 404, { "Content-Type": type, "Content-Length": stat.size, "Accept-Ranges": "bytes" });
  fs.createReadStream(target).pipe(res);
}).listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}`));
