# 10 — Chapter 3, "Playbook" (sales pipeline + team board)

Source:

- Desktop — `Bramble Home Web.dc.html`, `<!-- ===== CHAPTER 3: PLAYBOOK ===== -->`,
  lines **1466–1674**. The team leaderboard band at 1610–1670 is the last child
  of the same panel, not a section of its own (§6).
  CSS in the `<style>` block: `pf-won-*` / `pf-grab` / `pf-swapA` / `pf-swapB`
  at **133–140 (global)**, **142–159 (dead copy)** and **170–187 (effective
  copy)**, all but the first trapped inside an unclosed
  `@media (min-width:1280px)` that opens at **141** and closes at **214**;
  `.pf-board` at **294–296**; `.pf-analytics-*` at **333–336**;
  `.pf-oneline` at 160/188 (not used in this chapter).
  The count-up JS is in the `<script type="text/x-dc">` block, `fmt()` at
  **2028–2039** and `runCount()` at **2040–2044**.
- Mobile — `Bramble Home Mobile.dc.html`, lines **633–777**. A different
  composition: four stacked status groups and the leaderboard, with **no
  animation of any kind**.

This chapter carries three independent systems on one panel:

1. seven **animated count-ups** in a browser-chrome analytics card, driven by
   JavaScript, not CSS;
2. a static four-lane **kanban board**;
3. a **14-second won-job flight** — lift, fly, land, shine, toast, count swap,
   reset — layered over that board.

Two components, mutually exclusive by breakpoint:

- `<Chapter3Desktop>` — `hidden desk:block`
- `<Chapter3Mobile>` — `desk:hidden`

They cannot be one component. Four lanes against four stacked groups, twelve
board cards against five, a browser-chrome analytics card and eight-cell counter
strip that mobile does not draw at all, three tilted stat cards that mobile does
not draw at all, and an entire animation system on one side only. `desk` =
1024px.

**Unlike section 05, the desktop motion CSS still needs one media query.** The
`hidden desk:block` gate removes the 1024-and-below problem, but the artboard
draws a *real* internal breakpoint at **1280px**: the board goes three-column to
four-column and the flying card's travel vector changes with it. §5.2 has the
detail. That one query is the only one in the file.

---

## 1. The chapter shell — shared with chapters 1 and 2

The shell is identical in chapters 1, 2 and 3 apart from four parameters. It is
**not** owned by this spec; build it once as `<ChapterShell>` and pass this
chapter's values in. Recorded here so the numbers are in one place.

```
section: margin:0 auto; width:100%; max-width:1280px;
         display:flex; flex-direction:column;
         overflow:hidden; border-radius:8px;
         padding:<CHAPTER>

inner:   margin:0 auto; display:flex; width:100%; max-width:1280px;
         flex-direction:column

banner:  position:relative; z-index:20; height:520px;
         overflow:visible; padding:56px 0 0 56px

  photo wrapper (.pf-banner-fade):
         position:absolute; inset:0; overflow:hidden;
         border-radius:12px 12px 0 0
  photo inner:
         position:absolute; inset-inline:0; top:-20%; height:130%;
         transform:translateY(-70px)
  img:   width:100%; height:100%; object-fit:cover;
         object-position:<CHAPTER>

  h1.pf-h1: position:relative; z-index:10;
         color:var(--pf-ink-100); max-width:820px

panel:   position:relative; margin-top:-300px; overflow:hidden;
         border-radius:0 0 12px 12px; padding:240px 32px 48px

  blurred echo: pointer-events:none; position:absolute; inset:0;
         overflow:hidden; border-radius:12px
    inner: position:absolute; inset:0; top:-25%; height:150%;
         transform:scaleY(-1); filter:blur(40px)
    img:  same file as the banner, width/height 100%, object-fit:cover

  card (.canvas-botanical):
         position:relative; z-index:30; display:flex;
         flex-direction:column; background:var(--pf-surface-300);
         border-radius:12px; padding:<CHAPTER>
```

**Chapter 3's four parameters:**

| Parameter | Chapter 1 | Chapter 2 | **Chapter 3** |
|---|---|---|---|
| `section` padding | `32px 0 0` | `96px 0 96px` | **`0 0 96px`** |
| banner photo | `photo-2` | `photo-3` | **`photo-1`** → `/images/photo-1.webp` |
| `object-position` | `center 40%` | `center 45%` | **`center 30%`** |
| card padding | `48px 48px 48px` | `48px` | **`48px`** |

H1 copy, verbatim, one text node inside a `<span>`:

> `Build a quoting & sales system that gets sharper every job.`

The `&` is a literal ampersand (`&amp;` in the source), not the word "and".

`.pf-banner-fade` and `.canvas-botanical` already ship as `.banner-fade` and
`.canvas-botanical` in `styles/base.css`; do not re-declare them.

`.pf-h1` = `2.75rem/1.14/-.01em` → `4rem` at ≥768px → `4.75rem` at ≥1024px, in
Fraunces at `"wght" 420, "SOFT" 100, "WONK" 0, "opsz" 10`. That is our
`.display .display-1`.

Content width inside the card at 1280px viewport: **1120px**
(1280 − 64 panel padding − 96 card padding).

**The three `<h1>`s are a document-outline defect that belongs to the shell.**
Chapters 1, 2 and 3 each open with `<h1 class="pf-h1">`, and the hero has one
too — four `<h1>`s on the page. Ship the type as drawn and the *level* as `<h2>`;
`.display-1` carries the size independently of the tag. Same call as
RULINGS §03/04 ruling 8. Flagged again in §10, D1, because it is one decision
across three chapters and should be made once.

---

## 2. The three tilted stat cards

### 2.1 Stage and stack

```
stage (.pf-analytics-stage):
  position:relative; display:flex; width:100%;
  flex-direction:column; align-items:center; padding-top:132px

stack (.pf-analytics-cards):
  position:absolute; inset-inline:0; top:0; z-index:1;
  display:flex; height:160px; justify-content:center
```

The `132px` of stage padding is the room the stack occupies above the browser
card; the browser card itself is `position:relative; z-index:10`, so it sits
*over* the bottom of the three tilted cards.

### 2.2 The hover lift on the stack

Verbatim, and **global** — it is outside the broken media query, so it is live
at every width:

```css
.pf-analytics-cards{transform:translateY(18px) scale(.96);
  transition:transform .45s cubic-bezier(.22,1,.36,1)}
.pf-analytics-stage:hover .pf-analytics-cards{transform:none}
```

Rest is `translateY(18px) scale(.96)` — the three cards tucked down behind the
browser card. Hovering anywhere on the stage lifts them to their true size and
position over 450ms. Nothing in the stage is focusable, and the lift reveals no
information (the cards are fully legible at rest), so **no `:focus-within`
equivalent is required** — unlike the marquee, where the hover *pause* was an
accessibility mechanism.

Card 2's own `transform:translateX(-50%) rotate(0deg)` is on the card, the lift
is on the parent. They compose; there is no conflict.

### 2.3 Reveal

Each card carries `data-anim="pop" data-duration="0.5"` on the `.pf-anim-idle`
wrapper, with delays **0 / 0.12 / 0.24**. Use `<Reveal anim="pop" duration={0.5}
delay={…}>`, driven by `lib/use-reveal.ts`.

### 2.4 The three cards

All three: `class="pf-shadow-border-strong"` → our `.shadow-border-strong`;
`width:174px; border-radius:12px; background:#fff; padding:13px 14px`.
Cards 1 and 2 are `display:flex; flex-direction:column; gap:7px`; card 3 is
`display:flex; align-items:center; gap:12px`.

| # | Label | Figure | Position | Rotation |
|---|---|---|---|---|
| 1 | `Win rate` | `62%` | `top:26%; left:17%` | `rotate(-5deg)` |
| 2 | `Quotes sent` | `18` | `top:6%; left:50%` | `translateX(-50%) rotate(0deg)` |
| 3 | `Margin` | `31%` | `top:24%; right:16%` | `rotate(5deg)` |

Label type, all three:

```
font-family:var(--font-sans); font-size:10.5px; font-weight:700;
letter-spacing:.1em; text-transform:uppercase;
color:var(--color-slate-500,#6E7669)
```

Figure type, all three:

```
font-family:var(--font-serif); font-weight:600; font-size:26px;
line-height:1; font-variant-numeric:tabular-nums;
color:var(--color-ink,#16321E)
```

`--font-sans` is Hanken Grotesk and `--font-serif` is Source Serif 4
(RULINGS §01 ruling 9) → `--font-ui` / `--font-ui-serif`. These cards are a
product-UI depiction, so the product faces are correct here.

**Card 1 — the sparkline.** `<svg viewBox="0 0 120 34" style="display:block;
height:30px;width:100%">`, two paths sharing the same seven points:

```
area:   d="M2 28 L22 24 L42 26 L62 17 L82 19 L102 8 L118 4 L118 34 L2 34 Z"
        fill="url(#pfSpk)"
stroke: d="M2 28 L22 24 L42 26 L62 17 L82 19 L102 8 L118 4"
        fill="none" stroke="#2C5539" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
```

Gradient `#pfSpk`, `x1=0 y1=0 x2=0 y2=1`:
`#4D8F6C` at `stop-opacity:.3` → `#4D8F6C` at `stop-opacity:0`.

The gradient `id` must be namespaced per instance (`useId()`), or a second
sparkline anywhere on the page will collide with it.

**Card 2 — the bar set.** A `<span>` wrapper,
`display:flex; align-items:flex-end; gap:4px; height:30px`, seven children, each
`flex:1; border-radius:2px`:

| Bar | 1 | 2 | 3 | 4 | 5 | **6** | 7 |
|---|---|---|---|---|---|---|---|
| height | `38%` | `52%` | `44%` | `66%` | `58%` | **`82%`** | `74%` |
| fill | `color-mix(in oklab,#4D8F6C 32%,transparent)` ×5 | | | | | **`var(--color-lime-500,#C8E84A)`** | same mix |

Bar 6 is the one lime bar — the you-are-here marker, an allowed lime role.
It is **not** the tallest-is-last shape; bar 7 comes back down to 74%.

Card 2 also carries a delta chip beside the figure:

```
display:inline-flex; align-items:center; gap:4px; border-radius:6px;
background:var(--color-lime-100,#ECF6BD); padding:2px 7px;
font-family:var(--font-sans); font-size:11px; font-weight:700;
color:var(--color-forest-800,#1F4934); white-space:nowrap
```

Copy, verbatim, including the glyph: `▲ this month`. `▲` is type, not
iconography — explicitly sanctioned by `brand.md` for a stat delta.

**Card 3 — the donut.** `<svg viewBox="0 0 64 64" style="display:block;
height:52px;width:52px">`, one `<g transform="rotate(-90 32 32)" fill="none"
stroke-width="9" stroke-linecap="round">` containing two circles at
`cx=32 cy=32 r=26`:

```
track: stroke="color-mix(in oklab,#4D8F6C 22%,transparent)"
value: stroke="#2C5539" stroke-dasharray="50.6 163.4"
```

Circumference is `2π × 26 = 163.36`, so `50.6 / 163.36 = 30.98%` — the dash
array encodes the `31%` in the figure. The gap term (`163.4`) exceeds the
remainder, which is what stops a second dash appearing; keep it.

Card 3's text stack is `display:flex; min-width:0; flex:1;
flex-direction:column; gap:3px` and adds a third line under the figure:

```
font-family:var(--font-sans); font-size:11px;
color:var(--color-slate-500,#6E7669)
```

> `across 18 jobs`

---

## 3. The browser-chrome analytics card

### 3.1 Header block above it

```
wrapper: padding-bottom:80px
inner:   position:relative; display:flex; flex-direction:column;
         align-items:center; gap:24px
header:  display:flex; flex-direction:column; gap:6px;
         align-items:center; text-align:center
```

**Eyebrow** — `data-anim="up-blur" data-duration="0.5"`:

```
margin-bottom:4px; font-size:12px; font-weight:800;
letter-spacing:.14em; text-transform:uppercase;
color:var(--pf-lime-500)   /* = #95B225 */
```

Copy, as authored: `YOUR SALES PIPELINE`.

**This is exactly the failure RULINGS already ruled on.** `--pf-lime-500` is the
web artboard's inverted name for `lime-700`, and measured on the rendered
artboard it is **2.26:1 on `#F8F7F2`** (§9). Apply **`--color-eyebrow`
(`#657919`, measured **4.55:1**)** — the client decision from the §03/04
escalation. Do not use `lime-700`.

Store the copy **sentence case** (`Your sales pipeline`) and let
`text-transform:uppercase` do the rest. `text-transform` does not change the
accessible name, so caps in the DOM are read as caps by screen readers that
spell out all-capital strings. Same for `One source of truth` in §6, which the
artboard *does* author in sentence case — the two are inconsistent in the
source (§10, D14).

**H3** — `class="pf-h3"`, `data-anim="up-blur" data-delay="0.05"
data-duration="0.5"`, `color:var(--pf-ink-900)`.

`.pf-h3` = `1.5rem/1.2/-.018em` → `1.75rem` at ≥768px. That is our
`.display .display-3`. Copy, verbatim:

> `Know where every quote stands, and what to do next.`

**Body** — `data-anim="up-blur" data-delay="0.1" data-duration="0.5"`,
`margin-top:6px; max-width:64ch; font-size:18px; color:var(--pf-ink-900)`. No
`line-height`, so it inherits the page's `1.5`. Copy, verbatim:

> `No lost spreadsheets, no digging through emails. Everything in one place: a
> birdseye view of your entire business, whether you run it on your own or with
> a team.`

### 3.2 The card

`data-anim="scale" data-duration="0.5"`, `class="pf-shadow-border-strong"`:

```
position:relative; z-index:10; display:flex; width:100%;
max-width:1024px; flex-direction:column; overflow:hidden;
border-radius:12px; background:#fff
```

**Chrome bar:**

```
display:flex; align-items:center; gap:12px;
border-bottom:1px solid var(--pf-ink-200);
background:var(--color-well,#F6F4EC); padding:9px 14px
```

One `aria-hidden` span, `display:flex; flex:none; gap:6px`, with three
`9px × 9px` `border-radius:9999px` dots, all `background:#D9D3C4`. Per
RULINGS §02 ruling 6 use `rounded-full`. `#D9D3C4` is an un-tokened one-off —
keep it as a commented local constant, same treatment as §02 ruling 5. The
`gap:12px` on the bar is inert (one child); drop it and reproduce the render
(§02 ruling 3). There is a stray empty text node after the dots in the source —
drop it.

**Title row:**

```
display:flex; align-items:center; justify-content:space-between;
padding:10px 16px
```

`Analytics` — `font-size:14px; font-weight:700; color:var(--pf-ink-900)`.
`All` chip — `border-radius:6px; background:var(--pf-overlay-100);
padding:2px 8px; font-size:11px; font-weight:600; color:var(--pf-ink-700)`.

Neither sets `font-family`, so both inherit Nunito Sans, **not** the product
face the kanban below them uses. That is a real split inside one mockup —
reproduce it and flag it (§10, D13).

### 3.3 The eight-cell counter strip

```
display:grid; grid-template-columns:repeat(8,1fr);
border-top:1px solid var(--pf-ink-200)
```

Cell 1: `padding:8px 12px`. Cells 2–8 add `border-left:1px solid
var(--pf-ink-200)`.

Each cell is two `<p style="margin:0">`:

```
label: font-size:10px; color:var(--pf-ink-500)
value: font-size:14px; font-weight:700; color:var(--pf-ink-900)
```

The value `<p>` wraps a `<span>` carrying the count attributes. **All eight,
verbatim:**

| # | Label | `data-count` | `data-format` | `data-duration` | Initial text | Final text |
|---|---|---|---|---|---|---|
| 1 | `Quotes` | `42` | `int` | `900` | `0` | `42` |
| 2 | `Won` | `35` | `int` | `900` | `0` | `35` |
| 3 | `Win rate` | `83` | `percent0` | `900` | **`83%`** | `83%` |
| 4 | `Pipeline` | `312000` | `moneyKwhole` | `900` | `$0K` | `$312K` |
| 5 | `Avg job` | `300000` | `moneyKwhole` | `900` | `$0K` | `$300K` |
| 6 | `Deposits` | `780000` | `moneyKwhole` | `900` | `$0K` | `$780K` |
| 7 | `Margin` | `22` | `percent0` | `900` | `0%` | `22%` |
| 8 | `Overdue` | — | — | — | — | `$0` |

Cell 8 has **no `data-count`**. It is a static `$0` and its value `<p>` is
`color:var(--pf-green-600)` (`#4D8F6C`) rather than `--pf-ink-900`, the only
coloured value in the strip. Both the missing count and the colour measure as
defects (§9, §10 D3/D4).

Cell 3's placeholder is its **final** value where the other six are zeroes, so
before the strip scrolls into view one cell already reads `83%` (§10, D5).

Source the strip from one exported constant, `content/playbook.ts`, so QA has a
single place to diff. `Pipeline`, `Avg job` and `Deposits` do not appear in
`content/home.ts` and are new to this chapter; reference `content/home.ts` for
anything that already lives there (§4).

### 3.4 The formatter and the easing, quoted from the artboard

`fmt()`, verbatim from lines 2028–2039 — only `int`, `percent0` and
`moneyKwhole` are reachable from this chapter, but port the whole switch because
other chapters use the rest:

```js
  fmt(kind,n){ switch(kind){
    case 'thousands1':return (n/1000).toFixed(1)+'K';
    case 'millions2':return (n/1e6).toFixed(2)+'M';
    case 'money1':return '$'+(n/1000).toFixed(1)+'K';
    case 'moneyKwhole':return '$'+Math.round(n/1000)+'K';
    case 'dollars':return '$'+Math.round(n).toLocaleString('en-US');
    case 'percent':return n.toFixed(1)+'%';
    case 'percent0':return Math.round(n)+'%';
    case 'kwhole':return Math.round(n/1000)+'K';
    case 'mwhole':return Math.round(n/1e6)+'M';
    default:return String(Math.round(n));
  } }
```

`runCount()`, verbatim from lines 2040–2044:

```js
  runCount(el){
    const value=parseFloat(el.dataset.count), kind=el.dataset.format||'int', dur=parseInt(el.dataset.duration||'900'), delay=parseInt(el.dataset.delay||'0'), pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent=pre+this.fmt(kind,value)+suf; return; }
    setTimeout(()=>{ const t0=performance.now(); const step=(now)=>{ const t=Math.min((now-t0)/dur,1); el.textContent=pre+this.fmt(kind,value*(1-Math.pow(1-t,3)))+suf; if(t<1)requestAnimationFrame(step); }; requestAnimationFrame(step); },delay);
  }
```

**The easing is `1 - Math.pow(1 - t, 3)`** — a cubic ease-out, equivalent to
`cubic-bezier(0.215, 0.61, 0.355, 1)`. It is applied to the *value*, not to a
transform, so at 450ms (half of 900) the number is already at **87.5%** of
target. `Pipeline` reads `$273K` at the halfway point, not `$156K`. An engineer
who substitutes a linear ramp will produce a visibly different, slower-feeling
count even though the total duration matches.

**Reduced motion: confirmed, and it is the resting state.** The first line of
`runCount()` short-circuits to `el.textContent = pre + this.fmt(kind, value) +
suf` and returns — the element is painted at its **final formatted value**
immediately, with no animation and no `setTimeout`. So under
`prefers-reduced-motion: reduce` the strip reads
`42 / 35 / 83% / $312K / $300K / $780K / 22% / $0`. Ship exactly that; it is
what the comparison harness will screenshot, and it is also what the strip
settles to in the live loop, so the two agree.

### 3.5 The trigger: the artboard polls, we observe  **[Designer decision]**

The artboard's scheduler is the same one `lib/use-reveal.ts` replaced:

```js
this._tick=setInterval(()=>{ try{ this.onScroll(); }catch(e){} },60);
…
if(this._counts&&this._counts.length){ this._counts=this._counts.filter(el=>{ const r=el.getBoundingClientRect(); if(r.top<vh*0.85 && r.bottom>0){ this.runCount(el); return false; } return true; }); }
```

A 60ms `setInterval` plus a whole-tree `MutationObserver`, both workarounds for
the canvas editor re-rendering underneath the script. Neither is needed here.

**Ship `lib/use-count-up.ts`, written to the same shape as `use-reveal.ts`:**

- One `IntersectionObserver` over `[data-count]:not([data-counted])`,
  `observer.unobserve(el)` on fire, so each element counts once and only once.
- `rootMargin: "0px 0px -15% 0px"`. That encodes the artboard's own trigger
  point exactly: it fired when the element's top passed **85%** of the viewport
  height. `r.bottom > 0` is what `IntersectionObserver` already gives you for
  free, so it has no rootMargin term.
- **This threshold is deliberately not the reveal system's.** `use-reveal.ts`
  uses `-10% 0px 80px 0px` (90%, with an 80px bottom extension) because the
  artboard's `checkReveals` used `r.top < vh*0.9 && r.bottom > -80`. Two
  different numbers in the source; keep both, do not unify.
- Reduced-motion branch first, mirroring `use-reveal.ts`: if
  `matchMedia("(prefers-reduced-motion: reduce)").matches`, write every target's
  final formatted value synchronously and return without constructing the
  observer.
- A `MutationObserver` on `document.body` `{childList:true, subtree:true}` that
  observes only *added* nodes, exactly as `use-reveal.ts` does.
- `data-duration` on a count is **milliseconds** (`parseInt`); `data-duration`
  on a reveal is **seconds**. Same attribute name, two units. Name the count
  hook's prop `durationMs` so the unit cannot be lost in a refactor (§10, D6).

**Add `font-variant-numeric: tabular-nums` to the seven counting values.** The
artboard sets it on the three tilted-card figures and not on the strip, so every
cell reflows on every frame of the count. Brand rule is "tabular numerals only
in a column of money", but a number that changes 60 times a second is the case
the rule exists to protect; this is a functional fix under RULINGS principle 2.

---

## 4. The kanban board

### 4.1 The board container and grid

The board sits in the card's last row:

```
position:relative; border-top:1px solid var(--pf-ink-200);
background:var(--color-background,#F3F0E6); padding:16px
```

`--color-background` is **not declared anywhere in the web artboard**, so the
`#F3F0E6` fallback is what renders. That is our `--color-canvas`; use the token
(§10, D12).

```css
.pf-board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
.pf-board-closed{grid-column:1/-1}
@media (min-width:1280px){
  .pf-board{grid-template-columns:repeat(3,minmax(0,1fr)) 236px}
  .pf-board-closed{grid-column:auto}
}
```

Plus inline `align-items:start; gap:12px`.

So: **below 1280px the Closed lane is a full-width second row** under Draft /
Sent / Negotiating. **At and above 1280px it is a fixed 236px fourth column.**
Both are live in our build (our range opens at 1024), and §5.2 shows the flying
card's travel vector switches with them.

### 4.2 The four lanes

Lane shell, all four:

```
display:flex; flex-direction:column; gap:10px;
border-radius:12px; background:<tone>; padding:12px
```

Header, all four:

```
display:flex; align-items:center; gap:8px; padding:0 4px
```

Dot — `flex:none; width:8px; height:8px; border-radius:9999px;
background:<dot>`.
Name — `<h3 style="margin:0; font-family:var(--font-sans); font-size:11.5px;
font-weight:600; letter-spacing:.1em; text-transform:uppercase;
color:var(--color-ink,#16321E)">`.
Count — `font-family:var(--font-sans); font-size:12px;
color:var(--color-slate-400,#8A9082)`.
Value — `margin-left:auto; font-family:var(--font-sans); font-size:14px;
font-weight:500; color:var(--color-slate-700,#35402F)`.

Lane body — `display:flex; flex:1; flex-direction:column; gap:8px`.

| Lane | Background | Dot | Count | Value | Notes |
|---|---|---|---|---|---|
| `Draft` | `#EFECDF` | `var(--color-slate-300,#A2A899)` | `2` | `$29.7k` | |
| `Sent` | `#E6E0CC` | `var(--color-forest-500,#4D8F6C)` | `2` | `$82.1k` | |
| `Negotiating` | `#DDD9C0` | `var(--color-lime-500,#C8E84A)` | `2` → `1` | `$78.6k` → `$15.8k` | dot also carries `border-radius:12px` and `box-shadow:0 8px 20px -10px rgba(21,48,31,.4)` |
| `Closed` | `#D2D5C0` | `var(--color-slate-300,#A2A899)` | `6` → `7` | *(no value)* | `class="pf-board-closed"` |

The four lane tones are un-tokened one-offs and the ramp is deliberate
(`#EFECDF` → `#E6E0CC` → `#DDD9C0` → `#D2D5C0`, progressively deeper and
cooler). Ship as commented local constants, §02 ruling 5. `#E6E0CC` happens to
equal `--color-card-muted` — use the token there only, and keep the other three
literal so the ramp reads as one set.

Only the **Negotiating** dot is lime (forward motion — an allowed lime role) and
only it has a radius off the scale plus a drop shadow. Per §02 ruling 6, a 12px
radius on an 8px box already clamps; ship `rounded-full`. The shadow ships as
drawn.

The **Closed** lane's header has a count but **no value total**, unlike the
other three. It also carries a blurb the others do not:

```
margin:0; padding:0 4px; font-family:var(--font-sans);
font-size:12px; line-height:1.45; color:var(--color-slate-400,#8A9082)
```

> `Won jobs land here. Bramble reminds you to go back for repeat business.`

and a trailing link outside the card list:

```
padding:2px 4px 0; font-family:var(--font-sans); font-size:13.5px;
font-weight:600; color:var(--color-forest-700,#2C5539)
```

> `See all closed →`

### 4.3 The standard card shell (Draft, Sent, Negotiating)

```
border-radius:8px; background:#fff; padding:12px
```

```
head row: display:flex; align-items:center; gap:9px
  img:    flex:none; height:38px; width:38px; border-radius:6px;
          object-fit:cover
  text:   display:flex; min-width:0; flex:1; flex-direction:column; gap:1px
  name:   min-width:0; font-family:var(--font-sans); font-size:14px;
          font-weight:500; color:var(--color-charcoal-900,#1D2A20);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis
  client: display:flex; align-items:center; gap:5px;
          font-family:var(--font-sans); font-size:12px;
          color:var(--color-slate-500,#6E7669)
          + Lucide `User`, 14×14 viewBox 0 0 24 24, 12×12 rendered,
            fill=none stroke=currentColor stroke-width=2, round caps/joins,
            aria-hidden, flex:none
          + name span, nowrap/ellipsis

amount:   margin-top:9px; display:flex; align-items:baseline;
          justify-content:space-between; gap:8px
  figure: font-family:var(--font-sans); font-size:15px; font-weight:500;
          color:var(--color-charcoal-900,#1D2A20)

status:   margin-top:9px; display:block;
          border-top:1px solid var(--color-slate-100,#E5E8E5);
          padding-top:9px
  line:   display:block; font-family:var(--font-sans); font-size:12px;
          line-height:1.4; color:<slate-700 | rust>

link:     margin-top:9px; display:block; font-family:var(--font-sans);
          font-size:13.5px; font-weight:600;
          color:var(--color-forest-700,#2C5539)
```

`justify-content:space-between` on a one-child amount row is inert — drop it and
reproduce the render (§02 ruling 3).

`View quote →` is **text, not a link**. Same call as §05 §3.5: it is a depiction
of a control inside a depiction of an app. Do not render it as `<a>` or
`<button>`; that would add five inert tab stops. `→` is type, per `brand.md`.

### 4.4 All nine board cards, verbatim

Source these from one exported constant, `content/playbook.ts`. `14 Beach Rd`,
`Sarah Henderson` and `$48,200` already exist as `QUOTE.address`,
`QUOTE.client` and `QUOTE.total` in `content/home.ts` — **reference those, do
not retype them.** This is the fourth place on the page that quote appears.

**Draft — 2 cards, `$29.7k`**

| # | Name | Client | Amount | Status line | Photo |
|---|---|---|---|---|---|
| 1 | `Ferndale rear garden` | `Priya Raman` | `$18,400` | `Take-off done, prices to go on` | `photo-1` |
| 2 | `Boyd St courtyard` | `Dan Boyd` | `$11,250` | `Started Tuesday` | `photo-3` |

Status colour: `var(--color-slate-700,#35402F)` on both.
`$18,400 + $11,250 = $29,650` → `$29.7k`. Consistent.

**Sent — 2 cards, `$82.1k`. This is the rust lane.**

| # | Name | Client | Amount | Status line | Photo |
|---|---|---|---|---|---|
| 1 | `QUOTE.address` (`14 Beach Rd`) | `QUOTE.client` (`Sarah Henderson`) | `QUOTE.total` (`$48,200`) | `Opened 4 times, no reply in 6 days` | `photo-2` |
| 2 | `Wattle Grove frontage` | `Leah Cortez` | `$33,900` | `Never opened. Sent 9 days ago` | `photo-4` |

**Both status lines are `var(--color-rust,#96602B)`** — the only rust text in
the chapter, and the only lane where the status line is not slate-700. Rust is
the brand's one warning tone and this is exactly its role: a quote going cold.
Measured **5.24:1** on white (§9) — it passes.

`$48,200 + $33,900 = $82,100` → `$82.1k`. Consistent.

**Negotiating — 2 cards, `$78.6k` (`$15.8k` after the flight)**

| # | Name | Client | Amount | Status line | Photo |
|---|---|---|---|---|---|
| 1 | `112 Ridgeway Ave` | `Tom Ridgeway` | `$62,800` | **none** | `photo-2` |
| 2 | `Harcourt St terrace` | `Jo Harcourt` | `$15,800` | `Waiting on the stone spec` | `photo-1` |

Card 1 is **the flying card**. It is the only board card with **no status line
and no divider** — it goes straight from the amount to `View quote →`. That is
as drawn, and it is load-bearing: it is what keeps the card short enough to fit
the 150px `max-height` the slot and land keyframes use (§5).

Card 1 also carries `cursor:grabbing` **permanently**, not only during the
flight (§10, D8).

`$62,800 + $15,800 = $78,600` → `$78.6k`, and `$78.6k − $62.8k = $15.8k`. The
swap arithmetic is correct.

**Closed — 2 cards, count `6` → `7`, no value total**

Different shell from the other three lanes: 30px photo, 13.5px name, a combined
client-and-amount meta line, and a status row with a dot instead of a divider.

*Card 1 — the landed card (white, lime keyline):*

```
position:relative; overflow:hidden; border-radius:8px; background:#fff;
padding:12px; box-shadow:0 0 0 1.5px var(--color-lime-500,#C8E84A)
```

| Field | Value |
|---|---|
| Photo | `photo-2`, `30×30`, `border-radius:6px` |
| Name | `112 Ridgeway Ave`, 13.5px/500 `charcoal-900` |
| Meta | `Tom Ridgeway · $62,800`, 12px `slate-500`, Lucide `User` 12×12 |
| Status | `Won`, 11.5px/600, `letter-spacing:.05em`, uppercase, `var(--color-forest-800,#1F4934)`, 6px `lime-500` dot |

The `1.5px` lime keyline is the same banned decorative-lime border as the hero's
float cards. **Build as drawn and log**, RULINGS §02 ruling 2 — identical case,
identical call. All three inner spans carry `position:relative` so they sit over
the shine sweep (§5.4).

*Card 2 — the settled card (well, muted):*

```
border-radius:8px; background:var(--color-well,#F6F4EC); padding:12px
```

| Field | Value |
|---|---|
| Photo | `photo-3`, `30×30`, **`opacity:.72`** |
| Name | `Mosman retaining + steps`, 13.5px/500 `var(--color-slate-700,#35402F)` |
| Meta | `Ana Silva · $21,400`, 12px `var(--color-slate-400,#8A9082)` |
| Status | `Won`, same type, `var(--color-slate-500,#6E7669)`, 6px `var(--color-forest-700,#2C5539)` dot |

The two Closed cards are the same content at two ages: the fresh one keeps its
photo at full strength, white fill, lime dot and forest-800 label; the settled
one fades every one of those a step. A completed state in forest, never lime —
except the fresh one, which is lime because it *just* happened. That reading is
consistent with `brand.md` and is worth preserving exactly.

`Ana Silva` / `$21,400` / `Mosman retaining + steps` is the same job as calm
card 3 in section 05 (`Ana's invoice cleared, $21,400`, `Mosman retaining and
steps`). **Put it in `content/playbook.ts` and cross-reference
`content/before-after.ts`** — the two spell the job differently (`+` against
`and`), which is §10, D15.

All nine photos map `assets/photo-N.png` → `/images/photo-N.webp`, `alt=""`,
`next/image` with explicit `width`/`height` (they are fixed 30/38/44px boxes,
not `fill`).

---

## 5. The 14-second won-job system

Ship as `styles/motion/playbook.css`, imported from `app/globals.css` after
`before-after.css`. Keyframes prefixed `pb-`, classes unprefixed, everything in
`@layer components`, reduced-motion block last — the `hero.css` convention.

**14s cycle. 1% = 140ms.** Every number below converts with that.

### 5.1 The driver

Verbatim from the artboard (lines 185–186, the effective copy):

```css
.pf-won{animation-duration:14s;animation-timing-function:cubic-bezier(.32,.72,0,1);animation-iteration-count:infinite;animation-fill-mode:both}
.pf-won-lin{animation-timing-function:linear}
```

`cubic-bezier(.32,.72,0,1)` is a sharp decelerating curve — 90% of the distance
in the first ~40% of each segment. It is **not** the `.19,1,.22,1` expo used by
sections 02 and 05; do not share a curve token between them.

`.pf-won-lin` overrides it to linear and is applied to exactly three things: the
shine sweep and the six `pf-swapA/B` spans — i.e. everything that is a pure
opacity crossfade or a constant-velocity traverse. Anything that accelerates
keeps the sharp curve.

Twelve elements carry `.pf-won`:

| Our class | `animation-name` | Element |
|---|---|---|
| `.won-slot` | `pb-won-slot` | Negotiating card 1's wrapper |
| `.won-card` | `pb-won-fly` | Negotiating card 1 |
| `.won-grab` | `pb-grab` | the grab badge on that card |
| `.won-land` | `pb-won-land` | Closed card 1's wrapper |
| `.won-shine` + `.won-lin` | `pb-won-shine` | the sweep over Closed card 1 |
| `.won-toast` | `pb-won-toast` | the toast |
| `.won-swap-a` + `.won-lin` ×3 | `pb-swap-a` | Negotiating count `2`, Negotiating value `$78.6k`, Closed count `6` |
| `.won-swap-b` + `.won-lin` ×3 | `pb-swap-b` | Negotiating count `1`, Negotiating value `$15.8k`, Closed count `7` |

Each swap pair is two spans sharing `grid-area:1/1` inside a
`display:inline-grid` parent (the value pair adds `justify-items:end`), so the
slot's width is the wider of the two at all times and neither the count nor the
`$78.6k`/`$15.8k` column shifts as they cross over. That is correct and
intentional — same construction as §05's unread pill.

### 5.2 Which declarations are effective — and which are dead

Line **141** opens `@media (min-width:1280px){` and **nothing closes it until
line 214**. So:

**Declared globally, effective at every width:**

| Rule | Line(s) |
|---|---|
| `@keyframes pf-won-fly` — the **down-left** vector | 133–140 |
| `.pf-board` / `.pf-board-closed` three-column base | 294–295 |
| `@media (min-width:1280px){.pf-board …}` four-column | 296 |
| `.pf-analytics-cards` rest + hover + its RM rule | 333–336 |

**Declared inside the accidental ≥1280px scope, so missing below 1280px:**

| Rule | Line(s) | Effect of the trap |
|---|---|---|
| `.pf-won`, `.pf-won-lin` | 185–186 (and dead 157–158) | the whole 14s driver is missing below 1280 |
| `pf-won-slot`, `pf-won-land`, `pf-won-shine`, `pf-grab`, `pf-won-toast`, `pf-swapA`, `pf-swapB` | 178–184 (and dead 150–156) | missing below 1280 |
| `@keyframes pf-won-fly` — the **right** vector | 170–177 (and dead 142–149) | at ≥1280 this later copy wins; below 1280 it does not exist and the global copy at 133–140 is what applies |
| the RM block `@media(prefers-reduced-motion:reduce){.pf-won{…}}` | 187 (and dead 159) | missing below 1280 |

**The duplicated block.** Lines 142–159 and 170–187 declare the same eight
keyframes and two rules twice, **character for character**. Later wins, so the
second copy is effective and the first is dead. Unlike §05's `pg-n3/n4/n5`,
nothing differs between the two copies here — de-duplicate to one and note it
(§10, D2).

**So `pf-won-fly` exists in three places and two shapes:**

| Copy | Lines | Scope | Effective? |
|---|---|---|---|
| A — down-left | 133–140 | global | **Yes, below 1280px** (overridden at ≥1280) |
| B — right | 142–149 | ≥1280, dead duplicate | No |
| B — right | 170–177 | ≥1280 | **Yes, at ≥1280px** |

**Variant A, verbatim — the effective rule at 1024–1279px:**

```css
@keyframes pf-won-fly{
 0%,28%{opacity:1;transform:translate(0,0) scale(1) rotate(0deg);box-shadow:0 0 0 0 rgba(21,48,31,0)}
 32%{opacity:1;transform:translate(-4%,-12px) scale(1.04) rotate(-2deg);box-shadow:0 22px 40px -18px rgba(21,48,31,.55)}
 44%{opacity:1;transform:translate(-120%,180px) scale(1.04) rotate(-2deg);box-shadow:0 22px 40px -18px rgba(21,48,31,.55)}
 49%{opacity:1;transform:translate(-205%,345px) scale(1) rotate(0deg);box-shadow:0 10px 22px -14px rgba(21,48,31,.4)}
 52%{opacity:0;transform:translate(-205%,345px) scale(1) rotate(0deg);box-shadow:0 0 0 0 rgba(21,48,31,0)}
 88%{opacity:0;transform:translate(-205%,345px) scale(1)}
 94%,100%{opacity:1;transform:translate(0,0) scale(1) rotate(0deg)}}
```

**Variant B, verbatim — the effective rule at ≥1280px:**

```css
@keyframes pf-won-fly{
 0%,28%{opacity:1;transform:translate(0,0) scale(1) rotate(0deg);box-shadow:0 0 0 0 rgba(21,48,31,0)}
 32%{opacity:1;transform:translate(2%,-12px) scale(1.04) rotate(-2deg);box-shadow:0 22px 40px -18px rgba(21,48,31,.55)}
 44%{opacity:1;transform:translate(62%,6px) scale(1.04) rotate(-2deg);box-shadow:0 22px 40px -18px rgba(21,48,31,.55)}
 49%{opacity:1;transform:translate(104%,30px) scale(1) rotate(0deg);box-shadow:0 10px 22px -14px rgba(21,48,31,.4)}
 52%{opacity:0;transform:translate(104%,30px) scale(1) rotate(0deg);box-shadow:0 0 0 0 rgba(21,48,31,0)}
 88%{opacity:0;transform:translate(104%,30px) scale(1)}
 94%,100%{opacity:1;transform:translate(0,0) scale(1) rotate(0deg)}}
```

**The two vectors are not an authoring accident — they track the board layout,
and this is the key insight of this section.** The `translate` X term is a
percentage of the *card's own width*, which is the lane width.

- **Below 1280px** the Closed lane is `grid-column:1/-1`, a full-width second
  row. The card starts in Negotiating, the third of three columns. `-205%` is
  a bit over two lane-widths to the **left**, i.e. back to column 1, and
  `+345px` is **down**, into the second row. It lands on the Closed lane.
- **At ≥1280px** the Closed lane is a 236px fourth column to the right.
  `+104%` is one lane-width to the **right** and `+30px` is a small drop past
  the lane header. It lands on the Closed lane.

Both are correct for their own layout. The travel *time* is identical
(28%→49%); only the vector differs.

**Implementation: one keyframe set, six custom properties.** Writing the
keyframes twice invites the two copies to drift, and the artboard has already
shown what that looks like. Declare the vector as variables on `.won-card` and
override them in the one media query, so the fly keyframes and the board columns
sit in the same block and cannot separate:

```css
@keyframes pb-won-fly {
  0%, 28%   { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg);
              box-shadow: 0 0 0 0 rgb(21 48 31 / 0) }
  32%       { opacity: 1;
              transform: translate(var(--fly-x1), var(--fly-y1)) scale(1.04) rotate(-2deg);
              box-shadow: 0 22px 40px -18px rgb(21 48 31 / 0.55) }
  44%       { opacity: 1;
              transform: translate(var(--fly-x2), var(--fly-y2)) scale(1.04) rotate(-2deg);
              box-shadow: 0 22px 40px -18px rgb(21 48 31 / 0.55) }
  49%       { opacity: 1;
              transform: translate(var(--fly-x3), var(--fly-y3)) scale(1) rotate(0deg);
              box-shadow: 0 10px 22px -14px rgb(21 48 31 / 0.4) }
  52%       { opacity: 0;
              transform: translate(var(--fly-x3), var(--fly-y3)) scale(1) rotate(0deg);
              box-shadow: 0 0 0 0 rgb(21 48 31 / 0) }
  88%       { opacity: 0;
              transform: translate(var(--fly-x3), var(--fly-y3)) scale(1) }
  94%, 100% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg) }
}

@layer components {
  .won-card {
    /* Below 1280 the Closed lane is a full-width second row, so the card
       travels down and back to the left. See docs/specs/10-chapter-3.md §5.2. */
    --fly-x1: -4%;    --fly-y1: -12px;
    --fly-x2: -120%;  --fly-y2: 180px;
    --fly-x3: -205%;  --fly-y3: 345px;
    animation-name: pb-won-fly;
  }
}

/* The board's own breakpoint. The four-column layout and the travel vector that
   matches it are declared together so they cannot drift apart. */
@media (width >= 1280px) {
  .board { grid-template-columns: repeat(3, minmax(0, 1fr)) 236px }
  .board-closed { grid-column: auto }
  .won-card {
    --fly-x1: 2%;     --fly-y1: -12px;
    --fly-x2: 62%;    --fly-y2: 6px;
    --fly-x3: 104%;   --fly-y3: 30px;
  }
}
```

Custom properties are read at element level and are static per breakpoint, so
they interpolate correctly inside the keyframes with no `@property`
registration. Verify it in the browser at 1279 and 1280 before sign-off
(RULINGS §03/04 ruling 11 — arithmetic is not evidence).

**The `pf-oneline` rule at 160/188 is not used by this chapter** and stays where
§05 ruled it. Do not touch it here.

### 5.3 The other seven keyframes, verbatim

All from the effective copy, lines 178–184:

```css
@keyframes pf-won-slot{0%,48%{max-height:150px}54%,88%{max-height:0}94%,100%{max-height:150px}}
@keyframes pf-won-land{0%,47%{max-height:0;opacity:0}49%{opacity:1}51%,84%{max-height:150px;opacity:1}90%,100%{max-height:0;opacity:0}}
@keyframes pf-won-shine{0%,52%{opacity:0;transform:translateX(-120%)}58%{opacity:1}66%,100%{opacity:0;transform:translateX(140%)}}
@keyframes pf-grab{0%,27%{opacity:0;transform:scale(.6)}31%,47%{opacity:1;transform:scale(1)}52%,100%{opacity:0;transform:scale(.9)}}
@keyframes pf-won-toast{0%,52%{opacity:0;transform:translateY(10px) scale(.97)}58%,78%{opacity:1;transform:translateY(0) scale(1)}86%,100%{opacity:0;transform:translateY(6px) scale(.99)}}
@keyframes pf-swapA{0%,40%{opacity:1}46%,88%{opacity:0}94%,100%{opacity:1}}
@keyframes pf-swapB{0%,40%{opacity:0}46%,88%{opacity:1}94%,100%{opacity:0}}
```

Note `pf-won-shine`'s `58%` stop declares **only `opacity`**. Transform therefore
interpolates straight through it, linearly (`.pf-won-lin`), from `-120%` at 52%
to `+140%` at 66%. That is deliberate: the band travels at constant speed while
its opacity ramps up and back down under it. Do not add a transform to the 58%
stop "for completeness" — it would put a velocity break in the middle of the
sweep.

### 5.4 The elements the keyframes drive

**The slot** — Negotiating card 1's wrapper:

```
class="pf-won" style="animation-name:pf-won-slot; overflow:visible"
```

`overflow:visible` is **load-bearing and must not be "fixed" to hidden**. It is
what lets the card leave its own lane during the flight. The slot collapses
*after* the card has gone (48%→54%), which is what makes the `Harcourt St
terrace` card below it slide up into the space.

**The grab badge** — a child of the flying card, `aria-hidden`:

```
class="pf-won" style="animation-name:pf-grab; position:absolute;
  right:-9px; bottom:-11px; z-index:2; display:grid; place-items:center;
  height:26px; width:26px; border-radius:9999px;
  background:var(--color-forest-900,#15301F);
  box-shadow:0 6px 14px -6px rgba(21,48,31,.7)"
```

Lucide `Grab`, `14×14`, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="#fff"`,
`stroke-width="2"`, round caps and joins. Path data, for verification against
`lucide-react`:

```
M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0
M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2
M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8
M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15
```

The badge sits outside the card's corner (`right:-9px; bottom:-11px`), which
only renders because the slot is `overflow:visible`.

**The landing wrapper** — Closed card 1's wrapper:

```
class="pf-won" style="animation-name:pf-won-land; overflow:hidden"
```

Here `overflow:hidden` is required: it is what lets the card grow out of zero
height without spilling.

**The shine** — a child of the landed card, `aria-hidden`, first in DOM order:

```
class="pf-won pf-won-lin" style="animation-name:pf-won-shine;
  position:absolute; inset:0;
  background:linear-gradient(100deg,transparent 20%,
    color-mix(in oklab,#fff 78%,transparent) 50%,transparent 80%);
  pointer-events:none"
```

The landed card is `position:relative; overflow:hidden`, and all three of its
content spans carry `position:relative` so they sit **above** the sweep. Keep
that ordering — without it the sweep washes over the text instead of under it.

**The toast** — a sibling of `.pf-board`, absolutely positioned in the board
container's padding box:

```
class="pf-won" style="animation-name:pf-won-toast; position:absolute;
  z-index:20; right:16px; bottom:16px; display:flex; align-items:center;
  gap:11px; max-width:320px; border-radius:8px; border:1px solid #DFD8C8;
  background:#fff; padding:11px 14px 11px 11px;
  box-shadow:0 18px 38px -18px rgba(21,48,31,.5)"
```

`#DFD8C8` is `--color-hairline`. A toast is an overlay, so a hairline plus a
shadow is exactly right per `brand.md`.

Icon tile — `aria-hidden`, `display:grid; place-items:center; flex:none;
height:30px; width:30px; border-radius:6px;
background:var(--color-lime-500,#C8E84A)`, containing Lucide `Check` at
`16×16`, `stroke="var(--color-forest-900,#15301F)"`, `stroke-width="2.6"`,
`d="M20 6 9 17l-5-5"`.

Message — `min-width:0; font-family:var(--font-sans); font-size:13px;
line-height:1.45; color:var(--color-charcoal-900,#1D2A20)`. Copy, verbatim:

> `Nice one. Tom accepted. That's 12 this month.`

`That's` is a straight apostrophe in the source; normalise to U+2019 per
§02 ruling 10. The `12` is contradicted by both the Closed count (`6` → `7`) and
the leaderboard (`9 + 7 + 5 + 4 = 25`) — §10, D9, flag, do not fix.

The flying card is `z-index:30` and the toast is `z-index:20`, so the card
passes over the toast, not under it. At ≥1280 their paths do not cross (the card
lands top-right, the toast sits bottom-right); below 1280 they can. Check it at
1024 (§11).

### 5.5 The full timeline

`1% = 140ms`.

| `t` (ms) | % | What happens |
|---|---|---|
| **0** | 0 | **Rest.** Card 1 in Negotiating, no shadow. Negotiating `2` / `$78.6k`, Closed `6`. Closed card 1 absent (`max-height:0`). No grab, no shine, no toast. |
| 3780 | 27 | The grab badge starts to appear from `scale(.6)`. |
| 3920 | 28 | **Lift begins.** |
| 4340 | 31 | Grab badge fully up at `scale(1)`. |
| 4480 | 32 | **Lifted.** `translate(±%, −12px) scale(1.04) rotate(−2deg)`, shadow at `0 22px 40px −18px rgba(21,48,31,.55)`. |
| 5600 | 40 | Count/value crossfade begins: A starts fading out, B starts fading in. |
| 6160 | 44 | **Mid-flight.** Still `scale(1.04) rotate(−2deg)`, same deep shadow. |
| 6440 | 46 | Crossfade complete: `1` / `$15.8k` / `7`. |
| 6580 | 47 | Landing wrapper starts opening; grab badge starts fading out. |
| 6720 | 48 | Origin slot starts collapsing from `150px`. |
| 6860 | 49 | **Arrival.** Card at the destination, back to `scale(1) rotate(0deg)`, shadow softened to `0 10px 22px −14px rgba(21,48,31,.4)`. Landed card at `opacity:1` but still growing. |
| 7140 | 51 | Landed card fully open at `max-height:150px`. |
| 7280 | 52 | **Handover.** Flying card `opacity:0`; grab badge gone; shine and toast both start. |
| 7560 | 54 | Origin slot fully collapsed; `Harcourt St terrace` has finished sliding up. |
| 8120 | 58 | Shine at `opacity:1` (roughly mid-card); toast fully up, `translateY(0) scale(1)`. |
| 9240 | 66 | Shine gone at `translateX(140%)`. |
| 10920 | 78 | Toast starts to leave. |
| 11760 | 84 | Landed card starts closing. |
| 12040 | 86 | Toast gone. |
| 12320 | 88 | **Reset begins.** Slot starts reopening; counts start crossfading back. |
| 12600 | 90 | Landed card at `max-height:0`. |
| 13160 | 94 | **Reset complete.** Everything back to the `t = 0` frame. |
| 13160–14000 | 94–100 | Hold. |

**In plain terms, so an engineer can tell when it is wrong:**

- **0 → 3.78s.** Nothing moves. 27% of every cycle is dead air; that is the
  breath before the beat.
- **3.78 → 4.48s.** A dark circular grab badge pops in at the card's
  bottom-right corner and the card lifts: 12px up, 4% scale, a 2° counter-
  clockwise tilt, and a deep 40px shadow arrives underneath it. It reads as a
  hand picking the card up.
- **4.48 → 6.86s.** The card flies to the Closed lane, holding the tilt and the
  shadow the whole way, then untilts and settles its shadow in the last 5% as it
  arrives. **Where it flies depends on the breakpoint** (§5.2): right at ≥1280,
  down-and-left at 1024–1279.
- **5.60 → 6.44s.** Mid-flight, the Negotiating count and total and the Closed
  count cross-fade to their new values. This happens **before** the card lands —
  deliberately, so the board has already reacted by the time the card arrives.
- **6.58 → 7.14s.** The Closed lane's new card grows out of zero height; the
  Negotiating slot collapses right behind it and `Harcourt St terrace` slides
  up.
- **7.28 → 9.24s.** The flying card cuts out at exactly the moment the shine
  starts, so the handover is invisible — you only ever see one card. A white
  diagonal band sweeps left to right across the landed card in 1.96s, fading up
  over the first third and down over the rest.
- **7.28 → 12.04s.** The toast rises 10px into the board's bottom-right corner,
  holds for 2.8s and drops out.
- **12.32 → 13.16s.** Everything reverses.

**It is wrong if:**

- the flying card travels right at 1024–1279px, or down-left at ≥1280px — that
  is the media-query fix having been applied to the wrong copy;
- the counts flip *after* the card lands rather than during the flight;
- the card is visibly clipped by its own lane as it leaves (the slot's
  `overflow:visible` has been changed);
- the shine washes over the card's text rather than under it (the content spans
  have lost `position:relative`);
- the shine's speed changes mid-sweep (a transform has been added at the 58%
  stop);
- two cards are on screen at once around `t = 7.2s` (the 52% opacity handover is
  off by a frame);
- the Negotiating lane's total column jumps width as `$78.6k` becomes `$15.8k`
  (the two spans are no longer sharing `grid-area:1/1`);
- the reset is a hard cut rather than a rewind — see D7 below; it is *supposed*
  to be a visible rewind, and that is the source's choice, not ours.

### 5.6 The reduced-motion resting state  **[Designer decision]**

The artboard's own block, verbatim, at lines 187 (and dead at 159):

```css
/* artboard — do NOT port this */
@media(prefers-reduced-motion:reduce){.pf-won{animation:none!important;opacity:1!important;transform:none!important;max-height:none!important}.pf-won[data-hide]{display:none!important}}
```

It is trapped inside the broken media query *and* it is wrong in the same way
§05's was. `.pf-won` sits on twelve elements of six different kinds, so
`opacity:1!important` forces **both halves of all three swap pairs visible
superimposed** (`2` over `1`, `$78.6k` over `$15.8k`, `6` over `7`), **the
landed Closed card visible** at the same time as the card still sitting in
Negotiating, **the shine band sitting at full opacity across the landed card**,
**the grab badge stuck on**, and **the toast permanently on screen**. That is
the frame the comparison harness screenshots.

`.pf-won[data-hide]` was the escape hatch for exactly this, and **`data-hide`
appears on no element in the artboard** — it is a dead selector (§10, D11).

**The resting state is the `t = 0` frame**, before the drag:

- It is what the **mobile artboard draws statically**: Negotiating `2` with the
  Ridgeway card still in it, Closed `6`, no toast. Pinning to `t = 0` makes the
  two breakpoints agree, which §05 §4.7 established is worth more than matching
  any particular live moment.
- It is the frame that holds longest in the live loop (0–28%, 3.92s) and the one
  the loop returns to.
- It is the only frame in which the board is internally consistent *and* nothing
  transient is on screen.

Ship:

```css
/* The resting state: the t = 0 frame, before the card is picked up. This is
   also the composition the mobile artboard draws, and what the
   visual-comparison harness screenshots against. */
@media (prefers-reduced-motion: reduce) {
  .won-slot,
  .won-card,
  .won-land,
  .won-shine,
  .won-grab,
  .won-toast,
  .won-swap-a,
  .won-swap-b {
    animation: none !important;
  }

  /* The card is home, at rest, with no flight shadow. */
  .won-card {
    opacity: 1 !important;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Its lane slot is open. */
  .won-slot {
    max-height: none !important;
  }

  /* The job has not been won yet, so the Closed card does not exist. display:none
     rather than max-height:0 - a zero-height box would still leave the lane's
     8px flex gap behind it. */
  .won-land {
    display: none !important;
  }

  /* Both are transients of the landing. */
  .won-shine,
  .won-toast {
    display: none !important;
  }

  /* No hand on the card. */
  .won-grab {
    opacity: 0 !important;
    transform: none !important;
  }

  /* One value per slot, not two. A = the before state. */
  .won-swap-a {
    opacity: 1 !important;
  }
  .won-swap-b {
    opacity: 0 !important;
  }

  /* The stat stack rests tucked, not lifted - the artboard pins it to its
     HOVER position, which is the one frame a resting state must not be. */
  .analytics-cards {
    transform: translateY(18px) scale(0.96) !important;
    transition: none !important;
  }
}
```

**`.analytics-cards` is a fix, not a port.** The artboard's global rule at line
335 reads `.pf-analytics-cards{transform:none;transition:none}` under reduced
motion — `transform:none` is the *hovered* state. A reduced-motion resting state
pinned to a hover frame is a defect under RULINGS' hard gate: the harness would
screenshot a composition no un-hovered user ever sees. Pin it to the rest
transform instead (§10, D10).

**Consequence for QA:** our reduced-motion frame deliberately differs from the
artboard's, so the structural diff for this chapter must be run with
`--motion none --freeze <t>` at matched `t` values on both sides, exactly as
§05 ruling 3 established.

### 5.7 The corrected rule set

`styles/motion/playbook.css`, in full apart from the `pb-won-fly` block quoted
in §5.2 and the reduced-motion block quoted in §5.6:

```css
/* ---------------------------------------------------------------------------
   Chapter 3's won-job flight.

   One 14s loop: a card is picked up out of Negotiating, flown to Closed, landed
   with a shine sweep and a toast, and the lane counts cross-fade mid-flight.

   The artboard declared all of it inside an @media (min-width:1280px) that was
   never closed, and declared it twice (docs/specs/10-chapter-3.md §5.2). Only
   one media query survives here, and it is a real one: at 1280px the board goes
   from three columns with a full-width Closed row to four columns, and the
   card's travel vector changes with it. The vector and the columns are declared
   together so they cannot drift apart.
--------------------------------------------------------------------------- */

@keyframes pb-won-slot  { 0%,48%   { max-height:150px } 54%,88% { max-height:0 } 94%,100% { max-height:150px } }
@keyframes pb-won-land  { 0%,47%   { max-height:0; opacity:0 } 49% { opacity:1 } 51%,84% { max-height:150px; opacity:1 } 90%,100% { max-height:0; opacity:0 } }
@keyframes pb-won-shine { 0%,52%   { opacity:0; transform:translateX(-120%) } 58% { opacity:1 } 66%,100% { opacity:0; transform:translateX(140%) } }
@keyframes pb-grab      { 0%,27%   { opacity:0; transform:scale(.6) } 31%,47% { opacity:1; transform:scale(1) } 52%,100% { opacity:0; transform:scale(.9) } }
@keyframes pb-won-toast { 0%,52%   { opacity:0; transform:translateY(10px) scale(.97) } 58%,78% { opacity:1; transform:translateY(0) scale(1) } 86%,100% { opacity:0; transform:translateY(6px) scale(.99) } }
@keyframes pb-swap-a    { 0%,40%   { opacity:1 } 46%,88% { opacity:0 } 94%,100% { opacity:1 } }
@keyframes pb-swap-b    { 0%,40%   { opacity:0 } 46%,88% { opacity:1 } 94%,100% { opacity:0 } }

/* ... @keyframes pb-won-fly, per §5.2 ... */

@layer components {
  /* The shared 14s driver. animation-name is set per element.
     cubic-bezier(.32,.72,0,1) is NOT the .19,1,.22,1 used by sections 02 and 05
     - it is a much sharper decelerating curve. Do not share a token. */
  .won-slot,
  .won-card,
  .won-land,
  .won-shine,
  .won-grab,
  .won-toast,
  .won-swap-a,
  .won-swap-b {
    animation-duration: 14s;
    animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }

  /* Pure crossfades and the constant-velocity sweep get a linear curve. */
  .won-lin { animation-timing-function: linear }

  .won-slot  { animation-name: pb-won-slot }
  .won-land  { animation-name: pb-won-land }
  .won-shine { animation-name: pb-won-shine }
  .won-grab  { animation-name: pb-grab }
  .won-toast { animation-name: pb-won-toast }
  .won-swap-a { animation-name: pb-swap-a }
  .won-swap-b { animation-name: pb-swap-b }

  /* ... .won-card + its below-1280 vector, per §5.2 ... */

  .analytics-cards {
    transform: translateY(18px) scale(0.96);
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .analytics-stage:hover .analytics-cards { transform: none }
}

/* ... @media (width >= 1280px), per §5.2 ... */
/* ... @media (prefers-reduced-motion: reduce), per §5.6 ... */
```

Dropped as dead: the entire first copy at lines 142–159, and the
`.pf-won[data-hide]` selector.

---

## 6. The team leaderboard band

Still inside the same `.canvas-botanical` card — not a section of its own.

**Divider:**

```
margin-top:32px; height:1px;
background:color-mix(in oklab,var(--pf-ink-900) 10%,transparent)
```

**Grid:**

```
margin-top:32px
grid: display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr);
      gap:40px; align-items:center; max-width:1024px; margin:0 auto
```

### 6.1 Left column

`display:flex; flex-direction:column; gap:6px`.

**Eyebrow** — `data-anim="up-blur" data-duration="0.5"`, identical type to §3.1
(`margin-bottom:4px; font-size:12px; font-weight:800; letter-spacing:.14em;
uppercase; color:var(--pf-lime-500)`). Copy, verbatim, **sentence case in the
source**:

> `One source of truth`

Apply `--color-eyebrow` (`#657919`), same as §3.1. Measured `#95B225` = 2.26:1.

**H3** — `class="pf-h3"`, `data-anim="up-blur" data-delay="0.05"
data-duration="0.5"`, `color:var(--pf-ink-900)` → `.display .display-3`:

> `Everyone knows where the jobs are at.`

**Body** — `data-anim="up-blur" data-delay="0.1" data-duration="0.5"`,
`margin-top:6px; max-width:56ch; font-size:16px; line-height:1.6;
color:var(--pf-ink-900)`:

> `The whole team sees the same board in real time, so the catch-up calls are
> reduced. You can see who is quoting what, who is closing it, and reward team
> members bringing in the work.`

(The mobile artboard rewrites this paragraph — §7.3. Preserve both.)

### 6.2 The leaderboard card

`data-anim="scale" data-delay="0.15" data-duration="0.5"`:

```
display:flex; flex-direction:column; overflow:hidden;
border-radius:12px; background:#fff
```

No shadow and no border — the white-on-`surface-300` value step is the
elevation, per `brand.md`. Correct as drawn.

**Header:**

```
display:flex; align-items:baseline; justify-content:space-between; gap:12px;
border-bottom:1px solid var(--color-border,#DFD8C8); padding:14px 20px
```

`<h4 style="margin:0; display:flex; align-items:center; gap:9px;
font-family:var(--font-serif); font-weight:600; font-size:19px;
color:var(--color-ink,#16321E)">` with Lucide `Trophy`, `18×18`,
`stroke="var(--color-forest-500,#4D8F6C)"`, `stroke-width="2"`, round caps and
joins, `flex:none`. Copy: `Jobs won this month`.

`justify-content:space-between` and `gap:12px` are inert (one child) — drop both
and reproduce the render (§02 ruling 3). `Trophy` is the one serif element in
this band, and it does not state a status — correct per `brand.md`.

Path data for `Trophy`, for verification against `lucide-react`:

```
M6 9H4.5a2.5 2.5 0 0 1 0-5H6
M18 9h1.5a2.5 2.5 0 0 0 0-5H18
M4 22h16
M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22
M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22
M18 2H6v7a6 6 0 0 0 12 0V2Z
```

**Rows** — a `<ul style="list-style:none; margin:0; padding:0">` of four
`<li>`s. Row 1: `display:flex; align-items:center; gap:13px; padding:12px 20px`.
Rows 2–4 add `border-top:1px solid var(--color-slate-100,#E5E8E5)`.

```
img:    flex:none; height:44px; width:44px; border-radius:6px;
        object-fit:cover
text:   display:flex; min-width:0; flex:1; flex-direction:column; gap:3px
name row: display:flex; min-width:0; align-items:baseline; gap:8px
  name: font-family:var(--font-sans); font-size:14.5px; font-weight:500;
        color:var(--color-charcoal-900,#1D2A20)
  job:  min-width:0; overflow:hidden; text-overflow:ellipsis;
        white-space:nowrap; font-family:var(--font-sans);
        font-size:12.5px; color:var(--color-slate-500,#6E7669)
bar row: display:flex; align-items:center; gap:8px
  track: display:block; flex:1; height:5px; width:100%;
         border-radius:9999px; background:var(--color-slate-100,#E5E8E5)
  fill:  display:block; height:100%; width:<pct>;
         border-radius:9999px; background:var(--color-forest-500,#4D8F6C)
  count: flex:none; font-family:var(--font-sans); font-size:11.5px;
         font-variant-numeric:tabular-nums;
         color:var(--color-slate-500,#6E7669); white-space:nowrap
total:   flex:none; width:56px; text-align:right;
         font-family:var(--font-serif); font-weight:600; font-size:14px;
         font-variant-numeric:tabular-nums; color:var(--color-ink,#16321E)
```

| # | Photo | Name | Job | Bar | Count | Total |
|---|---|---|---|---|---|---|
| 1 | `photo-1` | `Dave` | `Ferndale rear garden` | `100%` | `9 of 12 won` | `$182k` |
| 2 | `photo-2` | `Suz` | `Harcourt St terrace` | `74%` | `7 of 11 won` | `$134k` |
| 3 | `photo-3` | `Marco` | `Wattle Grove pool surround` | `52%` | `5 of 9 won` | `$94k` |
| 4 | `photo-4` | `Sam` | `Vaucluse courtyard` | `31%` | `4 of 10 won` | `$56k` |

Row 1's bar is `100%` where its own count says `9 of 12` (75%), and rows 2–4 are
74 / 52 / 31 against 64 / 56 / 40. The bar encodes rank-relative revenue, not
the win ratio beside it — see §10, D16. Ship as drawn; it is the client's data.

`Marco`'s job is `Wattle Grove pool surround` here and `Wattle Grove pool` on
mobile; the board's Sent lane has `Wattle Grove frontage`. Three different
strings (§10, D17).

**Footer:**

```
border-top:1px solid var(--color-border,#DFD8C8);
background:var(--color-well,#F6F4EC); padding:10px 20px;
font-family:var(--font-sans); font-size:12px;
color:var(--color-slate-500,#6E7669)
```

> `Updated as quotes are accepted. No one has to report in.`

Measured **4.28:1** on the well — a fail, and the same string fails on mobile
too. §9.

---

## 7. Mobile composition (<1024px)

A different composition, not a reflow: **two sections**, not one panel. No
tilted stat cards, no browser chrome, no counter strip, no toast, no shine, no
grab, no flight, and no count-ups. Lines 633–777.

`--m-*` are the mobile artboard's re-declaration of the same palette; map them
onto our tokens exactly as §05 §6.1 did (`--m-forest` → `forest-900`,
`--m-lime` → `lime-500`, `--m-ink` → `ink`, `--m-ink-700` → `slate-700`,
`--m-ink-500` → `slate-500`, `--m-ink-400` → `slate-400`, `--m-well` → `well`,
`--m-muted` → `card-muted`, `--m-border` → `hairline`, `--m-card` → `card`,
`--m-forest-500/700/800` → the matching forest steps, `--m-rust` → `rust`).

### 7.1 Section A — the board

```
section: margin:0 16px 30px; overflow:hidden; border-radius:12px

banner:  position:relative; padding:26px 18px 22px
  img:   position:absolute; inset:0; width:100%; height:100%;
         object-fit:cover           /* photo-1, no object-position */
  veil:  aria-hidden; position:absolute; inset:0;
         background:linear-gradient(to bottom,
           color-mix(in oklab,var(--m-forest) 86%,transparent),
           color-mix(in oklab,var(--m-forest) 58%,transparent))
  h2.m-h2: position:relative; margin:0; font-size:28px; color:#fff

body (.canvas-botanical):
         background:var(--m-muted); padding:22px 16px 24px
```

Note the mobile banner is a **flat two-stop veil with no mask and no blurred
echo**, where desktop uses `.banner-fade`'s four-stop gradient plus the mask
plus a mirrored, blurred second copy of the photograph behind the panel. Two
genuinely different treatments; build both as drawn.

`.m-h2` = Fraunces `"wght" 600, "SOFT" 60, "opsz" 32`, `letter-spacing:-.005em`,
`line-height:1.14` → our `.display .display-2 .display-2-mobile`, at 28px. Copy
is **identical to the desktop H1** — same string, different element, different
size:

> `Build a quoting & sales system that gets sharper every job.`

No `<br>`, so nothing to unpick here (unlike §05 §7).

**H3** — `.m-h3` (`"wght" 600, "SOFT" 60, "opsz" 24`, `line-height:1.2`, no
tracking), `margin:0; font-size:19px; color:var(--m-ink)`:

> `Know where every quote stands, and what to do next.`

Identical to desktop.

**Body** — `margin:8px 0 16px; font-size:14.5px; line-height:1.55;
color:var(--m-ink-700)`:

> `Every job in one place, whether you run it on your own or with a team.`

**Much shorter than desktop.** Mobile drops `No lost spreadsheets, no digging
through emails. Everything in one place: a birdseye view of your entire
business,` and rewrites the survivor. Preserve both, per the §02 rulings
12/13/14 precedent. Log.

### 7.2 The four status groups

Wrapper: `display:flex; flex-direction:column; gap:8px`.

Group shell, all four:

```
display:flex; flex-direction:column; gap:7px; border-radius:10px;
background:<tone>; padding:10px; box-shadow:0 0 0 1px var(--m-border)
```

Group header:

```
display:flex; align-items:baseline; gap:7px; padding:0 2px 2px
  dot:   aria-hidden; align-self:center; height:8px; width:8px;
         border-radius:9999px; background:<dot>
  name:  font-size:11px; font-weight:700; letter-spacing:.1em;
         text-transform:uppercase; color:var(--m-ink)
  count: font-size:11.5px; color:var(--m-ink-400)
  value: margin-left:auto; font-size:12.5px; font-weight:600;
         color:var(--m-ink-700)
```

| Group | Background | Dot | Name | Count | Value |
|---|---|---|---|---|---|
| 1 | `#F6F4EC` (`--m-well`) | `#A2A899` | **`Drafts`** | `3` | `$74.2k` |
| 2 | `#EFEDE0` | `var(--m-forest-500)` | `Sent` | `2` | `$82.1k` |
| 3 | `#E6E0CC` (`--m-muted`) | `var(--m-lime)` | `Negotiating` | `2` | `$78.6k` |
| 4 | `color-mix(in oklab,var(--m-forest) 10%,#E6E0CC)` → **`#CFCDB9`** | `var(--m-forest)` | `Closed` | `6` | `$412k` |

Differences from desktop, all as drawn:

- lane **`Drafts`** plural, desktop **`Draft`** singular (§10, D18);
- four **different** background tones from desktop's four;
- the **Closed** group has a value total (`$412k`) where desktop's has none, and
  a **forest** dot where desktop's is slate-300;
- the four groups carry a `1px` hairline where desktop's lanes have none;
- the **Drafts** group carries three drafts and `$74.2k` where desktop carries
  two and `$29.7k`, and shows only one of them.

Group body cards, all five:

```
display:flex; align-items:center; gap:10px; border-radius:8px;
background:#fff; padding:9px 10px
  img:   flex:none; height:34px; width:34px; border-radius:6px;
         object-fit:cover
  text:  display:flex; min-width:0; flex:1; flex-direction:column; gap:1px
  name:  font-size:13px; font-weight:600; color:var(--m-ink);
         nowrap/ellipsis
  meta:  font-size:11.5px; color:<varies>; nowrap/ellipsis
  amount: class="m-h3"; flex:none; font-size:13px; color:var(--m-ink)
```

A single-row card with the amount on the right, against desktop's three-row
card with a divider and a `View quote →`. There is **no `View quote →` and no
Lucide `User` icon anywhere in the mobile board.** The amount is set in
**Fraunces** (`.m-h3`) where desktop sets it in the product sans.

| Group | Photo | Name | Meta | Meta colour | Amount |
|---|---|---|---|---|---|
| Drafts | `photo-1` | `Ferndale rear garden` | `Ferndale · Priya Raman` | `--m-ink-500` | `$28.4k` |
| Sent | `photo-2` | `14 Beach Rd, Coogee` | `Opened 4 times · after 8pm` | `--m-forest-700` | `$62.8k` |
| Sent | `photo-4` | `Wattle Grove frontage` | `Never opened · 9 days` | **`--m-rust`** | `$19.3k` |
| Negotiating | `photo-2` | `112 Ridgeway Ave, Bronte` | `Asked about the paving` | `--m-forest-700` | `$62.8k` |
| Closed | `photo-3` | `Mosman retaining + steps` | `Won · deposit in` | `--m-forest-700` | `$21.4k` |

Only **one** mobile line is rust (`Never opened · 9 days`), where desktop has
two. The other Sent card's status is **forest-700** on mobile and **rust** on
desktop — the same quote, warned on one breakpoint and not the other
(§10, D19).

Every meta line uses ` · ` (U+00B7 with spaces) where desktop uses a comma or a
full stop. `QUOTE.address` gains `, Coogee` (`QUOTE.suburb`) and
`112 Ridgeway Ave` gains `, Bronte`. Amounts are `$62.8k` where desktop writes
`$62,800`. Reference `content/home.ts` for the shared parts and keep the
per-breakpoint suffixes in `content/playbook.ts`.

### 7.3 Section B — the leaderboard

A separate `<section style="padding:0 16px 34px">` with its own white card:

```
overflow:hidden; border-radius:12px; background:var(--m-card);
padding:22px 16px 20px
```

**Eyebrow** — `class="m-eyebrow"` (`font-family:var(--m-sans); font-size:11px;
font-weight:700; letter-spacing:.14em; uppercase`), `color:#7E9A2B`:

> `ONE SOURCE OF TRUTH - TEAM TOOLS`

`#7E9A2B` is the mobile eyebrow RULINGS corrected — apply
**`--color-eyebrow-mobile` (`#607521`)**. Measured: `#7E9A2B` on white is
**3.21:1**; `#607521` is **5.17:1** (§9).

The copy differs from desktop (`One source of truth`) by a trailing
` - TEAM TOOLS`, and the separator is a **hyphen-minus**, not a dash. Flag both;
do not fix. `brand.md` bans em dashes, so an en dash is the available
correction, but that is a copy call (§10, D14).

**H2** — `class="m-h2"`, `margin:10px 0 8px; font-size:24px;
color:var(--m-ink)`:

> `Everyone knows where the jobs are at.`

Identical to desktop. Note mobile uses `<h2>` where desktop uses `<h3>` for the
same string — fix the levels, keep the sizes (§03/04 ruling 8).

**Body** — `margin:0 0 16px; font-size:14.5px; line-height:1.55;
color:var(--m-ink-700)`:

> `Everyone sees the same board, so the catch-up calls stop. See who is quoting,
> who is closing, and reward the people bringing in the work.`

**Rewritten from desktop**, not truncated: `the catch-up calls stop` against
`the catch-up calls are reduced`, `the people` against `team members`, and the
whole `The whole team sees the same board in real time` clause replaced.
Preserve both. Log — this one is a change of *claim*, not just of length, and
the client may not have intended two versions.

**Leaderboard card:**

```
overflow:hidden; border-radius:12px; background:#fff;
box-shadow:0 0 0 1px var(--m-border),
           0 6px 14px -6px rgba(21,48,31,.14),
           0 18px 30px -18px rgba(21,48,31,.18)
```

A hairline plus two warm shadow layers, where the desktop card has **neither**.
Same asymmetry as §03/04 ruling 13 — reproduce as drawn, log. It is none of the
four `.shadow-border-*` recipes; ship it as a local class alongside
`.shadow-card-mobile` in `styles/base.css`, scoped `@media (width < 1024px)`.

Header: `border-bottom:1px solid var(--m-border); padding:12px 14px`; `<h4
class="m-h3" style="margin:0; display:flex; align-items:center; gap:8px;
font-size:16px; color:var(--m-ink)">` + Lucide `Trophy` `17×17`,
`stroke="var(--m-forest-500)"`, `aria-hidden`, `flex:none`. Copy identical:
`Jobs won this month`.

Rows: `display:flex; align-items:center; gap:11px; padding:11px 14px`; rows 2–4
add `border-top:1px solid #E5E8E5` (a raw hex on mobile where desktop uses
`var(--color-slate-100,#E5E8E5)` — same value, map both to `--color-slate-100`).

```
img:    44px → 40px
name:   14.5px/500 → 14px/600
job:    12.5px → 12px
track:  no width:100%
count:  11.5px → 11px, and no font-variant-numeric
total:  56px → 48px wide, 14px → 13.5px, class="m-h3"
```

**All four rows carry the same names, bars, counts and totals as desktop**
except `Marco`'s job, which is `Wattle Grove pool` (desktop:
`Wattle Grove pool surround`).

Footer: `border-top:1px solid var(--m-border); background:var(--m-well);
padding:10px 14px; font-size:12px; color:var(--m-ink-500)`. Copy identical:
`Updated as quotes are accepted. No one has to report in.` Same 4.28:1 fail as
desktop.

### 7.4 What mobile does not have

| Desktop | Mobile |
|---|---|
| three tilted stat cards + hover lift | none |
| browser chrome + eight-cell counter strip | none |
| seven animated count-ups | none |
| 14s won-job flight, shine, toast, grab | none |
| lane counts/values that swap | static, one value each |
| four lanes side by side (or 3+1) | four groups stacked |
| nine board cards, three-row shell | five cards, one-row shell |
| `View quote →` ×5, `See all closed →` | none |
| Lucide `User` on every card | none |
| Closed lane blurb paragraph | none |
| one panel holding both bands | two separate sections |

**No element in the mobile section carries `pf-won`, `pf-swap`, `data-count`,
`pf-analytics-*` or any other animated hook.** Mobile is a single still frame of
the same story — which is why §5.6 pins the desktop resting state to `t = 0`:
that is the frame mobile draws.

---

## 8. The 320→1023px fluid behaviour  **[Designer decision]**

The mobile artboard is a fixed 430px column with zero media queries. Everything
not listed holds its artboard px value at every width.

**Outer gutter.** `16px` from 320px, stepping to `32px` at ≥640px. Both mobile
sections draw 16px, the neighbouring bands draw 16px, and RULINGS §03/04 ruling
16 settled that as "reproduce as drawn". The step to 32px at 640px is the house
convention for the half of the range the artboard says nothing about, matching
§05 §7 exactly. Use **`sm-only:`**, not `sm:` — both sections also carry a
`desk:` value for `padding-inline`, and `sm:` would win at 1440px (the page-wide
convention in RULINGS).

**Content cap.** `width:100%; max-width:560px; margin-inline:auto` on both
sections' contents. Same 560px cap as every other section. Above ~600px the
14.5px paragraphs would otherwise run 90+ characters, which the artboard never
proposes.

**Section A banner padding.** `26px 18px 22px`, stepping the horizontal to
`24px` at ≥560px, for the same reason §05 §7 stepped its panel padding: below
560px the panel is narrower than the cap and 18px is exactly what is drawn; at
and above it, 18px leaves a 28px headline sitting tight against a now-wide
photograph edge. Vertical padding never changes.

**Section A body padding.** `22px 16px 24px`, horizontal stepping to `24px` at
≥560px, same reasoning.

**H2 (section A).** `font-size: clamp(22px, 6.51vw, 28px)`. `6.51vw` is exactly
28.0px at 430px (the artboard value); it holds at 28px above 430px and clamps to
22px at 320px. The Fraunces axes, `line-height:1.14` and `letter-spacing:-.005em`
are unchanged at every width below 1024.

**H2 (section B).** `font-size: clamp(20px, 5.58vw, 24px)`. Same construction;
`5.58vw` is 24.0px at 430px.

**Add `text-wrap: balance` to both H2s.** Neither carries a `<br>`, so this is
not the §05 §7 fix — it is insurance. `Build a quoting & sales system that gets
sharper every job.` is 56 characters and at 320px it sets to four lines with
`every job.` alone on the last. `balance` removes the orphan and is identical at
430px. Rendering fidelity, not a copy edit; the text nodes are unchanged.

**Every other type size stays fixed** at its artboard px (19 / 14.5 / 13.5 / 13
/ 12.5 / 12 / 11.5 / 11). They are already at the floor of comfortable; scaling
them down at 320px trades a solvable width problem for an unsolvable legibility
one, and the 560px cap handles the top of the range.

**The board card row does not break at 320px — verified.** The widest card is
`112 Ridgeway Ave, Bronte` / `$62.8k`. At 320px the card's content box is 224px
(320 − 32 gutter − 32 body padding − 20 card padding − 12 group padding), of
which the 34px photo and two 10px gaps take 54px and the amount takes ~39px,
leaving **131px** for the name column. `112 Ridgeway Ave, Bronte` at 13px/600
measures ~148px, so it **ellipses**. That is the mechanism the artboard already
built (`min-width:0` + `nowrap` + `text-overflow:ellipsis` on every name and
meta), it is what happens at 430px to `Opened 4 times · after 8pm` too, and it
is the correct behaviour — do not swap it for wrapping. **No change needed, but
QA must confirm the ellipsis rather than an overflow.**

**The leaderboard row's fixed 48px total column does not scale.** At 320px the
name column is 320 − 32 − 32 − 28 − 40 − 22 − 48 = 118px and every job name
ellipses. Same mechanism, same call.

**Group tones, radii (10px group, 8px card, 6px photo), the 1px hairlines, the
7px/8px/10px/11px gaps and the 5px bar height do not scale.** They are the
board's grain; scaling them makes it read as a different density.

**At exactly 1024px the desktop composition takes over whole.** There is no
intermediate composition, no width at which a counter strip appears without its
browser chrome, no width at which the tilted cards appear on a stacked board,
and no width below 1024px at which anything animates or counts.

**The one thing that is *not* a clean swap at 1024px:** the desktop board's
Closed lane is a full-width second row from 1024 to 1279 and a fourth column
from 1280. That is a real, drawn breakpoint inside the desktop composition, and
it is the only layout change in this chapter between 1024 and 1440. Freeze and
screenshot it at 1279 and 1280 (§11).

---

## 9. Accessibility

### 9.1 The animated numbers  **[Designer decision]**

A count-up rewrites `textContent` on every animation frame. `Pipeline` counts
`$0K → $312K` over 900ms, which at 60fps is **54 distinct strings**, and
`moneyKwhole` rounds to whole thousands so almost every one of them is
different. Screen readers vary in how they handle that: NVDA and JAWS generally
ignore a text mutation in a region with no live semantics, but VoiceOver's
virtual cursor can land mid-count and re-announce, and any third-party tool that
polls the accessibility tree will see a value that is wrong 53 times out of 54.

**Recommendation, in three parts:**

1. **Never put `aria-live` on a count-up.** The artboard does not, and nothing
   should add it. This is the single most common mistake with this pattern and
   it turns a cosmetic flourish into 54 announcements.

2. **The whole analytics stage is one `role="img"` with an `aria-label`**
   (§9.2). That takes the seven counting spans out of the accessibility tree
   entirely, which is the real fix — the numbers are never announced, at any
   point in the count or after it.

3. **Belt and braces, for the case where a future count-up is *not* inside an
   `img` subtree:** render the value as two nodes — a visible
   `aria-hidden="true"` span that the hook mutates, and a visually-hidden
   sibling carrying the **final** formatted value as static text, written once
   at render. The accessible name is then correct and constant from first paint,
   the visible number animates, and nothing announces twice. Build
   `<CountUp>` that way from the start so the correct pattern is the default,
   even though `role="img"` already covers every call site in this chapter.

Under `prefers-reduced-motion: reduce` the hook writes the final value
synchronously (§3.4), so there is exactly one text mutation, before paint. That
is also the resting state the harness measures.

### 9.2 How much of this reaches a screen reader  **[Designer decision]**

**Recommendation: the analytics stage — the three tilted cards, the browser
card, the counter strip, the kanban board and the toast — is one `role="img"`
with an `aria-label`. Everything outside it stays in the tree untouched. The
team leaderboard stays fully readable.**

This is the same line RULINGS has already drawn twice, and drawing it the same
way here is the point:

- **§02 (hero float stack):** `aria-hidden`, because it was decorative
  repetition.
- **§05 (before/after phones):** `role="img"` + a written label, because the
  content was not pure repetition but was 120 words of fiction on a 16s loop.
- **Here:** the same case as §05, and more strongly. The board is ~200 words of
  invented job names, client names, amounts and status lines; a sighted reader
  takes it in as *texture* — "four columns, one card is moving, the totals
  change" — in about a second. Serialised it is a minute of recital. And, as in
  §05, **the DOM is changing on a loop**: a virtual cursor can land on the
  landed Closed card while it is at `max-height:0; opacity:0`, or on the
  `$15.8k` span while it is at `opacity:0`, and read it as though it were on
  screen. Both halves of all three swap pairs are always in the DOM.

`aria-hidden="true"` on the whole stage would be the §02 call, but it is wrong
here for the same reason it was wrong in §05: the board *is* the argument. "Your
quotes, in four columns, and one of them just moved to Closed" is information,
and silence would lose it.

**Where the boundary goes.** `role="img"` on the `.pf-analytics-stage` div —
that captures the tilted cards, the browser card and the board in one node.
The toast is a sibling of `.pf-board` inside the board container, so it is
inside the boundary too. Everything above it — eyebrow, H3, paragraph — and
everything below the divider stays as authored.

Ship this label:

> `A sales pipeline board with four columns. Draft holds two quotes worth
> $29.7k; Sent holds two worth $82.1k, one of them opened four times with no
> reply in six days; Negotiating holds two worth $78.6k; and Closed holds six
> won jobs. A card for 112 Ridgeway Ave, $62,800, is being dragged from
> Negotiating into Closed, and a message reads: Nice one. Tom accepted.`

It describes the `t = 0` state plus the one event, which is what the section
argues. Do not try to describe the counter strip's figures in it — they
contradict the tilted cards (§10, D9) and repeating a contradiction aloud is
worse than omitting both.

**The team leaderboard stays fully readable**, and the `<ul>` stays a `<ul>`:

- four rows, four names, four real numbers, no fiction and no contradiction;
- nothing in it animates, so nothing can be read at the wrong moment;
- `Jobs won this month` is a heading and the rows are its list — that is exactly
  what a screen-reader user wants from "everyone knows where the jobs are at";
- the progress bars are a second encoding of `9 of 12 won`, which is already
  text beside them, so mark the track `aria-hidden="true"` and leave the text.

That gives the consistent rule for the whole page: **animated product-UI
depictions collapse to one `role="img"`; static ones stay readable.**

**Mechanics:**

- `role="img"` + `aria-label` on the stage div, desktop only. The mobile board
  is static, so it is the *other* half of the rule: it stays readable, as four
  groups with headings. Give each mobile group's name an `<h3>` (currently a
  bare `<span>`) so the four groups are navigable.
- Every `aria-hidden=""` in the chapter becomes `aria-hidden="true"` — **19 of
  them** on desktop (three chrome dots as one span, four lane dots, nine card
  `User` icons, the grab badge, the toast icon tile, the landed card's shine
  span and lime dot, the settled card's forest dot) and **five** on mobile (the
  four group dots and the `Trophy`). The empty string is not a valid value;
  RULINGS §03/04 ruling 7 already fixed the identical mistake.
- `View quote →` ×5 and `See all closed →` are **not** interactive (§4.3).
  Nothing inside the stage is focusable, so the chapter adds **zero** tab stops
  and needs no focus styles.
- Store both eyebrows sentence case and uppercase in CSS (§3.1).
- Exactly one heading per band. Fix the level skips: desktop runs
  `h1 → h3 → h3 → h3 → h4`, mobile runs `h2 → h3 → h2 → h4`. Keep every type
  size; that is what `.display-*` is for (§03/04 ruling 8).
- The stage's hover lift needs no keyboard equivalent (§2.2).

### 9.3 Reduced motion and WCAG 2.2.2

The resting state is specified in full in §5.6 and pinned at `t = 0`. That is a
hard gate per RULINGS: an infinite loop without one fails QA outright, and the
harness's structural diff is only deterministic because both sides settle to
that frame.

**WCAG 2.2.2 (Pause, Stop, Hide) residual gap.** The flight loops continuously
well beyond 5 seconds with no pause control. Same class of issue as the marquee
and the before/after phones, and the same ruling applies (§03/04 ruling 5,
§05 §8.2): reduced motion stops it outright; **do not invent a visible pause
button the artboard does not draw**; log the residual honestly — a user who has
not set the OS preference has no mechanism. The content is `role="img"` and
conveys nothing a reader needs, which softens the impact but does not discharge
the criterion.

The count-ups are **not** a 2.2.2 issue: they run once, for 900ms, and stop.

**WCAG 2.3.1 (flashes)** passes with room to spare. The fastest transition in
the chapter is the shine sweep, 1.96s end to end. Nothing changes state more
than about once per second.

**WCAG 2.3.3 (Animation from Interactions)** — the hover lift is a 450ms
transform triggered by pointer motion. `prefers-reduced-motion` kills it in
§5.6, which is what the criterion asks for.

### 9.4 Contrast — measured, not estimated

Measured on the rendered artboards in Chromium at 1440 / 1200 / 430px, with
every glyph in the chapter set to `transparent`, the section screenshotted, and
the **modal composited pixel** of each text element's own box taken as its true
background. Foregrounds were resolved by painting each declared colour as a
swatch over that sampled background and reading the composited pixel back, so
the `oklch()` and `color-mix()` values are the browser's own results, not
conversions. Script: `scratchpad/ch3-contrast.mjs`.

**Desktop failures (7 distinct colour-on-surface pairs, 23 instances):**

| Element | Colour | On | Ratio | Needs | |
|---|---|---|---|---|---|
| **Both eyebrows, 12px/800** | `#95B225` (`--pf-lime-500`) | `#F8F7F2` | **2.26** | 4.5 | **fail** |
| **Counter strip labels ×8, 10px** | `#99978F` (`--pf-ink-500`) | `#FFFFFF` | **2.93** | 4.5 | **fail** |
| **`Overdue` value `$0`, 14px/700** | `#4D8F6C` (`--pf-green-600`) | `#FFFFFF` | **3.85** | 4.5 | **fail** |
| **Lane count, Draft, 12px** | `#8A9082` (`slate-400`) | `#EFECDF` | **2.77** | 4.5 | **fail** |
| **Lane count, Sent, 12px** | `#8A9082` | `#E6E0CC` | **2.49** | 4.5 | **fail** |
| **Lane counts, Negotiating ×2, 12px** | `#8A9082` | `#DDD9C0` | **2.31** | 4.5 | **fail** |
| **Lane counts, Closed ×2, 12px** | `#8A9082` | `#D2D5C0` | **2.19** | 4.5 | **fail** |
| **Closed blurb, 12px** | `#8A9082` | `#D2D5C0` | **2.19** | 4.5 | **fail** |
| **`Ana Silva · $21,400`, 12px** | `#8A9082` | `#F6F4EC` | **2.98** | 4.5 | **fail** |
| **`Tom Ridgeway · $62,800`, 12px** | `#6E7669` (`slate-500`) | `#F6F4EC` | **4.28** | 4.5 | **fail (0.22)** |
| **Settled card `Won`, 11.5px/600** | `#6E7669` | `#F6F4EC` | **4.28** | 4.5 | **fail (0.22)** |
| **Leaderboard footer, 12px** | `#6E7669` | `#F6F4EC` | **4.28** | 4.5 | **fail (0.22)** |

**Desktop passes worth recording, so QA does not "fix" them:**

| Element | Colour | On | Ratio |
|---|---|---|---|
| H3s, 28px | `#1D1D1C` | `#F8F7F2` | 15.73 |
| Header body, 18px | `#1D1D1C` | `#F8F7F2` | 15.73 |
| Tilted-card labels, 10.5px/700 | `#6E7669` | `#FFFFFF` | **4.71** |
| Tilted-card figures, 26px/600 | `#16321E` | `#FFFFFF` | 13.92 |
| `▲ this month`, 11px/700 | `#1F4934` | `#ECF6BD` | 8.97 |
| Counter strip values, 14px/700 | `#1D1D1C` | `#FFFFFF` | 16.87 |
| `All` chip, 11px/600 | `#43423E` | `#F5F2EB` | 9.00 |
| Toast message, 13px | `#1D2A20` | `#F3F0E6` | 13.12 |
| **Rust status lines ×2, 12px** | `#96602B` | `#FFFFFF` | **5.24** |
| Lane names, 11.5px/600 | `#16321E` | four lane tones | 9.29–11.75 |
| Lane values, 14px/500 | `#35402F` | three lane tones | 7.66–9.21 |
| Card names, 14px/500 | `#1D2A20` | `#FFFFFF` | 14.95 |
| Client names, 12px | `#6E7669` | `#FFFFFF` | **4.71** |
| Status lines, 12px | `#35402F` | `#FFFFFF` | 10.90 |
| `View quote →`, 13.5px/600 | `#2C5539` | `#FFFFFF` | 8.52 |
| `See all closed →`, 13.5px/600 | `#2C5539` | `#D2D5C0` | 5.69 |
| Landed card `Won`, 11.5px/600 | `#1F4934` | `#F6F4EC` | 9.25 |
| Leaderboard job + count, 11.5–12.5px | `#6E7669` | `#FFFFFF` | **4.71** |
| Leaderboard totals, 14px/600 | `#16321E` | `#FFFFFF` | 13.92 |
| Non-text: bar fill vs track | `#4D8F6C` | `#E5E8E5` | **3.11** (needs 3.0) |

**Mobile failures:**

| Element | Colour | On | Ratio | Needs | |
|---|---|---|---|---|---|
| **Eyebrow, 11px/700** | `#7E9A2B` | `#FFFFFF` | **3.21** | 4.5 | **fail** |
| **Group count, Drafts, 11.5px** | `#8A9082` | `#F6F4EC` | **2.98** | 4.5 | **fail** |
| **Group count, Sent, 11.5px** | `#8A9082` | `#EFEDE0` | **2.79** | 4.5 | **fail** |
| **Group count, Negotiating, 11.5px** | `#8A9082` | `#E6E0CC` | **2.49** | 4.5 | **fail** |
| **Group count, Closed, 11.5px** | `#8A9082` | `#CFCDB9` | **2.05** | 4.5 | **fail** |
| **Leaderboard footer, 12px** | `#6E7669` | `#F6F4EC` | **4.28** | 4.5 | **fail (0.22)** |

Mobile passes: H2 on the veiled photograph **4.88 worst-case at 430px, 5.08 at
320px** (measured pixel by pixel across the whole headline box, not sampled) —
passes 3.0 comfortably and even clears 4.5. Group names 8.67–12.64. Card names
13.92. `Opened 4 times · after 8pm` and the other forest metas 8.52.
`Never opened · 9 days` 5.24. Amounts 13.92. Leaderboard identical to desktop.

**Recommended corrections.** Two of the seven are already settled client
decisions; the rest reduce to **one existing token**.

1. **Both desktop eyebrows → `--color-eyebrow` (`#657919`).** Settled. Measured
   here at **4.55:1** on `#F8F7F2`.
2. **Mobile eyebrow → `--color-eyebrow-mobile` (`#607521`).** Settled. Measured
   here at **5.17:1** on white.
3. **Every `slate-400` and `slate-500` failure → `--color-slate-600`
   (`#4A5245`), a token that already exists.** It clears AA on every surface in
   the chapter with room to spare:

   | On | `#4A5245` |
   |---|---|
   | `#EFECDF` Draft | 6.87 |
   | `#E6E0CC` Sent | 6.16 |
   | `#DDD9C0` Negotiating | 5.71 |
   | `#D2D5C0` Closed | **5.43** |
   | `#CFCDB9` mobile Closed | **5.06** |
   | `#F6F4EC` well | 7.38 |
   | `#FFFFFF` | 7.99 |

   This is a better answer than the seven separate minimum-darkenings the
   client's "smallest change that clears" preference would otherwise produce
   (`#686C62`, `#61655C`, `#5C6057`, `#595C53`, `#6D7166`, `#6B7266`,
   `#555850`). One token, already in the system, already used elsewhere, and
   the lane counts are secondary metadata where a slightly heavier grey is not
   a visible regression. **Recommend this; note the per-surface minimums above
   so the client can choose the literal minimum if they prefer.**

4. **Counter strip labels, 2.93:1.** `--pf-ink-500` is the marketing layer's own
   ramp and is used elsewhere; do not edit it. Minimum darkening on white is
   **`#787670` → 4.54:1**. This is nine instances in one strip, all inside the
   `role="img"` subtree, so it is the weakest of the failures — but the text is
   set as live text at 10px and is fully legible, so I would not lean on WCAG
   1.4.3's incidental exemption. New token `--color-strip-label: #787670`.
5. **`Overdue` value, 3.85:1.** `#4D8F6C` at 14px/700. Minimum darkening is
   **`#468262` → 4.54:1**. But the cleaner answer is **`--color-forest-700`
   (`#2C5539`) → 8.52:1**, which is the tone every other "good news" label in
   the chapter already uses (`View quote →`, `See all closed →`, the settled
   card's dot, mobile's positive metas). Recommend forest-700; it is a token, it
   is consistent, and `$0 overdue` is exactly the kind of completed state
   `brand.md` says goes in forest.

**Escalate all five to the client with these numbers**, exactly as RULINGS
handled the eyebrows and §05's three failures. Items 1 and 2 need no decision —
the tokens exist and the call is already made.

### 9.5 The chapter-shell H1, measured — escalate to the shell owner

Not this chapter's to fix, but this chapter's H1 fails, so the measurement
belongs here.

`--pf-ink-100` (`#F2F1EC`) at 76px over the banner photograph plus
`.banner-fade`'s veil. Measured **pixel by pixel across the whole headline box**,
worst case:

| Chapter | Photo | Worst @1440 | Worst @1200 | Needs |
|---|---|---|---|---|
| 1 — `Meet Bramble.` | `photo-2` | **2.48** | — | 3.0 |
| 2 — `Win more jobs…` | `photo-3` | **2.53** | — | 3.0 |
| **3 — `Build a quoting…`** | `photo-1` | **2.73** | **2.87** | 3.0 |

All three fail, and the worst pixels are in the **middle** of the band, not at
the top — so deepening only the veil's first stop barely moves them. Measured
sweep of `.banner-fade::after`'s first two stops (third and fourth unchanged):

| top / 45% stop | Ch1 | Ch2 | Ch3 |
|---|---|---|---|
| `82%` / `62%` (as drawn) | 2.48 | 2.53 | 2.73 |
| `86%` / `74%` | 2.75 | 2.97 | **3.07** |
| `88%` / `78%` | 2.87 | **3.11** | 3.17 |
| `90%` / `82%` | 2.98 | 3.23 | 3.30 |
| **`92%` / `86%`** | **3.07** | **3.36** | **3.44** |

**Chapter 3 alone clears at `86% / 74%`. The smallest change that clears all
three is `92% / 86%`.** Hand both numbers to whoever owns `<ChapterShell>`; it
is one edit to `.banner-fade::after` in `styles/base.css` and it must be made
once for three chapters. Log with the measurements.

---

## 10. Defects in the source — flagged, not fixed

Except D1 (existing RULINGS precedent), D2/D10/D20 (hard gates and ruled fixes),
D6 and D21 (our own code, not the artboard's).

| # | Finding | Recommendation |
|---|---|---|
| D1 | Chapter 3 opens with `<h1>`, as do chapters 1 and 2 and the hero — four `<h1>`s on the page. Level skips within the chapter: desktop `h1 → h3 → h3 → h3 → h4`, mobile `h2 → h3 → h2 → h4` | **Fix the semantics, keep the visuals.** §03/04 ruling 8. One decision for three chapters; make it in the shell. |
| D2 | `@media (min-width:1280px)` opens at line 141 and closes at 214, trapping the entire `.pf-won` driver, all seven support keyframes, the ≥1280 `pf-won-fly` variant and the reduced-motion block. Below 1280px **nothing in the flight system animates** | **Fix.** §5.2. Same class as §05 D1, and ruled the same way. |
| D3 | Eight keyframes and two rules declared **twice**, at 142–159 and 170–187, character for character. Later wins | **Fix.** De-duplicate to the effective copy. Unlike §05 D2 nothing differs between them. |
| D4 | Below 1280px today, with no `.pf-won` driver and no fill mode, every `.pf-won` element renders at its static value: both halves of all three swap pairs superimposed (`2` over `1`, `$78.6k` over `$15.8k`, `6` over `7`), the landed Closed card visible **at the same time** as the card still in Negotiating, the shine band sitting opaque across it, the grab badge stuck on, and the toast permanently on screen | Symptom of D2. Listed separately because it is what QA will see first, and because it is the exact failure §05 §5.3 described. |
| D5 | Counter cell 8 `Overdue` has **no `data-count`** where the other seven do, and its value is `var(--pf-green-600)` where the other seven are `--pf-ink-900`. So one cell in eight neither counts nor matches | Flag. Ship as drawn. The colour is also a contrast failure (§9.4 item 5) and the correction there changes it anyway. |
| D6 | Counter cell 3 `Win rate` ships its **final** value `83%` as placeholder text where the other six ship `0` / `$0K` / `0%`. Before the strip scrolls into view, one cell already reads its answer | Flag, ship as drawn. It is invisible once the count fires, and "correcting" it to `0%` changes what a first-paint screenshot shows. |
| D7 | `pf-won-fly`'s reset is a **visible rewind**, not a cut: between 88% and 94% the card fades from `opacity:0` to `1` *while* travelling from the Closed lane back to Negotiating. For 840ms a ghost card flies backwards across the board | Flag. Reproduce as drawn (principle 1). Moving the opacity to a single stop at 94% would make it a hard cut; that is a choreography change, which is the client's call. |
| D8 | Negotiating card 1 carries `cursor:grabbing` **permanently**, not only during the 28–52% flight. A grab cursor sits on a non-interactive depiction for the whole 14s cycle, and under reduced motion forever | Flag. Ship as drawn — but note it is the only cursor override in the chapter and it is on something that cannot be grabbed. |
| D9 | **The figures contradict each other in three places.** The tilted cards say `62%` win rate, `18` quotes sent, `31%` margin `across 18 jobs`. The counter strip says `42` quotes, `35` won, `83%` win rate, `22%` margin. The toast says `12 this month`. The Closed count says `6` → `7`. The leaderboard sums to `25` won this month | Flag prominently. Data/copy, principle 3 — the client's call. It is why §9.2's `aria-label` describes the board and not the strip. |
| D10 | The counter strip's own arithmetic does not close: `Avg job $300K` against `Pipeline $312K` over `42` quotes, and `Deposits $780K` — more than twice the entire pipeline | Flag with D9. Same escalation. |
| D11 | The global reduced-motion rule for `.pf-analytics-cards` pins it to `transform:none` — the **hovered** state. A resting state pinned to a hover frame | **Fix.** §5.6. Hard gate: the harness screenshots a composition no un-hovered user ever sees. |
| D12 | `.pf-won[data-hide]{display:none!important}` in the reduced-motion block; `data-hide` appears on **no element** in the artboard | Drop the selector. Its job is real, though — §5.6 does it with explicit `display:none` per element. |
| D13 | `var(--color-background, #F3F0E6)` on the board container: `--color-background` is declared nowhere in the web artboard, so the fallback renders | Map to `--color-canvas`. Same value, and it removes an undefined reference. |
| D14 | The browser chrome's `Analytics` / `All` and the counter strip's sixteen `<p>`s set **no `font-family`**, so they inherit Nunito Sans, while every other element in the same mockup explicitly sets `var(--font-sans)` (Hanken Grotesk). Two faces inside one product-UI depiction | Reproduce as rendered (principle 1) and **log prominently**. It reads as an authoring slip of exactly the kind §03/04 ruling 3 escalated, and the client's answer there was "the product faces are correct". Ask again. |
| D15 | Eyebrow copy is `YOUR SALES PIPELINE` (caps in the DOM) on one band and `One source of truth` (sentence case) on the other, both with `text-transform:uppercase`. Mobile's is `ONE SOURCE OF TRUTH - TEAM TOOLS`, caps, with a **hyphen-minus** as a dash and a suffix desktop does not have | Store sentence case, uppercase in CSS (§9.2). The hyphen and the ` - TEAM TOOLS` suffix are copy; flag, do not fix. `brand.md` bans em dashes, so an en dash is the only correction available. |
| D16 | `Mosman retaining + steps` here against `Mosman retaining and steps` in `content/before-after.ts`; `Ana Silva` here against `Ana` there. The same job, two spellings, two sections | Flag. One constant, one spelling, client picks which. |
| D17 | The leaderboard's progress bar does not encode the count beside it: `100%` against `9 of 12` (75%), then `74 / 52 / 31` against `64 / 56 / 40`. It tracks revenue rank instead | Flag. It is the client's data and the number is stated in text beside the bar, so nothing is misread — but the bar means something different from what it sits next to. |
| D18 | `Marco`'s job is `Wattle Grove pool surround` (desktop), `Wattle Grove pool` (mobile) and `Wattle Grove frontage` (the Sent lane). Three strings | Flag. Preserve all three, per §02 rulings 12/13/14. |
| D19 | Mobile lane is `Drafts`, desktop lane is `Draft`. Mobile Drafts holds `3` / `$74.2k`, desktop Draft holds `2` / `$29.7k` | Flag. Preserve both. |
| D20 | `14 Beach Rd` is `Opened 4 times, no reply in 6 days` in **rust** on desktop and `Opened 4 times · after 8pm` in **forest-700** on mobile. The same quote is a warning on one breakpoint and good news on the other | Flag prominently. This is not a length difference like §05's paragraph — it is the opposite reading of the same fact. |
| D21 | Contrast: two eyebrows 2.26, counter labels 2.93, `Overdue` 3.85, lane counts 2.05–2.98, three well-surface strings 4.28; mobile eyebrow 3.21 and four group counts 2.05–2.98 | **Two are settled** (eyebrow tokens). Escalate the rest with §9.4's numbers and the `slate-600` recommendation. |
| D22 | Chapter shell: the H1 fails at 2.48 / 2.53 / **2.73** across the three chapters | Escalate to the shell owner with §9.5's sweep. Not this chapter's to fix. |
| D23 | Radii off the 4/6/8/12 scale: `10px` (mobile group), `9999px` on 8px and 6px dots, `border-radius:12px` on an 8px dot (Negotiating) | Ship as drawn, log. `9999px` and `12px`-on-8px both become `rounded-full` — identical output, clearer code (§02 ruling 6). |
| D24 | Inert declarations: `gap:12px` on the one-child chrome bar; `justify-content:space-between` + `gap:12px` on the one-child leaderboard header; `justify-content:space-between` + `gap:8px` on nine one-child amount rows; `rotate(0deg)` on tilted card 2 | Drop them and reproduce the render. §02 ruling 3. |
| D25 | `That's` in the toast uses a straight apostrophe | **Fix** — normalise to U+2019. §02 ruling 10. |
| D26 | The landed Closed card carries `box-shadow:0 0 0 1.5px var(--color-lime-500)` — the banned decorative lime border | **Build as drawn. Log.** Identical case to §02 ruling 2 (the hero float cards), identical call. |
| D27 | `max-height:150px` in `pf-won-slot` and `pf-won-land` gives roughly 20px of headroom over the two cards that use it. Negotiating card 1 only fits because it is the one board card with **no status line** | Note. Any copy change that adds a line to either card, or wraps a name to two lines, clips. Re-check against 150px. |
| D28 | The sparkline's gradient is `id="pfSpk"`, a document-global id inside a component that could be rendered more than once | **Our defect if we copy it.** Use `useId()`. |

---

## 11. QA checklist

### Structure

- [ ] Two components, `hidden desk:block` and `desk:hidden`. Both exist once
      each in the DOM; neither is hidden with `opacity-0` or `sr-only`.
- [ ] Desktop section: `mx-auto w-full max-w-[1280px] overflow-hidden
      rounded-lg pb-24` with **no** top padding and **no** side padding.
- [ ] Banner `h-[520px] pt-14 pl-14`, panel `-mt-[300px] pt-60 px-8 pb-12`,
      card `rounded-xl bg-pf-surface-300 p-12`.
- [ ] Banner photo is `photo-1.webp` at `object-position: center 30%`; the
      blurred echo behind the panel is the same file, `scaleY(-1) blur(40px)`.
- [ ] Mobile: two sections — `mx-4 mb-[30px]` and `px-4 pb-[34px]` — not one
      panel. Content capped at 560px and centred (§8).
- [ ] Exactly one heading per band; document outline unbroken from the chapter
      above (D1).
- [ ] All board, counter and leaderboard data comes from one
      `content/playbook.ts`, desktop and mobile arrays both, with
      `14 Beach Rd` / `Sarah Henderson` / `$48,200` imported from
      `content/home.ts` rather than retyped.

### Copy — character for character

- [ ] Desktop H1 and mobile section-A H2 are the **same string**.
- [ ] All eight counter labels and all seven `data-count` / `data-format` /
      `data-duration` triples match §3.3 exactly, including cell 8 having none.
- [ ] Nine desktop board cards match §4.4: names, clients, amounts, status
      lines, photos.
- [ ] Five mobile board cards match §7.2, including `Drafts` plural, the
      `·` separators, `, Coogee` and `, Bronte`, and the `$62.8k`-style amounts.
- [ ] `Opened 4 times, no reply in 6 days` (desktop, rust) and
      `Opened 4 times · after 8pm` (mobile, forest-700) are **both** present and
      neither is harmonised (D20).
- [ ] Toast reads `Nice one. Tom accepted. That’s 12 this month.` with a curly
      apostrophe.
- [ ] Desktop leaderboard paragraph and mobile leaderboard paragraph are two
      **different** strings (§7.3).
- [ ] `Marco`'s job is `Wattle Grove pool surround` on desktop and
      `Wattle Grove pool` on mobile (D18).
- [ ] Every apostrophe in the chapter is U+2019.

### Geometry

- [ ] Card content width at a 1280px viewport measures **1120px**; the browser
      card and the leaderboard grid both cap at **1024px**.
- [ ] Tilted cards: 174px wide, at `26%/17%`, `6%/50%`, `24%/16%`, rotated
      `-5deg` / `0deg` / `+5deg`, inside a 160px stack over 132px of stage
      padding.
- [ ] Sparkline path, bar heights `38/52/44/66/58/82/74` with **bar 6** lime,
      and donut `stroke-dasharray="50.6 163.4"` on `r=26` — all exact (§2.4).
- [ ] Counter strip is `grid-cols-8` with a `1px` left border on cells 2–8 and
      none on cell 1.
- [ ] **At 1279px** the board is three columns with Closed as a full-width
      second row. **At 1280px** it is `repeat(3,minmax(0,1fr)) 236px` with
      Closed as the fourth column. Screenshot both.
- [ ] Negotiating card 1 has **no status line and no divider**; every other
      standard card has both.
- [ ] Closed card 1 carries the `1.5px` lime keyline and `overflow:hidden`;
      Closed card 2 is on `--color-well` with its photo at `opacity:.72`.
- [ ] Mobile group tones are `#F6F4EC / #EFEDE0 / #E6E0CC / #CFCDB9` with a
      `1px` hairline each; desktop lane tones are
      `#EFECDF / #E6E0CC / #DDD9C0 / #D2D5C0` with none.
- [ ] Mobile has no `View quote →`, no `User` icon, no Closed-lane blurb and no
      `See all closed →`.

### Animation — freeze the clock

Freeze with, in the page console or the Playwright harness:

```js
const T = 0;                          // ms into the 14s cycle
document.getAnimations().forEach(a => { a.pause(); a.currentTime = T; });
```

No element in this system carries an `animation-delay`, so `currentTime` is
cycle time directly — simpler than §05. Check these frames, **at both 1100px and
1440px**:

- [ ] `t = 0` — **the reference frame.** Card 1 in Negotiating, no shadow, no
      grab. Negotiating `2` / `$78.6k`, Closed `6`. Closed card 1 at
      `max-height:0`. No shine, no toast.
- [ ] `t = 3780` — grab badge begins at `scale(.6)`, `opacity:0`.
- [ ] `t = 3920` — lift begins. Card still at `translate(0,0)`.
- [ ] `t = 4340` — grab badge at `opacity:1 scale(1)`.
- [ ] `t = 4480` — lifted: `scale(1.04) rotate(-2deg)`, shadow
      `0 22px 40px -18px rgba(21,48,31,.55)`. X term is **`-4%` at 1100px** and
      **`+2%` at 1440px**. This is the single most important frame in the
      chapter — if both widths show the same X, the media query is wrong.
- [ ] `t = 5600` — swap begins. Both halves of each pair partially visible.
- [ ] `t = 6160` — mid-flight: **`translate(-120%, 180px)` at 1100px**,
      **`translate(62%, 6px)` at 1440px**.
- [ ] `t = 6440` — swap complete: `1` / `$15.8k` / `7`, and the outgoing spans
      at exactly `opacity:0`.
- [ ] `t = 6580` — landing wrapper opening; grab badge beginning to fade.
- [ ] `t = 6720` — origin slot begins to collapse from `150px`.
- [ ] `t = 6860` — arrival: **`translate(-205%, 345px)` at 1100px**,
      **`translate(104%, 30px)` at 1440px**, back to `scale(1) rotate(0deg)`,
      shadow softened to `0 10px 22px -14px rgba(21,48,31,.4)`.
- [ ] `t = 7140` — landed card at `max-height:150px`, `opacity:1`.
- [ ] `t = 7280` — the handover. Flying card at **exactly `opacity:0`** and the
      landed card at `opacity:1`. **Two visible cards here is a bug.**
- [ ] `t = 7560` — origin slot at `max-height:0`; `Harcourt St terrace` has
      finished sliding up.
- [ ] `t = 8120` — shine at `opacity:1`, transform roughly `translateX(-14%)`;
      toast at `translateY(0) scale(1)`, `opacity:1`.
- [ ] `t = 9240` — shine at `opacity:0 translateX(140%)`.
- [ ] `t = 10920` — toast begins to leave.
- [ ] `t = 11760` — landed card begins to close.
- [ ] `t = 12040` — toast gone.
- [ ] `t = 12320` — reset begins: slot reopening, swaps crossing back.
- [ ] `t = 12600` — landed card at `max-height:0`.
- [ ] `t = 13160` — reset complete; frame is identical to `t = 0`.
- [ ] `t = 12600` again, at 1440px — confirm the **backwards flight** (D7) is
      present and looks as the source draws it. It is not a bug.
- [ ] The shine's `transform` is linear across 52–66% with **no velocity break
      at 58%**. Sample `t = 7280 / 8120 / 9240` and confirm the three X values
      are evenly spaced.
- [ ] `.won-shine` and the six `.won-swap-*` spans compute to `linear`;
      everything else to `cubic-bezier(0.32, 0.72, 0, 1)`.
- [ ] The Negotiating total column does **not** change width between
      `t = 0` and `t = 7000`.
- [ ] At 1024px, confirm the flying card's path does not pass through the toast
      in a way that reads as a collision (the card is `z-index:30`, the toast
      `20`).

### The count-ups

- [ ] Scroll the strip in from below and confirm all seven fire **once**. Scroll
      away and back: none re-runs.
- [ ] The trigger fires when the strip's top crosses **85%** of the viewport
      height, not 90%. Compare against a `<Reveal>` element in the same band —
      the reveal must fire first.
- [ ] At 450ms into the count, `Pipeline` reads **`$273K`**, not `$156K`. That
      is the cubic ease-out; a linear ramp fails here.
- [ ] Final values: `42 / 35 / 83% / $312K / $300K / $780K / 22% / $0`.
- [ ] Every counting value computes `font-variant-numeric: tabular-nums` and the
      eight cells do not reflow during the count.
- [ ] No element in the strip has `aria-live`.

### Reduced motion

- [ ] With `prefers-reduced-motion: reduce`, every animation in the chapter
      reports `animation-name: none`. Nothing is left running.
- [ ] The counter strip shows its **final** values immediately, at first paint,
      with no count.
- [ ] Exactly **one** value is visible in each of the three swap slots, and they
      read `2`, `$78.6k`, `6` — not `1`/`$15.8k`/`7`, not both superimposed.
- [ ] The Ridgeway card is **in Negotiating**, at `transform:none`, with **no
      box-shadow** and **no grab badge**.
- [ ] The Closed lane shows **one** card (`Mosman retaining + steps`), and the
      lane's flex gap above it has not been left behind by a zero-height box.
- [ ] **Zero** shine band and **zero** toast are visible. This is the fastest
      way to spot the artboard's broken block having been ported verbatim.
- [ ] `.analytics-cards` computes `translateY(18px) scale(0.96)` — the **rest**
      transform, not `none` (D11). Hover does nothing.
- [ ] Screenshot this state and confirm it is the same composition as the
      `t = 0` live frame, and the same composition the mobile board draws.
- [ ] Run the structural diff for this chapter with `--motion none --freeze <t>`
      at matched `t` on both sides, per §05 ruling 3 — our resting frame
      deliberately differs from the artboard's.

### The media-query fix

- [ ] `styles/motion/playbook.css` contains **exactly one**
      `@media (width >= 1280px)`, holding the board columns and the fly vector
      together, plus the reduced-motion block. No other width query.
- [ ] The dead copy at artboard lines 142–159 and the `.pf-won[data-hide]`
      selector are not in the build. Grep for them.
- [ ] At **1024px**, the full 14s choreography runs. This is the regression the
      whole fix exists for — check it before anything else.
- [ ] At 1024, 1279 and 1280px each swap slot shows exactly one legible value,
      the Closed lane shows exactly one card at `t = 0`, and no shine or toast
      is stuck on.

### Accessibility

- [ ] The analytics stage is `role="img"` with the `aria-label` from §9.2.
      Nothing inside it is announced individually.
- [ ] The team leaderboard is **not** inside that boundary: the `<ul>`, its
      four rows and the `Jobs won this month` heading all read normally.
- [ ] The mobile board is **not** `role="img"`: its four group names are `<h3>`
      and its five cards read normally.
- [ ] No `aria-hidden=""` remains anywhere — all 19 desktop and 5 mobile are
      `"true"`.
- [ ] Every `<img>` is `alt=""`.
- [ ] The chapter adds **zero** tab stops. Tab from the band above lands on
      whatever follows; `View quote →` ×5 and `See all closed →` are not
      `<button>` or `<a>`.
- [ ] VoiceOver, desktop: eyebrow → heading → paragraph → the one `img` label →
      eyebrow → heading → paragraph → `Jobs won this month` → four rows →
      footer. No individual board card, no counter value.
- [ ] Neither eyebrow is announced letter by letter (both stored sentence case).
- [ ] Contrast spot-checks against §9.4: the **rust status lines must measure
      5.24:1** (they pass — do not "fix" them), the tilted-card labels and
      client names **4.71:1**, and the bar fill vs track **3.11:1**. The twelve
      failures are the escalation.
- [ ] axe clean at 430, 1024 and 1440px in both motion preferences.

### Fluid range (§8)

- [ ] 320px: gutter 16px, section-A banner padding 18px, body padding 16px, no
      horizontal overflow, H2s at 22px and 20px, no orphaned word.
- [ ] 320px: `112 Ridgeway Ave, Bronte` **ellipses**, it does not overflow, and
      every leaderboard job name ellipses.
- [ ] 430px: identical to the artboard. Section-A H2 measures exactly 28.0px,
      section-B H2 exactly 24.0px.
- [ ] 560px: both horizontal paddings step to 24px.
- [ ] 640px: gutter steps to 32px, via `sm-only:` — verify at **1440px** that
      the desktop value still lands (the RULINGS page-wide `sm:`/`desk:` trap).
- [ ] 768px and 1023px: content capped at 560px and centred; still zero
      animation, zero counting, two separate sections.
- [ ] 1023 → 1024px: the composition swaps whole. No width shows a counter strip
      without its browser chrome, no width shows tilted cards over a stacked
      board, and no width below 1024 animates or counts.
