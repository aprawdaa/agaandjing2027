/* Site logic: language switching, tabs, countdown, gallery, motion.
   All words come from content.js — you shouldn't need to edit this file. */

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TABS = ["welcome", "story", "travel", "stay", "nearby", "contact", "registry"];
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Line icons for the day program (24x24 viewBox) */
const ICONS = {
  rings:   '<circle cx="9" cy="13" r="6"/><circle cx="15" cy="13" r="6"/><path d="M12 4l-2 3h4z"/>',
  glass:   '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0z"/><path d="M12 14v6M8 21h8"/>',
  camera:  '<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
  dinner:  '<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v8a2 2 0 0 1-2 2M5 3v4M9 3v4M7 3v10"/><path d="M17 3c-2 2-2 6-2 8h2v10M17 3c1.5 2 2 5 2 8h-2"/>',
  dance:   '<path d="M9 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM15 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/><path d="M8 21l1-6 2-3V8l-3 2M16 21l-1-6-2-3V8l3 2M11 12h2"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/><circle cx="12" cy="12" r="2"/>',
  plane:   '<path d="M11 4.5c0-1.2 2-1.2 2 0V10l8 4v2l-8-2v4l2 1.5V21l-3-1-3 1v-1.5L11 18v-4l-8 2v-2l8-4V4.5z"/>',
  train:   '<rect x="6" y="3" width="12" height="14" rx="2.5"/><path d="M6 10h12M12 3v7"/><circle cx="9.5" cy="13.5" r="0.8"/><circle cx="14.5" cy="13.5" r="0.8"/><path d="M8.5 17L6 21M15.5 17L18 21M7.5 19.5h9"/>',
  car:     '<path d="M3 16v-3l1.6-4.2A2 2 0 0 1 6.5 7.5h11a2 2 0 0 1 1.9 1.3L21 13v3a1 1 0 0 1-1 1h-1.5a1.5 1.5 0 0 1-3 0h-7a1.5 1.5 0 0 1-3 0H4a1 1 0 0 1-1-1z"/><path d="M4.5 12.5h15"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.sparkle}</svg>`;

/* ---------------- Language ---------------- */
function pickLanguage() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (TEXT[fromUrl]) return fromUrl;
  try { const saved = localStorage.getItem("lang"); if (TEXT[saved]) return saved; } catch (e) {}
  const browser = (navigator.language || "").slice(0, 2);
  return TEXT[browser] ? browser : SITE.defaultLanguage;
}
let lang = pickLanguage();

function render() {
  const t = TEXT[lang];
  document.documentElement.lang = lang;
  document.title = t["meta.title"];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = t[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });

  $("#lang").innerHTML = Object.entries(SITE.languages)
    .map(([code, label]) => `<button data-lang="${code}" aria-pressed="${code === lang}">${label}</button>`)
    .join("");

  $("#story-list").innerHTML = t["story.items"]
    .map((i) => `<li><span class="story-year">${esc(i.year)}</span><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></li>`)
    .join("");

  /* getting-there table: line icon + word in the first column, no emoji */
  $("#travel-table").innerHTML =
    `<thead><tr>${t["travel.cols"].map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>` +
    `<tbody>${t["travel.items"].map((r, i) => `<tr>${r.map((c, j) =>
      `<td>${j === 0 ? icon(SITE.travelIcons[i]) : ""}${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;

  $("#hotels").innerHTML = t["travel.hotels"]
    .map((h) => `<div class="card"><h3>${esc(h.name)}</h3><p class="meta">${esc(h.meta)}</p><p>${esc(h.text)}</p>
      <a class="link" href="${esc(h.link)}" target="_blank" rel="noopener">${esc(h.cta)} →</a></div>`)
    .join("");
  /* While you're here — the first `lead` cards in a group run larger, the rest compact */
  $("#nearby-groups").innerHTML = t["nearby.groups"].map((g) => {
    const cards = g.items.map((p, i) => `
      <figure class="place${i < (g.lead || 0) ? " lead" : ""} reveal">
        <div class="place-img"><img src="assets/places/${esc(p.img)}.jpg" alt="${esc(p.name)}" loading="lazy"></div>
        <figcaption><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p></figcaption>
      </figure>`).join("");
    return `<div class="place-group reveal-group">
      <p class="place-label">${esc(g.label)}</p>
      <div class="place-grid">${cards}</div>
    </div>`;
  }).join("");

  $("#contacts").innerHTML = t["contact.people"]
    .map((p) => `<div class="contact-card"><p class="contact-role">${esc(p.role)}</p><h3>${esc(p.name)}</h3>
      <a class="contact-phone" href="tel:${esc(p.phone.replace(/\s/g, ""))}">${esc(p.phone)}</a></div>`)
    .join("");

  $("#registry-rows").innerHTML = t["registry.details"]
    .map(([label, value]) => `<div class="rd-row"><span class="rd-label">${esc(label)}</span><span class="rd-value">${esc(value)}</span></div>`)
    .join("");

  const q = encodeURIComponent(SITE.venue.mapQuery);
  $("#venue-name").textContent = SITE.venue.name;
  $("#venue-address").textContent = SITE.venue.address;
  $("#map-link").href = `https://www.google.com/maps/search/?api=1&query=${q}`;

  tick();
  observeReveals();
}

$("#lang").addEventListener("click", (e) => {
  const code = e.target.dataset.lang;
  if (!code || code === lang) return;
  lang = code;
  try { localStorage.setItem("lang", lang); } catch (err) {}
  withTransition(render);
});

/* ---------------- Motion: reveal on scroll ---------------- */
let io;
function observeReveals() {
  if (REDUCED) { document.querySelectorAll(".reveal, .reveal-group").forEach((el) => el.classList.add("in")); return; }
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal:not(.in), .reveal-group:not(.in)").forEach((el) => io.observe(el));
}

/* Use the View Transitions API for tab / language changes when available */
function withTransition(fn) {
  if (!REDUCED && document.startViewTransition) document.startViewTransition(fn);
  else fn();
}

/* ---------------- Nav: one long page, anchors + scroll-spy ---------------- */
const nav = $("#nav");
const toggle = $(".nav-toggle");

/* close the mobile menu after picking a destination */
nav.addEventListener("click", (e) => {
  if (!e.target.closest("a")) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
});
toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", nav.classList.toggle("open")));

/* highlight whichever section is currently under the header */
function markActive() {
  const line = scrollY + headerHeight() + 24;
  let active = TABS[0];
  TABS.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= line) active = id;
  });
  /* the last section can never reach the line once the page bottoms out */
  if (scrollY + innerHeight >= document.body.scrollHeight - 4) active = TABS[TABS.length - 1];
  TABS.forEach((id) => {
    const link = nav.querySelector(`[data-tab="${id}"]`);
    if (link) link.classList.toggle("active", id === active);
  });
}
function headerHeight() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 62;
}

/* header frosts to paper once you leave the hero photo; nav follows the scroll */
const header = $("#header");
addEventListener("scroll", () => {
  const hero = $(".hero-photo");
  const past = hero ? scrollY > hero.offsetHeight - headerHeight() - 8 : scrollY > 8;
  header.classList.toggle("scrolled", past);
  markActive();
}, { passive: true });

/* ---------------- Countdown ---------------- */
const target = new Date(SITE.weddingDate).getTime();
const UNITS = { days: 864e5, hours: 36e5, minutes: 6e4, seconds: 1e3 };
function tick() {
  let diff = target - Date.now();
  const box = $("#countdown");
  if (diff <= 0) { box.innerHTML = `<p class="done">${esc(TEXT[lang]["count.done"])}</p>`; return; }
  for (const [unit, ms] of Object.entries(UNITS)) {
    const el = box.querySelector(`[data-unit="${unit}"]`);
    if (el) el.textContent = Math.floor(diff / ms);
    diff %= ms;
  }
}
setInterval(tick, 1000);

/* ---------------- Go ---------------- */
render();
observeReveals();
markActive();
