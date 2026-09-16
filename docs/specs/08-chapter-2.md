# 08 — Chapter 2, Campaigns ("Win the job and the client, not just the quote.")

Source:

- Desktop — `Bramble Home Web.dc.html`,
  `<!-- ===== CHAPTER 2: CAMPAIGNS ===== -->`, lines 1085–1396. The panel is
  `#pf-radar`. CSS in the `<style>` block: the chapter shell at lines 256–257
  (`.pf-banner-fade`), and the whole replay system at lines 304–337
  (`pf-doc` / `pf-acc1..6` / `pf-hd1..6` / `pf-cursor` / `pf-scrub` / `pf-rec` /
  `pf-heat-a` / `pf-heat-b`, plus two dead rules — §3.1).
- Mobile — `Bramble Home Mobile.dc.html`, lines 457–577. CSS at lines 51–63.
  A different and much smaller composition: a **148px-wide** mini document
  viewport on a **14s** cycle with no accordion at all, a four-row timing list,
  and only two of the desktop's three cards.

This section carries the most intricate timing on the page: a **20-second**
document scroll synchronised to a six-group accordion, two heatmap overlays on
their own clocks, a cursor, a scrub bar and a 2-second recording pip — eleven
live keyframe sets, all infinite. §3 is the load-bearing part of this document.
An engineer must be able to rebuild the choreography from §3 alone, and QA must
be able to tell from §3.5 when it is wrong.

Two components, mutually exclusive by breakpoint:

- `<ChapterTwoDesktop>` — `hidden desk:block`
- `<ChapterTwoMobile>` — `desk:hidden`

They cannot be one component. Six accordion groups against zero, thirteen line
items against none, three cards against two, a 339px document viewport against a
148px one, a five-row timing table against a four-row one, a forest colour ramp
against an umber one, and two entirely separate animation systems on two
different clocks. `desk` = 1024px.

Because the two are gated by `display:none`, **neither motion file needs a media
query of its own** — the same argument as §05.

---

## 1. The chapter shell  **[shared with `06-chapter-1.md`]**

Chapters 1, 2 and 3 use one shell: a full-bleed banner photograph with
`.banner-fade`, a panel pulled up underneath it on a negative margin, a blurred
vertically-mirrored copy of the same photograph filling the gap, and a
`.canvas-botanical` card on top. `06-chapter-1.md` specifies the shell in full
and is the reference; **build one `<ChapterShell>` component and parameterise
it.** This section records only chapter 2's own parameters.

### 1.1 Section and banner — desktop

```
section: margin:0 auto; width:100%; max-width:1280px;
         display:flex; flex-direction:column;
         overflow:hidden; border-radius:8px; padding:96px 0 96px
banner:  position:relative; z-index:20; height:520px;
         overflow:visible; padding:56px 0 0 56px
```

Note the section has **no horizontal padding** — unlike the before/after band's
`px-6`. The banner is the full 1280px. `border-radius:8px` on a section whose
children are `overflow:hidden` at 12px is inert; drop it from our markup and
reproduce the render (§02 ruling 3 precedent).

Inside the banner, the photo layer:

```html
<div class="banner-fade" style="position:absolute;inset:0;overflow:hidden;border-radius:12px 12px 0 0">
  <div style="position:absolute;inset-inline:0;top:-20%;height:130%;transform:translateY(-70px)">
    <img src="/images/photo-3.webp" alt=""
         style="width:100%;height:100%;object-fit:cover;object-position:center 45%">
  </div>
</div>
```

**Chapter 2's shell parameters, and the only things that differ from chapter 1:**

| Parameter | Chapter 2 value |
|---|---|
| Image | `/images/photo-3.webp` |
| `object-position` | `center 45%` |
| Inner wrapper offset | `top:-20%; height:130%; transform:translateY(-70px)` |
| Banner height | `520px` |
| Banner padding | `56px 0 0 56px` |
| Heading | `<h1 class="pf-h1">` → **our `<h2 class="display display-1">`** (§8.2) |
| Heading colour / cap | `var(--pf-ink-100)`, `max-width:820px` |
| Overlap | `margin-top:-300px` |
| Panel padding | `240px 32px 48px` |
| Card padding | `48px` |

`.banner-fade` is already ported to `styles/base.css` verbatim — the
`mask-image` and the forest `::after` veil. Do not re-declare it.

Banner copy, verbatim:

> `Win more jobs, without the late-night admin.`

`.pf-h1` is `2.75rem/1.14/-.01em` → `4rem` at ≥768px → `4.75rem` at ≥1024px, in
Fraunces at `"wght" 420, "SOFT" 100, "WONK" 0, "opsz" 10`. That is our
`.display .display-1`. Measured at every desk width: **76px**, and the `<h2>`
box measures **820px** — the `max-width` binds, the text wraps to two lines at
every width from 1024 to 1440. No `text-wrap` property; leave it alone, the
`max-width` is doing the work.

### 1.2 Panel and mirror — desktop

```
panel:  position:relative; margin-top:-300px; overflow:hidden;
        border-radius:0 0 12px 12px; padding:240px 32px 48px
mirror: pointer-events:none; position:absolute; inset:0;
        overflow:hidden; border-radius:12px
  inner: position:absolute; inset:0; top:-25%; height:150%;
         transform:scaleY(-1); filter:blur(40px)
    img: photo-3, width:100%; height:100%; object-fit:cover
```

The banner is 520px tall and the panel pulls up 300px, so **220px of the
photograph is visible** above the panel's top edge, and the panel's first 240px
of padding is the blurred mirror showing through. `alt=""` on both images.

`filter:blur(40px)` on a full-width element is the single most expensive paint
in this section. It is static — `will-change` is wrong here; leave it.

### 1.3 The botanical card — desktop

```
position:relative; z-index:30; display:flex; flex-direction:column;
background:var(--pf-surface-300); border-radius:12px; padding:48px
```

`.canvas-botanical` is already in `styles/base.css`. Measured widths, which the
whole rest of this document depends on:

| Viewport | section | card | `#pf-radar` | each column |
|---|---|---|---|---|
| 1440 | 1280 | 1216 | **1120** | **548** |
| 1280 | 1280 | 1216 | **1120** | **548** |
| 1244 | 1180 | 1116 | 1084 | 530 |
| 1024 | 1024 | 960 | 864 | 420 |

At 1280 and above the composition is frozen at its authored size because the
section caps at `max-width:1280px`.

### 1.4 Header block — desktop

```
stack:   position:relative; display:flex; flex-direction:column;
         align-items:center; gap:24px
heading: display:flex; flex-direction:column; gap:6px;
         align-items:center; text-align:center
```

**Eyebrow** — `<span data-anim="up-blur" data-duration="0.5">`:

```
margin-bottom:4px; font-size:12px; font-weight:800; letter-spacing:.14em;
text-transform:uppercase; color:var(--pf-lime-500)
```

> `SALES ASSISTANT`

`--pf-lime-500` in the artboard is the **dark olive** `#95B225`, not the bright
chip (see the naming note in `globals.css`). Measured on the rendered artboard:
**2.26:1** against `#F8F7F2`. This is the exact failure the client already ruled
on — **use `--color-eyebrow` (`#657919`, 4.59:1 measured)**. No new escalation.

**H3** — `<h3 class="pf-h3" data-anim="up-blur" data-delay="0.05"
data-duration="0.5" style="color:var(--pf-ink-900)">`. `.pf-h3` is
`1.5rem/1.2/-.018em` → `1.75rem` at ≥768px; measured **28px**. That is our
`.display .display-3`. Copy, verbatim:

> `Win the job and the client, not just the quote.`

**Body** — `<p data-anim="up-blur" data-delay="0.1" data-duration="0.5">`:

```
margin-top:6px; max-width:64ch; font-size:18px; color:var(--pf-ink-900)
```

Copy, verbatim (note the em dash and the curly apostrophe — both stay, §9 D19):

> `Bramble knows the moment a client opens your quote, then hands you a heatmap
> of what they read and a replay of every visit — how long they sat on each
> section, and what they keep coming back to. You’re ready to close the deal.`

Use `<Reveal anim="up-blur" duration={0.5} delay={…}>` for all three, per
`styles/motion/reveal.css`.

### 1.5 The two-card row — desktop

```html
<div id="pf-radar" data-anim="scale" data-duration="0.5"
     style="display:flex;flex-wrap:nowrap;align-items:stretch;gap:24px;
            width:100%;font-family:var(--font-sans)">
```

`var(--font-sans)` resolves to Hanken Grotesk via the artboard's
`tokens/fonts.css` (RULINGS §01 ruling 9, measured and settled). **Map to
`--font-ui`**, and `var(--font-serif)` inside the cards to `--font-ui-serif`.
This whole panel is a product-UI recreation, which is exactly what those two
faces are for.

`flex-wrap:nowrap` on the outer row — the two cards **never** stack. Both are
`flex:1 1 0`, so they are equal halves of `#pf-radar`: **548px** at ≥1280.

Card 1 is the replay viewport (§2). Card 2 is a `flex:1 1 0` column containing
"How to close the deal" (§5) and "Get paid" (§6) with `gap:12px`.

---

## 2. Card 1 — the replay viewport

```
display:flex; min-width:0; flex:1 1 0; flex-direction:column;
overflow:hidden; border-radius:12px; background:#fff
```

No shadow, no border — the surface-300/white value step is the elevation, per
`brand.md`.

### 2.1 Card chrome bar

```
border-bottom:1px solid var(--color-border,#DFD8C8);
background:var(--color-card-muted,#E6E0CC);
padding:14px 20px
```

`--color-border` is our `--color-hairline`. Title row:
`display:flex; flex-wrap:wrap; align-items:center; gap:8px`.

**Title** — `<h3>` → **our `<h4>`** (§8.2):

```
margin:0; display:flex; align-items:center; gap:10px;
font-family:var(--font-serif); font-weight:600; font-size:19px;
color:var(--color-ink,#16321E)
```

Leading medallion, `aria-hidden`:

```
display:grid; place-items:center; flex:0 0 auto; height:26px; width:26px;
border-radius:9999px; background:var(--color-lime-500,#C8E84A);
font-family:var(--font-sans); font-size:12.5px; font-weight:700;
color:var(--color-forest-900,#15301F)
```

> `1`

Title copy, verbatim:

> `How Sarah H. read the quote`

**Badge**:

```
display:inline-flex; align-items:center; gap:5px; border-radius:6px;
background:var(--color-forest-100,#CDDFD3); padding:3px 9px;
font-family:var(--font-sans); font-size:11.5px; font-weight:600;
letter-spacing:.05em; text-transform:uppercase;
color:var(--color-forest-800,#1F4934)
```

> `Heatmap`

`gap:5px` on a badge with one child — inert, drop it (§02 ruling 3).

**Sub-line** — `<span>`:

```
margin-top:3px; display:block; font-family:var(--font-sans);
font-size:12.5px; color:var(--color-slate-500,#6E7669)
```

Copy, verbatim, including the nested nowrap span:

> `V2 · four opens over three days · 5m 16s all up · ` +
> `<span style="white-space:nowrap;color:var(--color-forest-700,#2C5539);font-weight:600">Watch the replay</span>`

`5m 16s` is `READING.totalTime` and `four` is `READING.opens`. Reference them
from `content/home.ts`; do not retype. The trailing span is styled as a link and
is **not** one — no `href`, no handler. Leave it as a span (RULINGS §01: the
client declined destinations). It adds **zero** tab stops.

**Contrast, measured: `#6E7669` on `#E6E0CC` is 3.57:1 and fails.** See §8.3.

### 2.2 Card body

```
display:flex; flex-direction:column; gap:16px; padding:16px 20px 18px
```

One child: the inner row.

```
display:flex; flex-wrap:wrap; align-items:flex-start; gap:14px
```

Two children: the replay frame (`min-width:300px; flex:1 1 330px`) and the
section-timing table (`min-width:138px; flex:1 1 146px`).

**Measured, and this matters (§7.1): `flex-wrap:wrap` is live.** The row breaks
whenever its width falls below `330 + 14 + 146 = 490px`, which happens at
**viewport < 1244px**:

| Viewport | row | frame | table | wrapped |
|---|---|---|---|---|
| 1440 / 1280 | 508 | **339** | **155** | no |
| 1246 | 491 | 330.5 | 146.5 | no |
| 1244 | 490 | 330 | 146 | no |
| **1243** | 489.5 | **489.5** | 489.5 | **yes** |
| 1024 | 380 | 380 | 380 | yes |

Below 1244px the table drops under the frame and the frame goes full width.
Ruled in §7.1.

### 2.3 The replay frame

```
position:relative; min-width:300px; flex:1 1 330px;
display:flex; flex-direction:column; overflow:hidden; border-radius:6px;
background:#fff; box-shadow:0 0 0 1px var(--color-border,#DFD8C8)
```

Measured **339 × 409.75px** at every viewport ≥1244. Three stacked children plus
two absolutely-positioned layers:

1. the replay chrome bar (26px tall),
2. the document clip (`position:relative; height:352px; overflow:hidden`)
   containing `.pf-doc-track` and the cursor,
3. the scrub bar (~31.75px tall),
4. **the nine heat blobs**, which are siblings of 1–3, positioned against the
   **frame** (339 × 409.75) and clipped by its `overflow:hidden`.

The frame's box is width-invariant above 1244 and **height-invariant at
409.75px everywhere**, which is why `pf-doc`'s hard px offsets survive the whole
desk range (§3.2).

### 2.4 Replay chrome bar

```
display:flex; align-items:center; gap:7px;
border-bottom:1px solid var(--color-border,#DFD8C8);
background:var(--color-well,#F6F4EC); padding:7px 10px
```

| Element | Style | Copy |
|---|---|---|
| Rec pip | `class="pf-rec"`, `flex:none; width:6px; height:6px; border-radius:9999px; background:var(--color-rust,#96602B)` | — |
| Label | `font-family:var(--font-sans); font-size:9.5px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--color-slate-700,#35402F)` | `Replay` |
| Visit | `font-size:9.5px; color:var(--color-slate-500,#6E7669)` | `visit 4 of 4` |
| Elapsed | `margin-left:auto; font-size:9.5px; font-variant-numeric:tabular-nums; color:var(--color-slate-500,#6E7669)` | `2:14` |

`border-radius:9999px` on a 6px box → use `rounded-full` (§02 ruling 6
precedent).

`2:14` is **not** `TAKEOFF.elapsed` even though the string matches. It is the
length of visit 4. Do not wire it to `content/home.ts` — a coincidence, and
§9 D14 flags it.

### 2.5 The mock proposal — every line, verbatim

`.pf-doc-track` — `position:absolute; inset:0 0 auto`. Measured natural height
**483.25px** with all groups closed, **553.75px** with group 4 open. Two blocks.

#### 2.5.1 Document header (150px)

```
position:relative; overflow:hidden; height:150px;
background:var(--color-forest-900,#15301F)
```

- `<img src="/images/photo-1.webp" alt="">`, `position:absolute; inset:0;
  width:100%; height:100%; object-fit:cover`
- Veil span, `position:absolute; inset:0`, background verbatim:

```css
linear-gradient(24deg,
  color-mix(in oklab,var(--color-forest-900,#15301F) 90%,transparent) 4%,
  color-mix(in oklab,var(--color-forest-900,#15301F) 42%,transparent) 52%,
  color-mix(in oklab,var(--color-forest-900,#15301F) 6%,transparent))
```

- Text block, `position:relative; padding:14px 16px`:

| Line | Style | Copy |
|---|---|---|
| Reference | `font-family:var(--font-sans); font-size:11.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--color-cream,#E8E4D2)` | `Q-1042 · Coogee` |
| Address | `margin-top:3px; font-family:var(--font-serif); font-weight:600; font-size:22px; line-height:1; color:#fff` | `14 Beach Rd` |
| Client | `margin-top:3px; font-family:var(--font-sans); font-size:11.5px; color:var(--color-cream,#E8E4D2)` | `Prepared for Sarah Henderson` |

All three are `QUOTE.reference`, `QUOTE.suburb`, `QUOTE.address`,
`QUOTE.client`. Compose from `content/home.ts`.

#### 2.5.2 Scope block

```
padding:14px 16px 14px
```

Section heading:

```
font-family:var(--font-sans); font-size:11.5px; letter-spacing:.2em;
text-transform:uppercase; color:var(--color-slate-500,#6E7669);
padding-bottom:5px; border-bottom:1.5px solid var(--color-forest-800,#1F4934)
```

> `Scope of works`

Then `<div style="padding-top:4px">` holding six groups. Groups 2–6 each sit in a
wrapper with `border-top:1px solid var(--color-slate-100,#E5E8E5)`; group 1 has
none. Groups **4 and 6** additionally carry `position:relative` and a heat blob
as their first child (§3.8).

**Group header** — one per group, `class="pf-hd"`, `animation-name:pf-hdN`:

```
display:flex; align-items:center; gap:5px; border-radius:3px;
padding:7px 4px; margin:0 -4px
```

Three children: a 5px category dot (`flex:none; width:5px; height:5px;
border-radius:9999px; background:<dot>`, `aria-hidden`), the label
(`min-width:0; flex:1; font-family:var(--font-sans); font-size:12.5px;
color:var(--color-slate-700,#35402F); white-space:nowrap; overflow:hidden;
text-overflow:ellipsis`), and the amount (`flex:none;
font-family:var(--font-serif); font-weight:600; font-size:12.5px;
color:var(--color-ink,#16321E)`). Measured height **32.75px** each.

`border-radius:3px` is off the 4/6/8/12 scale — ship as drawn, log
(§01 ruling 8 precedent).

**Accordion body** — `class="pf-acc"`, `animation-name:pf-accN`,
`overflow:hidden`. Each line item:

```
display:flex; align-items:baseline; gap:5px; padding:3px 0 3px 14px
```

with three children: label (`min-width:0; flex:1; font-size:11.5px;
line-height:1.5; color:var(--color-slate-500,#6E7669)`, nowrap + ellipsis),
quantity (`flex:none; font-size:11px; color:var(--color-slate-400,#8A9082)`) and
money (`flex:none; font-size:11.5px; font-variant-numeric:tabular-nums;
color:var(--color-slate-500,#6E7669)`). All `var(--font-sans)`.

Measured line-item height **23.25px**; a two-item body is **46.5px**, a
three-item body **69.75px**. See §9 D9 — the keyframes declare 61px and 87px.

**All six groups and all thirteen line items, verbatim:**

| # | Group | Dot | Amount | Line items |
|---|---|---|---|---|
| 1 | `Demolition & Site Clearing` | `#8A7A65` `--color-cat-demolition` | `$4,200` | `Remove concrete driveway` · `96 m²` · `$5,760`<br>`Strip old planting beds` · `1 lot` · `$1,340` |
| 2 | `Excavation & Earthworks` | `#6F5B45` `--color-cat-excavation` | `$6,480` | `Bulk excavation to level` · `48 m³` · `$3,840`<br>`Cart away spoil` · `36 t` · `$2,640` |
| 3 | `Retaining & Structures` | `#B89270` `--color-cat-retaining` | `$7,920` | `Treated pine retaining` · `18 lm` · `$5,616`<br>`Bluestone steps, sawn tread` · `4 no.` · `$1,560` |
| 4 | `Paving & Stonework` | `#A8A296` `--color-cat-paving` | `$14,880` | `Sawn bluestone, laid to pattern` · `48 m²` · `$3,763`<br>`Stepping pavers on pebble` · `14 m²` · `$1,344`<br>`Compacted base and mortar bed` · `62 m²` · `$2,108` |
| 5 | `Turf, Soil & Planting` | `#8FB57E` `--color-cat-planting` | `$9,400` | `Sir Walter instant turf` · `84 m²` · `$3,738`<br>`Advanced screen planting` · `26 lm` · `$4,888` |
| 6 | `Irrigation` | `#9CB4C7` `--color-cat-irrigation` | `$5,320` | `Dripline to garden beds` · `1 lot` · `$3,180`<br>`Controller and solenoids` · `1 lot` · `$2,140` |

All six dots map exactly onto the taxonomy tokens already in `globals.css`.
`--color-cat-excavation` is currently **declared and used by nothing** — this
section is its only call site.

**`SCOPE` in `content/home.ts` is five groups and omits Excavation**, so it sums
to `$41,720`, not `$48,200`. The six groups above sum to **exactly `$48,200`** =
`QUOTE.total`. Extend `SCOPE` with the Excavation row rather than retyping any
of this; the mobile composition (§7.2) is the five-row subset that already
matches today's array, plus Retaining, and both breakpoints must read from one
list.

**Totals row:**

```
margin-top:10px; display:flex; align-items:baseline; justify-content:flex-end;
gap:7px; border-top:1px solid var(--color-border,#DFD8C8); padding-top:9px
```

| Element | Style | Copy |
|---|---|---|
| Label | `font-size:11.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--color-slate-500,#6E7669)` | `Total inc. GST` |
| Figure | `font-family:var(--font-serif); font-weight:600; font-size:17px; color:var(--color-ink,#16321E)` | `$48,200` = `QUOTE.total` |

The figure has **no** `font-variant-numeric:tabular-nums` where every smaller
money figure does. Inconsistent; ship as drawn (§9 D13).

**Accept button:**

```
margin-top:11px; display:grid; place-items:center; height:20px;
border-radius:4px; background:var(--color-lime-500,#C8E84A);
font-family:var(--font-sans); font-size:12.5px; font-weight:600;
color:var(--color-forest-900,#15301F)
```

> `Accept this quote`

A `<div>`, not a button, and it is inside the `role="img"` depiction — leave it a
`<div>` (§8.1). Lime here is legitimate: it is the one primary action on the
depicted screen.

### 2.6 The nine heat blobs

Nine `<span aria-hidden>`, siblings of the chrome/clip/scrub stack, each:

```
position:absolute; left:<L>; top:<T>; width:<W>; aspect-ratio:1/1;
transform:translate(-50%,-50%); border-radius:9999px;
background:<colour>; opacity:<O>; filter:blur(10px); mix-blend-mode:multiply
```

Percentages resolve against the **frame** (339 × 409.75). Measured at 1280/1440:

| # | left | top | width | Colour | Opacity | Rendered px | Centre (x, y) in frame |
|---|---|---|---|---|---|---|---|
| 1 | `30%` | `27%` | `11.5%` | `--color-forest-300` `#8FA886` | `0.25` | 39.0 | 101.7, 110.6 |
| 2 | `47%` | `38%` | `13.0%` | `--color-forest-500` `#4D8F6C` | `0.55` | 44.1 | 159.3, 155.7 |
| 3 | `52%` | `47%` | `18.0%` | `--color-forest-900` `#15301F` | `0.8` | 61.0 | 176.3, 192.6 |
| 4 | `43%` | `50%` | `16.0%` | `--color-forest-900` `#15301F` | `0.8` | 54.2 | 145.8, 204.9 |
| 5 | `61%` | `45%` | `14.0%` | `--color-forest-500` `#4D8F6C` | `0.55` | 47.5 | 206.8, 184.4 |
| 6 | `49%` | `60%` | `12.0%` | `--color-forest-300` `#8FA886` | `0.25` | 40.7 | 166.1, 245.8 |
| 7 | `66%` | `77%` | `17.0%` | `--color-forest-900` `#15301F` | `0.8` | 57.6 | 223.7, 315.5 |
| 8 | `55%` | `80%` | `14.0%` | `--color-forest-500` `#4D8F6C` | `0.55` | 47.5 | 186.4, 327.8 |
| 9 | `50%` | `88%` | `12.5%` | `--color-forest-300` `#8FA886` | `0.25` | 42.4 | 169.5, 360.6 |

Order matters: they paint in source order, and 3/4/7 (the forest-900 pair and
the lower dark one) land on top of 2/5/8. Keep the DOM order above.

They are **static** — no animation, ever. They do not scroll with the document
and they do not respond to `prefers-reduced-motion`. They also multiply over the
chrome bar and the top of the scrub bar. All three facts are in the render;
§9 D6 flags the conceptual problem.

The frame is the nearest element whose `overflow:hidden` clips them; the
`mix-blend-mode:multiply` blends against everything painted below inside
`#pf-radar`'s stacking context, which is what makes the document text darken
under them (§8.3).

### 2.7 The cursor

```html
<span class="pf-replay-cursor" aria-hidden
      style="position:absolute;left:56%;top:42%;width:13px;height:13px;
             border-radius:9999px;
             background:color-mix(in oklab,var(--color-forest-900,#15301F) 34%,transparent);
             box-shadow:0 0 0 5px color-mix(in oklab,var(--color-forest-900,#15301F) 8%,transparent)">
```

Inside the **document clip** (339 × 352), not the frame — so its percentages
resolve against 352px of height, not 409.75. The inline `left`/`top` are the
values the artboard's own reduced-motion block falls back to and they are **not**
on the keyframe path (§3.6, §4).

### 2.8 The scrub bar

```
display:flex; align-items:center; gap:8px;
border-top:1px solid var(--color-border,#DFD8C8);
background:var(--color-well,#F6F4EC); padding:7px 10px
```

Track: `position:relative; height:4px; min-width:0; flex:1;
border-radius:9999px; background:var(--color-card-muted,#E6E0CC)`.
Fill: `class="pf-replay-scrub"`, `position:absolute; inset:0 auto 0 0; width:0;
border-radius:9999px; background:var(--color-forest-700,#2C5539)`.
Label: `font-family:var(--font-sans); font-size:9px;
font-variant-numeric:tabular-nums; color:var(--color-slate-500,#6E7669)` →
`5:16`.

Note the scrubber is labelled with the **four-visit total** while the chrome bar
above it says the replay is visit 4, `2:14` long. §9 D14.

### 2.9 The section-timing table

```
min-width:138px; flex:1 1 146px
```

Measured **155px** at 1280/1440. Inner: `display:flex; flex-direction:column`.

**Header row:**

```
display:flex; align-items:center; justify-content:space-between; gap:8px;
border-bottom:1px solid var(--color-border,#DFD8C8); padding-bottom:8px;
font-family:var(--font-sans); font-size:11.5px; font-weight:600;
letter-spacing:.1em; text-transform:uppercase;
color:var(--color-slate-500,#6E7669)
```

Two `<span style="white-space:nowrap">` children: `Section` and `Time`.

**Rows** — `<ul style="list-style:none;margin:0;padding:0">`, each `<li>`:

```
display:flex; align-items:center; gap:10px;
border-bottom:1px solid color-mix(in oklab,var(--color-border,#DFD8C8) 45%,transparent);
padding:9px 0
```

with a swatch (`flex:none; width:9px; height:9px; border-radius:2px;
background:<c>`, `aria-hidden`), a label (`min-width:0; flex:1; font-size:14px;
color:var(--color-slate-700,#35402F)`) and a time (`flex:none; font-size:13px;
font-variant-numeric:tabular-nums`).

| # | Swatch | Label | Time | Time colour | Label weight |
|---|---|---|---|---|---|
| 1 | `--color-forest-900` `#15301F` | `Paving & Stonework` | `2m 40s` | `#35402F` | **600** |
| 2 | `--color-forest-900` `#15301F` | `Totals & acceptance` | `1m 12s` | `#6E7669` | 400 |
| 3 | `--color-forest-500` `#4D8F6C` | `Retaining & Structures` | `48s` | `#6E7669` | 400 |
| 4 | `--color-forest-300` `#8FA886` | `Scope of works` | `22s` | `#6E7669` | 400 |
| 5 | `--color-forest-100` `#CDDFD3` | `Irrigation` | `—` | `#6E7669` | 400 |

Row 1 is the only bold label and the only `#35402F` time — it is the "winner"
row, and it is what `READING.longestSection` / `READING.longestTime` hold.
Rows 1 and 2 share the same `forest-900` swatch despite different times (§9 D11).
Every `<li>` carries `border-bottom` including the last, so the list ends on a
hairline with no closing rule beneath the legend. In the render.

**Legend:**

```
margin-top:14px; display:flex; align-items:center; gap:8px;
font-family:var(--font-sans); font-size:12px; color:var(--color-slate-500,#6E7669)
```

Text node `Least time`, then the bar
(`aria-hidden`, `height:8px; min-width:0; flex:1; border-radius:9999px`):

```css
background: linear-gradient(to right,
  var(--color-forest-100,#CDDFD3),
  var(--color-forest-500,#4D8F6C),
  var(--color-forest-900,#15301F))
```

then text node `Most time`. `#6E7669` on white measures **4.71:1** — passes.

The gradient runs 100 → 500 → 900, i.e. **light = least**, which matches the
swatches. Colour is never the only channel: every row prints its time as well
(WCAG 1.4.1 satisfied — §8.4).

---

## 3. The 20-second system, in full

Ship as `styles/motion/chapter-2.css`, imported from `app/globals.css` after
`before-after.css`. Keyframes prefixed `bb-`, classes unprefixed, everything in
`@layer components`, reduced-motion block **last** — the house convention every
file in `styles/motion/` follows.

**No media query.** `<ChapterTwoDesktop>` is `hidden desk:block` and
`<ChapterTwoMobile>` is `desk:hidden`, so neither system's elements exist in
layout at the other's widths.

**1% of this cycle = 200ms.** Every number below converts with that.

### 3.1 What is live and what is dead

| Rule | Status |
|---|---|
| `@keyframes pf-doc` + `.pf-doc-track` | **live** — the markup uses `pf-doc-track` |
| `@keyframes pf-replay` + `.pf-replay-track` | **dead** — grepped the whole artboard: `pf-replay-track` appears on **zero** elements |
| `.pf-replay-track{transform:translateY(-39%)}` inside the reduced-motion block | **dead**, same reason |
| `pf-acc1..6`, `pf-hd1..6`, `.pf-acc`, `.pf-hd` | live, 6 elements each |
| `pf-heat-a`, `pf-heat-b` | live, 1 element each |
| `.pf-replay-cursor` / `pf-cursor` | live, 1 element |
| `.pf-replay-scrub` / `pf-scrub` | live, 1 element |
| `.pf-rec` / `pf-rec` | live, 1 element |
| `.pf-livepip` / `pf-livepip` | **not in this section** — the two call sites are at artboard lines 750 and 1059, both outside 1085–1396. Declared twice, identically, in the same `<style>` block; §05 already owns it |

`pf-replay` and `pf-doc` are two different drafts of the same idea — `pf-replay`
scrolls by percentage (`-8% / -23% / -39% / -54% / -66%`) on six plateaus,
`pf-doc` scrolls by pixels on six plateaus. The percentage version was
abandoned. **Do not port `pf-replay`, `.pf-replay-track`, or the
`.pf-replay-track` line in the reduced-motion block.** Recorded here so nobody
"restores" them (principle 1).

### 3.2 `pf-doc` — the document scroll

```css
@keyframes pf-doc{
  0%,16%  {transform:translateY(0)}
  22%,28% {transform:translateY(-40px)}
  34%,42% {transform:translateY(-80px)}
  47%,68% {transform:translateY(-150px)}
  72%,80% {transform:translateY(-170px)}
  84%,93% {transform:translateY(-179px)}
  100%    {transform:translateY(0)}
}
.pf-doc-track{animation:pf-doc 20s cubic-bezier(.5,0,.3,1) infinite}
```

`cubic-bezier(.5,0,.3,1)` is a slow-in/soft-out curve — it reads as a hand
flicking a scroll wheel, not a lerp. Six plateaus, five travels, one return:

| Travel | From → to | Window | Duration | Distance |
|---|---|---|---|---|
| 1 | 0 → −40px | 16% → 22% | 1200ms | 40px |
| 2 | −40 → −80px | 28% → 34% | 1200ms | 40px |
| 3 | −80 → −150px | 42% → 47% | **1000ms** | **70px** |
| 4 | −150 → −170px | 68% → 72% | 800ms | 20px |
| 5 | −170 → −179px | 80% → 84% | 800ms | 9px |
| return | −179 → 0 | 93% → 100% | 1400ms | 179px |

Travel 3 is the fast one — 70px in 1000ms — and it is the flick down into
Paving. Travel 5 is a 9px nudge; if it reads as a jump, the easing is wrong.

The offsets are **hard pixels tuned to the 339px frame**, and that is safe:
measured, the track is **483.25px** closed and **553.75px** with group 4 open at
**every** viewport from 1024 to 1440, because every row is single-line with
`text-overflow:ellipsis`. The clip is 352px, so the deepest legal scroll with
group 4 open is 201.75px and `−179px` sits comfortably inside it.

### 3.3 `pf-acc1..6` — the accordions

```css
@keyframes pf-acc1{0%,6% {max-height:0;opacity:0} 9%,16% {max-height:61px;opacity:1} 19%,100%{max-height:0;opacity:0}}
@keyframes pf-acc2{0%,18%{max-height:0;opacity:0} 21%,28%{max-height:61px;opacity:1} 31%,100%{max-height:0;opacity:0}}
@keyframes pf-acc3{0%,30%{max-height:0;opacity:0} 33%,42%{max-height:61px;opacity:1} 45%,100%{max-height:0;opacity:0}}
@keyframes pf-acc4{0%,44%{max-height:0;opacity:0} 47%,68%{max-height:87px;opacity:1} 71%,100%{max-height:0;opacity:0}}
@keyframes pf-acc5{0%,70%{max-height:0;opacity:0} 73%,80%{max-height:61px;opacity:1} 83%,100%{max-height:0;opacity:0}}
@keyframes pf-acc6{0%,82%{max-height:0;opacity:0} 85%,90%{max-height:61px;opacity:1} 93%,100%{max-height:0;opacity:0}}
```

### 3.4 `pf-hd1..6` — the header highlights

```css
@keyframes pf-hd1{0%,6% {background:transparent} 9%,16% {background:var(--color-well,#F6F4EC)} 19%,100%{background:transparent}}
@keyframes pf-hd2{0%,18%{background:transparent} 21%,28%{background:var(--color-well,#F6F4EC)} 31%,100%{background:transparent}}
@keyframes pf-hd3{0%,30%{background:transparent} 33%,42%{background:var(--color-well,#F6F4EC)} 45%,100%{background:transparent}}
@keyframes pf-hd4{0%,44%{background:transparent} 47%,68%{background:var(--color-well,#F6F4EC)} 71%,100%{background:transparent}}
@keyframes pf-hd5{0%,70%{background:transparent} 73%,80%{background:var(--color-well,#F6F4EC)} 83%,100%{background:transparent}}
@keyframes pf-hd6{0%,82%{background:transparent} 85%,90%{background:var(--color-well,#F6F4EC)} 93%,100%{background:transparent}}
```

Shared driver, verbatim:

```css
.pf-acc,.pf-hd{
  animation-duration:20s;
  animation-timing-function:cubic-bezier(.32,.72,0,1);
  animation-iteration-count:infinite;
  animation-fill-mode:both}
```

`cubic-bezier(.32,.72,0,1)` is a hard ease-out — the body is 90% open in the
first third of its 600ms travel. Each group's `animation-name` is set inline on
the element (`animation-name:pf-accN` / `pf-hdN`); keep that shape, it is what
makes one driver rule serve twelve elements.

The **highlight and the body are perfectly in phase** — every `pf-hdN` uses the
same six percentages as its `pf-accN`. They must stay coupled; a one-percent
drift shows up as the row tinting before it opens.

Every group's timings, and the whole cycle at a glance:

| Group | Open starts | Fully open | Closes | Fully closed | Dwell | Doc offset while open |
|---|---|---|---|---|---|---|
| 1 Demolition | 6% (1200ms) | 9% (1800ms) | 16% (3200ms) | 19% (3800ms) | **1400ms** | 0 |
| 2 Excavation | 18% (3600ms) | 21% (4200ms) | 28% (5600ms) | 31% (6200ms) | **1400ms** | −40px |
| 3 Retaining | 30% (6000ms) | 33% (6600ms) | 42% (8400ms) | 45% (9000ms) | **1800ms** | −80px |
| **4 Paving** | 44% (8800ms) | **47% (9400ms)** | **68% (13600ms)** | 71% (14200ms) | **4200ms** | **−150px** |
| 5 Turf | 70% (14000ms) | 73% (14600ms) | 80% (16000ms) | 83% (16600ms) | **1400ms** | −170px |
| 6 Irrigation | 82% (16400ms) | 85% (17000ms) | 90% (18000ms) | 93% (18600ms) | **1000ms** | −179px |

**Every gap between one group closing and the next opening is exactly 2% =
400ms**, and in those 400ms the document is always empty of open groups. That
regularity is the metronome the whole piece hangs off; an uneven gap is a bug.

### 3.5 The choreography in plain terms

The argument the card makes is: *the client scrolled the quote and stopped on
the paving.* The scroll and the accordion are one gesture — the document moves,
the row under the cursor lights up, its detail opens, then closes, then the
document moves again.

- **0 → 1200ms.** Document at rest at the top: photo header, `Scope of works`,
  six closed group headers. No highlight. Scrub at 0. Rec pip blinking.
- **1200 → 3800ms.** Group 1 (`Demolition & Site Clearing`) tints to
  `#F6F4EC` and opens two line items; holds **1400ms**; closes.
- **3200 → 4400ms.** The document flicks down **40px** while group 1 is still
  collapsing. The two overlap on purpose — it reads as the reader scrolling past
  something they have finished with.
- **3600 → 6200ms.** Group 2 (`Excavation & Earthworks`), same 1400ms shape.
- **5600 → 6800ms.** Another **40px**.
- **6000 → 9000ms.** Group 3 (`Retaining & Structures`) holds slightly longer:
  **1800ms**. The table beside the card says `Retaining & Structures 48s`, third
  on the list — the dwell is ranked correctly against groups 1, 2, 5 and 6.
- **4400 → 8400ms.** Underneath all of this, heat blob A fades up over the
  Paving group (36% = 7200ms at full). **It arrives 2200ms before the Paving
  accordion opens** — the heatmap marks the hot section before the replay
  reaches it. That lead is deliberate; losing it flattens the whole idea.
- **8400 → 9400ms.** The fast travel: **70px in 1000ms**, the flick down into
  Paving.
- **8800 → 14200ms. The dwell.** Group 4 (`Paving & Stonework`) opens
  **three** line items — the only group with three — and holds **4200ms**,
  exactly **three times** any of groups 1, 2, 5, and **4.2×** group 6. This is
  the entire point of the section: the number beside it in the table is
  `2m 40s` (`READING.longestTime`), against `1m 12s`, `48s` and `22s`. Heat
  blob A is at full opacity for all of it.
- **9200 → 11600ms.** Heat blob B fades up over `Irrigation`, further down the
  document.
- **13600 → 14000ms.** Group 4 closes, the document nudges **20px**.
- **14000 → 16600ms.** Group 5 (`Turf, Soil & Planting`), 1400ms.
- **16000 → 16800ms.** A **9px** nudge — the document is nearly at the bottom.
- **16400 → 18600ms.** Group 6 (`Irrigation`), the shortest dwell at
  **1000ms**, matching its `—` in the table.
- **16800 → 18600ms.** Heat A fades out and shrinks to `scale(.8)`; heat B holds
  to 90% then fades.
- **18800ms (94%).** The scrub bar reaches 100% and holds full for the last
  1200ms.
- **18600 → 20000ms.** The document returns **179px** to the top over 1400ms and
  the cycle restarts. The return is the only long travel and it is meant to read
  as a rewind.

**It is wrong if:** the highlight tints a row that is not opening; any gap
between one group closing and the next opening is not 400ms; group 4 does not
hold visibly about three times as long as groups 1, 2 and 5; the document moves
while a group is fully open (it never does — every travel window sits in a
closed-or-closing gap); heat blob A appears *after* group 4 opens rather than
2.2 seconds before; the scrub bar is not linear; or the final travel is a jump
rather than a 1400ms rewind.

### 3.6 `pf-cursor` — the pointer

```css
.pf-replay-cursor{animation:pf-cursor 20s ease-in-out infinite}
@keyframes pf-cursor{
  0%  {left:34%;top:32%}
  12% {left:46%;top:46%}
  26% {left:28%;top:38%}
  42% {left:41%;top:52%}
  56% {left:52%;top:44%}
  70% {left:31%;top:58%}
  84% {left:44%;top:66%}
  100%{left:34%;top:32%}
}
```

Eight stops, evenly-ish spaced, `ease-in-out` on each leg so it drifts and
settles rather than tracking. Percentages resolve against the **document clip**
(339 × 352 at ≥1244), and they set the box's top-left corner of a 13px dot, so
the visible centre is offset +6.5px on both axes.

Measured, so the harness has ground truth:

| t | `left` computed | `top` computed | Centre as % of clip |
|---|---|---|---|
| 0 | 115.25px | 112.63px | 35.9 / 33.8 |
| 1800 | 150.67px | 155.55px | 46.4 / 46.0 |
| 4400 | 105.27px | 138.53px | 33.0 / 41.2 |
| 6800 | 116.95px | 158.39px | 36.4 / 46.8 |
| 9400 | 148.91px | 175.55px | 45.8 / 51.7 |
| **11000** | **175.91px** | **155.16px** | **53.8 / 45.9** |
| 17400 | 139.23px | 197.27px | 43.0 / 57.9 |

The cursor is **not** synchronised to the accordion — it wanders on its own
clock and only loosely tracks the document. That is authored: a real replay
cursor does not sit on the thing it is reading. Do not "fix" it into alignment.

`left`/`top` are layout properties, so this is one small layout + paint per
frame on a 13px box inside a 339×352 clip. Measured cost is negligible and
rewriting it as a `transform` would change what the percentages resolve against.
**Keep `left`/`top`.**

### 3.7 `pf-scrub` and `pf-rec`

```css
.pf-replay-scrub{animation:pf-scrub 20s linear infinite}
@keyframes pf-scrub{0%{width:0} 94%,100%{width:100%}}

.pf-rec{animation:pf-rec 2s ease-in-out infinite}
@keyframes pf-rec{0%,100%{opacity:1} 50%{opacity:.25}}
```

The scrub is the only **linear** thing in the section — it is a clock, and an
eased clock reads as broken. It reaches full at **18800ms** and holds for the
last 1200ms while the document is still rewinding.

`pf-rec` is on its own 2s cycle. 20 ÷ 2 = 10 exactly, so it **does** stay in
phase with the master loop and completes exactly ten blinks per cycle — a fact
QA can rely on. Frequency 0.5Hz, far below the 3Hz WCAG 2.3.1 threshold.

### 3.8 `pf-heat-a` and `pf-heat-b` — the two hot rows

The two spans, verbatim. **A** is the first child of the **Paving** wrapper,
**B** the first child of the **Irrigation** wrapper; both wrappers carry
`position:relative` for them:

```html
<!-- A, on Paving & Stonework -->
<span class="pf-heat pf-heat-a" aria-hidden
      style="position:absolute;left:-4%;top:-6px;width:108%;height:calc(100% + 12px);
             border-radius:9999px;
             background:radial-gradient(ellipse at center,rgba(110,65,25,.58),rgba(110,65,25,.24) 55%,transparent 80%);
             filter:blur(6px);pointer-events:none;z-index:1"></span>

<!-- B, on Irrigation -->
<span class="pf-heat pf-heat-b" aria-hidden
      style="position:absolute;left:-4%;top:-6px;width:108%;height:calc(100% + 10px);
             ...identical gradient, blur and z-index...">
```

`rgba(110,65,25,…)` is `--color-umber` `#6E4119` — the data tone, correctly used.
Note `calc(100% + 12px)` on A against `calc(100% + 10px)` on B with the same
`top:-6px`: a 2px asymmetry, §9 D10.

`z-index:1` puts both blobs **over** the row's text, not behind it. That is what
produces the contrast collapse in §8.3.

```css
@keyframes pf-heat-a{0%,22%{opacity:0;transform:scale(.6)} 36%,70%{opacity:1;transform:scale(1)} 84%,100%{opacity:0;transform:scale(.8)}}
@keyframes pf-heat-b{0%,46%{opacity:0;transform:scale(.6)} 58%,90%{opacity:1;transform:scale(1)} 100%{opacity:0}}
.pf-heat-a{animation:pf-heat-a 20s ease-in-out infinite}
.pf-heat-b{animation:pf-heat-b 20s ease-in-out infinite}
```

| | In starts | Full from | Full to | Out ends | Exit scale |
|---|---|---|---|---|---|
| A (Paving) | 22% (4400ms) | 36% (7200ms) | 70% (14000ms) | 84% (16800ms) | `scale(.8)` |
| B (Irrigation) | 46% (9200ms) | 58% (11600ms) | 90% (18000ms) | 100% (20000ms) | **none declared** |

B declares no `transform` at 100%, so it fades at `scale(1)` while A shrinks.
Asymmetric; §9 D10.

A's window (4400 → 16800ms) brackets group 4's dwell (8800 → 14200ms) on both
sides — 4400ms of lead, 2600ms of trail. That framing is the effect.

### 3.9 The reduced-motion resting state  **[Designer decision]**

**The artboard's own block is broken in the same way §05's was and must not be
ported verbatim:**

```css
/* artboard, lines 323 and 335-338 — do NOT port as-is */
@media(prefers-reduced-motion:reduce){.pf-heat{animation:none!important;opacity:1!important}}
@media(prefers-reduced-motion:reduce){
  .pf-acc,.pf-hd,.pf-replay-track,.pf-doc-track,.pf-replay-cursor,.pf-replay-scrub,.pf-rec{animation:none!important}
  .pf-replay-track{transform:translateY(-39%)}
  .pf-doc-track{transform:translateY(-150px)}
  .pf-acc{max-height:none;opacity:1}
  .pf-replay-scrub{width:55%}
}
```

Two of its five pins are right and three are wrong:

- **Right.** `.pf-doc-track{transform:translateY(-150px)}` is the 47–68% plateau
  and `.pf-replay-scrub{width:55%}` is 11000ms — **55% of 20s sits inside
  47–68%, so the two agree.** The frame the author chose is `t = 11000ms`: the
  Paving dwell, the argument the section makes. Keep it.
- **Wrong.** `.pf-acc{max-height:none;opacity:1}` opens **all six** groups at
  once. Measured, that makes the document 789px tall against the live frame's
  553.75px, pinned at a `−150px` offset computed for the 553.75px version — so
  the reduced-motion render shows a completely different slice of the document
  from the live one. It is the same smear as §05's `opacity:1!important`.
- **Wrong.** `.pf-hd{animation:none}` with nothing else leaves **no** header
  highlighted, so the one group that is open is not the one that is marked.
- **Wrong.** `.pf-replay-cursor{animation:none}` falls back to the inline
  `left:56%; top:42%`, which is **not** on the keyframe path. At 11000ms the
  cursor is at `left:51.9%; top:44.1%` — a 14px / 7px error on a 13px dot.
- **Dead.** The `.pf-replay-track` selector and its `-39%` pin (§3.1).

**The resting state is `t = 11000ms` (55%)**, pinned explicitly:

- It is the frame the artboard's own two correct pins already describe.
- It is the **Paving dwell**, which is the longest hold in the loop (4200ms), so
  a reduced-motion user sees the frame a motion user spends the most time on.
- It is the frame the section-timing table beside it is describing, and the
  frame the mobile composition's own resting state also lands on (§7.4) — both
  breakpoints then agree, which is what made §05's choice worth making.

Two values are rounded from mid-tween to their adjacent keyframe so the state is
*defined* rather than interpolated, which is what the harness needs:
`pf-heat-b` is at `opacity:.871; scale(.948)` at 11000ms and is pinned to its
58% keyframe (`1` / `scale(1)`, reached 600ms later); the cursor is pinned to its
56% keyframe (`left:52%; top:44%`, reached 200ms later, and 0.1% / 0.1% from the
measured 11000ms value).

Ship:

```css
@media (prefers-reduced-motion: reduce) {
  .doc-track,
  .acc,
  .acc-head,
  .heat,
  .replay-cursor,
  .replay-scrub,
  .rec-pip {
    animation: none !important;
  }

  /* The 47-68% plateau: the document scrolled to the Paving group. */
  .doc-track {
    transform: translateY(-150px) !important;
  }

  /* Exactly one group is open, and it is the one the table is about. */
  .acc {
    max-height: 0 !important;
    opacity: 0 !important;
  }
  .acc[data-rest="true"] {
    max-height: 87px !important;
    opacity: 1 !important;
  }

  /* ...and exactly one header is highlighted, the same one. */
  .acc-head {
    background: transparent !important;
  }
  .acc-head[data-rest="true"] {
    background: var(--color-well) !important;
  }

  /* Both blobs are at their 58% value. */
  .heat {
    opacity: 1 !important;
    transform: scale(1) !important;
  }

  /* On the keyframe path, not the inline fallback. */
  .replay-cursor {
    left: 52% !important;
    top: 44% !important;
  }

  .replay-scrub {
    width: 55% !important;
  }

  /* The pip is a solid dot at rest, not a ghost. */
  .rec-pip {
    opacity: 1 !important;
  }
}
```

`data-rest="true"` goes on **group 4 only** — its `.acc` and its `.acc-head`.
The nine static forest blobs need no rule; they never animated.

**Consequence for QA:** our reduced-motion frame deliberately differs from the
artboard's, so the structural diff for this section must be run with
`--motion none --freeze 11000` on both sides rather than against the
reduced-motion render. Note it in the section's QA run, exactly as §05 does.

---

## 4. Card 2 — "How to close the deal"

```
display:flex; flex-direction:column; overflow:hidden;
border-radius:12px; background:#fff
```

First child of the right column; `gap:12px` separates it from card 3.

### 4.1 Chrome bar

```
display:flex; align-items:baseline; justify-content:space-between; gap:12px;
border-bottom:1px solid var(--color-border,#DFD8C8);
background:var(--color-card-muted,#E6E0CC); padding:14px 20px
```

Title `<h3>` → **our `<h4>`**, identical styling to §2.1's title, with the same
26px lime medallion reading `2` (this one uses `flex:none` where card 1 uses
`flex:0 0 auto` — same thing, normalise to `flex-none`):

> `How to close the deal`

Right-hand count, `font-family:var(--font-sans); font-size:12.5px;
color:var(--color-slate-500,#6E7669)`:

> `3 suggested`

**Contrast, measured: 3.57:1. Fails.** §8.3.

### 4.2 The three rows

`<ul style="list-style:none;margin:0;padding:0">`. Each `<li>`:

```
display:flex; align-items:stretch; gap:0;
```

Rows 2 and 3 add `border-top:1px solid var(--color-slate-100,#E5E8E5)`.
`gap:0` is inert — drop it.

**Photo thumb** — `<span>`, `position:relative; flex:none; width:104px;
overflow:hidden; background:var(--color-forest-900,#15301F)`, containing:

1. `<img alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
2. a wash span, `position:absolute; inset:0`, `aria-hidden`:

```css
linear-gradient(to right,
  color-mix(in oklab,var(--color-forest-900,#15301F) 26%,transparent),
  color-mix(in oklab,var(--color-forest-900,#15301F) 68%,transparent))
```

3. an icon medallion, `aria-hidden`:

```
position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
display:grid; place-items:center; height:36px; width:36px;
border-radius:9999px; background:var(--color-lime-500,#C8E84A)
```

holding a `17 × 17` Lucide glyph, `viewBox="0 0 24 24"`, `fill="none"`,
`stroke="var(--color-forest-900,#15301F)"`, `stroke-width="2.3"`,
`stroke-linecap="round"`, `stroke-linejoin="round"`.

**Text block** — `<span style="display:flex;min-width:0;flex:1;
align-items:center;gap:12px;padding:14px 20px">` with an inner
`display:flex;min-width:0;flex:1;flex-direction:column;gap:4px` carrying a title
and a sub:

```
title: font-size:14.5px; font-weight:500; color:var(--color-charcoal-900,#1D2A20)
sub:   font-size:12.5px; line-height:1.45; color:var(--color-slate-500,#6E7669)
```

**Chip** — `<span>`:

```
display:inline-flex; flex:none; align-items:center; border-radius:6px;
box-shadow:0 0 0 1px var(--color-border,#DFD8C8),0 1px 2px rgba(21,48,31,.08);
background:var(--color-well,#F6F4EC); padding:6px 13px;
font-family:var(--font-sans); font-size:12.5px; font-weight:600;
color:var(--color-slate-700,#35402F); white-space:nowrap
```

**All three rows, verbatim:**

| # | Photo | Lucide icon | Title | Sub | Chip |
|---|---|---|---|---|---|
| 1 | `/images/photo-1.webp` | `Phone` | `Call Sarah about the paving` | `Four visits, 2m 40s on the paving. Talk about the spec, not the price.` | `Call` |
| 2 | `/images/photo-2.webp` | `Layers` | `Send a bluestone vs granite comparison` | `The price difference on your own rates, in one page.` | `Send` |
| 3 | `/images/photo-3.webp` | `Clock` | `Best time to reach her` | `All four opens were after dinner. Ring weeknights, after 8pm.` | `After 8pm` |

Row 1's sub carries `READING.opens` and `READING.longestTime`; row 3's carries
`READING.bestTimeToCall` in a reworded form (`Weeknights, after 8pm` in
`content/home.ts`, `Ring weeknights, after 8pm.` here). Compose row 1 from the
constants; row 3's wording differs enough that it is copy — keep it verbatim and
keep the chip `After 8pm` in sync with the constant by hand.

The three inline SVG paths in the artboard are Lucide `Phone`, `Layers` and
`Clock` verbatim. **Use `lucide-react`**, not the inline paths — Lucide is the
only icon system and the package is already a dependency.

All three chips are `<span>`s with no handler. Keep them spans: **zero tab
stops** in this card.

---

## 5. Card 3 — "Get paid"

```
display:flex; flex-direction:column; overflow:hidden;
border-radius:12px; background:#fff
```

### 5.1 Chrome bar

```
display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between;
gap:12px; border-bottom:1px solid var(--color-border,#DFD8C8);
background:var(--color-card-muted,#E6E0CC); padding:14px 20px
```

Title `<h3>` → **our `<h4>`**, same recipe as §4.1, medallion reads `3`:

> `Get paid`

**Xero pill** — `<span>`:

```
display:inline-flex; align-items:center; gap:7px; border-radius:9999px;
background:var(--color-well,#F6F4EC); padding:3px 11px 3px 4px;
box-shadow:0 0 0 1px var(--color-border,#DFD8C8)
```

with `<img src="/images/xero-mark.webp" alt="Xero" style="height:18px;
width:18px;flex:none;border-radius:9999px">` and

```
font-family:var(--font-sans); font-size:11.5px; font-weight:700;
color:var(--color-slate-700,#35402F)
```

> `Syncs with Xero`

The asymmetric `3px 11px 3px 4px` padding is correct — it optically centres the
18px mark inside the pill. The `<img>` has a real `alt` because it is a brand
mark, not decoration; keep it, and it means the pill announces "Xero Syncs with
Xero". **Change the `alt` to `""`** — the adjacent text already names Xero, and
this is the one `alt` in the section that would otherwise double up.

### 5.2 Intro line

`<p style="margin:0;padding:14px 20px 4px;font-family:var(--font-sans);
font-size:13.5px;line-height:1.5;color:var(--color-slate-700,#35402F)">`:

> `Set milestones or take a deposit the moment they accept.`

### 5.3 Three milestone rows

Wrapper `<div style="background:#fff">`. Each row:

```
display:flex; align-items:center; gap:11px; padding:11px 20px
```

Rows 2 and 3 add `border-top:1px solid var(--color-slate-100,#E5E8E5)`.

**Row 1's marker** — done, lime + tick, `aria-hidden`:

```
display:grid; place-items:center; flex:none; height:24px; width:24px;
border-radius:9999px; background:var(--color-lime-500,#C8E84A)
```

holding a `13 × 13` Lucide `Check` (`stroke="var(--color-forest-900,#15301F)"`,
`stroke-width="3.2"`, round caps and joins).

**Rows 2 and 3's marker** — pending, `aria-hidden`:

```
display:grid; place-items:center; flex:none; height:24px; width:24px;
border-radius:9999px; background:var(--color-well,#F6F4EC);
box-shadow:0 0 0 1px var(--color-border,#DFD8C8)
```

holding `<span style="height:6px;width:6px;border-radius:9999px;
background:var(--color-slate-300,#A2A899)">`.

**Text column** — `display:flex;min-width:0;flex:1;flex-direction:column;gap:1px`:

```
title: font-size:14px; font-weight:500; color:var(--color-charcoal-900,#1D2A20)
sub:   font-size:12px; color:var(--color-slate-500,#6E7669)
```

**Amount** — `flex:none; font-family:var(--font-serif); font-weight:600;
font-size:14.5px; font-variant-numeric:tabular-nums;
color:var(--color-ink,#16321E)`.

| # | Marker | Title | Sub | Amount |
|---|---|---|---|---|
| 1 | lime tick | `Deposit, 20%` | `Paid on acceptance` | `$12,560` |
| 2 | grey dot | `On start, 40%` | `Invoice raises itself Monday` | `$25,120` |
| 3 | grey dot | `On handover, 40%` | `Plus any variations billed` | `$25,120` |

`12,560 + 25,120 + 25,120 = $62,800`, not `QUOTE.total` `$48,200`; and
20 + 40 + 40 = 100% of `$62,800`. Neither figure reconciles with the quote the
rest of the page tells the story about. §9 D12 — flag, do not fix.

Lime on the completed marker is a **brand violation** — `brand.md`: "Selected or
completed is forest, never lime… No lime completed checks." Ship as drawn per
principle 1, and log (§9 D17).

### 5.4 Footer

```
display:flex; align-items:center; justify-content:space-between; gap:10px;
border-top:1px solid var(--color-border,#DFD8C8);
background:var(--color-well,#F6F4EC); padding:10px 20px
```

| Element | Style | Copy |
|---|---|---|
| Note | `font-size:12px; line-height:1.45; color:var(--color-slate-500,#6E7669)` | `Milestones set on the quote, invoiced in Xero as they fall due.` |
| Action | `flex:none; font-size:12px; font-weight:600; color:var(--color-forest-700,#2C5539); white-space:nowrap` | `Deposit in` |

`Deposit in` is styled as an action and is a `<span>`. It also reads as an
unfinished string — "Deposit in" what? §9 D16.

**Contrast, measured: the note is `#6E7669` on `#F6F4EC` = 4.28:1. Fails.** §8.3.

---

## 6. Mobile composition (<1024px)

The mobile artboard is a fixed **430px** column with no media queries. Section
measured **398px** wide.

### 6.1 Shell

```
section: margin:0 16px 30px; overflow:hidden; border-radius:12px
banner:  position:relative; padding:26px 18px 22px
panel:   class="canvas-botanical"; background:var(--m-muted); padding:22px 16px 24px
```

**No `banner-fade`, no negative-margin overlap, no blurred mirror.** Mobile
stacks a photo banner directly on the panel with a single wash. Banner contents:

- `<img src="/images/photo-3.webp" alt="" style="position:absolute;inset:0;
  width:100%;height:100%;object-fit:cover">`
- wash span, `aria-hidden`, `position:absolute;inset:0`:

```css
linear-gradient(to bottom,
  color-mix(in oklab,var(--m-forest) 86%,transparent),
  color-mix(in oklab,var(--m-forest) 58%,transparent))
```

- `<h2 class="m-h2" style="position:relative;margin:0;font-size:28px;color:#fff">`

> `Win more jobs, without the late-night admin.`

`.m-h2` is Fraunces `"wght" 600, "SOFT" 60, "opsz" 32`, `line-height:1.14`,
`letter-spacing:-.005em` — our `.display .display-2-mobile`. Measured **6.63:1**
against the composited photograph. Passes.

`--m-muted` is `--color-card-muted` `#E6E0CC`. Every `--m-*` token in the mobile
artboard maps one-to-one onto `globals.css`; use the shared tokens.

**No eyebrow on mobile** — `SALES ASSISTANT` does not exist below 1024.

**Panel intro:**

```
h3.m-h3: margin:0; font-size:19px; color:var(--m-ink)
p:       margin:8px 0 16px; font-size:14.5px; line-height:1.55; color:var(--m-ink-700)
```

> `Win the job and the client, not just the quote.`

> `Bramble shows you what your client read, and how long they sat on it. You call knowing what they care about.`

The paragraph is **different copy** from desktop's, not a truncation. Preserve
both (§01 ruling 12 precedent).

### 6.2 Card 1, mobile

```
overflow:hidden; border-radius:12px; background:#fff;
box-shadow:0 1px 2px rgba(21,48,31,.05),
           0 6px 14px -6px rgba(21,48,31,.14),
           0 18px 30px -18px rgba(21,48,31,.18)
```

Mobile cards carry a three-layer shadow where desktop's carry none — the §03/04
ruling 13 asymmetry again. Reproduce as drawn.

**Chrome bar:** `display:flex;align-items:center;gap:10px;border-bottom:1px solid
var(--m-border);background:var(--m-muted);padding:12px 16px`, a **24px** lime
medallion at `font-size:11.5px` reading `1`, then a `<span style="min-width:0">`
holding:

- `<h4 class="m-h3" style="margin:0;font-size:17px;color:var(--m-ink)">` →
  `How Sarah read the quote` — note **`Sarah`**, not desktop's `Sarah H.`
- a sub-line, `margin-top:2px; display:block; font-size:11.5px;
  color:var(--m-ink-500); white-space:nowrap; overflow:hidden;
  text-overflow:ellipsis` → `V2 · 4 opens over 3 days · 5m 16s all up`
  — **numerals** where desktop writes them out, and **no** "Watch the replay"

**Contrast, measured: 3.57:1. Fails.** Same pair as desktop's. §8.3.

**Body:** `padding:14px 16px 16px`, containing a `display:flex;gap:12px` row
(the mini viewport and the timing list, **never wrapping**) and the legend.

### 6.3 The 148px mini viewport

```
position:relative; flex:none; width:148px; overflow:hidden;
border-radius:6px; background:#fff; box-shadow:0 0 0 1px var(--m-border)
```

Measured **148 × 191px**: a **172px** clip (`position:relative;height:172px;
overflow:hidden`) plus a ~19px chrome strip **below** it — the reverse of
desktop, which puts its chrome bar on top and the scrub below.

`.m-doc-track` — `position:absolute; inset:0 0 auto`. Measured natural height
**280px**, constant at every width.

**Document header (52px):**

```
position:relative; height:52px; overflow:hidden; background:var(--m-forest)
```

- `<img src="/images/photo-2.webp" alt="" …object-fit:cover;opacity:.7">` —
  **photo-2**, where desktop uses photo-1
- wash, `aria-hidden`:
  `linear-gradient(to top,color-mix(in oklab,var(--m-forest) 92%,transparent),transparent)`
- `<span style="position:absolute;left:8px;bottom:6px;font-family:var(--m-serif);
  font-weight:600;font-size:11px;color:#fff">` → `Sarah Henderson`

No reference line, no address — mobile keeps only the client name.

**Body:** `padding:7px 8px 8px`.

Section label, `display:block; font-size:11px; font-weight:700;
letter-spacing:.1em; text-transform:uppercase; color:var(--m-ink-500)`:

> `Scope of works`

Then **five flat rows** — no accordion, no line items, no Excavation group:

```
display:flex; align-items:center; gap:4px; padding:6px 0
```

Rows 2–5 add `border-top:1px solid #EEF0EC` (a one-off hex, not a token —
§9 D20). Rows 3 and 5 add `position:relative` and carry a heat blob.

Each row: a 4px dot (`flex:none;height:4px;width:4px;border-radius:9999px`), a
label (`min-width:0;flex:1;font-size:9.5px;color:var(--m-ink-700)`, nowrap +
ellipsis) and an amount (`flex:none;font-family:var(--m-serif);font-weight:600;
font-size:9.5px;color:var(--m-ink)`).

| # | Dot | Label | Amount | Heat |
|---|---|---|---|---|
| 1 | `#8A7A65` | `Demolition & clearing` | `$4,200` | — |
| 2 | `#B89270` | `Retaining & structures` | `$7,920` | — |
| 3 | `#A8A296` | `Paving & stonework` | `$14,880` | `m-heat-a` |
| 4 | `#8FB57E` | `Turf & planting` | `$9,400` | — |
| 5 | `#9CB4C7` | `Irrigation` | `$5,320` | `m-heat-b` |

The labels are **shortened and sentence-cased** relative to desktop
(`Demolition & clearing` vs `Demolition & Site Clearing`; `Turf & planting` vs
`Turf, Soil & Planting`). Preserve both. The five dots are the same taxonomy
tokens; Excavation is absent, so the five amounts sum to `$41,720` — the mobile
document's own subtotal does **not** match the `$48,200` it then prints.
§9 D12.

**Totals row:**

```
margin-top:6px; display:flex; align-items:baseline; justify-content:space-between;
border-top:1px solid var(--m-border); padding-top:6px
```

`Total inc. GST` at `font-size:11px;font-weight:700;letter-spacing:.1em;
text-transform:uppercase;color:var(--m-ink-500)`, and `$48,200` at
`font-family:var(--m-serif);font-weight:600;font-size:12px;color:var(--m-ink)`.

**Accept button:** `margin-top:7px; display:grid; place-items:center;
height:18px; border-radius:3px; background:var(--m-lime); font-size:8.5px;
font-weight:700; color:var(--m-forest)` → `Accept this quote`.

**Measured: the totals row and the accept button are never visible.** The track
is 280px and the clip 172px, so the deepest legal scroll is 108px — but `m-doc`
only reaches **−68px**, leaving the bottom **40px** permanently below the fold.
§9 D5.

**Cursor** — inside the clip:

```html
<span class="m-cursor" aria-hidden
      style="position:absolute;left:58%;top:52%;width:9px;height:9px;
             border-radius:9999px;
             background:color-mix(in oklab,var(--m-forest) 40%,transparent);
             box-shadow:0 0 0 4px color-mix(in oklab,var(--m-forest) 10%,transparent)">
```

**Chrome strip** (below the clip):

```
display:flex; align-items:center; gap:5px; border-top:1px solid var(--m-border);
background:var(--m-well); padding:5px 7px
```

- `<span class="m-rec" aria-hidden style="flex:none;width:4px;height:4px;
  border-radius:9999px;background:#96602B">` — a raw hex where the desktop uses
  `var(--color-rust)`; use the token
- track `position:relative;height:3px;min-width:0;flex:1;border-radius:9999px;
  background:var(--m-muted)` with `<span class="m-scrub"
  style="position:absolute;inset:0 auto 0 0;width:0;border-radius:9999px;
  background:var(--m-forest-700)">`
- `<span style="font-size:6px;color:var(--m-ink-500)">5:16</span>`

**`font-size:6px`.** Below any legibility floor. §9 D4.

Mobile has **no** "Replay / visit 4 of 4 / 2:14" line and **none** of the nine
forest blobs.

### 6.4 The mobile heat blobs

```html
<span class="m-heat m-heat-a" aria-hidden
      style="position:absolute;left:-6%;top:-2px;width:112%;height:calc(100% + 4px);
             border-radius:9999px;
             background:radial-gradient(ellipse at center,rgba(110,65,25,.6),rgba(110,65,25,.2) 55%,transparent 80%);
             filter:blur(4px);pointer-events:none;z-index:1"></span>
```

`m-heat-b` is identical except the first gradient stop is **`rgba(110,65,25,.44)`**
instead of `.6`. Desktop uses `.58` for both and a larger `.24` mid-stop; mobile
uses `.6` / `.44` with a `.2` mid-stop, a `blur(4px)`, `left:-6%`, `width:112%`,
`top:-2px` and `calc(100% + 4px)`. Every number differs from desktop — build them
as two separate recipes, do not share one.

The weaker mobile blob is why the rows under it still measure **7.67:1** and
**7.79:1** (§8.3) where the desktop equivalents collapse.

### 6.5 The mobile timing list

`<div style="min-width:0;flex:1">`, measured **174px** at 430px. Four rows (no
`Irrigation`), each:

```
display:flex; align-items:center; gap:9px; padding:7px 0
```

Rows 1–3 add `border-bottom:1px solid color-mix(in oklab,var(--m-border) 45%,transparent)`;
row 4 has none — the opposite of desktop, whose last row *does* carry one.

Swatch `flex:none;height:9px;width:9px;border-radius:2px`; label `min-width:0;
flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px;
color:var(--m-ink-700)`; time `font-size:12.5px`.

| # | Swatch | Label | Time | Time colour | Label weight |
|---|---|---|---|---|---|
| 1 | `#6E4119` (`--color-umber`) | `Paving` | `2m 40s` | `var(--m-ink-700)` `#35402F` | **600** |
| 2 | `color-mix(in oklab,#6E4119 55%,transparent)` | `Totals` | `1m 12s` | `var(--m-ink-500)` | 400 |
| 3 | `color-mix(in oklab,#6E4119 30%,transparent)` | `Retaining` | `48s` | `var(--m-ink-500)` | 400 |
| 4 | `color-mix(in oklab,#6E4119 12%,transparent)` | `Scope` | `22s` | `var(--m-ink-500)` | 400 |

**Mobile ramps the umber data tone; desktop ramps forest.** Two different colour
systems for the same chart, and mobile's is the one `brand.md` endorses ("Umber
is a data tone only"). Ship both as drawn and log (§9 D18).

Labels are single words where desktop writes full group names. Preserve both.

**Legend:**

```
margin-top:12px; display:flex; align-items:center; gap:8px;
font-size:11.5px; color:var(--m-ink-400)
```

> `Least time` + bar + `Most time`

```css
linear-gradient(to right,
  color-mix(in oklab,#6E4119 10%,transparent),
  color-mix(in oklab,#6E4119 45%,transparent),
  #6E4119)
```

`height:7px` (desktop's is 8px). **Contrast, measured: `#8A9082` on `#E6E0CC` =
2.49:1 — the worst text failure in the section.** §8.3.

### 6.6 Card 2, mobile

```
margin-top:14px; overflow:hidden; border-radius:12px; background:#fff;
box-shadow:<the same three-layer stack>
```

Chrome bar as §6.2's, medallion reads `2`, `<h4 class="m-h3"
style="margin:0;font-size:17px;color:var(--m-ink)">`:

> `How to close the deal`

**No `3 suggested` count on mobile.**

Rows live in `display:flex;flex-direction:column;gap:8px;padding:12px` — three
**separate tiles**, not a divided list:

```
display:flex; align-items:stretch; gap:0; overflow:hidden; border-radius:10px;
background:var(--m-well); box-shadow:0 0 0 1px var(--m-border)
```

`border-radius:10px` is off the 4/6/8/12 scale (§01 ruling 8 precedent).

Photo thumb: `position:relative; flex:none; width:84px; overflow:hidden;
background:var(--m-forest)` with the image, a wash

```css
linear-gradient(to right,
  color-mix(in oklab,var(--m-forest) 30%,transparent),
  color-mix(in oklab,var(--m-forest) 70%,transparent))
```

(30/70, where desktop is 26/68) and a **32px** medallion (desktop 36px) holding a
**15 × 15** Lucide glyph at `stroke-width="2.4"` (desktop 17px / 2.3).

Text column: `display:flex;min-width:0;flex:1;flex-direction:column;gap:3px;
padding:11px 12px`:

```
title: font-size:13.5px; font-weight:600; line-height:1.3; color:var(--m-ink)
sub:   font-size:12px; line-height:1.45; color:var(--m-ink-500)
chip:  margin-top:3px; display:inline-flex; align-self:flex-start;
       border-radius:6px; background:#fff; padding:3px 8px;
       font-size:10.5px; font-weight:700; letter-spacing:.06em;
       text-transform:uppercase; color:var(--m-forest-700);
       box-shadow:0 0 0 1px var(--m-border)
```

The chip is **below** the text and **uppercase**, where desktop's sits to the
right in sentence case. Different component; build both.

| # | Photo | Icon | Title | Sub | Chip |
|---|---|---|---|---|---|
| 1 | `/images/photo-1.webp` | `Phone` | `Call Sarah about the paving` | `Four visits, 2m 40s on the paving. Talk about the spec, not the price.` | `Call` |
| 2 | `/images/photo-2.webp` | `Layers` | `Send a bluestone vs granite comparison` | `Bluestone against granite, with the price difference on your own rates.` | `Send` |
| 3 | `/images/photo-3.webp` | `Clock` | `Best time to reach her` | `All four opens were after dinner. Ring weeknights, after 8pm.` | `After 8pm` |

Row 2's sub is **different copy** from desktop's. Preserve both.

**Contrast, measured: the subs are `#6E7669` on `#F6F4EC` = 4.28:1. Fail.** §8.3.

### 6.7 There is no card 3 on mobile

`Get paid`, the Xero pill, the three milestone rows and the footer **do not
exist below 1024px.** The mobile section ends after card 2. Do not invent them,
do not port the desktop card into a `desk:hidden` subtree, and do not treat the
absence as a defect — the mobile artboard tells a shorter story on purpose. Log
it so the client knows the Xero mention is desktop-only in this chapter (the
mobile page does carry an `Xero app partner` accreditation pill in the social
proof band, so the integration is not unrepresented).

### 6.8 The 14-second system, verbatim

```css
@keyframes m-doc{0%,14%{transform:translateY(0)} 22%,30%{transform:translateY(-18px)} 38%,64%{transform:translateY(-44px)} 72%,90%{transform:translateY(-68px)} 100%{transform:translateY(0)}}
@keyframes m-heat-a{0%,20%{opacity:0;transform:scale(.6)} 36%,66%{opacity:1;transform:scale(1)} 80%,100%{opacity:0;transform:scale(.8)}}
@keyframes m-heat-b{0%,44%{opacity:0;transform:scale(.6)} 56%,88%{opacity:1;transform:scale(1)} 100%{opacity:0}}
@keyframes m-cursor{0%,14%{left:58%;top:22%} 30%{left:40%;top:48%} 50%{left:66%;top:54%} 70%{left:44%;top:66%} 88%,100%{left:58%;top:78%}}
@keyframes m-scrub{from{width:0} to{width:100%}}
@keyframes m-rec{0%,100%{opacity:1} 50%{opacity:.25}}

.m-doc-track{animation:m-doc 14s cubic-bezier(.5,0,.3,1) infinite}
.m-heat-a{animation:m-heat-a 14s ease-in-out infinite}
.m-heat-b{animation:m-heat-b 14s ease-in-out infinite}
.m-cursor{animation:m-cursor 14s cubic-bezier(.4,0,.2,1) infinite}
.m-scrub{animation:m-scrub 14s linear infinite}
.m-rec{animation:m-rec 1.4s ease-in-out infinite}
```

**1% of this cycle = 140ms.**

Differences from the desktop system that matter:

- **Four plateaus, not six** (0 / −18 / −44 / −68), because there is no
  accordion to synchronise to — the mobile document just scrolls.
- The document **scrolls the whole way in three moves** and dwells longest on the
  third, `38%→64%` = **3640ms**, which is where `Paving & stonework` and its heat
  blob sit. That dwell is the mobile expression of `2m 40s`, and it is 26% of the
  cycle against the desktop dwell's 21%.
- The cursor has an **ease `cubic-bezier(.4,0,.2,1)`** where desktop uses
  `ease-in-out`, and it moves **monotonically downward** (`22 → 48 → 54 → 66 →
  78%`) where desktop's wanders. It tracks the scroll; desktop's does not.
- `m-scrub` uses a **`from`/`to`** pair, so it reaches 100% at exactly 14000ms
  with no hold — where desktop's holds full for its last 1200ms.
- `m-rec` runs at **1.4s**; 14 ÷ 1.4 = 10 exactly, so again ten blinks per cycle
  and permanently in phase.
- Same five heat percentages as desktop, scaled: A `20/36/66/80`, B
  `44/56/88/100` against desktop's `22/36/70/84` and `46/58/90/100`.

Measured frames, for the harness:

| t | `m-doc` | heat A | heat B | cursor (computed) | scrub |
|---|---|---|---|---|---|
| 0 | 0 | 0 / `scale(.6)` | 0 / `scale(.6)` | 58% / 22% | 0px |
| 3080 (22%) | −18px | .031 | 0 | 44.0% / 42.2% | 23.72px |
| 5320 (38%) | −44px | **1 / `scale(1)`** | 0 | 56.0% / 51.7% | 40.97px |
| **8400 (60%)** | **−44px** | **1 / `scale(1)`** | **1 / `scale(1)`** | **48.9% / 63.3%** | **64.69px** |
| 10080 (72%) | −68px | .622 | 1 | 44.5% / 66.4% | 77.63px |
| 12600 (90%) | −68px | 0 / `scale(.8)` | .944 | 58.0% / 78.0% | 97.03px |

### 6.9 Mobile reduced-motion state

**The mobile artboard's block is sound.** Ship it, with one addition:

```css
/* artboard, line 63 — correct as written */
@media(prefers-reduced-motion:reduce){
  .m-doc-track,.m-heat,.m-cursor,.m-scrub,.m-rec{animation:none!important}
  .m-doc-track{transform:translateY(-44px)}
  .m-heat{opacity:1!important}
  .m-scrub{width:60%}
}
```

Verified: `−44px` is the 38–64% plateau, `60%` of 14s is **8400ms**, and 60% sits
inside 38–64%. At 8400ms **both** heat blobs are at exactly `opacity:1;
scale(1)` — no rounding needed, unlike desktop. There is no accordion to get
wrong. The resting frame is the Paving dwell, which **agrees with the desktop
resting frame** (§3.9), so the two breakpoints tell the same story at rest.

The one gap: `.m-cursor{animation:none}` falls back to the inline
`left:58%; top:52%`, and at 8400ms the cursor is at **`left:48.9%; top:63.3%`** —
13px below and 9px right of where the artboard rests it, on a 9px dot inside a
148 × 172 box. Pin it:

```css
  .m-cursor { left: 49% !important; top: 63% !important; }
  .m-rec    { opacity: 1 !important; }
```

---

## 7. Fluid behaviour  **[Designer decision]**

### 7.1 The desk range, 1024 → 1243px

**Reproduce the wrap.** Below 1244px the artboard's own `flex-wrap:wrap` drops
the section-timing table beneath the replay frame and gives the frame the full
column width (489.5px at 1243, 380px at 1024). Measured on the artboard itself,
so it is the render, and principle 1 applies. It is also legible: the frame gets
*larger*, the table sits directly under it, and nothing clips.

Two consequences QA must not file as bugs:

1. **The nine heat blobs scale with the frame**, because they are sized as a
   percentage of it: blob 3 measures **61.0px** at 1280, **88.1px** at 1243 and
   **68.4px** at 1024. The heatmap is coarser below 1244px. That is the
   artboard's behaviour; keeping the percentages is what reproduces it.
2. **The card gets 149px taller** — `#pf-radar` measures 646.1px at ≥1244 and
   795.3px at 1243, 826.5px at 1024 — and card 2's column stretches with it
   (`align-items:stretch`), so the gap under "Get paid" grows. Also drawn.

`pf-doc`'s pixel offsets, the 352px clip, the 409.75px frame height and the
553.75px track height are all **width-invariant** (measured at 1440, 1243 and
1024), so no animation value changes across the desk range. Nothing in §3 needs
a breakpoint.

### 7.2 320 → 1023px

The mobile artboard is a fixed 430px column with zero media queries. Everything
not listed below holds its artboard px value at every width.

**Outer gutter.** `16px` from 320px, stepping to `32px` at ≥640px. Identical to
§05 §7 and to the social-proof band; the artboard draws 16px and §03/04 ruling 16
settled that. Use `sm-only:` for the step, not `sm:` — this element also carries
a `desk:` value for the same property (the page-wide convention in RULINGS).

**Content cap.** `width:100%; max-width:560px; margin-inline:auto` on the
section. Same 560px cap as every other band.

**Panel padding.** `22px 16px 24px`, stepping the horizontal to `24px` at
≥560px. Vertical never changes. Same rule §05 used, same reasoning.

**Banner H2.** `font-size: clamp(23px, 6.51vw, 28px)`. 6.51vw is exactly 28.0px
at 430px, holds at 28px above it, and floors at 23px at 320px. Add
`text-wrap: balance` — the headline is six words over three lines at 430px and
wants a balanced rag, and there is no `<br>` to argue with. `line-height:1.14`,
`letter-spacing:-.005em` and the Fraunces axes are unchanged at every width.

**The 148px mini viewport steps down: `width: min(148px, 52%)`.** This is the
one real decision in the range and it is forced. At 430px the card's content box
is 334px, so 52% = 173.7px and `min()` yields the drawn **148px** exactly. At
320px the content box is 224px and 52% yields **116.5px**, which leaves the
timing list **95.5px**. Without the step the list gets **64px** — 37px of usable
text after the 9px swatch and two 9px gaps — and `2m 40s` alone measures ~40px,
so every row would ellipsis its label *and* clip its time. The times are the
entire argument of the card; losing them to keep a 148px depiction at its drawn
size is the wrong trade.

Safe because the viewport's internals are width-invariant the same way desktop's
are: the five rows are single-line with `text-overflow:ellipsis`, the header is a
fixed 52px and the accept button a fixed 18px, so the **280px track height and
the 172px clip do not move**, and `m-doc`'s `−18 / −44 / −68` still land where
they were authored to. The heat blobs (`left:-6%; width:112%`) and the cursor
(percentages of the clip) scale with the box and stay correctly placed.

**Card 2's photo thumb: `width: clamp(64px, 28%, 84px)`.** At 430px the tile's
inner row is 310px, 28% = 86.8px and the clamp yields the drawn **84px**. At
320px it yields **64px**, which takes the text column from 92px to 112px. At 92px
`Send a bluestone vs granite comparison` at 13.5px/600 sets six lines and the
tile becomes taller than it is wide. The medallion inside stays 32px at every
width — it is a device of the depiction, not a layout element.

**Every type size stays fixed** at its artboard px (28 / 19 / 17 / 14.5 / 13.5 /
13 / 12.5 / 12 / 11.5 / 11 / 10.5 / 9.5 / 8.5 / 6). They are already at or below
the floor of comfortable; scaling them down at 320px trades a solvable width
problem for an unsolvable legibility one, and the 560px cap handles the top of
the range. The 6px `5:16` is separately flagged (§9 D4) and its fix, if the
client takes it, is a fixed bump to 8px — not a clamp.

**The three-layer card shadow, the 6px and 10px radii, the 12px stack gaps, the
52px document header, the 172px clip and the 19px chrome strip do not scale.**
They are a device depiction; scaling them makes it read as a different device.

**At exactly 1024px the desktop composition takes over whole.** There is no
intermediate composition, no width at which an accordion appears below 1024, no
width at which "Get paid" appears below 1024, and no width below 1024 running a
20-second clock.

---

## 8. Accessibility

### 8.1 How much of this reaches a screen reader  **[Designer decision]**

**Recommendation: the replay frame is one `role="img"` with an `aria-label`.
Everything else in the section stays in the accessibility tree untouched.**

This is the ruling already made for the hero's float cards and for §05's phone
frames (ruling 7), applied to the one element here that is the same kind of
thing: a depiction of product UI whose internal text is fiction.

**What collapses to one string:** the replay frame only — the chrome bar, the
mock proposal, the cursor, the scrub bar and all eleven heat overlays. That is
~90 words of invented line items, quantities and dollar figures that a sighted
reader takes in as texture in well under a second, plus a scroll position and a
scrub percentage that change eleven times a cycle and would make the live region
unusable if announced.

Desktop:

```html
<div role="img" aria-label="A replay of Sarah Henderson's fourth visit to quote
     Q-1042. The proposal scrolls through its six scope groups and pauses on
     Paving and Stonework, which is marked with the hottest patch on the
     heatmap.">
```

Mobile, the same idea at the mobile composition's scale:

```html
<div role="img" aria-label="A replay of Sarah's visit to the quote. The proposal
     scrolls through its scope groups and pauses on Paving and stonework, the
     row marked hottest on the heatmap.">
```

**What stays readable, and why it is enough:** the eyebrow, the banner headline,
the panel `<h3>` and its paragraph; card 1's chrome bar (`How Sarah H. read the
quote`, `Heatmap`, `V2 · four opens over three days · 5m 16s all up`); **the
entire section-timing table**, header row, five rows and legend; and cards 2 and
3 in full. A reader who gets only those hears the whole argument: the client
opened it four times for five minutes sixteen, spent two minutes forty on the
paving, and here are three things to do about it. The fiction inside the frame
adds nothing they need.

The timing table deliberately stays out of the `role="img"` — it is the
*evidence*, not the depiction, and it is where every figure the section claims
actually lives.

### 8.2 Semantics

- **Two `<h1>`s.** The desktop artboard sets the chapter banner as
  `<h1 class="pf-h1">`, and the hero already has one. Ship as `<h2>` with the
  same `.display .display-1` visual. §03/04 ruling 8: fix the semantics, keep the
  visuals — level and size are independent.
- **Heading levels then run `h2` → `h3` (panel) → `h4` (three card titles).**
  The artboard gives all four of the latter `<h3>`. Mobile is already correct
  (`h2` / `h3` / `h4`); make desktop match it.
- **`aria-hidden=""`.** 37 instances in the desktop section, 24 in the mobile
  one. The empty string is not a valid value. **Fix to `"true"`** (§03/04 ruling
  7 precedent), even on the ones now inside the `role="img"` subtree.
- **Zero tab stops.** `Watch the replay`, `Accept this quote`, the three chips
  in card 2, `Deposit in` and the whole timing table are all non-interactive
  `<span>`/`<div>`. None becomes a `<button>` or an `<a>`: the client declined
  destinations (RULINGS §01) and inventing controls the artboard does not draw is
  out of scope. Tab from the section above lands on whatever follows.
- **`alt`.** `alt=""` on photo-3 (banner ×2), photo-1 (document header), photo-1
  / photo-2 / photo-3 (card 2 thumbs). **Change `alt="Xero"` to `alt=""`** on the
  Xero mark — the pill's own text already says "Syncs with Xero".
- **The gradient legend** is `aria-hidden="true"` on the bar only; `Least time`
  and `Most time` are real text and stay.

### 8.3 Contrast — measured in the browser, not estimated

Method: the artboards were rendered in Chromium at `deviceScaleFactor: 2`, every
animation frozen at a stated `t`, and each text node's glyphs hidden with
`visibility:hidden` so the **composited backdrop pixel** could be sampled
directly — blend modes, opacities, radial gradients and photographs included.
The foreground is the element's computed `color`, composited over that backdrop
where it carries alpha. Where a pair has no overlay, the sampled value matched
the arithmetic exactly, which is the check that the method is sound.

#### Passes — do not touch these

| Element | Colour | On | Ratio | Needs |
|---|---|---|---|---|
| Card titles, 19px serif | `#16321E` | `#E6E0CC` | **10.54** | 3.0 |
| `Heatmap` badge, 11.5px/600 | `#1F4934` | `#CDDFD3` | **7.71** | 4.5 |
| `Watch the replay`, 12.5px/600 | `#2C5539` | `#E6E0CC` | **6.45** | 4.5 |
| Medallion digits, 12.5px/700 | `#15301F` | `#C8E84A` | **10.24** | 4.5 |
| `Replay` / `Syncs with Xero` | `#35402F` | `#F6F4EC` | **9.90** | 4.5 |
| Group labels, 12.5px | `#35402F` | `#FFFFFF` | **10.90** | 4.5 |
| Group amounts, 12.5px/600 | `#16321E` | `#FFFFFF` | **13.92** | 4.5 |
| Line-item labels, 11.5px | `#6E7669` | `#FFFFFF` | **4.71** | 4.5 |
| `Scope of works`, 11.5px | `#6E7669` | `#FFFFFF` | **4.71** | 4.5 |
| `$48,200`, 17px/600 | `#16321E` | `#FFFFFF` | **13.92** | 3.0 |
| `Accept this quote`, 12.5px/600 | `#15301F` | `#C8E84A` | **12.32** | 4.5 |
| Table labels, 13–14px | `#35402F` | `#FFFFFF` | **10.90** | 4.5 |
| Table times, 13px | `#6E7669` | `#FFFFFF` | **4.71** | 4.5 |
| Legend, 12px (desktop) | `#6E7669` | `#FFFFFF` | **4.71** | 4.5 |
| Card 2 titles, 14.5px/500 | `#1D2A20` | `#FFFFFF` | **14.95** | 4.5 |
| Card 2 subs, 12.5px | `#6E7669` | `#FFFFFF` | **4.71** | 4.5 |
| Card 2 chips, 12.5px/600 | `#35402F` | `#FFFFFF` | **10.90** | 4.5 |
| Card 3 intro, 13.5px | `#35402F` | `#FFFFFF` | **10.90** | 4.5 |
| Card 3 titles / amounts | `#1D2A20` / `#16321E` | `#FFFFFF` | **14.95** / **13.92** | 4.5 |
| Card 3 subs, 12px | `#6E7669` | `#FFFFFF` | **4.71** | 4.5 |
| `Deposit in`, 12px/600 | `#2C5539` | `#F6F4EC` | **7.73** | 4.5 |
| Mobile banner H2, 28px | `#FFFFFF` | photo + wash → `#4E6152` | **6.63** | 3.0 |
| Mobile card headings, 17–19px | `#16321E` | `#E6E0CC` | **10.54** | 3.0 |
| Mobile doc rows, 9.5px | `#35402F` | `#FFFFFF` | **10.90** | 4.5 |
| Mobile doc rows **under heat A** | `#35402F` | `#E0D7CE` | **7.67** | 4.5 |
| Mobile doc rows **under heat B** | `#35402F` | `#E2D9D0` | **7.79** | 4.5 |
| Mobile table labels/times | `#35402F` / `#6E7669` | `#FFFFFF` | **10.90** / **4.71** | 4.5 |
| Mobile chips, 10.5px/700 | `#2C5539` | `#F6F4EC` | **7.73** | 4.5 |
| Rec pip (non-text) | `#96602B` | `#F6F4EC` | **4.76** | 3.0 |

#### Failures — fix to AA

The client's standing preference is settled (§05 ruling 5, and the §03/04
client decision): correct contrast failures with the smallest change that
**measures** ≥4.5, as new semantic tokens rather than edits to the shared
`slate-*` ramp, which passes elsewhere.

| # | Element | Was | On | Ratio | Corrected | Now |
|---|---|---|---|---|---|---|
| C1 | Card-1 chrome sub-line, 12.5px; `3 suggested`, 12.5px; mobile chrome sub-line, 11.5px | `#6E7669` | `#E6E0CC` | **3.57** | **`#5F655A`** | **4.55** |
| C2 | `visit 4 of 4` / `2:14`, 9.5px; `5:16`, 9px; card-3 footer note, 12px; mobile card-2 subs, 12px; mobile `5:16`, 6px | `#6E7669` | `#F6F4EC` | **4.28** | **`#6B7266`** | **4.51** |
| C3 | Line-item quantity column, 11px (13 instances) | `#8A9082` | `#FFFFFF` | **3.29** | **`#73786D`** | **4.53** |
| C4 | Mobile legend `Least time` / `Most time`, 11.5px | `#8A9082` | `#E6E0CC` | **2.49** | **`#61655C`** | **4.51** |
| C5 | Desktop eyebrow `SALES ASSISTANT`, 12px/800 | `#95B225` | `#F8F7F2` | **2.26** | `--color-eyebrow` `#657919` | **4.59** |

C5 needs no new token and no new escalation — it is the exact failure the client
already ruled on. C1–C4 become:

```css
--color-doc-meta-muted: #5f655a;  /* slate-500 where it sits on card-muted */
--color-doc-meta-well:  #6b7266;  /* slate-500 where it sits on well */
--color-doc-qty:        #73786d;  /* slate-400 in the line-item quantity column */
--color-legend-mobile:  #61655c;  /* slate-400 on card-muted */
```

`#5F655A` also clears white (6.01) and well (5.46), so one token could cover all
three surfaces — but it is a visibly darker grey than the artboard draws on
white, where `#6E7669` already passes at 4.71. Four per-surface tokens is the
smallest change, which is what the client asked for. **Log with these
before/after ratios.**

**Headroom warning.** Every one of these clears by ≤0.05. The page-wide
convention in RULINGS applies: do not composite them through an opacity, a fade
or a tinted parent. In particular `.pf-acc` animates `opacity: 0 → 1`, so the
quantity column is below AA for the ~600ms of every open and every close. That
is a transient on decorative text inside a `role="img"`; noted, not fixed.

#### Escalate — text under the heat overlays

`.pf-heat-a` / `.pf-heat-b` carry `z-index:1` and paint **over** the row's
glyphs, and the nine forest blobs multiply over everything. Measured inside the
frame at the moments each blob is at full opacity:

| Element | Colour | Composited backdrop | Ratio | At |
|---|---|---|---|---|
| `48 m²`, 11px | `#8A9082` | `#CFC0B2` | **1.85** | t = 9400 |
| `14 m²`, 11px | `#8A9082` | `#D3C5B9` | **1.94** | t = 11000 |
| `$3,763`, 11.5px | `#6E7669` | `#DCD1C7` | **3.13** | t = 9400 |
| `$1,344`, 11.5px | `#6E7669` | `#DFD6CD` | **3.28** | t = 11000 |
| `Sawn bluestone, laid to pattern` | `#6E7669` | `#E1D7CF` | **3.33** | t = 9400 |
| `Dripline to garden beds` | `#6E7669` | `#E1D8CF` | **3.34** | t = 17400 |
| `Stepping pavers on pebble` | `#6E7669` | `#E5DCD5` | **3.49** | t = 11000 |
| `Compacted base and mortar bed` | `#6E7669` | `#F8F6F4` | **4.37** | t = 11000 |

The group **headers** are fine — `Paving & Stonework` measures **8.94** and
`$14,880` **10.07** under the same blob, because the blob centres land on the
expanded line items, not on the header row. Only the 11px and 11.5px secondary
text is affected, and only for the ~9 seconds of each cycle a blob is lit.

**Two options, costed:**

- **A. Darken the document's secondary text far enough to survive the overlay.**
  Computed against the worst measured backdrops: the quantity column needs
  `#4E524A` (4.50) and the line-item label and money need `#575D53` (4.52). That
  is a ~25% darkening of the mock UI's entire secondary tone, applied everywhere
  including the seven-eighths of the document no blob ever touches. It clears AA
  outright and it visibly flattens the document's value hierarchy — the point of
  a quote's line items being lighter than its group totals.
- **B. Accept as incidental and log.** The whole frame is `role="img"`; the
  obscuring is the product feature being depicted — a heatmap that does not
  obscure is not a heatmap; and WCAG 1.4.3 exempts text that is part of a
  picture. Note that §05 declined this exemption for its phone cards on the
  grounds that the copy was live text a reader would read; here the frame carries
  `role="img"` and the content is explicitly not in the tree.

**My recommendation is B, with the C3 base fix still applied** (the quantity
column fails at 3.29:1 on plain white, before any overlay — that half is not
arguable). Escalate the overlay residual with the numbers above; it is the
client's call, exactly as the greeting was in §05.

**Do not "fix" it by moving the blobs behind the text.** Measured: the backdrop
values above are already sampled with the glyphs hidden, i.e. they *are* the
z-behind case, so re-ordering buys nothing and changes the render.

### 8.4 Colour is never the only channel

The timing tables encode rank twice — swatch colour **and** a printed duration
(`2m 40s`, `1m 12s`, `48s`, `22s`, `—`) — and the rows are additionally ordered
longest-first. WCAG 1.4.1 is satisfied on both breakpoints without the legend.
The heatmap's own colour coding is inside the `role="img"` and is described in
the label ("the hottest patch on the heatmap").

### 8.5 Reduced motion and WCAG 2.2.2

The resting states are specified in full in §3.9 (desktop, `t = 11000ms`) and
§6.9 (mobile, `t = 8400ms`). Hard gate per RULINGS: an infinite loop without one
fails QA outright, and the harness's structural diff is only deterministic
because both sides settle to a defined frame.

**WCAG 2.2.2 (Pause, Stop, Hide) residual.** Eleven infinite loops, 20s and 14s,
no pause control. Same class as the marquee and §05, and the same ruling applies
(§03/04 ruling 5): reduced motion stops everything; **do not invent a visible
pause control the artboard does not draw**; log the residual honestly — a user
who has not set the OS preference has no mechanism. The content is `role="img"`
and conveys nothing a reader needs, which softens it but does not discharge the
criterion.

**WCAG 2.3.1 (flashes)** passes with room. The fastest thing in the section is
`pf-rec` at 0.5Hz (`m-rec` at 0.71Hz), against a 3Hz threshold, and it is a 6px
dot going `1 → .25 → 1` — a fade, not a flash. Nothing else changes state more
than about once per second.

---

## 9. Defects in the source — flagged, not fixed

Except D1 (dead code, drop), D2/D3 (hard gate, §3.9/§6.9), D7/D8 (existing
RULINGS precedent) and the C1–C5 contrast fixes in §8.3.

| # | Finding | Recommendation |
|---|---|---|
| D1 | `@keyframes pf-replay`, `.pf-replay-track{animation:…}` and `.pf-replay-track{transform:translateY(-39%)}` are applied to **zero** elements — an abandoned percentage-based draft of `pf-doc` | **Drop.** Dead code. Recorded in §3.1 so nobody restores it. Grep the build for `pf-replay-track` / `pf-replay ` before sign-off. |
| D2 | The desktop reduced-motion block opens **all six** accordions (`.pf-acc{max-height:none;opacity:1}`) while pinning the document to an offset computed for one open group, leaves **no** header highlighted, and rests the cursor on an off-path inline position | **Fix.** Hard gate. Replace wholesale with §3.9. |
| D3 | The mobile reduced-motion block is correct except that `.m-cursor` falls back to an inline position 13px from where the loop rests it | **Fix** with the two-line addition in §6.9. |
| D4 | Mobile's scrub label is **`font-size:6px`**; the mobile chrome strip's other type is 6–9.5px | Flag. Below any legibility floor, but it is inside the `role="img"` depiction. If the client wants it fixed, 8px is the smallest bump that keeps the 19px strip height. |
| D5 | Mobile's document is 280px in a 172px clip but `m-doc` only travels to **−68px**, leaving the bottom **40px** — the `Total inc. GST` row and the `Accept this quote` button — permanently below the fold | Flag. Every other element in that block is drawn and never seen. Ship as drawn; `−108px` would show it. |
| D6 | Two heatmap systems with different attachment: `pf-heat-a/b` are **inside** `.pf-doc-track` and scroll with the document; the nine forest blobs are **outside** it and do not. They also multiply over the chrome bar and the top of the scrub bar | Flag. A heatmap that does not move with its content is conceptually wrong, but it is what makes the frame read as a live density overlay rather than two lozenges. Ship as drawn. |
| D7 | `aria-hidden=""` on 37 desktop and 24 mobile elements | **Fix** to `"true"`. §03/04 ruling 7 precedent. |
| D8 | Desktop chapter banner is `<h1>`; the hero already has one. Panel heading and all three card titles are `<h3>` | **Fix the semantics, keep the visuals.** §03/04 ruling 8 precedent. Mobile is already correct. |
| D9 | `.pf-acc` animates to `max-height:61px` (groups 1,2,3,5,6) and `87px` (group 4), but the measured natural heights are **46.5px** and **69.75px** — 14.5px and 17.25px of dead slack | Note. Harmless today, and the slack is what stops a wrapped label from clipping. **A third line item in any two-item group would render 69.75px and clip at 61px.** Any copy change must be re-checked against these numbers. |
| D10 | `pf-heat-a` is `height:calc(100% + 12px)` and exits at `scale(.8)`; `pf-heat-b` is `calc(100% + 10px)` with the same `top:-6px` and declares no exit transform, so it fades at `scale(1)` | Ship as drawn, log. A 2px geometric asymmetry and a mismatched exit on two elements that are otherwise identical. |
| D11 | The timing table's top two rows share the same `forest-900` swatch for `2m 40s` and `1m 12s`, so the five-step legend beneath them only ever shows four distinct values; and every `<li>` carries a `border-bottom` including the last | Ship as drawn, log. |
| D12 | The narrative does not reconcile. Card 3's milestones total **`$62,800`** against `QUOTE.total` `$48,200`. Four of the six groups' line items do not sum to their own header (`$4,200` header / `$7,100` items; `$7,920` / `$7,176`; `$14,880` / `$7,215`; `$9,400` / `$8,626`; only Excavation and Irrigation reconcile). The table's four times sum to `5m 02s` against `5m 16s all up`. Mobile's five visible groups sum to `$41,720` under a printed `$48,200` | Flag. Data and copy, principle 3. Client's call. The **six** desktop group headers do sum to exactly `$48,200`, so the top-level figure is right. |
| D13 | The heatmap puts its second-hottest blob (`pf-heat-b`, 58–90%, its longest hold) on **`Irrigation`** — the one section the table beside it marks `—`, i.e. no time at all. Mobile does the same, and mobile's table does not list Irrigation at all | Flag. The two halves of the card contradict each other on the reading the whole section is arguing from. Moving B to `Retaining & Structures` (`48s`, ranked 3rd) would fix it, but that is a design change. |
| D14 | The replay chrome says `visit 4 of 4` and `2:14`; the scrub beneath it is labelled `5:16`, the **four-visit** total. A single-visit scrubber with a four-visit duration | Flag. Also: `2:14` coincidentally matches `TAKEOFF.elapsed` and must **not** be wired to it. |
| D15 | Desktop writes `four opens over three days` and `How Sarah H. read the quote`; mobile writes `4 opens over 3 days` and `How Sarah read the quote`; the document inside both says `Sarah Henderson` | Preserve all three, log. §01 ruling 12 precedent. |
| D16 | Card 3's footer action reads `Deposit in` — styled as a link, and an unfinished sentence | Flag. Client copy, principle 3. |
| D17 | Card 3's completed milestone marker is a **lime** tick. `brand.md`: "Selected or completed is forest, never lime… No lime completed checks." | Ship as drawn, log. Principle 1 — it is in the render. Same class as the hero's lime keyline (§02 ruling 2). |
| D18 | Desktop ramps the **forest** scale for the timing chart (100 → 500 → 900); mobile ramps **umber** (`#6E4119` at 12/30/55/100%). Two colour systems for the same chart, and the brand doc's own rule ("Umber is a data tone only") endorses mobile's | Ship both as drawn, log prominently. The same class of question as the §03/04 font mismatch, which the client resolved in favour of the desktop artboard; they may want to do the opposite here. |
| D19 | An **em dash** in the panel paragraph ("every visit — how long"), against `brand.md`'s "No em dashes" | Flag. Client copy, principle 3. Only one apostrophe appears in the whole section (`You’re`, already curly), so there is nothing to normalise. |
| D20 | Un-tokened one-offs: `#EEF0EC` (mobile row dividers, where `--color-slate-100` `#E5E8E5` is the token), `#96602B` typed raw for the mobile rec pip, and `#6E4119` typed raw throughout the mobile chart | Map the two that have tokens (`--color-rust`, `--color-umber`); keep `#EEF0EC` as a commented local constant (§02 ruling 5 precedent). |
| D21 | Radii off the 4/6/8/12 scale: `3px` (group headers), `2px` (table swatches), `10px` (mobile card-2 tiles), plus `8px` on a section whose radius never renders | Ship as drawn, log. §01 ruling 8 precedent. Drop the inert `8px`. |
| D22 | Inert declarations: `gap:5px` on the single-child `Heatmap` badge, `gap:0` on the card-2 `<li>`s, `border-radius:8px` on the section, `flex:0 0 auto` vs `flex:none` used interchangeably on the three medallions | Drop the inert ones, reproduce the render. §02 ruling 3 precedent. |
| D23 | Sources are `assets/photo-1.png` … `photo-3.png` and `assets/xero-mark.png`; the repo ships `.webp` | Map to `/images/photo-{1,2,3}.webp` and `/images/xero-mark.webp`. `photo-4.webp` is not used in this section. |
| D24 | Infinite >5s animations with no pause mechanism (WCAG 2.2.2) | Partial: reduced motion stops everything; do not invent a control; log the residual. §03/04 ruling 5 precedent. |
| D25 | Contrast: five base failures (§8.3, C1–C5) and an overlay residual down to **1.85:1** | C1–C4 fix to AA per the client's standing preference; C5 uses the existing `--color-eyebrow`; escalate the overlay residual with §8.3's two costed options. |

---

## 10. QA checklist

### Structure

- [ ] Two components, `hidden desk:block` and `desk:hidden`. Neither is hidden
      with `opacity-0` or `sr-only`.
- [ ] Desktop section `mx-auto w-full max-w-[1280px] py-24` with **no**
      horizontal padding; banner `h-[520px] pt-14 pl-14`; panel
      `-mt-[300px] px-8 pb-12 pt-[240px]`; card
      `rounded-xl bg-pf-surface-300 p-12 canvas-botanical`.
- [ ] `#pf-radar` is `flex-nowrap` with `gap-6`; two equal `flex-1` columns.
- [ ] Card 1's inner row is `flex-wrap` with `gap-[14px]`; the frame is
      `min-w-[300px] flex-[1_1_330px]`, the table `min-w-[138px] flex-[1_1_146px]`.
- [ ] Six accordion groups in the order Demolition, Excavation, Retaining,
      Paving, Turf, Irrigation. Thirteen line items: 2/2/2/**3**/2/2.
- [ ] Nine static heat blobs, in the DOM order of §2.6, as siblings of the
      chrome/clip/scrub stack — **not** inside the document clip.
- [ ] `pf-heat-a` is the first child of the **Paving** wrapper, `pf-heat-b` of
      the **Irrigation** wrapper; both wrappers are `position:relative`.
- [ ] Card 2 has three rows, card 3 has three milestone rows plus a footer.
- [ ] Mobile has **two** cards. There is no `Get paid`, no Xero pill, no
      eyebrow, no accordion and no `Watch the replay` at any width below 1024.

### Copy — character for character

- [ ] All six group labels, all six amounts, all thirteen line items with their
      quantities and money, verbatim from §2.5.2.
- [ ] `V2 · four opens over three days · 5m 16s all up · Watch the replay`
      (desktop) and `V2 · 4 opens over 3 days · 5m 16s all up` (mobile) — note
      the words/numerals difference is intentional.
- [ ] `How Sarah H. read the quote` (desktop) / `How Sarah read the quote`
      (mobile).
- [ ] The middle dots are `·` (U+00B7), not `•` or `-`.
- [ ] `You’re` in the panel paragraph is curly; the em dash stays.
- [ ] Card 2 row 2's sub differs between breakpoints. Both verbatim.
- [ ] Every figure that exists in `content/home.ts` is read from it —
      `QUOTE.total`, `QUOTE.reference`, `QUOTE.suburb`, `QUOTE.address`,
      `QUOTE.client`, `READING.totalTime`, `READING.opens`,
      `READING.longestTime`, and the extended six-row `SCOPE`.
- [ ] `SCOPE` has been extended with `Excavation & Earthworks` / `$6,480` /
      `--color-cat-excavation`, and the six amounts sum to `$48,200`.
- [ ] `2:14` is a literal and is **not** wired to `TAKEOFF.elapsed`.

### Geometry

- [ ] At 1440 and 1280: `#pf-radar` **1120**, each column **548**, the inner row
      **508**, the replay frame **339 × 409.75**, the timing table **155**.
- [ ] Document clip **352px**; `.doc-track` measures **483.25px** closed and
      **553.75px** with group 4 open, at 1440, 1243 **and** 1024.
- [ ] Group headers **32.75px**; a line item **23.25px**; a two-item body
      **46.5px**; the Paving body **69.75px**.
- [ ] Blob 3 measures **61.0px** at 1280, **88.1px** at 1243 and **68.4px** at
      1024, and blob centres land at the (x, y) in §2.6 at 1280.
- [ ] Mobile at 430: mini viewport **148 × 191**, clip **172**, track **280**,
      timing list **174**.

### Animation — freeze the clock

```js
const T = 11000;                       // ms into the 20s cycle (14s on mobile)
document.getAnimations().forEach(a => { a.pause(); a.currentTime = T; });
```

`currentTime` includes `animation-delay`; nothing in this section carries one.
For `.rec-pip` use `t % 2000` (desktop) or `t % 1400` (mobile).

Desktop, `t` in ms:

- [ ] `t = 0` — document at `translateY(0)`, **all six** groups closed, no
      header tinted, both heat blobs at `opacity:0; scale(.6)`, scrub at `0px`,
      cursor at `left:115.25px; top:112.63px`.
- [ ] `t = 1800` (9%) — group 1 fully open, `max-height:61px; opacity:1`, header
      1 at `#F6F4EC`, everything else closed. Scrub `28.11px`.
- [ ] `t = 3200` (16%) — group 1 begins closing **and** the document begins
      travel 1. Confirm they overlap.
- [ ] `t = 3800` (19%) — every group closed. **Measure the gap to `t = 4200`:
      exactly 400ms.** Repeat at 31→33%, 45→47%, 71→73%, 83→85%.
- [ ] `t = 4400` (22%) — document at exactly `-40px`; group 2 open; heat A at
      `opacity:0` and just starting.
- [ ] `t = 6800` (34%) — document at exactly `-80px`; group 3 open.
- [ ] `t = 7200` (36%) — **heat A at `opacity:1; scale(1)`, 2200ms before group
      4 opens.** If heat A is not already full here, the lead is lost.
- [ ] `t = 8400` (42%) — group 3 begins closing; travel 3 begins.
- [ ] `t = 9400` (47%) — **document at exactly `-150px` and group 4 fully open
      at `max-height:87px`, in the same frame.** Travel 3 measures 1000ms for
      70px; nothing else in the loop moves that fast.
- [ ] `t = 11000` (55%) — **the reference frame.** Group 4 open, header 4 tinted,
      heat A full, heat B at `opacity:.871; scale(.948)`, scrub `171.84px`
      (55%), cursor `left:175.91px; top:155.16px`, document `-150px`.
- [ ] `t = 11600` (58%) — heat B at `opacity:1; scale(1)`.
- [ ] `t = 13600` (68%) — group 4 still fully open. **Measure the dwell
      8800→14200: 5400ms of travel-free hold, 4200ms of it fully open — three
      times groups 1/2/5 and 4.2× group 6.**
- [ ] `t = 14400` (72%) — document at exactly `-170px`.
- [ ] `t = 16600` (83%) — every group closed; travel 5 done at `-179px` by 84%.
- [ ] `t = 17000` (85%) — group 6 open. Dwell to 90% = **1000ms**, the shortest.
- [ ] `t = 18600` (93%) — document at `-179px`, everything closed, the return
      begins. **A 47.75px band of empty white sits below `Accept this quote` in
      this frame; it is in the artboard too.**
- [ ] `t = 18800` (94%) — scrub reaches `width:100%` and holds to 20000.
- [ ] `t = 19900` — document back at ~`-0.66px`, mid-rewind.
- [ ] `.replay-scrub` computes to `linear`. `.acc` / `.acc-head` compute to
      `cubic-bezier(0.32, 0.72, 0, 1)`. `.doc-track` computes to
      `cubic-bezier(0.5, 0, 0.3, 1)`. `.heat` and `.replay-cursor` compute to
      `ease-in-out`. `.rec-pip` to `ease-in-out` on a **2s** duration.
- [ ] `.rec-pip` completes exactly **ten** blinks per 20s cycle and is at
      `opacity:1` at t = 0, 2000, 4000 …
- [ ] Every `pf-hdN` window is identical to its `pf-accN` window. Diff the two
      keyframe sets programmatically; a 1% drift is invisible by eye.

Mobile, `t` in ms:

- [ ] `t = 0` — `translateY(0)`, both blobs at `0 / scale(.6)`, cursor
      `left:58%; top:22%`, scrub `0`.
- [ ] `t = 3080` (22%) — `-18px`.
- [ ] `t = 5320` (38%) — `-44px`; heat A at `1 / scale(1)`.
- [ ] `t = 8400` (60%) — **the reference frame.** `-44px`, **both** blobs at
      `1 / scale(1)`, scrub `64.69px` (60%), cursor computed `left:48.9%;
      top:63.3%`.
- [ ] `t = 10080` (72%) — `-68px`; heat A falling at `.622`.
- [ ] `t = 12600` (90%) — `-68px`; heat A gone at `scale(.8)`; heat B at `.944`.
- [ ] Confirm the **38→64% dwell measures 3640ms**, the longest in the cycle, and
      that `Paving & stonework` with heat A is what is on screen for it.
- [ ] `.m-scrub` reaches 100% at exactly 14000ms with **no hold** — unlike
      desktop.
- [ ] `.m-rec` completes exactly **ten** blinks per 14s cycle.

### Reduced motion

- [ ] Every animation in both sections reports `animation-name: none`. Nothing
      is left running, including the two heat blobs.
- [ ] Desktop: **exactly one** accordion is open and it is **group 4, Paving &
      Stonework**, at `max-height:87px`. Five report `max-height:0; opacity:0`.
      Six open groups is the single fastest way to spot the artboard's broken
      block having been ported verbatim.
- [ ] Desktop: **exactly one** header is tinted `#F6F4EC`, and it is group 4's.
- [ ] Desktop: `.doc-track` is `translateY(-150px)`; `.replay-scrub` is `55%`;
      both heat blobs are `opacity:1; scale(1)`; `.replay-cursor` is
      `left:52%; top:44%` — **not** the inline `56% / 42%`.
- [ ] Desktop: `.rec-pip` is a solid dot at `opacity:1`.
- [ ] Desktop: the nine forest blobs are unchanged, at their authored opacities.
- [ ] Mobile: `.m-doc-track` is `translateY(-44px)`, `.m-scrub` is `60%`, both
      blobs `opacity:1`, `.m-cursor` is `left:49%; top:63%`.
- [ ] Screenshot both resting states and confirm each is the same composition as
      its live frame (`t = 11000` / `t = 8400`) modulo the two rounded values
      named in §3.9.
- [ ] Grep the build: **no** `pf-replay-track`, no `@keyframes pf-replay`, no
      `translateY(-39%)`.

### Fluid range

- [ ] **1244 → 1243px** is the one transition to check first: at 1244 the timing
      table sits beside the frame (330 / 146), at 1243 it drops beneath it and
      both go 489.5px wide. Neither state may clip or overflow.
- [ ] 1024px: the table is beneath the frame, the frame is 380px, `#pf-radar` is
      826.5px tall, the full 20s choreography still runs, and no `pf-doc` offset
      has changed.
- [ ] 1023 → 1024px: the composition swaps whole. No width shows six accordion
      groups on mobile; no width shows `Get paid` below 1024; no width runs both
      clocks.
- [ ] 320px: gutter 16px, panel padding 16px, mini viewport **116.5px**, timing
      list **95.5px**, no row ellipsises its **time**, card-2 thumb **64px**,
      banner H2 at **23px**, no horizontal overflow.
- [ ] 430px: identical to the artboard. Mini viewport measures exactly
      **148.0px**, card-2 thumb exactly **84.0px**, banner H2 exactly **28.0px**.
- [ ] 560px: panel horizontal padding steps to 24px; content capped at 560px.
- [ ] 640px: gutter steps to 32px, via `sm-only:` not `sm:`.
- [ ] 768px and 1023px: content capped and centred, the mini viewport still
      148px, still a 14s clock.

### Accessibility

- [ ] Both replay frames are `role="img"` with the labels from §8.1.
- [ ] No `aria-hidden=""` anywhere — all 37 desktop and 24 mobile instances read
      `"true"`.
- [ ] Every `<img>` in the section is `alt=""`, **including the Xero mark**.
- [ ] Heading outline: the chapter contributes `h2` → `h3` → `h4 h4 h4`
      (desktop) and `h2` → `h3` → `h4 h4` (mobile). No `h1`.
- [ ] The section adds **zero** tab stops at every width.
- [ ] VoiceOver, desktop: eyebrow → heading → paragraph → `How Sarah H. read the
      quote` → `Heatmap` → the sub-line → the replay frame as **one** image →
      `Section` `Time` and the five rows → `Least time` `Most time` → card 2 →
      card 3. No line item, no dollar figure from inside the document, and no
      scrub position is announced.
- [ ] axe clean at 1440, 1280, 1024, 768 and 390, in **both** motion
      preferences.
- [ ] Contrast spot-checks against §8.3: the chrome sub-line must measure
      **≥4.5** after C1; `visit 4 of 4` after C2; the quantity column after C3;
      the mobile legend after C4; the eyebrow after C5. `Watch the replay`
      (6.45), the `Heatmap` badge (7.71) and the mobile rows under their heat
      blobs (7.67 / 7.79) **pass** — do not "fix" them.
- [ ] The overlay residual is logged, not silently changed: `48 m²` under blob 3
      still measures ~1.85:1 at `t = 9400` unless the client takes option A.
