# 06 — Chapter 1: Meet Bramble

Source of truth for this section:

- **Desktop (≥1024px)** — `Bramble Home Web.dc.html`,
  `<!-- ===== CHAPTER 1: MEET BRAMBLE ===== -->`, lines 804–1071. CSS in the
  `<helmet>` `<style>` block, lines 19–340: the `tk-*` system at lines 72–100,
  the `pf-drop-*` system at lines 215–239, `.pf-livepip` at 161–163,
  `.pf-banner-fade` at 256–257. `.canvas-botanical` is **not** in that block —
  it comes from the linked design-system sheet
  `_ds/bramble-design-system-<id>/tokens/effects.css` lines 52–83.
- **Mobile (<1024px)** — `Bramble Home Mobile.dc.html`, lines 273–441. CSS at
  lines 20–24 (tokens), 28–44 (`mtk-*`), 65–81 (`m-drop-*`), 83–86 (type).

Where the artboards write `--pf-*` / `--m-*` / `--color-*` fallback pairs, the
project token that replaces it is named in brackets. Where I have had to invent
behaviour the artboards do not contain (the 320→1023px range, the reduced-motion
resting states, the screen-reader treatment) it is called out under
**[Designer decision]**.

**Breakpoint rule:** `desk` = 1024px, as everywhere else. The two artboards are
different compositions — different sub-block order, different card contents,
different animation prefixes — so this ships as two components, mutually
exclusive by breakpoint:

- `<Chapter1Desktop>` — `hidden desk:block`
- `<Chapter1Mobile>` — `desk:hidden`

Because they are gated by `display:none`, **neither animation system needs a
media query of its own**, and the `@media (max-width:1150px)` rule the desktop
artboard puts on `.tk-grid` is dead in our build (§9, D4). This is the same
structure and the same reasoning as §05.

**Every repeated figure comes from `content/home.ts`.** `QUOTE`, `SCOPE` and
`TAKEOFF` are already there and already correct for this section; the four
priced take-off lines and the four ingest file rows are not, and §2.6 / §4.3
specify the two constants to add. Nothing in this section retypes a number that
also appears in the hero, the before/after band or the proposal card.

---

## 1. The chapter shell — a reusable component

### 1.1 Why it is a component

Chapters 1, 2 and 3 are the same five-layer recipe with four parameters swapped.
Desktop artboard lines 805–820 (ch1), 1085–1096 (ch2) and 1466–1475 (ch3) are
byte-identical apart from the photograph, its `object-position`, the heading and
one padding value. Build it once:

```
<ChapterShell
  image          = "/images/photo-2.webp"
  objectPosition = "center 40%"
  heading        = {…}
  sectionPadding = "32px 0 0"
  panelPadding   = "48px 48px 48px"
/>
```

Per-chapter parameter table, transcribed from all three call sites:

| | Ch 1 | Ch 2 | Ch 3 |
|---|---|---|---|
| `image` | `photo-2` | `photo-3` | `photo-1` |
| `object-position` | `center 40%` | `center 45%` | `center 30%` |
| `<section>` padding | `32px 0 0` | `96px 0 96px` | `0 0 96px` |
| panel padding | `48px 48px 48px` | `48px` | `48px` |
| heading `max-width` | `760px` | `820px` | `820px` |
| heading | `Meet Bramble.` / `Quoting, taken off your plate.` (two spans, hard `<br>`) | `Win more jobs, without the late-night admin.` | `Build a quoting & sales system that gets sharper every job.` |

Chapter 1's panel padding is written `48px 48px 48px` where the other two write
`48px`. It computes identically; ship the shorthand.

### 1.2 The five layers, outermost first

**L1 — section.** Verbatim:

```
margin:0 auto;width:100%;max-width:1280px;display:flex;flex-direction:column;
overflow:hidden;border-radius:8px;padding:32px 0 0
```

The `border-radius:8px` and `overflow:hidden` on the section are inert — every
child is inside the 1280px box and nothing reaches the section's own corners.
Reproduce the rendered result and drop both (§02 ruling 3 precedent). `max-w-[1280px]
mx-auto w-full flex flex-col pt-8` is the whole element.

**L2 — inner rail.** `margin:0 auto;display:flex;width:100%;max-width:1280px;
flex-direction:column`. A second identical 1280px box nested inside the first.
Inert duplication; collapse L1 and L2 into one element.

**L3 — the banner.** 520px tall, and it is the element the negative margin
below overlaps:

```
position:relative;z-index:20;height:520px;overflow:visible;padding:56px 0 0 56px
```

Inside it, two children:

- The masked photograph, `class="pf-banner-fade"` [`.banner-fade`, already in
  `styles/base.css`]:
  ```
  position:absolute;inset:0;overflow:hidden;border-radius:12px 12px 0 0
  ```
  with an inner positioning frame
  ```
  position:absolute;inset-inline:0;top:-20%;height:130%;transform:translateY(-70px)
  ```
  and the `<img>` at `width:100%;height:100%;object-fit:cover;object-position:center 40%`.

  The frame is 130% of the banner's height, pulled up 20% and then a further
  70px, so the photograph is cropped to its upper third and the subject sits
  high behind the heading. All three numbers are load-bearing; do not
  "simplify" them into an `object-position`.

- The heading, `position:relative;z-index:10;color:var(--pf-ink-100)
  [--color-pf-ink-100];max-width:760px`.

**The `banner-fade` recipe** (already ported into `styles/base.css` lines
355–373 — verify it matches this, character for character):

```css
.banner-fade {
  mask-image: linear-gradient(to bottom, #000 40%, #000 50%, transparent 99%);
}
.banner-fade::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-forest-900) 82%, transparent),
    color-mix(in srgb, var(--color-forest-900) 62%, transparent) 45%,
    color-mix(in srgb, var(--color-forest-900) 30%, transparent) 75%,
    transparent
  );
}
```

Two independent things, and they are often confused:

- the **mask** dissolves the photograph itself. Fully opaque to 50% of the
  banner's height, then a 49-percentage-point ramp to transparent at 99%. The
  `#000 40%` stop is redundant (it is the same value as the 50% stop, so the
  ramp starts at 50% either way) but harmless — ship it as drawn.
- the **scrim** (`::after`) is a four-stop forest veil that darkens the
  photograph so the cream heading can sit on it. It is *not* masked out at the
  bottom; the mask applies to the `.banner-fade` box's own painting, which
  includes `::after`, so both fade together. That is why the heading is readable
  at the top and the panel below emerges cleanly.

The artboard uses `color-mix(in srgb, …)` here where everything else on the page
uses `in oklab`. Keep `srgb`: an oklab mix of forest-900 with transparent is a
visibly different veil, and the veil is what the heading's contrast depends on.

**L4 — the panel wrapper**, which does the overlap:

```
position:relative;margin-top:-300px;overflow:hidden;border-radius:0 0 12px 12px;
padding:240px 32px 48px
```

The recipe in one sentence: the wrapper is pulled **300px** up into the 520px
banner and then pushes its own content back down with **240px** of top padding,
so the panel's visible top edge lands 60px below where it would otherwise, the
banner's bottom 300px is covered, and the 60px difference is the sliver of
photograph still visible above the panel card. The banner's `overflow:visible`
plus `z-index:20` keep the heading painting above the wrapper; the panel's own
`z-index:30` then puts the card above both.

Inside the wrapper, a blurred mirror of the same photograph fills the gutter
around the panel card:

```
pointer-events:none;position:absolute;inset:0;overflow:hidden;border-radius:12px
  > position:absolute;inset:0;top:-25%;height:150%;transform:scaleY(-1);filter:blur(40px)
      > <img> width:100%;height:100%;object-fit:cover
```

`scaleY(-1)` flips it, so the bottom of the banner photo mirrors into the top of
the gutter and the seam reads as a reflection rather than a repeat. **Decorative
— `alt=""`, and it must not be a second network request:** it is the same file as
the banner, so the browser serves it from cache. Use the same `next/image` src.

**L5 — the panel card**, `class="canvas-botanical"`:

```
position:relative;z-index:30;display:flex;flex-direction:column;
background:var(--pf-surface-300) [--color-pf-surface-300];border-radius:12px;
padding:48px 48px 48px
```

### 1.3 `canvas-botanical`

This class is **not** authored in the artboard's `<style>` block, which is why a
`grep` of the artboard finds only call sites. It ships in the design system at
`_ds/bramble-design-system-<id>/tokens/effects.css:52–83` and is already ported
into `styles/base.css:314–337`. The artwork is `/images/canvas-botanical.jpg`,
which the repo ships and which the design-system readme lists under "Missing
assets" — so the artboard renders it and the design system does not. Ours does.

```css
.canvas-botanical { position: relative; }
.canvas-botanical::after {
  content: "";
  position: absolute;
  inset: 0 0 0 auto;
  width: 420px;
  max-width: 45%;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: multiply;
  background-image: url("/images/canvas-botanical.jpg");
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: right top;
  mask-image: linear-gradient(to left, #000 0%, #000 45%, transparent 100%);
}
.canvas-botanical > * { position: relative; z-index: 1; }
```

Three properties do the work and none of them is optional:

- `background-size: auto 100%` scales by **height**, so there is no tile seam
  and no horizontal stretch whatever the panel's height turns out to be.
- `mix-blend-mode: multiply` at `opacity:.5` **darkens** the beige rather than
  laying a second surface on top of it. This is what keeps it reading as the
  canvas and not as a very large card.
- the left mask (`#000` to 45%, then a ramp to transparent at the far left)
  means the panel never draws an edge of its own.

**Consequence this section is the first to hit:** because it multiplies, the
`--color-pf-surface-300` behind anything in the right 420px of the panel is no
longer `#F8F7F2`. Measured, it runs down to `#EBEAE3` under wide headings and
`#F5F3ED` under the `Premium proposals` eyebrow. That is a real contrast problem
for `--color-eyebrow`, whose headroom RULINGS already warns is thin. See §8.3.

`z-index:0` on `::after` and `z-index:1` on `> *` mean the wash sits behind every
card in the panel, so no card content is ever composited through it — only the
panel's own directly-parented text is.

### 1.4 Heading level  **[Designer decision]**

The artboard sets all three chapter headings as `<h1 class="pf-h1">`, giving the
page four `<h1>`s (hero plus three chapters) and then jumping straight to `<h3>`
for the panel sub-heads. Per RULINGS §03/04 ruling 8 — *fix the semantics, keep
the visuals* — the chapter heading ships as `<h2 class="display display-1">` and
the three panel sub-heads as `<h3 class="display display-3">`. Type size and
heading level are independent; that is what `.display-*` is for. The rendered
pixels are unchanged.

`.pf-h1` / `.pf-h3` map exactly onto the existing scale — verified value by
value:

| Artboard | Ours |
|---|---|
| `.pf-h1` 2.75rem/1.14/-0.01em, 4rem ≥768, 4.75rem ≥1024 | `.display .display-1` |
| `.pf-h3` 1.5rem/1.2/-0.018em, 1.75rem ≥768 | `.display .display-3` |
| `font-variation-settings:"wght" 420,"SOFT" 100,"WONK" 0,"opsz" 10` | `.display` ≥1024px branch |

At 1440px the chapter heading computes to **76px**. No local override class is
needed.

---

## 2. Panel A — the take-off demo

The wide panel across the top of the card. `padding-bottom:40px`, and inside it
a centred column: `position:relative;display:flex;flex-direction:column;
align-items:center;gap:14px`.

### 2.1 Copy block

`display:flex;flex-direction:column;gap:6px;align-items:center;text-align:center`.

**Eyebrow** — `data-anim="up-blur" data-duration="0.5"`:

```
margin-bottom:4px;font-size:12px;font-weight:800;letter-spacing:.14em;
text-transform:uppercase;color:var(--pf-lime-500)
```

> START HERE - ESTIMATING & QUOTING

`--pf-lime-500` is the artboard's inverted name for the dark olive `#95B225`,
which measures **2.26:1** and fails. Use **`--color-eyebrow`** — with the
qualification in §8.3 for the third eyebrow, which sits on the botanical wash.

The copy is set with a spaced hyphen where the page's other eyebrows use none.
Client copy; flag, do not edit (§9, D14).

**Heading** — `data-anim="up-blur" data-delay="0.05" data-duration="0.5"`,
`.pf-h3` [`display display-3`], `color:var(--pf-ink-900)`:

> Build a client-ready estimate in minutes, not your nights.

**Body** — `data-anim="up-blur" data-delay="0.1" data-duration="0.5"`,
`margin-top:6px;max-width:60ch;font-size:18px;color:var(--pf-ink-900)`:

> Bramble's AI measures your job off the plan, prices it from your own materials
> & suppliers - then and rewrites it ready for your client. **You just add your
> margin.**

The final sentence is wrapped `<b><i><span style="font-weight:normal;
font-style:normal">…</span></i></b>` — a bold-italic pair whose own child cancels
both, so it renders as plain body text. Reproduce the rendered result (plain
text, one `<span>` or none) and drop the inert wrapper. `then and rewrites it`
is a copy error; flag, do not edit (§9, D13).

`60ch` at 18px Nunito Sans is ~1046px, wider than the 1000px card below it, so
the cap never bites at 1440px. Keep it — it is what stops the paragraph running
the full 1184px panel at wider windows.

### 2.2 The two-pane card

Wrapper: `data-anim="scale" data-duration="0.5"`,
`display:flex;width:100%;max-width:1000px;margin-inline:auto;flex-direction:column;
align-items:center`.

Card, `class="pf-shadow-border-strong tk-grid"` [`.shadow-border-strong`]:

```
display:grid;width:100%;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);
align-items:start;overflow:hidden;border-radius:12px;background:#fff
```

At the 1000px cap that is **560px / 440px**. `align-items:start` is what lets the
left pane end above the right pane's footer rather than stretching.

```css
@media (max-width:1150px){ .tk-grid{ grid-template-columns:minmax(0,1fr)!important } }
```

Dead in our build: this component is `hidden desk:block`, so it never renders
below 1024px and the query can only fire between 1024 and 1150px — where the
1000px cap already applies and the artboard's own composition is unchanged.
Record it here and ship the two-column grid flat, per RULINGS §03/04 ruling 15
(the `.pf-mq` precedent).

### 2.3 Left pane — the site-plan canvas

Pane:

```
position:relative;min-width:0;align-self:start;display:flex;flex-direction:column;
background:var(--color-well,#F6F4EC) [--color-well];
border-right:1px solid var(--color-border,#DFD8C8) [--color-hairline];
border-bottom:1px solid var(--color-border,#DFD8C8);
border-bottom-right-radius:12px
```

The bottom-right radius on a pane that already sits inside a `overflow:hidden`
12px card is the detail that makes the left pane read as a tile rather than a
column: it rounds the *inner* corner where the two panes meet the card's bottom
edge. Keep it.

**Header strip.** `display:flex;align-items:center;justify-content:space-between;
gap:10px;border-bottom:1px solid var(--color-border);background:#fff;padding:10px 14px`.

Label — `font-family:var(--font-sans)` [`--font-ui`]`;font-size:11.5px;
font-weight:600;letter-spacing:.1em;text-transform:uppercase;
color:var(--color-slate-700,#35402F)`, with a leading 14×14 Lucide `Ruler`
(`stroke="var(--color-forest-500,#4D8F6C)"`, `stroke-width:2`, round caps and
joins) — the artboard inlines the exact `Ruler` path set, so use the Lucide
component:

> Take-off — Henderson, 14 Ridge St

Uses an em dash, which `docs/brand.md` bans outright. Flag (§9, D14). `14 Ridge
St` is `TAKEOFF.address`.

**Timer chip.** `display:inline-grid;place-items:center;border-radius:6px;
background:var(--color-forest-900,#15301F);padding:4px 9px`, containing five
`<span class="tk tk-lin">` all at `grid-area:1/1` — superimposed, so the chip
never resizes as the number changes:

| span | `animation-name` | text |
|---|---|---|
| 1 | `tk-c1` | `0:04` |
| 2 | `tk-c2` | `0:22` |
| 3 | `tk-c3` | `0:51` |
| 4 | `tk-c4` | `1:28` |
| 5 | `tk-c5` | `2:14` |

Each: `font-family:var(--font-sans);font-size:12px;font-weight:700;
font-variant-numeric:tabular-nums;color:#fff`. The last, `2:14`, is
`TAKEOFF.elapsed` with the `m`/`s` stripped — reference it, do not retype it, and
note in the component that the chip and the "Quote ready" bar must always agree.

**Plan frame.** `position:relative;padding:16px`, then

```
position:relative;overflow:hidden;border-radius:8px;background:#FAFAFA;
box-shadow:0 0 0 1px var(--color-slate-100,#E5E8E5)
```

and inside that the aspect box:

```
position:relative;width:100%;aspect-ratio:1467/1072
```

**`aspect-ratio:1467/1072`** is the plan image's native pixel ratio (1.3685…).
Do not round it to 4/3 or 1.37 — it is what keeps `object-fit:contain` from
leaving letterbox bars that the two cover rectangles' percentage positions would
then be wrong against.

The image: `<img src="/images/takeoff-plan.webp" alt="…">`,
`position:absolute;inset:0;width:100%;height:100%;object-fit:contain`. Its `alt`
is superseded by §8's `role="img"` treatment.

**The two reveal covers**, `<span class="tk" aria-hidden="true">` — each is a
flat `#FAFAFA` rectangle matching the plan's own paper tone, sitting over a
measurement annotation and lifting off to reveal it:

| | `animation-name` | `left` | `top` | `width` | `height` |
|---|---|---|---|---|---|
| Cover 1 | `tk-cover1` | `70.48%` | `24.16%` | `21.40%` | `10.91%` |
| Cover 2 | `tk-cover2` | `60.26%` | `57.56%` | `31.63%` | `12.97%` |

All four values on each are percentages of the aspect box, which is why the
`aspect-ratio` above cannot drift. `background:#FAFAFA` matches the frame's own
`#FAFAFA`, so a cover is invisible except for what it hides.

**The scan sweep**, `<span class="tk tk-lin" aria-hidden="true">`:

```
animation-name:tk-scan;position:absolute;inset-inline:0;top:0;height:16%;
background:linear-gradient(to bottom,transparent,
  color-mix(in oklab,#C8E84A 44%,transparent),transparent)
```

A 16%-tall lime band, transparent at both edges, that travels down the plan. See
§3.4 for the defect in how far it actually travels.

### 2.4 Right pane — the priced lines

Pane: `display:flex;min-width:0;flex-direction:column;padding:0 0 14px`.

Header strip: `display:flex;align-items:center;justify-content:space-between;
gap:10px;border-bottom:1px solid var(--color-border);padding:10px 16px` —
note **no `background:#fff`**, unlike the left pane's header, because the card
is already white here. Label, same 11.5px/600/.1em uppercase slate-700:

> Priced from your library

Rows container: `display:flex;flex:1;flex-direction:column;padding:2px 16px 0`.

### 2.5 Row styling, verbatim

```css
.tk-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 2px;
  border-top: 1px solid color-mix(in oklab, var(--color-border, #DFD8C8) 40%, transparent);
}
.tk-qty {
  flex: none;
  width: 58px;
  text-align: right;
  font-family: var(--font-sans);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--color-slate-700, #35402F);
}
.tk-tot {
  flex: none;
  width: 66px;
  text-align: right;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink, #16321E);
}
```

`--font-sans` → `--font-ui` (Hanken Grotesk), `--font-serif` → `--font-ui-serif`
(Source Serif 4). These panels are product-UI depictions, so the product faces
are correct — §02 ruling 7 and the client's own font decision both settle this.

The fixed **58px** and **66px** columns plus `tabular-nums` are what keep the
money right-aligned as rows arrive one at a time. Do not replace them with a
grid; the rows animate independently and a grid would make them move together.

Row body, per row:

```
<span style="display:flex;min-width:0;flex:1;flex-direction:column;gap:2px">
  <span style="font-family:var(--font-sans);font-size:14px;line-height:1.3;
               color:var(--color-charcoal-900,#1D2A20)">{label}</span>
  <span style="font-family:var(--font-sans);font-size:11.5px;line-height:1.35;
               color:var(--color-slate-400,#8A9082)">{spec} · {supplier}<br>{rate}</span>
</span>
<span class="tk-qty">{qty}</span>
<span class="tk-tot">{amount}</span>
```

### 2.6 The four rows, verbatim

| # | `animation-name` | Label | Spec · Supplier | Rate | Qty | Total |
|---|---|---|---|---|---|---|
| 1 | `tk-row1` | Paving | Sawn bluestone 400×400 · Flagstone Supply | $78.40 / m² | 48 m² | $3,763 |
| 2 | `tk-row2` | Stepping pavers | Bluestone treads on pebble · Flagstone Supply | $96.00 / m² | 14 m² | $1,344 |
| 3 | `tk-row3` | Pool coping | Bullnose limestone · Stoneworks Co | $142 / lm | 18 lm | $2,556 |
| 4 | `tk-row4` | Screen planting | Advanced 200mm · Greenline Nursery | $188 / lm | 26 lm | $4,888 |

The `×` in `400×400` is U+00D7, not the letter x. The `·` separators are U+00B7.
The `²` is U+00B2.

**The arithmetic reconciles, which is unusual for this page and worth stating:**
48 × 78.40 = 3,763.20 → $3,763; 14 × 96 = 1,344; 18 × 142 = 2,556; 26 × 188 =
4,888. The four total **$12,551** = `TAKEOFF.cost`; 24% of that is $3,012.24 →
$3,012 = `TAKEOFF.margin`; the sum is **$15,563** = `TAKEOFF.total`. Any copy
change to a rate or a quantity breaks three other numbers.

Add to `content/home.ts`, beside `TAKEOFF`:

```ts
/** The four priced lines in the take-off demo. They sum to TAKEOFF.cost. */
export const TAKEOFF_LINES = [
  { label: "Paving",          spec: "Sawn bluestone 400×400",    supplier: "Flagstone Supply",  rate: "$78.40 / m²", qty: "48 m²", amount: "$3,763" },
  { label: "Stepping pavers", spec: "Bluestone treads on pebble", supplier: "Flagstone Supply",  rate: "$96.00 / m²", qty: "14 m²", amount: "$1,344" },
  { label: "Pool coping",     spec: "Bullnose limestone",         supplier: "Stoneworks Co",     rate: "$142 / lm",   qty: "18 lm", amount: "$2,556" },
  { label: "Screen planting", spec: "Advanced 200mm",             supplier: "Greenline Nursery", rate: "$188 / lm",   qty: "26 lm", amount: "$4,888" },
] as const;

/** The elapsed-time chips the take-off timer counts through. Last = TAKEOFF.elapsed. */
export const TAKEOFF_CLOCK = ["0:04", "0:22", "0:51", "1:28", "2:14"] as const;
```

Mobile shortens the spec strings (§6.3) — hence `spec` and `supplier` as separate
fields rather than one pre-joined line.

### 2.7 Totals block

`<div class="tk" style="animation-name:tk-total">`:

```
margin:12px 16px 0;display:flex;flex-direction:column;gap:9px;border-radius:8px;
background:var(--color-well,#F6F4EC);padding:13px 14px
```

Three rows, each `display:flex;align-items:baseline;justify-content:space-between;gap:10px`:

| Label | Label style | Value | Value style |
|---|---|---|---|
| `Cost` | `--font-sans` 13px, `--color-slate-500` | `$12,551` | `--font-sans` 13.5px, tabular, `--color-slate-700` |
| `Your margin · 24%` | same | `$3,012` | same |
| `Quote total` | `--font-serif` 600 16px, `--color-ink` | `$15,563` | `--font-serif` 600 20px, tabular, `--color-ink` |

The third row additionally carries
`border-top:1px solid var(--color-border,#DFD8C8);padding-top:9px`.

All five figures are `TAKEOFF.cost`, `TAKEOFF.margin`, `QUOTE.margin` and
`TAKEOFF.total`. The two slate-500 labels fail contrast — §8.3.

### 2.8 The "Quote ready" bar

`<div class="tk" style="animation-name:tk-ready">`:

```
margin:12px 16px 0;display:flex;align-items:center;gap:9px;border-radius:8px;
background:var(--color-lime-500,#C8E84A);padding:10px 13px
```

- Lucide `Check`, 15×15, `stroke="var(--color-forest-900,#15301F)"`,
  `stroke-width:3.2`, round caps and joins, `flex:none`.
- `Quote ready` — `min-width:0;flex:1;--font-sans;13.5px;700;--color-forest-900`.
- `2m 14s` — `flex:none;--font-sans;12.5px;700;tabular-nums;--color-forest-900`.
  This is `TAKEOFF.elapsed`, and it must agree with the fifth timer chip.

**Lime here is correct under `docs/brand.md`**, not an exception: this is a
live/complete-moment marker on an AI surface, which is one of lime's four
sanctioned roles. Note that "completed is forest, never lime" applies to
*selected/completed states in the app*; this is a marketing depiction of a
just-finished moment and the artboard draws it as the section's one lime fill.
**Measured at 10.27:1** — see §8.3. No change.

---

## 3. The 15-second `tk-*` system

### 3.1 The driver

```css
.tk {
  animation-duration: 15s;
  animation-timing-function: cubic-bezier(.19, 1, .22, 1);
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}
.tk-lin { animation-timing-function: linear; }
```

`.tk` carries everything **except** `animation-name`, which every call site
supplies inline. There are **no `animation-delay`s anywhere in this system** —
the entire choreography is expressed as percentage offsets inside sixteen
keyframe blocks on one shared 15s clock. That is the single most important fact
about it: freeze one animation and you have frozen all of them, and
`currentTime` is cycle time with no per-element correction (unlike §05).

`.tk-lin` overrides the easing to `linear` on exactly two kinds of element: the
five timer chips (a clock should tick evenly) and the scan sweep (a scanner
should travel evenly). Everything else uses the expo-out curve.

**1% of this cycle is 150ms.** Every figure below is derived from that.

### 3.2 Every effective keyframe, verbatim

Scan and covers:

```css
@keyframes tk-scan{0%,3%{opacity:0;transform:translateY(-8%)}8%{opacity:1}58%{opacity:1;transform:translateY(104%)}64%,100%{opacity:0;transform:translateY(104%)}}
@keyframes tk-cover1{0%,12%{opacity:1}18%,96%{opacity:0}100%{opacity:1}}
@keyframes tk-cover2{0%,26%{opacity:1}32%,96%{opacity:0}100%{opacity:1}}
```

Timer chips:

```css
@keyframes tk-c1{0%,3%{opacity:0}5%,17%{opacity:1}20%,100%{opacity:0}}
@keyframes tk-c2{0%,18%{opacity:0}21%,30%{opacity:1}34%,100%{opacity:0}}
@keyframes tk-c3{0%,32%{opacity:0}35%,44%{opacity:1}48%,100%{opacity:0}}
@keyframes tk-c4{0%,46%{opacity:0}49%,58%{opacity:1}62%,100%{opacity:0}}
@keyframes tk-c5{0%,60%{opacity:0}63%,96%{opacity:1}100%{opacity:0}}
```

Priced rows:

```css
@keyframes tk-row1{0%,12%{opacity:0;transform:translateX(14px)}18%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0;transform:translateX(14px)}}
@keyframes tk-row2{0%,26%{opacity:0;transform:translateX(14px)}32%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0;transform:translateX(14px)}}
@keyframes tk-row3{0%,40%{opacity:0;transform:translateX(14px)}46%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0;transform:translateX(14px)}}
@keyframes tk-row4{0%,53%{opacity:0;transform:translateX(14px)}59%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0;transform:translateX(14px)}}
```

Totals and the ready bar:

```css
@keyframes tk-total{0%,62%{opacity:0;transform:translateY(9px)}69%,94%{opacity:1;transform:translateY(0)}99%,100%{opacity:0;transform:translateY(9px)}}
@keyframes tk-ready{0%,64%{opacity:0;transform:scale(.86)}70%{opacity:1;transform:scale(1.1)}75%,94%{opacity:1;transform:scale(1)}99%,100%{opacity:0;transform:scale(1)}}
```

### 3.3 Declared but unused

Eight keyframe blocks are declared and applied to nothing in the artboard.
`grep` confirms exactly one occurrence of each name — the declaration itself:

```css
@keyframes tk-pop1{0%,11%{opacity:0;transform:translateY(5px) scale(.9)}16%,94%{opacity:1;transform:translateY(0) scale(1)}99%,100%{opacity:0;transform:translateY(0) scale(1)}}
@keyframes tk-pop2{0%,25%{…}30%,94%{…}99%,100%{…}}
@keyframes tk-pop3{0%,39%{…}44%,94%{…}99%,100%{…}}
@keyframes tk-pop4{0%,52%{…}57%,94%{…}99%,100%{…}}
@keyframes tk-fill1{0%,10%{opacity:0}17%,94%{opacity:1}100%{opacity:0}}
@keyframes tk-fill2{0%,24%{opacity:0}31%,94%{opacity:1}100%{opacity:0}}
@keyframes tk-fill3{0%,38%{opacity:0}45%,94%{opacity:1}100%{opacity:0}}
@keyframes tk-fill4{0%,51%{opacity:0}58%,94%{opacity:1}100%{opacity:0}}
```

Their phasing tells you what the demo used to be: `tk-popN` fires **one point
before** `tk-rowN` and `tk-fillN` **two points before** it, so each priced row
was once preceded by a measurement badge popping onto the plan and a polygon
fill washing over the measured area. Four measurements, four fills, four rows.
The current artboard keeps only two of the four plan reveals — the covers — and
drives them with a different mechanism.

**Drop all eight** as dead code, same call as §05's `pf-clock-late` / `pg-still`
/ `pf-done-rest`. Record here that they exist so nobody "restores" them: the
artboard is the acceptance test and the artboard does not draw them.

### 3.4 The choreography, in plain terms

At 150ms per percentage point, this is what an engineer should see:

| Cycle time | % | What happens |
|---|---|---|
| 0 ms | 0 | Everything is at its start state. The plan is on screen with both annotations covered. The chip is blank, the right pane is empty except its two header strips. |
| 450 ms | 3 | The lime scan band starts fading in at the top of the plan and starts moving. `0:04` starts fading in. |
| 750 ms | 5 | `0:04` at full opacity. |
| 1200 ms | 8 | Scan band at full opacity, travelling. |
| **1800 ms** | **12** | Cover 1 starts lifting **and** row 1 starts sliding in from the right. This pairing is the whole point of the demo — *the measurement appears on the plan at the same moment its priced line appears in the list.* |
| 2550 ms | 17 | `0:04` starts fading out. |
| **2700 ms** | **18** | Cover 1 fully gone, row 1 fully landed at `translateX(0)`. |
| 3150 ms | 21 | `0:22` at full opacity. The chip is blank between 3000 and 3150ms. |
| **3900 ms** | **26** | Cover 2 lifts, row 2 slides in. Second pairing. |
| **4800 ms** | **32** | Both complete. `0:22` gone. |
| 5250 ms | 35 | `0:51`. |
| 6000 ms | 40 | Row 3 starts. No plan reveal accompanies it. |
| 6600 ms | 44 | `0:51` starts fading. |
| 6900 ms | 46 | Row 3 landed. |
| 7350 ms | 49 | `1:28`. |
| 7950 ms | 53 | Row 4 starts. |
| **8700 ms** | **58** | Row 4 landed; the scan band reaches its end point and starts fading; `1:28` starts fading. Three things land together — this is the beat that says "measuring is finished". |
| 9300 ms | 62 | The totals block starts rising (9px) and fading in. |
| 9450 ms | 63 | `2:14` at full opacity. It holds for the rest of the cycle. |
| 9600 ms | 64 | Scan band fully gone. The `Quote ready` bar starts, from `scale(.86)`. |
| 10350 ms | 69 | Totals fully up. |
| **10500 ms** | **70** | `Quote ready` hits `scale(1.1)` — the single overshoot in the whole system. |
| 11250 ms | 75 | Settled at `scale(1)`. The composition is now complete and holds. |
| **14100 ms** | **94** | The hold ends. Rows, totals and the ready bar begin fading out together. |
| 14400 ms | 96 | Covers begin fading back in; `2:14` fades out. |
| 14850 ms | 99 | Rows/totals/ready at opacity 0, transforms reset to their start values. |
| 15000 ms | 100 | Covers fully opaque again. Loop restarts. |

**How to tell it is wrong.** Four checks, in order of how visible the failure is:

1. **A cover lifts without its row arriving, or vice versa.** Cover 1/row 1 and
   cover 2/row 2 share their exact percentages. If they drift apart the demo
   stops making its argument.
2. **Two timer chips visible at once.** Every handover has a gap
   (17→21, 30→35, 44→49, 58→63), so the chip is blank for 450–750ms between
   numbers and *never* shows two. If you see two, either the chips are not all
   at `grid-area:1/1` or the reduced-motion block has leaked (§3.6, D1).
3. **The exit is not simultaneous.** Everything with a `94%` stop leaves
   together. Any stagger on the way out is a bug.
4. **The chip disagrees with the bar.** `2:14` appears at 9450ms and the bar
   says `2m 14s` from 9600ms. They must be the same figure.

### 3.5 The scan sweep does not sweep  **[flag — §9, D1]**

`tk-scan` ends at `translateY(104%)`. `translateY` on a percentage resolves
against the **element's own height**, and the band is `height:16%` of the plan
box. So it travels 104% × 16% = **16.6% of the plan's height**, finishing with
its bottom edge at 32.6% — a third of the way down. It never passes cover 2
(top 57.56%), which it is plainly meant to reveal.

The correct value is **`525%`**: the band starts at `top:0`, so to put its bottom
edge on the plan's bottom edge it must travel `(100 − 16) / 16 = 5.25` of its own
height. The mobile artboard writes **`560%`** for the same element — very close
to 525, slightly overshooting so the band exits cleanly off the bottom. Mobile
has the intent right and desktop has a typo.

This is a mis-stepped animation, which RULINGS principle 2 classes as a bug
rather than an authoring choice, and the mobile artboard supplies the evidence of
intent. **Recommendation: fix to `560%`, matching mobile**, so the two
breakpoints run one number. Flagged here rather than fixed unilaterally because
it is the one change in this section that is visible in a static screenshot at
`t` between 1.2s and 8.7s, and therefore the one that will show up in the visual
diff. Needs a ruling.

### 3.6 Reduced motion  **[Designer decision]**

The artboard's own block is broken in exactly the way §05's was:

```css
@media(prefers-reduced-motion:reduce){
  .tk{animation:none!important;opacity:1!important;transform:none!important;stroke-dashoffset:0!important}
}
```

`.tk` sits on four different kinds of element, and `opacity:1!important` is wrong
for two of them:

- **Both cover rectangles become permanently visible**, so the plan renders with
  its two measurements hidden behind grey boxes — the opposite of the finished
  state.
- **All five timer chips render superimposed** at `grid-area:1/1`, so the chip
  shows `0:04`/`0:22`/`0:51`/`1:28`/`2:14` printed on top of each other.
- **The scan band is pinned visible** at `transform:none`, i.e. a lime bar lying
  across the top 16% of the plan.

`stroke-dashoffset:0` applies to nothing in this section — there is no dashed
SVG stroke under a `.tk` element. Drop it.

The replacement pins the system to **`t = 11250ms` (75%)**, the first frame of
the long hold: everything has arrived, the ready bar has settled out of its
overshoot, the covers are lifted, the scan is gone, and the chip reads `2:14`.
That frame holds for 2850ms live, it is the state the section argues for, and —
critically — it is the same composition the mobile artboard draws statically, so
the two breakpoints agree.

`styles/motion/takeoff.css`:

```css
/* The resting state, as every file in this directory ends with.

   Pinned to t = 11250ms (75% of the 15s cycle): the first frame of the long
   hold, with every row landed, the totals up, the ready bar settled out of its
   1.1 overshoot, both covers lifted, the scan band gone and the clock on 2:14.

   The artboard's own block cannot be ported: it puts opacity:1!important on
   .tk, which sits on the covers, the scan band and all five clock spans as well
   as on the rows. That renders both measurements hidden, a lime bar across the
   plan, and five superimposed timestamps. Same class of defect as RULINGS §05
   ruling 3. */
@media (prefers-reduced-motion: reduce) {
  .tk {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  /* The two reveal covers have lifted and the scan has finished. */
  .tk-cover,
  .tk-scan {
    opacity: 0 !important;
  }

  /* One clock reading, the last one, matching the "2m 14s" on the ready bar. */
  .tk-clock {
    opacity: 0 !important;
  }
  .tk-clock:last-child {
    opacity: 1 !important;
  }
}
```

This requires three class hooks the artboard does not have — `.tk-cover`,
`.tk-scan`, `.tk-clock` — because the artboard distinguishes these elements only
by their inline `animation-name`. Add them; selecting on `[style*="tk-cover"]`
(which is what the mobile artboard resorts to) is brittle and does not survive
the move to CSS modules or a `style` prop.

---

## 4. Panel B — the price library

Left cell of the split grid below the wide panel.

### 4.1 The split

A 1px `var(--pf-ink-200)` [`--color-pf-ink-200`] rule across the panel, then:

```
display:grid;grid-template-columns:1fr 1px 1fr;gap:48px
```

The middle track is a bare `<div style="background:var(--pf-ink-200)">` — a 1px
grid column used as a vertical rule, which stretches to the taller of the two
cells for free. Both content cells carry `min-width:0;padding-top:48px`.

Because of the `gap:48px` on both sides of a 1px track, the visual gutter is
**97px**, not 48.

### 4.2 Copy block

`display:flex;flex-direction:column;gap:24px` > `display:flex;flex-direction:column;gap:6px`.

Eyebrow (same 12px/800/.14em uppercase recipe as §2.1):

> Your price library

Heading, `.pf-h3` [`display display-3`]:

> Bramble learns your real prices.

Body, `margin-top:6px;max-width:48ch;font-size:14px;color:var(--pf-ink-900)` —
note **14px here, against 18px in the wide panel**:

> Bramble learns your materials, labour rates and margins from your own files, so
> every line is priced on what the job actually costs you. No more finding out at
> the end that you quoted it too cheap.

### 4.3 The card

Fixed-height container: `height:384px;width:100%`. Inner `#pf-prices`,
`data-anim="scale" data-duration="0.5"`:

```
display:flex;height:100%;width:100%;flex-direction:column;align-items:center;
font-family:var(--font-sans)
```

Card, `.pf-shadow-border-strong` [`.shadow-border-strong`]:

```
position:relative;display:flex;width:100%;max-width:360px;flex:1;min-height:0;
flex-direction:column;overflow:hidden;border-radius:12px;
background:var(--color-forest-900,#15301F)
```

Photograph `/images/photo-2.webp` at `position:absolute;inset:0;width:100%;
height:100%;object-fit:cover`, then a three-stop scrim,
`<span aria-hidden="true" style="position:absolute;inset:0">`:

```
linear-gradient(to bottom,
  color-mix(in oklab,#15301F 74%,transparent) 0%,
  color-mix(in oklab,#15301F 84%,transparent) 55%,
  color-mix(in oklab,#15301F 94%,transparent) 100%)
```

It gets **darker downwards**, which is the reverse of the usual and is
deliberate: the file rows are at the bottom and they are white cards that need a
dark field behind them.

Content column: `position:relative;display:flex;flex:1;min-height:0;
flex-direction:column`, then the padded area `padding:14px` with the same flex
chain.

### 4.4 The drop zone

`<div class="pf-drop-zoneBox">`, with its animation written **inline** rather
than in the stylesheet — the only element in the system that does:

```
animation:pf-drop-zone 12s ease-in-out infinite both;
display:flex;align-items:center;justify-content:center;gap:9px;border-radius:8px;
border:1.5px dashed color-mix(in oklab,#E8E4D2 42%,transparent);
background:color-mix(in oklab,#15301F 22%,transparent);
backdrop-filter:blur(6px);padding:14px 12px
```

`ease-in-out`, not the expo curve — the only element here that uses it.

- Lucide `Upload`, 17×17, `stroke="var(--color-lime-500,#C8E84A)"`,
  `stroke-width:2`.
- `font-family:var(--font-sans);font-size:13px;font-weight:600;color:#fff`:

  > Old quotes, Excel pricelists, photos of notes, supplier emails.

  The only full stop on a label in this card. Client copy; leave it.

`border-radius:8px` on an upload zone is off `docs/brand.md`'s "12 … upload
zones" guidance. Ship as drawn, log (§9, D10).

### 4.5 The four file rows

Container: `display:flex;flex:1;min-height:0;flex-direction:column;
justify-content:center;gap:8px;padding:18px 0 2px`.

Each `<div class="pf-drop-item">` carries three custom properties and a delay:

| # | `--dx` | `--dy` | `--dr` | `animation-delay` | Icon | Filename | Type label |
|---|---|---|---|---|---|---|---|
| 1 | `96px` | `14px` | `8deg` | `0s` | Lucide `File`, 17×17, `#96602B` on `color-mix(in oklab,#96602B 15%,#fff)` | `Laurence_Quote_Mar.pdf` | `PDF` |
| 2 | `-96px` | `14px` | `-7deg` | `.5s` | Lucide `Table`-style grid, 17×17, `#2C5539` on `color-mix(in oklab,#4D8F6C 15%,#fff)` | `Flagstone pricelist.xlsx` | `Excel` |
| 3 | `96px` | `14px` | `6deg` | `1s` | `/images/photo-1.webp` thumbnail on `var(--color-card-muted,#E6E0CC)` | `Photo of last season’s quote` | `Photo` |
| 4 | `-96px` | `14px` | `-9deg` | `1.5s` | `/images/photo-4.webp` thumbnail on `--color-card-muted` | `Handwritten site notes` | `Photo` |

`--dx` alternates sign so the files fly in from alternating sides; `--dr`
alternates with it and its magnitude varies 6–9° so the four do not look
stamped. `--dy` is a constant `14px` on all four — they come from slightly
*below*, not above.

Row shell, identical on all four:

```
display:flex;align-items:center;gap:11px;border-radius:8px;
background:rgba(255,255,255,.95);padding:9px 11px;
box-shadow:0 8px 20px -12px rgba(21,48,31,.5)
```

`rgba(255,255,255,.95)` over the dark scrim resolves to a measured **`#F4F5F4`** —
not white. That 5% matters for §8.3.

Icon tile on rows 1–2: `display:grid;place-items:center;flex:none;height:36px;
width:36px;border-radius:6px`. On rows 3–4 the same box with
`overflow:hidden` and an `<img …object-fit:cover>` instead.

Text column: `display:flex;min-width:0;flex:1;flex-direction:column;gap:5px`.

Top line: `display:flex;min-width:0;align-items:baseline;
justify-content:space-between;gap:10px`.

- Filename — `min-width:0;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;font-size:13px;font-weight:500;color:var(--color-ink,#16321E)`.
  Row 3's apostrophe is already curly (U+2019); keep it, and normalise anything
  else that is not.
- The **type → "Read" swap**, a two-child `inline-grid` at `grid-area:1/1` so the
  swap causes no layout shift:
  ```
  <span style="position:relative;flex:none;display:inline-grid">
    <span class="pf-drop-pct" style="animation-delay:…;grid-area:1/1;
          font-size:11.5px;color:var(--color-slate-500,#6E7669)">PDF</span>
    <span class="pf-drop-ok"  style="animation-delay:…;grid-area:1/1;
          display:inline-flex;align-items:center;gap:4px;font-size:11.5px;
          font-weight:600;color:var(--color-forest-700,#2C5539)">
      <Check 12×12 stroke=currentColor stroke-width=3.2 aria-hidden="true"/>Read
    </span>
  </span>
  ```
  `.pf-drop-pct` is named for a percentage it never shows — it holds the file
  *type*. Keep the behaviour, rename the class to `.file-type` in our build.
  `--color-forest-700` on the tick is correct under the brand rule: completed is
  forest, never lime.

- Progress track: `display:block;height:4px;width:100%;border-radius:9999px;
  background:var(--color-slate-100,#E5E8E5)` containing
  `<span class="pf-drop-fill" style="animation-delay:…;display:block;height:100%;
  width:0;border-radius:9999px;background:var(--color-lime-500,#C8E84A)">`.

  **The fill animates `width`, not `transform`.** It is a 4px bar 240px wide on
  four elements; the layout cost is negligible and a `scaleX` would distort the
  pill's round caps. Reproduce as drawn.

Add to `content/home.ts`:

```ts
/** The four files the price-library demo ingests. */
export const PRICE_FILES = [
  { name: "Laurence_Quote_Mar.pdf",         type: "PDF",   kind: "pdf" },
  { name: "Flagstone pricelist.xlsx",        type: "Excel", kind: "sheet" },
  { name: "Photo of last season’s quote",    type: "Photo", kind: "image", src: "/images/photo-1.webp" },
  { name: "Handwritten site notes",          type: "Photo", kind: "image", src: "/images/photo-4.webp" },
] as const;
```

### 4.6 The footer

`<div class="pf-drop-doneRow">`, animation inline again:

```
animation:pf-drop-done 12s cubic-bezier(.19,1,.22,1) infinite both;
position:relative;display:flex;align-items:center;gap:10px;
border-top:1px solid rgba(232,228,210,.16);
background:color-mix(in oklab,#15301F 88%,transparent);padding:12px 14px
```

- `<span class="pf-drop-tickIcon" aria-hidden="true">` —
  `animation:pf-drop-tick 12s cubic-bezier(.19,1,.22,1) infinite both;
  display:grid;place-items:center;flex:none;height:22px;width:22px;
  border-radius:9999px;background:var(--color-lime-500,#C8E84A)` with a 13×13
  Lucide `Check` at `stroke-width:3.5`, `stroke="var(--color-forest-900,#15301F)"`.
- `display:flex;min-width:0;flex:1;flex-direction:column;gap:1px`:
  - `Ready to quote` — `--font-serif` [`--font-ui-serif`] 600 15px,
    `line-height:1.2;white-space:nowrap;color:#fff`.
  - `<span class="pf-drop-countUp" style="animation:pf-drop-count 12s linear
    infinite both">248 materials learned</span>` — `--font-sans` 11.5px,
    `line-height:1.3`, `color:var(--color-forest-300,#8FA886)`. `248` is
    `TAKEOFF.materialsLearned`.

The class is called `countUp` but nothing counts — the number is static and
`pf-drop-count` is a pure fade. Keep the behaviour, rename the class
(`.ingest-count`), and note it so nobody adds a counter (§9, D11).

### 4.7 The 12-second `pf-drop-*` system, verbatim

```css
/* upload loop: 12s cycle, rests on Training complete */
@keyframes pf-drop-fly{
  0%,2%{opacity:0;transform:translate(var(--dx,40px),var(--dy,-58px)) rotate(var(--dr,7deg)) scale(.82)}
  9%{opacity:1}
  16%,88%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1)}
  96%,100%{opacity:0;transform:translate(0,6px) rotate(0deg) scale(.97)}
}
@keyframes pf-drop-bar{0%,14%{width:0}34%,100%{width:100%}}
@keyframes pf-drop-swap{0%,30%{opacity:0}38%,100%{opacity:1}}
@keyframes pf-drop-swapout{0%,30%{opacity:1}38%,100%{opacity:0}}
@keyframes pf-drop-done{0%,48%{opacity:0;transform:translateY(8px)}56%,90%{opacity:1;transform:translateY(0)}98%,100%{opacity:0;transform:translateY(8px)}}
@keyframes pf-drop-tick{0%,50%{transform:scale(.4);opacity:0}58%{transform:scale(1.18);opacity:1}64%,100%{transform:scale(1);opacity:1}}
@keyframes pf-drop-zone{0%,12%{border-color:color-mix(in oklab,#C8E84A 78%,transparent);background:color-mix(in oklab,#C8E84A 14%,transparent)}30%,100%{border-color:color-mix(in oklab,#E8E4D2 42%,transparent);background:color-mix(in oklab,#15301F 22%,transparent)}}
@keyframes pf-drop-count{0%,52%{opacity:0}60%,100%{opacity:1}}

.pf-drop-item{animation:pf-drop-fly 12s cubic-bezier(.19,1,.22,1) infinite both}
.pf-drop-fill{animation:pf-drop-bar 12s cubic-bezier(.4,0,.2,1) infinite both}
.pf-drop-pct {animation:pf-drop-swapout 12s linear infinite both}
.pf-drop-ok  {animation:pf-drop-swap 12s linear infinite both}
```

The comment "rests on Training complete" is left over from an earlier version;
no element in this card says "Training complete".

Four different easings in one system, all deliberate:

| Element | Easing | Why |
|---|---|---|
| `.pf-drop-item` | `cubic-bezier(.19,1,.22,1)` | expo-out: the file lands fast and settles |
| `.pf-drop-fill` | `cubic-bezier(.4,0,.2,1)` | standard: a progress bar should not overshoot its ease |
| `.pf-drop-pct` / `.pf-drop-ok` | `linear` | a crossfade should be even |
| `.pf-drop-zoneBox` | `ease-in-out` (inline) | the drop-zone glow breathes |
| `.pf-drop-doneRow` / `tickIcon` | `cubic-bezier(.19,1,.22,1)` (inline) | matches the items |

**1% of this cycle is 120ms.** With the per-item delays, the sequence reads:

| Wall time | What |
|---|---|
| 0 ms | Drop zone is lime-glowing (`#C8E84A` 78% border, 14% fill). File 1 is off-screen right and rotated. |
| 240 ms | File 1 starts flying in. |
| 740 / 1240 / 1740 ms | Files 2, 3, 4 start (their 2% stop plus 0.5/1/1.5s). |
| 1080 ms | File 1 at full opacity. |
| 1440 ms | Drop zone glow has fully decayed back to the neutral dashed border by 3600ms; the ramp starts here. |
| 1680 ms | File 1's progress bar starts filling. |
| 1920 ms | File 1 fully landed: `translate(0,0) rotate(0) scale(1)`. |
| 3420 ms | File 4 landed (1920 + 1500). All four cards are in place. |
| 3600 ms | File 1's `PDF` starts crossfading to `Read`. Bar completes at 4080ms — the label **leads the bar by 480ms**, which is the one beat in this system that is arguably backwards. |
| 5580 ms | File 4's bar full (4080 + 1500). |
| 5760 ms | The footer starts rising 8px and fading in. |
| 6000 ms | The tick starts at `scale(.4)`. |
| 6060 ms | File 4's label swap completes. |
| **6960 ms** | Tick overshoots to `scale(1.18)`. |
| 6720 → 7200 ms | Footer fully up; `248 materials learned` fades in (52→60%). |
| **7680 ms** | Tick settled at `scale(1)`. **The resting composition.** |
| 10560 ms | File 1 begins its exit; files 2–4 follow at +0.5s each. |
| 10800 ms | The footer begins its exit (90%). |
| 11520 ms | File 1 gone. |
| 11760 ms | Footer gone (98%). |
| 12000 ms | File 1 restarts — **while files 2, 3 and 4 are still exiting** (they finish at 12.02, 12.52, 13.02s). |

**The seam at 11.5–13.0s is real and is a choreography defect** (§9, D12): the
delays shift each item's phase but not the loop length, so the deck never clears
before it refills. Flag; fixing it means re-choreographing, which is a design
change.

### 4.8 Reduced motion  **[Designer decision]**

The artboard's block for this system is, unusually, almost correct:

```css
@media(prefers-reduced-motion:reduce){
  .pf-drop-item,.pf-drop-fill,.pf-drop-pct,.pf-drop-ok,.pf-drop-doneRow,.pf-drop-tickIcon,.pf-drop-zoneBox,.pf-drop-countUp{animation:none!important}
  .pf-drop-item{opacity:1!important;transform:none!important}
  .pf-drop-fill{width:100%!important}
  .pf-drop-pct{opacity:0!important}
  .pf-drop-doneRow{opacity:1!important;transform:none!important}
}
```

It pins the system to `t = 7680ms` — the same frame the live loop rests on. Two
gaps to close: `.pf-drop-ok` and `.pf-drop-countUp` are stopped but not pinned
(they fall back to their default `opacity:1`, which happens to be right, but
"happens to be right" is not a defined resting state and the harness diffs
against it), and `.pf-drop-tickIcon` likewise falls back to `transform:none`,
which is right. Make all of it explicit.

`styles/motion/ingest.css`:

```css
/* The resting state, as every file in this directory ends with.

   Pinned to t = 7680ms of the 12s cycle: all four files landed, all four bars
   full, all four labels swapped to "Read", the footer up and the tick settled
   out of its 1.18 overshoot. That is the frame the live loop itself rests on
   from 7680ms to 10560ms, and it is what the mobile artboard draws. */
@media (prefers-reduced-motion: reduce) {
  .ingest-item,
  .ingest-fill,
  .file-type,
  .file-read,
  .ingest-done,
  .ingest-tick,
  .ingest-zone,
  .ingest-count {
    animation: none !important;
  }

  .ingest-item,
  .ingest-done {
    opacity: 1 !important;
    transform: none !important;
  }
  .ingest-tick {
    opacity: 1 !important;
    transform: none !important;
  }
  .ingest-fill { width: 100% !important; }
  .file-type   { opacity: 0 !important; }
  .file-read,
  .ingest-count { opacity: 1 !important; }
}
```

The drop zone's resting border and background come from its own inline style,
which is already the neutral end of `pf-drop-zone` — so stopping the animation is
all it needs.

---

## 5. Panel C — the proposal card

Right cell of the split grid.

### 5.1 Copy block

Same recipe as §4.2. Eyebrow:

> Premium proposals

Heading, `.pf-h3` [`display display-3`]:

> Beautifully branded proposals, sent in minutes, not days.

Body, `margin-top:6px;max-width:48ch;font-size:14px;color:var(--pf-ink-900)`:

> Choose from a range of branded templates built by sales professionals. Your
> professionally designed quote lands same day while your competitors are still
> promising theirs.

### 5.2 The card

Container `min-height:384px;width:100%` — **`min-height` here where panel B uses
a fixed `height`**, because this card sizes to its five scope rows.
`#pf-stack`, `data-anim="up-blur" data-duration="0.6"` (up-blur, not scale, and
0.6s not 0.5s — panel C enters differently from panel B):

```
display:flex;min-height:384px;width:100%;align-items:center;justify-content:center;
font-family:var(--font-sans)
```

Card, `.pf-shadow-border-strong` [`.shadow-border-strong`]:

```
display:flex;width:100%;max-width:330px;flex-direction:column;overflow:hidden;
border-radius:12px;background:#fff
```

330px, against panel B's 360px.

### 5.3 Masthead

```
position:relative;overflow:hidden;padding:13px 14px 15px;
background:var(--color-forest-900,#15301F)
```

Photograph `/images/photo-1.webp`, `object-fit:cover`, then **the 24° scrim**:

```
position:absolute;inset:0;
background:linear-gradient(24deg,
  color-mix(in oklab,var(--color-forest-900,#15301F) 90%,transparent) 4%,
  color-mix(in oklab,var(--color-forest-900,#15301F) 42%,transparent) 52%,
  color-mix(in oklab,var(--color-forest-900,#15301F) 6%,transparent))
```

The one angled gradient in the section. `24deg` runs bottom-left → top-right, so
the heavy 90% end is at the **bottom left** (under `14 Beach Rd` and `Prepared
for…`) and the 6% end is at the **top right** — which is exactly where `LIC#
284119C` sits. That is the contrast problem in §8.3, and the angle is the cause.

Content, `position:relative`:

**Top row** — `display:flex;align-items:center;justify-content:space-between;
gap:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.22)`:

- `Laurence Landscapes` [`QUOTE.studio`] — `flex:none;--font-serif`
  [`--font-ui-serif`]`;font-weight:600;font-size:11.5px;letter-spacing:.16em;
  text-transform:uppercase;line-height:1;white-space:nowrap;color:#fff`.
  **No `text-shadow`** — the only masthead line without one.
- `LIC# 284119C` [`QUOTE.licence`] — `text-align:right;font-size:11.5px;
  line-height:1.5;color:var(--color-cream,#E8E4D2);
  text-shadow:0 1px 3px rgba(0,0,0,.55)`.

**Lower block** — `padding-top:12px`:

- `Q-1042 · Coogee` [`QUOTE.reference` · `QUOTE.suburb`] —
  `font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--color-cream,#E8E4D2);text-shadow:0 1px 3px rgba(0,0,0,.5)`.
- `14 Beach Rd` [`QUOTE.address`] — `margin-top:4px;--font-serif;font-weight:600;
  font-size:24px;line-height:.98;letter-spacing:-.01em;color:#fff;
  text-shadow:0 2px 18px rgba(0,0,0,.45)`. The 18px-blur shadow is a glow, not a
  drop shadow — it darkens the photograph immediately around the glyphs.
- `Prepared for Sarah Henderson` [`QUOTE.client`] — `margin-top:4px;
  font-size:12px;color:var(--color-cream,#E8E4D2);
  text-shadow:0 1px 3px rgba(0,0,0,.5)`.

### 5.4 Scope

Section label:

```
margin:12px 14px 0;padding-bottom:7px;
border-bottom:1.5px solid var(--color-forest-800,#1F4934);
font-size:12px;letter-spacing:.2em;text-transform:uppercase;
color:var(--color-slate-500,#6E7669)
```

> Scope

`1.5px` is the second of the page's two 1.5px hairlines (the hero float cards
have the other). Ship as drawn, log (§9, D10).

`<ul style="list-style:none;margin:0;padding:8px 0 0">`, five `<li>`:

```
display:flex;align-items:center;gap:10px;padding:6px 14px;
border-bottom:1px solid var(--color-slate-100,#E5E8E5)
```

- dot — `<span aria-hidden="true" style="flex:none;width:8px;height:8px;
  border-radius:9999px;background:{dot}">`
- label — `min-width:0;flex:1;--font-sans;font-size:12.5px;line-height:1.4;
  color:var(--color-slate-700,#35402F);white-space:nowrap;overflow:hidden;
  text-overflow:ellipsis`
- amount — `flex:none;--font-serif;font-weight:600;font-size:12.5px;
  font-variant-numeric:tabular-nums;color:var(--color-ink,#16321E)`

| # | Label | Amount | Dot (artboard) | Token |
|---|---|---|---|---|
| 1 | Demolition & Site Clearing | $4,200 | `#8A7A65` | `--color-cat-demolition` |
| 2 | Retaining & Structures | $7,920 | `#B89270` | `--color-cat-retaining` |
| 3 | Paving & Stonework | $14,880 | `#A8A296` | `--color-cat-paving` |
| 4 | Turf, Soil & Planting | $9,400 | `#8FB57E` | `--color-cat-planting` |
| 5 | Irrigation | $5,320 | `#9CB4C7` | `--color-cat-irrigation` |

**This is `SCOPE` in `content/home.ts`, already, exactly.** Render the array; do
not retype the table. The fifth `<li>` still carries a `border-bottom`, so there
is a hairline directly above the total block — as drawn.

The artboard has a stray blank line and inconsistent indentation between `<li>` 1
and 2; cosmetic only.

### 5.5 Total

```
display:flex;align-items:baseline;justify-content:flex-end;gap:12px;
padding:10px 14px 11px
```

- `Total inc. GST -` — `font-size:12px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--color-slate-500,#6E7669)`. **The trailing `-` is in the client's
  copy.** Not an em dash, not a typo we may fix; flag (§9, D13).
- `$48,200` [`QUOTE.total`] — `--font-serif;font-weight:600;font-size:22px;
  font-variant-numeric:tabular-nums;color:var(--color-ink,#16321E)`.

**The figures do not reconcile** (§9, D15): the five scope lines sum to
**$41,720**; $41,720 inc. 10% GST is $45,892, not $48,200. Client data;
flag, do not correct.

### 5.6 Footer strip with the live pip

```
display:flex;align-items:center;gap:8px;
border-top:1px solid var(--color-border,#DFD8C8);
background:var(--color-well,#F6F4EC);padding:8px 14px
```

The pip is a two-layer construct — a solid base dot that never moves, plus a
ghost that scales out from under it:

```
<span aria-hidden="true" style="position:relative;display:grid;place-items:center;
      flex:none;width:6px;height:6px">
  <span style="position:absolute;inset:0;border-radius:9999px;
        background:var(--color-lime-500,#C8E84A)"></span>
  <span class="pf-livepip" style="position:absolute;inset:0;border-radius:9999px;
        background:var(--color-lime-500,#C8E84A)"></span>
</span>
```

```css
@keyframes pf-livepip{0%{opacity:.8;transform:scale(1)}70%,100%{opacity:0;transform:scale(2.6)}}
.pf-livepip{animation:pf-livepip 2.4s cubic-bezier(.19,1,.22,1) infinite}
@media(prefers-reduced-motion:reduce){.pf-livepip{animation:none;opacity:0}}
```

**A 2.4s clock of its own**, independent of both the 15s and the 12s systems.
Peak expansion at 1.68s (70%), then it holds invisible for the last 0.72s.

The artboard declares this identical block **twice** (lines 161–163 and
192–194). The second is a byte-identical no-op; keep one (§9, D9).

The reduced-motion rule is already correct and already ported into
`styles/motion/chrome.css` — verify it is there once, and that `.live-pip`
resolves to `opacity:0` rather than relying on the missing `animation-fill-mode`
(§05 D17).

Label — `font-size:12px;color:var(--color-slate-500,#6E7669)`:

> Sent to Sarah · opened 4 times

`Sarah` is `QUOTE.client.split(" ")[0]`; `4` is `READING.opens`. Both exist;
derive, do not retype.

Lime on the pip is a sanctioned role (live/happening-now marker). Correct as
drawn.

---

## 6. Mobile composition (<1024px)

### 6.1 The mobile artboard reorders the chapter

Desktop runs **take-off → price library → proposal**, with the second and third
side by side. Mobile runs **take-off → proposal → price library**, stacked. This
is not a reflow — it is a different edit, and it is a deliberate one: on a phone
the proposal card is the payoff and the price library is the supporting
explanation, so the payoff comes second rather than last.

Preserve both orders (§02 ruling 12 precedent — two different moments, not ours
to unify). **Log** so the client sees it stated.

### 6.2 Shell

```
<section style="margin:0 16px 30px;overflow:hidden;border-radius:12px">
```

No `.banner-fade`, no negative-margin overlap, no blurred mirror. The mobile
chapter shell is two stacked boxes inside one 12px-rounded clipper:

**Banner.** `position:relative;padding:26px 18px 22px`, containing
`/images/photo-2.webp` (`object-fit:cover`), a scrim
`<span aria-hidden="true" style="position:absolute;inset:0">`:

```
linear-gradient(to bottom,
  color-mix(in oklab,var(--m-forest) 92%,transparent) 0%,
  color-mix(in oklab,var(--m-forest) 74%,transparent) 42%,
  color-mix(in oklab,var(--m-forest) 46%,transparent) 100%)
```

(`--m-forest` = `#15301F` = `--color-forest-900`), and the heading
`<h2 class="m-h2" style="position:relative;margin:0;font-size:28px;color:#fff">`:

> Meet Bramble. Quoting, taken off your plate.

One sentence run together, where desktop breaks it into two lines with a `<br>`.
Preserve both.

`.m-h2` is `--m-serif` 600, `font-variation-settings:'wght' 600,'SOFT' 60,
'opsz' 32`, `letter-spacing:-.005em`, `line-height:1.14` — this is the existing
`.display-2-mobile` local override class (RULINGS §03/04 ruling 14), not
`.display`'s default `opsz 40` cut. At 28px it needs no new class.

**Body.** `<div class="canvas-botanical" style="background:var(--m-muted);
padding:22px 16px 24px">`. Note the surface: **`--m-muted` = `#E6E0CC` =
`--color-card-muted`**, where desktop uses `--color-pf-surface-300` `#F8F7F2`.
The mobile chapter panel is the recessed tile tone; the desktop one is the page
surface. Ship both as drawn.

The botanical wash multiplies over `#E6E0CC`, which is considerably darker than
desktop's surface — re-check the mobile eyebrow and label contrast against it
(§8.3).

`.m-h3` sub-heads: `--m-serif` 600, `'opsz' 24`, `line-height:1.2`, at
`font-size:19px`, `margin:26px 0 0` between blocks. Body paragraphs:
`margin:8px 0 16px;font-size:14.5px;line-height:1.55;color:var(--m-ink-700)`
[`--color-slate-700`].

### 6.3 Sub-block 1 — the take-off card

Card: `overflow:hidden;border-radius:12px;background:#fff;box-shadow:0 0 0 1px
var(--m-border),0 6px 14px -6px rgba(21,48,31,.14),0 18px 30px -18px rgba(21,48,31,.18)`.
A hairline plus two warm layers — none of the four `.shadow-border-*` recipes.
Use a local class, as `.shadow-card-mobile` already does for the testimonial.

Copy above it:

> **Build a client-ready estimate in minutes, not your nights.** (identical to desktop)
>
> Bramble measures the job off the plan and prices it from your own suppliers,
> and rewrites it in language ready for your client. You just add your margin.

The mobile paragraph is a **different, and better, sentence** — it does not
contain desktop's `then and rewrites` error and it drops "AI". Preserve both;
flag the pair to the client, because if they fix desktop they will probably want
mobile's wording (§9, D13).

**Header strip.** `border-bottom:1px solid var(--m-border);
background:var(--m-muted);padding:10px 14px` — mobile's strip is muted where
desktop's is white.

- `<span class="m-eyebrow" style="font-size:10.5px;color:var(--m-ink-700)">`:
  > Take-off · 14 Ridge St

  A middot, not desktop's em dash, and no `Henderson,`. Two fewer problems than
  the desktop string.
- Timer chip: `border-radius:6px;background:var(--m-forest);padding:3px 8px`
  (desktop `4px 9px`), five `<span class="mtk mtk-lin">` at `grid-area:1/1`,
  `font-size:11px` (desktop 12px), same five readings.

**Plan.** No 16px padding frame and no `#FAFAFA` inner card — the plan sits
edge-to-edge in a `position:relative;overflow:hidden;background:#FAFAFA` box.
Same `aspect-ratio:1467/1072`, same two covers at the same percentages except
cover 2's width is **`31.6%`** against desktop's `31.63%` (a rounding difference,
not a redraw), same scan band recipe.

**Four rows.** `display:flex;align-items:center;gap:10px;padding:9px 0`, rows
2–4 adding `border-top:1px solid color-mix(in oklab,var(--m-border) 45%,transparent)`
— **row 1 has no top border on mobile**, where desktop's `.tk-row` puts one on
all four. Mobile drops the unit rate line entirely and shortens the spec:

| # | Label | Sub-line | Qty | Total |
|---|---|---|---|---|
| 1 | Paving | Sawn bluestone · Flagstone Supply | 48 m² | $3,763 |
| 2 | Stepping pavers | Bluestone treads · Flagstone Supply | 14 m² | $1,344 |
| 3 | Pool coping | Bullnose limestone · Stoneworks Co | 18 lm | $2,556 |
| 4 | Screen planting | Advanced 200mm · Greenline Nursery | 26 lm | $4,888 |

Label 13px `--m-ink`; sub-line 11px `--m-ink-500` with
`white-space:nowrap;overflow:hidden;text-overflow:ellipsis`; qty
`flex:none;font-size:12px;--m-ink-700`; total
`class="m-h3" flex:none;width:58px;text-align:right;font-size:13px;--m-ink`.

**Totals.** One row, not three — mobile has no Cost/Margin breakdown:

```
class="mtk" animation-name:mtk-total;display:flex;align-items:baseline;
justify-content:space-between;gap:10px;margin:0 14px;
border-top:1px solid var(--m-border);padding:12px 0
```

> `Quote total · 24% margin` — 11px/700/.1em uppercase `--m-ink-500`
> `$15,563` — `class="m-h2"` at 22px, `--m-ink`

**Ready bar.** `class="mtk" animation-name:mtk-ready`, and note it is
`border-top:1px solid var(--m-border);background:var(--m-lime);padding:10px 14px`
with **no border-radius and no margin** — it is a full-bleed footer of the card,
where desktop's is an inset 8px-rounded chip. 14×14 Check, `Quote ready` 13px/700,
`2m 14s` 12px/700.

### 6.4 Sub-block 2 — the proposal card

A materially different card from desktop's, not a narrower version of it.

Shell: `position:relative;overflow:hidden;border-radius:12px;background:#fff;
box-shadow:0 1px 2px rgba(21,48,31,.06),0 10px 24px -12px rgba(21,48,31,.22),
0 24px 40px -24px rgba(21,48,31,.26)` — a third distinct shadow recipe.

**Masthead** — `position:relative;height:190px;overflow:hidden` with
`/images/photo-2.webp` (desktop uses photo-1) and a **bottom-up** scrim:

```
linear-gradient(to top,
  color-mix(in oklab,var(--m-forest) 92%,transparent) 0%,
  color-mix(in oklab,var(--m-forest) 40%,transparent) 55%,
  transparent 100%)
```

Not the 24° gradient. Mobile's masthead is a 190px photographic band with the
type anchored bottom-left inside it:

```
position:absolute;left:18px;right:18px;bottom:16px;display:flex;
flex-direction:column;gap:4px
```

- `Prepared for` — 10px/700/.12em uppercase, `color-mix(in oklab,#fff 72%,transparent)`
- `Sarah Henderson` — `--m-serif` 600 24px, `line-height:1.1;letter-spacing:-.01em;color:#fff`
- `14 Beach Rd, Coogee · Rear garden and pool surround` — 12px,
  `color-mix(in oklab,#fff 78%,transparent)`

So the **hierarchy is inverted**: desktop leads with the address and puts the
client below it; mobile leads with the client and puts the address in the
sub-line. It also carries a project description — *Rear garden and pool
surround* — that appears nowhere on desktop. Preserve both, and add the
description string to `QUOTE` as `QUOTE.description` since it is a fifth fact
about the same job.

No `LIC#`, no `Q-1042` on mobile.

**Scope block** — `padding:18px 18px 6px`:

- `Scope of works` — 10.5px/700/.12em uppercase `--m-ink-500`
- a paragraph desktop does not have, `margin:8px 0 6px;font-size:13px;
  line-height:1.55;color:var(--m-ink-700)`:
  > A private poolside garden. Bluestone terraces step down to soft lawn,
  > screened for shade and seclusion.

**Four rows, not five.** `padding:0 18px 4px`, each
`display:flex;align-items:baseline;justify-content:space-between;gap:12px;
padding:10px 0`, rows 2–4 with
`border-top:1px solid color-mix(in oklab,var(--m-border) 60%,transparent)`:

| # | Label | Amount | Dot |
|---|---|---|---|
| 1 | Demolition & site clearing | $4,200 | `#8A7A65` |
| 2 | Retaining & structures | $7,920 | `#B89270` |
| 3 | Paving & stonework | $14,880 | `#A8A296` |
| 4 | Turf, soil & planting | $9,400 | `#8FB57E` |

**`Irrigation` / `$5,320` is absent on mobile**, and the labels are sentence case
where desktop's are Title Case. Dots are `6px` (desktop `8px`). Flag both (§9,
D16) — the missing row takes the visible sum from $41,720 to $36,400 against the
same `$48,200` total.

**Total.** `margin:8px 18px 0;border-top:1px solid var(--m-border);
padding:14px 0 16px`, `Total inc. GST` 11px/700/.1em uppercase `--m-ink-500`
(**no trailing `-`**, unlike desktop) and `$48,200` as `class="m-h2"` at 24px
with `letter-spacing:-.01em`.

**Footer.** `justify-content:space-between;border-top:1px solid var(--m-border);
background:var(--m-well);padding:11px 18px`:

- `Sent to Sarah · opened 4 times` with a **static** 6px lime dot — mobile has no
  `livepip` animation at all.
- an `Accept quote` pill desktop does not have: `display:inline-flex;height:30px;
  align-items:center;border-radius:8px;background:var(--m-lime);padding:0 12px;
  font-size:12px;font-weight:700;color:var(--m-forest)`.

The pill is a depiction inside a `role="img"` region, not an interactive
control — build it as a `<span>`, never a `<button>` or `<a>` (§8.1).

### 6.5 Sub-block 3 — the price library

Copy:

> **Bramble learns your real prices.** (identical to desktop)
>
> Bramble learns from your pricing, so every quote gets faster and easier, and it
> knows your margins.

A shorter, different paragraph. Preserve both.

Card: `position:relative;overflow:hidden;border-radius:12px;
background:var(--m-forest)` with `/images/photo-2.webp` and a **two**-stop scrim
(desktop has three):

```
linear-gradient(to bottom,
  color-mix(in oklab,#15301F 74%,transparent),
  color-mix(in oklab,#15301F 92%,transparent))
```

Padded area `padding:12px` (desktop 14px). Drop zone `padding:12px 10px`, icon
15×15, label 12.5px with `text-align:center`:

> Old quotes, Excel pricelists, photos of notes

No `supplier emails`, no full stop. Preserve both.

Rows `gap:7px;padding:16px 0 2px`; each row `gap:10px;padding:8px 10px`, icon
tile `32px` (desktop 36px), filename 12.5px, type chip 11px, tick 11×11, gap 3px.
Same four files, same four names, same four `animation-delay`s
(`0 / .5s / 1s / 1.5s`).

**Only `--dx` is set** — `96px / -96px / 96px / -96px`. No `--dy`, no `--dr`:
mobile's `m-drop-fly` hardcodes `14px` of Y and has no `rotate()` at all. On a
narrow card the rotation read as wobble.

Footer `padding:11px 12px`, tick 22px with a 12×12 check, `Ready to quote` at
14.5px, `248 materials learned` at 11px, colour hardcoded `#8FA886`
[`--color-forest-300`].

### 6.6 The `mtk-*` system, and how it differs from `tk-*`

Same driver, same 15 seconds, same easing, same `.mtk-lin` override:

```css
.mtk{animation-duration:15s;animation-timing-function:cubic-bezier(.19,1,.22,1);animation-iteration-count:infinite;animation-fill-mode:both}
.mtk-lin{animation-timing-function:linear}
```

**Every percentage in `mtk-row1..4`, `mtk-total`, `mtk-ready`, `mtk-cover1/2` and
`mtk-c1..c5` is identical to its `tk-*` counterpart.** The choreography table in
§3.4 applies unchanged. Five differences, all in the keyframe *values*:

| | `tk-*` | `mtk-*` |
|---|---|---|
| Row slide distance | `translateX(14px)` | `translateX(12px)` |
| Row exit | restores `translateX(14px)` | `99%,100%{opacity:0}` — **no transform restored** |
| Totals rise | `translateY(9px)`, restored on exit | `translateY(8px)`, not restored on exit |
| Ready bar | `scale(.86)` → `scale(1.1)` → `scale(1)` | **pure opacity**, no scale at all |
| Scan travel | `translateY(104%)` | `translateY(560%)` |

```css
@keyframes mtk-row1{0%,12%{opacity:0;transform:translateX(12px)}18%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0}}
@keyframes mtk-row2{0%,26%{opacity:0;transform:translateX(12px)}32%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0}}
@keyframes mtk-row3{0%,40%{opacity:0;transform:translateX(12px)}46%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0}}
@keyframes mtk-row4{0%,53%{opacity:0;transform:translateX(12px)}59%,94%{opacity:1;transform:translateX(0)}99%,100%{opacity:0}}
@keyframes mtk-total{0%,62%{opacity:0;transform:translateY(8px)}69%,94%{opacity:1;transform:translateY(0)}99%,100%{opacity:0}}
@keyframes mtk-ready{0%,64%{opacity:0}70%,94%{opacity:1}99%,100%{opacity:0}}
@keyframes mtk-cover1{0%,12%{opacity:1}18%,96%{opacity:0}100%{opacity:1}}
@keyframes mtk-cover2{0%,26%{opacity:1}32%,96%{opacity:0}100%{opacity:1}}
@keyframes mtk-scan{0%,3%{opacity:0;transform:translateY(-8%)}8%{opacity:1}58%{opacity:1;transform:translateY(560%)}64%,100%{opacity:0;transform:translateY(560%)}}
@keyframes mtk-c1{0%,3%{opacity:0}5%,17%{opacity:1}20%,100%{opacity:0}}
@keyframes mtk-c2{0%,18%{opacity:0}21%,30%{opacity:1}34%,100%{opacity:0}}
@keyframes mtk-c3{0%,32%{opacity:0}35%,44%{opacity:1}48%,100%{opacity:0}}
@keyframes mtk-c4{0%,46%{opacity:0}49%,58%{opacity:1}62%,100%{opacity:0}}
@keyframes mtk-c5{0%,60%{opacity:0}63%,96%{opacity:1}100%{opacity:0}}
```

**There is no `mtk-pop*` and no `mtk-fill*`.** Mobile never carried the eight
dead blocks — more evidence that they are a leftover and not a pending feature.

The "no transform on exit" difference is not cosmetic: a `.mtk` row at
`t = 14850–15000ms` sits at `translateX(0)` and fades straight out, where a `.tk`
row slides 14px right as it goes. Both are legible; reproduce each as drawn.

**Two systems or one?** Because the components are `display:none`-gated, a single
set of keyframes with CSS variables for the three differing values would be
tempting. Do not: the `translateY(104%)` vs `560%` gap is a defect on one side
(§3.5), and merging them before that is ruled would silently pick a winner.
Ship two files, `takeoff.css` and `takeoff-mobile.css`, and merge them if and
when the scan ruling lands on `560%` for both.

### 6.7 Mobile reduced motion  **[Designer decision]**

The artboard:

```css
@media(prefers-reduced-motion:reduce){
  .mtk{animation:none!important;opacity:1!important;transform:none!important}
  .mtk[style*="mtk-cover"]{opacity:0!important}
}
```

Mobile **fixes the cover half** of the desktop bug — proof that the author knew
about it — but still leaves the five timer chips superimposed and the scan band
pinned visible. Half a fix. Replace with the same structure as §3.6, using the
`.mtk-cover` / `.mtk-scan` / `.mtk-clock` hooks so the selector does not have to
sniff the `style` attribute.

The mobile `m-drop-*` reduced-motion block is equivalent to desktop's and gets
the same treatment as §4.8.

`.m-drop-*` also needs its own file rather than sharing `ingest.css`, for the
same reason as above: the fly keyframe differs (no rotation, hardcoded Y).

---

## 7. The 320→1023px fluid behaviour  **[Designer decision]**

The mobile artboard is a fixed 430px column with zero media queries. Everything
not listed holds its artboard px value at every width.

**Outer gutter.** `16px` from 320px, stepping to `32px` at ≥640px. Matches §05's
ruling exactly, for the same reason: the artboard draws 16px, the neighbouring
bands draw 16px, and RULINGS §03/04 ruling 16 settled that as "reproduce as
drawn". The 4px mismatch against the hero's 20px is already logged there; this
section inherits it rather than inventing a third value.

**Content cap.** `width:100%;max-width:560px;margin-inline:auto` on the
section's inner content, the same 560px cap as every other section. Without it
the 14.5px body paragraph runs 90+ characters at 700px, which the artboard never
proposes.

**Panel padding.** `22px 16px 24px`, stepping the horizontal to `24px` at
≥560px. Below 560 the panel is narrower than the cap and 16px is what is drawn;
at and above it, 16px leaves the take-off card tight against a now-wide panel
edge. Vertical padding never changes. Same rule shape as §05's panel padding.

**Banner heading.** `font-size: clamp(22px, 6.51vw, 28px)`. 6.51vw is exactly
28.0px at 430px (the artboard value); it holds at 28px above 430px and clamps to
22px at 320px. `line-height:1.14`, `letter-spacing:-.005em` and the `opsz 32`
cut are unchanged at every width below 1024.

**Banner padding.** `26px 18px 22px` fixed. It is a photographic band whose crop
is tuned to those insets; scaling them moves the subject relative to the type.

**Sub-heads.** Fixed at 19px. They already sit one step below the banner
heading's floor and scaling them would collapse the two.

**Body copy and every card's type stay fixed** at their artboard px
(14.5 / 13 / 12.5 / 12 / 11 / 10.5). They are at the floor of comfortable
already, and the 560px cap handles the top of the range. Scaling them down at
320px would trade a solvable width problem for an unsolvable legibility one.

**The take-off card at 320px.** The card measures **256px** (320 − 32 gutter − 32
panel padding). The widest row is `Screen planting` + `26 lm` + `$4,888`: the
58px total column plus the 12px qty plus two 10px gaps leaves **~166px** for the
label column, and the longest sub-line (`Bluestone treads · Flagstone Supply`,
~178px at 11px) ellipsises — which is what its `text-overflow:ellipsis` is for
and what the artboard already does at 430px for row 2. No change needed; verify
in the browser that no row overflows rather than that no row ellipsises.

**The plan's `aspect-ratio` does not scale.** At 256px wide the plan box is
187px tall, and both cover rectangles are 10.9%/13.0% of that — 20px and 24px.
Still legible as "something was hidden and is now revealed", which is all they
need to be.

**The proposal masthead's 190px height does not scale.** It is a photographic
band with type anchored 16px from its bottom; a proportional height would drift
the type relative to the subject.

**The price-library card.** Its four file rows are `min-width:0` with
`text-overflow:ellipsis` on the filename, so it fits at 256px with
`Laurence_Quote_Mar.pdf` truncating. Accept the truncation — it is the same
behaviour the 430px artboard shows for row 3.

**`--dx: 96px` does scale**, and it is the one motion value that should:
`--dx: clamp(56px, 22.3vw, 96px)`. At 430px that is exactly 96px; at 320px it is
71px. A 96px fly-in on a 256px card starts the file most of a card-width outside
the frame, where the parent's `overflow:hidden` clips it and the entrance reads
as a fade rather than a flight. This is the only fluid change I am making to an
animation, and it is confined to a custom property so the keyframe is untouched.

**At exactly 1024px the desktop composition takes over whole.** There is no
intermediate composition, there is no width at which the three sub-blocks sit
side by side, and there is no width below 1024px at which the desktop
`.canvas-botanical` panel, the negative-margin overlap or the `banner-fade` mask
appear.

---

## 8. Accessibility

### 8.1 How much of this reaches a screen reader  **[Designer decision]**

**The recommendation: `role="img"` plus a written `aria-label` on each of the
four product depictions, with every word of the surrounding argument fully
readable.** This is the ruling already made for the hero float cards and, at
§05 ruling 7, for the before/after phones. It applies here for the same reason
and more strongly.

The four regions and their labels:

| Region | `aria-label` |
|---|---|
| The take-off card (desktop + mobile) | `A take-off in progress: Bramble measures a site plan and prices four lines — paving, stepping pavers, pool coping and screen planting — to a quote total of $15,563 in 2 minutes 14 seconds.` |
| The price-library card | `Four files being read into a price library: a PDF quote, an Excel pricelist and two photographs. All four are marked Read, and the footer says 248 materials learned.` |
| The proposal card (desktop) | `A branded proposal for Sarah Henderson at 14 Beach Rd, Coogee. Five scope lines with a total of $48,200 including GST, marked as sent and opened four times.` |
| The proposal card (mobile) | `A branded proposal prepared for Sarah Henderson, 14 Beach Rd, Coogee. Four scope lines with a total of $48,200 including GST, marked as sent and opened four times.` |

Why this and not the alternatives:

- **Reading it all is worse than useless.** The take-off card alone is four
  labels, four specs, four supplier names, four unit rates, four quantities, four
  totals, five superimposed timestamps and a totals block — roughly 90 tokens of
  invented data, of which a sighted reader absorbs *the shape* in under a second
  and none of the specifics. Read aloud, it is a minute of numbers with no
  argument in it. The price-library card adds four filenames and eight
  type/status chips that a screen reader would announce twice each, because the
  type and the "Read" state are superimposed siblings — one of which is at
  `opacity:0` at any given moment but **both of which remain in the accessibility
  tree**, since `opacity` is not `visibility`.
- **Silencing them entirely loses the argument.** These three cards *are* the
  chapter's claim. "Bramble measures the job off the plan and prices it from your
  own suppliers" is only credible because the reader can see a plan being
  measured and lines being priced. A label restores that in one sentence.
- **The labels carry the numbers that matter and drop the ones that do not.**
  $15,563, 2m 14s, 248 materials, $48,200, four opens. Every one of those is a
  `content/home.ts` constant that the rest of the page also states, so the label
  strings should be **built from the same constants**, not written out — that is
  the whole point of §2.6's note about the arithmetic.
- **The surrounding argument stays fully readable.** Three eyebrows, three
  headings and three paragraphs — the entire case the section makes — sit outside
  the labelled regions and are announced normally. Nothing is lost.

Mechanics:

- `role="img"` + `aria-label` on the outermost card element. Everything inside
  is then presentational to AT; do **not** also sprinkle `aria-hidden` inside.
- The plan `<img>` keeps its own `alt` in the markup but it is shadowed by the
  parent's `role="img"`; set `alt=""` to avoid the confusion.
- `aria-hidden=""` (the empty string, which is not a valid value) appears on
  **nine** elements in this section. Fix every one to `aria-hidden="true"`, per
  §03/04 ruling 7 — the empty string is ignored and the current build announces
  the decorative dots and scrims (§9, D7).
- The mobile `Accept quote` pill is a `<span>` inside the labelled region. It is
  a picture of a button. It must not be focusable, and it must not be announced
  as a button the reader can press and have nothing happen.
- All three chapter headings become `<h2>` and all panel sub-heads `<h3>`
  (§1.4), which is also what makes the page's heading outline navigable.

### 8.2 Motion

Three infinite animations over 5 seconds run in this section (15s, 12s and 2.4s),
which is WCAG 2.2.2 territory. Reduced motion stops all three outright
(§3.6, §4.8, §5.6). Do not invent a visible pause control — neither artboard
draws one, and §03/04 ruling 5 declines to. **Log the residual gap honestly:** a
touch user with no reduced-motion preference set still has no mechanism, exactly
as with the marquee.

### 8.3 Contrast — measured, not estimated

Measured in Chromium at 1440×1000 against the actual composited pixels: the
artboard rendered with its own assets and its reveal animations settled, each
text element screenshotted twice — once painted, once with `color:transparent` —
and the two diffed so the background *under every glyph* is read directly rather
than inferred. `bg` below is the mean of those under-glyph pixels; `p5` is the
5th-percentile worst of them, which is the number that decides a pass on a
photograph.

**The lime bar passes comfortably.** Both candidates flagged for measurement:

| Element | Colour | On | Ratio | Needs | |
|---|---|---|---|---|---|
| `Quote ready`, 13.5px/700 | `#15301F` | `#C8E84A` | **10.27** | 4.5 | pass |
| `2m 14s`, 12.5px/700 | `#15301F` | `#C8E84A` | **10.27** | 4.5 | pass |

`forest-900` on `lime-500` is the same pair as §05's `With Bramble` pill, and it
measures the same. No change.

**The on-photo masthead does not pass**, and the 24° angle is why:

| Element | Colour | bg (mean) | mean | p5 | Needs | |
|---|---|---|---|---|---|---|
| `Laurence Landscapes`, 11.5px/600 | `#FFFFFF` | `#5C5E49` | 6.62 | **2.83** | 4.5 | **fail** |
| `LIC# 284119C`, 11.5px | `#E8E4D2` | `#645C40` | 5.20 | **3.74** | 4.5 | **fail** |
| `Q-1042 · Coogee`, 11.5px | `#E8E4D2` | `#434B37` | 7.20 | **3.14** | 4.5 | **fail** |
| `14 Beach Rd`, 24px/600 | `#FFFFFF` | `#3A432E` | 10.34 | 6.69 | 3.0 (large) | pass |
| `Prepared for Sarah Henderson`, 12px | `#E8E4D2` | `#485644` | 6.12 | 4.64 | 4.5 | pass (0.14) |

The pattern is exact: the three failures are the three lines nearest the **top
right**, which is where the 24° gradient's `6%` stop sits, and the two passes are
the two lines nearest the bottom left, where the `90%` stop is. `14 Beach Rd`
also has an 18px-blur text shadow doing real work; the two 3px shadows on the
smaller lines do not have the radius to help.

**Recommended minimum correction: move the gradient's last stop from `6%` to
`40%`.** Measured against the brightest under-glyph pixel, `Laurence Landscapes`
needs +34% forest and `Q-1042 · Coogee` +30%; `LIC# 284119C` needs +50% but it is
also the one line whose colour could move instead. The single smallest change
that clears all three at once is the last stop:

```css
background: linear-gradient(24deg,
  color-mix(in oklab, var(--color-forest-900) 90%, transparent) 4%,
  color-mix(in oklab, var(--color-forest-900) 42%, transparent) 52%,
  color-mix(in oklab, var(--color-forest-900) 40%, transparent));
```

It keeps the diagonal, keeps the photograph legible, and is a change to one
number. **Escalate with these figures** rather than applying it, exactly as
§05 did — it alters the masthead's look, which is a design decision.

**Five more failures in this section, all of them flat colour on flat colour and
therefore not arguable:**

| Element | Colour | On | Ratio | Needs | Instances |
|---|---|---|---|---|---|
| Take-off row sub-lines (`Sawn bluestone 400×400 · Flagstone Supply` etc.), 11.5px | `#8A9082` `slate-400` | `#FFFFFF` | **3.29** | 4.5 | 4 |
| `Cost` / `Your margin · 24%`, 13px | `#6E7669` `slate-500` | `#F6F4EC` `well` | **4.28** | 4.5 | 2 |
| `Sent to Sarah · opened 4 times`, 12px | `#6E7669` | `#F6F4EC` | **4.28** | 4.5 | 1 |
| `PDF` / `Excel` / `Photo` type chips, 11.5px | `#6E7669` | `#F4F5F4` (white-95 over forest) | **4.30** | 4.5 | 4 |
| `Premium proposals` eyebrow, 12px/800 | `#657919` `--color-eyebrow` | `#F5F3ED` (surface-300 **under the botanical wash**) | **4.40** | 4.5 | 1 |

The last one is the important one, because it is not this section's defect — it
is the page-level consequence RULINGS' closing note predicted:

> *Contrast headroom is thin by design … Anything that composites them through an
> opacity — a fade, an overlay, a tinted parent — will fail.*

`--color-eyebrow` was tuned to clear 4.5 against `#F8F7F2`, where it measures
**4.55**. `canvas-botanical` multiplies at `opacity:.5` over the right 420px of
the panel, and the `Premium proposals` eyebrow sits in the left part of that
ramp, on a measured `#F5F3ED`. 0.05 of headroom does not survive it. The other
two eyebrows in this chapter sit outside the wash and measure the full 4.55.

Recommended minimum corrections, each the smallest change that measures ≥4.5:

1. **Row sub-lines: `#8A9082` → `#73786D`** → **4.53** on white. Four instances.
   Do not reuse `--color-marquee-term-mobile` (`#6A6F64`, 5.16 here) — it is
   more darkening than needed and it is named for a different job.
2. **`Cost` / `Your margin` / `Sent to Sarah`: `#6E7669` → `#6B7266`** → **4.51**
   on `well`, and **4.97** on white, so one token covers both surfaces.
3. **Type chips: the same `#6B7266`** → **4.59** on the white-95 field.
   Note `slate-500` on plain white is 4.71 and passes; it is only the 5% of
   forest showing through `rgba(255,255,255,.95)` that pushes it under. The card
   background could equally go to `.98`, but recolouring the text is the smaller
   change and it matches correction 2.
4. **`Premium proposals` eyebrow: `#657919` → `#647719`** → **4.51** on the
   washed `#F5F3ED` and **4.67** on plain `#F8F7F2`. A one-step darkening.
   The alternative — pulling the botanical's `mask-image` ramp further right so
   the wash never reaches the eyebrow column — is a design change to a
   design-system class used on four panels, and I would not make it for one
   eyebrow.

   **This one needs a page-level decision, not a section-level one.** If the
   client would rather not re-tune a shared token for one call site, the honest
   alternative is to stop treating 4.5 as the target for `--color-eyebrow` and
   give it real headroom (`#5F7217`, 5.01/4.85) once, everywhere. Escalate with
   both options.

Everything else in the section passes with room: all four take-off labels
(14.95), all four take-off totals (13.92), all five scope labels (10.90) and
amounts (13.92), `Quote total` / `$15,563` (12.64), `$48,200` (13.92), all four
filenames (12.7), all four `Read` chips (7.8), `Ready to quote` (14.05),
`248 materials learned` (5.43), the drop-zone label (9.44 at p5), both chapter
heading lines on the banner (6.85 and 5.20 at p5), and the two panel body
paragraphs (15.1 and 10.8 at p5).

**Mobile is not covered by the table above** and must be measured separately
before sign-off: its panel surface is `--color-card-muted` `#E6E0CC`, two steps
darker than desktop's, and the botanical multiplies over *that*. Every
`--m-ink-500` label on the mobile panel is a candidate, and `--color-eyebrow-mobile`
(`#607521`, tuned against a lighter surface) is the same trap as correction 4.
Measure the composited pixels; do not port the desktop numbers.

---

## 9. Defects in the source — flagged, not fixed

Except D5 and D6 (hard gate — reduced motion), D7 and D8 (existing RULINGS
precedent) and D2 (dead code).

| # | Finding | Recommendation |
|---|---|---|
| D1 | `tk-scan` ends at `translateY(104%)` on a `height:16%` element, so the scan band travels 16.6% of the plan and never reaches either revealed annotation. Mobile's `mtk-scan` writes `560%` for the same element | **Needs a ruling. Recommend fixing to `560%`**, matching mobile, which supplies the evidence of intent. A mis-stepped animation is a bug under principle 2, but this one is visible in a static frame so it will move the visual diff. §3.5. |
| D2 | Eight keyframe blocks — `tk-pop1..4`, `tk-fill1..4` — declared and applied to nothing. Their phasing shows they drove a four-measurement version of the demo that the artboard no longer draws. Mobile never had them | **Drop.** Dead code, §05 D6/D7 precedent. Recorded in §3.3 so nobody restores them. |
| D3 | `.canvas-botanical` appears in no artboard `<style>` block, only in the linked design-system sheet. A naive port that copies the inline `<style>` loses the entire botanical wash on all three chapter panels | **Not a defect — a porting trap.** Already ported correctly into `styles/base.css:314–337`. Flagged so QA knows the wash is meant to be there. §1.3. |
| D4 | `@media (max-width:1150px){.tk-grid{grid-template-columns:minmax(0,1fr)!important}}` — dead in our build, since the desktop component is `hidden desk:block` and the 1000px cap already governs 1024–1150px | Ship the two-column grid flat; record the value here only. §03/04 ruling 15 precedent. §2.2. |
| D5 | The `tk` reduced-motion block puts `opacity:1!important` on `.tk`, which sits on the covers, the scan band and all five clock spans as well as the rows — so at rest both plan annotations are **hidden behind their covers**, a lime bar lies across the plan, and five timestamps print on top of each other | **Fix.** Hard gate, and the same class of defect as §05 ruling 3. Replace wholesale with §3.6. |
| D6 | The `mtk` reduced-motion block fixes the covers (`[style*="mtk-cover"]{opacity:0}`) but still leaves five superimposed clock spans and the scan band pinned visible | **Fix.** Half a fix is still a fail. §6.7. |
| D7 | `aria-hidden=""` (empty string, not a valid value) on nine elements across the section | **Fix** to `"true"`. §03/04 ruling 7 precedent. |
| D8 | Three `<h1>`s for the three chapters, then a jump straight to `<h3>` for the panel sub-heads | **Fix the semantics, keep the visuals** — `<h2 class="display display-1">` and `<h3 class="display display-3">`. §03/04 ruling 8. §1.4. |
| D9 | `@keyframes pf-livepip` + `.pf-livepip` + its reduced-motion rule declared **twice**, byte-identical (artboard lines 161–163 and 192–194) | Keep one. §5.6. |
| D10 | Radii and hairlines off the scale: `8px` on the upload drop zone where `docs/brand.md` says 12 for upload zones; `1.5px` dashed on the same zone; `1.5px` solid on the `Scope` rule | Ship as drawn, log. §01 ruling 8 precedent. |
| D11 | Two classes named for behaviour they do not have: `.pf-drop-pct` shows a file *type*, never a percentage; `.pf-drop-countUp` never counts — `248` is static and `pf-drop-count` is a pure fade | Reproduce the behaviour, rename the classes (`.file-type`, `.ingest-count`). Note in the component so nobody adds a counter. |
| D12 | The ingest loop never clears: with 0/.5/1/1.5s delays on a 12s loop, files 2–4 finish exiting at 12.02 / 12.52 / **13.02s** — i.e. after file 1 has already re-flown and the drop zone has already re-flashed | Flag. Reproduce as drawn; fixing it means re-choreographing, which is a design change. §4.7. |
| D13 | Copy: `then and rewrites it ready for your client` (desktop body, ungrammatical); the trailing `-` in `Total inc. GST -`; the spaced hyphen in `START HERE - ESTIMATING & QUOTING`; the em dash in `Take-off — Henderson, 14 Ridge St`, which `docs/brand.md` bans outright | Flag, do not edit. Principle 3. Note that the **mobile** artboard's version of the same paragraph is grammatical and drops "AI", so if the client fixes desktop they will probably want mobile's wording. |
| D14 | `<b><i><span style="font-weight:normal;font-style:normal">You just add your margin.</span></i></b>` — a bold-italic pair cancelled by its own child, so it renders as plain body text. `docs/brand.md` bans italics in either family | Reproduce the rendered result (plain text); drop the inert wrapper. §02 ruling 3 precedent. |
| D15 | The proposal card's five scope lines sum to **$41,720**; the card says **$48,200** "inc. GST". $41,720 + 10% GST is $45,892. Mobile drops the `Irrigation` line entirely, taking the visible sum to **$36,400** against the same total | Flag. Client data, principle 3. Worth raising: the take-off card's arithmetic reconciles exactly, so the proposal card's not reconciling looks like an oversight rather than a choice. |
| D16 | Mobile's proposal card omits the fifth scope row and sets the four it keeps in sentence case where desktop uses Title Case; `docs/brand.md` says headings Title Case | Ship both as drawn, log. §02 rulings 12–14 precedent (preserve both, they are two different edits). |
| D17 | Contrast: three masthead lines fail on the photograph (2.83 / 3.74 / 3.14 at p5); four row sub-lines at 3.29; three slate-500 labels at 4.28–4.30; the `Premium proposals` eyebrow at 4.40 against the botanical wash | Escalate with §8.3's numbers and recommended minimum corrections. The eyebrow one is page-level, not section-level. |
| D18 | Sources are `assets/*.png`; the repo ships `.webp` | Map `photo-1`, `photo-2`, `photo-4`, `takeoff-plan` to `/images/*.webp`. `canvas-botanical` stays `.jpg`. |
| D19 | The section `<div>` chain has two identical `max-width:1280px` boxes nested (L1/L2), and `border-radius:8px;overflow:hidden` on a section nothing reaches | Collapse to one element; drop the inert radius and clip. §02 ruling 3 precedent. |
| D20 | Three distinct card shadow recipes on mobile (take-off, proposal, price library) where desktop uses one `.shadow-border-strong` for all three | Ship as drawn, log. §03/04 ruling 13 precedent — shadow asymmetry between breakpoints is already established as the design. |
| D21 | The `pf-drop-bar` fill completes at 34% but the `PDF`→`Read` label swaps at 30–38%, so the label reads "Read" 480ms before the bar is full | Flag. A 480ms overlap on a 12s loop; reproduce as drawn. |
| D22 | The `.pf-drop-fly` comment says the loop "rests on Training complete"; no element in the card says Training complete | Drop the stale comment. |

---

## 10. QA checklist

### Structure

- [ ] Two components, `hidden desk:block` and `desk:hidden`. All three sub-blocks
      exist once in each; nothing is hidden with `opacity-0` or `sr-only`.
- [ ] **Mobile sub-block order is take-off → proposal → price library.** Desktop
      is take-off → price library → proposal. If they match, one of them is wrong.
- [ ] The chapter shell is one component with per-chapter props, and chapters 2
      and 3 consume it. `photo-2` / `center 40%` for chapter 1.
- [ ] Desktop: banner `h-[520px] pt-14 pl-14`, panel wrapper `-mt-[300px]
      pt-[240px] px-8 pb-12`, panel card `rounded-xl bg-pf-surface-300 p-12`.
- [ ] `.canvas-botanical` is on the panel card and the wash **renders** — a page
      with no leaves in the right margin has lost the design-system sheet (D3).
- [ ] `.banner-fade` mask and `::after` scrim both present; the photograph and
      the veil fade out together at the bottom of the banner.
- [ ] The blurred mirror image is `scaleY(-1) blur(40px)`, `alt=""`, and is the
      same src as the banner (one network request, not two).
- [ ] One `<h2>` for the chapter, three `<h3>`s for the panels. No `<h1>`.
- [ ] Nine `aria-hidden="true"`, zero `aria-hidden=""`.
- [ ] Four `role="img"` regions with the §8.1 labels, built from `content/home.ts`
      constants rather than typed out.
- [ ] Mobile `Accept quote` is a `<span>`, not focusable, not announced.

### Copy — character for character

- [ ] Three eyebrows: `START HERE - ESTIMATING & QUOTING` (spaced hyphen),
      `Your price library`, `Premium proposals`.
- [ ] Desktop body retains `then and rewrites it ready for your client` (D13) and
      renders it un-bolded, un-italicised (D14).
- [ ] `Take-off — Henderson, 14 Ridge St` (em dash) desktop;
      `Take-off · 14 Ridge St` (middot) mobile.
- [ ] Four take-off rows with `×` (U+00D7), `·` (U+00B7) and `²` (U+00B2)
      exactly as §2.6. Mobile's shortened specs exactly as §6.3.
- [ ] `Total inc. GST -` with the trailing hyphen on desktop; `Total inc. GST`
      without it on mobile (D13).
- [ ] `Photo of last season’s quote` with a curly apostrophe (U+2019).
- [ ] Mobile proposal has **four** scope rows and no `Irrigation`; desktop has
      five (D16).
- [ ] Mobile carries `A private poolside garden…` and
      `Rear garden and pool surround`; desktop carries neither.
- [ ] Drop zone: desktop `…photos of notes, supplier emails.` with a full stop;
      mobile `…photos of notes` without one.

### Geometry

- [ ] Plan box is `aspect-ratio:1467/1072` on both breakpoints. Not 4/3.
- [ ] Cover 1 at `left:70.48% top:24.16% w:21.40% h:10.91%`; cover 2 at
      `left:60.26% top:57.56% w:31.63% h:12.97%` (mobile w `31.6%`).
- [ ] Desktop card grid is `minmax(0,1.12fr) minmax(0,.88fr)` → 560/440 at the
      1000px cap. Flat; no 1150px query (D4).
- [ ] Split grid is `1fr 1px 1fr` with `gap:48px` → a 97px visual gutter.
- [ ] `.tk-qty` 58px, `.tk-tot` 66px, both `tabular-nums`, both right-aligned.
- [ ] Panel B card `max-w-[360px]`, panel C card `max-w-[330px]`.
- [ ] Panel B container `height:384px`; panel C container `min-height:384px`.
- [ ] Every money figure and every repeated fact traces to `content/home.ts`.
      `grep` the components for `$48,200`, `$15,563`, `2m 14s`, `248`, `Q-1042`,
      `Sarah Henderson` — each should appear zero times.

### Animation — freeze the clock

```js
const T = 11250;                       // ms into the 15s tk cycle
document.getAnimations().forEach(a => { a.pause(); a.currentTime = T; });
```

**The `tk-*` system has no `animation-delay` anywhere**, so `currentTime` is
cycle time directly — unlike §05. For `.ingest-*`, whose four items carry
0/.5/1/1.5s delays, the frame you want at cycle time `t` is
`currentTime = t + delay`. For `.live-pip`, on a 2.4s clock, use `t % 2400`.

Take-off, `t` in ms on the 15s clock:

- [ ] `t = 0` — plan visible, both annotations covered, chip blank, right pane
      empty apart from its header strip.
- [ ] `t = 750` — `0:04` alone at full opacity. Exactly one chip visible.
- [ ] `t = 1800` — **cover 1 and row 1 start together.** Any gap is a bug.
- [ ] `t = 2700` — cover 1 gone, row 1 at `translateX(0)`.
- [ ] `t = 3000–3150` — the chip is **blank**. Both `0:04` and `0:22` at 0.
- [ ] `t = 3900` / `4800` — cover 2 and row 2, start and finish, together.
- [ ] `t = 6000` / `6900` — row 3. `t = 7950` / `8700` — row 4.
- [ ] `t = 8700` — row 4 lands, scan band starts fading, `1:28` starts fading.
      Three things on one beat.
- [ ] `t = 9300` — totals block starts. `t = 10350` — landed.
- [ ] **`t = 10500` — `Quote ready` at `scale(1.1)`.** The only overshoot in the
      system; if it is at `scale(1)` the keyframe has been flattened.
- [ ] **`t = 11250` — the reference frame.** Everything landed and settled, both
      covers lifted, scan gone, chip on `2:14`. Screenshot this.
- [ ] `t = 14100` — rows, totals and ready bar all begin fading **together**.
      Any stagger is a bug.
- [ ] `t = 14850` — desktop rows are back at `translateX(14px)`; mobile rows are
      at `translateX(0)` and fading only (§6.6).
- [ ] Scan band position at `t = 8700`: with the D1 fix, its bottom edge is at or
      past the plan's bottom. Without it, at 32.6%. **This is the single check
      that tells you which way D1 was ruled.**
- [ ] Exactly one chip visible at every `t` where a chip is visible at all.
- [ ] The five chips and the scan compute to `linear`; everything else to
      `cubic-bezier(0.19, 1, 0.22, 1)`.

Price library, `t` on the 12s clock (add the item's delay to get `currentTime`):

- [ ] `t = 0` — drop zone is lime (`#C8E84A` 78% border / 14% fill); all four
      files off-frame.
- [ ] `t = 1920` — file 1 landed at `translate(0,0) rotate(0) scale(1)`.
- [ ] `t = 3420` wall — file 4 landed. All four cards in place.
- [ ] `t = 3600` — file 1 shows `Read`; its bar is **not yet full** (D21).
      `t = 4080` — bar full.
- [ ] `t = 5760` — footer starts rising. `t = 6720` — up.
- [ ] **`t = 6960` — tick at `scale(1.18)`.**
- [ ] `t = 7200` — `248 materials learned` at full opacity.
- [ ] **`t = 7680` — the reference frame.** All four landed, all bars full, all
      labels `Read`, footer up, tick at `scale(1)`. Screenshot this.
- [ ] `t = 11520–13020` wall — the four files exit in a 1.5s cascade **while
      file 1 has already restarted** (D12). Confirm it is the drawn behaviour and
      not a stacking bug.
- [ ] Easings: `.ingest-item` and `.ingest-done`/`.ingest-tick` expo-out,
      `.ingest-fill` `cubic-bezier(.4,0,.2,1)`, `.file-type`/`.file-read`
      `linear`, `.ingest-zone` `ease-in-out`. Four different curves, all present.
- [ ] `--dx` alternates `96/-96/96/-96`, `--dr` alternates `8/-7/6/-9deg`,
      `--dy` is `14px` on all four. **Mobile has `--dx` only** — no `--dr` in the
      markup and no `rotate()` in `m-drop-fly`.

Live pip:

- [ ] `t = 1680` of its own 2.4s clock — `opacity:0, scale(2.6)`. Holds invisible
      to 2400. The solid base dot never moves.
- [ ] Mobile has **no** pip animation, only a static 6px lime dot.

### Reduced motion

- [ ] With `prefers-reduced-motion: reduce`, every animation in the section
      reports `animation-name: none`. All three systems. Nothing left running.
- [ ] **Exactly one timer chip is visible and it reads `2:14`** — not five
      superimposed, not blank. Fastest way to spot the artboard's broken block
      having been ported verbatim (D5/D6).
- [ ] **Zero cover rectangles visible.** Both plan annotations readable.
- [ ] **The lime scan band is invisible**, not lying across the top of the plan.
- [ ] All four priced rows, the totals block and the `Quote ready` bar are at
      `opacity:1, transform:none`.
- [ ] All four file rows landed, all four bars at `width:100%`, all four labels
      reading `Read` with `PDF`/`Excel`/`Photo` at `opacity:0`, footer visible,
      tick at `scale(1)`, `248 materials learned` visible.
- [ ] `.live-pip` at `opacity:0`; one solid lime dot remains.
- [ ] Screenshot both breakpoints in this state and confirm each is the same
      composition as its live reference frame — `t = 11250` for `tk`, `t = 7680`
      for the ingest loop.
- [ ] No `stroke-dashoffset` in any reduced-motion rule in this section; nothing
      here has a dashed SVG stroke (§3.6).

### Fluid range (§7)

- [ ] 320px: no horizontal scroll; take-off card measures 256px; no row
      overflows (ellipsis is fine and expected).
- [ ] Banner heading is 22px at 320px, exactly 28px at 430px, 28px at 1023px.
- [ ] Gutter 16px below 640, 32px at and above. Panel horizontal padding 16px
      below 560, 24px at and above.
- [ ] Content capped at 560px; at 900px the panel is centred, not stretched.
- [ ] `--dx` is 71px at 320px and exactly 96px at 430px.
- [ ] At 1023px the mobile composition still runs; at 1024px the desktop one
      takes over whole, with the banner overlap and the botanical panel.

### Accessibility

- [ ] Four `role="img"` regions; nothing inside them is focusable or announced
      individually. Tab from the heading above the take-off card lands on the
      next real control, not inside the depiction.
- [ ] Heading outline for the chapter reads h2 → h3, h3, h3.
- [ ] Contrast re-measured on the built page, not this document, and the D17
      escalation answered before sign-off. **Measure the mobile panel separately**
      — its surface is `--color-card-muted`, not `--color-pf-surface-300`.
- [ ] The `Premium proposals` eyebrow specifically: measured against the
      botanical-washed surface, not the flat one.
