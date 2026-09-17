# 02 — Hero

Source of truth for this section:

- Desktop (≥1024px): `Bramble Home Web.dc.html` (in the Claude Design export,
  `design-source/Bramble HomepageProduct PageMobile Web.zip`) —
  `<!-- HERO STAGE -->` → `#pf-hero-panel`, lines 366–495; CSS in the `<helmet>`
  `<style>` block, lines 19–340.
- Mobile (<1024px): `Bramble Home Mobile.dc.html`, lines 110–128.

Everything below is transcribed from those two files. Where the artboard writes
`--pf-*` / `--m-*` variables, the project token that replaces it is named in
brackets. Where I have had to invent behaviour the artboards do not contain
(the 320→1023px range), it is called out under **[Designer decision]**.

**Breakpoint rule for this whole file:** `desk` = 1024px. Below it the mobile
artboard's hero runs. At and above it the desktop artboard's hero runs. There is
exactly one breakpoint; the two heroes are different compositions, not one
composition that reflows. Ship them as two subtrees (`hidden desk:flex` /
`desk:hidden`) or as one component with a single `desk:` fork — either is fine,
but do not try to morph one into the other.

---

## 1. Desktop hero stage (≥1024px)

### 1.1 Wrapper chain

Four nested elements, outermost first. All four come straight off the artboard.

```
<div style="position:relative;max-width:100%;overflow-x:clip">
  <div style="position:relative;overflow-x:clip">
    <section class="pf-shadow-border-strong"
             style="width:100%;background:var(--pf-surface-500)">
      <div id="pf-hero-panel" style="...">
```

| Element | Purpose | Build note |
| --- | --- | --- |
| outer `div` | `position:relative; max-width:100%; overflow-x:clip` | The stage wrapper. `overflow-x:clip` (not `hidden`) so `position:sticky` further down the page still works. |
| inner `div` | `position:relative; overflow-x:clip` | Doubled in the artboard. Keep both — the outer one clips the stage, the inner one clips the panel. |
| `section` | `width:100%; background:var(--pf-surface-500)` → `bg-pf-surface-500` | Carries `.pf-shadow-border-strong` → project class **`.shadow-border-strong`**. |
| `#pf-hero-panel` | the hero itself | see below |

`#pf-hero-panel` inline style, verbatim:

```
position:relative;
margin:0 auto;
display:flex;
min-height:88svh;
width:100%;
max-width:1920px;
flex-direction:column;
align-items:center;
overflow:hidden;
padding-top:88px
```

- `min-height:88svh` — `svh`, not `vh` and not `dvh`. Do not substitute.
- `max-width:1920px`, centred.
- `padding-top:88px` clears the fixed nav (which sits at `top:20px` and is ~36px
  tall, so 88px leaves ~32px of air under it).
- `overflow:hidden` on the panel is what clips the float-card stack when it
  animates past the panel edge.

### 1.2 Background layer

A `div` pinned to the panel, `z-index:0`:

```
position:absolute;inset:0;z-index:0;overflow:hidden;background:#20361f
```

`#20361f` is a hard-coded flat green behind the photograph — it is **not** a
project token (nearest is `forest-900 #15301F`). Keep the literal `#20361f`; it
is the paint-flash colour before the image decodes and it is deliberately a
touch lighter than forest-900.

The image:

```html
<img src="/images/hero-lifestyle.webp" alt=""
     style="position:absolute;inset:0;width:100%;height:100%;
            object-fit:cover;object-position:center 62%">
```

- Artboard path is `assets/hero-lifestyle.png`; ship `/images/hero-lifestyle.webp`.
- `object-position: center 62%` exactly.
- `alt=""` — decorative, see §8.
- Use `next/image` with `fill`, `priority`, `sizes="100vw"`. It is the LCP
  element.

### 1.3 The 4-stop scrim

One absolutely-positioned `div` over the image, verbatim:

```css
position: absolute;
inset: 0;
background: linear-gradient(
  to top,
  color-mix(in oklab, var(--color-forest-900, #15301F) 88%, transparent) 0%,
  color-mix(in oklab, var(--color-forest-900, #15301F) 74%, transparent) 32%,
  color-mix(in oklab, var(--color-forest-900, #15301F) 34%, transparent) 66%,
  transparent 92%
);
```

Four stops: 88% at 0%, 74% at 32%, 34% at 66%, fully transparent at 92%.
`in oklab` — not `srgb`, not `oklch`. `--color-forest-900` is already a project
token, so the `#15301F` fallback can be dropped.

### 1.4 Decorative radial vignette

Inside the centred content column (`position:relative` parent), a second
decorative layer behind the copy. Verbatim:

```html
<div aria-hidden="true" style="
  pointer-events:none;
  position:absolute;
  left:50%;
  top:-56px;
  bottom:-48px;
  width:min(1180px,116%);
  transform:translateX(-50%);
  background:radial-gradient(ellipse 62% 58% at 50% 46%,
    rgba(14,24,15,.74) 0%,
    rgba(14,24,15,.6) 58%,
    rgba(14,24,15,0) 100%)"></div>
```

Note `top:-56px` / `bottom:-48px` — asymmetric, it bleeds further above the
eyebrow than below the CTAs. `rgba(14,24,15,…)` is a one-off darker-than-forest
ink; keep the literal rgba, it is not a token.

### 1.5 Content column

Panel child, `z-index:20`:

```
position:relative;z-index:20;display:flex;width:100%;flex:1;
flex-direction:column;align-items:center;padding:0 20px
```

Inside it, the copy column:

```
position:relative;display:flex;width:100%;max-width:1000px;
flex-direction:column;align-items:center;text-align:center
```

Then, pushed to the bottom by `margin-top:auto`, the stat-strip wrapper:

```
position:relative;margin-top:auto;width:100%;max-width:1120px;padding-bottom:18px
```

The copy column is 1000px; the stat strip is 1120px. That 120px difference is
intentional — the stats are wider than the sentence above them.

---

## 2. Copy, verbatim (desktop)

### 2.1 Eyebrow pill

```html
<div data-anim="up-blur" data-delay="0" data-duration="0.5" class="pf-anim-idle"
     style="margin-bottom:18px;display:inline-flex;align-items:center;
            align-self:center;border-radius:9999px;
            background:linear-gradient(to bottom,rgba(255,255,255,.16),rgba(255,255,255,.06));
            backdrop-filter:blur(14px) saturate(1.2);
            padding:8px 18px;font-size:12.5px;font-weight:700;
            letter-spacing:.16em;text-transform:uppercase;color:#fff;
            text-shadow:0 1px 3px rgba(0,0,0,.35)">AI assistant for landscapers</div>
```

Copy: **`AI assistant for landscapers`**

- 12.5px / 700 / `letter-spacing:.16em` / uppercase / `#fff`.
- **Do not use the project's `.eyebrow` class here.** `.eyebrow` is 0.78125rem
  (12.5px) but `letter-spacing:.14em`. The hero pill is `.16em`. Write the
  letter-spacing explicitly, or add a `tracking-[0.16em]` override.
- Pill radius `9999px`. This is the one place a >12px radius is allowed, because
  it is a pill, not a card — the 4/6/8/12 rule governs boxes.
- Reveal: `anim="up-blur"`, `delay={0}`, `duration={0.5}`.

### 2.2 H1

```html
<h1 class="pf-h1" style="color:var(--pf-ink-100);text-wrap:balance;
                         text-shadow:0 2px 18px rgba(0,0,0,.45)">
  <span style="display:block">
    <span data-anim="word" data-delay="0.000" class="pf-anim-idle" style="display:inline-block">Confyde</span>
    <span data-anim="word" data-delay="0.045" class="pf-anim-idle" style="display:inline-block">builds</span>
    <span data-anim="word" data-delay="0.090" class="pf-anim-idle" style="display:inline-block">your</span>
    <span data-anim="word" data-delay="0.135" class="pf-anim-idle" style="display:inline-block">quotes.</span>
  </span>
  <span style="display:block">
    <span data-anim="word" data-delay="0.200" class="pf-anim-idle" style="display:inline-block;color:var(--pf-lime)">Then</span>
    <span data-anim="word" data-delay="0.245" class="pf-anim-idle" style="display:inline-block;color:var(--pf-lime)">helps</span>
    <span data-anim="word" data-delay="0.290" class="pf-anim-idle" style="display:inline-block;color:var(--pf-lime)">you</span>
    <span data-anim="word" data-delay="0.335" class="pf-anim-idle" style="display:inline-block;color:var(--pf-lime)">win</span>
    <span data-anim="word" data-delay="0.380" class="pf-anim-idle" style="display:inline-block;color:var(--pf-lime)">them.</span>
  </span>
</h1>
```

**Line 1 — `#fff`-family ink (`--pf-ink-100`), four words:**

| Word | `data-delay` | Colour |
| --- | --- | --- |
| `Confyde` | `0.000` | `pf-ink-100` (inherited from the `h1`) |
| `builds` | `0.045` | `pf-ink-100` |
| `your` | `0.090` | `pf-ink-100` |
| `quotes.` | `0.135` | `pf-ink-100` |

**Line 2 — every word lime, five words:**

| Word | `data-delay` | Colour |
| --- | --- | --- |
| `Then` | `0.200` | `--pf-lime` → **`lime-500` `#c8e84a`** |
| `helps` | `0.245` | `lime-500` |
| `you` | `0.290` | `lime-500` |
| `win` | `0.335` | `lime-500` |
| `them.` | `0.380` | `lime-500` |

Line 1 steps 45ms per word; line 2 restarts at 200ms and then steps 45ms.
The 65ms extra gap between `quotes.` (0.135) and `Then` (0.200) is the line
break beat. Reproduce all nine values exactly.

Each word is a separate `<span data-anim="word" …>` with **no** `data-duration`,
so it takes the CSS default `0.5s` with `cubic-bezier(0.19, 1, 0.22, 1)` from
`styles/motion/reveal.css`. The literal space between the spans is significant —
keep it, or the words will run together.

**Type:** `.pf-h1` → project **`.display .display-1`**. The two are identical:

```css
font-family: var(--font-fraunces), Georgia, serif;
font-weight: 400;
font-variation-settings: "wght" 420, "SOFT" 100, "WONK" 0, "opsz" 10;
margin: 0;
font-size: 2.75rem;        /* base */
line-height: 1.14;
letter-spacing: -0.01em;
/* @media (min-width:768px)  { font-size: 4rem }    */
/* @media (min-width:1024px) { font-size: 4.75rem } */
```

So at ≥1024px the H1 is **76px / line-height 1.14 / letter-spacing −0.01em /
wght 420, SOFT 100, WONK 0, opsz 10**.

Also on the `h1`: `color: var(--pf-ink-100)` → **`text-pf-ink-100`**,
`text-wrap: balance`, `text-shadow: 0 2px 18px rgba(0,0,0,.45)`.

> **Defect flag — lime headline.** `docs/brand.md` says a heading is a heading
> "through family, weight and size, **not colour**", and lime has four sanctioned
> roles, none of which is a headline. The artboard nonetheless sets five headline
> words in lime. Build it as drawn (it is the hero's whole idea) but log it as a
> knowing exception so the brand doc and the page do not silently disagree.

### 2.3 Sub-paragraph

```html
<p data-anim="up-blur" data-delay="0.32" data-duration="0.5"
   class="pf-anim-idle pf-hero-sub"
   style="margin-top:36px;max-width:720px;font-size:16px;line-height:1.55;
          font-weight:500;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.5)">Tell Confyde about the job. What used to eat your evening comes back as a branded proposal in minutes, priced on your own materials, suppliers and margins - the lot! Once it's sent, it tells you who to chase, who to invoice, and how to upsell to your existing clients.<br><b>Runs your&nbsp;complete end-to-end sales system.</b></p>
```

Copy, verbatim, in two runs separated by a `<br>`:

1. `Tell Confyde about the job. What used to eat your evening comes back as a branded proposal in minutes, priced on your own materials, suppliers and margins - the lot! Once it's sent, it tells you who to chase, who to invoice, and how to upsell to your existing clients.`
2. `<b>Runs your&nbsp;complete end-to-end sales system.</b>`

Details that matter:

- The separator before "the lot" is a plain hyphen-minus `-` surrounded by
  spaces, not an en or em dash. Keep it as typed.
- The apostrophe in `it's` is a straight `'` (U+0027). Every other apostrophe in
  the hero (float card 3) is a curly `’` (U+2019). Inconsistent in the source —
  see the defect list.
- `Runs your&nbsp;complete` — a **non-breaking space** between "your" and
  "complete". In JSX write `{"Runs your complete end-to-end sales system."}`.
- The bold run is `<b>`, not `<strong>`. It carries no semantic emphasis, so `<b>`
  is correct; keep it.
- `.pf-hero-sub` exists only as a hook for the `max-height:820px` media query
  (§5). Carry the class name (project name: `hero-sub`) even though it has no
  base rule.
- Reveal: `up-blur`, delay `0.32`, duration `0.5`.

### 2.4 CTAs

```html
<div class="pf-hero-ctas"
     style="position:relative;z-index:30;margin-top:44px;display:flex;
            flex-direction:row;align-items:flex-start;gap:12px"
     data-anim="up-blur" data-delay="0.42" data-duration="0.5">
```

Row, `gap:12px`, `align-items:flex-start`, `z-index:30` (above the vignette).
`.pf-hero-ctas` is another media-query-only hook (§5).

**Primary**, wrapped in a column so the fine print sits under it:

```html
<div style="display:flex;flex-direction:column;align-items:center;gap:10px">
  <a href="#" style="display:inline-flex;height:44px;align-items:center;
     justify-content:center;border-radius:12px;
     box-shadow:0 8px 20px -10px rgba(21,48,31,.4);
     background:var(--pf-lime,#c8e84a);padding:0 40px;
     font-size:16px;font-weight:700;color:var(--pf-ink-900);
     white-space:nowrap">Try Confyde free</a>
  <span style="font-size:10px;color:rgba(255,255,255,.88)">*90 seconds. No card.</span>
</div>
```

- Label: **`Try Confyde free`**
- 44px tall, radius 12px, `padding: 0 40px`, 16px / 700,
  `background: lime-500`, `color: pf-ink-900`,
  `box-shadow: 0 8px 20px -10px rgba(21,48,31,.4)`, `white-space:nowrap`.
- Add project class **`.btn-lime`** (`transition: filter .2s`, hover
  `brightness(1.06)`).
- Fine print: **`*90 seconds. No card.`** — literally 10px,
  `color: rgba(255,255,255,.88)`, `gap:10px` above it. 10px is tiny; it is
  decorative reassurance, not information, but see §8 for the accessibility note.

**Secondary:**

```html
<button type="button" class="pf-btn-glass"
        style="display:inline-flex;height:44px;align-items:center;
               justify-content:center;gap:12px;border-radius:12px;
               box-shadow:0 8px 20px -10px rgba(0,0,0,.4);padding:0 32px;
               font-size:16px;font-weight:600;color:var(--pf-ink-100);
               white-space:nowrap;backdrop-filter:blur(12px);border:0;
               cursor:pointer">See how it works
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"></path>
  </svg>
</button>
```

- Label: **`See how it works`** followed by a solid play triangle.
- `.pf-btn-glass` → project **`.btn-glass`**:
  `background-color:rgb(255 255 255/.08)`,
  `box-shadow:0 0 0 1px rgb(255 255 255/.2), 0 1px 1px rgb(255 255 255/.06) inset, 0 2px 6px rgb(0 0 0/.12)`,
  `transition:background-color .2s, box-shadow .2s`, hover
  `background-color:rgb(255 255 255/.12)`. The inline `box-shadow` above
  **overrides** the class's shadow (both are inline vs class, inline wins) — so
  the glass hairline is lost. See the defect list.
- `gap:12px` between label and glyph, 16px / 600, `color: pf-ink-100`,
  `backdrop-filter: blur(12px)`, `border:0`.
- **Iconography:** the inline `<path d="M8 5v14l11-7z">` is a filled play
  triangle, not Lucide. Brand says Lucide only. Replace with Lucide `Play` at
  16px with `fill="currentColor"`, which is visually identical.
- It is a `<button>`, not a link. If it opens a video/modal keep `<button>`; if
  it scrolls to a section, make it an `<a href="#…">`.

---

## 3. The four floating cards

### 3.1 Group and stack

```css
.pf-float-group {
  position: absolute;
  left: 0;
  bottom: calc(100% + 24px);
  display: flex;
  flex-direction: column;
  transform: scale(.78);
  transform-origin: left bottom;
}
```

Inline on the same element: `width:288px; max-width:calc(100vw - 56px); gap:12px`.

It is positioned against the **stat-strip wrapper** (the
`margin-top:auto; max-width:1120px` div), so `bottom: calc(100% + 24px)` floats
it 24px above the top of the stat strip, hard left. `transform-origin:left bottom`
means the `scale(.78)` shrinks toward that same corner, so the left edge and the
24px gap hold at every scale.

Inner stack:

```html
<div class="pf-float-stack" aria-hidden="true" style="display:grid;perspective:1100px">
```

All four cards sit in `grid-area:1/1` — one square, four cards stacked — with
`align-self:end`. `perspective:1100px` on the parent is what makes the
`rotateY` in the keyframe read as a card flipping in space rather than squashing.
The whole stack is `aria-hidden="true"`.

### 3.2 Shared card styling

```css
.pf-float-card {
  opacity: 0;
  transform: rotateY(-88deg) rotate(-3deg) scale(.96);
  transform-origin: 20% 60%;
  backface-visibility: hidden;
  box-shadow: 0 0 0 1.5px var(--color-lime-500, #C8E84A),
              0 18px 40px -12px rgba(21,48,31,.45);
  animation: pf-float-cycle 24s cubic-bezier(.22,1,.36,1) infinite;
}
.pf-float-card[data-fc="1"] { animation-delay: 6s; }
.pf-float-card[data-fc="2"] { animation-delay: 12s; }
.pf-float-card[data-fc="3"] { animation-delay: 18s; }
```

Per-card inline: `grid-area:1/1; align-self:end; width:288px; border-radius:12px;
background:#fff` plus `padding:16px 18px` on cards 0, 2 and 3 (card 1 has
`overflow:hidden` and no padding — it pads its two internal blocks instead).

Each card also carries `.pf-shadow-overlay` → project **`.shadow-overlay`**. Like
the glass button, the class shadow is overridden by the `.pf-float-card` rule's
`box-shadow` (same specificity, later rule wins). See the defect list.

### 3.3 The keyframe, verbatim

```css
@keyframes pf-float-cycle {
  0%    { opacity: 0; transform: rotateY(-88deg) rotate(-3deg)   scale(.96) }
  3%    { opacity: 1; transform: rotateY(0deg)   rotate(-2.5deg) scale(1)   }
  22%   { opacity: 1; transform: rotateY(0deg)   rotate(-2.5deg) scale(1)   }
  25.5% { opacity: 0; transform: rotateY(88deg)  rotate(-1deg)   scale(.96) }
  100%  { opacity: 0; transform: rotateY(-88deg) rotate(-3deg)   scale(.96) }
}
```

Duration **24s**, easing **`cubic-bezier(.22,1,.36,1)`**, `infinite`.
Delays: card 0 → `0s`, card 1 → `6s`, card 2 → `12s`, card 3 → `18s`.
24s ÷ 4 = 6s per card; each card is visible from 3% to 25.5% of its own cycle
(0.72s → 6.12s), so one card is on screen at a time with a ~0.1s crossfade.

Reduced motion (artboard, line 338):

```css
.pf-float-card { animation: none !important }
.pf-float-card[data-fc="0"] { opacity: 1 !important; transform: rotate(-2.5deg) !important }
```

i.e. under `prefers-reduced-motion: reduce` only card 0 is shown, held at its
resting `rotate(-2.5deg)`. Put this in `styles/motion/` alongside the other
motion files so it lands in the reduced-motion block the harness screenshots.

### 3.4 Card content, verbatim

All four are 288px wide, white, radius 12px. Fonts in the artboard are written
as `var(--font-sans)` / `var(--font-serif)`, which are **undefined in the web
artboard** — map them to `--font-body` (Nunito Sans) and `--font-display`
(Fraunces) respectively. Colours are written as `var(--color-X, #HEX)` where
`--color-X` is likewise undefined, so the hex fallback is what renders; every one
of those hexes matches a project token, listed below.

Shared token mapping:

| Artboard | Renders as | Project token |
| --- | --- | --- |
| `var(--color-slate-500,#6E7669)` | `#6E7669` | `slate-500` |
| `var(--color-slate-700,#35402F)` | `#35402F` | `slate-700` |
| `var(--color-slate-100,#E5E8E5)` | `#E5E8E5` | `slate-100` |
| `var(--color-ink,#16321E)` | `#16321E` | `ink` |
| `var(--color-cream,#E8E4D2)` | `#E8E4D2` | `cream` |
| `var(--color-border,#DFD8C8)` | `#DFD8C8` | `hairline` |
| `var(--color-card-muted,#E6E0CC)` | `#E6E0CC` | `card-muted` |
| `var(--color-forest-900,#15301F)` | `#15301F` | `forest-900` |
| `var(--color-forest-500,#4D8F6C)` | `#4D8F6C` | `forest-500` |
| `var(--color-forest-300,#8FA886)` | `#8FA886` | `forest-300` |
| `var(--color-lime-500,#C8E84A)` | `#C8E84A` | `lime-500` |

Every figure below already exists in `content/home.ts` (`QUOTE`, `SCOPE`,
`READING`). **Read them from there, do not retype them** — that file exists
precisely because the artboard types them at each call site.

---

#### Card `data-fc="0"` — Estimate drafted

`padding:16px 18px`.

| Slot | Copy | Type |
| --- | --- | --- |
| eyebrow | `Estimate drafted` | body, 11.5px / 600 / `letter-spacing:.1em` / uppercase / `slate-500` |
| figure | `$48,200` | display, 600, 26px, `line-height:1`, `ink`, `margin-top:8px` |

Then a `<ul style="list-style:none;margin:10px 0 0;padding:0">` of three rows.
Each `<li>`: `display:flex;align-items:baseline;gap:12px;padding:6px 0`; rows 2
and 3 add `border-top:1px solid #E5E8E5` (`slate-100`). Label span: `flex:1`,
body 12.5px, `slate-700`. Amount span: `flex:none`, display 600 12.5px,
`font-variant-numeric:tabular-nums`, `ink`.

| Label | Amount |
| --- | --- |
| `Paving & Stonework` | `$14,880` |
| `Retaining & Structures` | `$7,920` |
| `Turf, Soil & Planting` | `$9,400` |

Footer (`margin-top:10px;display:flex;align-items:center;gap:8px`):
a 6px × 6px dot — `border-radius:12px`, `background: lime-500`,
`box-shadow:0 8px 20px -10px rgba(21,48,31,.4)`, `aria-hidden` — then
body 12px `slate-500`: **`Ready to send · 14 minutes`** (middle dot U+00B7,
spaced).

> The dot is `border-radius:12px` on a 6px box — a rounded square that reads as a
> circle. Use `border-radius:9999px`; visually identical, semantically honest.

#### Card `data-fc="1"` — Proposal built

`overflow:hidden`, no padding on the card itself. Two blocks.

**Photo header** — `position:relative;overflow:hidden;padding:12px 16px 14px;background:#15301F`:

- `<img src="/images/photo-1.webp" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
- Scrim span, verbatim:
  ```css
  position:absolute;inset:0;
  background:linear-gradient(24deg,
    color-mix(in oklab, var(--color-forest-900,#15301F) 90%, transparent) 4%,
    color-mix(in oklab, var(--color-forest-900,#15301F) 42%, transparent) 52%,
    color-mix(in oklab, var(--color-forest-900,#15301F) 6%, transparent));
  ```
  Note: a **24deg** linear gradient, three stops, the third with no position.
- Header row — `display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:9px;border-bottom:1px solid rgba(255,255,255,.22)`:
  - `Laurence Landscapes` — **display** (Fraunces), 600, 11.5px,
    `letter-spacing:.16em`, uppercase, `line-height:1`, `nowrap`, `#fff`.
  - `LIC# 284119C` — body, 11.5px, `line-height:1.5`, `cream`,
    `text-shadow:0 1px 3px rgba(0,0,0,.55)`.
- Body (`padding-top:11px`):
  - `Q-1042 · Coogee` — body, 11.5px, `letter-spacing:.16em`, uppercase, `cream`,
    `text-shadow:0 1px 3px rgba(0,0,0,.5)`.
  - `14 Beach Rd` — display 600, 22px, `line-height:.98`,
    `letter-spacing:-.01em`, `#fff`, `text-shadow:0 2px 18px rgba(0,0,0,.45)`,
    `margin-top:4px`.

**White footer** — `padding:12px 16px 14px`:

- `Proposal built` — body 11.5px / 600 / `.1em` / uppercase / `slate-500`.
- `Branded cover, scope of works and inclusions, straight off the estimate.` —
  body 12.5px, `line-height:1.45`, `slate-700`, `margin-top:7px`.
- Row (`margin-top:11px;display:flex;align-items:baseline;justify-content:space-between;gap:10px`):
  `Total inc. GST` (body 12px `slate-500`) / `$48,200` (display 600 19px,
  tabular-nums, `ink`).

#### Card `data-fc="2"` — How they read it

`padding:16px 18px`.

- `How they read it` — body 11.5px / 600 / `.1em` / uppercase / `slate-500`.
- `14 Beach Rd` — display 600 19px, `line-height:1.15`, `ink`, `margin-top:8px`.
- `Opened 4 times, mostly after 8 pm.` — body 12px `slate-500`, `margin-top:2px`.

Then `margin-top:12px;display:flex;align-items:flex-start;gap:12px`:

**Left — an 84px document thumbnail.** `flex:none;width:84px;overflow:hidden;
border-radius:6px;background:#fff;box-shadow:0 0 0 1px #DFD8C8`. Inside:

- 26px-tall photo strip: `background:#15301F` with
  `<img src="/images/photo-1.webp" alt="" style="…object-fit:cover;opacity:.85">`.
- Seven text bars, `display:flex;flex-direction:column;gap:5px;padding:7px 7px 9px`,
  each `height:4px;border-radius:9999px`, in order:

  | # | width | colour |
  | --- | --- | --- |
  | 1 | 58% | `#E5E8E5` (`slate-100`) |
  | 2 | 86% | `#B89270` (`cat-retaining`) |
  | 3 | 72% | `#B89270` |
  | 4 | 90% | `#A8A296` (`cat-paving`) |
  | 5 | 64% | `#A8A296` |
  | 6 | 80% | `#8FB57E` (`cat-planting`) |
  | 7 | 44% | `#E5E8E5` |

- Four heat blobs, each `position:absolute;left:3px;right:3px;border-radius:4px;
  filter:blur(3px);mix-blend-mode:multiply;aria-hidden`:

  | top | height | background | opacity |
  | --- | --- | --- | --- |
  | 26% | 9% | `forest-300 #8FA886` | 0.25 |
  | 40% | 11% | `forest-500 #4D8F6C` | 0.55 |
  | 54% | 13% | `forest-900 #15301F` | 0.8 |
  | 76% | 16% | `forest-900 #15301F` | 0.8 |

**Right — a four-row attention list.** `<ul style="list-style:none;margin:0;padding:0;width:100%">`,
each `<li style="padding:4px 0">` containing a row
(`display:flex;align-items:center;gap:7px`) of: an 8px `border-radius:9999px`
dot (`aria-hidden`, `flex:none`); a label (body 11.5px `slate-700`, `flex:1`,
`nowrap; overflow:hidden; text-overflow:ellipsis`); a duration (body 11.5px,
tabular-nums, `slate-500`, `flex:none`). Under it a track
(`margin:4px 0 0 15px;height:4px;border-radius:9999px;background:#E6E0CC`)
with a fill (`height:100%;border-radius:9999px`).

| Dot | Label | Time | Fill width | Fill colour |
| --- | --- | --- | --- | --- |
| `#A8A296` | `Paving & Stonework` | `2m 40s` | 100% | `forest-900 #15301F` |
| `#ACAFB1` | `Totals & acceptance` | `1m 12s` | 45% | `forest-900 #15301F` |
| `#B89270` | `Retaining & Structures` | `48s` | 30% | `forest-500 #4D8F6C` |
| `#8FB57E` | `Turf, Soil & Planting` | `22s` | 14% | `forest-300 #8FA886` |

> **Defect flag.** `#ACAFB1` (row 2's dot) is a cool neutral grey. It is not in
> the token set and it is not in the category taxonomy — every other dot on this
> card is. It is also the only cool-grey pixel in the hero. Recommend `#A8A296`
> (`cat-paving`) or `slate-300 #A2A899`; needs a design call, do not silently
> swap.

Footer: `She keeps going back to the paving.` — body 12px, `line-height:1.4`,
`slate-500`, `margin-top:11px`.

#### Card `data-fc="3"` — Your next move

`padding:16px 18px`.

| Slot | Copy | Type |
| --- | --- | --- |
| eyebrow | `Your next move` | body 11.5px / 600 / `.1em` / uppercase / `slate-500` |
| title | `Call Sarah today` | display 600 19px, `line-height:1.15`, `ink`, `margin-top:8px` |
| body | `She’s read the paving section three times and hasn’t replied in six days.` | body 12.5px, `line-height:1.45`, `slate-700`, `margin-top:6px` |

Footer row, `margin-top:12px;display:flex;align-items:baseline;gap:10px`:

- `$48.2k` — display 600 26px, `line-height:1`, `ink`.
- `still on the table` — body 12px, `slate-500`.

Both apostrophes in the body line are curly `’` (U+2019). Keep them.

---

## 4. The stat strip

Container, directly after the float group inside the 1120px wrapper:

```html
<div style="display:grid;grid-template-columns:repeat(4,1fr);
            grid-template-rows:auto auto;
            border-top:1px solid rgba(255,255,255,.15)"></div>
```

Four cells, each:

```html
<div data-anim="up-blur" data-delay="…" data-duration="0.5"
     class="pf-anim-idle pf-stat-cell"
     style="display:grid;grid-row:span 2;grid-template-rows:subgrid;
            align-content:start;padding:…">
```

**Subgrid is the point.** The parent declares `grid-template-rows:auto auto`;
each cell spans both rows and adopts them with `grid-template-rows:subgrid`, so
all four figures share one baseline and all four labels share the next, no matter
how tall any one figure wraps. Do not replace this with flexbox.

Per-cell padding and borders:

| Cell | `padding` | `border-left` | `data-delay` |
| --- | --- | --- | --- |
| 1 | `22px 28px 0 0` | none | `0.6` |
| 2 | `22px 28px 0 28px` | `1px solid rgba(255,255,255,.15)` | `0.68` |
| 3 | `22px 28px 0 28px` | `1px solid rgba(255,255,255,.15)` | `0.76` |
| 4 | `22px 0 0 28px` | `1px solid rgba(255,255,255,.15)` | `0.84` |

Cell 1 has no left padding and cell 4 no right padding, so the strip is flush to
the 1120px column. All four are `duration 0.5`, 80ms apart.

Figure span, every cell:

```html
<span class="pf-h1 pf-stat-figure"
      style="display:block;font-size:24px;line-height:1.1;white-space:nowrap;
             color:var(--pf-ink-100);
             font-variation-settings:'wght' 500,'SOFT' 100,'opsz' 40">
```

- Carries `.pf-h1` (→ `.display`) **and** overrides the size to 24px and the
  axes. So the figure is Fraunces at **`"wght" 500, "SOFT" 100, "opsz" 40`** —
  heavier and at a much larger optical size than the H1's
  `wght 420, SOFT 100, WONK 0, opsz 10`. `WONK` is omitted here, so it inherits
  `0` from `.display`. Reproduce the axis string exactly; a static Fraunces cut
  will not match.
- `.pf-stat-figure` has no base rule; it exists only for the `max-height:820px`
  override (§5). Keep the class (project name: `stat-figure`).

Label span, every cell:

```html
<span style="margin-top:6px;display:block;font-size:12.5px;line-height:1.4;
             white-space:nowrap;color:rgba(255,255,255,.6)">
```

| # | Figure | Label |
| --- | --- | --- |
| 1 | `4+ hrs → 30 mins` | `to build a client-ready quote` |
| 2 | `1 in 3` | `more jobs won` |
| 3 | `12 hrs` | `back every month, each` |
| 4 | `30 mins` | `to start setting up new AI systems` |

The `→` in figure 1 is U+2192 — sanctioned by the brand doc as type, not an icon.

> **Defect flag — `white-space:nowrap` on the labels.** Cell 4's label,
> `to start setting up new AI systems`, is ~205px at 12.5px. At 1024px viewport
> the 1120px strip is capped by the 20px page padding to ~984px, so each cell is
> ~246px minus 28px padding ≈ 218px. It fits, but with under 15px of slack, and
> cell 1's figure `4+ hrs → 30 mins` is similarly tight. Any copy change, any
> font-fallback flash, or a user font-size bump will overflow. **Recommendation:**
> drop `white-space:nowrap` from the *labels* (keep it on the figures) and let
> them wrap to two lines — subgrid already guarantees the labels stay aligned
> when one wraps. Raise with design before changing.

---

## 5. Height-based media queries

These are `max-height`, not `max-width`. They fire on short viewports at any
width — a 1440×700 laptop, a landscape tablet. All four are additive.

### `@media (max-height: 820px)` — verbatim

```css
@media (max-height:820px){
  .pf-page #pf-hero-panel{padding-top:56px;min-height:92svh}
  .pf-page #pf-hero-panel .pf-h1{font-size:4.25rem}
  .pf-page #pf-hero-panel .pf-stat-figure{font-size:21px!important}
  .pf-page #pf-hero-panel .pf-hero-sub{font-size:16px;margin-top:26px}
  .pf-page #pf-hero-panel .pf-hero-ctas{margin-top:32px}
  .pf-page #pf-hero-panel .pf-stat-cell{padding-top:16px!important}
}
```

What it does: nav clearance 88 → **56px**; `min-height` 88 → **92svh** (the panel
takes *more* of a short screen, not less); H1 4.75rem → **4.25rem (68px)**; stat
figure 24 → **21px**; sub margin-top 36 → **26px** (its `font-size:16px` is a
no-op, already 16px); CTA margin-top 44 → **32px**; stat-cell padding-top 22 →
**16px**.

Two `!important`s are needed because those two properties are set inline on the
elements. In the Next build, if the figure size and cell padding move out of
`style=""` and into classes, the `!important` can go — but the *values* stay.

### `@media (max-height: 900px)` — verbatim

```css
@media (max-height:900px){.pf-float-group{bottom:calc(100% + 18px);transform:scale(.66)}}
```

### `@media (max-height: 760px)` — verbatim

```css
@media (max-height:760px){.pf-float-group{bottom:calc(100% + 12px);transform:scale(.55)}}
```

### `@media (max-height: 620px)` — verbatim

```css
@media (max-height:620px){.pf-float-group{display:none}}
```

The float group therefore steps `scale(.78)` / 24px gap → `.66` / 18px →
`.55` / 12px → gone. **Source order matters**: 900, 760 and 620 are written after
the base `.pf-float-group` rule and in descending order, so on a 700px-tall
viewport both the 900 and 760 rules match and the later (760) wins. Preserve that
order, or convert to non-overlapping ranges
(`(max-height:900px) and (min-height:761px)` etc.) — either is fine, but the
resulting values must be the ones above.

> **Note for the build.** The 820px block is scoped `.pf-page #pf-hero-panel`;
> the float-group blocks are **not** scoped at all. In the artboard that is safe
> because the selectors are unique to the hero. Keep them hero-scoped in the
> Next build so nothing else on the page picks them up.

---

## 6. Mobile hero (<1024px)

### 6.1 Stage

```html
<section style="position:relative;overflow:hidden;padding:0 0 20px">
  <div style="position:relative;min-height:620px;padding:104px 20px 20px;
              margin-top:-64px;background:var(--m-forest)">
```

- `--m-forest` = `#15301F` → **`forest-900`**.
- **`min-height:620px`**, **`padding:104px 20px 20px`**, **`margin-top:-64px`**.
- The `-64px` pulls the stage up under the sticky mobile nav (which is
  `padding:12px 16px` around a 40px control = exactly 64px tall), so the photo
  runs behind it. The `104px` top padding = 64px nav + 40px of air.
  **Express both against one value**, e.g. `--nav-h: 64px`,
  `margin-top: calc(-1 * var(--nav-h)); padding-top: calc(var(--nav-h) + 40px)`.
  The nav is spec 01's; agree the token there.
- Outer `section` adds `padding:0 0 20px` below the stage.

### 6.2 Image + scrim

```html
<img src="/images/hero-mobile-shower.webp" alt=""
     style="position:absolute;left:0;right:0;top:56px;bottom:0;width:100%;
            height:calc(100% - 56px);object-fit:cover;object-position:58% 0%">
<span aria-hidden="" style="position:absolute;inset:0;
  background:linear-gradient(to top,
    color-mix(in oklab, var(--m-forest) 92%, transparent) 0%,
    color-mix(in oklab, var(--m-forest) 76%, transparent) 34%,
    color-mix(in oklab, var(--m-forest) 34%, transparent) 72%,
    transparent 96%)"></span>
```

- `object-position: 58% 0%` — horizontally off-centre, pinned to the top.
- The image starts at `top:56px` and is `calc(100% - 56px)` tall, leaving a 56px
  band of flat `forest-900` behind the very top of the nav.
- Mobile scrim stops differ from desktop: **92% / 76% / 34% / transparent** at
  **0% / 34% / 72% / 96%** (desktop is 88/74/34 at 0/32/66/92). Do not share one
  gradient between the two heroes.
- `next/image` `fill` + `priority`; it is the mobile LCP element.

> **Defect flag — the 56px vs 64px seam.** The nav is 64px tall; the image starts
> 56px down. There is an 8px strip where the nav's translucent background sits
> over flat `forest-900` instead of over the photo. Visible as a faint horizontal
> seam on some photos. Recommend `top:0; height:100%` (the scrim's 92% bottom
> stop already darkens the top band plenty) or `top: var(--nav-h)`. Design call.

### 6.3 Content column

```html
<div style="position:relative;display:flex;min-height:512px;
            flex-direction:column;justify-content:flex-end">
```

`min-height:512px` with `justify-content:flex-end` — the copy is bottom-aligned
inside the stage, so it sits on the darkest part of the scrim.

**Eyebrow:**

```html
<div class="m-eyebrow" style="align-self:flex-start;border-radius:6px;
     background:color-mix(in oklab, var(--m-forest) 50%, transparent);
     backdrop-filter:blur(6px);padding:6px 11px;color:#fff;
     white-space:nowrap;font-size:10.5px">AI assistant for landscapers</div>
```

`.m-eyebrow` is `font-family: Nunito; font-size:11px; font-weight:700;
letter-spacing:.14em; text-transform:uppercase` — the inline `font-size:10.5px`
wins. So: **10.5px / 700 / `.14em` / uppercase / `#fff`**.

Differences from desktop, all deliberate, all to be preserved:
**radius 6px not a pill; left-aligned not centred; `forest-900` at 50% not a
white gradient; blur(6px) not 14px; `.14em` not `.16em`; no text-shadow.**
Same copy: `AI assistant for landscapers`.

**H1:**

```html
<h1 class="m-h1" style="margin:12px 0 0;font-size:38px;color:#fff;
                        text-shadow:0 2px 18px rgba(0,0,0,.45)">Confyde builds your quotes. <span style="color:var(--m-lime)">Then helps you win them.</span></h1>
```

```css
.m-h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 600;
  font-variation-settings: 'wght' 600, 'SOFT' 60, 'opsz' 40;
  letter-spacing: -.01em;
  line-height: 1.06;
}
```

**The axes are different from desktop and that is on purpose:**
mobile `wght 600, SOFT 60, opsz 40` vs desktop `wght 420, SOFT 100, WONK 0,
opsz 10`. Heavier, less soft, larger optical size — because at 38px it is
competing with a photograph. `line-height` is also 1.06 vs 1.14. The project's
`.display` class already encodes exactly this split (mobile is the default, the
desktop axes take over at `width >= 1024px`), so **`.display` + an explicit
`font-size:38px` and `line-height:1.06` gives you the mobile H1 for free**.
`.display-1`'s base 2.75rem/1.14 is *not* right here — override both.

Copy: `Confyde builds your quotes. ` then a `<span style="color:var(--m-lime)">`
(`lime-500 #C8E84A`) wrapping `Then helps you win them.` **One span for the whole
second sentence — no per-word split and no `data-anim` on mobile.** Note the
trailing space after `quotes.` inside the plain text run; it is what separates the
two sentences when they share a line.

**Body copy** — completely different text from desktop:

```html
<p style="margin:16px 0 0;font-size:15.5px;line-height:1.55;color:#fff;
          text-shadow:0 1px 3px rgba(0,0,0,.5)">Confyde learns your prices, drafts your estimates, and sends a branded proposal in minutes. Then it tells you who to chase, so more of the jobs you quote turn into money in the bank.</p>
```

Verbatim: `Confyde learns your prices, drafts your estimates, and sends a branded proposal in minutes. Then it tells you who to chase, so more of the jobs you quote turn into money in the bank.`

15.5px / `line-height:1.55` / `#fff` / `text-shadow:0 1px 3px rgba(0,0,0,.5)` /
`margin-top:16px`. No `<br>`, no bold run, no `&nbsp;`.
This is the same string as the site's `metadata.description` in `app/layout.tsx`.

**CTAs** — both full-width links, stacked, both 52px tall:

Primary (`margin-top:22px`):

```
display:flex;height:52px;align-items:center;justify-content:center;gap:10px;
border-radius:12px;background:var(--m-lime);font-size:16.5px;font-weight:700;
color:var(--m-forest);box-shadow:0 8px 20px -10px rgba(21,48,31,.5)
```

Label **`Try Confyde free`** + a 18px arrow-right glyph
(`stroke-width:2.4`, round caps/joins) → **Lucide `ArrowRight`**.
Note the shadow alpha is `.5` here vs `.4` on desktop.

Secondary (`margin-top:10px`):

```
display:flex;height:52px;align-items:center;justify-content:center;gap:10px;
border-radius:12px;background:rgba(255,255,255,.12);backdrop-filter:blur(12px);
box-shadow:0 0 0 1px rgba(255,255,255,.28) inset;font-size:16.5px;
font-weight:700;color:#fff
```

Label **`Book a demo`** + a 17px calendar glyph
(`rect x=3 y=4 w=18 h=18 rx=2` + `M16 2v4M8 2v4M3 10h18`, `stroke-width:2.2`)
→ **Lucide `Calendar`**.

> Mobile's second CTA is **`Book a demo`**; desktop's is **`See how it works`**.
> Different label, different icon, different destination. This looks intentional
> (a phone user is likelier to book than to watch), but it means the two heroes
> offer different secondary actions — confirm with design, do not unify.

**Trailing lines**, both inside the flex column, both centred:

```html
<span style="margin-top:14px;text-align:center;font-size:14px;font-weight:700;color:#fff">Runs your end-to-end sales system.</span>
<span style="margin-top:6px;text-align:center;font-size:12.5px;color:color-mix(in oklab,#fff 86%,transparent)">*90 seconds. No card.</span>
```

- `Runs your end-to-end sales system.` — 14px / 700 / `#fff` / `margin-top:14px`.
  Desktop's equivalent bold run is `Runs your complete end-to-end sales system.`
  — mobile drops **`complete`**. Preserve the difference.
- `*90 seconds. No card.` — 12.5px, `color-mix(in oklab, #fff 86%, transparent)`,
  `margin-top:6px`. Desktop sets the same string at **10px** and
  `rgba(255,255,255,.88)`. Preserve both.

### 6.4 What mobile does **not** have

No float cards, no float group, no stat strip, no radial vignette, no
`data-anim` reveals anywhere in the hero, no `svh`. Do not port them down.

---

## 7. The 320→1023px fluid behaviour  **[Designer decision]**

The mobile artboard is a fixed 430px column with zero media queries. Below is how
those numbers behave across the real range. Everything not listed stays at its
artboard px value.

**Column.** The stage is full-bleed at every width. The content column is
`width:100%; max-width:560px; margin-inline:auto`. Above 560px the copy centres
in the stage rather than stretching — at 1000px wide a 15.5px paragraph running
edge to edge is ~140 characters per line, which is unreadable and is not a look
the artboard ever proposes.

**Side padding.** `20px` from 320px, stepping to `32px` at ≥640px:
`padding-inline: 20px;` and `@media (width >= 640px) { padding-inline: 32px }`.
Applied to the stage; the 560px column centres inside whatever is left.

**Stage height.** `min-height: max(620px, 78svh)`. 620px is the artboard floor;
78svh keeps the photograph proportionate on a tall tablet. The inner column keeps
`min-height:512px` unchanged — it is a floor, and `justify-content:flex-end` does
the rest.

**H1.** `font-size: clamp(30px, 8.84vw, 38px)`.
At 430px that is exactly 38.0px (the artboard value); at 320px it clamps to 30px;
at 430px and above it holds at 38px. `line-height:1.06` and the mobile Fraunces
axes are unchanged at every width below 1024.

**Body copy.** Fixed at 15.5px. It is already comfortable at 320px and the 560px
column caps the measure.

**CTAs.** Stay stacked and full-width of the column at every width below 1024,
52px tall. They are the primary action on a touch device; a 560px-wide 52px
target is not a problem, and splitting them into a row would invent a layout that
exists in neither artboard.

**`object-position`.** `58% 0%` up to 640px. From 640px, `50% 0%` — the 58%
offset exists to keep the subject out from under a narrow phone's copy block;
in a wider frame it pushes the subject off-centre. One media query:
`@media (width >= 640px) { object-position: 50% 0% }`.

**The `-64px` nav pull and the 56px image inset** do not scale. They are tied to
the mobile nav's height and must track it, not the viewport.

**At exactly 1024px** the desktop hero takes over whole. There is no intermediate
composition, and there is no width at which float cards or the stat strip appear
in the mobile layout.

---

## 8. Accessibility

**Heading level.** One `<h1>` per page and it lives here. The desktop H1's nine
word `<span>`s and the mobile H1's colour `<span>` are presentational — do not
add `role`, `aria-label` or `aria-hidden` to any of them. Screen readers
concatenate the text nodes, so the literal spaces between the desktop word spans
are what keep `Confydebuildsyourquotes.` from happening. **Test this** with
VoiceOver, not by eye.

Render exactly one `<h1>` in the DOM. If both heroes ship as
`hidden desk:flex` / `desk:hidden` siblings, the hidden one is still in the
accessibility tree unless it is `display:none` — Tailwind's `hidden` is
`display:none`, so `hidden desk:flex` is safe; `opacity-0` or `sr-only` is not.

**Images.** Both background photographs are decorative: `alt=""` on
`hero-lifestyle.webp` and `hero-mobile-shower.webp`, exactly as the artboards
have them. They carry no information the copy does not. Do not write alt text for
them. `photo-1.webp` inside float cards 1 and 2 is likewise `alt=""` — and the
entire `.pf-float-stack` is `aria-hidden="true"` anyway, so the cards contribute
nothing to the accessibility tree. That is correct: every figure they show
($48,200, 14 Beach Rd, the read times) is decorative repetition of content that
appears in full further down the page.

**The stat strip is NOT `aria-hidden`.** It is real content. Each cell reads as
"4+ hrs → 30 mins, to build a client-ready quote". The `→` (U+2192) is announced
as "right arrow" by most screen readers, which is acceptable here — it reads as
"4 plus hours right arrow 30 minutes". If QA finds that confusing, the fix is a
visually-hidden "to" between the figures, not removing the glyph.

**Reveal system.** Use `<Reveal>` from `components/primitives/reveal.tsx` for
every `data-anim` element listed above, passing `anim`, `delay` and `duration`
straight from the tables. Do not hand-roll the classes. `useReveal` must be
mounted at the page root (it already is, via `PageEffects`).

**Reduced motion.** `styles/motion/reveal.css` already pins every `.reveal-*` to
`opacity:1; filter:none; transform:none; animation:none` under
`prefers-reduced-motion: reduce`. The **float-card cycle is a separate
animation** and is not covered by that file — you must add its own reduced-motion
block (§3.3): `animation:none` on all four, card 0 held visible at
`rotate(-2.5deg)`. A 24s infinite 3D flip loop running for a user who asked for
reduced motion is a real WCAG 2.2 problem (2.3.3 Animation from Interactions),
not a nicety. This must be in the QA pass.

**Contrast of white text on the photograph.** The scrims are load-bearing, not
decoration. Check after the real photo ships, at the real breakpoints:

| Element | Colour | Required |
| --- | --- | --- |
| H1 line 1 | `pf-ink-100` (≈`#F4F2ED`) at 76px | 3:1 (large text) |
| H1 line 2 | `lime-500 #C8E84A` at 76px | 3:1 (large text) |
| Sub-paragraph | `#fff` at 16px/500 | **4.5:1** |
| Eyebrow | `#fff` at 12.5px/700 | **4.5:1** |
| `*90 seconds. No card.` | `rgba(255,255,255,.88)` at **10px** | **4.5:1** |
| Stat labels | `rgba(255,255,255,.6)` at 12.5px | **4.5:1** |
| `Try Confyde free` | `pf-ink-900` on `lime-500` | 4.5:1 (passes, ~9:1) |

Two of these are at real risk:

- **Stat labels at `rgba(255,255,255,.6)`.** Against the scrim's bottom stop
  (forest-900 at 88%, composited over the photo) that is roughly 4.4:1 — right on
  the line, and it will fail outright anywhere the photo is bright behind it.
  Measure it with a sampled screenshot, not a calculator. If it fails, raise to
  `rgba(255,255,255,.72)`; the visual difference is small.
- **`*90 seconds. No card.` at 10px.** 10px is below any sane minimum and the
  `.88` alpha does not help. Mobile sets the same string at 12.5px. **Recommend
  12px minimum on desktop.** Flagging, not fixing — design call.

The radial vignette (§1.4) exists specifically to buy contrast behind the copy
column. Do not remove or soften it when tuning the photograph.

**Focus.** Both CTAs are interactive. The artboard defines no focus style at all
for them. Give them a visible focus ring that survives the dark background —
`focus-visible:outline-2 outline-offset-2 outline-lime-500` or similar. Note the
brand doc bans lime focus rings ("no lime … focus rings") and reserves sage for
form focus; sage `#7FA05A` on a dark forest scrim is too low-contrast to be a
usable ring here. **Raise this with design** — it is the one place the brand rule
and WCAG 2.4.11 pull in opposite directions.

---

## 9. Defects in the source

Flagged, not fixed. Each needs a design or brand call before the build changes it.

1. **Lime headline (§2.2).** Five H1 words in lime contradicts "a heading is a
   heading through family, weight and size, not colour" and lime's four
   sanctioned roles. Build as drawn; log the exception.
2. **Lime keyline on every float card (§3.2).**
   `box-shadow: 0 0 0 1.5px var(--color-lime-500)` is a decorative lime border,
   which `docs/brand.md` bans outright ("No … decorative borders"). It is also
   the only 1.5px hairline on the page. Build as drawn; log it.
3. **`.shadow-overlay` is dead on the float cards (§3.2)** and `.btn-glass`'s
   hairline is dead on the secondary CTA (§2.4) — in both cases a later/inline
   `box-shadow` replaces the class's. Either drop the redundant class or merge
   the shadows. Currently the glass button has no white hairline at all, which is
   probably not what was drawn.
4. **`white-space:nowrap` on the stat labels (§4).** Under 15px of slack at
   1024px. One copy edit or a font fallback and cell 4 overflows.
5. **`#ACAFB1` in float card 2 (§3.4).** A cool grey with no token and no place
   in the category taxonomy, sitting among four category colours.
6. **`border-radius:12px` on 6px dots (§3.4).** Should be `9999px`.
7. **Undefined CSS variables throughout the float cards (§3.4).**
   `var(--font-sans)`, `var(--font-serif)` and every `var(--color-*)` are
   undeclared in the web artboard; only the hex fallbacks render, and
   `--font-sans`/`--font-serif` have no fallback at all, so those cards are
   currently rendering in the browser default serif/sans. Map them explicitly.
8. **Non-Lucide play glyph on the desktop secondary CTA (§2.4).** Inline
   `M8 5v14l11-7z`. Swap for Lucide `Play`.
9. **`!` in the sub-paragraph (§2.3).** "…and margins - the lot!" — the brand doc
   permits "no exclamation marks (except one at a milestone)". A hero sub-head is
   not a milestone. Copy call.
10. **Straight vs curly apostrophes (§2.3, §3.4).** `it's` (U+0027) in the
    sub-paragraph; `She’s` / `hasn’t` (U+2019) in float card 3. Pick one —
    curly — and normalise.
11. **The 56px / 64px seam on mobile (§6.2).**
12. **Desktop and mobile secondary CTAs differ (§6.3):** `See how it works` vs
    `Book a demo`.
13. **`*90 seconds. No card.` is 10px on desktop, 12.5px on mobile (§6.3, §8).**
14. **Desktop drops nothing, mobile drops `complete` (§6.3):**
    `Runs your complete end-to-end sales system.` vs
    `Runs your end-to-end sales system.`
15. **No focus styles anywhere in the hero (§8).**

---

## 10. QA checklist

### Structure

- [ ] Exactly one `<h1>` in the rendered DOM at every viewport width.
- [ ] Desktop wrapper chain is four deep: `overflow-x:clip` → `overflow-x:clip` →
      `section.shadow-border-strong.bg-pf-surface-500` → `#hero-panel`.
- [ ] `#hero-panel`: `min-height:88svh` (**`svh`**, not `vh`/`dvh`),
      `max-width:1920px`, `padding-top:88px`, `overflow:hidden`.
- [ ] Background layer's flash colour is `#20361f`, not `forest-900`.
- [ ] Copy column is `max-width:1000px`; stat wrapper is `max-width:1120px`.

### Desktop copy

- [ ] Eyebrow reads `AI assistant for landscapers`, 12.5px/700,
      **`letter-spacing:.16em`** (not `.14em` — i.e. not the `.eyebrow` class).
- [ ] H1 line 1 = `Confyde builds your quotes.` in `pf-ink-100`.
- [ ] H1 line 2 = `Then helps you win them.`, **all five words** `lime-500`.
- [ ] The nine `data-delay` values are exactly
      `0.000 0.045 0.090 0.135` / `0.200 0.245 0.290 0.335 0.380`.
- [ ] Word spans have **no** `data-duration` (they inherit 0.5s).
- [ ] Spaces survive between word spans — select the H1 and paste into a text
      editor; it must read `Confyde builds your quotes. Then helps you win them.`
- [ ] Sub-paragraph matches §2.3 character for character, including the bare `-`
      before "the lot", the `<br>`, the `<b>` run, and the **`&nbsp;`** in
      `Runs your complete`.
- [ ] Primary CTA `Try Confyde free`, 44px, radius 12, `padding:0 40px`,
      `lime-500` on `pf-ink-900`, `.btn-lime` hover works.
- [ ] Fine print `*90 seconds. No card.` — 10px, `rgba(255,255,255,.88)`,
      10px below the button.
- [ ] Secondary CTA `See how it works` + Lucide `Play`, 44px, `.btn-glass`.

### Float cards

- [ ] Four cards, `data-fc="0".."3"`, all in `grid-area:1/1`, `align-self:end`.
- [ ] Stack parent has `perspective:1100px` and `aria-hidden="true"`.
- [ ] Group: `bottom:calc(100% + 24px)`, `transform:scale(.78)`,
      `transform-origin:left bottom`, `width:288px`,
      `max-width:calc(100vw - 56px)`.
- [ ] Keyframe is byte-identical to §3.3: stops at 0 / 3 / 22 / 25.5 / 100%.
- [ ] `animation: 24s cubic-bezier(.22,1,.36,1) infinite`; delays 0 / 6 / 12 / 18s.
- [ ] Watch one full 24s loop: exactly one card visible at a time, order
      0 → 1 → 2 → 3, ~6s each, then it repeats seamlessly.
- [ ] Every figure on the cards comes from `content/home.ts`, none retyped.
- [ ] Card 1's photo scrim is a **24deg** gradient.
- [ ] Card 2's seven bar widths and four blob positions match the tables in §3.4.
- [ ] Card 3's apostrophes are curly (`She’s`, `hasn’t`).

### Stat strip

- [ ] Parent is `grid-template-columns:repeat(4,1fr); grid-template-rows:auto auto`
      with `border-top:1px solid rgba(255,255,255,.15)`.
- [ ] Each cell is `grid-row:span 2; grid-template-rows:subgrid` — **verify in
      DevTools that subgrid is actually applied**, not emulated with flex.
- [ ] Cell 1 has no `border-left` and `padding:22px 28px 0 0`; cells 2–4 each
      have `border-left:1px solid rgba(255,255,255,.15)`; cell 4 is
      `padding:22px 0 0 28px`.
- [ ] Reveal delays 0.6 / 0.68 / 0.76 / 0.84, all duration 0.5.
- [ ] Figures carry `font-variation-settings:'wght' 500,'SOFT' 100,'opsz' 40` at
      24px — confirm in DevTools computed styles, not by eye.
- [ ] The four figure/label pairs match §4 verbatim, including the `→` (U+2192).
- [ ] Artificially lengthen cell 4's label and confirm the overflow behaviour is
      whatever design decided (defect 4).

### Height media queries

Resize the window by **height** and check each threshold:

- [ ] At 819px tall: panel `padding-top:56px`, `min-height:92svh`; H1 68px;
      stat figure 21px; sub `margin-top:26px`; CTAs `margin-top:32px`;
      stat cells `padding-top:16px`.
- [ ] At 899px tall: float group `scale(.66)`, gap 18px.
- [ ] At 759px tall: float group `scale(.55)`, gap 12px.
- [ ] At 619px tall: float group `display:none`.
- [ ] At 700px tall the **760px** rule wins, not the 900px one.
- [ ] These fire at 1440px wide too — they are `max-height`, not `max-width`.

### Mobile

- [ ] Stage: `min-height:620px`, `padding:104px 20px 20px`, `margin-top:-64px`,
      `background:forest-900`.
- [ ] The photo runs behind the sticky nav — scroll to the very top and confirm
      the nav is translucent over the image.
- [ ] `hero-mobile-shower.webp`, `object-position:58% 0%`, `top:56px`,
      `height:calc(100% - 56px)`.
- [ ] Mobile scrim stops are 92/76/34 at 0/34/72/96 — **different from desktop**.
- [ ] Eyebrow: radius **6px**, left-aligned, 10.5px, `.14em`,
      `forest-900` at 50% + `blur(6px)`.
- [ ] H1 computed `font-variation-settings` is **`'wght' 600, 'SOFT' 60,
      'opsz' 40`** and `line-height:1.06` — *not* the desktop axes. Check in
      DevTools at 1023px and again at 1024px; they must differ.
- [ ] Mobile body copy is the `Confyde learns your prices…` string, not the
      desktop one.
- [ ] CTAs are `Try Confyde free` (+ Lucide `ArrowRight`) and `Book a demo`
      (+ Lucide `Calendar`), both 52px, stacked, full-width.
- [ ] Trailing lines: `Runs your end-to-end sales system.` (14px/700) then
      `*90 seconds. No card.` (12.5px). Note mobile omits `complete`.
- [ ] No float cards, no stat strip, no vignette, no `data-anim` below 1024px.

### Fluid range

- [ ] 320px: no horizontal scroll; H1 is 30px; nothing clipped; CTAs reachable.
- [ ] 430px: H1 measures 38px — matches the artboard exactly.
- [ ] 640px: side padding steps to 32px; `object-position` steps to `50% 0%`.
- [ ] 768px and 1023px: content column capped at 560px and centred.
- [ ] 1023px → 1024px: the composition swaps wholesale, no intermediate state.

### Motion & accessibility

- [ ] With `prefers-reduced-motion: reduce`: **no word reveal, no up-blur, and
      the float cards do not flip.** Card 0 is visible at `rotate(-2.5deg)`;
      cards 1–3 are hidden. This is the one that is easy to miss.
- [ ] Without reduced motion, the hero reveal sequence runs once on load and does
      not replay on scroll-back.
- [ ] Both hero photographs have `alt=""`.
- [ ] `.float-stack` is `aria-hidden="true"`; the stat strip is **not**.
- [ ] VoiceOver / NVDA reads the H1 as one clean sentence pair.
- [ ] Keyboard: Tab reaches both CTAs and a focus ring is clearly visible against
      the photograph at both breakpoints.
- [ ] Sample the built page and measure contrast for every row in §8's table,
      especially the stat labels at `rgba(255,255,255,.6)` and the 10px fine
      print.
- [ ] LCP element is the hero photo and it is `priority` / preloaded; check
      Lighthouse on a throttled mobile profile.
