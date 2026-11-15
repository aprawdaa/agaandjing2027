# Agnieszka & Jing — Wedding Page

Bilingual (EN / PL) guest site for **5 June 2027, 15:00 · Zamek Topacz, Ślęza (Wrocław)**.
Plain HTML/CSS/JS, so there's nothing to install or build.

## Where to edit what

| I want to change… | File | Where |
|---|---|---|
| Any text, in either language | `content.js` | the `TEXT.en` / `TEXT.pl` blocks |
| Schedule rows, hotels, registry, story | `content.js` | `*.items` arrays |
| Date / time (countdown) | `content.js` | `SITE.weddingDate` |
| Venue address / map pin | `content.js` | `SITE.venue` |
| Photos | `assets/photos/` + `content.js` | `SITE.photos` |
| Photo captions (per language) | `content.js` | `photos.captions` (same order as `SITE.photos`) |
| Gallery tile sizes | `content.js` | `size: "wide"` / `"tall"` on a photo |
| Colours, fonts, motion | `styles.css` | `:root` tokens at top |
| Hero photo | `styles.css` | `.hero-photo` background (desktop) and the mobile media query |

## Motion schema (`styles.css` → `:root`)

| Token | Value | Used for |
|---|---|---|
| `--ease` | out-quint | every transition and animation |
| `--dur-1` | 220 ms | hover / focus micro-interactions |
| `--dur-2` | 600 ms | element reveal |
| `--dur-3` | 900 ms | section (tab) entrance |
| `--rise` | 22 px | how far things travel as they appear |
| `--stagger` | 80 ms | delay between siblings |

| Class | Effect |
|---|---|
| `.panel` | section entrance (fade + rise) |
| `.stagger` + `style="--i:n"` | on-load sequence (hero) |
| `.reveal` | appears when scrolled into view |
| `.reveal-group` | each child reveals, staggered |

Tab and language changes cross-fade via the View Transitions API where supported. `prefers-reduced-motion` turns all of it off.

## Languages

| Feature | How it works |
|---|---|
| Switcher | EN / PL pill in the header |
| Remembered | Choice saved in the browser |
| Auto-detect | Polish browsers open in PL, everyone else in EN |
| Direct link | `?lang=pl` or `?lang=en`, e.g. `…/?lang=pl#travel` |
| Add a 3rd language | Copy the `en` block in `content.js`, translate, add to `SITE.languages` |

## Run locally

```bash
python3 -m http.server 8000   # open http://localhost:8000
```

## Publish (GitHub Pages)

Settings → Pages → Source: *Deploy from a branch* → `main` / root.
