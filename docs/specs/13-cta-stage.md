# 13 — CTA stage (pinned, scroll-scrubbed)

Source:

- Desktop — `Bramble Home Web.dc.html`, `<!-- ===== CTA STAGE (pinned) ===== -->`,
  lines **1877–1901**. CSS: `.pf-btn-lime` lines 48–49, `.pf-sticker` line 254,
  `.pf-cta-chip` line 266, `.pf-shadow-border-strong` line 46, `.pf-h2` lines
  37/41/42. The scroll maths is in the `<script type="text/x-dc">` block:
  `revealWords` line **2045**, the CTA branch of `onScroll` line **2054**,
  `ctaChips` line **2059**, `ctaField` line **2060**.
- Mobile — **this section does not exist.** Confirmed against
  `Bramble Home Mobile.dc.html`: `grep -c "cta-stage\|pf-cta\|sticker"` returns
  **0**, and none of the section's five strings (`quoting at midnight`,
  `Get started for free`, `Talk to our team`, `Scope, price and send`, any chip
  name) appears in that file. There is no mobile composition to port, no mobile
  copy to preserve and no mobile behaviour to reproduce. §8 is therefore a
  designer decision in full, and is marked as such.

This is the page's **only scroll-scrubbed composition**. Everything else on the
homepage is either a time-based keyframe loop (the hero float cards, the
before/after phones, the marquee) or a threshold (the nav flip, the reveal
system). Here a single continuous value `p ∈ [0, 1]`, derived from the stage's
position in the viewport, drives three things at once: a word-by-word headline
reveal, eleven chips spreading outward from centre, and a two-lobe radial
gradient field growing underneath. Nothing has a duration. Scrolling back up
runs it backwards exactly.

Two components, mutually exclusive by breakpoint:

- `<CtaStage>` — `hidden desk:block`. The pinned scrub.
- `<CtaBandMobile>` — `desk:hidden`. A static band, my design (§8).

`desk` = 1024px. Because they are gated by `display:none`, none of the scrub's
CSS needs a media query, and the hook must not attach below 1024 — see §6.5.

Files:

- `components/home/cta-stage/` — both components.
- `lib/use-scroll-progress.ts` — the shared primitive (§6.4). The hero's pinned
  quote needs the same thing; write it once.
- `styles/motion/cta-stage.css` — the typed custom properties, the chip and word
  ramps, and the reduced-motion block last. Imported from `app/globals.css`
  after `customer-stories.css`.
- `content/cta-stage.ts` — the eleven chips as one exported constant.

---

## 1. Stage geometry

### 1.1 The outer stage

Verbatim:

```
<section id="pf-cta-stage" style="position:relative;height:calc(200vh + 600px)">
```

Tailwind: `relative h-[calc(200vh+600px)]`.

Two viewports plus 600px. The `600px` is not decoration — it is what buys the
choreography room to finish: see §1.4 for the arithmetic.

`vh`, not `svh` or `dvh`. Leave it as `vh`. On desktop the two are identical, and
the composition never renders below 1024px where they diverge.

### 1.2 The sticky child

Verbatim:

```
<div style="position:sticky;top:0;display:flex;height:100vh;align-items:center;
            justify-content:center;overflow:hidden">
```

Tailwind: `sticky top-0 flex h-screen items-center justify-center overflow-hidden`.

One viewport tall, pinned to the top of the viewport. It holds three layers, in
DOM order and therefore in paint order:

1. `#pf-cta-field` — the ambient gradient, `position:absolute; inset:0`.
2. `#pf-cta-chips` — the eleven chips, `position:absolute; top:0; height:100vh`.
3. The copy block — `position:relative; z-index:10`.

`overflow:hidden` on the sticky child clips all three to the viewport box.

`align-items:center` + `justify-content:center` centre the copy block. They also
determine the **static position** of the two absolutely-positioned layers, which
matters — see D2.

### 1.3 The field layer and its mask

Verbatim:

```
<div id="pf-cta-field" aria-hidden="true" style="pointer-events:none;
     position:absolute;inset:0;
     -webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 16%,#000 84%,transparent 100%);
             mask-image:linear-gradient(to bottom,transparent 0%,#000 16%,#000 84%,transparent 100%)">
```

A four-stop vertical mask: fully transparent at the top edge, fully opaque from
16% to 84%, transparent again at the bottom. On a 900px viewport that is a 144px
dissolve at each end. It is what stops the field drawing a hard horizontal seam
against the section above (customer stories) and below.

Ship `-webkit-mask-image` alongside `mask-image` — same call as RULINGS §01
ruling 6. Safari still needs the prefix for mask shorthand in this position.

`aria-hidden="true"` is already correct in the source (it is `"true"`, not the
empty string that RULINGS §03/04 ruling 7 had to fix elsewhere). Keep it.

The element has **no `background-color`**. It contributes nothing at all until
the JS writes a `background-image`, so the no-JS render is the page's own
`pf-surface-300`. §7 changes that: the settled gradient moves into static CSS.

### 1.4 How `p` is derived

Verbatim, from `onScroll` (line 2054):

```js
const cs=document.getElementById('pf-cta-stage');
if(cs){
  const r=cs.getBoundingClientRect();
  const total=cs.offsetHeight-vh;
  const p=this.clamp(-r.top/total,0,1);
  ...
}
```

with `vh = window.innerHeight` and

```js
clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
```

Read it out:

- `r.top` is the stage's top edge relative to the viewport top. It is positive
  while the stage is still below the fold and goes negative as it passes up.
- `total = offsetHeight - vh = (2·vh + 600) − vh = **vh + 600**`. This is the
  scroll distance over which the sticky child stays pinned: the child sticks when
  the stage top reaches 0 and unsticks when the stage bottom reaches the viewport
  bottom.
- `p = clamp(−r.top / (vh + 600), 0, 1)`.

So `p = 0` at the exact moment the stage top touches the viewport top (the child
begins to pin) and `p = 1` at the exact moment the stage bottom touches the
viewport bottom (the child begins to unpin). **`p` maps one-to-one onto the
pinned interval**, which is the property that makes the whole thing legible.

Scrub length, measured:

| Viewport height | `total` = scroll px for `p: 0 → 1` | 1% of `p` |
|---|---|---|
| 700px | 1300px | 13.0px |
| **900px** (harness) | **1500px** | **15.0px** |
| 1080px | 1680px | 16.8px |

**Everything in this document is quoted in `p`, not pixels.** At the harness's
1440×900 the conversion is `scrollTop = stageTop + p × 1500`.

Note the pre-roll. While the stage is entering from the bottom of the viewport —
one full viewport of scrolling — `−r.top` is negative, `p` clamps to 0, and the
sticky child renders its `p = 0` frame in normal flow. That frame has to be a
sensible composition on its own, because it is on screen for 100vh of scrolling
before the scrub starts. It is: chips at opacity 0, field at its smallest, tail
words at their floor opacity. See §7 for why that floor is a problem.

### 1.5 Component boundary

The stage owns its own progress. Do **not** hoist `p` to a page-level context:
the hero's pinned quote computes a different `p` from a different element, and
RULINGS §01 already ruled that two scroll systems measuring different boxes must
not be unified.

---

## 2. The headline

### 2.1 Markup, verbatim

```html
<h2 class="pf-h2" style="color:var(--pf-ink-900);text-wrap:balance">
  <span style="display:block">The best landscapers aren't quoting at midnight.</span>
  <span id="pf-cta-tail" data-total="5" style="display:flex;flex-wrap:wrap;justify-content:center;column-gap:.3em">
    <span data-w="0" style="opacity:.22">They've</span>
    <span data-w="1" style="opacity:.22">got</span>
    <span data-w="2" style="opacity:.22">Bramble</span>
    <span data-w="3" style="opacity:.22">doing</span>
    <span data-w="4" style="opacity:.22">it.</span>
  </span>
</h2>
```

(Indented here for reading. **In the source there is no whitespace whatsoever
between the spans** — that is D3, and it is a real defect.)

### 2.2 Copy, verbatim

Line 1, static, full opacity, never scrubbed:

> `The best landscapers aren't quoting at midnight.`

Line 2, the scrubbed tail, five words:

> `They've` `got` `Bramble` `doing` `it.`

Both apostrophes in the source are **straight** (U+0027 — verified by hexdump:
`61 72 65 6e 27 74` / `54 68 65 79 27 76 65`). Normalise both to U+2019 per
RULINGS §02 ruling 10. Typographic, not editorial.

`data-total="5"`. The JS fallback when the attribute is missing is `'4'`; the
attribute is present, so `tot = 5`.

### 2.3 Type

`.pf-h2` resolves to our `.display .display-2`:

```
.pf-h2 { font-size:2rem; line-height:1.2; letter-spacing:-.008em }
@media(min-width:768px){ .pf-h2{ font-size:2.5rem } }
@media(min-width:1024px){ .pf-h2{ font-size:3rem } }
```

in Fraunces at `"wght" 420, "SOFT" 100, "WONK" 0, "opsz" 10`. At our breakpoint
that is **48px**. Colour `var(--pf-ink-900)` → `text-pf-ink-900`.

`text-wrap:balance` is on the `<h2>`. It balances line 1 (a `display:block`
span with real inline content). It does **nothing** to the tail, which is a flex
container — flex items are not text runs and `balance` has no purchase on them.
Ship the declaration as drawn (it is doing real work on line 1) and note the
half-inertness. Related to §05's D23, not the same bug.

The tail's `column-gap:.3em` replaces the word spaces that the markup does not
contain. At 48px that is **14.4px** between words. It also means the words wrap
as a flex row (`flex-wrap:wrap`, `justify-content:center`), not as text.

### 2.4 The reveal window

Verbatim, from `onScroll` (line 2054):

```js
const c=document.getElementById('pf-cta-tail');
if(c){
  const tot=parseFloat(c.dataset.total||'4');
  const rev=this.clamp((p-0.30)/(0.72-0.30),0,1)*(tot+1);
  this.revealWords('pf-cta-tail',rev);
}
```

and verbatim, `revealWords` (line 2045):

```js
revealWords(id,revealed){
  const c=document.getElementById(id); if(!c)return;
  c.querySelectorAll('[data-w]').forEach(s=>{
    const i=parseFloat(s.dataset.w);
    const t=this.clamp(revealed-(i-0.5),0,1);
    s.style.opacity=(0.22+t*0.78).toFixed(3);
  });
}
```

So, exactly:

```
rev      = clamp((p − 0.30) / 0.42, 0, 1) × 6          (tot + 1 = 6)
t(i)     = clamp(rev − (i − 0.5), 0, 1)
opacity  = 0.22 + 0.78 · t(i)                          (three decimal places)
```

The remap window is `0.30 → 0.72`, a span of **0.42** of `p`. The ramp is
**0.22 → 1** per word, linear in `rev`. Each word takes `1 / 6` of the window —
`0.07` of `p`, **105px of scroll at 1440×900** — to go from floor to full.

**The `−(i − 0.5)` term gives word 0 a half-step head start.** At `rev = 0`,
`t(0) = clamp(0.5) = 0.5`, so word 0 renders at `0.22 + 0.39 = **0.610**`, not
`0.22`. The inline `opacity:.22` on `They've` is therefore never seen once the
script has run — only in the SSR frame. That is D5.

The stagger is exactly one word per `rev` step, so at any moment inside the
window there is **one word mid-fade**, the ones before it at 1 and the ones after
at 0.22.

Measured, the full table (`rev` and per-word opacity):

| `p` | `rev` | `They've` | `got` | `Bramble` | `doing` | `it.` |
|---|---|---|---|---|---|---|
| 0.000 | 0.000 | 0.610 | 0.220 | 0.220 | 0.220 | 0.220 |
| 0.100 | 0.000 | 0.610 | 0.220 | 0.220 | 0.220 | 0.220 |
| 0.200 | 0.000 | 0.610 | 0.220 | 0.220 | 0.220 | 0.220 |
| **0.300** | 0.000 | 0.610 | 0.220 | 0.220 | 0.220 | 0.220 |
| 0.350 | 0.714 | 1.000 | 0.387 | 0.220 | 0.220 | 0.220 |
| 0.400 | 1.429 | 1.000 | 0.944 | 0.220 | 0.220 | 0.220 |
| 0.450 | 2.143 | 1.000 | 1.000 | 0.721 | 0.220 | 0.220 |
| 0.500 | 2.857 | 1.000 | 1.000 | 1.000 | 0.499 | 0.220 |
| 0.550 | 3.571 | 1.000 | 1.000 | 1.000 | 1.000 | 0.276 |
| 0.600 | 4.286 | 1.000 | 1.000 | 1.000 | 1.000 | 0.833 |
| **0.615** | 4.500 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 |
| 0.720 | 6.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 |
| 1.000 | 6.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 |

**The reveal finishes at `p = 0.615`, not at `0.72`.** The last word needs
`rev = 4.5` and the window runs `rev` to 6, so `rev ∈ [4.5, 6]` — `p ∈ [0.615,
0.72]`, and then `p ∈ [0.72, 1]` on top — changes nothing. Roughly **38.5% of the
stage, 578px of scroll at 1440×900, has a static headline.** That is D4. It is
not a bug in the maths; it is the consequence of `tot + 1` with a half-step head
start, and the chips' drift (§3.6) is what fills the tail of the stage. Ship as
drawn, flag.

Per-word start points, for QA:

| Word | starts leaving the floor at `p` | reaches 1.000 at `p` |
|---|---|---|
| 0 `They've` | (starts at 0.610) | 0.335 |
| 1 `got` | 0.335 | 0.405 |
| 2 `Bramble` | 0.405 | 0.475 |
| 3 `doing` | 0.475 | 0.545 |
| 4 `it.` | 0.545 | 0.615 |

### 2.5 What this looks like when it is right

The first line is simply there, black, from the moment the stage pins. The second
line is a ghost of itself. As you scroll, the ghost resolves left to right, one
word at a time, at a steady rate — no easing, no overlap, no bounce. `Bramble`
lands in the middle, which is the point. By `p = 0.615` the sentence is a normal
sentence and the section reads as a plain, confident CTA.

**It is wrong if:** all five words brighten together (the `−(i − 0.5)` term has
been dropped); the words snap rather than ramp (the value is being quantised —
see §6, the `toFixed(3)` in the source is *not* the problem, IntersectionObserver
thresholds would be); the reveal runs to `p = 1` (the `tot + 1` has been
"corrected" to `tot`); or the words reflow as they brighten (something is
animating a property other than `opacity`).

---

## 3. The eleven chips

### 3.1 Container

Verbatim:

```
<div id="pf-cta-chips" style="position:absolute;top:0;margin:0 auto;height:100vh;
     width:100%;max-width:1920px;overflow:hidden">
```

`margin:0 auto` on an absolutely-positioned box with `left:auto; right:auto` is
**inert** — auto margins only resolve against a constrained box. The centring
that does happen above 1920px comes from the parent flex container's
`justify-content:center` resolving the static position. That is D2. Reproduce the
render, but write it honestly: `absolute inset-x-0 top-0 mx-auto h-screen
w-full max-w-[1920px] overflow-hidden`. With `left:0; right:0` present, `mx-auto`
becomes real and the behaviour is identical at every width, including >1920px.

The chip layer sits **below** the copy block (`z-index:10`) and **above** the
field, by DOM order.

### 3.2 Chip shell, verbatim

```
class="pf-sticker pf-cta-chip"
style="position:absolute;display:flex;align-items:center;gap:8px;
       border-radius:9999px;background:#fff;padding:4px 12px 4px 4px;opacity:0"
```

Disc:

```
display:flex;height:28px;width:28px;align-items:center;justify-content:center;
border-radius:9999px;background:<disc colour>;color:<disc fg>;
font-size:11px;font-weight:800
```

Label:

```
font-size:14px;font-weight:700;color:var(--pf-ink-900)
```

Computed chip height: `4 + 28 + 4 = **36px**`. `border-radius:9999px` on a 36px
box → `rounded-full` (RULINGS §02 ruling 6 precedent). The label inherits the
page body face, Nunito Sans → `--font-body`.

`.pf-cta-chip` is one declaration:

```css
.pf-cta-chip{will-change:transform,opacity,filter}
```

Do not port it as written — see §6.3 and D7.

`.pf-sticker` is:

```css
.pf-sticker{filter:drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff)
            drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff)
            drop-shadow(0 12px 24px #00000059)}
```

**This class is completely inert on these eleven elements.** `ctaChips` writes
`el.style.filter = 'blur(Npx)'` on every tick; an inline `filter` beats a class
`filter` outright, and the two do not merge. From the first scroll event onward
the chips have no white keyline and no drop shadow at all — including at
`blur(0.00px)`, which still overrides. This is D1 and it is the single biggest
visual question in the section: see §9.2 for the measurement and §10 for the
recommendation.

### 3.3 The eleven chips, verbatim

Source these from `content/cta-stage.ts` as one exported array, in this DOM
order. The index `i` is load-bearing — it drives the fade stagger (§3.5).

| `i` | `data-top` | `data-x` | `data-side` | `data-tilt` | Disc colour | Disc fg | Initials | Name |
|---|---|---|---|---|---|---|---|---|
| 0 | `18` | `18` | `left` | `-6` | `--color-forest-900` `#15301F` | `#fff` | `OL` | `Occo Landscapers & Builders` |
| 1 | `26` | `12` | `left` | `3` | `--color-lime-500` `#C8E84A` | `#15301F` | `CG` | `Coastal Gardens` |
| 2 | `30` | `34` | `left` | `-2` | `--color-forest-700` `#2C5539` | `#fff` | `BR` | `BuildRight` |
| 3 | `18` | `28` | `right` | `2` | `--color-lime-500` `#C8E84A` | `#15301F` | `HP` | `Harbour Pools` |
| 4 | `13` | `6` | `right` | `-3` | `--color-forest-500` `#4D8F6C` | `#fff` | `EO` | `Elm & Oak` |
| 5 | `46` | `10` | `right` | `6` | `--color-forest-900` `#15301F` | `#fff` | `GS` | `GreenScape` |
| 6 | `64` | `12` | `left` | `-6` | `--color-lime-500` `#C8E84A` | `#15301F` | `RL` | `Ridgeline` |
| 7 | `66` | `48` | `left` | `3` | `--color-forest-700` `#2C5539` | `#fff` | `TF` | `Terra Firma` |
| 8 | `68` | `8` | `right` | `-2` | `--color-lime-500` `#C8E84A` | `#15301F` | `BC` | `Bluestone Co.` |
| 9 | `76` | `24` | `right` | `6` | `--color-forest-500` `#4D8F6C` | `#fff` | `FS` | `Fern & Stone` |
| 10 | `80` | `28` | `left` | `-3` | `--color-forest-900` `#15301F` | `#fff` | `PP` | `Palm & Pine` |

The ampersands are `&amp;` in the source, i.e. literal `&` — not `and`.
`Bluestone Co.` keeps its full stop. No apostrophes anywhere in the eleven names,
so D8 does not touch them.

Disc colour distribution: four `forest-900`, four `lime-500`, two `forest-700`,
two `forest-500` — no, exactly: `forest-900` ×3 (0, 5, 10), `lime-500` ×4 (1, 3,
6, 8), `forest-700` ×2 (2, 7), `forest-500` ×2 (4, 9). The two `forest-500` discs
are a contrast failure — §9.3.

### 3.4 The spread maths, verbatim

```js
ctaChips(p){
  const box=document.getElementById('pf-cta-chips'); if(!box)return;
  const SET=0.5;
  box.querySelectorAll('[data-chip]').forEach((el,i)=>{
    const top=parseFloat(el.dataset.top),x=parseFloat(el.dataset.x),
          side=el.dataset.side,tilt=parseFloat(el.dataset.tilt);
    const st=50-(50-top)*0.35, sx=50-(50-x)*0.4;
    const k=this.clamp(p/SET,0,1);
    const topN=st+(top-st)*k, xN=sx+(x-sx)*k;
    const fadeAt=0.06+i*0.012;
    const op=this.clamp(p/fadeAt,0,1);
    const bl=4*(1-op);
    const sc=0.95+0.05*k;
    const drift=p>SET?-46*this.clamp((p-SET)/(1-SET),0,1):0;
    el.style.top=topN+'%';
    if(side==='left'){el.style.left=xN+'%';el.style.right='auto';}
    else{el.style.right=xN+'%';el.style.left='auto';}
    el.style.opacity=op.toFixed(3);
    el.style.filter='blur('+bl.toFixed(2)+'px)';
    el.style.transform='translateY('+drift.toFixed(1)+'px) scale('+sc.toFixed(3)+') rotate('+tilt+'deg)';
  });
}
```

Broken out, with `SET = 0.5`:

```
k        = clamp(p / 0.5, 0, 1)                       settle progress

start    top₀ = 50 − (50 − top) · 0.35                65% of the way to centre
         x₀   = 50 − (50 −  x ) · 0.40                60% of the way to centre

position top  = top₀ + (top − top₀) · k               linear lerp, no easing
         x    =  x₀  + ( x  −  x₀ ) · k
         written to `top` and to `left` OR `right` depending on data-side

fade     fadeAt = 0.06 + i · 0.012                    per-index stagger
         opacity = clamp(p / fadeAt, 0, 1)            three decimals

blur     = 4 · (1 − opacity)  px                      two decimals
scale    = 0.95 + 0.05 · k                            three decimals
drift    = p > 0.5 ? −46 · clamp((p − 0.5)/0.5, 0, 1) : 0   px, one decimal

transform = translateY(<drift>px) scale(<scale>) rotate(<tilt>deg)
```

Three separate clocks, which is what makes the motion read as organic rather
than mechanical:

- **`k`** — the spread — runs `p: 0 → 0.5` and is then held.
- **`op`/`blur`** — the fade — runs `p: 0 → fadeAt`, i.e. is finished by
  `p = 0.18` at the latest, long before the spread is.
- **`drift`** — runs `p: 0.5 → 1`, starting exactly where the spread stops.

So the sequence is: chips sharpen in place near the centre → they glide outward
to their authored positions → they all drift 46px upward together. The seam at
`p = 0.5` is deliberate and there is no gap and no overlap on either side of it.

**Start positions, computed** (`top₀` / `x₀`). These are where every chip sits at
`p = 0`, at opacity 0 — so this is the invisible frame the fade reveals:

| `i` | Name | `data-top` → `top₀` | `data-x` → `x₀` | `fadeAt` |
|---|---|---|---|---|
| 0 | Occo Landscapers & Builders | 18 → **38.80** | 18 → **37.2** | 0.060 |
| 1 | Coastal Gardens | 26 → **41.60** | 12 → **34.8** | 0.072 |
| 2 | BuildRight | 30 → **43.00** | 34 → **43.6** | 0.084 |
| 3 | Harbour Pools | 18 → **38.80** | 28 → **41.2** | 0.096 |
| 4 | Elm & Oak | 13 → **37.05** | 6 → **32.4** | 0.108 |
| 5 | GreenScape | 46 → **48.60** | 10 → **34.0** | 0.120 |
| 6 | Ridgeline | 64 → **54.90** | 12 → **34.8** | 0.132 |
| 7 | Terra Firma | 66 → **55.60** | 48 → **49.2** | 0.144 |
| 8 | Bluestone Co. | 68 → **56.30** | 8 → **33.2** | 0.156 |
| 9 | Fern & Stone | 76 → **59.10** | 24 → **39.6** | 0.168 |
| 10 | Palm & Pine | 80 → **60.50** | 28 → **41.2** | 0.180 |

Note chip 7: `x = 48`, `side = left`, `top = 66`. It settles **48% from the left,
66% down** — directly behind the CTA button row. The copy block's `z-index:10`
keeps it behind, so nothing is obscured, but a white pill tangent to a white
button is a specific thing to look at in the visual diff. D6.

Note also `x₀` for chip 7 is 49.2% — it starts, invisible, 0.8% from dead centre.

### 3.5 The fade stagger

`fadeAt = 0.06 + i × 0.012`, so the eleven chips complete their fade at
`p = 0.060, 0.072, 0.084, 0.096, 0.108, 0.120, 0.132, 0.144, 0.156, 0.168,
0.180`. **All eleven are fully opaque and fully sharp by `p = 0.18`** — 270px of
scroll at 1440×900, or 18% of the pinned interval.

The stagger is in the *rate*, not in a delay: every chip starts fading at
`p = 0` and chip 0 simply gets there fastest. So at `p = 0.03` the eleven are at
eleven different opacities — 0.500, 0.417, 0.357, 0.312, 0.278, 0.250, 0.227,
0.208, 0.192, 0.179, 0.167 — a smooth ramp from front to back. That is the whole
effect: the pile appears to develop depth.

### 3.6 Chip state at checkpoints

| `p` | `k` | scale | drift | chip 0 op / blur | chip 10 op / blur |
|---|---|---|---|---|---|
| 0.00 | 0.000 | 0.950 | 0.0px | 0.000 / 4.00px | 0.000 / 4.00px |
| 0.03 | 0.060 | 0.953 | 0.0px | 0.500 / 2.00px | 0.167 / 3.33px |
| **0.06** | 0.120 | 0.956 | 0.0px | **1.000 / 0.00px** | 0.333 / 2.67px |
| 0.09 | 0.180 | 0.959 | 0.0px | 1.000 / 0.00px | 0.500 / 2.00px |
| 0.12 | 0.240 | 0.962 | 0.0px | 1.000 / 0.00px | 0.667 / 1.33px |
| **0.18** | 0.360 | 0.968 | 0.0px | 1.000 / 0.00px | **1.000 / 0.00px** |
| 0.25 | 0.500 | 0.975 | 0.0px | 1.000 / 0.00px | 1.000 / 0.00px |
| **0.50** | **1.000** | **1.000** | **0.0px** | 1.000 / 0.00px | 1.000 / 0.00px |
| 0.75 | 1.000 | 1.000 | −23.0px | 1.000 / 0.00px | 1.000 / 0.00px |
| **1.00** | 1.000 | 1.000 | **−46.0px** | 1.000 / 0.00px | 1.000 / 0.00px |

Scale travels only 0.95 → 1.00 — 5%, and on a 36px pill that is under 2px of
growth. It is felt, not seen. Do not "improve" it.

The tilt is **constant**: it is written into the transform on every tick but
never varies. Eleven fixed rotations between −6° and +6°.

### 3.7 What this looks like when it is right

At the moment the stage pins, the screen is the copy block on a faint tinted
field and nothing else. Within the first fifth of the scrub, eleven business-name
pills resolve out of a blur, clustered tightly around the middle of the screen —
front ones first. They then glide outward and apart, settling into a loose
horseshoe around the copy at the halfway point, and finally the whole constellation
lifts 46px as the stage lets go.

**It is wrong if:** the chips arrive already spread and then just fade (the
`st`/`sx` pull toward centre has been dropped); they all sharpen at once (the
`fadeAt` index term is missing); they are still moving outward after `p = 0.5`;
the drift starts before `p = 0.5`; or anything reflows while they move (see §6 —
the artboard's `top`/`left` writes do exactly that, and our build must not).

---

## 4. The ambient field

### 4.1 Verbatim

```js
ctaField(p){
  const f=document.getElementById('pf-cta-field'); if(!f)return;
  const k=this.clamp(p/0.6,0,1);
  const s=26+(62-26)*k, o=32+(6-32)*k, a=0.22+(0.46-0.22)*k;
  const P='21,48,31',O='200,232,74';
  f.style.backgroundImage=
    'radial-gradient(ellipse '+s+'% '+(s*1.05)+'% at '+o+'% '+(o*0.5)+'%,rgba('+P+','+a+') 0%,rgba('+P+',0) 70%),'+
    'radial-gradient(ellipse '+s+'% '+(s*1.05)+'% at '+(100-o)+'% '+(100-o*0.5)+'%,rgba('+O+','+a+') 0%,rgba('+O+',0) 70%)';
}
```

### 4.2 The three ramps

Note the clock: **`k = clamp(p / 0.6, 0, 1)`** — a *different* `k` from the
chips' `p / 0.5`. The field reaches its final state at **`p = 0.60`** and holds
for the remaining 40% of the stage.

```
size      s  = 26 + 36·k      %      of the container width   (26% → 62%)
          sy = s × 1.05       %      of the container height
origin    o  = 32 − 26·k      %      (32% → 6%)
alpha     a  = 0.22 + 0.24·k         (0.22 → 0.46)
```

Two layers, first in the list therefore **painted on top**:

1. **Lime**, `rgb(200 232 74)` = `--color-lime-500` `#C8E84A`, at
   `(100 − o)%, (100 − o·0.5)%` — bottom-right.
2. **Forest**, `rgb(21 48 31)` = `--color-forest-900` `#15301F`, at
   `o%, (o·0.5)%` — top-left.

Both are `ellipse s% sy%` with stops at `0%` (full alpha) and `70%` (alpha 0).
The `70%` stop means each lobe's visible edge is at 70% of its ellipse radii, not
100%.

The vertical origins are **half** the horizontal ones (`o · 0.5`), so the two
lobes hug the top-left and bottom-right *corners* and move diagonally outward
together as `o` falls.

Computed at checkpoints:

| `p` | `k` | `s` | `s×1.05` | forest at | lime at | alpha |
|---|---|---|---|---|---|---|
| 0.0 | 0.000 | 26.00% | 27.300% | 32.00% 16.00% | 68.00% 84.00% | 0.2200 |
| 0.1 | 0.167 | 32.00% | 33.600% | 27.67% 13.83% | 72.33% 86.17% | 0.2600 |
| 0.2 | 0.333 | 38.00% | 39.900% | 23.33% 11.67% | 76.67% 88.33% | 0.3000 |
| 0.3 | 0.500 | 44.00% | 46.200% | 19.00% 9.50% | 81.00% 90.50% | 0.3400 |
| 0.4 | 0.667 | 50.00% | 52.500% | 14.67% 7.33% | 85.33% 92.67% | 0.3800 |
| 0.5 | 0.833 | 56.00% | 58.800% | 10.33% 5.17% | 89.67% 94.83% | 0.4200 |
| **0.6** | **1.000** | **62.00%** | **65.100%** | **6.00% 3.00%** | **94.00% 97.00%** | **0.4600** |
| 0.8 | 1.000 | 62.00% | 65.100% | 6.00% 3.00% | 94.00% 97.00% | 0.4600 |
| 1.0 | 1.000 | 62.00% | 65.100% | 6.00% 3.00% | 94.00% 97.00% | 0.4600 |

Composited over `pf-surface-300` `#F8F7F2`, the darkest point of the forest lobe
resolves to **`#909B91`** and the brightest point of the lime lobe to
**`#E2F0A4`** at the final alpha. Both are then attenuated by the 16%/84% mask
(§1.3) near the top and bottom edges.

**The field contributes almost nothing under the copy block.** At the final state
the forest lobe's 70% stop reaches `y = 3 + 0.7 × 65.1 = **48.57%**` and the lime
lobe's reaches `y = 97 − 45.57 = **51.43%**`, so there is a ~2.9%-tall untinted
band across the vertical midline. Sampled across the copy block's box
(`x ∈ [18, 82]`, `y ∈ [34, 66]`) the worst-tinted pixel is **`#DCDED8`**, at the
top-left corner, which is a 3% shift off `#F8F7F2`. This matters for §9: the
headline's contrast problem is the opacity ramp, not the field.

### 4.3 What this looks like when it is right

A very soft forest bloom in the top-left corner and a lime bloom in the
bottom-right, both growing outward and deepening as you scroll, both feathered to
nothing at the top and bottom edges of the viewport. It should read as a change
in the *paper*, not as two coloured blobs. If you can see an edge on either lobe,
the `70%` stop has been changed or the mask is missing.

---

## 5. The copy block

### 5.1 Container, verbatim

```
position:relative;z-index:10;margin:0 auto;display:flex;width:100%;
max-width:1280px;flex-direction:column;align-items:center;gap:24px;
padding:0 20px;text-align:center
```

Tailwind: `relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center
gap-6 px-5 text-center`.

`24px` gap between the three children: `<h2>`, `<p>`, the button row.

### 5.2 Body line, verbatim

```
<p style="margin:0;font-size:18px;color:var(--pf-ink-900)">
```

> `Scope, price and send a quote in minutes — not late-night hours.`

The dash is **U+2014 with a space either side** (verified by hexdump:
`e2 80 94`). `docs/brand.md` bans em dashes in copy. RULINGS principle 3: we do
not edit the client's copy. **Ship as drawn, log** — same treatment as the three
em dashes in §05's notification senders.

No `line-height` is set, so it inherits `1.5` from `.pf-page` → our `body`.
No `max-width`, so the line runs to the copy block's 1280px cap; the sentence
measures ~470px at 18px Nunito Sans and is never near it.

### 5.3 Button row, verbatim

```
<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px">
```

**Primary**, `class="pf-btn-lime"`:

```
display:inline-flex;height:38px;width:288px;align-items:center;
justify-content:center;border-radius:12px;
background:var(--color-lime-500,#C8E84A);
box-shadow:0 8px 20px -10px rgba(21,48,31,.4);
padding:0 16px;font-size:16px;font-weight:700;
color:var(--color-forest-900,#15301F)
```

> `Get started for free`

`38px × 288px`, radius `12px`, the standard lime lift shadow. The `padding:0 16px`
is **inert** — the width is fixed and the content is centred — so drop it per
RULINGS §02 ruling 3. The fixed `288px` is D10.

```css
.pf-btn-lime{transition:filter .2s}
.pf-btn-lime:hover{filter:brightness(1.06)}
```

→ our `.btn-lime`, already in `styles/base.css`, character for character.

**Secondary**, `class="pf-shadow-border-strong"`:

```
display:inline-flex;height:38px;align-items:center;justify-content:center;
border-radius:12px;background:#fff;padding:0 20px;
font-size:16px;font-weight:700;color:var(--pf-ink-900)
```

> `Talk to our team`

`38px` tall, **width auto** (`padding:0 20px`), radius `12px`. Measured at 16px/700
Nunito Sans the label is ~130px, so the button is ~170px. `.pf-shadow-border-strong`
→ our `.shadow-border-strong`, identical.

Note the asymmetry: a fixed-width primary next to an auto-width secondary, both
38px tall, `gap:8px`. Ship as drawn.

Both are `<a href="#">`. RULINGS §01 is settled: **no real destination exists and
wiring one is out of scope.** Build both as
`<button type="button" aria-disabled="true">` behind the existing inert-control
component, exactly as the nav does. No `#` in the URL bar, keyboard-reachable,
announced honestly. Log them in the PR alongside the other inert CTAs.

Focus, per `docs/brand.md` and RULINGS "Focus styles": both sit on a light
surface → **2px forest ring**. The artboard draws none.

---

## 6. Performance

### 6.1 What the artboard actually costs, per scroll tick

Count it honestly. On **every** scroll event — and additionally every 60ms from
`setInterval(()=>this.onScroll(),60)` at line 2012, whether or not anything
scrolled — the CTA branch does:

| Work | Count |
|---|---|
| `getBoundingClientRect()` on the stage | 1 |
| `document.getElementById` | 4 (stage, tail, chips box, field) |
| `querySelectorAll` + full NodeList walk | 2 (5 words, 11 chips) |
| Inline `style.opacity` writes | 5 words + 11 chips = 16 |
| Inline `style.top` writes | 11 |
| Inline `style.left` **and** `style.right` writes | 22 |
| Inline `style.filter` writes | 11 |
| Inline `style.transform` writes | 11 |
| `style.backgroundImage` — a ~300-character string built by concatenation | 1 |
| **Total style mutations** | **72** |

Three of those categories are the expensive ones, and they are expensive for
three different reasons:

1. **`top` / `left` / `right` on eleven absolutely-positioned elements forces
   layout.** This is the worst of the three. Percentage insets are resolved
   against the containing block, so every tick dirties the chips container and
   relays out eleven boxes. Opacity and transform are compositor-only; insets are
   not. This alone is what would make the section jank on a 120Hz display.
2. **`backgroundImage` is a full-viewport repaint plus a string parse.** The
   browser tokenises ~300 characters of CSS, builds two gradient ramps, and
   rasterises them across the whole sticky child — 1440 × 900 = 1.3 megapixels at
   the harness size. Gradients are not compositable; this is main-thread raster
   work on every single frame, and it continues pointlessly for `p ∈ [0.6, 1]`
   where the value has not changed.
3. **`filter: blur()` allocates a render surface per element.** Eleven of them.
   Changing the radius re-rasterises the filtered surface. It is only non-zero
   for `p < 0.18`, but the property is written on every tick for the whole stage,
   so the eleven surfaces are never released.

And one structural problem that is not in this function at all: `onScroll` calls
`setBars()` — which **writes** `wrap.style.opacity`, `transform`, `display` —
*before* the hero block and this block call `getBoundingClientRect()`. That is a
read after a write in the same task: a **forced synchronous layout**, twice per
tick. On a page with this much absolutely-positioned content it is the difference
between a 2ms and a 12ms scroll handler.

### 6.2 Scroll listener or IntersectionObserver — and why

`use-reveal.ts` and `use-nav-theme.ts` both replaced the artboard's polling with
an IntersectionObserver, and the comments in those files explain why. **That
substitution is not available here, and it is important to say so precisely.**

An IntersectionObserver reports **threshold crossings**. It fires when a ratio
passes one of a list of values you supplied in advance, and it tells you nothing
between callbacks. The nav flip needs exactly one boundary — "is the hero's dark
region still under the nav" — so an observer is not merely adequate, it is
*better* than arithmetic, because the boundary is a real edge in the layout and
the observer watches that edge rather than a number that approximates it.

Here the value is **continuous**. `p` is consumed at full precision by eleven
chips, five words and a gradient; there is no threshold anywhere in §2–§4. To
approximate a continuous `p` with an observer you would pass a hundred
thresholds, get a hundred quantised steps, and still have no value at all between
two of them during a fast flick — the chips would visibly stair-step. It is the
wrong instrument.

**So: a scroll listener, gated by an IntersectionObserver.** The correct
division of labour is:

- An **IntersectionObserver on the stage** decides *whether the listener is
  attached at all*. That is a threshold — "is this section anywhere near the
  viewport" — and it is exactly what an observer is for. On the other ~90% of the
  page the scroll handler does not exist.
- A **`scroll` listener, `{ passive: true }`, rAF-gated**, produces the
  continuous value while the stage is in play.

The genuinely observer-shaped answer to a scroll scrub is CSS
`animation-timeline: view()` / `scroll()`, which runs the whole thing off the
main thread. As of this build it ships in Chromium only — no Safari, no Firefox
stable — and this section is the page's closing CTA, so it cannot be
progressively enhanced into existence on two of three engines. Note it in the PR
as the thing to revisit; do not build on it now.

### 6.3 How to implement it without jank

Four rules.

**(1) One rAF, and never read after write.**

```ts
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const rect = stage.getBoundingClientRect();          // all reads first
    const total = stage.offsetHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, -rect.top / total));
    if (p === last) return;                              // then the writes
    last = p;
    stage.style.setProperty("--p", String(p));
  });
};
```

Coalescing to one rAF turns N scroll events per frame into one write pass, and
the early return on an unchanged `p` removes every tick the sticky section
produces while `p` is clamped at 0 or 1.

**(2) Write one custom property, not seventy-two.**

Register it so the engine types it rather than treating it as an opaque string:

```css
@property --p {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}
```

Then every derived value is a `calc()` in static CSS, and the JS touches exactly
one property on one element:

```css
.cta-stage {
  --k-chip:  clamp(0, calc(var(--p) / 0.5), 1);
  --k-field: clamp(0, calc(var(--p) / 0.6), 1);
  --rev:     calc(clamp(0, calc((var(--p) - 0.30) / 0.42), 1) * 6);
}
```

**(3) Chips: positions in CSS, motion in `transform`.**

The chips' `top`/`left`/`right` are written **once**, as static per-chip inline
styles at their *authored* `data-top` / `data-x` values. They are never touched
again. The pull-toward-centre becomes part of the transform the element already
has, expressed in container units so the percentages still mean what they meant:

```css
#cta-chips { container-type: size; }

.cta-chip {
  /* --dx0, --dy0 are (start − final) in container percent, per chip, static. */
  transform:
    translate(calc(var(--dx0) * (1 - var(--k-chip)) * 1cqw),
              calc(var(--dy0) * (1 - var(--k-chip)) * 1cqh + var(--drift) * 1px))
    scale(calc(0.95 + 0.05 * var(--k-chip)))
    rotate(calc(var(--tilt) * 1deg));
  opacity: clamp(0, calc(var(--p) / var(--fade-at)), 1);
}
```

`1cqw` / `1cqh` are 1% of the chips container's width and height, which is
precisely what the artboard's `%` insets resolved against. **The output is
identical and the layout cost is zero.** Verify with the geometry harness at
three `p` values before accepting it; if `cqw`/`cqh` land even a subpixel off,
fall back to writing three numbers per chip in the rAF rather than going back to
`top`/`left`.

`--drift` is `calc(-46 * clamp(0, calc((var(--p) - 0.5) / 0.5), 1))`.

**(4) Blur: drop the filter, do not set it to zero.**

`filter: blur(0px)` still allocates a render surface. Gate it:

```css
.cta-chip { filter: blur(calc(4px * (1 - clamp(0, calc(var(--p) / var(--fade-at)), 1)))); }
.cta-stage[data-chips-settled="true"] .cta-chip { filter: none; }
```

and set `data-chips-settled` from the rAF once `p >= 0.18`. One attribute write,
once, and eleven render surfaces are released for the remaining 82% of the stage.

Same argument for `will-change`. The artboard's
`.pf-cta-chip{will-change:transform,opacity,filter}` is unconditional and
therefore pins eleven composited layers for the entire lifetime of the page,
including while the section is 6000px away. Apply it from the same
IntersectionObserver that attaches the listener — `will-change` on entry, removed
on exit — and list only `transform, opacity` (the filter is handled above). D7.

**(5) The field: stop rebuilding the string.**

Keep it a paint — it genuinely is one, and it cannot be reduced to a compositor
transform because the origin moves as the size grows, so no single `scale()`
about a fixed `transform-origin` reproduces it. What *can* go is the string
rebuild and the pointless work:

```css
@property --field-k { syntax: "<number>"; inherits: true; initial-value: 0 }

#cta-field {
  --fs: calc((26 + 36 * var(--field-k)) * 1%);
  --fy: calc((27.3 + 37.8 * var(--field-k)) * 1%);
  --fo: calc((32 - 26 * var(--field-k)) * 1%);
  --fa: calc(0.22 + 0.24 * var(--field-k));
  background-image:
    radial-gradient(ellipse var(--fs) var(--fy)
      at calc(100% - var(--fo)) calc(100% - var(--fo) / 2),
      rgb(200 232 74 / var(--fa)) 0%, rgb(200 232 74 / 0) 70%),
    radial-gradient(ellipse var(--fs) var(--fy)
      at var(--fo) calc(var(--fo) / 2),
      rgb(21 48 31 / var(--fa)) 0%, rgb(21 48 31 / 0) 70%);
}
```

No concatenation, no parse, and `--field-k` is clamped at 1 from `p = 0.6`
onward, so the gradient stops being invalidated for the last 40% of the stage —
**600px of scroll at 1440×900 that currently repaints 1.3 megapixels per frame
for no visual change.** Add `contain: strict` on `#cta-field` so the repaint
cannot escape the layer.

Do **not** put `will-change: background-image` on it. That promotes a
full-viewport layer and makes things worse.

**(6) Words: opacity only, already free.**

```css
.cta-word { opacity: clamp(0.22, calc(0.22 + 0.78 * (var(--rev) - var(--wi) + 0.5)), 1); }
```

with `--wi` the word index as a static inline style. Opacity on a text node is a
compositor property; five of them are free. (The `0.22` floor changes in §7 —
see §9.1.)

### 6.4 `lib/use-scroll-progress.ts`

One hook, because the hero's pinned quote needs the identical primitive and two
copies will drift:

```ts
useScrollProgress(ref, { onProgress, enabled })
```

- Returns nothing; writes through the callback.
- Attaches its `scroll` listener only while an IntersectionObserver on `ref`
  reports intersecting, with a generous `rootMargin` (`"100% 0px 100% 0px"`) so
  the first frame after entry is already correct.
- `{ passive: true }` on both `scroll` and `resize`.
- rAF-coalesced, reads before writes, early-returns on an unchanged value.
- **Does nothing at all** when `matchMedia("(prefers-reduced-motion: reduce)")`
  matches — no observer, no listener, no rAF. §7 is a pure-CSS state.
- Recomputes `total` on `resize` only, never per tick (`offsetHeight` on the
  stage is a layout read).

### 6.5 Breakpoint gating

`<CtaStage>` is `hidden desk:block`, so below 1024px it is `display:none` and
none of the CSS composes. But the **hook still runs** if it is mounted, and it
would be measuring a zero-height box. Gate it: the hook takes `enabled` and the
component passes `useMediaQuery("(min-width: 1024px)")`, or — simpler and with no
extra listener — the IntersectionObserver on a `display:none` element never
fires, so the listener is never attached. Prefer the second: it is free and it
cannot get out of sync with the CSS.

---

## 7. Reduced motion  **[Designer decision]**

The artboard has **no** `prefers-reduced-motion` rule for this section at all.
That is a hard gate per RULINGS ("Reduced motion — a hard gate, not a
nice-to-have") and principle 4 puts the brand doc in charge where the artboard is
blank. So the resting state is ours to define, and it has to satisfy three
things at once: it is what a user who asked for no motion actually gets, it is
what the comparison harness screenshots, and it is what renders before hydration
and with JavaScript off.

**The resting state is the `p = 1` frame with the drift zeroed.**

Concretely:

| Layer | Resting value |
|---|---|
| Headline line 1 | unchanged — full opacity, it never scrubs |
| All five tail words | `opacity: 1` |
| Field | `--field-k: 1` → `s` 62%, `sy` 65.1%, forest at `6% 3%`, lime at `94% 97%`, alpha `0.46` |
| Chips — position | each chip's authored `data-top` / `data-x` / `data-side`, i.e. `k = 1` |
| Chips — opacity | `1` |
| Chips — blur | `none` (not `blur(0px)`) |
| Chips — transform | `scale(1) rotate(<tilt>deg)`, **`translateY(0)`** |
| Body line, both CTAs | unchanged, fully interactive |

Why `p = 1` minus the drift, and not `p = 1` exactly:

- **A user who asked for no motion must still get the section's argument.** The
  headline only says what it means at full opacity; at the `p = 0` frame it says
  "They've got Bramble doing it." in a 1.58:1 ghost (§9.1) and the eleven chips
  are invisible. Pinning to `p = 0` would be pinning to a blank screen with half
  a sentence on it.
- **The drift is a departure transient, not a state.** `−46px` means "this stage
  is letting go"; it carries no information and it is not where anything belongs.
  Zeroing it puts every chip at exactly its authored `data-top`, which is the
  number a reader of the markup would predict.
- And that gives the property worth having: **the reduced-motion state, the
  no-JavaScript state and the server-rendered first paint are the same
  composition.** Static CSS renders the settled frame; the JS only ever *adds*
  motion by driving `--p` away from and back to it. There is no flash of an
  unstyled or half-revealed headline on a slow hydration, which the artboard's
  inline `opacity:.22` guarantees today (D5).

Ship, at the end of `styles/motion/cta-stage.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .cta-stage {
    --p: 1;
    --k-chip: 1;
    --k-field: 1;
    --rev: 6;
  }

  /* The drift is the one thing the p = 1 frame carries that we do not want. */
  .cta-chip {
    transform: scale(1) rotate(calc(var(--tilt) * 1deg));
    opacity: 1;
    filter: none;
    will-change: auto;
  }

  .cta-word {
    opacity: 1;
  }
}
```

The `--p: 1` line makes the block self-documenting: every derived value follows
from it, so nobody has to keep two sets of numbers in step.

There is no WCAG 2.2.2 residual here, unlike the marquee and the phones. Nothing
in this section animates on its own clock; every pixel of motion is the user's
own scrolling, which they are already in control of. That is worth stating in the
PR, because it is the one animated section on the page that does *not* need the
"no pause control" caveat.

---

## 8. Mobile treatment below 1024px  **[Designer decision — not a port]**

### 8.1 The problem

There is nothing to port. The mobile artboard has no CTA stage, no chips, no
field, and none of this copy. It also no longer has the band that used to sit
here: the client cut all three inline CTA sections mid-build (RULINGS, "Scope
changes from the client"), including mobile's
`Run your next job with Bramble, get started free!`. So below 1024px the page
currently goes **customer stories → testimonials → FAQ → footer** with no
mid-page conversion surface at all except the sticky bottom bar.

A 200vh pinned scroll-scrub is the wrong instrument on a phone regardless: it
fights the browser's own URL-bar collapse, it costs two full screens of scrolling
for one sentence, and `position: sticky` over a `100vh` child with a dynamic
viewport is the single most common source of jank on mobile Safari. I am not
building it.

But the section carries a real headline and two real CTAs, and the client's own
scope note names "the pinned CTA stage" as one of the page's remaining conversion
surfaces. Losing it on mobile would be a content regression, not a
simplification.

### 8.2 My decision

**A static band. No pin, no scrub, no progress value, no JavaScript.** One
section, roughly 340px tall, consistent with every other mobile band on the page.

```
section:  px-4 pb-[34px] desk:hidden
panel:    relative overflow-hidden rounded-xl bg-card px-4 pt-7 pb-6
```

`padding: 0 16px 34px` on the section and `border-radius: 12px` on the panel are
the mobile artboard's standard band geometry — it uses exactly that on eight of
its eighteen sections. White panel on the canvas beige, because `docs/brand.md`
is explicit: *"White = a thing you read or act on."* A CTA is a thing you act on.
No shadow and no border — cards carry neither; the value step is the elevation.

**The field survives, statically.** The panel carries the `p = 1` gradient,
scaled to the panel rather than the viewport, and never touched again:

```css
@media (width < 1024px) {
  .cta-band-mobile {
    background-image:
      radial-gradient(ellipse 62% 65.1% at 94% 97%,
        rgb(200 232 74 / 0.46) 0%, rgb(200 232 74 / 0) 70%),
      radial-gradient(ellipse 62% 65.1% at 6% 3%,
        rgb(21 48 31 / 0.46) 0%, rgb(21 48 31 / 0) 70%);
  }
}
```

This is the one thing that makes the two breakpoints legibly the same section
rather than two unrelated CTAs, and it costs one declaration. No mask — the panel
has a 12px radius and `overflow:hidden`, so there is no seam to dissolve.

**Contents, top to bottom, `gap: 12px`:**

1. **`<h2>`**, `.display .display-2 .display-2-mobile`, `26px`, `text-pf-ink-900`,
   `text-wrap: balance`, **both lines at full opacity**, as one string with a
   real space:

   > `The best landscapers aren't quoting at midnight. They've got Bramble doing it.`

   26px matches the mobile artboard's own `.m-h2` size, which is what every other
   mobile H2 on this page uses. `balance` rather than a hard `<br>` — RULINGS §05
   ruling 9 already made that call for the mobile before/after headline, for the
   same 320px-orphan reason.

2. **Body line**, `14.5px / 1.55`, `text-pf-ink-900`, the desktop copy verbatim
   including its em dash:

   > `Scope, price and send a quote in minutes — not late-night hours.`

   14.5px is the mobile artboard's body size. Carrying the desktop copy across is
   a port of copy, not an invention — there is no mobile wording to preserve, so
   RULINGS §02 ruling 12's "preserve both" does not apply.

3. **Two CTAs, stacked, full width, `gap: 10px`.** Both `h-[52px] rounded-xl
   text-[16.5px] font-bold`:

   - Primary: `bg-lime-500 text-forest-900`, shadow
     `0 8px 20px -10px rgb(21 48 31 / 0.5)` — copy `Get started for free`.
   - Secondary: `bg-card text-pf-ink-900` with `.shadow-border-strong` — copy
     `Talk to our team`.

   `52px`, `12px`, `16.5px/700` and the stacked-with-10px-gap arrangement are
   lifted directly from the mobile hero's own CTA pair
   (`Try Bramble free` / `Book a demo`, lines 118–121 of the mobile artboard), so
   this band's buttons are the same object the user already met at the top of the
   page. Full width solves D10 for free: the desktop's fixed `288px` would
   overflow a 320px viewport at these gutters.

   Both inert, as `<button type="button" aria-disabled="true">`, same as desktop.

4. **Three chips**, static, `aria-hidden="true"`, a centred wrapped row with
   `gap: 8px`, `margin-top: 4px`: **`Ridgeline`**, **`BuildRight`**,
   **`Coastal Gardens`** — the three shortest labels, one from each of the
   non-`forest-500` disc colours (`lime-500`, `forest-700`, `lime-500` → swap
   `BuildRight`'s to keep all three distinct: `lime-500`, `forest-700`,
   `forest-900`; see §9.3 for why `forest-500` is excluded everywhere).

   Same shell as desktop — 36px pill, `rounded-full`, white, 28px disc,
   `11px/800` initials, `14px/700` label — and **with `.sticker` intact**, because
   on mobile nothing overwrites `filter` (D1 is a desktop-only defect). So the
   chips get the white keyline and the drop shadow the desktop ones lose, which
   is also what makes a white pill legible on a white panel.

   I am keeping three rather than zero because they are the only thing in the
   band that says *other landscapers already do this*, and I am keeping three
   rather than eleven because eleven wrapped pills on a 288px measure is five
   rows of visual noise under the button the band exists to get pressed.

### 8.3 Placement and clearance

The band goes where the desktop stage goes in document order — **after customer
stories, before testimonials** — so the two breakpoints have the same outline and
the same heading sequence. Below it, keep the mobile page's standard `34px` and
remember the sticky bottom bar (`50px` button + `11px`/`14px` padding + the
caption row ≈ **96px**) overlays the last screen: RULINGS §01 ruling 5 requires
enough bottom clearance that the bar never obscures content, and the FAQ follows
this band, so the constraint is already satisfied. Verify it anyway at 320px.

### 8.4 What is deliberately lost

Say it plainly in the PR. Mobile does not get: the pin, the scrub, the word
reveal, the chip spread, the drift, the growing field, or eight of the eleven
company names. It gets the headline, the line, both CTAs and the section's colour
identity. That is the whole of the argument and none of the choreography, which
is the right trade on a phone.

---

## 9. Accessibility

### 9.1 The scrubbed headline — measured, not estimated

All ratios computed against the actual composited pixel: `--pf-ink-900`
`oklch(23% 0.002 98)` = **`#1D1D1C`**, `--pf-surface-300` `oklch(97.5% 0.007 96)`
= **`#F8F7F2`**, with the gradient field evaluated at the sample point and the
16%/84% mask applied.

**`.pf-h2` is 48px at ≥1024px, so the applicable threshold is WCAG 1.4.3's
large-text 3.0:1, not 4.5:1.** (It is 40px at 768–1023 and 32px at <768; all
three are ≥24px, so the threshold is 3.0 at every width. Our build only renders
it at ≥1024 anyway.)

Text-on-background, ink at partial opacity over `#F8F7F2`:

| Word opacity | Composited text | Ratio | 3.0 (AA large) | 4.5 (AA normal) |
|---|---|---|---|---|
| **0.220** (the authored floor) | `#C8C7C3` | **1.58** | **fail** | fail |
| 0.300 | `#B6B5B1` | 1.90 | fail | fail |
| 0.400 | `#A0A09C` | 2.45 | fail | fail |
| **0.475** | — | **3.00** | **threshold** | fail |
| 0.500 | `#8B8A87` | 3.22 | pass | fail |
| **0.610** (word 0's rest value) | `#75746F`ish | **4.49** | pass | fail by 0.01 |
| 0.700 | `#5F5E5C` | 6.02 | pass | pass |
| 1.000 | `#1D1D1C` | **15.72** | pass | pass |

Against the **worst-tinted** background anywhere under the copy block
(`#DCDED8`, the top-left corner of the block at `p = 1`) the thresholds move to
opacity **0.495** for 3.0 and **0.640** for 4.5 — a 2–5% shift. The field is not
the problem.

**So there is a real contrast failure, and it is large.** At the authored floor of
`0.22` the tail words measure **1.58:1**, which is not merely below AA — it is
below the 1.4.11 non-text threshold as well. Mapping opacity back to scroll
position, each word clears 3.0:1 at:

| Word | clears 3.0:1 at `p` | fails from | for |
|---|---|---|---|
| 0 `They've` | (0.288 — before the window opens; it renders at 0.610 from `p = 0`) | — | never fails once JS runs |
| 1 `got` | **0.358** | `p = 0` | 35.8% of the stage |
| 2 `Bramble` | **0.428** | `p = 0` | 42.8% |
| 3 `doing` | **0.498** | `p = 0` | 49.8% |
| 4 `it.` | **0.568** | `p = 0` | **56.8%** |

At 1440×900 that is **852px of scroll during which the word `it.` is at 1.58:1**,
and the whole of the pre-roll — a further full viewport before `p` leaves 0 —
on top of it. This is not a transient.

**Recommendation: raise the floor from `0.22` to `0.50`, keep the ceiling at 1.**

The ramp becomes `opacity = 0.50 + 0.50 · t`. `0.495` is the measured minimum
that clears 3.0:1 against the worst background under the copy block; `0.50` is
that rounded up to a number a human will not mistype. This is exactly the
client's established preference — *"correct contrast failures with the smallest
change that clears the threshold"* (RULINGS, "Contrast — fix all four") — and it
is one coefficient, in one place.

It does cost something and the client should be told what: the ghost is less
ghostly. The reveal still reads clearly, because the *contrast between* a
revealed and an unrevealed word is what carries it and that is still a 2× step in
opacity, but the unrevealed words are legible grey rather than a whisper.

**Escalate with these numbers; do not ship the change unilaterally.** It is a
visible authoring change to a headline, and RULINGS principle 2 puts visual
authoring choices with the client. If they decline, the residual failure is
theirs with the measurement on record. Note also that §7's resting state is
unaffected either way — under reduced motion every word is at 1.000 / 15.72:1.

Related, and not optional: the inline `opacity:.22` in the SSR markup means the
**first paint** of the whole tail is at 1.58:1 until hydration. §7's approach
fixes this for free, because static CSS renders the settled frame and the JS only
drives motion away from it. Do that regardless of the ruling on the floor.

### 9.2 The chips, and the dead sticker filter

The chip labels are `--pf-ink-900` on `#FFFFFF`: **16.89:1**. Fine.

What is not fine is the chip *edge*. With `.pf-sticker` dead (D1), a white pill
on `pf-surface-300` has a boundary contrast of **1.07:1**. Over the deepest part
of the forest lobe it reaches 2.88:1 and over the lime lobe 1.22:1 — but the
field contributes nothing at the vertical midline (§4.2), which is exactly where
chips 0–5 sit. For most of the layer, the pills are **invisible white shapes on a
near-white page, distinguishable only by the text and the disc inside them**.

This is a 1.4.11 (non-text contrast) question only if the chips are meaningful UI
— they are not, they are decoration (§9.4) — so it is a design question, not a
compliance one. But it is the reason the section looks flat in a screenshot, and
the engineer will notice it immediately and assume they made a mistake.

Ruling needed. My recommendation: **reproduce the render, and put the fix in
front of the client.**

- Reproduce: drop `.sticker` from the markup entirely, because it does nothing —
  RULINGS §02 ruling 3 and §03/04 ruling 9, both of which deleted an inert class
  rather than "restoring" its intent.
- Recommend: keep the keyline by composing both filters in the one property,
  which is a one-line change and visually identical to what the author plainly
  meant:

  ```css
  .cta-chip {
    filter: blur(var(--chip-blur))
      drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff)
      drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff)
      drop-shadow(0 12px 24px #00000059);
  }
  ```

  (Note this makes §6.3's "drop the filter once settled" invalid — with the
  keyline restored the filter is permanent. That is a real cost: eleven render
  surfaces for the life of the section. Mention it when escalating.)

Mobile (§8) keeps the keyline either way, because nothing overwrites `filter`
there.

### 9.3 Chip disc contrast — a real AA failure

The initials are `11px / 800` — small text, so the threshold is 4.5:1.

| Disc colour | Fg | Ratio | 4.5 | Chips |
|---|---|---|---|---|
| `forest-900` `#15301F` | `#fff` | **14.24** | pass | 0, 5, 10 |
| `forest-700` `#2C5539` | `#fff` | **8.52** | pass | 2, 7 |
| **`forest-500` `#4D8F6C`** | `#fff` | **3.85** | **fail** | **4 `EO`, 9 `FS`** |
| `lime-500` `#C8E84A` | `#15301F` | **10.24** | pass | 1, 3, 6, 8 |

Two of eleven fail. `forest-500` is not a text-bearing fill anywhere else in the
brand system — it is a mid-tone used for fills and markers — and the smallest
change that clears the threshold is to move those two discs to **`forest-700`
`#2C5539` (8.52:1)**, which is already in use on two other chips, so the palette
of the layer does not change at all.

Same escalation as §9.1, same precedent. Note that if the chips are
`aria-hidden="true"` (§9.4) they are still *visible* text, so 1.4.3 applies
regardless of what the accessibility tree says — the "incidental" exemption does
not cover live text that a sighted reader will read.

### 9.4 What reaches a screen reader  **[Designer decision]**

**Recommendation: the entire `#cta-chips` layer is `aria-hidden="true"`.
Everything else is fully readable.**

What stays: the `<h2>` (both lines), the body line, both buttons. That is the
whole of the section's content — four strings, and they say exactly what the
section means.

What collapses to nothing: eleven fictional company names.

The reasoning, both ways:

- **Against reading them.** They are not information. They are a texture that
  says "a lot of businesses" and a sighted reader takes that in as a shape, never
  reading `Bluestone Co.`. Serialised, they are eleven invented proper nouns
  interposed between a headline and its two buttons — the worst possible place to
  put filler. Worse, `opacity` and `filter` do not remove an element from the
  accessibility tree, so at `p = 0` a virtual cursor would read out eleven chips
  that are at `opacity: 0.000` and invisible on screen. That is the same hazard
  §05 §8.1 identified on the notification cards, and it is real.
- **Against `role="img"` + a label**, which is what §05 chose for the phones:
  there the device *was* the metaphor and "same phone, two mornings" was genuine
  information a reader would otherwise lose. Here there is no metaphor to
  preserve. The page has already made the social-proof argument twice, with real
  named customers, in §04 and in the customer-stories band — this layer is
  decorative repetition of a point already carried by readable text. RULINGS §02
  took the same view of the hero's float stack ("the entire `.pf-float-stack` is
  `aria-hidden` … decorative repetition"), and this is the closer analogy.

Mechanics:

- `aria-hidden="true"` on `#cta-chips`, once. Not on each chip.
- The field already carries `aria-hidden="true"` in the source. Keep it.
- **Exactly one `<h2>`.** Do not promote anything else. The document outline runs
  unbroken from customer stories to testimonials.
- **Zero decorative tab stops.** The only two focusable things are the CTAs.
- Focus rings: 2px forest, both buttons (light surface). The artboard draws none;
  `docs/brand.md` governs where the artboard is blank (principle 4).

### 9.5 The missing word spaces — D3, and it is a real defect

There is **no whitespace of any kind** between the five word spans, or between
line 1's span and the tail span. The `<h2>`'s text content is literally:

```
The best landscapers aren't quoting at midnight.They'vegotBrambledoingit.
```

That is what a screen reader announces, what the clipboard receives, and what any
crawler or `aria-label` computation gets. It renders correctly only because
`column-gap:.3em` on a flex container puts 14.4px between items. **Fix it**: put a
real space between each pair of spans, and a space (or a `<br>` — line 1 is
`display:block` so it breaks regardless) between line 1 and the tail.

Whitespace-only text between flex items does not generate an anonymous flex item,
so **this changes nothing visually**. Verify that in the geometry harness anyway
— one word of extra measure would be visible at 48px.

### 9.6 Everything else, measured

| Element | Colour | On | Ratio | Needs | |
|---|---|---|---|---|---|
| Headline line 1, 48px | `#1D1D1C` | `#F8F7F2` | **15.72** | 3.0 | pass |
| Headline line 1, worst tint | `#1D1D1C` | `#DCDED8` | **12.50** | 3.0 | pass |
| Tail words, revealed | `#1D1D1C` | `#F8F7F2` | **15.72** | 3.0 | pass |
| **Tail words, floor** | `#1D1D1C` @ .22 | `#F8F7F2` | **1.58** | 3.0 | **fail** — §9.1 |
| Body line, 18px | `#1D1D1C` | `#F8F7F2` | **15.72** | 4.5 | pass |
| Primary CTA label, 16px/700 | `#15301F` | `#C8E84A` | **10.24** | 4.5 | pass |
| Secondary CTA label, 16px/700 | `#1D1D1C` | `#FFFFFF` | **16.89** | 4.5 | pass |
| Secondary CTA hairline | `pf-ink-300` `#D8D6CE` | `#F8F7F2` | **1.35** | 3.0 | fail (non-text) |
| Chip label, 14px/700 | `#1D1D1C` | `#FFFFFF` | **16.89** | 4.5 | pass |
| Chip disc initials | see §9.3 | | | | 2 of 11 fail |
| Chip pill edge | `#FFFFFF` | `#F8F7F2` | **1.07** | 3.0 | see §9.2 |

The secondary CTA's hairline at 1.35:1 is a 1.4.11 miss on a real control. It is
`.shadow-border-strong`, which is used on ~two dozen surfaces across the page and
was accepted in sections 01–05, so **do not change it here** — that would be a
page-wide brand change made in one section. Note it once, in the PR, with this
number, as a page-wide observation. The button is not identified by its hairline
alone: it is a white fill on a beige page with a five-layer shadow under it, and
1.4.11 asks about the *boundary of the component*, which the shadow stack
provides.

---

## 10. Defects in the source — flagged, not fixed

Except D3, D8, D14 and D15, which have existing RULINGS precedent or are hard
gates.

| # | Finding | Recommendation |
|---|---|---|
| **D1** | `.pf-sticker`'s five `drop-shadow()`s are **completely destroyed** by the inline `filter:blur(Npx)` that `ctaChips` writes on every tick — including at `blur(0.00px)`. All eleven chips render with no white keyline and no shadow, i.e. as 1.07:1 white pills on a near-white page | **Reproduce the render**, drop the inert `.sticker` from our markup (§02 ruling 3, §03/04 ruling 9 precedent). **Escalate** the one-line composed-filter fix in §9.2 with the note that it makes the filter permanent. This is the section's biggest open visual question. |
| D2 | `margin:0 auto` on `#pf-cta-chips` is inert — auto margins do not resolve on an abspos box with `left:auto;right:auto`. Above 1920px the layer is centred only because the parent flex container resolves its static position | Write it honestly as `inset-x-0 mx-auto`, which is identical below 1920 and correct above it. Log as an observation. |
| **D3** | **No whitespace between the five word spans or between the two headline lines.** Text content reads `midnight.They'vegotBrambledoingit.` — that is what a screen reader says and what the clipboard gets | **Fix.** Insert real spaces. Whitespace-only text does not become a flex item, so the render is unchanged. §9.5. |
| D4 | The reveal window is authored as `0.30 → 0.72` but the last word reaches opacity 1 at **`p = 0.615`**, because `tot + 1 = 6` with a half-step head start. **38.5% of the stage — 578px at 1440×900 — has a completely static headline** | Flag. The chips' drift (`p: 0.5 → 1`) is what occupies that stretch, so it is not dead scroll. Ship as drawn. |
| D5 | `t = clamp(rev − (i − 0.5))` gives word 0 a 0.5 head start, so it renders at **0.610**, never at its inline `opacity:.22`. The `.22` is visible only in the pre-hydration frame | Note. §7's static-CSS resting state removes the flash. |
| D6 | Chip 7 `Terra Firma` (`data-x="48" data-side="left" data-top="66"`) settles **48% from the left, 66% down** — directly behind the CTA button row, a white pill tangent to a white button | Flag. The copy block's `z-index:10` means nothing is obscured. Look at it in the visual diff. |
| D7 | `.pf-cta-chip{will-change:transform,opacity,filter}` is unconditional: eleven composited layers pinned for the whole page lifetime, including while the section is 6000px away | **Fix** per §6.3 — apply and remove from the IntersectionObserver, and list `transform, opacity` only. A performance defect, RULINGS principle 2. |
| **D8** | Straight apostrophes (U+0027) in `aren't` and `They've` | **Fix** — normalise to U+2019. §02 ruling 10. Typographic, not editorial. |
| D9 | The body line uses a spaced em dash (U+2014); `docs/brand.md` bans em dashes in copy | **Keep.** Client copy, principle 3. Flag for their call, same as §05's three em dashes. |
| D10 | Primary CTA carries both `width:288px` and `padding:0 16px`. The padding is inert, and 288px + 2×20px gutters overflows below 328px | Drop the inert padding (§02 ruling 3). The width is moot on desktop and solved by §8's full-width mobile buttons. Log. |
| D11 | Both CTAs are `<a href="#">` | Build as `<button type="button" aria-disabled="true">`, per RULINGS §01. No destination exists and wiring one is out of scope. **Log** with the other inert CTAs. |
| D12 | `text-wrap:balance` on the `<h2>` is half-inert: it balances line 1 but has no effect on the tail, which is a flex container | Ship as drawn — it is doing real work on line 1. Note only. |
| D13 | `border-radius:9999px` on 36px pills and 28px discs | → `rounded-full`. Identical output, clearer code. §02 ruling 6 precedent. |
| **D14** | **No `prefers-reduced-motion` rule anywhere for this section**, and no natural resting state to fall back to — with JS off, the tail renders at `opacity:.22` and all eleven chips at `opacity:0` | **Fix.** Hard gate. §7. Principle 4 — the artboard is blank, so the brand doc governs. |
| **D15** | `onScroll` calls `setBars()`, which **writes** three inline styles, before this block **reads** `getBoundingClientRect()` — a forced synchronous layout, twice per tick. Compounded by the `setInterval(…, 60)` that runs the whole handler whether or not anything scrolled | **Fix** by construction. Our hook is rAF-coalesced, reads before writes, and has no interval. §6.3. |
| D16 | The field rebuilds a ~300-character `background-image` string every tick, including for `p ∈ [0.6, 1]` where the value cannot change — a 1.3-megapixel main-thread repaint per frame for 600px of scroll, for nothing | **Fix** — clamp `--field-k` and short-circuit. §6.3(5). |
| D17 | `#pf-cta-chips` has `overflow:hidden` with no mask, so a chip crossing the 100vh edge would hard-clip rather than fade, unlike the field | Note only. Measured: no chip clips at any `p` — the extreme is chip 10 at `top:80%` with a 36px height and a −46px drift, comfortably inside. Re-check if any `data-top` ever changes. |
| D18 | Two chip discs use `forest-500` with white 11px/800 initials: **3.85:1**, fails AA | **Escalate** with §9.3's numbers. Recommended minimal fix: those two discs → `forest-700` `#2C5539` (8.52:1), a colour already on the layer. |
| D19 | The tail words' floor opacity of `0.22` measures **1.58:1** and is on screen for up to 56.8% of the stage plus the entire pre-roll | **Escalate** with §9.1's table. Recommended minimal fix: floor `0.22 → 0.50`. |
| D20 | `height:calc(200vh + 600px)` uses `vh`, not `dvh`/`svh` | Keep. Identical on desktop, and the composition never renders below 1024px. |

---

## 11. QA checklist

### Structure

- [ ] Two components, `hidden desk:block` and `desk:hidden`. Neither is hidden
      with `opacity-0` or `sr-only`.
- [ ] Stage: `relative h-[calc(200vh+600px)]`; sticky child
      `sticky top-0 flex h-screen items-center justify-center overflow-hidden`.
- [ ] Three layers in this DOM order: field, chips, copy block. Copy block is
      `relative z-10`.
- [ ] Field carries **both** `mask-image` and `-webkit-mask-image`, four stops,
      `transparent 0% / #000 16% / #000 84% / transparent 100%`.
- [ ] Chips container is `inset-x-0 mx-auto max-w-[1920px] h-screen overflow-hidden`
      (D2), with `container-type: size` if §6.3(3) is used.
- [ ] Exactly one `<h2>`. Document outline unbroken from customer stories.
- [ ] All eleven chips come from one `content/cta-stage.ts`.
- [ ] `styles/motion/cta-stage.css` contains **no** `@media (min-width: …)` —
      only the reduced-motion block, and it is last.

### Copy — character for character

- [ ] Headline line 1: `The best landscapers aren’t quoting at midnight.`
- [ ] Tail, five spans in order: `They’ve` `got` `Bramble` `doing` `it.`
- [ ] Both apostrophes are U+2019 (D8). Grep the section for U+0027; zero hits.
- [ ] `h2.textContent` contains real spaces — `midnight. They’ve got Bramble
      doing it.` — and **not** `midnight.They’vegotBrambledoingit.` (D3). Assert
      it in a test; it is invisible in a screenshot.
- [ ] Body line: `Scope, price and send a quote in minutes — not late-night hours.`
      with U+2014 and a space either side (D9).
- [ ] CTA labels: `Get started for free`, `Talk to our team`.
- [ ] All eleven chip names and initials match §3.3, including the literal `&`
      in `Occo Landscapers & Builders`, `Elm & Oak`, `Fern & Stone`, and the full
      stop in `Bluestone Co.`

### Geometry

- [ ] `<h2>` computes to 48px Fraunces at ≥1024, `wght 420 / SOFT 100 / WONK 0 /
      opsz 10`.
- [ ] Tail `column-gap` computes to **14.4px** at 48px.
- [ ] Chip pill measures **36px** tall; disc **28×28**; label 14px/700.
- [ ] Primary CTA **38 × 288px**, radius 12px. Secondary **38px** tall, auto
      width (~170px), radius 12px, `gap: 8px` between them.
- [ ] Copy block `gap: 24px`, `max-width: 1280px`, `padding: 0 20px`.
- [ ] Scrub length: at 1440×900, `stage.offsetHeight − innerHeight` = **1500px**.
      At 1440×1080, **1680px**.

### The scrub — freeze `p`

Drive it directly rather than scrolling, so the values are exact:

```js
const stage = document.querySelector('[data-cta-stage]');
const setP = p => stage.style.setProperty('--p', String(p));
// or, to test the real derivation:
const total = stage.offsetHeight - innerHeight;
const scrollToP = p => scrollTo(0, stage.offsetTop + p * total);
```

At 1440×900, `scrollTop = stage.offsetTop + p × 1500`.

- [ ] `p = 0.000` — chips all at `opacity 0.000`, `blur(4.00px)`, `scale(0.950)`,
      `translateY(0)`. Field at `s 26% / 27.3%`, forest at `32% 16%`, lime at
      `68% 84%`, alpha `0.2200`. Tail at its floor (0.610 / .22 ×4 as authored,
      or 1.000 / 0.500 ×4 if D19 is accepted).
- [ ] `p = 0.030` — the eleven chip opacities form a smooth ramp
      `0.500, 0.417, 0.357, 0.312, 0.278, 0.250, 0.227, 0.208, 0.192, 0.179,
      0.167`. Any two equal values means the `fadeAt` index term is missing.
- [ ] `p = 0.060` — **chip 0 exactly `opacity 1.000`, `blur(0.00px)`.**
- [ ] `p = 0.108` — chip 4 `Elm & Oak` reaches 1.000.
- [ ] `p = 0.180` — **all eleven at 1.000 and zero blur.** Nothing is still
      fading past this point.
- [ ] `p = 0.300` — the reveal window opens. `rev = 0`. Tail unchanged from
      `p = 0`; word 1 `got` has not moved.
- [ ] `p = 0.335` — `They've` reaches 1.000, `got` starts leaving the floor.
- [ ] `p = 0.405` / `0.475` / `0.545` — `got` / `Bramble` / `doing` each reach
      1.000. Exactly one word is mid-fade at each of these.
- [ ] `p = 0.500` — **the settle point.** Every chip's `top` equals its
      `data-top` and its `left`/`right` equals its `data-x`; `scale(1.000)`;
      `translateY(0.0px)`. Nothing has drifted yet. This is the single most
      important frame in the section.
- [ ] `p = 0.568` — `it.` clears 3.0:1 (§9.1).
- [ ] `p = 0.600` — **the field reaches final state**: `s 62% / 65.1%`, forest at
      `6% 3%`, lime at `94% 97%`, alpha `0.4600`. It must not change again.
- [ ] `p = 0.615` — **the headline is complete.** All five words at 1.000.
- [ ] `p = 0.720` — nothing has changed since 0.615 except drift (D4).
- [ ] `p = 0.750` — `translateY(-23.0px)` on all eleven.
- [ ] `p = 1.000` — `translateY(-46.0px)`. Positions, scale, opacity and field
      all unchanged from 0.6.
- [ ] Scrub **backwards** through the whole range. Every value above must be
      reproduced exactly; the section has no hysteresis and no state.
- [ ] The tilt never changes: eleven fixed rotations, `-6 3 -2 2 -3 6 -6 3 -2 6 -3`.

### Performance

- [ ] Chrome DevTools Performance, scroll the whole stage at 1440×900: **zero
      `Layout` events** attributed to the chips. If `top`/`left`/`right` are
      still being written per tick, this will not hold.
- [ ] The scroll handler is `{ passive: true }` and rAF-coalesced: no more than
      one write pass per frame under a fast flick.
- [ ] No `getBoundingClientRect()` call happens after any style write in the same
      task (D15). Check for "Forced reflow" warnings in the console.
- [ ] `--field-k` stops changing at `p = 0.6`; confirm no `Paint` on `#cta-field`
      for `p ∈ [0.61, 1]` (D16).
- [ ] `will-change` is absent on the chips when the section is off screen (D7).
- [ ] Zero `setInterval` anywhere in the section.
- [ ] The scroll listener is **not attached** when the stage is off screen, and
      **never attached** below 1024px or under reduced motion.
- [ ] Long-task check: no task over 50ms while scrolling the stage.

### Reduced motion

- [ ] With `prefers-reduced-motion: reduce`, the hook attaches nothing — no
      observer, no listener, no rAF.
- [ ] All five tail words at `opacity: 1`. **This is the fastest way to spot a
      broken port.**
- [ ] All eleven chips visible, `opacity: 1`, `filter: none` (not `blur(0px)`),
      `transform: scale(1) rotate(<tilt>deg)` with **no `translateY`**.
- [ ] Every chip's computed `top` equals its `data-top`% and its inset equals its
      `data-x`% on the correct side.
- [ ] Field at the `p = 0.6` final state, mask intact.
- [ ] Both CTAs present, focusable and focus-ringed.
- [ ] Screenshot this state and confirm it is the live `p = 1` frame with the
      46px drift removed, and nothing else.

### No JavaScript / first paint

- [ ] Disable JS. The section renders the **same composition** as the
      reduced-motion state. No `opacity: 0` chips, no ghosted headline (D5, D14).
- [ ] Throttle to Slow 3G and watch the first paint: the headline must never
      appear at the `.22` floor and then jump.

### Accessibility

- [ ] `#cta-chips` is `aria-hidden="true"`; the field is `aria-hidden="true"`.
      No `aria-hidden=""` anywhere (§03/04 ruling 7).
- [ ] The section adds **exactly two** tab stops, both CTAs, both
      `<button type="button" aria-disabled="true">`.
- [ ] Focus ring is 2px forest on both.
- [ ] VoiceOver reads: heading → body line → `Get started for free` →
      `Talk to our team`. **No company name is announced.**
- [ ] Scrub to `p = 0` and traverse with a virtual cursor: no invisible chip is
      read out.
- [ ] axe clean at 1024, 1280 and 1440px, in both motion preferences.
- [ ] Contrast spot-checks against §9.6. Specifically: the two `forest-500` discs
      measure **3.85:1** (D18) and the tail floor measures **1.58:1** (D19) — both
      are escalations, and QA must not silently "fix" either.

### Mobile (§8) — my design, so check it against this document, not the artboard

- [ ] `<CtaBandMobile>` is `desk:hidden` and sits between customer stories and
      testimonials, matching the desktop document order.
- [ ] Section `px-4 pb-[34px]`; panel `rounded-xl bg-card pt-7 px-4 pb-6`, no
      shadow, no border.
- [ ] Panel carries the static two-lobe gradient at the `p = 1` values, no mask.
- [ ] H2 at 26px, `.display-2-mobile` axes, `text-wrap: balance`, both sentences
      in one string with a real space, full opacity.
- [ ] Body line 14.5px / 1.55.
- [ ] Two stacked full-width CTAs, `h-[52px] rounded-xl text-[16.5px] font-bold`,
      `gap: 10px`. Neither overflows at 320px.
- [ ] Three chips only — `Ridgeline`, `BuildRight`, `Coastal Gardens` — wrapped,
      centred, `gap: 8px`, `aria-hidden="true"`, **with `.sticker` applied and
      rendering** (D1 is desktop-only).
- [ ] No chip disc uses `forest-500`.
- [ ] **Zero JavaScript**: no scroll listener, no rAF, no `--p`, at any width
      below 1024.
- [ ] 320 / 430 / 768 / 1023px: no horizontal overflow, no orphaned word in the
      H2, panel content readable throughout.
- [ ] 1023 → 1024px: the composition swaps whole. There is no width at which a
      chip scrubs and no width at which a partial reveal is visible.
- [ ] The sticky bottom bar (≈96px) does not obscure the band at 320px.
