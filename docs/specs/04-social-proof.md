# 04 — Social proof

Source of truth for this section:

- Desktop (≥1024px): `Bramble Home Web.dc.html`,
  `<!-- ===== SOCIAL PROOF ===== -->`, lines 516–577. CSS in the `<helmet>`
  `<style>` block: `.pf-h2` line 31, `.pf-page` line 30.
- Mobile (<1024px): `Bramble Home Mobile.dc.html`, `<!-- SOCIAL PROOF -->`,
  lines 143–182. CSS: `.m-h2` line 87, `.m-eyebrow` line 90.

Everything below is transcribed from those two files. Where the artboard writes
`--pf-*` / `--m-*` / `--color-*` variables, the project token that replaces it is
named in brackets. Where I have had to invent behaviour the artboards do not
contain (the 320→1023px range), it is called out under **[Designer decision]**.

**Breakpoint rule:** `desk` = 1024px. Unlike the hero and the marquee, the two
artboards draw the *same composition* here — heading block, four photo cards,
two accreditation pills — at two different scales, with three genuine structural
differences: the grid definition, the pill row axis, and the reveal animations
(desktop has them, mobile has none). This one can be built as a single component
with `desk:` forks. Ship it that way; do not duplicate the four card records.

---

## 1. Band wrapper

**Desktop**

```html
<section style="margin:0 auto;width:100%;max-width:1280px;padding:96px 24px 96px">
```

`mx-auto w-full max-w-[1280px] px-6 py-24`. No background — the band sits
directly on the page's `--pf-surface-300` [`bg-pf-surface-300`], set by
`.pf-page`. It is the first band *after* the hero's `shadow-border-strong` card
closes, so it is the first thing on the raw page surface.

**Mobile**

```html
<section style="padding:34px 16px 34px">
```

`px-4 py-[34px]`. Sits on `--m-bg` `#F3F0E6` [`canvas`].

Note the two page surfaces differ: `pf-surface-300` is `oklch(97.5% 0.007 96)`,
essentially off-white; `canvas` is `#F3F0E6`, a real beige. This is why the
mobile cards need a shadow to separate and the desktop cards do not have one.
See §5 defect 2.

---

## 2. Heading block

### 2.1 Copy, verbatim — identical on both artboards

Eyebrow:

> Built with the landscaping community

Heading:

> Landscapers & designers who stand behind Bramble.

(`&amp;` in both sources; the rendered character is `&`. Trailing full stop is
present on both.)

### 2.2 Desktop

```html
<div data-anim="up-blur" data-duration="0.5" class="pf-anim-idle"
     style="display:flex;flex-direction:column;align-items:center;gap:12px;margin:0 auto 32px;max-width:640px;text-align:center">
  <span style="font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--pf-lime-500)">Built with the landscaping community</span>
  <h2 class="pf-h2" style="margin:0;color:var(--pf-ink-900);text-wrap:balance">Landscapers &amp; designers who stand behind Bramble.</h2>
</div>
```

| Artboard | Value | Project mapping |
|---|---|---|
| wrapper | `flex flex-col items-center gap-12px max-w-640 mx-auto mb-32 text-center` | `flex flex-col items-center gap-3 mx-auto mb-8 max-w-[640px] text-center` |
| reveal | `data-anim="up-blur" data-duration="0.5"` | `<Reveal anim="up-blur" duration={0.5}>` |
| eyebrow family | *(inherited)* Nunito Sans | `--font-body` |
| eyebrow size/weight/tracking | `12px / 800 / .14em / uppercase` | **`.eyebrow` does not match** — it is `0.78125rem` (12.5px) / `700`. See §5 defect 7. Ship `text-[12px] font-extrabold tracking-[.14em] uppercase font-body`. |
| eyebrow colour | `var(--pf-lime-500)` `#95B225` | `text-lime-700` (the codebase inverts the artboard's lime naming — see `globals.css`) |
| `.pf-h2` family/axes | Fraunces, `wght 420 / SOFT 100 / WONK 0 / opsz 10`, weight 400 | exactly `.display` at ≥1024px |
| `.pf-h2` metrics @≥1024 | `3rem / 1.2 / -.008em` | exactly `.display-2` at ≥1024px |
| heading colour | `var(--pf-ink-900)` `oklch(23% 0.002 98)` | `text-pf-ink-900` — **not** `ink`. See §5 defect 5. |
| `text-wrap` | `balance` | `text-balance` |

So the desktop heading is `class="display display-2 text-pf-ink-900 text-balance"`
with no axis overrides.

### 2.3 Mobile

```html
<div class="m-eyebrow" style="text-align:center;color:#7E9A2B">Built with the landscaping community</div>
<h2 class="m-h2" style="margin:10px 0 18px;text-align:center;font-size:26px;color:var(--m-ink)">Landscapers &amp; designers who stand behind Bramble.</h2>
```

| Artboard | Value | Project mapping |
|---|---|---|
| reveal | *(none)* | no `<Reveal>` below 1024. See §5 defect 1. |
| `.m-eyebrow` | Nunito, `11px / 700 / .14em / uppercase` | again **not** `.eyebrow`. Ship `text-[11px] font-bold tracking-[.14em] uppercase font-body`. |
| eyebrow colour | `#7E9A2B` | **no token matches.** Nearest is `lime-700` `#95B225`, which desktop uses for the same words. See §5 defect 4. |
| `.m-h2` family | `'Fraunces',Georgia,serif` | `--font-display` |
| `.m-h2` axes | `'wght' 600,'SOFT' 60,'opsz' 32` | **`.display` below 1024 is `600/60/40`.** `opsz` differs. |
| `.m-h2` line-height | `1.14` | `.display-2` is `1.2`. Differs. |
| `.m-h2` letter-spacing | `-.005em` | `.display-2` is `-.008em`. Differs. |
| size | `26px` | `text-[26px]` |
| margin | `10px 0 18px` | `mt-[10px] mb-[18px]` |
| colour | `var(--m-ink)` `#16321E` | `text-ink` |
| `text-wrap` | *(none — mobile does not balance)* | do not add `text-balance` below 1024 |

`.display .display-2` is not a clean mapping on mobile. Ship a local class
alongside it:

```css
/* styles/base.css, @layer components — mobile artboard .m-h2 */
.display-2-mobile {
  font-variation-settings: "wght" 600, "SOFT" 60, "opsz" 32;
  line-height: 1.14;
  letter-spacing: -0.005em;
}
@media (width >= 1024px) {
  .display-2-mobile { font-variation-settings: revert; line-height: revert; letter-spacing: revert; }
}
```

---

## 3. The four cards

### 3.1 Grid

**Desktop — verified:**

```css
display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
```

`grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]`.

Column-count arithmetic across the whole desktop range (content width
`C = min(100vw, 1280px) − 48px`, gap 16px):

| Viewport | `C` | tracks that fit | filled columns | **card width** |
|---|---|---|---|---|
| 1024px | 976px | 4 (`4×220 + 3×16 = 928 ≤ 976`) | 4 | **232px** |
| 1212px | 1164px | 5 — the 5th is empty and `auto-fit` collapses it | 4 | **279px** |
| ≥1280px | 1232px | 5, one collapsed | 4 | **296px** |

So **`auto-fit` never actually reflows on this page** — there are exactly four
items and at least four tracks fit at every desktop width, so it is always 4
across and the card width is continuous: `(min(100vw, 1280px) − 96px) / 4`,
running 232px → 296px. This matters for §3.6.

The `minmax(220px, 1fr)` would only break to 2×2 below 976px viewport, which is
below our breakpoint and therefore unreachable. Ship the declaration verbatim
anyway — it is what the artboard renders and it is harmless — but do not design
around a 2×2 desktop state that cannot occur.

**Mobile — verified:**

```css
display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px;
```

`grid grid-cols-2 gap-3`. A hard 2-column grid, **not** `auto-fit`. At the
430px artboard width each card is `(430 − 32 − 12) / 2 = 193px`.

### 3.2 Card shell

**Desktop, verbatim:**

```html
<div data-anim="up-blur" data-duration="0.5" class="pf-anim-idle"
     style="position:relative;display:flex;flex-direction:column;overflow:hidden;border-radius:12px;background:#fff">
```

`relative flex flex-col overflow-hidden rounded-xl bg-card` +
`<Reveal anim="up-blur" duration={0.5}>`.

**No shadow. No border.** Brand-correct ("Cards carry no border and no shadow").

**Mobile, verbatim:**

```html
<div style="display:flex;flex-direction:column;overflow:hidden;border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(21,48,31,.05),0 6px 14px -6px rgba(21,48,31,.14)">
```

`flex flex-col overflow-hidden rounded-xl bg-card` +
`shadow-[0_1px_2px_rgb(21_48_31/0.05),0_6px_14px_-6px_rgb(21_48_31/0.14)]`.

`rgba(21,48,31,…)` is `--color-forest-900` `#15301F` at 5% and 14%. It is not
one of the four `.shadow-border-*` recipes and does not approximate any of them
— it is a two-layer warm drop shadow, and porting it to `.shadow-border-subtle`
would add a hairline the artboard does not draw and change the blur stack. Ship
the literal value as a local utility:

```css
/* Mobile testimonial card. Not a .shadow-border-* recipe — two layers, no hairline. */
.shadow-card-mobile {
  box-shadow:
    0 1px 2px rgb(21 48 31 / 0.05),
    0 6px 14px -6px rgb(21 48 31 / 0.14);
}
```

Applied below 1024 only. **The desktop card must have no `box-shadow` at all** —
this is a real difference between the artboards, not a rounding error. See §5
defect 2.

`position:relative` is on the desktop card and absent on mobile; nothing is
positioned against it. Drop it (RULINGS principle 1 corollary — delete the inert
declaration). Observation, not a fix.

`border-radius:12px` = `--radius-xl`, brand-correct for a card. `overflow:hidden`
is load-bearing: it is what clips the photo to the card's top corners.

### 3.3 Photo block

Identical structure on both artboards:

```html
<div style="position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--color-card-muted,#E6E0CC)">
  <img src="assets/photo-1.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
</div>
```

Mobile writes the background as `var(--m-muted)`, same `#E6E0CC`.

| Artboard | Project mapping |
|---|---|
| `aspect-ratio:4/3` | `aspect-[4/3]` |
| `background: #E6E0CC` | `bg-card-muted` — the placeholder tone behind the image while it loads |
| `position:relative` + `overflow:hidden` | `relative overflow-hidden` |
| `<img>` absolutely filling, `object-fit:cover` | `<Image fill className="object-cover" />` |

`alt=""` on all four. **Correct and deliberate** — the person is named in text
immediately below, so the photo is decorative. Keep `alt=""`; do not invent
descriptions.

No `object-position` is set, so the crop is centred. The source files do not
match 4:3, so every one is cropped:

| File | Intrinsic | Ratio | Crop into 4:3 |
|---|---|---|---|
| `photo-1.webp` | 1536 × 1024 | 3:2 | sides trimmed |
| `photo-2.webp` | 1402 × 1122 | 5:4 | top/bottom trimmed |
| `photo-3.webp` | 1402 × 1122 | 5:4 | top/bottom trimmed |
| `photo-4.webp` | 1536 × 1022 | 3:2 | sides trimmed |

Eyeball each against the artboard at review; if a subject's head is clipped, the
fix is a per-card `object-position`, not a different crop of the asset.

### 3.4 Meta row

**Desktop, verbatim:**

```html
<div style="display:flex;align-items:center;gap:12px;padding:14px 16px 16px">
```

`flex items-center gap-3 pt-[14px] px-4 pb-4`.

**Mobile, verbatim:**

```html
<div style="display:flex;align-items:center;gap:10px;padding:11px 12px 13px">
```

`flex items-center gap-[10px] pt-[11px] px-3 pb-[13px]`.

### 3.5 Avatar

**Desktop, verbatim:**

```html
<span aria-hidden="" style="display:grid;place-items:center;flex:none;height:40px;width:40px;border-radius:9999px;background:var(--color-forest-700,#2C5539);font-family:var(--font-sans);font-size:13px;font-weight:700;color:#fff;box-shadow:0 0 0 3px #fff">AR</span>
```

**Mobile, verbatim:**

```html
<span aria-hidden="" style="display:grid;place-items:center;flex:none;height:34px;width:34px;border-radius:9999px;background:var(--m-forest-700);font-size:12px;font-weight:700;color:#fff">AR</span>
```

| | Desktop | Mobile | Project mapping |
|---|---|---|---|
| size | `40 × 40` | `34 × 34` | `size-10` / `size-[34px]` |
| radius | `9999px` | `9999px` | `rounded-full` |
| background | `#2C5539` | `#2C5539` | `bg-forest-700` |
| family | `var(--font-sans)` → **Hanken Grotesk** | *(inherited)* **Nunito Sans** | see §5 defect 3 |
| size / weight | `13px / 700` | `12px / 700` | `text-[13px] font-bold` / `text-[12px] font-bold` |
| colour | `#fff` | `#fff` | `text-white` |
| **ring** | `box-shadow: 0 0 0 3px #fff` | *(none)* | see below |
| layout | `display:grid;place-items:center;flex:none` | same | `grid place-items-center flex-none` |

**The 3px white ring is inert.** `box-shadow: 0 0 0 3px #fff` draws white on the
card's own `#fff` background, in a row where nothing overlaps the avatar — the
avatar sits inside the meta row, not straddling the photo edge. It produces zero
rendered pixels. This is the same situation as §02 ruling 3 (`.shadow-overlay`
dead on the float cards): **reproduce the rendered result, drop the declaration
from our markup so the code says what it does, and log it as an observation.**
It reads like a leftover from an earlier layout in which the avatar overlapped
the photograph — worth asking the client whether that overlap was the intent,
because if it was, this is a missing design, not a dead property. Flagged; the
tech lead rules.

Initials, in card order: `AR`, `HP`, `O`, `DN`. Note the third is a **single
character** — check it stays optically centred in a 40px and a 34px circle.

`aria-hidden=""` is on every avatar on both artboards. See §5 defect 6.

### 3.6 The four landscapers, verbatim

Order is identical on both artboards. Note the photo sequence is **1, 3, 2, 4** —
not sequential. Preserve it.

| # | Photo | Initials | Name | Organisation |
|---|---|---|---|---|
| 1 | `photo-1.webp` | `AR` | `Adam Robinson` | `Adam Robinson Design, Sydney` |
| 2 | `photo-3.webp` | `HP` | `Hamish Putt` | `Outfield Studio, Sydney` |
| 3 | `photo-2.webp` | `O` | `Ollie` | `Occo Landscapers & Builders` |
| 4 | `photo-4.webp` | `DN` | `Dave Nguyen` | `Fig Landscapes, Melbourne` |

(`&amp;` in the source for Ollie's organisation; renders as `&`. Note Ollie's
row has **no city**, unlike the other three. Client copy — flag, do not fix.)

These four records are used here and roughly eighty times across the page. Put
them in one module constant (`content/landscapers.ts`) and import it everywhere;
a second hand-typed copy is how a name drifts.

**Name, desktop:**

```html
<span style="font-family:var(--font-sans);font-size:14.5px;font-weight:600;color:var(--color-charcoal-900,#1D2A20);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
```

**Name, mobile:**

```html
<span style="font-size:13.5px;font-weight:600;color:var(--m-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
```

**Organisation, desktop:**

```html
<span style="font-family:var(--font-sans);font-size:12.5px;color:var(--color-slate-500,#6E7669);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
```

**Organisation, mobile:**

```html
<span style="font-size:11.5px;line-height:1.3;color:var(--m-ink-500)">
```

| | Desktop | Mobile | Project mapping |
|---|---|---|---|
| stack | `flex flex-col gap:1px min-width:0` | same | `flex min-w-0 flex-col gap-px` |
| name size | `14.5px` | `13.5px` | `text-[14.5px]` / `text-[13.5px]` |
| name weight | `600` | `600` | `font-semibold` |
| name colour | `#1D2A20` | `#16321E` | `text-charcoal-900` / `text-ink` — **they differ.** See §5 defect 5. |
| org size | `12.5px` | `11.5px` | `text-[12.5px]` / `text-[11.5px]` |
| org line-height | *(inherited 1.5)* | `1.3` | `leading-[1.3]` below 1024 only |
| org colour | `#6E7669` | `#6E7669` | `text-slate-500` (both) |
| org truncation | `nowrap` + `ellipsis` | **none — it wraps** | see §5 defect 8 |

`min-width:0` on the text stack is load-bearing — without it the flex item will
not shrink below its content width and the ellipsis never fires.

### 3.7 `next/image` `sizes` — the number that matters

All four photos are `<Image fill className="object-cover">` inside a
`relative aspect-[4/3]` block, so the rendered width equals the **card width**,
which equals the **grid column width**. From §3.1 and §4:

| Range | Card width | Source |
|---|---|---|
| ≥1280px | `296px` flat | §3.1, capped by `max-w-[1280px]` |
| 1024–1279px | `(100vw − 96px) / 4` → 232px…296px | §3.1 |
| 592–1023px | `274px` flat | §4 — the 560px column cap bites at 592px |
| 320–591px | `(100vw − 44px) / 2` → 138px…258px | §4 — 16px gutters + 12px gap |

Ship exactly this, once, on all four images:

```tsx
sizes="(min-width: 1280px) 296px, (min-width: 1024px) calc((100vw - 96px) / 4), (min-width: 592px) 274px, calc((100vw - 44px) / 2)"
```

Notes:

- **Largest rendered width anywhere on the page for these tiles is 296px.** At
  DPR 2 that is 592 device px, and Next's candidate set (default `imageSizes`
  16–384 plus `deviceSizes` 640–3840) will serve the **640** variant at 2× and
  the **384** variant at 1×. Against 1402–1536px sources, both are real
  downscales — that is the win.
- **What happens if `sizes` is wrong or omitted.** `fill` with no `sizes`
  defaults to `100vw`, so a 2× 1280px desktop would request the **2560→3840**
  candidate for every tile. These four files appear roughly eighty times across
  the page. At `quality: 75` that is the difference between ~25 KB and ~400 KB
  per distinct variant, and it multiplies through the optimizer's cache, the
  CDN and the client's decode budget. This attribute is the single highest-
  leverage line in this spec.
- **`quality`.** Leave at the default `75` (allowlisted in `next.config.ts`).
  `90` is reserved for the two hero plates and the take-off plan; a 296px card
  tile does not need it.
- **`priority`.** No. This band is below the fold at every width. Default lazy
  loading.
- **Do not** set `width`/`height` instead of `fill` — the `aspect-ratio:4/3`
  container plus `object-cover` is what produces the crop, and the sources are
  three different aspect ratios.
- The 592px and 1024px breakpoints in `sizes` are *content* breakpoints derived
  from §4's designer decisions, not Tailwind screens. If §4's 560px column cap
  or 16px gutter is ever changed, **this string changes with it.** Keep them in
  one place:

  ```ts
  // content/landscapers.ts — must track docs/specs/04-social-proof.md §4.
  export const LANDSCAPER_TILE_SIZES =
    "(min-width: 1280px) 296px, (min-width: 1024px) calc((100vw - 96px) / 4), " +
    "(min-width: 592px) 274px, calc((100vw - 44px) / 2)";
  ```

---

## 4. Accreditation pills

### 4.1 Row

**Desktop, verbatim:**

```html
<div data-anim="up-blur" data-delay="0.1" data-duration="0.5" class="pf-anim-idle"
     style="margin-top:20px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px">
```

`mt-5 flex flex-wrap items-center justify-center gap-[10px]` +
`<Reveal anim="up-blur" delay={0.1} duration={0.5}>`. A **wrapping row**.

**Mobile, verbatim:**

```html
<div style="margin-top:14px;display:flex;flex-direction:column;align-items:center;gap:8px">
```

`mt-[14px] flex flex-col items-center gap-2`. A **stacked column**, not a
wrapping row. This is a real structural difference; ship
`flex-col desk:flex-row desk:flex-wrap`.

### 4.2 Pill

**Desktop, verbatim:**

```html
<span style="display:inline-flex;align-items:center;gap:9px;border-radius:9999px;background:#fff;padding:9px 18px 9px 10px;box-shadow:0 0 0 1px var(--color-border,#DFD8C8)">
```

**Mobile, verbatim:**

```html
<span style="display:inline-flex;align-items:center;gap:8px;border-radius:9999px;background:#fff;padding:8px 14px 8px 8px;box-shadow:0 0 0 1px var(--m-border)">
```

| | Desktop | Mobile | Project mapping |
|---|---|---|---|
| gap | `9px` | `8px` | `gap-[9px]` / `gap-2` |
| radius | `9999px` | `9999px` | `rounded-full` |
| background | `#fff` | `#fff` | `bg-card` |
| padding | `9px 18px 9px 10px` | `8px 14px 8px 8px` | asymmetric — tighter on the badge side so the circle optically centres |
| hairline | `0 0 0 1px #DFD8C8` | `0 0 0 1px #DFD8C8` | `shadow-[0_0_0_1px_var(--color-hairline)]` |

`--color-border` is **undeclared** in the web artboard; only the `#DFD8C8`
fallback renders, and it equals `--color-hairline`. Map to `hairline`. (Same
class of undeclared-variable finding as §02 ruling 7, but here the fallback is
present so nothing is broken.)

A white pill with a hairline on a near-white/beige page is the brand's "overlay"
treatment minus the shadow. It is not `.shadow-border-*` (those all carry a
multi-layer blur stack); ship the literal single-layer hairline.

### 4.3 Tick badge

**Desktop, verbatim:**

```html
<span aria-hidden="" style="display:grid;place-items:center;height:26px;width:26px;border-radius:9999px;background:var(--color-lime-100,#ECF6BD)">
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest-800,#1F4934)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
</span>
```

**Mobile, verbatim:**

```html
<span aria-hidden="" style="display:grid;place-items:center;height:22px;width:22px;border-radius:9999px;background:var(--m-lime-100,#ECF6BD)">
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--m-forest-800)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
</span>
```

| | Desktop | Mobile | Project mapping |
|---|---|---|---|
| badge size | `26 × 26` | `22 × 22` | `size-[26px]` / `size-[22px]` |
| badge radius | `9999px` | `9999px` | `rounded-full` |
| badge background | `#ECF6BD` | `#ECF6BD` | `bg-lime-100` |
| glyph box | `13 × 13` | `11 × 11` | — |
| stroke colour | `#1F4934` | `#1F4934` | `text-forest-800` + `stroke-current` |
| **stroke width** | `2.6` | `2.8` | **they differ** — see §5 defect 9 |
| caps / joins | `round` / `round` | `round` / `round` | Lucide defaults |

`M20 6 9 17l-5-5` on a `0 0 24 24` viewBox is **exactly Lucide `Check`**. Ship
`<Check size={13} strokeWidth={2.6} aria-hidden />` (and `11 / 2.8` on mobile) —
Lucide is the only sanctioned icon system and this glyph already is one, so
there is no §02-ruling-8 substitution to make here.

`--m-lime-100` is **undeclared** in the mobile artboard's `:root` (only
`--m-lime` exists); the `#ECF6BD` fallback renders, which is `lime-100`. Map to
`lime-100` and drop the dead variable.

### 4.4 Label

**Desktop, verbatim:**

```html
<span style="font-family:var(--font-serif);font-weight:600;font-size:15.5px;color:var(--color-ink,#16321E);white-space:nowrap">
```

**Mobile, verbatim:**

```html
<span style="font-family:var(--m-serif);font-weight:600;font-size:13.5px;color:var(--m-ink)">
```

| | Desktop | Mobile |
|---|---|---|
| family | `var(--font-serif)` → **Source Serif 4** | `var(--m-serif)` → **Fraunces** |
| weight | `600` | `600` |
| size | `15.5px` | `13.5px` |
| colour | `#16321E` [`ink`] | `#16321E` [`ink`] |
| `white-space` | `nowrap` | *(none — wraps)* |

The two artboards render this label in **two different serifs**. See §5 defect 3.

### 4.5 Pill copy, verbatim — identical on both artboards

1. `Australian Landscape Association member`
2. `Xero app partner`

Both are sentence case after the proper nouns; neither has a full stop. Two
pills, in that order, on both artboards.

**These are claims of accreditation, not decoration.** They should be links to
the member listing and the Xero app page the moment the client supplies URLs.
Per §01 ruling ("the client scoped this to the homepage and explicitly declined
wiring the CTAs"), they stay as `<span>` for now — but unlike a CTA, an
unverifiable membership claim is a trust question rather than a navigation one.
**Log it** for the client alongside the signup URL.

---

## 5. The 320→1023px fluid behaviour  **[Designer decision]**

The mobile artboard is a fixed 430px column with zero media queries. Below is
how those numbers behave across the real range. Everything not listed stays at
its artboard px value.

**Side padding.** `16px` from 320px, stepping to `32px` at ≥640px:
`padding-inline: 16px` + `@media (width >= 640px) { padding-inline: 32px }`.

The 640px step matches the hero (spec 02 §7) and the marquee (spec 03 §4), so
all three sections share one gutter from 640px up. **Below 640px they do not:**
the hero and the marquee heading sit at 20px, this section at 16px. That 4px
mismatch is in the artboard (hero `padding:104px 20px 20px`, marquee heading
`margin:0 20px 14px`, this section `padding:34px 16px 34px`) and is visible as a
4px step in the left edge as you scroll past the marquee. Per RULINGS principle
1 I am reproducing it rather than harmonising it. **Flagged for a ruling** — if
the lead prefers one gutter, 20px is the one to keep, because two of the three
sections already use it and widening this section by 4px per side costs 8px of
card width at 320px, which the 2-column grid can afford.

**Content column.** `max-width: 560px; margin-inline: auto`, applied to the
heading block, the card grid and the pill stack together (i.e. to an inner
wrapper inside the padded section). Same 560px measure spec 02 §7 established.
Reasoning: at 1000px wide, a 2-column grid of 4:3 photos gives 470px-wide tiles
— larger than the *desktop* composition ever renders them, which is absurd both
visually (two enormous portrait tiles and nothing else on a wide screen) and for
bandwidth (see §3.7). Capping at 560px holds the tiles at 274px, just under the
desktop maximum, and keeps the whole band reading as one column.

The column reaches 560px at a **592px** viewport (`560 + 2 × 16`). From there up
to 1023px nothing changes size — the band simply centres in more whitespace.
That 592px constant is what the third clause of the `sizes` string in §3.7 keys
off.

**Grid.** Stays `repeat(2, minmax(0, 1fr))` with a `12px` gap at every width
below 1024. It does not become 1-up at 320px (138px tiles are small but legible,
and 1-up would make this band four screens tall on a phone) and it does not
become 4-up before 1024 (that is the desktop composition, and it arrives whole).

**Type.** All of it fixed at its artboard px value across 320–1023: eyebrow
11px, heading 26px, name 13.5px, organisation 11.5px, avatar initials 12px,
pill label 13.5px. Reasoning: the 560px cap already controls the measure, and
every one of these is a label or a short line rather than a paragraph — there is
nothing for a fluid scale to solve. The single value under pressure is the
organisation line at 320px in a 138px tile; §5 defect 8 covers it.

**Pills.** Stay stacked and centred at every width below 1024. Reasoning: side
by side, the two labels total ~46 characters and would need ~380px plus padding,
which fits from about 420px — but the first pill is nearly three times the width
of the second, so a row reads as badly unbalanced at every width where it fits.
Stacked is what the artboard draws and it is also the better answer across the
range.

**At exactly 1024px** the desktop composition takes over: the grid becomes
`auto-fit minmax(220px,1fr)` at 4 across, the container jumps to 1280px with
24px gutters and `py-24`, the card shadow disappears, the pills become a
wrapping row, the organisation lines gain `nowrap` + ellipsis, and the reveal
animations switch on.

---

## 6. Defects in the source

Flagged, not fixed. Each needs a design, brand or copy call before the build
changes it.

1. **Mobile has no reveal animations; desktop reveals four separate things.**
   Desktop carries `data-anim="up-blur" data-duration="0.5"` on the heading
   block, on each of the four cards **individually** (all with the same
   `duration` and **no `delay`**, so the four cards animate in unison rather
   than staggered) and on the pill row (`delay="0.1"`). Mobile has none of it.
   Two sub-questions for the lead:
   - **Is the un-staggered card reveal intended?** Every other multi-item
     reveal on this page staggers (the stat strip runs `0.76`, `0.84`, …).
     Four identical `up-blur`s firing together is indistinguishable from one
     reveal on the grid wrapper, and costs four IntersectionObserver entries to
     achieve it. If it is intended, ship it as one `<Reveal>` on the grid — same
     rendered result, less machinery (principle 1's corollary). If it is not,
     it wants a `0.06`–`0.08` stagger and that is a design addition, not a port.
   - **Should mobile get the reveals?** Reveals are a page-wide system, not a
     per-section choice, and the mobile artboard simply does not implement the
     system at all. **Recommend: apply the desktop reveals at every width**, as
     the codebase's `Reveal` component has no breakpoint fork and inventing one
     for this section would be odd. Log as an addition.

2. **Mobile cards have a shadow; brand says cards do not.** `0 1px 2px
   rgb(21 48 31/.05), 0 6px 14px -6px rgb(21 48 31/.14)` on a white card is
   directly against `docs/brand.md` ("Cards carry no border and no shadow. The
   beige/white value step is the whole elevation story"), and the desktop
   artboard of the *same card* correctly has none.

   The likely cause is legitimate: on mobile the cards sit on `canvas`
   `#F3F0E6`, where the value step works — and the shadow is arguably
   redundant there. On desktop they sit on `pf-surface-300`
   `oklch(97.5% 0.007 96)`, essentially off-white, where the value step is
   nearly invisible and the cards barely read as cards — which is where a
   shadow would actually have helped, and there is none. So the shadow is on
   the artboard that needs it least. Both are "in the render", so principle 1
   says ship both as drawn; I am flagging it because the *desktop* half is the
   weaker composition and the client may want the band moved onto `canvas`.
   **Build as drawn, log both halves.**

3. **The desktop card and pill render in the product's faces, not the marketing
   faces.** Desktop uses `var(--font-sans)` on the avatar initials, the name and
   the organisation, and `var(--font-serif)` on the pill labels. Per §02 rulings
   7 and 9 those resolve through `tokens/fonts.css` to **Hanken Grotesk** and
   **Source Serif 4**. Mobile uses `var(--m-sans)` / `var(--m-serif)` →
   **Nunito Sans** and **Fraunces**.

   So the same four cards and the same two pills render in different type
   families either side of 1024px, and the desktop side uses the faces
   `docs/brand.md` reserves for "product mockups embedded in the page".

   **This is not covered by §02 ruling 7.** That ruling was about the hero's
   float cards, which *are* product mockups and therefore render the app faces
   "by design". A testimonial card and an accreditation pill are marketing
   chrome; the brand doc puts marketing on Fraunces + Nunito Sans. **My reading
   is that the desktop artboard's `--font-sans` / `--font-serif` here are an
   authoring slip and the mobile artboard has it right**, and the fix is to map
   all six call sites to `--font-body` / `--font-display`. But that changes the
   rendered desktop image, so principle 1 is engaged and this is the lead's
   call, not mine. Ruling needed before the engineer starts; it affects every
   text node in §3.5, §3.6 and §4.4.

   Secondary: the brand's "one serif element per band" rule is broken either
   way. The `<h2>` is Fraunces and both pill labels are serif, so this band has
   three serif elements. Same call covers it.

4. **`#7E9A2B` mobile eyebrow is an un-tokened one-off** for words the desktop
   artboard sets in `lime-700` `#95B225`. Same copy, same role, two colours.
   Nothing in the palette is `#7E9A2B`. Precedent §02 ruling 5 says keep a
   one-off as a commented local constant; precedent §01 ruling 2 says fix a
   value that is inconsistent between two states of one component. This is
   closer to the second. **Recommend `lime-700` at both widths**; flagged.

5. **Three colours differ between the artboards for the same element.**
   - Heading: `pf-ink-900` `oklch(23% 0.002 98)` (desktop, a near-neutral warm
     black) vs `ink` `#16321E` (mobile, the green-tinted brand ink).
   - Name: `charcoal-900` `#1D2A20` (desktop) vs `ink` `#16321E` (mobile).
   - Eyebrow: defect 4 above.

   All three are sub-perceptual in isolation and all three are "in the render".
   **Recommend: preserve both, log**, consistent with §02 rulings 12–14. Noted
   here so a reviewer does not "correct" one to the other.

6. **`aria-hidden=""` is not a valid value**, and it appears on all four avatars
   and both tick badges, on both artboards. The empty string is not `true`, so
   per the ARIA spec it is treated as absent — the attribute does nothing.
   Consequence: a screen reader announces `"AR Adam Robinson Adam Robinson
   Design, Sydney"`, and the tick badges are inert `<span>`s with no text so
   they are harmless but equally unhidden. **Fix** to `aria-hidden="true"`
   (JSX: `aria-hidden`). Missing/broken ARIA is named as a bug under principle
   2, and the authoring intent is unambiguous.

7. **Neither eyebrow matches the `.eyebrow` utility, and the utility's own
   comment is wrong.** `styles/base.css` sets `.eyebrow` to `0.78125rem`
   (= 12.5px) / `700` and comments "11.5px is only ever this" — 0.78125rem is
   not 11.5px. Meanwhile the desktop eyebrow here is `12px / 800` and the mobile
   one is `11px / 700`. So the utility matches neither artboard at either width,
   and the comment matches nothing at all.

   `.eyebrow` was presumably derived from the "Before Bramble" chip
   (`11.5px / 800` desktop, `10.5px / 800` mobile) — also not a match. **Worth a
   pass over every eyebrow on the page before deciding what `.eyebrow` should
   be.** For this section, ship the literal artboard values and do not use the
   utility. Flagged as a defect in *our* base layer, not the artboard.

8. **Desktop organisation lines will ellipsis at 1024px.** With `nowrap` +
   `text-overflow:ellipsis`, the available text width at a 232px card is
   `232 − 32 (padding) − 40 (avatar) − 12 (gap) = 148px`. At 12.5px Nunito Sans,
   `Adam Robinson Design, Sydney` (28 chars) measures roughly 168px and
   `Occo Landscapers & Builders` (27 chars) roughly 162px. **Two of the four
   organisation lines are likely to truncate at exactly our switch width**, and
   a third (`Fig Landscapes, Melbourne`, 25 chars, ~150px) sits right on the
   boundary. Same class of finding as §02 ruling 4 (`nowrap` on the stat labels
   with <15px of slack at 1024px), which the lead ruled a fix.

   These are measured estimates, not browser measurements — **verify at 1024px
   before ruling.** If they do truncate, the options in order of preference are
   (a) drop `nowrap` on the organisation line only and let it wrap to two lines
   as mobile already does, keeping `nowrap` + ellipsis on the name; (b) raise
   the grid minimum so 4-up breaks earlier — unavailable, since 4-up is the only
   desktop state; (c) accept the ellipsis. Option (a) is the mobile artboard's
   own behaviour, so it is a port rather than an invention.

9. **Tick stroke-width differs: `2.6` desktop, `2.8` mobile.** At 13px and 11px
   respectively this is a deliberate optical compensation — a smaller glyph
   needs a proportionally heavier stroke to hold weight — and it reads as
   intentional. Noted so a reviewer does not unify them. No action.

10. **Both eyebrows fail WCAG AA for contrast.**
    - Desktop: `lime-700` `#95B225` on `pf-surface-300` ≈ **2.3:1** at 12px/800.
      4.5:1 required.
    - Mobile: `#7E9A2B` on `canvas` `#F3F0E6` ≈ **2.9:1** at 11px/700. 4.5:1
      required.

    This is **systemic, not local to this section** — `docs/brand.md` names
    `lime-700` as "the dark olive used for uppercase eyebrows", so every eyebrow
    on the page inherits the problem. A brand-level call is needed, not a
    section-level patch. The cheapest compliant move inside the existing palette
    is `forest-700` `#2C5539` (≈ 8:1 on both surfaces), which is also the
    brand's own default ("default to forest"); the cost is that eyebrows stop
    being an accent. **Raise this at brand level; do not change it in this
    section alone.**

11. **`Ollie` has no surname and no city** where the other three have both
    (`Occo Landscapers & Builders` vs `…, Sydney` / `…, Melbourne`). Client
    copy. Flag for their call; do not fill it in.

12. **`position:relative` on the desktop card is inert.** Nothing inside it is
    absolutely positioned against the card (the photo positions against the
    photo block, which has its own `position:relative`). Drop it. Observation,
    not a fix.

---

## 7. QA checklist

### Structure

- [ ] One component renders at all widths (four landscaper records exist once in
      the DOM, not twice behind `hidden` / `desk:hidden`).
- [ ] Desktop band: `max-w-[1280px] mx-auto px-6 py-24`, no background of its
      own, sitting on `pf-surface-300`.
- [ ] Mobile band: `px-4 py-[34px]` on `canvas`, content capped at 560px and
      centred (§5).
- [ ] The four records come from a single `content/landscapers.ts` constant.
- [ ] Exactly one `<h2>` in this band; document outline is unbroken from the
      marquee's `<h2>` above it.

### Grid

- [ ] Desktop: `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`,
      `gap: 16px`.
- [ ] Desktop is **4 across at every width from 1024px up** — measure at 1024,
      1212 and 1440. It never breaks to 2×2.
- [ ] Card width measures **232px at 1024px** and **296px at ≥1280px**.
- [ ] Mobile: `grid-cols-2`, `gap: 12px`, at every width below 1024.
- [ ] Mobile card width measures **193px at 430px** and **274px at ≥592px**.

### Cards

- [ ] Photo order is **1, 3, 2, 4**, matching the names in §3.6.
- [ ] Names and organisations match §3.6 character for character, including
      `&` (not `and`), the commas before city names, and `Ollie` with no city.
- [ ] Initials are `AR`, `HP`, `O`, `DN`; the single-character `O` is optically
      centred at both 40px and 34px.
- [ ] Every photo block is `aspect-[4/3]`, `overflow-hidden`,
      `bg-card-muted` (`#E6E0CC`) behind the image.
- [ ] Every `<Image>` is `fill` + `object-cover` with `alt=""`.
- [ ] Card radius is `12px` and the photo is clipped to the top two corners.
- [ ] **Desktop cards have no `box-shadow` and no border.**
- [ ] **Mobile cards have exactly**
      `0 1px 2px rgb(21 48 31/.05), 0 6px 14px -6px rgb(21 48 31/.14)`,
      and that shadow is gone at ≥1024px.
- [ ] Avatars: `40px` desktop / `34px` mobile, `rounded-full`, `bg-forest-700`,
      white `13px`/`12px` bold initials.
- [ ] The inert `box-shadow: 0 0 0 3px #fff` is **not** in our markup (§3.5),
      and the avatar is visually identical to the artboard.
- [ ] Text stack has `min-w-0` so the ellipsis can fire.
- [ ] At **1024px exactly**, screenshot all four organisation lines and record
      whether any truncates (§6 defect 8) before the lead rules.

### Images and performance

- [ ] `sizes` on all four tiles is exactly the string in §3.7.
- [ ] In DevTools at 1440px × DPR 2, each tile's `currentSrc` resolves to the
      **`w=640`** variant — not 1080, 1920 or 2048.
- [ ] At 390px × DPR 3, tiles resolve to `w=384` or smaller.
- [ ] `quality` is the default 75; no `priority` on any of the four.
- [ ] Total transfer for this band at 1440px × DPR 2 is under ~120 KB.
- [ ] No photo's subject is clipped by the centred 4:3 crop (§3.3); if one is,
      an `object-position` is recorded per card.

### Pills

- [ ] Copy is exactly `Australian Landscape Association member` and
      `Xero app partner`, in that order, at both widths.
- [ ] Desktop: wrapping row, `justify-center`, `gap-[10px]`, `mt-5`.
- [ ] Mobile: stacked column, `items-center`, `gap-2`, `mt-[14px]`.
- [ ] Pill hairline is `0 0 0 1px var(--color-hairline)` (`#DFD8C8`) at both
      widths — single layer, not a `.shadow-border-*` stack.
- [ ] Pill padding is `9px 18px 9px 10px` desktop / `8px 14px 8px 8px` mobile.
- [ ] Tick badge is `26px` / `22px`, `rounded-full`, `bg-lime-100` (`#ECF6BD`).
- [ ] Tick is Lucide `Check` at `13px`/`2.6` desktop and `11px`/`2.8` mobile,
      stroked `forest-800` `#1F4934`, round caps and joins.
- [ ] Desktop pill labels are `nowrap`; mobile labels are allowed to wrap.

### Type

- [ ] Desktop heading computes to Fraunces `420/100/0/10`, 48px, line-height
      1.2, letter-spacing -0.008em, `pf-ink-900`, `text-wrap: balance`.
- [ ] Mobile heading computes to Fraunces `600/60/**32**`, 26px, line-height
      **1.14**, letter-spacing **-0.005em**, `ink`, **no** `text-wrap: balance`.
- [ ] Desktop eyebrow is 12px / 800 / .14em; mobile is 11px / 700 / .14em.
      Neither uses the `.eyebrow` utility (§6 defect 7).
- [ ] Name / organisation sizes are 14.5 / 12.5 desktop and 13.5 / 11.5 mobile;
      organisation is `slate-500` at both.
- [ ] Type families at the six §6-defect-3 call sites match whatever the lead
      ruled, consistently, at both widths.

### Accessibility

- [ ] `aria-hidden="true"` (not `""`) on all four avatars and both tick badges.
- [ ] A screen reader announces each card as name + organisation only — the
      initials are **not** read.
- [ ] `alt=""` on all four photos; none is announced.
- [ ] Contrast measurements for both eyebrows (§6 defect 10) are recorded in
      `PULL_REQUEST.md` with the brand call attached.
- [ ] Name and organisation contrast both pass AA on white
      (`charcoal-900`/`ink` ≈ 15:1, `slate-500` ≈ 4.7:1) — re-measure if the
      lead changes the card background.
- [ ] Nothing in this band is focusable (no links, no buttons), so no focus ring
      is required — confirm by tabbing straight from the marquee to the next
      band's first control.

### Motion

- [ ] Whatever §6 defect 1 is ruled, reveals fire on scroll-in and the section
      is fully visible and correctly laid out with JS disabled.
- [ ] With `prefers-reduced-motion: reduce`, every element in this band is
      `opacity: 1`, `transform: none`, `filter: none` (handled by
      `styles/motion/reveal.css`'s resting block — verify, do not re-declare).
- [ ] The resting frame is byte-stable across two consecutive harness runs.

### Fluid range (designer decisions, §5)

- [ ] At 320px: 16px gutters, 2 columns, 138px tiles, pills stacked, nothing
      overflows horizontally.
- [ ] At 430px: matches the mobile artboard exactly.
- [ ] At 592px: the 560px column cap engages; tiles hold at 274px.
- [ ] At 640px: gutters step to 32px; tiles still 274px (the cap already binds).
- [ ] At 1000px: band is 560px wide and centred, not stretched.
- [ ] At 1023px → 1024px: grid goes 2-up → 4-up, container 560px → 1280px,
      gutters 32px → 24px, vertical padding 34px → 96px, card shadow disappears,
      pills go column → row, organisation lines gain `nowrap`.
- [ ] The 4px gutter step between the marquee (20px) and this band (16px) below
      640px is present and matches the artboards (§5), or has been harmonised
      per the lead's ruling.
