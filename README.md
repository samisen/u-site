# Turta Escape — Bali villa website

A marketing site for a tailor-made Bali villa developer, built to the
**Turta Escape Website Developer Brief**. The brief's core position:

> We are not simply building villas. We are creating a way to own, experience
> and benefit from Bali.

Angular 21 (standalone, zoneless, signals) · Ant Design via **ng-zorro-antd 21** ·
dark mode · mobile-first. Content is mock data; there is no backend yet.

## Requirements

Angular 21 needs Node `^20.19 || ^22.12 || >=24`. The repo pins **Node 24** in `.nvmrc`.

```bash
nvm use
```

> Node 20.18 (an older default on this machine) fails the install with an npm
> `edgesOut` error. Run `nvm use` first.

## Run

```bash
npm install
npm start
```

Then open http://localhost:4200. Production build: `npm run build` (output in `dist/`).

> **If a page renders as header + footer with nothing between them**, the dev
> server's dependency pre-bundle has gone stale — Vite logs "Re-optimizing
> dependencies" and the lazy route chunk 404s. `angular.json` now excludes
> `ng-zorro-antd` from pre-bundling (`serve.options.prebundle.exclude`), which
> removes the trigger, but if you ever see it: stop `npm start` and start it again.

## Pages

The funnel: why the island, then why the numbers, then what is open, then design
one. Every page ends in the same two actions — write to us, or message us on
WhatsApp (a floating button follows the visitor down every page).

Menu: **Why Bali · The Opportunity · Projects · Design Your Villa · How We Build**,
with **Start a Conversation** as the header CTA. Insights is reached from Why Bali,
from The Opportunity's related reading and from the footer — the bar stays short.

| Route | What it is |
| --- | --- |
| `/` | Short by design: hero, the two values, two doors into the story, the map with featured projects, the configurator teaser, final CTA |
| `/why-bali` | The lifestyle and tourism story, the 2025 arrivals data, the six draws, the island area by area |
| `/opportunity` | The 12–22% indicative gross yield module, the short-term hospitality model, the global comparison chart, and the methodology behind every figure |
| `/projects` · `/projects/:slug` | An interactive map of Bali (markers sized by project count) that filters the grid. Each project page carries gallery, walkthrough video, fact bar, construction timeline and an interactive yield model |
| `/design-your-villa` | **The editor** — see below |
| `/how-we-build` | The six steps in depth, the budget breakdown, what operations does after handover with a sample owner statement, our principles, the four common failure modes, and the FAQ |
| `/insights` · `/insights/:slug` | Ten investor-education and lifestyle articles across the brief's five categories |
| `/contact` | Three fields to start; budget, timeline and country are folded behind an optional disclosure |

`/areas`, `/about`, `/operations`, `/management` and `/how-it-works` redirect into
the pages that absorbed them.

## The villa editor

`/design-your-villa` sits in the normal page layout — the site's container,
header and footer — with the editor as a boxed panel inside it. A **full screen**
button in the toolbar lifts that panel to a fixed overlay above the site chrome
(and asks for the real Fullscreen API where the browser allows it); Esc returns.

The configuration sits on the left and the drawing fills the rest. A
**Simple / Advanced** switch at the top of the panel decides how much is on
show: Simple keeps it to the seven decisions that move the budget most, and
Advanced adds room-by-room areas, architectural style and options.

The drawing is plain inline SVG, laid out **in metres**, so every area it reports
is measured off the geometry rather than estimated beside it. It carries the
things that make a plan readable: dimension lines with measurements, poché walls,
door swings, a hatched pool, a 1 m grid, a scale bar, a north arrow and a title
block. Two floors share one sheet, and an upper floor draws over a faint outline
of the floor below.

**100% fits the sheet to the canvas on both axes**, measured with a
`ResizeObserver` so it follows the panel, the window and full screen. Fitting on
width alone made the drawing overrun its own height on a wide canvas, which read
as "too zoomed". Zoom runs 50%–300% from there.

**Room areas are editable.** `RoomSizes` in `core/villa-config.ts` drives the
layout: set the master at 30 m² and the row grows, the building grows, the
footprint grows and the budget follows. Where the two wings have to reconcile
their heights the living room absorbs the slack, so the panel shows the area the
drawing actually gives you next to the one you asked for.

**Site coverage follows Bali's KDB rule**: at most 50% of the plot may be roofed,
and the pool, deck and carport are open structures that do not count towards it
(`COVERAGE_LIMIT_PCT`). The editor shows footprint against the allowance at all
times and flags going over.

**Sending it takes two fields.** The toolbar's *Send to the team* opens a drawer
with the configuration already written up as a brief, a name/email form, and a
WhatsApp hand-off that carries the same summary in the message body.

## The map

## The map

`core/bali-geo.ts` holds Bali's coastline, projected once from the Indonesian
province boundary (BAKOSURTANAL 1:250,000 via the indonesia-geojson dataset)
with a latitude-corrected equirectangular projection, then simplified. Area
markers are placed from real coordinates, so Uluwatu sits on the Bukit and the
airport sits on the isthmus.

Marker area tracks the project count (`13 + sqrt(count) * 7`), so two projects
do not look like four. Hovering shows an area's numbers; selecting one filters
the project list. On a phone the map pans instead of shrinking, because Canggu,
Pererenan and Seminyak are a few kilometres apart on a 150 km island.

## Financial messaging

The brief is strict about this, so it is centralised rather than typed by hand:

- **`core/brand.ts`** holds `YIELD_CLAIM` — the 12–22% range, its subline and its
  mandatory footnote. The range is never rendered without the footnote.
- **`core/yield-model.ts`** is the only place a yield is calculated. Gross is the
  headline figure (revenue before costs); net is shown beside it, after an 18%
  management fee and 20% operating cost. Project cards, project pages and the
  configurator all read from these functions, so they cannot drift apart.
- Language rules from the brief are enforced by review, not by code: no
  "guaranteed return", no "passive income", no "best investment", no fear-based
  framing. Use "tailor-made", "indicative", "projected", "designed to perform as
  well as possible".
- The global comparison chart never draws the Bali range as a seventh bar — it is
  a different measure from a different operating model, so it sits in its own card.
- The "7.5 billion tourists" figure is not used anywhere. The site uses
  6,948,754 direct foreign arrivals to Bali in 2025 (+9.72%) and ~1.4bn
  international arrivals worldwide in 2024, both with sources in `brand.ts`.

## Rebranding

`core/brand.ts` is the single source of truth for the name, wordmark, contact
details, address, hours and every CTA label. The brief treats "Turta Escape" as a
placeholder, so changing that one file renames the site everywhere, including the
`<title>`, the footer and the About page's note about the name.

## Theming

Two compiled Ant Design themes ship as separate, non-injected bundles
(`src/themes/light.less`, `src/themes/dark.less`). `index.html` loads both and
toggles them through the `media` attribute — not `link.disabled`, which Safari
does not honour reliably; when both stylesheets stay active every Ant Design
component is styled twice and the page looks broken.

`ThemeService` switches at runtime, mirrors the choice onto `<html data-theme>`,
persists it, and follows the OS preference until the visitor chooses. Custom CSS
reads design tokens from `src/styles.css`, redefined under `html[data-theme='dark']`.

## Structure

```
src/app/
  core/      brand + yield claim, site copy, projects and areas, catalog service,
             the yield model, Bali's geometry, the villa configurator's domain
  layout/    header and footer
  shared/    project card, page hero, CTA band, video player, Bali map,
             comparison chart, WhatsApp button, reveal-on-scroll directive
  pages/     one lazily-loaded standalone component per route
  themes/    the two Ant Design Less theme entry points
public/media provided villa photography and video, plus generated poster frames
```

### Notes for the next step

- **CMS readiness.** The Projects and Insights collections already carry the
  fields the brief lists. Swapping in Supabase means replacing the arrays in
  `core/data.ts` and `core/content.ts` with queries inside `CatalogService`;
  every component reads through that service and its computed signals.
- **Lead form.** `submit()` in `pages/contact/contact.ts` marks where the insert
  and the CTA/analytics event belong.
- **Still to do from the brief:** GA4 / Meta Pixel and consent management, CTA
  event tracking, sitemap and robots, Open Graph images per page, and
  WebP/AVIF conversion of the imagery.

## Media

Villa photography and video in `public/media/` were supplied by the client and
show one real property (used as the Sungai House case study). Videos are
click-to-play and download nothing until the visitor asks (`preload="none"`);
poster frames were generated from the first frame of each clip. Area and
secondary imagery in `public/img/` is from Wikimedia Commons and should be
replaced before any real use.
