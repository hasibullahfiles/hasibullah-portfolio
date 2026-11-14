// Builds the published site in a folder (default _site) from the source files in this repo.
//   node tools/build.mjs [outDir]
// It copies the site, then adds what clean addresses need:
//   /               the Gallery (a copy of gallery.html, which also stays at /gallery)
//   /work/<id>      one page per client, made from client.html with its own title and description
//   /work/<id>/<code>  one page per video (its Instagram code), with the video's cover as the share preview
//   /work/          a copy of the Work list, so the address works with or without the slash
//   /sitemap.xml    every public address, for search engines
// GitHub Pages serves /gallery from gallery.html, /about from about.html, /work from work.html, and so on.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://hasibullahshanto.com";
const root = path.resolve(import.meta.dirname, "..");
const out = path.resolve(root, process.argv[2] || "_site");
const SKIP = new Set([".git", ".github", ".gitignore", ".claude", "_site", "tools", ".DS_Store", "testimonials.md", "_voice_src"]);

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

// Captions (notes.js, with any NOTES in main.js winning) and video sizes (media.js), for the per-video pages.
const objectIn = (src, name) => { const m = src.match(new RegExp(`const ${name} = (\\{[\\s\\S]*?\\});`)); return m ? new Function(`return ${m[1]}`)() : {}; };
const CAPTIONS = objectIn(fs.readFileSync(path.join(root, "notes.js"), "utf8"), "CAPTIONS");
const NOTES = objectIn(js, "NOTES");
const MEDIA = objectIn(fs.readFileSync(path.join(root, "media.js"), "utf8"), "MEDIA");
const OG_DEFAULT = /<meta property="og:image" content="[^"]*">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="[^"]*">/;
const meta = (re, html, value) => html.replace(re, value);

const tpl = read("client.html");
const urls = ["/", "/about", "/work", "/contact", "/links"];
let videoPages = 0;
for (const g of GROUPS) {
  const desc = g.group
    ? `Videos Md Hasibullah edited for ${g.name === "More creators" ? "creators including Ben Aizen, Roman, Marisa and Cole Gonzales" : g.name}.`
    : `Videos Md Hasibullah edited for ${g.name}.`;
  const page = (title, d, p) => tpl
    .replaceAll("__TITLE__", esc(title))
    .replaceAll("__DESC__", esc(d))
    .replaceAll("__PATH__", p)
    .replace('<h1 id="cname"></h1>', `<h1 id="cname">${esc(g.name)}</h1>`);
  // The client page answers at /work/<id> whichever way GitHub Pages resolves it (file or folder).
  const clientPage = page(g.name, desc, `/work/${g.id}`);
  write(`work/${g.id}.html`, clientPage);
  write(`work/${g.id}/index.html`, clientPage);
  urls.push(`/work/${g.id}`);

  // One page per video: /work/<id>/<Instagram code>. Opens the client page on that video,
  // and a shared link previews with the video's own cover and caption.
  for (const [code, , label] of g.videos) {
    const who = label || g.name;
    const caption = (NOTES[code] || CAPTIONS[code] || "").trim();
    const d = caption ? `${caption} Edited by Md Hasibullah.` : `A video Md Hasibullah edited for ${who}.`;
    const size = MEDIA[code];
    let html = page(who, d, `/work/${g.id}/${code}`);
    let tags = `<meta property="og:image" content="${SITE}/covers/${code}.jpg">\n<meta property="og:image:alt" content="${esc(`Cover of a video edited for ${who}`)}">`;
    if (size) tags += `\n<meta property="og:video" content="${SITE}/videos/${code}.mp4">\n<meta property="og:video:type" content="video/mp4">\n<meta property="og:video:width" content="${size[0]}">\n<meta property="og:video:height" content="${size[1]}">`;
    html = meta(OG_DEFAULT, html, tags);
    html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${SITE}/covers/${code}.jpg">`);
    html = html.replace('<meta property="og:type" content="website">', `<meta property="og:type" content="${size ? "video.other" : "website"}">`);
    write(`work/${g.id}/${code}.html`, html);
    urls.push(`/work/${g.id}/${code}`);
    videoPages++;
  }
}

const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
console.log(`Built ${out}: ${GROUPS.length} client pages, ${videoPages} video pages, ${urls.length} addresses in the sitemap.`);
