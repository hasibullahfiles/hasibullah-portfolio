// View counts and follower counts were read from Instagram on 14 Nov 2026.
// A video is [shortcode, views, optional label, optional link].
//   shortcode: the part after /reel/ in the Instagram link. Its cover is covers/<shortcode>.jpg
//   and, when it has been downloaded, its file is videos/<shortcode>.mp4 (listed in media.js).
//   views: a plain number, or null when the video is not public.
// avatars are file names in avatars/ (the client's Instagram handle).
const GROUPS = [
  { id: "rpn", cat: "Creators", name: "Roberto P. Nickson", handle: "rpn", reach: { instagram: 967000, tiktok: 494800, x: 63800, youtube: 42600 }, avatars: ["rpn"],
    videos: [["DVg-_5giapC", 65600000], ["DW4X4aAiRFF", 543000], ["DWsICUqCcpT", 260000], ["DVeGTOBkWaC", 107000, "RPN Tech"], ["DZdEP5eJXfQ", 106000]] },
  { id: "tommy", cat: "Creators", name: "Tommy Geoco", handle: "itsdesignertom", reach: { instagram: 280000, tiktok: 487200, youtube: 170000, x: 20000 }, avatars: ["itsdesignertom"],
    videos: [["DfC3_uyAuWY", 159000], ["Dc_mgAvu1sw", 31000], ["DcyrXDSJNMK", 30800], ["Dd_95hIJXv1", 11800], ["Dc4iVrPhb7p", 8747], ["DdGk0maRsas", 8059], ["Dcgy5iihDyn", 7737]] },
  { id: "daniel-do", cat: "Creators", name: "Daniel Do", handle: "justdodani", reach: { instagram: 287000, tiktok: 213200 }, avatars: ["justdodani"],
    videos: [["DOb2Co7jLV3", 173000], ["DZdEccwMUZw", 146000], ["DOjJJ_jjMEQ", 46700], ["DZI0BsiswX9", 15600], ["DYutfBTsURH", 14700], ["DN8Rv9wDDeI", 13800]] },
  { id: "creators", group: true, cat: "Creators", name: "More creators", reach: { instagram: 538862 }, avatars: ["artzenmedia", "marisa", "shootsroman", "hasnatcreates", "ossa.ai", "saturate.be"],
    videos: [["DeBvhCLy_g9", 556000, "Ben Aizen"], ["De-2bbIv9ys", 90900, "Roman"], ["o8S4qdbACLA", null, "Marisa", "https://www.youtube.com/shorts/o8S4qdbACLA"], ["DVqc2B1AfKr", 2432, "Md Arif Hasnat"], ["DFYYiZxNKpO", 831000, "Cole Gonzales"], ["DWWwD1MjXKq", 5926, "Saturate"]] },
  { id: "think-studio", group: true, cat: "Agency", name: "Think Studio", handle: "thinkstudioau", avatars: ["thinkstudioau", "sonnybillwilliams", "unitedmuslimsofaustralia", "islamophobiaregisteraus"],
    videos: [["DMfF8FMxQnp", 1000000, "Sonny Bill Williams"], ["DPOIQcVkq83", 60800, "United Muslims of Australia"], ["DK_n7QsyRq0", 52300, "Think Studio"], ["Db7uiUoxQGb", 32400, "Islamophobia Register"], ["DGxkAHKSLau", 32100, "United Muslims of Australia"], ["DV3Mxsmjzr_", 23900, "Islamophobia Register"], ["DPQz6LVDSNM", 4608, "United Muslims of Australia"]] },
  { id: "higgsfield", cat: "Brand partnerships", name: "Higgsfield", handle: "higgsfield.ai", reach: { instagram: 2000000, youtube: 529000, x: 255700 }, avatars: ["higgsfield.ai"],
    videos: [["Da8CmrlyVYc", 83800], ["DbLn3AFymYy", 78400], ["Dd6h-e1BIfA", 58200]] },
  { id: "invideo", cat: "Brand partnerships", name: "Invideo AI", handle: "invideo.io", reach: { instagram: 579000, x: 37800 }, avatars: ["invideo.io"],
    videos: [["DdwH1lLyoTe", 11400], ["Dd6Ty8OyXvJ", 7012]] },
  { id: "feedback-loop", cat: "Podcasts", name: "The Feedback Loop", handle: "feedbackloop0", reach: { instagram: 35400 }, avatars: ["feedbackloop0"],
    videos: [["C9M5-oRxNgr", 8010], ["C87OV0Kxk8V", 5001], ["C-ZHDNoNMKL", 3705], ["C8IsmOYNTSv", 3424]] },
  { id: "second-pour", cat: "Podcasts", name: "The Second Pour", handle: "philsitter", avatars: ["philsitter"],
    videos: [["DfLAvGUOZ6N", 2329, "Podcast intro"]], soon: "Clips coming soon." },
  { id: "launch", cat: "Launch videos", name: "Launch videos", handle: "warmblu.studio", reach: { instagram: 10300 }, pageViews: 1182700, avatars: ["warmblu.studio"],
    videos: [["DXbzIv-Sq0B", 287000], ["Dd3sQYth69J", 182000], ["DaAnRdClRgY", 112000], ["DXO4886yffD", 111000], ["DZH2QHyyU8l", 110000], ["DXWoUEQyTQs", 66600], ["DXjZrdqEkbY", 53000], ["Dc6BJJrhmnm", 40700]] },
];

// A client's other public profiles, shown as icons on their page. Instagram is added from `handle`.
// Only add a profile once you have opened it and confirmed it is theirs.
const SOCIALS = {
  "rpn": { youtube: "https://www.youtube.com/@rpn", tiktok: "https://www.tiktok.com/@rpn", x: "https://x.com/rpnickson" },
  "tommy": { youtube: "https://www.youtube.com/@designertom", tiktok: "https://www.tiktok.com/@designertom", x: "https://x.com/designertom" },
  "daniel-do": { tiktok: "https://www.tiktok.com/@justdodani" },
  "higgsfield": { youtube: "https://www.youtube.com/@higgsfieldai", x: "https://x.com/higgsfield_ai" },
  "invideo": { x: "https://x.com/invideoOfficial" },
};
// Views the same video has on other platforms: shortcode -> { platform: views }.
// These are added to the Instagram count, and each platform gets its logo next to the video.
const ELSEWHERE = {
  // Roberto P. Nickson (read 14 Nov 2026)
  "DVg-_5giapC": { tiktok: 9300000 },
  "DW4X4aAiRFF": { tiktok: 886000, youtube: 1352720 },
  "DWsICUqCcpT": { tiktok: 49700 },
  "DZdEP5eJXfQ": { tiktok: 26800 },
  // Tommy Geoco
  "DfC3_uyAuWY": { tiktok: 31700, youtube: 12541, x: 1791 },
  "Dc4iVrPhb7p": { tiktok: 1598, youtube: 4248, x: 1820 },
  "Dd_95hIJXv1": { tiktok: 1425, youtube: 4484, x: 1462 },
  "DdGk0maRsas": { tiktok: 1848, youtube: 4129 },
  "DcyrXDSJNMK": { tiktok: 1839, youtube: 10027, x: 1793 },
  "Dcgy5iihDyn": { tiktok: 8457, youtube: 2597 },
  "Dc_mgAvu1sw": { youtube: 4048, x: 21204 },
  // United Muslims of Australia
  "DPQz6LVDSNM": { tiktok: 2334, youtube: 98 },
  "DPOIQcVkq83": { tiktok: 69400 },
  "DGxkAHKSLau": { tiktok: 1472 },
};
// Optional text shown beside a video on list-style pages: shortcode -> description.
// Testimonials shown under a client's social icons. Voice notes come from voices.js (generated by
// tools/voices.py: the cut audio plus its waveform); messages are the client's own words, as sent.
const MESSAGES = {
  tommy: [
    { text: "Great work on the demo video. Super impressed. Love that quality and editing style.", date: "27 Aug 2026" },
    { text: "Dude the fish go behind the avatars!!! Freaking bravo on the end screen mograph!!", date: "8 Sep 2026" },
    { text: "Yah your work is great. You should feel proud man, and thank you for being a joy to work with", date: "8 Sep 2026" },
    { text: "Literally no notes each time so far haha", date: "10 Sep 2026" },
    { text: "You do such a good job editing for the viewer", date: "8 Oct 2026" },
    { text: "Fantastic dude you're so clutch man", date: "10 Oct 2026" },
  ],
};

const NOTES = {
};

// Shown at double size on the home canvas.
const BIG = new Set(["DVg-_5giapC", "DW4X4aAiRFF", "DWsICUqCcpT", "DVeGTOBkWaC", "DZdEP5eJXfQ",
  "o8S4qdbACLA", "DcyrXDSJNMK", "DfC3_uyAuWY", "Dc_mgAvu1sw", "DVqc2B1AfKr", "DfLAvGUOZ6N", "Da8CmrlyVYc", "DbLn3AFymYy", "Dd6h-e1BIfA"]);
// Vertical videos that should still be shown in a horizontal frame (the frame crops the middle).
const FORCE_WIDE = new Set([]);

const LOCAL = typeof MEDIA === "undefined" ? {} : MEDIA;
// Each video's own caption (first line), generated into notes.js. NOTES above wins when you write your own.
const CAPS = typeof CAPTIONS === "undefined" ? {} : CAPTIONS;
const noteOf = (code) => NOTES[code] || CAPS[code] || "";
const reachOf = (g) => Object.values(g.reach || {}).reduce((a, b) => a + b, 0);
const fmt = (n) =>
  n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  : n >= 1e4 ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
  : n.toLocaleString("en-US");
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const total = (code, views) => (views || 0) + Object.values(ELSEWHERE[code] || {}).reduce((a, b) => a + b, 0);
const items = (groups) => groups.flatMap((g) => g.videos.map(([code, views, label, url]) => ({
  code, views: total(code, views) || null, label, group: g,
  platforms: [url && url.includes("youtube") ? "youtube" : "instagram", ...Object.keys(ELSEWHERE[code] || {})].filter((p, i, a) => a.indexOf(p) === i),
  who: label || g.name,
  url: url || `https://www.instagram.com/reel/${code}/`,
  local: !!LOCAL[code],
  wide: FORCE_WIDE.has(code) || (LOCAL[code] ? LOCAL[code][0] > LOCAL[code][1] : false),
})));
const ALL = items(GROUPS);
const byCode = new Map(ALL.map((r) => [r.code, r]));

// Viewers can play, pause, change volume and speed, and go full screen, but not download.
const lock = (v) => {
  v.setAttribute("controlsList", "nodownload noremoteplayback");
  v.disablePictureInPicture = true;
  v.addEventListener("contextmenu", (e) => e.preventDefault());
  return v;
};
const NAMES = { instagram: "Instagram", youtube: "YouTube", tiktok: "TikTok", x: "X", linkedin: "LinkedIn", facebook: "Facebook", threads: "Threads" };
const icon = (p) => { const i = el("img", "ico"); i.src = `/icons/${p}.svg`; i.alt = NAMES[p] || p; i.width = 14; i.height = 14; return i; };
// "logos + combined views" for one video.
function stats(r) {
  const s = el("span", "stats");
  r.platforms.forEach((p) => s.append(icon(p)));
  if (r.views) s.append(el("span", null, `${fmt(r.views)} views`));
  return s;
}

/* ---------- Every video has its own address: /work/<client>/<Instagram code> ---------- */
const linkOf = (r) => `/work/${r.group.id}/${r.code}`;

/* ---------- Testimonials: a voice note as a message-app audio bubble ----------
   Play/pause, a waveform whose bars fill as it plays (click a bar to jump there), and the time left.
   Starting one stops any other voice note or video on the page. */
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
function voiceBubble(v, g) {
  const box = el("div", "vb");
  const play = el("button", "vb__play"); play.type = "button";
  play.setAttribute("aria-label", `Play voice note from ${g.name}`);
  play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="vb__i-play" d="M8 5.5v13l11-6.5z"/><path class="vb__i-pause" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  const wave = el("span", "vb__wave");
  const bars = v.peaks.map((p) => { const b = el("i"); b.style.setProperty("--h", p.toFixed(3)); wave.append(b); return b; });
  const time = el("span", "vb__time", clock(v.dur));
  const audio = el("audio"); audio.preload = "none"; audio.src = v.src;
  box.append(play, wave, time, audio);
  const paint = () => {
    const f = audio.duration ? audio.currentTime / audio.duration : 0;
    const on = Math.round(f * bars.length);
    bars.forEach((b, i) => b.classList.toggle("is-on", i < on));
    time.textContent = clock(audio.paused && !audio.currentTime ? v.dur : Math.max(0, (audio.duration || v.dur) - audio.currentTime));
  };
  play.addEventListener("click", () => { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); });
  audio.addEventListener("play", () => {
    document.querySelectorAll("audio, video").forEach((o) => { if (o !== audio) o.pause(); });
    box.classList.add("is-playing"); play.setAttribute("aria-label", `Pause voice note from ${g.name}`);
  });
  audio.addEventListener("pause", () => { box.classList.remove("is-playing"); play.setAttribute("aria-label", `Play voice note from ${g.name}`); });
  audio.addEventListener("ended", () => { audio.currentTime = 0; paint(); });
  audio.addEventListener("timeupdate", paint);
  wave.addEventListener("click", (e) => {
    const r = wave.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const go = () => { audio.currentTime = f * audio.duration; paint(); };
    if (audio.readyState >= 1) go(); else { audio.addEventListener("loadedmetadata", go, { once: true }); audio.load(); }
  });
  return box;
}
// A message the client sent, shown the way it looked in the chat: picture, name, date, words.
function messageCard(m, g) {
  const card = el("figure", "msg");
  const av = el("img", "msg__av"); av.src = `/avatars/${(g.avatars || [])[0]}.jpg`; av.alt = ""; av.width = 32; av.height = 32; av.decoding = "async";
  const body = el("div", "msg__body");
  const head = el("p", "msg__head"); head.append(el("strong", null, g.name), el("time", null, m.date));
  body.append(head, el("blockquote", "msg__text", m.text));
  card.append(av, body);
  return card;
}

/* ---------- Player ---------- */
let player;
function openPlayer(r) {
  if (!player) {
    player = el("dialog", "player");
    player.innerHTML = '<div class="player__in"><video controls playsinline></video><p class="player__meta"><span></span><span></span><a class="u" target="_blank" rel="noopener"></a></p></div><button class="player__close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>';
    document.body.append(player);
    lock(player.querySelector("video"));
    const stop = () => { const v = player.querySelector("video"); v.pause(); v.removeAttribute("src"); v.load(); };
    player.addEventListener("close", stop);
    // Closing the player returns the address (and the tab title) to the page underneath.
    player.addEventListener("close", () => {
      document.title = player._title || document.title;
      if (history.state && history.state.video) history.back();
    });
    window.addEventListener("popstate", () => { if (player.open && !(history.state && history.state.video)) player.close(); });
    player.querySelector(".player__close").addEventListener("click", () => player.close());
    player.addEventListener("click", (e) => { if (e.target === player || e.target.classList.contains("player__in")) player.close(); });
  }
  const v = player.querySelector("video");
  v.src = `/videos/${r.code}.mp4`;
  v.poster = `/covers/${r.code}.jpg`;
  const [a, b, c] = player.querySelector(".player__meta").children;
  a.textContent = r.who;
  b.textContent = r.views ? `${fmt(r.views)} views` : "";
  c.textContent = `More from ${r.group.name}`;
  c.href = `/work/${r.group.id}`;
  c.removeAttribute("target");
  // The address bar shows this video's own link while it plays, so it can be copied and sent as is.
  if (!player.open) player._title = document.title;
  document.title = r.who;
  if (location.pathname !== linkOf(r)) {
    if (history.state && history.state.video) history.replaceState({ video: r.code }, "", linkOf(r));
    else history.pushState({ video: r.code }, "", linkOf(r));
  }
  player.showModal();
  v.play().catch(() => {});
}

// One media frame: a cover that plays a silent preview on hover and opens the player on click.
function frame(r, wide, small) {
  const m = el("span", wide ? "m m--wide" : "m");
  const img = el("img");
  img.src = small ? `/covers/sm/${r.code}.jpg` : `/covers/${r.code}.jpg`; img.alt = ""; img.decoding = "async"; img.draggable = false;
  m.append(img);
  return m;
}
function link(r, cls) {
  const a = el("a", cls);
  a.href = r.url; a.target = "_blank"; a.rel = "noopener";
  a.dataset.code = r.code; a.draggable = false;
  return a;
}
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
let previewOff = false;
document.addEventListener("mouseover", (e) => {
  if (!canHover || previewOff) return;
  const a = e.target.closest && e.target.closest("a[data-code]");
  if (!a || a._v) return;
  const r = byCode.get(a.dataset.code);
  if (!r || !r.local) return;
  const v = el("video");
  v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto"; v.src = `/videos/${r.code}.mp4`;
  a._v = v;
  a.querySelector(".m").append(v);
  v.play().catch(() => {});
  a.addEventListener("mouseleave", () => { v.pause(); v.remove(); a._v = null; }, { once: true });
});
let suppressClick = false;
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a[data-code]");
  if (!a) return;
  if (suppressClick) { e.preventDefault(); return; }
  const r = byCode.get(a.dataset.code);
  if (r && r.local && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openPlayer(r); }
});

/* ---------- Home: the endless canvas ---------- */
const canvas = document.getElementById("canvas");
if (canvas) {
  const home = canvas.parentElement;
  // Fixed-seed shuffle so the layout is the same on every visit.
  let seed = 20261114;
  const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const shuffle = (list) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Four kinds of tile: big or small, and wide (horizontal video) or tall (vertical video).
  // Every video appears exactly once per block, so nothing repeats until you have travelled a full block.
  const isBig = (r) => BIG.has(r.code);
  // Take one video from each client in turn, so the same client never sits next to itself.
  const spread = (list) => {
    const byClient = new Map();
    shuffle(list).forEach((r) => { const k = r.who; if (!byClient.has(k)) byClient.set(k, []); byClient.get(k).push(r); });
    const groups = [...byClient.values()].sort((x, y) => y.length - x.length), out = [];
    while (groups.some((g) => g.length)) groups.forEach((g) => { if (g.length) out.push(g.shift()); });
    return out;
  };
  // The opening view pairs these two, so they lead the big vertical queue (left, then right).
  const LEAD = ["DZdEP5eJXfQ", "DVg-_5giapC"];
  const tallBig = ALL.filter((r) => isBig(r) && !r.wide);
  const queues = {
    V: [...LEAD.map((c) => tallBig.find((r) => r.code === c)).filter(Boolean), ...spread(tallBig.filter((r) => !LEAD.includes(r.code)))],
    H: spread(ALL.filter((r) => isBig(r) && r.wide)),
    h: spread(ALL.filter((r) => !isBig(r) && r.wide)),
    s: spread(ALL.filter((r) => !isBig(r) && !r.wide)),
  };
  const take = (k) => queues[k].shift();

  // Column kinds: n = one small tile wide, W = one big vertical wide, X = one big horizontal wide.
  // Row kinds: H big horizontal, V big vertical, h small horizontal, s small vertical (letters repeat per tile).
  const COLS = ["X", "n", "W", "n", "X", "n", "W"];
  const LAYOUT = [
    ["H", "VV", "ssss", "H"],
    ["s", "s", "s", "s", "s", "s", "s"],
    ["V", "ss", "h", "V", "ss"],
    ["s", "s", "s", "s", "s", "s", "s"],
    ["VV", "H", "hh", "H"],
    ["s", "s", "s", "s", "s", "s", "s"],
    ["ss", "V", "h", "ss", "V"],
  ];
  const tile = (r, big, wide) => {
    const a = link(r, big ? "tile tile--big" : "tile");
    a.append(frame(r, wide, !big));
    const cap = el("span", "cap");
    cap.append(el("span", null, r.who));
    if (r.views) cap.append(el("span", null, fmt(r.views)));
    a.append(cap);
    return a;
  };
  const cell = (k) => { const r = take(k); return r ? [r, k === "H" || k === "V", k === "H" || k === "h"] : null; };
  const plan = LAYOUT.map((rows) => rows.map((row) => [...row].map(cell).filter(Boolean)).filter((cells) => cells.length));
  // Anything left over (when more videos are added later) goes onto the column that suits it, shortest first.
  const fits = { V: "W", H: "X", h: "W", s: "n" };
  for (const k of ["V", "H", "h", "s"]) {
    let c;
    while ((c = cell(k))) {
      const cols = COLS.map((kind, i) => i).filter((i) => COLS[i] === fits[k]).sort((x, y) => plan[x].length - plan[y].length);
      plan[cols[0]].push([c]);
    }
  }

  const track = el("div", "ctrack");
  canvas.append(track);
  let stacks = [], blockW = 0;

  function build() {
    track.textContent = ""; stacks = [];
    const vw = home.clientWidth, vh = home.clientHeight;
    const makeBlock = (hidden) => {
      const block = el("div", "cblock");
      plan.forEach((rows, ci) => {
        const col = el("div", "ccol ccol--" + COLS[ci]);
        const stack = el("div", "cstack");
        const set = el("div", "cset");
        rows.forEach((cells) => {
          const row = el("div", "crow");
          cells.forEach(([r, isBig, wide]) => {
            const t = tile(r, isBig, wide);
            if (hidden) { t.tabIndex = -1; t.setAttribute("aria-hidden", "true"); }
            row.append(t);
          });
          set.append(row);
        });
        stack.append(set);
        col.append(stack);
        block.append(col);
        stacks.push({ stack, set, h: 0 });
      });
      return block;
    };
    const first = makeBlock(false);
    track.append(first);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    blockW = first.offsetWidth + gap;
    const nH = Math.ceil(vw / blockW) + 1;
    for (let i = 1; i < nH; i++) track.append(makeBlock(true));
    // Each column loops on its own height, so there is never a seam.
    stacks.forEach((s) => {
      s.h = s.set.offsetHeight + gap;
      const nV = Math.ceil(vh / s.h) + 1;
      for (let i = 1; i < nV; i++) {
        const copy = s.set.cloneNode(true);
        copy.querySelectorAll("a").forEach((a) => { a.tabIndex = -1; a.setAttribute("aria-hidden", "true"); });
        s.stack.append(copy);
      }
    });
    paint();
  }

  let ox = -60, oy = -90, vx = 0, vy = 0, raf = 0;
  const mod = (v, m) => ((v % m) + m) % m;
  function paint() {
    if (!blockW) return;
    track.style.transform = `translate3d(${(mod(ox, blockW) - blockW).toFixed(1)}px,0,0)`;
    for (const s of stacks) s.stack.style.transform = `translate3d(0,${(mod(oy, s.h) - s.h).toFixed(1)}px,0)`;
  }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function glide() {
    vx *= 0.94; vy *= 0.94;
    ox += vx; oy += vy; paint();
    raf = Math.abs(vx) + Math.abs(vy) > 0.2 ? requestAnimationFrame(glide) : 0;
  }

  let drag = null, moved = 0;
  home.addEventListener("pointerdown", (e) => {
    if (e.button) return;
    cancelAnimationFrame(raf); raf = 0; vx = vy = 0;
    drag = { x: e.clientX, y: e.clientY, t: performance.now() }; moved = 0;
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now();
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 5 && !home.classList.contains("is-dragging")) { home.classList.add("is-dragging"); previewOff = true; }
    const dt = Math.max(1, now - drag.t);
    vx = (dx / dt) * 16; vy = (dy / dt) * 16;
    ox += dx; oy += dy;
    drag = { x: e.clientX, y: e.clientY, t: now };
    paint();
  });
  const release = () => {
    if (!drag) return;
    drag = null;
    home.classList.remove("is-dragging"); previewOff = false;
    if (moved > 5) { suppressClick = true; setTimeout(() => { suppressClick = false; }, 0); }
    if (!still && moved > 5) raf = requestAnimationFrame(glide);
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  home.addEventListener("wheel", (e) => { e.preventDefault(); ox -= e.deltaX; oy -= e.deltaY; paint(); }, { passive: false });
  home.addEventListener("keydown", (e) => {
    const step = { ArrowLeft: [90, 0], ArrowRight: [-90, 0], ArrowUp: [0, 90], ArrowDown: [0, -90] }[e.key];
    if (!step || e.target.closest("a")) return;
    e.preventDefault(); ox += step[0]; oy += step[1]; paint();
  });
  home.addEventListener("dragstart", (e) => e.preventDefault());

  // Opening view: centre the row that pairs two of the featured client's big videos.
  function openingView() {
    const rows = [...track.querySelectorAll(".crow")].filter((r) => r.querySelectorAll(".tile--big").length === 2);
    const row = rows.find((r) => r.querySelector('[data-code="DVg-_5giapC"]') && r.querySelector('[data-code="DZdEP5eJXfQ"]'))
      || rows.find((r) => r.querySelector('[data-code="DVg-_5giapC"]'));
    if (!row) return;
    let b = row.getBoundingClientRect();
    if (b.width > home.clientWidth - 24) {
      const one = row.querySelector('[data-code="DVg-_5giapC"]');
      if (one) { const t = one.getBoundingClientRect(); b = { left: t.left, width: t.width, top: b.top, height: b.height }; }
    }
    ox += home.clientWidth / 2 - (b.left + b.width / 2);
    oy += home.clientHeight / 2 - (b.top + b.height / 2) + 20;
    paint();
  }
  build();
  openingView();
  // Until the visitor moves the canvas, keep the opening view centred through resizes and rotation.
  let touched = false;
  for (const ev of ["pointerdown", "wheel", "keydown"]) home.addEventListener(ev, () => { touched = true; }, { passive: true });
  let rt = 0;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (!touched) openingView(); }, 150); });
}

/* ---------- Work: clients as a ruled list, grouped by kind ---------- */
const avatarsOf = (g) => (g.avatars || []).map((h) => { const i = el("img", "av"); i.src = `/avatars/${h}.jpg`; i.alt = ""; i.decoding = "async"; i.width = 150; i.height = 150; return i; });
const worklist = document.getElementById("worklist");
if (worklist) {
  const cats = [...new Set(GROUPS.map((g) => g.cat))];
  for (const cat of cats) {
    const sec = el("section", "wsec");
    sec.id = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    sec.append(el("h2", "label", cat));
    const ul = el("ul", "wlist");
    for (const g of GROUPS.filter((x) => x.cat === cat)) {
      const li = el("li");
      const a = el("a", "wrow");
      a.href = `/work/${g.id}`;
      const avs = el("span", (g.avatars || []).length > 4 ? "wrow__avs wrow__avs--many" : "wrow__avs"); avs.append(...avatarsOf(g));
      a.append(avs, el("span", "wrow__name", g.name),
        el("span", "wrow__meta", reachOf(g) ? `${fmt(reachOf(g))} followers` : ""));
      li.append(a); ul.append(li);
    }
    sec.append(ul); worklist.append(sec);
  }
  // The sections are drawn by this script, so jump to /work#<section> once they exist.
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
}

// Proximity effect on the Work list: rows grow as the cursor nears them and lean towards it.
if (worklist && window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const rows = [...worklist.querySelectorAll(".wrow")];
  const REACH = 150, GROW = 0.09, PULL = 10;
  let px = 0, py = 0, queued = false;
  const apply = () => {
    queued = false;
    let nearest = null, best = Infinity;
    for (const row of rows) {
      const b = row.getBoundingClientRect();
      const dy = py - (b.top + b.height / 2);
      const near = Math.max(0, 1 - Math.abs(dy) / REACH);       // 1 on the row, 0 beyond reach
      const ease = near * near * (3 - 2 * near);                // smooth step
      row.style.setProperty("--s", (1 + GROW * ease).toFixed(3));
      // Lean towards the pointer: a little sideways with the cursor, a little up or down.
      const dx = Math.max(-1, Math.min(1, (px - (b.left + b.width / 2)) / (b.width / 2)));
      row.style.setProperty("--mx", `${(dx * PULL * ease).toFixed(1)}px`);
      row.style.setProperty("--my", `${(Math.max(-1, Math.min(1, dy / (b.height / 2))) * 3 * ease).toFixed(1)}px`);
      if (Math.abs(dy) < best) { best = Math.abs(dy); nearest = row; }
    }
    rows.forEach((row) => row.classList.toggle("is-near", row === nearest && best < 40));
  };
  worklist.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; if (!queued) { queued = true; requestAnimationFrame(apply); } });
  worklist.addEventListener("pointerleave", () => rows.forEach((row) => {
    row.classList.remove("is-near");
    for (const v of ["--s", "--mx", "--my"]) row.style.removeProperty(v);
  }));
}

/* ---------- Client page ---------- */
const stage = document.getElementById("stage");
if (stage) {
  // Address is /work/<id>. Old links (client.html?c=<id>) are moved to the new address.
  const legacy = new URLSearchParams(location.search).get("c");
  if (legacy) { location.replace(`/work/${legacy}`); }
  const seg = location.pathname.replace(/\.html$/, "").split("/").filter(Boolean);
  const id = legacy || (seg[0] === "work" ? seg[1] : seg[seg.length - 1]);
  // /work/<client>/<code> opens on that video.
  const wantCode = seg[0] === "work" && seg[2] && seg[2] !== "index" ? seg[2] : null;
  const at = Math.max(0, GROUPS.findIndex((x) => x.id === id));
  const g = GROUPS[at];
  const list = items([g]);
  const start = Math.max(0, list.findIndex((r) => r.code === wantCode));
  // Keep the address on the video in view (replace, not push, so Back still leaves the page).
  let urlReady = false;
  const setUrl = (r) => {
    if (!urlReady || location.pathname === linkOf(r)) return;
    history.replaceState(null, "", linkOf(r));
    document.title = r.who;
  };
  document.title = g.name;
  document.getElementById("cname").textContent = g.name;
  const avBox = document.getElementById("cavs");
  if ((g.avatars || []).length) avBox.append(...avatarsOf(g)); else avBox.hidden = true;
  if ((g.avatars || []).length > 1) avBox.classList.add("pavs--many");

  // Icons that link to the client's own profiles (not to a particular video).
  const socials = { ...(g.handle ? { instagram: `https://www.instagram.com/${g.handle}/` } : {}), ...(SOCIALS[g.id] || {}) };
  const sbox = document.getElementById("csocials");
  for (const [p, url] of Object.entries(socials)) {
    const a = el("a", "soc"); a.href = url; a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", `${g.name} on ${NAMES[p] || p}`);
    const i = icon(p); i.alt = ""; i.width = 16; i.height = 16; a.append(i);
    sbox.append(a);
  }
  // Testimonials: voice notes as message-app audio bubbles, then the client's messages as they sent them.
  const tbox = document.getElementById("tmon");
  const voices = (typeof VOICES !== "undefined" && VOICES[g.id]) || [];
  const msgs = MESSAGES[g.id] || [];
  if (tbox && (voices.length || msgs.length)) {
    tbox.hidden = false;
    voices.forEach((v) => tbox.append(voiceBubble(v, g)));
    msgs.forEach((m) => tbox.append(messageCard(m, g)));
  }
  // Combined audience across the client's platforms (one number, no per-platform split).
  const facts = document.getElementById("cfacts");
  if (reachOf(g)) {
    const big = el("p", "reach__total");
    big.append(el("strong", null, fmt(reachOf(g))), ` followers`);
    facts.append(big);
  } else { facts.hidden = true; }
  if (g.pageViews) {
    const pv = el("p", "reach__total reach__total--second");
    pv.append(el("strong", null, fmt(g.pageViews)), ` views on the page`);
    facts.append(pv);
  }
  // Names inside this group (More creators, Think Studio). The one on screen is highlighted; click to jump.
  const withNames = [...new Set(list.map((r) => r.who))];
  const namesBox = document.getElementById("cnames");
  const nameEls = new Map();
  let jump = () => {};
  if (g.group && withNames.length > 1) {
    withNames.forEach((n) => {
      const b = el("button", "pname", n); b.type = "button";
      b.addEventListener("click", () => jump(list.findIndex((r) => r.who === n)));
      nameEls.set(n, b); namesBox.append(b);
    });
  } else { namesBox.hidden = true; }
  // Details of the video currently in the centre.
  const now = { note: document.getElementById("nownote"), stats: document.getElementById("nowstats") };
  const showNow = (r) => {
    now.note.textContent = noteOf(r.code);
    now.note.hidden = !noteOf(r.code);
    now.stats.replaceChildren(stats(r));
    nameEls.forEach((b, n) => b.setAttribute("aria-current", n === r.who ? "true" : "false"));
  };
  if (list.length) showNow(list[start]); else document.getElementById("now").hidden = true;

  // One inline video. Starting one pauses any other.
  const media = (r) => {
    const m = el("div", r.wide ? "m m--wide" : "m");
    if (r.local) {
      const v = el("video");
      v.controls = true; v.playsInline = true; v.preload = "none"; lock(v);
      v.poster = `/covers/${r.code}.jpg`; v.src = `/videos/${r.code}.mp4`;
      v.addEventListener("play", () => { document.querySelectorAll("audio, video").forEach((o) => { if (o !== v) o.pause(); }); setUrl(r); });
      m.append(v);
    } else {
      const img = el("img"); img.src = `/covers/${r.code}.jpg`; img.alt = ""; m.append(img);
    }
    return m;
  };

  if (g.layout === "list") {
    // Big list: a text column on the left for each video, the video on the right.
    document.body.classList.add("is-list");
    for (const r of list) {
      const row = el("article", "lrow");
      const text = el("div", "lrow__text");
      text.append(el("h2", null, r.who));
      if (NOTES[r.code]) text.append(el("p", "lrow__note", NOTES[r.code]));
      text.append(stats(r));
      row.id = r.code;
      row.append(text, media(r));
      stage.append(row);
    }
    if (wantCode && document.getElementById(wantCode)) requestAnimationFrame(() => document.getElementById(wantCode).scrollIntoView({ block: "center" }));
    urlReady = true;
  } else if (list.length) {
    // Cover-flow carousel: the current video sits in the centre at full size,
    // the others step back on either side. Every video can be brought to the centre.
    const car = el("div", "car");
    const track = el("div", "car__track");
    track.tabIndex = 0;
    track.setAttribute("aria-label", `${g.name} videos`);
    const slides = list.map((r, i) => {
      const f = el("figure", r.wide ? "slide slide--wide" : "slide");
      f.append(media(r));
      f.addEventListener("click", () => { if (i !== cur) go(i); });
      track.append(f);
      return f;
    });
    const nav = el("div", "car__nav");
    const prev = el("button", "car__btn", "Previous"); prev.type = "button";
    const next = el("button", "car__btn", "Next"); next.type = "button";
    const dots = el("div", "car__dots");
    let cur = 0;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mid = (sl) => sl.offsetLeft + sl.offsetWidth / 2;
    // `want` is where we are heading, so quick repeated presses each move one further.
    let want = 0, settle = 0;
    const go = (i) => {
      want = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: mid(slides[want]) - track.clientWidth / 2, behavior: still ? "auto" : "smooth" });
    };
    const dotEls = slides.map((_, i) => {
      const d = el("button", "car__dot"); d.type = "button";
      d.setAttribute("aria-label", `Go to video ${i + 1}`);
      d.addEventListener("click", () => go(i));
      dots.append(d);
      return d;
    });
    // Side padding so the first and last video can also reach the centre.
    const pad = () => {
      track.style.paddingLeft = `${Math.max(0, (track.clientWidth - slides[0].offsetWidth) / 2)}px`;
      track.style.paddingRight = `${Math.max(0, (track.clientWidth - slides[slides.length - 1].offsetWidth) / 2)}px`;
    };
    const paint = () => {
      const c = track.scrollLeft + track.clientWidth / 2;
      let best = 0, gap = Infinity;
      slides.forEach((sl, i) => {
        const d = (mid(sl) - c) / sl.offsetWidth;          // 0 = centred, ±1 = one video away
        const a = Math.min(Math.abs(d), 2.5);
        if (Math.abs(d) < gap) { gap = Math.abs(d); best = i; }
        const turn = still ? 0 : Math.max(-1, Math.min(1, d)) * -32;
        sl.style.transform = `perspective(1400px) translateX(${(-d * 6).toFixed(2)}%) rotateY(${turn.toFixed(1)}deg) scale(${(1 - a * 0.13).toFixed(3)})`;
        sl.style.opacity = (1 - Math.min(a, 2) * 0.3).toFixed(2);
        sl.style.zIndex = String(100 - Math.round(a * 10));
      });
      if (best !== cur || !slides[cur].classList.contains("is-cur")) {
        cur = best;
        slides.forEach((sl, i) => {
          sl.classList.toggle("is-cur", i === cur);
          if (i !== cur) { const v = sl.querySelector("video"); if (v) v.pause(); }
        });
        dotEls.forEach((d, i) => d.setAttribute("aria-current", i === cur ? "true" : "false"));
        showNow(list[cur]);
        setUrl(list[cur]);
      }
      prev.disabled = cur === 0; next.disabled = cur === slides.length - 1;
    };
    let t = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(t); t = requestAnimationFrame(paint);
      // Once scrolling stops (including a swipe), treat wherever it landed as the target.
      clearTimeout(settle); settle = setTimeout(() => { want = cur; }, 180);
    }, { passive: true });
    prev.addEventListener("click", () => go(want - 1));
    next.addEventListener("click", () => go(want + 1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(want + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(want - 1); }
    });
    jump = go;
    nav.append(prev, dots, next);
    // Soft edges: the videos blur and fade into the page at both sides.
    const view = el("div", "car__view");
    const edge = (side) => { const e = el("div", "car__edge car__edge--" + side); e.setAttribute("aria-hidden", "true"); for (let k = 0; k < 6; k++) e.append(el("i")); return e; };
    view.append(track, edge("l"), edge("r"));
    car.append(view, nav);
    stage.append(car);
    if (slides.length < 2) nav.hidden = true;
    // The blurred edges only ever cover the space beside the widest video, never the centred video itself.
    const fitEdges = () => {
      const widest = Math.max(...slides.map((sl) => sl.offsetWidth));
      const room = (track.clientWidth - widest) / 2 - 10;
      car.style.setProperty("--edge", `${Math.max(0, Math.min(210, room)).toFixed(0)}px`);
    };
    const layout = () => { pad(); fitEdges(); paint(); };
    // Open on the video named in the address (no animation), then let the address follow the carousel.
    const jumpToStart = () => { if (start) { want = start; track.scrollLeft = mid(slides[start]) - track.clientWidth / 2; } paint(); };
    layout();
    jumpToStart();
    window.addEventListener("resize", layout);
    window.addEventListener("load", () => { layout(); if (!urlReady) jumpToStart(); urlReady = true; }, { once: true });
    if (document.readyState === "complete") urlReady = true;
  }
  if (g.soon) { const so = document.getElementById("soon"); so.textContent = g.soon; so.hidden = false; }
  // On phones the caption, views and the button follow the video, so they stay in view while swiping.
  const phone = window.matchMedia("(max-width: 700px)");
  const aside = document.querySelector(".project__text");
  const nowBox = document.getElementById("now"), cta = document.querySelector(".project__contact");
  const place = () => {
    const tm = document.getElementById("tmon");
    if (phone.matches) { const after = document.getElementById("soon"); after.after(nowBox, cta, tm); }
    else { document.getElementById("csocials").after(tm); aside.append(nowBox, cta); }
  };
  place();
  phone.addEventListener("change", place);
  const nx = GROUPS[(at + 1) % GROUPS.length];
  const n = document.getElementById("cnext");
  n.href = `/work/${nx.id}`;
  n.querySelector("span").textContent = nx.name;
}

/* ---------- Contact: sends the message to Md's inbox ----------
   Posts to FormSubmit, which emails each submission to the address in data-to.
   If the service can't be reached, it falls back to opening the visitor's email app. */
const form = document.getElementById("brief");
if (form) {
  const error = document.getElementById("form-error");
  const done = document.getElementById("form-done");
  const send = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;
    for (const f of form.querySelectorAll("[required]")) {
      const bad = !f.value.trim();
      f.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) ok = false;
    }
    error.hidden = ok;
    if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    const d = new FormData(form);
    if (d.get("_honey")) return;  // filled only by spam bots
    const to = form.dataset.to;
    const whatsapp = d.get("whatsapp") ? `${d.get("dial")} ${d.get("whatsapp")}` : "Not given";
    const subject = `New project enquiry from ${d.get("name")}`;
    const fields = {
      Name: d.get("name"), Email: d.get("email"), WhatsApp: whatsapp,
      "What they need": d.get("need") || "Not chosen", Project: d.get("brief"),
      Page: location.href,
    };
    const label = send.innerHTML; send.disabled = true; send.setAttribute("aria-busy", "true"); send.textContent = "Sending";
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, _subject: subject, _replyto: d.get("email"), _template: "table", _captcha: "false" }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) !== "true") throw new Error(out.message || "send failed");
      form.hidden = true;
      const heading = form.parentElement.querySelector(".label"); if (heading) heading.hidden = true;
      done.hidden = false;
      done.focus();
    } catch (err) {
      // Fallback: the visitor's own email app, pre-filled.
      const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } finally {
      send.disabled = false; send.removeAttribute("aria-busy"); send.innerHTML = label;
    }
  });
}

/* ---------- Letters that lean away from the cursor, everywhere on the site ----------
   Very subtle: clickable text under or near the pointer has its letters nudged a couple of pixels away from it,
   and a tap or click on a button or link gives its letters one small outward pulse.
   The original text stays in place for screen readers; the moving letters are decoration. */
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Only things you can click or tap: links, buttons and selectable options.
  const TARGETS = [
    ".nav__name", ".nav nav a", ".btn", ".u", ".names a", ".links a",
    ".wrow__name", ".wrow__meta", ".pname", ".opt > span", ".car__btn", ".project__next a",
  ].join(",");
  const RADIUS = 70, PUSH = 2.25, TAP_RADIUS = 120, TAP_PUSH = 3.5;
  const hosts = new Set();

  // Replace each text node with per-letter spans, keeping words unbreakable and spaces as real spaces.
  const split = (host) => {
    if (!host || host.closest(".canvas, .player, video")) return;
    const texts = [];
    const walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeValue.trim() && !n.parentElement.closest(".rx, .sr, select, option, script") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    while (walk.nextNode()) texts.push(walk.currentNode);
    for (const node of texts) {
      const frag = document.createDocumentFragment();
      const visual = el("span", "rx"); visual.setAttribute("aria-hidden", "true");
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { visual.append(" "); return; }
        const w = el("span", "rx__w");
        for (const ch of part) w.append(el("span", "rx__c", ch));
        visual.append(w);
      });
      frag.append(el("span", "sr", node.nodeValue), visual);
      node.replaceWith(frag);
    }
    hosts.add(host);
  };
  window.splitLetters = split;
  document.querySelectorAll(TARGETS).forEach(split);

  let px = -9999, py = -9999, queued = false;
  const moved = new Set();
  const push = (host, x, y, radius, strength) => {
    const hb = host.getBoundingClientRect();
    if (x < hb.left - radius || x > hb.right + radius || y < hb.top - radius || y > hb.bottom + radius) return false;
    let any = false;
    for (const c of host.querySelectorAll(".rx__c")) {
      const b = c.getBoundingClientRect();
      const ox = c._tx || 0, oy = c._ty || 0;
      const dx = b.left + b.width / 2 - ox - x, dy = b.top + b.height / 2 - oy - y, d = Math.hypot(dx, dy);
      let tx = 0, ty = 0;
      if (d < radius) {
        const f = (1 - d / radius) ** 2 * strength;
        tx = d > 0.5 ? (dx / d) * f : 0; ty = d > 0.5 ? (dy / d) * f : -f;
      }
      if (Math.abs(tx - ox) > 0.05 || Math.abs(ty - oy) > 0.05) {
        c._tx = tx; c._ty = ty;
        c.style.transform = tx || ty ? `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)` : "";
      }
      if (tx || ty) any = true;
    }
    return any;
  };
  const settle = (host) => { for (const c of host.querySelectorAll(".rx__c")) if (c._tx || c._ty) { c._tx = c._ty = 0; c.style.transform = ""; } };
  const tick = () => {
    queued = false;
    for (const host of hosts) {
      if (!host.isConnected) { hosts.delete(host); continue; }
      if (push(host, px, py, RADIUS, PUSH)) moved.add(host);
      else if (moved.has(host)) { settle(host); moved.delete(host); }
    }
  };
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    px = e.clientX; py = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(tick); }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { px = py = -9999; for (const h of moved) settle(h); moved.clear(); });
  // A tap or click: one small outward pulse on the thing that was pressed (this is the part touch screens get).
  document.addEventListener("pointerdown", (e) => {
    const host = e.target.closest && [...hosts].find((h) => h.contains(e.target) || h === e.target.closest("a, button, label"));
    if (!host) return;
    push(host, e.clientX, e.clientY, TAP_RADIUS, TAP_PUSH);
    setTimeout(() => { if (e.pointerType === "touch") settle(host); else { px = e.clientX; py = e.clientY; tick(); } }, 180);
  }, { passive: true });
})();

/* ---------- Stacked profile pictures fan out near the cursor ----------
   On any stack of two or more pictures (More creators, Think Studio), the pictures slide apart a
   little as the pointer approaches, so more of each face shows, and close up again when it leaves.
   The stacking order never changes, so no picture cuts across another. Hover only.
   On the Work page the row is still a link, so a click opens the page as before. */
(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const stacks = [...document.querySelectorAll(".wrow__avs, .pavs")].filter((st) => st.children.length > 1);
  if (!stacks.length) return;
  stacks.forEach((st) => st.classList.add("stack"));
  const REACH = 110, STEP = 13, LIFT = 3;
  const smooth = (t) => t * t * (3 - 2 * t);
  let px = -9999, py = -9999, queued = false;
  const active = new Set();
  const rest = (st) => { for (const av of st.children) { av._tx = 0; av.style.transform = ""; } };
  // How far each picture may slide without running into whatever sits to the right of the stack.
  const roomFor = (st, n) => {
    const box = st.closest(".wrow") ? st.closest(".wrow").querySelector(".wrow__name") : null;
    const last = st.lastElementChild.getBoundingClientRect();
    const limit = box ? box.getBoundingClientRect().left - 14 : st.parentElement.getBoundingClientRect().right;
    return Math.max(0, Math.min(STEP, (limit - (last.right - (st.lastElementChild._tx || 0))) / (n - 1)));
  };
  const tick = () => {
    queued = false;
    for (const st of stacks) {
      const sb = st.getBoundingClientRect();
      if (px < sb.left - REACH || px > sb.right + REACH || py < sb.top - REACH || py > sb.bottom + REACH) {
        if (active.has(st)) { rest(st); active.delete(st); }
        continue;
      }
      active.add(st);
      const gx = Math.max(sb.left - px, 0, px - sb.right), gy = Math.max(sb.top - py, 0, py - sb.bottom);
      const g = smooth(Math.max(0, 1 - Math.hypot(gx, gy) / REACH));   // 1 when the pointer is on the stack
      const kids = [...st.children], step = roomFor(st, kids.length);
      kids.forEach((av, i) => {
        const b = av.getBoundingClientRect();
        const cx = b.left + b.width / 2 - (av._tx || 0);
        const near = smooth(Math.max(0, 1 - Math.abs(cx + i * step * g - px) / 60)) * g;
        const tx = i * step * g;
        av._tx = tx;
        av.style.transform = `translate3d(${tx.toFixed(1)}px, ${(-LIFT * near).toFixed(1)}px, 0)`;
      });
    }
  };
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    px = e.clientX; py = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(tick); }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { px = py = -9999; for (const st of active) rest(st); active.clear(); });
})();

/* ---------- Light and dark mode switch ---------- */
(() => {
  const sw = document.getElementById("theme");
  const root = document.documentElement;
  const sync = () => { if (sw) sw.setAttribute("aria-checked", root.dataset.theme === "dark" ? "true" : "false"); };
  sync();
  if (sw) sw.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    sync();
  });
  // Follow the system setting until the visitor chooses for themselves.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null; try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (saved) return;
    root.dataset.theme = e.matches ? "dark" : "light"; sync();
  });
})();

/* ---------- About: a photo follows the cursor over Md's name (his photo) and over each client name (theirs) ----------
   It grows out of the cursor, trails it on a soft spring with a slight tilt in the direction of travel,
   and shrinks back into the cursor on leave. Pointer devices only; no movement under reduced motion. */
(() => {
  // Md's own name shows his photo; each client name on About shows that client's picture (data-photo).
  const names = [...document.querySelectorAll(".hover-me, [data-photo]")];
  if (!names.length || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const photoOf = (n) => n.dataset.photo || "/avatars/hasibullah_shanto.jpg";
  [...new Set(names.map(photoOf))].forEach((src) => { const pre = new Image(); pre.src = src; });   // no blank frame on first hover
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const img = el("img", "cursor-photo");
  img.alt = ""; img.setAttribute("aria-hidden", "true"); img.decoding = "async";
  document.body.append(img);
  let tx = 0, ty = 0, x = 0, y = 0, show = 0, want = 0, tilt = 0, raf = 0;
  const frame = () => {
    const follow = still ? 1 : 0.16;
    x += (tx - x) * follow; y += (ty - y) * follow;
    show += (want - show) * (want ? 0.12 : 0.16);
    tilt += ((still ? 0 : Math.max(-14, Math.min(14, (tx - x) * 0.3))) - tilt) * 0.2;
    const ease = show * show * (3 - 2 * show);                 // smoothstep: a soft start and a soft landing
    img.style.opacity = ease.toFixed(3);
    img.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, calc(-100% - 14px)) rotate(${tilt.toFixed(2)}deg) scale(${still ? 1 : (0.35 + 0.65 * ease).toFixed(3)})`;
    const moving = Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2 || Math.abs(want - show) > 0.003 || Math.abs(tilt) > 0.05;
    raf = moving ? requestAnimationFrame(frame) : 0;
  };
  const run = () => { if (!raf) raf = requestAnimationFrame(frame); };
  for (const name of names) {
    name.addEventListener("pointerenter", (e) => {
      img.src = photoOf(name);
      if (show < 0.03) { x = tx = e.clientX; y = ty = e.clientY; }   // appear from where the cursor is
      want = 1; run();
    });
    name.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; run(); });
    name.addEventListener("pointerleave", () => { want = 0; run(); });
  }
  window.addEventListener("scroll", () => { if (want) { want = 0; run(); } }, { passive: true });
})();
