// Builds the published site in a folder (default _site) from the source files in this repo.
//   node tools/build.mjs [outDir]
// It copies the site, then adds what clean addresses need:
//   /               the Gallery (a copy of gallery.html, which also stays at /gallery)
//   /work/<id>      one page per client, made from client.html with its own title and description
//   /work/          a copy of the Work list, so the address works with or without the slash
//   /sitemap.xml    every public address, for search engines
// GitHub Pages serves /gallery from gallery.html, /about from about.html, /work from work.html, and so on.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://hasibullahshanto.com";
const root = path.resolve(import.meta.dirname, "..");
const out = path.resolve(root, process.argv[2] || "_site");
const SKIP = new Set([".git", ".github", ".gitignore", ".claude", "_site", "tools", ".DS_Store"]);

fs.rmSync(out, { recursive: true, force: true });
for (const name of fs.readdirSync(root)) {
  if (SKIP.has(name)) continue;
  fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true, filter: (src) => path.basename(src) !== ".DS_Store" });
}

// Client list, read from main.js so there is one source of truth.
const js = fs.readFileSync(path.join(root, "main.js"), "utf8");
const GROUPS = new Function(`return ${js.match(/const GROUPS = (\[[\s\S]*?\n\]);/)[1]}`)();

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const read = (f) => fs.readFileSync(path.join(out, f), "utf8");
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true }); fs.writeFileSync(path.join(out, f), s); };

write("index.html", read("gallery.html"));
write("work/index.html", read("work.html"));

const tpl = read("client.html");
for (const g of GROUPS) {
  const title = `${g.name}. Md Hasibullah`;
  const desc = g.group
    ? `Videos Md Hasibullah edited for ${g.name === "More creators" ? "creators including Ben Aizen, Roman, Marisa and Cole Gonzales" : g.name}.`
    : `Videos Md Hasibullah edited for ${g.name}.`;
  const page = tpl
    .replaceAll("__TITLE__", esc(title))
    .replaceAll("__DESC__", esc(desc))
    .replaceAll("__PATH__", `/work/${g.id}`)
    .replace('<h1 id="cname"></h1>', `<h1 id="cname">${esc(g.name)}</h1>`);
  write(`work/${g.id}.html`, page);
}

const today = new Date().toISOString().slice(0, 10);
const urls = ["/", "/about", "/work", "/contact", "/links", ...GROUPS.map((g) => `/work/${g.id}`)];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
console.log(`Built ${out}: ${GROUPS.length} client pages, ${urls.length} addresses in the sitemap.`);
