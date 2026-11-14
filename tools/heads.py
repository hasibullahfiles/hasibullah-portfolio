# One-off: gives every page the same head (canonical, share tags, security policy, icons) and clean links.
import re, html
SITE = "https://hasibullahshanto.com"
DESC = "Video editor and motion designer for Roberto P. Nickson, Tommy Geoco, Daniel Do, Artzen Media and more."
CSP = ("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
       "media-src 'self'; font-src 'self'; connect-src 'self' https://formsubmit.co; form-action 'self' https://formsubmit.co; "
       "frame-src 'none'; object-src 'none'; base-uri 'self'")
PAGES = {
  "index.html":   ("Md Hasibullah, video editor and motion designer", DESC, "/"),
  "gallery.html": ("Gallery. Md Hasibullah", DESC, "/gallery"),
  "work.html":    ("Work. Md Hasibullah", "Clients and brands Md Hasibullah edits for: Roberto P. Nickson, Tommy Geoco, Daniel Do, Higgsfield, Invideo AI and more.", "/work"),
  "contact.html": ("Contact. Md Hasibullah", "Send Md Hasibullah a project brief, or book a call.", "/contact"),
  "client.html":  ("__TITLE__", "__DESC__", "__PATH__"),
  "404.html":     ("That frame got cut. Md Hasibullah", DESC, None),
}
TRANS = """<script>
  // Blur transition only when the Gallery is one end of the navigation. Everything else is instant.
  const isGallery = (u) => { const p = new URL(u, location.href).pathname; return p === "/gallery" || p.endsWith("/gallery.html"); };
  // Decide on the way out as well, so a non-Gallery hop never waits on a transition.
  addEventListener("pageswap", (e) => {
    if (!e.viewTransition) return;
    for (const p of [e.viewTransition.ready, e.viewTransition.finished, e.viewTransition.updateCallbackDone]) if (p) p.catch(() => {});
    const to = e.activation && e.activation.entry && e.activation.entry.url;
    if (!(isGallery(location.href) || (to && isGallery(to)))) e.viewTransition.skipTransition();
  });
  addEventListener("pagereveal", (e) => {
    if (!e.viewTransition) return;
    const from = window.navigation && navigation.activation && navigation.activation.from;
    const involves = isGallery(location.href) || (from && isGallery(from.url));
    // Swallow the browser's "transition skipped" notices so they never show as errors.
    e.viewTransition.ready.catch(() => {}); e.viewTransition.finished.catch(() => {});
    if (!involves) e.viewTransition.skipTransition();
  });
</script>
<script type="speculationrules">{"prerender":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}],"prefetch":[{"where":{"href_matches":"/*"},"eagerness":"eager"}]}</script>"""
THEME_BTN = ('<button class="theme" id="theme" type="button" role="switch" aria-checked="false" aria-label="Dark mode">'
  '<span class="theme__knob" aria-hidden="true"></span>'
  '<svg class="theme__i theme__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>'
  '<svg class="theme__i theme__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6z"/></svg>'
  '</button>')

def head(title, desc, path):
    t, d = html.escape(title, quote=True), html.escape(desc, quote=True)
    out = [f"<title>{t}</title>", f'<meta name="description" content="{d}">']
    if path is not None:
        url = SITE + path
        out += [f'<link rel="canonical" href="{url}">',
          '<meta name="robots" content="index, follow, max-image-preview:large">',
          '<meta name="author" content="Md Hasibullah">',
          '<meta property="og:site_name" content="Md Hasibullah">', '<meta property="og:type" content="website">',
          '<meta property="og:locale" content="en_US">',
          f'<meta property="og:title" content="{t}">', f'<meta property="og:description" content="{d}">', f'<meta property="og:url" content="{url}">',
          f'<meta property="og:image" content="{SITE}/og.jpg">', '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
          '<meta property="og:image:alt" content="Md Hasibullah, video editor. Profile pictures of the creators and brands he edits for, over his gallery of videos.">',
          '<meta name="twitter:card" content="summary_large_image">', f'<meta name="twitter:title" content="{t}">',
          f'<meta name="twitter:description" content="{d}">', f'<meta name="twitter:image" content="{SITE}/og.jpg">']
    else:
        out.append('<meta name="robots" content="noindex">')
    out += [f'<meta http-equiv="Content-Security-Policy" content="{CSP}">',
      '<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">',
      '<meta name="theme-color" content="#0b0b0b" media="(prefers-color-scheme: dark)">',
      '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
      '<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">',
      '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
      '<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>',
      '<link rel="stylesheet" href="/styles.css">']
    return "\n".join(out)

for f, (title, desc, path) in PAGES.items():
    s = open(f).read()
    a = s.index("<title>"); b = s.index("</head>")
    extra = "" if f == "404.html" else TRANS + "\n"
    jsonld = '<!--JSONLD-->\n' if f == "index.html" else ""
    s = s[:a] + head(title, desc, path) + "\n" + jsonld + extra + s[b:]
    # Clean links
    s = re.sub(r'class="nav__name" href="index.html" aria-current="page">Gallery', 'class="nav__name" href="/gallery" aria-current="page">Gallery', s)
    s = s.replace('class="nav__name" href="index.html">', 'class="nav__name" href="/">')
    s = s.replace('href="index.html"', 'href="/gallery"').replace('href="work.html"', 'href="/work"')
    s = s.replace('href="about.html"', 'href="/about"').replace('href="contact.html"', 'href="/contact"')
    s = re.sub(r'src="(media|notes|main)\.js"', r'src="/\1.js"', s)
    s = s.replace('src="icons/', 'src="/icons/')
    s = re.sub(r'<button class="theme" id="theme"[^>]*></button>', THEME_BTN, s)
    open(f, "w").write(s)
print("ok")
