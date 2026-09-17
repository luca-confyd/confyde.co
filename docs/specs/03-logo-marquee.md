# 03 — Logo marquee

Source of truth for this section:

- Desktop (≥1024px): `Bramble Home Web.dc.html`, `<!-- LOGO MARQUEE -->`,
  lines 495–514. CSS in the `<helmet>` `<style>` block: `@keyframes pf-marquee`
  / `.pf-marquee-track` / `.pf-marquee:hover` at lines 251–253, `.pf-mq` at
  lines 267–268, `.pf-h4` at line 32.
- Mobile (<1024px): `Bramble Home Mobile.dc.html`, lines 129–142. CSS:
  `.m-h3` line 89, `.m-eyebrow` line 90, `.m-scroll` lines 91–92,
  `@keyframes m-marquee` / `.m-mq-track` / its reduced-motion block lines 94–96.

Everything below is transcribed from those two files. Where the artboard writes
`--pf-*` / `--m-*` variables, the project token that replaces it is named in
brackets. Where I have had to invent behaviour the artboards do not contain
(the 320→1023px range), it is called out under **[Designer decision]**.

**Breakpoint rule:** `desk` = 1024px. Below it the mobile artboard's strip runs,
at and above it the desktop artboard's. These are two different compositions —
different heading copy, a different number of terms, a different duration, a
different mask and a different overflow mechanism. Ship them as two subtrees
(`hidden desk:block` / `desk:hidden`), not one that reflows.

---

## 1. Where this section sits

**Desktop.** The marquee is **not** a top-level band. It is the second and last
child of the same `<section class="pf-shadow-border-strong">` that wraps
`#hero-panel` (spec 02 §1.1), so it renders **on `--pf-surface-500`
[`bg-pf-surface-500`], inside the hero's shadow-border card**, above the
card's bottom hairline. Do not lift it out into its own band on
`pf-surface-300` — the surface tone and the enclosing hairline would both
change.

```
<section class="shadow-border-strong bg-pf-surface-500">   ← from spec 02
  <div id="hero-panel"> … </div>                           ← spec 02
  <section class="marquee"> … </section>                   ← THIS FILE
</section>
```

**Mobile.** A standalone `<section>` immediately after the hero section, on the
page background `--m-bg` `#F3F0E6` [`canvas`]. No card, no hairline.

---

## 2. Desktop (≥1024px)

### 2.1 Wrapper chain, verbatim

Outer section:

```html
<section class="pf-marquee" style="margin:0 auto;display:flex;width:100%;max-width:1440px;flex-direction:column;align-items:center;gap:20px;overflow:hidden;padding:32px 0 24px">
```

| Property | Value | Project mapping |
|---|---|---|
| `max-width` | `1440px` | `max-w-[1440px]` — note this is **wider** than the 1280px content container used by every other band |
| layout | `flex; flex-direction:column; align-items:center; gap:20px` | `flex flex-col items-center gap-5` |
| `padding` | `32px 0 24px` | `pt-8 pb-6` |
| `overflow` | `hidden` | see §2.6 defect 3 — redundant with the inner clipper |
| `margin` | `0 auto` | `mx-auto` |

Heading wrapper:

```html
<div style="margin:0 auto;display:flex;width:100%;max-width:1280px;flex-direction:column;align-items:center;padding:0 16px">
```

`max-w-[1280px] mx-auto w-full flex flex-col items-center px-4`.

The artboard then has an **empty text node / blank line** where a sub-line was
presumably removed (line 499). Do not port it.

Clipper + mask:

```html
<div class="pf-marquee" style="position:relative;width:100%;overflow:hidden;-webkit-mask-image:linear-gradient(to right,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(to right,transparent,#000 10%,#000 90%,transparent)">
```

Track:

```html
<div class="pf-marquee-track" style="display:flex;width:max-content;gap:80px">
```

Two children, both `display:flex; flex-shrink:0; align-items:center; gap:80px`.
The second carries `aria-hidden="true"`.

### 2.2 Heading copy, verbatim

> AI Software for Exceptional Landscapers. Build a bigger business, in half the time.

Marked up in the artboard as:

```html
<h4 class="pf-h4" style="color:var(--pf-ink-900);text-align:center">
```

| Artboard | Value | Project mapping |
|---|---|---|
| `.pf-h4` family | `var(--font-fraunces), Georgia, serif` | `--font-display` |
| `.pf-h4` axes | `"wght" 420,"SOFT" 100,"WONK" 0,"opsz" 10` | exactly what `.display` applies at ≥1024px |
| `.pf-h4` size | `1.25rem / 1.25 / -.01em` | `.display-4` (no 768/1024 step on `display-4`) |
| `font-weight` | `400` | `.display` at ≥1024 |
| colour | `var(--pf-ink-900)` | `text-pf-ink-900` |
| align | `center` | `text-center` |

So: `class="display display-4 text-center text-pf-ink-900"`. No extra
`font-variation-settings` override is needed — `.display` at `desk` already
matches `.pf-h4` axis for axis.

**Element:** ship as `<h2>`, not `<h4>`. See §5 defect 1.

### 2.3 The thirteen terms, in order, verbatim

Each is `<span class="pf-mq">`. Ampersands are `&amp;` in the source; the
rendered character is `&`.

1. `Hardscapes`
2. `Paving & Stone`
3. `Retaining Walls`
4. `Decking`
5. `Outdoor Kitchens`
6. `Pools & Water`
7. `Irrigation`
8. `Lighting`
9. `Turf & Gardens`
10. `Planting & Softscapes`
11. `Fencing`
12. `Carpentry`
13. `Nursery`

The second `<div data-track="1" aria-hidden="true">` repeats all thirteen in the
same order, identical markup.

### 2.4 `.pf-mq` type styling, verbatim

```css
.pf-mq{font-family:var(--font-fraunces),serif;font-variation-settings:"wght" 500,"SOFT" 60,"opsz" 40;font-size:26px;line-height:1.3;color:var(--pf-ink-400);white-space:nowrap}
@media(min-width:768px){.pf-mq{font-size:30px}}
```

| Artboard | Project mapping |
|---|---|
| `var(--font-fraunces),serif` | `--font-display` |
| `"wght" 500,"SOFT" 60,"opsz" 40` | **no existing utility matches.** `.display` is `420/100/0/10` at ≥1024 and `600/60/40` below it. This needs its own rule. |
| `font-size:26px` → `30px` @768 | see below |
| `line-height:1.3` | `leading-[1.3]` |
| `color:var(--pf-ink-400)` | `text-pf-ink-400` |
| `white-space:nowrap` | `whitespace-nowrap` |

Because `.pf-mq` is not one of `.pf-h1`…`.pf-h5`, it inherits `font-weight:400`
from `.pf-page` and the `wght` axis is driven **only** by
`font-variation-settings`. In our build set both, so the fallback face and the
variable face agree:

```css
/* styles/base.css, @layer components */
.marquee-term {
  font-family: var(--font-display);
  font-weight: 500;
  font-variation-settings: "wght" 500, "SOFT" 60, "opsz" 40;
  font-size: 30px;
  line-height: 1.3;
  white-space: nowrap;
}
```

**The 768px step is dead code in our build.** `.pf-mq` renders 26px from 0–767px
and 30px from 768px up, but the desktop composition only ever runs at ≥1024px,
so **30px is the only size this class ever renders at on our page**. Per RULINGS
principle 1 ("reproduce the rendered result, delete the inert branch"), ship the
class at a flat `30px` and drop the media query. Recorded here so the 26px value
is not lost: it is the value the desktop artboard would show at ≤767px, a width
our desktop subtree never occupies.

### 2.5 The animation

```css
@keyframes pf-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.pf-marquee-track{animation:pf-marquee 60s linear infinite;will-change:transform}
.pf-marquee:hover .pf-marquee-track{animation-play-state:paused}
```

- Duration **60s**, timing **`linear`**, `infinite`. Verified against the source;
  no delay, no fill mode.
- `will-change:transform` is on the track.
- Pause on hover via `animation-play-state:paused`.

**Why the duplicate track exists.** `translateX(-50%)` is a percentage of the
**animated element's own border box**. The track is `width:max-content`, so its
box is the full run of terms. Translating it by half its own width only produces
a seamless loop if the second half is a pixel-identical copy of the first half —
at the moment the animation snaps from the `to` frame back to the `from` frame,
the glyphs that were sitting under the viewport must be the same glyphs that
reappear. One track alone would translate off-screen and leave a gap; two
identical tracks mean the frame at `-50%` is visually indistinguishable from the
frame at `0`. That is the whole mechanism, and it is why the duplicate must be
byte-identical to the original and must not be reordered, shortened or
de-duplicated for "cleanliness".

**It does not currently close.** See §5 defect 2 — the outer `gap:80px` breaks
the identity the `-50%` relies on. Read that before implementing.

### 2.6 The edge mask

```css
-webkit-mask-image:linear-gradient(to right,transparent,#000 10%,#000 90%,transparent);
        mask-image:linear-gradient(to right,transparent,#000 10%,#000 90%,transparent);
```

Both the prefixed and unprefixed properties are present on desktop. Applied to
the clipper `<div>`, which is `position:relative;width:100%;overflow:hidden`.

The fade runs over the **first and last 10%** of the clipper's width. Note the
clipper is 100% of the 1440px section, i.e. up to 1440px wide, so each fade is
up to 144px — a much softer edge than mobile's.

---

## 3. Mobile (<1024px)

### 3.1 Wrapper chain, verbatim

```html
<section style="padding:26px 0 30px">
  <h4 class="m-h3" style="margin:0 20px 14px;text-align:center;font-size:17px;color:var(--m-ink)">…</h4>
  <div class="m-scroll" style="mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)">
    <div class="m-mq-track">
      <span style="display:flex;gap:28px"> … 7 terms … </span>
      <span style="display:flex;gap:28px"> … 7 terms … </span>
    </div>
  </div>
</section>
```

| Property | Value | Project mapping |
|---|---|---|
| section padding | `26px 0 30px` | `pt-[26px] pb-[30px]` — full-bleed horizontally |
| heading margin | `0 20px 14px` | `mx-5 mb-[14px]` — **20px**, not the 16px used by section 04 |
| `.m-scroll` | `overflow-x:auto;scrollbar-width:none;` + `::-webkit-scrollbar{display:none}` | `overflow-x-auto no-scrollbar` |
| track | `display:flex;width:max-content;gap:28px` | `flex w-max gap-7` |

### 3.2 Heading copy, verbatim

> AI Software Built for Exceptional Landscapers

**Different copy from desktop.** Mobile adds "Built", drops the second sentence
("Build a bigger business, in half the time.") and drops the full stop. Per
RULINGS principle 3 and the §02 precedent (rulings 12–14), **preserve both and
log** — this is the client's copy, in two different moments.

| Artboard | Value | Project mapping |
|---|---|---|
| `.m-h3` family | `'Fraunces',Georgia,serif` | `--font-display` |
| `.m-h3` axes | `'wght' 600,'SOFT' 60,'opsz' 24` | **does not match `.display` below 1024**, which is `600/60/40`. `opsz` differs. Needs an override. |
| `.m-h3` line-height | `1.2` | matches `.display-3` |
| `.m-h3` letter-spacing | *(none set)* | `.display-3` sets `-0.018em`. **Differs.** |
| `font-size` (inline) | `17px` | `text-[17px]` |
| colour | `var(--m-ink)` `#16321E` | `text-ink` |
| align | `center` | `text-center` |

So `.display .display-3` is **not** a clean mapping here: it would apply
`opsz 40` and `letter-spacing:-0.018em` that the artboard does not. Ship a local
class:

```css
.marquee-heading-mobile {           /* mobile artboard .m-h3 */
  font-family: var(--font-display);
  font-weight: 600;
  font-variation-settings: "wght" 600, "SOFT" 60, "opsz" 24;
  line-height: 1.2;
  letter-spacing: normal;
}
```

**Element:** ship as `<h2>`, not `<h4>`. See §5 defect 1.

### 3.3 The seven terms, in order, verbatim

Each is `<span class="m-h3" style="font-size:19px;white-space:nowrap;color:var(--m-ink-400)">`.

1. `Hardscapes`
2. `Paving & Stone`
3. `Retaining Walls`
4. `Decking`
5. `Outdoor Kitchens`
6. `Irrigation`
7. `Lighting`

**Mobile drops six of the desktop thirteen:** `Pools & Water`,
`Turf & Gardens`, `Planting & Softscapes`, `Fencing`, `Carpentry`, `Nursery`.
It also **reorders relative to desktop only by omission** — the seven that
survive are in the same relative order as on desktop. Preserve both lists; do
not unify. Log.

| Artboard | Project mapping |
|---|---|
| `.m-h3` axes | `"wght" 600,"SOFT" 60,"opsz" 24` — same local class as §3.2, different size |
| `font-size:19px` | `text-[19px]` |
| `color:var(--m-ink-400)` `#8A9082` | `text-slate-400` |
| `white-space:nowrap` | `whitespace-nowrap` |

Note mobile's terms use **different axes and a different colour** from desktop's
(`600/60/24` @ `slate-400` vs `500/60/40` @ `pf-ink-400`). Two separate classes.

### 3.4 The animation

```css
@keyframes m-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.m-mq-track{display:flex;width:max-content;gap:28px;animation:m-marquee 26s linear infinite}
@media(prefers-reduced-motion:reduce){.m-mq-track{animation:none}}
```

- Duration **26s**, timing **`linear`**, `infinite`. Verified.
- Same keyframe shape as desktop, same duplicated-track mechanism (§2.5), same
  half-gap defect (§5 defect 2), here **14px** instead of 40px.
- **No `will-change`** (desktop has it).
- **No pause on hover** — correct for touch, and the strip is manually
  scrollable instead (`.m-scroll` is `overflow-x:auto`). See §5 defect 5.
- **Has** a reduced-motion rule. Desktop does not.

Speed, for reference: mobile's period is roughly 900px over 26s ≈ 35px/s;
desktop's is roughly 3300px over 60s ≈ 55px/s. Both are authored values; do not
"harmonise" them.

### 3.5 The edge mask

```css
mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)
```

**Differs from desktop in two ways:**

1. The fade stops are **8% / 92%**, not 10% / 90%. On a 430px column that is a
   ~34px fade per edge; desktop's is up to 144px.
2. **No `-webkit-mask-image`.** Desktop declares both. Add the prefixed
   property in our build for parity with every other masked surface on the page
   and for older iOS Safari — this is a port completeness fix, not a design
   change. See §5 defect 6.

---

## 4. The 320→1023px fluid behaviour  **[Designer decision]**

The mobile artboard is a fixed 430px column with zero media queries. Below is
how those numbers behave across the real range. Everything not listed stays at
its artboard px value.

**Full bleed, always.** The strip itself is edge-to-edge at every width and gets
no side padding and no max-width. That is the point of a marquee: it must read
as running off both edges of the screen. This one needs no content column, and
capping it at 560px (as §7 of spec 02 does for the hero copy) would be wrong
here — it would turn a bleeding strip into a boxed widget.

**Heading side margin.** `20px` from 320px, stepping to `32px` at ≥640px, i.e.
`margin-inline: 20px` + `@media (width >= 640px) { margin-inline: 32px }`. This
matches the hero's gutter step exactly (spec 02 §7) so the heading's left edge
aligns with the hero copy above it at every width. Note that the *social proof*
section below uses a 16px gutter (spec 04 §4) — that 4px step between the two
sections is in the artboard and is preserved; see spec 04 §5.

**Heading max-width.** `max-width: 560px; margin-inline: auto` **in addition to**
the gutter above, so the rule is `margin-inline:auto; max-width:560px;
padding-inline:20px` (32px at ≥640px). Reasoning: at 1000px wide a centred
17px heading running edge to edge has no relationship to anything, and 560px is
the content measure spec 02 §7 already established for this range.

**Term size.** Fixed at `19px` at every width below 1024. Reasoning: the terms
are a texture, not a headline. Scaling them fluidly would make the loop period
change with viewport width, which would in turn make the fixed `26s` duration
read at a different speed on a 320px phone than on a 1000px tablet. Holding the
size holds the speed. At 1024px the desktop composition takes over whole and the
terms jump 19px → 30px in one step, which is correct — they are two different
compositions.

**Heading size.** Fixed at `17px`. Same reasoning; it is a label, not a display
line, and it is already comfortable at 320px.

**Gap.** Fixed at `28px`. Same reasoning as term size — the gap is half the
loop's rhythm and changing it changes the perceived speed.

**Duration.** Fixed at `26s`. Because size and gap are both fixed, the track's
width is fixed, so a fixed duration gives a fixed px/s at every width in the
range. This is the whole reason the three values above are pinned.

**Mask stops.** Fixed at `8% / 92%`. Percentage stops already scale with the
viewport; at 320px that is a 26px fade, at 1000px an 80px fade. Both read
correctly.

**At exactly 1024px** the desktop marquee takes over whole: different heading
copy, 13 terms, 30px, 80px gap, 60s, 10%/90% mask, hover-pause, and it moves
inside the hero's `shadow-border-strong` card onto `pf-surface-500`. There is no
intermediate composition.

---

## 5. Defects in the source

Flagged, not fixed. Each needs a ruling before the build changes it.

1. **Heading level skip, both artboards.** Desktop marks the marquee heading
   `<h4>` immediately after the hero's `<h1>` (h1 → h4). Mobile marks it `<h4>`
   *before* the social proof `<h2>` that follows it, so the document outline
   goes h1 → h4 → h2. Both are WCAG 1.3.1 / 2.4.6 failures and both are
   authoring artefacts of a visual tool, not design intent — the class does the
   visual work, the tag does none of it. **Recommend: ship `<h2>` on both, keep
   `.pf-h4` / `.m-h3` sizing verbatim.** Zero visual change, so principle 1 is
   not engaged. Classed as a functional defect under principle 2 (missing/wrong
   semantics), same family as the missing-ARIA calls in §01.

2. **The `-50%` loop does not close — a visible jump every cycle. Both
   artboards.** The track's `width:max-content` box is `A + g + A`, where `A` is
   one copy's width and `g` is the **outer** gap between the two copies.
   `translateX(-50%)` therefore moves `A + g/2`. For a seamless loop it must
   move `A + g` — the distance from the first term of copy 1 to the first term
   of copy 2. The shortfall is exactly `g/2`:

   - Desktop: `g = 80px` → the strip snaps back **40px** every 60s.
   - Mobile: `g = 28px` → the strip snaps back **14px** every 26s.

   Because the inner gap is also `g`, the *rendered spacing* is perfectly even —
   which is why this is easy to miss in a static screenshot and unmissable in
   motion. This is a dead/broken animation, not a visual authoring choice, so I
   read it as falling under principle 2 ("dead animations … are bugs").

   **Recommended fix, no visual change at rest:** set the outer track's
   `gap: 0` and give each copy a trailing gap instead —
   `.marquee-copy { display:flex; gap:80px; padding-right:80px }` (28px on
   mobile). The box becomes `2 × (A + g)`, `-50%` lands exactly on `A + g`, and
   every term spacing including the seam stays 80px. **Tech lead's call** — the
   alternative reading is that the 40px hitch is "in the render" and ships as
   drawn under principle 1. I do not recommend that: a 40px snap on a 55px/s
   strip is a three-quarter-second discontinuity, and the visual-diff harness
   will settle both sides to the reduced-motion resting state anyway, so
   fixing it costs nothing at the gate.

3. **Desktop has no `prefers-reduced-motion` rule.** `.pf-marquee-track` is an
   infinite `linear` animation with no reduced-motion block anywhere in the web
   artboard's `<style>` (the block at line 191 covers `.pf-logo-track`, a
   different class). Mobile has one. RULINGS calls this a **hard gate**:
   "An infinite loop with no reduced-motion rule … fails QA outright."
   **Fix**, in `styles/motion/marquee.css`, pinned to a defined resting state:

   ```css
   @media (prefers-reduced-motion: reduce) {
     .marquee-track { animation: none !important; transform: none !important; }
   }
   ```

   `transform: none` (not just `animation: none`) is what makes the resting
   frame deterministic for the comparison harness.

4. **Mobile's duplicate track is not hidden from assistive tech.** Desktop's is:
   `<div data-track="1" aria-hidden="true">`. Mobile's second `<span>` has no
   `aria-hidden`, so a screen reader announces all seven terms twice. **Fix** —
   missing ARIA is named as a bug in principle 2, and desktop already shows the
   intended treatment.

   The whole strip should additionally be a single labelled region rather than
   14 loose spans. **Recommend:** wrap the clipper in
   `<div role="list" aria-label="Trades Confyde covers">` with each *visible*
   term as `role="listitem"`, and put `aria-hidden="true"` on the entire
   duplicate copy so it contributes nothing to the list. Marked as an addition,
   not a port — the artboard does not draw it.

5. **WCAG 2.2.2 (Pause, Stop, Hide) is not satisfied on either artboard.** The
   strip starts automatically, runs well past 5 seconds, loops indefinitely and
   sits in parallel with other content, so it needs a mechanism to pause it.

   - Desktop has `:hover` pause only — **not keyboard reachable**, and
     unavailable on touch.
   - Mobile has no pause at all. `overflow-x:auto` lets a user drag it, but
     dragging does not stop the animation, so it is not a pause mechanism. It
     also creates a **keyboard-inaccessible scroll container** (WCAG 2.1.1) —
     a scrollable region with no focusable content needs `tabindex="0"` and an
     accessible name.

   `prefers-reduced-motion` is a related but **separate** obligation (2.3.3 /
   our own gate) and does not discharge 2.2.2, which must work for a user who
   has not set that preference.

   **Recommendation, smallest honest thing:** add
   `:focus-within` to the desktop pause selector
   (`.marquee:hover .marquee-track, .marquee:focus-within .marquee-track
   { animation-play-state: paused }`), apply the same rule on mobile, and give
   the mobile clipper `tabindex="0"` with an `aria-label`, which makes it both
   keyboard-scrollable and keyboard-pausable in one move. **Tech lead's call**
   on whether that is sufficient or whether a visible pause control is
   required; a visible control is not drawn on either artboard and I would not
   invent one without a ruling (cf. the §01 ruling 5 precedent on the missing
   dismiss control).

6. **Mobile omits `-webkit-mask-image`.** Desktop declares both properties;
   mobile declares only the unprefixed one. Directly parallel to §01 ruling 6
   (`-webkit-backdrop-filter` on the mobile bottom bar) — **fix**, same class of
   omission, same platform at risk.

7. **Term contrast fails AA on both artboards.**
   - Desktop: `--pf-ink-400` `oklch(71.4% 0.009 98)` on `--pf-surface-500`
     `oklch(96.3% 0.012 96)` ≈ **2.0:1**. At 30px Fraunces 500 this is large
     text, which still needs 3:1.
   - Mobile: `#8A9082` [`slate-400`] on `#F3F0E6` [`canvas`] ≈ **2.9:1**. At
     19px weight 600 this is (just) large text; 3:1 required.

   Both are deliberate "recede into the background" greys and both are real
   text, not decoration — WCAG 1.4.3 applies. **Design/brand call.** The
   cheapest compliant move is one step darker (`slate-500` `#6E7669` reaches
   ~4.3:1 on canvas); I am not applying it unilaterally because it changes the
   rendered image and principle 1 is engaged.

8. **Desktop's `:hover` pause selector over-matches.** The class `pf-marquee` is
   on *both* the outer `<section>` and the inner clipper, and the rule is
   `.pf-marquee:hover .pf-marquee-track`. So hovering anywhere in the section —
   including the heading and the 32px of padding above it — pauses the strip.
   Probably harmless, possibly intended, but it is not what the class name
   implies. **Recommend** scoping the pause to the clipper only, unless the lead
   prefers the larger hover target (which is arguably kinder). Flagged, not
   fixed.

9. **Desktop declares `overflow:hidden` twice.** The outer `<section>` and the
   inner clipper both have it. The inner one is load-bearing; the outer one is
   inert given the inner clip. Drop the outer per principle 1's corollary
   ("delete the inert class so the code says what it does"). Observation, not a
   fix.

10. **Empty text node in the desktop heading wrapper** (line 499), where a
    sub-line appears to have been deleted. Do not port. Observation only — but
    worth confirming with the client that no second line is missing from the
    desktop heading block, since mobile's heading is also shorter.

11. **The strip carries no logos.** The section is called a logo marquee in the
    source comment and in every internal reference, but it renders thirteen
    *trade categories* as type. Not a defect — naming only. Keep the component
    name `LogoMarquee` for continuity with the comment, or rename to
    `TradesMarquee`; either is fine, but pick one and use it in both the
    component and the spec index.

---

## 6. QA checklist

### Structure

- [ ] Desktop marquee renders **inside** `section.shadow-border-strong.bg-pf-surface-500`,
      as the sibling after `#hero-panel` — not as its own band.
- [ ] Desktop outer section is `max-w-[1440px]`, not 1280.
- [ ] Desktop heading wrapper is `max-w-[1280px]` with `px-4`.
- [ ] Mobile section is full-bleed; only the heading is inset.
- [ ] Exactly one marquee subtree is in the DOM at any width (`hidden desk:block`
      / `desk:hidden`), never both.
- [ ] Heading renders as `<h2>` at both widths; document outline is
      h1 → h2 → h2 with no skip (per §5 defect 1's ruling).

### Copy

- [ ] Desktop heading is exactly
      `AI Software for Exceptional Landscapers. Build a bigger business, in half the time.`
      — both sentences, trailing full stop present.
- [ ] Mobile heading is exactly `AI Software Built for Exceptional Landscapers`
      — includes "Built", no trailing full stop.
- [ ] Desktop lists **13** terms in the order given in §2.3.
- [ ] Mobile lists **7** terms in the order given in §3.3 and does **not**
      include `Pools & Water`, `Turf & Gardens`, `Planting & Softscapes`,
      `Fencing`, `Carpentry` or `Nursery`.
- [ ] Ampersands render as `&`, not `&amp;` or `and`.
- [ ] The duplicate copy is byte-identical to the original at both widths.

### Type

- [ ] Desktop heading computes to Fraunces, `wght 420 / SOFT 100 / WONK 0 /
      opsz 10`, 20px, line-height 1.25, letter-spacing -0.01em, `pf-ink-900`.
- [ ] Desktop terms compute to Fraunces, `wght 500 / SOFT 60 / opsz 40`,
      **30px** at every desktop width, line-height 1.3, `pf-ink-400`, nowrap.
- [ ] The 26px `.pf-mq` branch is **not** present in our CSS (dead below 1024).
- [ ] Mobile heading computes to Fraunces, `wght 600 / SOFT 60 / opsz 24`, 17px,
      line-height 1.2, **letter-spacing `normal`** (not `.display-3`'s -0.018em),
      `ink`.
- [ ] Mobile terms compute to Fraunces, `wght 600 / SOFT 60 / opsz 24`, 19px,
      `slate-400`, nowrap.
- [ ] No term wraps at any width.

### Motion

- [ ] Desktop track: `translateX(0) → translateX(-50%)`, **60s**, **linear**,
      **infinite**.
- [ ] Mobile track: `translateX(0) → translateX(-50%)`, **26s**, **linear**,
      **infinite**.
- [ ] Screen-record 90s of the desktop strip and 40s of the mobile strip: **no
      positional jump at the loop seam** (§5 defect 2). Term spacing at the seam
      measures 80px desktop / 28px mobile, identical to every other gap.
- [ ] Hovering the desktop strip pauses it; moving off resumes it from where it
      paused (not from 0).
- [ ] Tabbing into the strip pauses it (if §5 defect 5's recommendation is
      accepted).
- [ ] `will-change:transform` is on the desktop track.

### Masks

- [ ] Desktop clipper carries **both** `mask-image` and `-webkit-mask-image`,
      stops `transparent, #000 10%, #000 90%, transparent`, `to right`.
- [ ] Mobile clipper carries **both** (prefix added per §5 defect 6), stops
      `transparent, #000 8%, #000 92%, transparent`, `to right`.
- [ ] Terms are fully invisible at both viewport edges — no hard clip visible.

### Accessibility

- [ ] The duplicate copy is `aria-hidden="true"` at **both** widths.
- [ ] A screen reader announces each of the 13 (desktop) / 7 (mobile) terms
      exactly **once**.
- [ ] The mobile clipper is keyboard-scrollable (`tabindex="0"` + accessible
      name) — no keyboard trap, and arrow keys scroll it.
- [ ] WCAG 2.2.2: a keyboard-only user can pause the strip without setting an OS
      preference (per the accepted §5 defect 5 recommendation).
- [ ] Contrast measurements from §5 defect 7 are recorded in `PULL_REQUEST.md`
      with the brand call attached.

### Reduced motion

- [ ] `styles/motion/marquee.css` exists and ends with a
      `@media (prefers-reduced-motion: reduce)` block.
- [ ] With the preference set, **both** tracks have `animation: none` **and**
      `transform: none`, and settle at `translateX(0)` — the first term flush to
      the left edge of the clipper, behind the mask fade.
- [ ] The resting frame is byte-stable across two consecutive harness runs.

### Fluid range (designer decisions, §4)

- [ ] At 320px: strip is full-bleed, heading inset 20px, terms 19px, gap 28px.
- [ ] At 430px: matches the mobile artboard exactly.
- [ ] At 640px: heading gutter has stepped to 32px; term size, gap and duration
      are unchanged.
- [ ] At 1000px: heading is capped at 560px and centred; strip still bleeds to
      both edges.
- [ ] At 1023px → 1024px: the composition swaps whole — heading copy changes,
      term count goes 7 → 13, size 19px → 30px, gap 28 → 80, duration 26s → 60s,
      mask 8/92 → 10/90, and the strip moves onto `pf-surface-500` inside the
      hero card.
- [ ] Measured px/s of the mobile strip is the same at 320px and at 1000px
      (the point of pinning size, gap and duration).
