# 01 — Navigation and floating bars

Build spec for the site header (both breakpoints), the desktop floating bars, and
the mobile sticky bottom bar.

**Sources of record**

Both artboards ship inside `design-source/Bramble HomepageProduct PageMobile Web.zip`.
Unzip it and the two `.dc.html` files named below are at the archive root. Every
line number in this document is against those files as they exist in the archive.

| Thing | File (inside the archive) | Lines |
| --- | --- | --- |
| Desktop nav markup | `Bramble Home Web.dc.html` | 343–363 |
| Desktop nav CSS | same, `<style>` in `<helmet>` | 43, 50–65 |
| Desktop floating bars markup | same | 1977–2000 |
| Desktop scroll JS | same, `<script type="text/x-dc">` | 2046–2051, 2061 |
| Mobile nav markup | `Bramble Home Mobile.dc.html` | 102–108 |
| Mobile nav CSS | same, `<style>` in `<helmet>` | 46–49 |
| Mobile sticky bottom bar | same | 997–1004 |
| Mobile scroll JS | same, `<script type="text/x-dc">` | 1008–1023 |

**Conventions used below**

- Everything under a heading marked **[ARTBOARD]** is measured off the design and
  must ship pixel-identical.
- Everything marked **[RECOMMENDATION]** is not in the artboard. It is labelled,
  and the reason is stated. Nothing else in this document is invented.
- Tokens are the ones already in `app/globals.css`; utilities the ones already in
  `styles/base.css`. Where the artboard hard-codes a hex that equals a token, the
  token name is given and the token must be used.
- Breakpoint: `desk` = 1024px. Below it the mobile artboard runs, at and above it
  the desktop artboard runs. There is no third layout.

---

## 0. Component split and mutual exclusion

Two headers and two bar systems exist. They are never on screen together.

| Component | Visible | Tailwind |
| --- | --- | --- |
| `<SiteHeaderDesktop>` | ≥1024px | `hidden desk:block` |
| `<SiteHeaderMobile>` | <1024px | `desk:hidden` |
| `<FloatingBars>` (desktop) | ≥1024px | `hidden desk:block` |
| `<StickyBottomBar>` (mobile) | <1024px | `desk:hidden` |

`display:none` removes an element from the accessibility tree, so rendering both
headers does **not** expose two `Main` navigation landmarks. Do not add
`aria-hidden` on top of `hidden` — that is redundant and will trip axe's
"aria-hidden focusable" rule if the hidden tree is ever made visible.

Both bar systems are dismissible/scroll-driven overlays. Only one may ever be
mounted per breakpoint.

---

## 1. Desktop nav — ≥1024px

### 1.1 Positioning and box [ARTBOARD]

The header is a floating capsule bar, **fixed**, horizontally centred, sitting
20px below the top of the viewport. It is not full-bleed and it has no background
of its own — the two pills inside it carry all the surface.

```html
<header id="pf-nav" class="on-dark"
        style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:50;width:1320px;max-width:calc(100% - 16px)">
```

- `position: fixed`
- `top: 20px`
- `left: 50%` + `transform: translateX(-50%)`
- `z-index: 50`
- `width: 1320px`
- `max-width: calc(100% - 16px)`

The header element itself has **no** padding, background, border or shadow.

Inner row:

```html
<nav aria-label="Main" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
```

- `display: flex; align-items: center; justify-content: space-between; gap: 12px`

**Measured height.** Pill vertical padding is 3px top and bottom; the tallest pill
child is a 15px/600 link at the inherited `line-height: 1.5` = 22.5px plus 5px
padding top and bottom = 32.5px. Pill height ≈ **38.5px**; the header's bottom
edge therefore sits ≈ **58.5px** from the top of the viewport. This number matters
in §3 — it is what "the nav is over the dark hero" actually means.

**Fit at 1024px.** At the narrowest desktop viewport the header is
`1024 − 16 = 1008px` wide and the two pills measure ≈465px and ≈363px with a 12px
gap — ≈840px total. The nav does not wrap, shrink or overflow at 1024px. Do not
add responsive shrinking inside the desktop layout; there is none in the design.

### 1.2 Left pill — brand + sections [ARTBOARD]

```html
<div class="pf-pill" style="display:flex;align-items:center;gap:8px;border-radius:12px;padding:3px 6px 3px 5px">
```

- `display: flex; align-items: center; gap: 8px`
- `border-radius: 12px` (`--radius-xl`)
- `padding: 3px 6px 3px 5px` — note the asymmetry: 5px left, 6px right.

Children, in order:

**1. Wordmark link**

```html
<a href="#pf-top" aria-label="Confyde home" style="display:flex;height:30px;align-items:center;padding:0 8px"><span class="pf-logo">Confyde</span></a>
```

- `display: flex; height: 30px; align-items: center; padding: 0 8px`
- Inner span uses `.pf-logo`, which is exactly the project's `.wordmark`:
  `font-family: var(--font-logo)` (Asap), `font-weight: 800`, `font-size: 1.5rem`
  (24px), `line-height: 1`, `letter-spacing: -0.02em`.
- Copy: `Confyde`
- This is the **only** real destination in the whole header. In the artboard it
  points at the in-page anchor `#pf-top`; in the build it is `<Link href="/">`.

**2. Divider**

```html
<span style="height:16px;width:1px;background:rgba(255,255,255,.3)"></span>
```

- `height: 16px; width: 1px; background: rgba(255,255,255,.3)`
- ⚠️ **Artboard defect — must be fixed.** This colour is inline, so it does not
  respond to `.on-light`. On the white pill a 30%-white hairline is invisible.
  Required fix: drive it from the nav state, `rgba(255,255,255,.3)` on dark and
  `var(--color-hairline)` (`#dfd8c8`) on light, transitioning on the same
  `.3s` as the pill. Same fix applies to the right pill's divider (§1.3).

**3. Link group**

```html
<span style="display:flex;gap:10px">
```

- `display: flex; gap: 10px`

Three links, all identical in box:

```html
<a href="#" class="pf-navlink" style="display:flex;align-items:center;gap:6px;border-radius:6px;padding:5px 14px;font-size:15px;font-weight:600;transition:color .2s,background .2s">
```

- `display: flex; align-items: center; gap: 6px`
- `border-radius: 6px` (`--radius-md`)
- `padding: 5px 14px`
- `font-size: 15px; font-weight: 600` (Nunito Sans, `--font-body`)
- `transition: color .2s, background .2s`

| Label (verbatim) | Trailing chevron |
| --- | --- |
| `Product` | yes |
| `Customers` | yes |
| `Pricing` | **no** |

The chevron is inlined as:

```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
```

That path is Lucide **`chevron-down`**. Use `<ChevronDown size={14} strokeWidth={2} aria-hidden="true" />` from `lucide-react`. Do not hand-inline the SVG.

### 1.3 Right pill — demo, login, signup [ARTBOARD]

```html
<div class="pf-pill" style="display:flex;align-items:center;gap:4px;border-radius:12px;padding:3px 6px 3px 5px">
```

Same pill box as the left, except **`gap: 4px`** (not 8px).

Children, in order:

**1. `Book a Demo`**

```html
<a href="#" class="pf-navlink" style="display:flex;align-items:center;border-radius:6px;padding:5px 12px;font-size:15px;font-weight:600;transition:color .2s,background .2s;white-space:nowrap">Book a Demo</a>
```

- `padding: 5px 12px` (12px, not the left pill's 14px)
- `white-space: nowrap`
- No chevron, no `gap`.

**2. Divider** — identical to §1.2 item 2, same defect, same fix.

**3. `Login`**

```html
<a href="#" class="pf-navlink" style="display:flex;align-items:center;gap:6px;border-radius:6px;padding:5px 12px;font-size:15px;font-weight:600;transition:color .2s,background .2s">Login <svg …chevron-down…></svg></a>
```

- `padding: 5px 12px`, `gap: 6px`, Lucide `chevron-down` at 14px.

**4. Signup button**

```html
<a href="#" id="pf-nav-signup" class="pf-signup pf-btn-glass" style="display:inline-flex;height:30px;align-items:center;justify-content:center;gap:8px;border-radius:12px;box-shadow:0 6px 16px -8px rgba(0,0,0,.4);padding:0 16px;font-size:14px;font-weight:700;white-space:nowrap">Get started
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8l4 4-4 4"></path><path d="M2 12h20"></path></svg>
</a>
```

- `display: inline-flex; height: 30px; align-items: center; justify-content: center; gap: 8px`
- `border-radius: 12px` (`--radius-xl`)
- `box-shadow: 0 6px 16px -8px rgba(0,0,0,.4)` — **inline, and it persists in
  both states** (see §1.5).
- `padding: 0 16px`
- `font-size: 14px; font-weight: 700`
- `white-space: nowrap`
- Copy: `Get started`
- Icon path is Lucide **`move-right`**. Use `<MoveRight size={16} strokeWidth={2} aria-hidden="true" />`.

### 1.4 `.on-dark` vs `.on-light` — the exact rule sets [ARTBOARD]

Quoted verbatim from the artboard `<style>` block, lines 56–65:

```css
/* nav flip */
#pf-nav .pf-pill{transition:background .3s,box-shadow .3s}
#pf-nav.on-dark .pf-pill{background-image:linear-gradient(to bottom,rgb(255 255 255/.1),rgb(255 255 255/.05));backdrop-filter:blur(12px);box-shadow:0 0 0 1px rgb(255 255 255/.07) inset,0 1px 1px rgb(255 255 255/.04) inset,0 2px 8px rgb(0 0 0/.1)}
#pf-nav.on-light .pf-pill{background:#fff;box-shadow:0 0 0 1px var(--pf-ink-200),0 3px 8px -3px color-mix(in oklch,var(--pf-ink-900) 8%,transparent)}
#pf-nav.on-dark .pf-navlink{color:var(--pf-ink-100)}
#pf-nav.on-light .pf-navlink{color:var(--pf-ink-900)}
#pf-nav.on-dark .pf-navlink:hover{background:rgb(255 255 255/.08)}
#pf-nav.on-light .pf-navlink:hover{background:var(--pf-ink-100)}
#pf-nav.on-dark .pf-logo{color:#fff}#pf-nav.on-light .pf-logo{color:var(--color-charcoal-900,#1D2A20)}
#pf-nav.on-dark .pf-signup{color:var(--pf-ink-100)}
#pf-nav.on-light .pf-signup{color:var(--pf-ink-100)}
```

Notes an engineer needs:

- `--pf-ink-100`, `--pf-ink-200`, `--pf-ink-900` map 1:1 to this project's
  `--color-pf-ink-100/200/900`. `var(--color-charcoal-900,#1D2A20)` is an
  undefined variable in the artboard falling through to its own hex; in this
  project `--color-charcoal-900` **is** defined as `#1d2a20`, so use
  `text-charcoal-900`.
- `#pf-nav.on-dark .pf-pill` is byte-identical to the standalone `.pf-pill-glass`
  helper (artboard line 54). One glass recipe, two call sites.
- The `.on-dark` pill is a **gradient** (`background-image`), the `.on-light` pill
  is a **flat `background`**. The `transition: background .3s` shorthand covers
  `background-image`, so the gradient does cross-fade to white correctly. Keep the
  shorthand; transitioning only `background-color` will snap.
- `backdrop-filter: blur(12px)` is **not** in the transition list. It appears and
  disappears instantly at the flip. That is the artboard behaviour; keep it.
  ⚠️ In Safari this must also be written `-webkit-backdrop-filter`.
- `#pf-nav.on-light .pf-signup` sets the same colour as `.on-dark`. It is a no-op
  by design: the signup label stays near-white in both states because in the
  light state it sits on the dark `.btn-ink` fill. Keep the rule; it documents
  intent and guards against a future `.on-light` colour cascade.
- `.on-light .pf-navlink:hover` uses `--pf-ink-100` as a **background** — the pale
  warm hover wash on white, matching the brand's "hover tints a greige surface".

**Port target.** Reproduce these as a small scoped block in `styles/base.css` (or
a co-located `styles/nav.css`) keyed off `[data-nav-state="dark"|"light"]` on the
header, rather than two classnames toggled by hand — but the property values must
be exactly the above.

### 1.5 The signup glass ↔ ink swap [ARTBOARD]

The signup button is the one element that changes *component*, not just colour.

- `.on-dark` → the button carries `pf-btn-glass`.
- `.on-light` → the button carries `pf-btn-ink`.

The swap is done in JS (§3.1), not CSS: the class is added/removed on
`#pf-nav-signup`.

```css
.pf-btn-glass{background-color:rgb(255 255 255/.08);box-shadow:0 0 0 1px rgb(255 255 255/.2),0 1px 1px rgb(255 255 255/.06) inset,0 2px 6px rgb(0 0 0/.12);transition:background-color .2s,box-shadow .2s}
.pf-btn-glass:hover{background-color:rgb(255 255 255/.12)}
.pf-btn-ink{background-color:var(--pf-ink-700);background-image:linear-gradient(to top,var(--pf-ink-800),var(--pf-ink-700));background-repeat:no-repeat;background-position:bottom;background-size:100% 100%;transition:background-size .2s,box-shadow .2s;border-radius:12px!important;box-shadow:0 8px 20px -10px rgba(21,48,31,.4)}
.pf-btn-ink:hover{background-size:100% 50%}
```

These are the project's `.btn-glass` and `.btn-ink` in `styles/base.css`, with two
differences that matter:

1. **`border-radius:12px!important`.** The artboard's `.pf-btn-ink` forces 12px
   with `!important`, which beats an inline `border-radius`. The project's
   `.btn-ink` sets `border-radius: var(--radius-xl)` (= 12px) without
   `!important`. For the nav signup this is harmless (its inline radius is also
   12px) but it is **not** harmless for the floating CTA bar — see §4.4.
2. **Box-shadow precedence.** `.btn-ink` declares
   `box-shadow: 0 8px 20px -10px rgb(21 48 31 / 0.4)` in a class; the signup
   declares `box-shadow: 0 6px 16px -8px rgba(0,0,0,.4)` **inline**. Inline wins.
   So in the ink state the signup renders the *inline* shadow, not the `.btn-ink`
   shadow. Reproduce that: the signup keeps `0 6px 16px -8px rgba(0,0,0,.4)` in
   both states and the `.btn-ink` shadow never applies to it.

There is no radius, size, padding or type change across the swap. Only fill and
shadow move. This is consistent with the brand's "press is colour only".

### 1.6 Destinations [ARTBOARD + REQUIRED BEHAVIOUR]

Every `href` in the desktop nav except the wordmark is `href="#"`. **Only the
homepage exists.** The build must not ship eight dead links.

Rule:

| Element | Build |
| --- | --- |
| `Confyde` wordmark | `<Link href="/">` — real |
| `Product`, `Customers`, `Pricing`, `Book a Demo`, `Login`, `Get started` | inert |

**How "inert" is built.** Render each as:

```tsx
<button type="button" aria-disabled="true" data-inert className={navLinkClass}>
```

- `<button type="button">` — keyboard-focusable in natural tab order, announced as
  a button, does not navigate, does not put `#` in the URL bar, does not trigger a
  scroll-to-top.
- `aria-disabled="true"` (**never** the `disabled` attribute — `disabled` removes
  it from the tab order, and the brief requires keyboard focus).
- No visual change vs. the artboard. `cursor: default` rather than `pointer`, so
  it does not promise a navigation it cannot make.
- No `onClick`. Clicking is a silent no-op; nothing errors, nothing scrolls.

Put all six behind one `<NavItem inert>` component so that when real routes land
the switch is a single prop, not a sweep.

**Open question for the owner, not for the engineer:** if a real hosted signup URL
already exists, `Get started` (desktop), `Try Confyde free` (mobile bottom bar)
and `Get started free` (desktop CTA bar) should point at it instead of being
inert. Do not guess a URL.

---

## 2. Mobile nav — <1024px

### 2.1 Positioning and box [ARTBOARD]

Unlike desktop this is a **sticky, full-bleed** bar with its own translucent
surface. It is not a floating capsule.

```html
<header id="m-nav" class="on-dark" style="position:sticky;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:10px;background:linear-gradient(to bottom,rgba(21,48,31,.42),rgba(21,48,31,.28));backdrop-filter:blur(16px) saturate(1.15);-webkit-backdrop-filter:blur(16px) saturate(1.15);box-shadow:0 1px 0 rgba(255,255,255,.1) inset;padding:12px 16px">
```

- `position: sticky; top: 0; left: 0; right: 0`
- `z-index: 60` (note: **higher** than the desktop nav's 50, and one below the
  mobile bottom bar's 70)
- `display: flex; align-items: center; justify-content: space-between; gap: 10px`
- `background: linear-gradient(to bottom, rgba(21,48,31,.42), rgba(21,48,31,.28))`
  — `rgb(21,48,31)` is `--color-forest-900` `#15301f`. Write it as
  `linear-gradient(to bottom, color-mix(in srgb, var(--color-forest-900) 42%, transparent), color-mix(in srgb, var(--color-forest-900) 28%, transparent))`
  so the token is the source of truth.
- `backdrop-filter: blur(16px) saturate(1.15)` and the `-webkit-` twin. Both are
  required; the artboard writes both.
- `box-shadow: 0 1px 0 rgba(255,255,255,.1) inset` — a 1px white inner top
  highlight, not a drop shadow.
- `padding: 12px 16px`

**Measured height: exactly 64px** (12 + 40 + 12). This number is load-bearing in
three places: the hero's `margin-top: -64px`, the `on-light` threshold in §3.2,
and the IntersectionObserver `rootMargin`. If nav padding ever changes, all three
change together.

**Relationship to the hero.** The nav is `sticky`, so it occupies 64px of flow;
the hero section immediately after it carries `margin-top: -64px` (artboard line
111) which cancels that flow space, so the dark hero starts at document y=0 and
the nav floats over it. The hero's own `padding-top: 104px` is what keeps its
content clear of the nav. Reproduce all three numbers together or the hero will
jump.

### 2.2 Contents [ARTBOARD]

**Left — wordmark**

```html
<span class="m-logo" style="font-family:'Asap',var(--m-sans);font-size:19px;font-weight:800;letter-spacing:-.01em;color:#fff">Confyde</span>
```

- `font-family: var(--font-logo)` (Asap), `font-size: 19px`, `font-weight: 800`,
  `letter-spacing: -0.01em`, `color: #fff`
- Note the differences from desktop: **19px not 24px**, and `-0.01em` not
  `-0.02em`. This is *not* the `.wordmark` utility. Either extend `.wordmark` with
  a size/tracking override or write the three properties locally — do not
  "correct" it to the desktop values.
- ⚠️ In the artboard this is a bare `<span>`, not a link. In the build it must be
  `<Link href="/">` wrapping the span, with `aria-label="Confyde home"`, matching
  desktop. Flagged as a required a11y/parity fix, §7.

**Right cluster**

```html
<span style="display:flex;align-items:center;gap:8px">
```

- `display: flex; align-items: center; gap: 8px`

**Right 1 — lime CTA**

```html
<a href="#" style="display:inline-flex;height:40px;align-items:center;border-radius:10px;background:var(--m-lime);padding:0 16px;font-size:14px;font-weight:700;color:var(--m-forest)">Get started</a>
```

- `height: 40px`, `border-radius: 10px`, `padding: 0 16px`
- `background: var(--color-lime-500)` (`#c8e84a`)
- `font-size: 14px; font-weight: 700; color: var(--color-forest-900)` (`#15301f`)
- Copy: `Get started`
- No icon.
- ⚠️ **Radius deviation.** 10px is not on the brand's 4/6/8/12 scale. It is what
  the artboard draws. Ship 10px for fidelity and raise it with the designer; do
  not silently round it to 8 or 12. Logged in §7.
- This button does **not** change with the `on-light` flip. Lime on forest reads
  on both surfaces, and it is the page's one primary action.

**Right 2 — hamburger**

```html
<button type="button" aria-label="Menu" class="m-menu" style="display:grid;height:40px;width:40px;place-items:center;cursor:pointer;border:1px solid rgba(255,255,255,.28);border-radius:10px;background:rgba(255,255,255,.14);color:#fff"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden=""><path d="M3 6h18M3 12h18M3 18h18"></path></svg></button>
```

- `display: grid; height: 40px; width: 40px; place-items: center`
- `border: 1px solid rgba(255,255,255,.28)`
- `border-radius: 10px` (same deviation as above)
- `background: rgba(255,255,255,.14)`
- `color: #fff`
- Icon path is Lucide **`menu`**, 18px, `strokeWidth={2}`, `strokeLinecap="round"`.
  Use `<Menu size={18} strokeWidth={2} aria-hidden="true" />`.
- `aria-label="Menu"` is already present and correct.

### 2.3 `.on-light` rules [ARTBOARD]

Quoted verbatim, mobile artboard lines 46–49:

```css
#m-nav{transition:background .25s,box-shadow .25s}
#m-nav.on-light{background:color-mix(in oklab,var(--m-bg) 82%,transparent)!important;box-shadow:0 1px 0 var(--m-border) inset!important}
#m-nav.on-light .m-logo{color:var(--m-forest)!important}
#m-nav.on-light .m-menu{border-color:var(--m-border)!important;background:var(--m-card)!important;color:var(--m-ink)!important}
```

Token mapping: `--m-bg` = `--color-canvas` `#f3f0e6`; `--m-border` =
`--color-hairline` `#dfd8c8`; `--m-forest` = `--color-forest-900` `#15301f`;
`--m-card` = `--color-card` `#ffffff`; `--m-ink` = `--color-ink` `#16321e`.

Notes:

- Transition is **`.25s`** here, versus `.3s` on desktop. Different values, both
  intentional; keep each.
- The `!important`s exist only to beat the artboard's inline styles. In the React
  build the state styles and the base styles are both classes, so drop every
  `!important` and win on order instead.
- `backdrop-filter: blur(16px) saturate(1.15)` is declared inline on the header
  and is **never removed** by `.on-light`. So the light nav is a blurred 82%-canvas
  wash over the beige page — it stays translucent, it does not become opaque.
- The inset box-shadow flips from a white highlight to a hairline rule. Same 1px
  geometry, different colour.
- The lime `Get started` button has no `.on-light` rule and is unchanged.

### 2.4 What the hamburger does [RECOMMENDATION]

**The artboard has no menu panel.** The button exists, is labelled, and does
nothing. Some behaviour must be specified; the options and the call:

- *Remove the button* — rejected. The nav's right cluster is composed as
  CTA + 40px square; removing the square unbalances the design and loses the only
  route to the secondary destinations.
- *Full-screen modal sheet* — rejected. Heavier than anything else on this page,
  needs a focus trap and scroll lock, and nine inert items do not justify it.
- **Chosen: a non-modal dropdown sheet under the header.** Smallest thing that
  makes the button honest, built entirely from tokens already on the page.

Exact spec for the sheet (all of this is a recommendation, none of it is measured
off an artboard):

- Element: `<div id="m-nav-menu">`, rendered as a sibling of the header inside a
  `position: relative` wrapper, or as the header's last child with
  `position: absolute; top: 100%; left: 0; right: 0`.
- `background: var(--color-card)` (`#ffffff`)
- `border-top: 1px solid var(--color-hairline)`
- `.shadow-overlay` (existing utility)
- `border-radius: 0 0 var(--radius-xl) var(--radius-xl)` (12px bottom corners)
- `padding: 8px 16px 16px`
- `z-index: 59` — under the header (60), over the page.
- Items: `display: flex; align-items: center; height: 48px; padding: 0 12px;`
  `border-radius: var(--radius-lg)` (8px); `font-size: 16px; font-weight: 600;`
  `color: var(--color-ink)`. Hover/active: `background: var(--color-well)`.
- Contents, in this order, matching what the desktop nav and the mobile footer
  already offer, all inert per §1.6:
  `Product`, `Customers`, `Pricing`, `Book a Demo`, `Login`
  — then a `1px solid var(--color-hairline)` rule with `margin: 8px 0` —
  `About`, `Help centre`, `Contact`
  (these four second-group labels are verbatim from the mobile footer, artboard
  line 990; `Customers` appears there too and is not repeated).
  `Get started` is **not** in the sheet; it is already in the bar.
- Motion, per the brand's motion rules: open = `opacity 150ms` only, no transform.
  **Close unmounts instantly** — no exit transition. Both disabled under
  `prefers-reduced-motion: reduce`.
- Button wiring: `aria-expanded={open}`, `aria-controls="m-nav-menu"`,
  `aria-label` switches `"Menu"` → `"Close menu"`. Icon switches Lucide `menu` →
  Lucide `x` at the same 18px.
- Dismissal: `Escape`, a click outside, and selecting an item all close it, and
  focus returns to the button. It is non-modal, so **no** focus trap and **no**
  body scroll lock. Scrolling the page also closes it.

---

## 3. Scroll behaviour

The two artboards use genuinely different thresholds. Do not unify them.

### 3.1 Desktop [ARTBOARD]

Verbatim, from `onScroll()` (desktop artboard line 2046–2048):

```js
onScroll(){
    const vh=window.innerHeight, y=window.scrollY;
    const nav=document.getElementById('pf-nav'); if(nav){ const dark=y<vh-80; nav.classList.toggle('on-dark',dark); nav.classList.toggle('on-light',!dark); const su=document.getElementById('pf-nav-signup'); if(su){ if(dark){su.classList.add('pf-btn-glass');su.classList.remove('pf-btn-ink');}else{su.classList.add('pf-btn-ink');su.classList.remove('pf-btn-glass');} } }
```

**In plain terms:** the nav is dark-styled while the page's vertical scroll offset
is less than *one viewport height minus 80px*. At a 900px-tall viewport it flips
to light at `scrollY = 820`. No element is measured — it is a pure `scrollY`
comparison, a hard-coded stand-in for "the hero is about one screen tall."

**The threshold is approximate, and knowably so.** The hero panel is
`min-height: 88svh` (artboard line 371), and the header's bottom edge sits at
≈58.5px (§1.1). The moment the nav actually stops overlapping dark pixels is
`scrollY ≈ 0.88·vh − 58.5`, i.e. ≈736px at vh=900 — roughly **84px earlier** than
the artboard's 820. In practice the hero's flex content usually pushes it past
`min-height`, which closes the gap; but the exact frame of the flip is not
designed, it is estimated.

**How to implement — use a scroll listener, not an IntersectionObserver.** The
condition is *viewport-relative* (`innerHeight`), not element-relative. An
IntersectionObserver `rootMargin` is a static string; expressing `vh − 80` would
mean tearing down and rebuilding the observer on every resize, which is strictly
worse than the listener. Build it as:

```ts
useEffect(() => {
  let raf = 0;
  const run = () => {
    raf = 0;
    setDark(window.scrollY < window.innerHeight - 80);
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  run();                                  // handles a restored scroll position
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    cancelAnimationFrame(raf);
  };
}, []);
```

- `{ passive: true }` on `scroll` — the artboard does this; it matters.
- `requestAnimationFrame` coalescing is an addition; the artboard fires on every
  scroll event. Do it.
- Run once on mount, not only on first scroll: a browser-restored scroll position
  must not leave a dark nav on a light page.
- SSR initial state is `on-dark`, matching the artboard's `class="on-dark"`.
- ⚠️ **Do not port `setInterval(() => this.onScroll(), 60)`** (artboard line 2013).
  That is a design-tool self-healing hack for a mutating canvas. It has no place
  in the build.

**[RECOMMENDATION] — measure the hero instead.** Because the artboard's threshold
is an estimate of the hero's height, the more correct build is a 1px sentinel at
the bottom of the hero panel, observed with
`rootMargin: "-59px 0px 0px 0px"` (the nav's bottom edge), which flips exactly
when the nav clears the dark pixels at any viewport height. This is a **visible
behavioural change** (the flip happens ~84px earlier at vh=900) and needs designer
sign-off before it ships. Ship the verbatim `vh − 80` unless and until you get it.

### 3.2 Mobile [ARTBOARD]

Verbatim, from `componentDidMount()` (mobile artboard lines 1010–1023):

```js
componentDidMount(){
    this._tick = () => {
      const nav = document.getElementById('m-nav'); if (!nav) return;
      const hero = nav.nextElementSibling;
      const r = hero ? hero.getBoundingClientRect() : null;
      const dark = r ? (r.bottom - nav.offsetHeight > 0) : true;
      nav.classList.toggle('on-dark', dark);
      nav.classList.toggle('on-light', !dark);
    };
    window.addEventListener('scroll', this._tick, { passive: true });
    window.addEventListener('resize', this._tick);
    this._boot = setTimeout(this._tick, 0);
    this._iv = setInterval(this._tick, 250);
  }
```

**In plain terms:** the nav is dark-styled for as long as the hero section's
bottom edge is still below the nav's own bottom edge — i.e. for as long as the
nav's 64px box still overlaps the hero. Measured, not estimated. Falls back to
dark if the hero is missing.

One imprecision to know about: `nav.nextElementSibling` is the hero `<section>`,
which carries `padding: 0 0 20px` on the beige page background (artboard line
110). So the section's bottom is 20px below the dark block's bottom, and the nav
stays dark for 20px of beige. Faithful build keeps this; the sentinel
recommendation below fixes it.

**How to implement — use an IntersectionObserver.** This condition *is*
element-relative, and `bottom − navHeight > 0` maps exactly onto a top
`rootMargin`:

```ts
useEffect(() => {
  const hero = heroRef.current;
  if (!hero) return;
  const io = new IntersectionObserver(
    ([entry]) => setDark(entry.isIntersecting),
    { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
  );
  io.observe(hero);
  return () => io.disconnect();
}, []);
```

Why this is exactly equivalent: a `-64px` top `rootMargin` shrinks the observation
root's top edge down to y=64 (the nav's bottom edge). The hero intersects that
root iff `hero.bottom > 64` **and** `hero.top < viewportHeight`. The hero is the
first thing on the page, so `top < viewportHeight` is true whenever the question
is live. `isIntersecting` therefore equals the artboard's `dark`.

- `64px` is the nav's measured height (§2.1) and is constant from 320 to 1023px,
  so the `rootMargin` can be a literal. If nav padding is ever changed, change
  this string in the same commit. Do **not** add a `ResizeObserver` to chase a
  height that does not move.
- IO fires once on observe, so the restored-scroll-position case is handled for
  free; no manual first run needed.
- SSR initial state is `on-dark`, matching `class="on-dark"`.
- ⚠️ **Do not port `setInterval(this._tick, 250)`** (artboard line 1017). Same
  design-tool hack as desktop.
- **[RECOMMENDATION]** Observe a 1px sentinel `<div>` placed at the end of the
  *dark* hero block rather than the whole `<section>`, which removes the 20px of
  beige-while-dark described above. Low risk, visually near-identical; ship it if
  the designer agrees, otherwise observe the section.

### 3.3 Reduced motion

`prefers-reduced-motion: reduce` must **not** disable the state flip itself — a
colour change is not motion, and the brand explicitly permits 150ms colour
transitions. What it disables is the floating-bars wrapper `transform` (§4.5) and
the mobile menu's opacity fade (§2.4). Put the media query at the end of the
relevant file in `styles/motion/`, per the existing convention.

---

## 4. Floating bars — desktop only

A single fixed container at the bottom centre of the viewport, holding two
mutually exclusive bar variants plus a shared animation wrapper.

### 4.1 Container [ARTBOARD]

```html
<div id="pf-bars" style="position:fixed;bottom:20px;left:50%;z-index:60;transform:translateX(-50%)">
```

- `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%)`
- `z-index: 60` — above the desktop nav's 50.
- No size, no background. It is a positioning shell only.

### 4.2 Animation wrapper [ARTBOARD]

```html
<div style="transition:transform .35s cubic-bezier(.22,1,.36,1);opacity:0;transform:translateY(16px) scale(.95);pointer-events:none">
```

- `transition: transform .35s cubic-bezier(.22,1,.36,1)`
- Initial/hidden state: `opacity: 0`, `transform: translateY(16px) scale(.95)`,
  `pointer-events: none`
- Shown state (set by `setBars`): `opacity: 1`, `transform: none`,
  `pointer-events: auto`
- ⚠️ **Artboard defect.** `opacity` is *not* in the transition list, so the bar's
  fade snaps while its slide eases — the bar pops into existence, then glides.
  Required fix: `transition: transform .35s cubic-bezier(.22,1,.36,1), opacity .35s cubic-bezier(.22,1,.36,1)`.
  `cubic-bezier(.22,1,.36,1)` is `easeOutQuint`.
- ⚠️ **Focus leak.** `pointer-events: none` hides the bar from the mouse but not
  from the keyboard — its CTA and dismiss button stay in the tab order while
  invisible. Required fix: add the `inert` attribute (and `aria-hidden="true"`) to
  the wrapper whenever the phase is `hidden`. See §7.

### 4.3 The three phases and their trigger arithmetic [ARTBOARD]

Verbatim, desktop artboard line 2050:

```js
    // floating bars
    const bars=document.getElementById('pf-bars'); if(bars){ const remaining=document.documentElement.scrollHeight-y-vh; let phase='trailer'; if(y<vh)phase='hidden'; else if(remaining<1700)phase='cta'; else phase='trailer'; this.setBars(phase); }
```

where `vh = window.innerHeight` and `y = window.scrollY`.

| Phase | Condition | Meaning in plain terms |
| --- | --- | --- |
| `hidden` | `scrollY < innerHeight` | The reader has not yet scrolled a full screen. Nothing shows. |
| `trailer` | `scrollY >= innerHeight` **and** `remaining >= 1700` | Mid-page. The quiz teaser shows. |
| `cta` | `scrollY >= innerHeight` **and** `remaining < 1700` | Within 1700px of the document's end. The signup bar shows. |

`remaining = document.documentElement.scrollHeight − scrollY − innerHeight` — the
number of pixels of document still below the fold. `1700` is an absolute pixel
constant, not a fraction; it is roughly the height of the page's final CTA stage
plus its footer, so the CTA bar appears as the closing section comes into view.

Note the `hidden` threshold here (`scrollY < innerHeight`) is **not** the nav's
threshold (`scrollY < innerHeight − 80`). The bar appears 80px after the nav
flips. Both are in the same `onScroll`; keep them as two separate comparisons.

Implementation: these read `scrollY`, `innerHeight` and `scrollHeight` — all
viewport/document-relative, none element-relative. **Scroll listener**, same
rAF-coalesced hook as §3.1; fold it into that one listener rather than adding a
second. `scrollHeight` changes as images load and accordions open, so the handler
must also be re-run on `resize` (it is) and ideally on a `ResizeObserver` over
`document.body` — the artboard leans on its 60ms interval for this; the build
should not.

### 4.4 Bar variants [ARTBOARD]

Both variants share: `class="pf-shadow-overlay"` (= the project's
`.shadow-overlay`), `border-radius: 12px`, `background: #fff` (`--color-card`),
and `display` toggled between `flex` and `none` by `setBars`.

#### `data-bar="trailer"`

```html
<div data-bar="trailer" class="pf-shadow-overlay" style="display:none;align-items:center;gap:16px;border-radius:12px;background:#fff;padding:10px">
```

- `align-items: center; gap: 16px; border-radius: 12px; background: #fff; padding: 10px`

Children, in order:

1. **Thumbnail**
   ```html
   <span style="position:relative;display:block;flex:none;height:44px;width:64px;overflow:hidden;border-radius:8px"><img src="assets/photo-2.png" alt="" style="width:100%;height:100%;object-fit:cover"></span>
   ```
   `44px × 64px`, `border-radius: 8px` (`--radius-lg`), `overflow: hidden`,
   `flex: none`; image `object-fit: cover`, `alt=""` (decorative — keep it empty).
   Asset: `photo-2.png` (the same photo the page uses elsewhere).

2. **Text stack**
   ```html
   <span style="display:flex;flex-direction:column;gap:2px;line-height:1.3">
   ```
   `flex-direction: column; gap: 2px; line-height: 1.3`

   - Title: `font-family: var(--font-display)` (Fraunces), `font-size: 16px`,
     `font-variation-settings: 'wght' 600, 'SOFT' 60, 'opsz' 24`,
     `color: var(--color-pf-ink-900)`, `white-space: nowrap`.
     Copy, verbatim: **`Still quoting on weekends?`**
     Note this variation-settings triplet is neither the `.display` default
     (opsz 40) nor its desktop override (wght 420 / SOFT 100 / opsz 10). It is a
     third, bar-specific cut — set it locally, do not reach for `.display-5`.
   - Subtitle: `font-size: 13.5px`, `color: var(--color-pf-ink-700)`,
     `white-space: nowrap`. The artboard writes
     `font-family: var(--font-sans)`, which is **undefined** in this artboard and
     falls back to the inherited Nunito Sans — so this is just body font; do not
     introduce a `--font-sans` token.
     Copy, verbatim: **`Find out what’s slowing you down.`**
     (curly apostrophe U+2019, not `'`)

3. **Lime CTA**
   ```html
   <a href="#" style="display:inline-flex;height:40px;flex:none;align-items:center;border-radius:12px;box-shadow:0 8px 20px -10px rgba(21,48,31,.4);background:var(--color-lime-500,#C8E84A);padding:0 20px;font-family:var(--font-sans);font-size:14px;font-weight:600;color:var(--color-forest-900,#15301F);text-decoration:none;white-space:nowrap">Take the quiz, 2 mins</a>
   ```
   `height: 40px; flex: none; border-radius: 12px; padding: 0 20px;`
   `box-shadow: 0 8px 20px -10px rgba(21,48,31,.4);`
   `background: var(--color-lime-500)`; `font-size: 14px; font-weight: 600;`
   `color: var(--color-forest-900)`; `white-space: nowrap`.
   Copy, verbatim: **`Take the quiz, 2 mins`**
   ⚠️ 12px radius on a 40px button; the CTA bar's button (below) uses 8px for the
   same role. Inconsistent *within the artboard*. Ship both as drawn and log it.

4. **Dismiss**
   ```html
   <button type="button" aria-label="Dismiss" style="display:flex;height:28px;width:28px;flex:none;align-items:center;justify-content:center;cursor:pointer;border:0;border-radius:8px;background:none;color:var(--pf-ink-500)" data-bar-dismiss=""><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>
   ```
   `28px × 28px`, `border: 0`, `border-radius: 8px`, `background: none`,
   `color: var(--color-pf-ink-500)`, `aria-label="Dismiss"`, carries the
   `data-bar-dismiss` hook.
   Icon path is Lucide **`x`** — `<X size={15} strokeWidth={2} aria-hidden="true" />`.
   ⚠️ No hover state is drawn. **[RECOMMENDATION]** add
   `:hover { background: var(--color-pf-ink-100); }` — consistent with the nav's
   `.on-light` link hover, and a 28px target with no feedback is a usability hole.

#### `data-bar="cta"`

```html
<div data-bar="cta" class="pf-shadow-overlay" style="display:none;align-items:center;gap:12px;border-radius:12px;background:#fff;padding:6px 6px 6px 16px"><span style="font-size:16px;font-weight:600;color:var(--pf-ink-900)">Ready to win more work?</span><a href="#" class="pf-btn-ink" style="display:inline-flex;height:34px;align-items:center;gap:8px;border-radius:8px;padding:0 16px;font-size:14px;font-weight:700;color:var(--pf-ink-100)">Get started free <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8l4 4-4 4"></path><path d="M2 12h20"></path></svg></a></div>
```

- Bar: `align-items: center; gap: 12px; border-radius: 12px; background: #fff;`
  `padding: 6px 6px 6px 16px` (note the asymmetry — 16px of text inset, 6px around
  the button).
- Label: `font-size: 16px; font-weight: 600; color: var(--color-pf-ink-900)`
  (Nunito Sans, not Fraunces — unlike the trailer's title).
  Copy, verbatim: **`Ready to win more work?`**
- Button: `.btn-ink`, `display: inline-flex; height: 34px; align-items: center;`
  `gap: 8px; padding: 0 16px; font-size: 14px; font-weight: 700;`
  `color: var(--color-pf-ink-100)`.
  Copy, verbatim: **`Get started free`**
  Icon is Lucide **`move-right`** at 16px.
- ⚠️ **Rendered radius is 12px, not 8px.** The inline style says
  `border-radius: 8px`, but `.pf-btn-ink` declares `border-radius:12px!important`
  (§1.5), and `!important` in a stylesheet beats a non-important inline
  declaration. In the artboard this button therefore renders at **12px**. The
  project's `.btn-ink` has no `!important`, so a naive port using `rounded-lg`
  would render 8px and be visibly wrong. **Build it at 12px** (`rounded-xl` /
  `--radius-xl`), and do not add `!important` to the project's `.btn-ink`.
- Button shadow comes from `.btn-ink`: `0 8px 20px -10px rgb(21 48 31 / 0.4)` —
  here there is no competing inline shadow, so unlike the nav signup (§1.5) the
  class shadow does apply.

### 4.5 `setBars` and dismissal [ARTBOARD]

Verbatim, desktop artboard line 2061:

```js
  setBars(phase){ const b=document.getElementById('pf-bars'); if(!b)return; if(b._dismissed)phase='hidden'; b._phase=phase; const wrap=b.firstElementChild; if(!wrap)return; const t=b.querySelector('[data-bar=trailer]'), c=b.querySelector('[data-bar=cta]'); const hide=phase==='hidden'; wrap.style.opacity=hide?'0':'1'; wrap.style.transform=hide?'translateY(16px) scale(.95)':'none'; wrap.style.pointerEvents=hide?'none':'auto'; if(t)t.style.display=phase==='trailer'?'flex':'none'; if(c)c.style.display=phase==='cta'?'flex':'none'; if(!b._dwired){ b._dwired=1; b.addEventListener('click',(e)=>{ if(!e.target.closest('[data-bar-dismiss]'))return; e.preventDefault(); b._dismissed=1; this.setBars('hidden'); }); } }
```

Behaviour to reproduce:

- **Dismiss is sticky and global.** Once `_dismissed` is set, *every* subsequent
  phase is forced to `hidden`. Dismissing the trailer also permanently suppresses
  the CTA bar. That is the design; do not make dismissal per-variant.
- **Dismiss is memory-only.** It is an instance flag, not `localStorage` or a
  cookie. It resets on reload. Reproduce exactly — do **not** add persistence
  unless the owner asks for it, and if they do it is a new decision, not this
  spec.
- The handler is **delegated** on the container and matched with
  `closest('[data-bar-dismiss]')`, so a click on the SVG inside the button works.
  In React this is simply an `onClick` on the dismiss button; the delegation is a
  vanilla-JS convenience, not a design requirement.
- `e.preventDefault()` — keep it if the dismiss control stays a `<button>` inside
  a clickable region; harmless.
- Only the `cta` bar has no dismiss control of its own. Once the trailer is gone
  (dismissed) the CTA never appears; if the reader never dismissed, the CTA has no
  close button. That is the artboard. **[RECOMMENDATION]** give the CTA bar the
  same 28px dismiss button as the trailer — a fixed bar covering the footer with
  no escape is an accessibility problem (WCAG 2.2 SC 2.4.11 / the "no way to
  dismiss" pattern). Low-risk addition, needs a designer nod for the layout.
- React shape: one `phase` state (`"hidden" | "trailer" | "cta"`) plus a
  `dismissed` boolean; render the wrapper always, swap the variant by conditional
  render or `display`, and drive `opacity`/`transform`/`inert` off
  `phase === "hidden" || dismissed`.

### 4.6 Reduced motion

Under `prefers-reduced-motion: reduce`, remove the wrapper's `transform`
transition and its `translateY(16px) scale(.95)` offset entirely; the bar appears
and disappears with opacity only (or instantly). Per the brand, closing unmounts
instantly regardless.

---

## 5. Mobile sticky bottom bar — <1024px

### 5.1 Exact values [ARTBOARD]

```html
<div style="position:sticky;bottom:0;z-index:70;display:flex;flex-direction:column;gap:7px;border-top:1px solid var(--m-border);background:color-mix(in oklab,var(--m-card) 95%,transparent);backdrop-filter:blur(14px);padding:11px 16px 14px">
  <a href="#" style="display:flex;height:50px;align-items:center;justify-content:center;gap:9px;border-radius:12px;background:var(--m-lime);font-size:16px;font-weight:700;color:var(--m-forest);box-shadow:0 8px 20px -12px rgba(21,48,31,.5)">Try Confyde free
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden=""><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
  </a>
  <span style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 12px;font-size:11.5px;color:var(--m-ink-500)">
    <span>90 seconds. No card.</span>
  </span>
</div>
```

Container:

- `position: sticky; bottom: 0`
- `z-index: 70` (top of the page's stack: above the mobile nav's 60)
- `display: flex; flex-direction: column; gap: 7px`
- `border-top: 1px solid var(--color-hairline)` (`#dfd8c8`)
- `background: color-mix(in oklab, var(--color-card) 95%, transparent)`
- `backdrop-filter: blur(14px)` — ⚠️ the artboard omits `-webkit-backdrop-filter`
  here (it includes it on the nav). **Add the `-webkit-` prefix**; without it
  iOS Safari renders an opaque-ish 95% white with no blur.
- `padding: 11px 16px 14px`

CTA link:

- `display: flex; height: 50px; align-items: center; justify-content: center; gap: 9px`
- `border-radius: 12px` (`--radius-xl`)
- `background: var(--color-lime-500)` (`#c8e84a`)
- `font-size: 16px; font-weight: 700`
- `color: var(--color-forest-900)` (`#15301f`)
- `box-shadow: 0 8px 20px -12px rgba(21,48,31,.5)` — note `-12px` spread and
  `.5` alpha, both different from the trailer bar's `-10px / .4`.
- Copy, verbatim: **`Try Confyde free`**
- Icon path is Lucide **`arrow-right`** (`M5 12h14` + `m12 5 7 7-7 7`) at
  **17px** with **`stroke-width: 2.4`** — a heavier stroke than anywhere else on
  the page. `<ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />`.
  This is *not* the desktop bars' `move-right`; the two pages use different arrows
  and that is intentional.

Caption:

- `display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px 12px`
- `font-size: 11.5px; color: var(--color-slate-500)` (`--m-ink-500` = `#6e7669`)
- Copy, verbatim: **`90 seconds. No card.`**
  (Note: the mobile hero's version of this line is `*90 seconds. No card.` with a
  leading asterisk. The bottom bar's has **no** asterisk. Do not normalise them.)

### 5.2 Why `sticky` and not `fixed` [ARTBOARD — keep as drawn]

The bar is the **last child** of the page wrapper with `position: sticky; bottom: 0`.
Its containing block is the whole page, so it is pinned to the bottom of the
viewport for the entire scroll — visible from first paint, not scroll-triggered.
There is no reveal animation and no dismiss control; it is always there.

Because `sticky` keeps the element in normal flow, it reserves its own 88px of
space at the end of the document, so the footer's last line is never obscured.
`position: fixed` would look identical while scrolling but would overlap the
footer at the bottom of the page and would need a compensating
`padding-bottom` on `<body>`. **Use `sticky`.**

---

## 6. Fluid behaviour, 320px → 1023px

The mobile artboard is a fixed 430px column with zero media queries. Its wrapper —

```html
<div style="position:relative;margin:0 auto;width:100%;max-width:430px;min-height:100vh;background:var(--m-bg);…">
```

— is a **device frame**, not a layout constraint. `max-width: 430px` must **not**
be carried into the build for the nav or the bottom bar; both are full-bleed
elements of a full-width page. Everything in this section is therefore
**[RECOMMENDATION]**, derived by holding the artboard's values at 430px and
deciding what happens either side. Each decision states its reason.

### 6.1 Mobile nav

| Property | 320–767px | 768–1023px | Reason |
| --- | --- | --- | --- |
| Width | full-bleed | full-bleed | It is a sticky page-edge bar. |
| `padding` | `12px 16px` (artboard) | `12px 24px` | Matches the page's own gutter step; 16px gutters look pinched past ~720px. |
| Height | **64px, fixed** | **64px, fixed** | Load-bearing: hero `margin-top: -64px` and the IO `rootMargin: "-64px…"` (§3.2). Do not make it fluid. |
| Wordmark | 19px | 19px | Fixed. Do not interpolate toward the desktop 24px — desktop is a different composition, not a scale of this one. |
| CTA / hamburger | 40px tall, fixed | 40px tall, fixed | Touch targets; nothing to gain from scaling. |
| Gap | 10px outer / 8px inner | same | Fixed. |
| Inner row | full width | `max-width: 720px; margin-inline: auto` | Above ~768px the logo and the CTA drift to opposite screen edges and stop reading as one control group. 720px keeps the artboard's visual density. |

**No shrinking is required at 320px.** Measured: wordmark ≈88px + 10px gap +
`Get started` ≈99px + 8px gap + 40px hamburger + 32px padding ≈ **277px**, inside
320px with 43px to spare. Do not add truncation, icon-only fallbacks or font
scaling — there is no overflow to solve.

`gap: 10px` combined with `justify-content: space-between` means the gap only
engages if the row ever *does* get cramped, which per the above it does not.

### 6.2 Mobile sticky bottom bar

| Property | 320–767px | 768–1023px | Reason |
| --- | --- | --- | --- |
| Container | full-bleed | full-bleed | Its hairline and blur must span the viewport. |
| `padding` | `11px 16px 14px` (artboard) | `11px 24px 14px` | Same gutter step as the nav. |
| Bottom padding | `calc(14px + env(safe-area-inset-bottom))` | same | iOS home-indicator overlap; the artboard has no notion of safe areas. |
| Inner column | `max-width: 430px; margin-inline: auto` | same | Without a cap, at 1023px the lime CTA becomes a ~975px slab — a banner, not a button. 430px is the artboard's own column width, so the proportion at the design size is exact. |
| CTA height | 50px, fixed | 50px, fixed | Thumb target; nothing to scale. |
| CTA `border-radius` | 12px | 12px | Fixed. |
| Type | 16px CTA / 11.5px caption | same | Fixed. |
| `gap` | 7px | 7px | Fixed. |

Net effect: below 430px the CTA is full-width minus gutters; at and above 430px it
locks to 430px and centres, and the bar's blurred surface keeps spanning the
viewport behind it.

### 6.3 What is explicitly *not* fluid

- No `clamp()` or `vw` type scaling anywhere in this section. Every font size in
  both artboards is a fixed px value, and the sizes involved (11.5–19px) are too
  small for viewport interpolation to buy anything.
- No intermediate layout between 1023px and 1024px. The mobile nav at 1023px and
  the desktop nav at 1024px are different compositions and the swap is abrupt by
  design. Test both sides of the boundary; do not try to smooth it.
- No tablet-specific arrangement. There isn't one in the source.

---

## 7. Accessibility — what the artboards are missing

Items marked **[MUST]** block the build; **[SHOULD]** are strong recommendations.

**Landmarks and structure**

1. **[MUST]** The mobile `<header id="m-nav">` contains no `<nav>` and no label.
   Wrap its contents in `<nav aria-label="Main">`, matching the desktop artboard.
2. **[MUST]** The mobile wordmark is a bare `<span>` — not a link, not focusable.
   Wrap in `<Link href="/" aria-label="Confyde home">`, matching desktop.
3. **[MUST]** Neither artboard has a skip link. Add
   `<a href="#main" class="sr-only focus:not-sr-only …">Skip to content</a>` as
   the first focusable element on the page, and `id="main"` on `<main>`. With a
   fixed/sticky header and a sticky bottom bar, skipping matters more than usual.
4. **[SHOULD]** Give `#pf-bars` `role="complementary"` with
   `aria-label="Promotion"`. Do **not** give it `aria-live` — a bar that appears
   on scroll must not interrupt a screen reader mid-sentence.

**Focus**

5. **[MUST]** Neither artboard defines a single focus style. Every interactive
   element in this section needs a visible one. Per the brand (lime is forward
   motion only and is explicitly banned as a focus ring; sage is form-field focus
   only), use:
   - on dark: `outline: 2px solid var(--color-cream); outline-offset: 2px`
   - on light: `outline: 2px solid var(--color-forest-700); outline-offset: 2px`
   Apply via `:focus-visible`, not `:focus`.
6. **[MUST]** The floating-bars wrapper uses only `pointer-events: none` when
   hidden, leaving its CTA and dismiss button tabbable while invisible. Add
   `inert` + `aria-hidden="true"` on the wrapper in the `hidden` phase. (§4.2)
7. **[MUST]** The mobile menu button must gain `aria-expanded` and
   `aria-controls` once §2.4 ships, and focus must return to it on close.

**Inert destinations**

8. **[MUST]** Six desktop nav items, the mobile hamburger's future items, and
   both bar CTAs are `href="#"`. Ship them per §1.6 — `<button type="button">`
   with `aria-disabled="true"`, focusable, non-navigating, `cursor: default`.
   `href="#"` must not appear in the built markup.
9. **[MUST]** `Product`, `Customers` and `Login` carry a `chevron-down`, which
   promises a menu that does not exist. Since they are inert buttons with
   `aria-disabled="true"`, do **not** additionally set `aria-haspopup` — that
   would advertise a popup the build does not have.

**Icons**

10. **[MUST]** Every SVG in the *desktop* artboard lacks `aria-hidden`. (The
    mobile artboard has `aria-hidden=""` on its icons, which is also wrong —
    the value must be the string `"true"`.) All icons in this section are
    decorative and sit next to their own text label; every one gets
    `aria-hidden="true"` and `focusable="false"`. Use `lucide-react`; per the
    brand, Lucide is the only icon system and icons are `currentColor`.

**Contrast and surface**

11. **[SHOULD]** The `.on-dark` pill is a translucent glass over a photograph.
    `--color-pf-ink-100` text on it clears 4.5:1 against the hero's darkened
    region, but the hero image is content-dependent — verify with the real asset
    at both 1024px and 1920px before sign-off.
12. **[MUST]** Both navs depend on `backdrop-filter`. Add a
    `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`
    fallback that raises the background opacity so text stays legible:
    mobile nav → `rgba(21,48,31,.72)` flat; desktop `.on-dark` pill →
    `rgba(255,255,255,.14)` flat; mobile bottom bar → `var(--color-card)` opaque.

**Motion**

13. **[MUST]** `prefers-reduced-motion: reduce` disables the bars wrapper's
    `transform` and the mobile menu's fade. It does **not** disable the nav's
    colour flip. (§3.3, §4.6)

**Touch targets**

14. **[SHOULD]** The mobile nav's CTA and hamburger are 40×40 / 40px tall — above
    the WCAG 2.5.8 AA minimum of 24×24 but below the 44×44 AAA target. This is
    the artboard's value; ship it, log it. The desktop trailer bar's 28×28 dismiss
    button is the smaller concern: give it the hover state from §4.4 and keep an
    invisible padded hit area of at least 44×44 via a `::before` overlay.

**Known artboard defects requiring a designer decision (not engineering calls)**

- Nav pill dividers do not respond to `.on-light` and vanish on white (§1.2).
- The bars wrapper fades without a transition on `opacity` (§4.2).
- The trailer CTA is 12px radius while the CTA bar's button is 8px-declared /
  12px-rendered, for the same role (§4.4).
- The mobile nav's CTA and hamburger use a 10px radius, which is off the brand's
  4/6/8/12 scale (§2.2).
- The desktop nav's flip threshold is a hard-coded `vh − 80` rather than a
  measurement of the hero, and is ≈84px late at a 900px viewport (§3.1).
- The `cta` floating bar has no dismiss control (§4.5).

---

## 8. QA checklist

### Desktop nav, ≥1024px

- [ ] Header is `fixed`, `top: 20px`, centred via `left:50%` + `translateX(-50%)`,
      `z-index: 50`, `width: 1320px`, `max-width: calc(100% - 16px)`.
- [ ] Header itself has no background, border or shadow.
- [ ] Left pill: `gap: 8px`, `radius: 12px`, `padding: 3px 6px 3px 5px`.
- [ ] Right pill: `gap: 4px`, `radius: 12px`, `padding: 3px 6px 3px 5px`.
- [ ] Left link group `gap: 10px`; links `padding: 5px 14px`, `radius: 6px`,
      `15px/600`, icon gap `6px`.
- [ ] Right links `padding: 5px 12px`; `Book a Demo` has `white-space: nowrap`
      and no icon gap.
- [ ] Labels read exactly: `Confyde`, `Product`, `Customers`, `Pricing`,
      `Book a Demo`, `Login`, `Get started`.
- [ ] Chevrons on `Product`, `Customers`, `Login` only. `Pricing` and
      `Book a Demo` have none.
- [ ] Icons are Lucide `chevron-down` @14px/2 and `move-right` @16px/2.
- [ ] Wordmark: Asap 800, 24px, `line-height: 1`, `letter-spacing: -0.02em`.
- [ ] Signup: `height: 30px`, `radius: 12px`, `padding: 0 16px`, `14px/700`,
      `gap: 8px`, `box-shadow: 0 6px 16px -8px rgba(0,0,0,.4)` **in both states**.
- [ ] At exactly 1024px the nav does not wrap or overflow.
- [ ] Both dividers are visible in **both** states (light state uses
      `--color-hairline`).

### Desktop nav state flip

- [ ] Initial server render is `on-dark`.
- [ ] Flips to `on-light` at `scrollY === innerHeight - 80` and back.
- [ ] Verified at three viewport heights (e.g. 700 / 900 / 1200) — the threshold
      moves with `innerHeight`.
- [ ] Reload mid-page (restored scroll) shows the correct state on first paint,
      with no dark-on-light flash.
- [ ] Pill cross-fades over `.3s` (background **and** box-shadow); backdrop blur
      snaps.
- [ ] Signup swaps glass → ink: fill and shadow change, size/padding/radius/type
      do not.
- [ ] `.on-light` navlink hover is `--color-pf-ink-100` as a background.
- [ ] `.on-dark` navlink hover is `rgb(255 255 255/.08)`.
- [ ] No `setInterval` in the shipped bundle.
- [ ] Scroll listener is `{ passive: true }` and rAF-coalesced.

### Mobile nav, <1024px

- [ ] `sticky`, `top: 0`, `z-index: 60`, `padding: 12px 16px`, height exactly 64px.
- [ ] Hero carries `margin-top: -64px` and `padding-top: 104px`; no jump at load.
- [ ] Gradient is forest-900 at 42% → 28%, top to bottom.
- [ ] `backdrop-filter` **and** `-webkit-backdrop-filter`: `blur(16px) saturate(1.15)`.
- [ ] Inset shadow `0 1px 0 rgba(255,255,255,.1)` on dark; `0 1px 0 #dfd8c8` on light.
- [ ] Wordmark 19px / 800 / `-0.01em`, white on dark, `--color-forest-900` on light,
      and it is a link to `/`.
- [ ] CTA: 40px, radius 10px, lime-500 on forest-900, `14px/700`, `Get started`,
      unchanged across the flip.
- [ ] Hamburger: 40×40, radius 10px, Lucide `menu` @18px/2, `aria-label`,
      border/background/colour all flip on `on-light`.
- [ ] Flip occurs exactly when the hero's bottom passes the nav's bottom edge
      (64px), verified by scrolling slowly.
- [ ] Implemented with an IntersectionObserver, `rootMargin: "-64px 0px 0px 0px"`.
- [ ] No `setInterval` in the shipped bundle.
- [ ] Hamburger opens the §2.4 sheet; `aria-expanded` toggles; `Escape`,
      outside-click and item-select all close it; focus returns to the button;
      close is instant.

### Desktop floating bars

- [ ] Container `fixed`, `bottom: 20px`, centred, `z-index: 60`.
- [ ] Hidden while `scrollY < innerHeight`.
- [ ] `trailer` while `scrollY >= innerHeight` and `remaining >= 1700`.
- [ ] `cta` while `scrollY >= innerHeight` and `remaining < 1700`
      (`remaining = scrollHeight - scrollY - innerHeight`).
- [ ] Only one variant is in the DOM/visible at a time.
- [ ] Wrapper hidden state: `opacity: 0`, `translateY(16px) scale(.95)`,
      `pointer-events: none`, **plus `inert` and `aria-hidden="true"`**.
- [ ] Wrapper transition: `.35s cubic-bezier(.22,1,.36,1)` on **both** transform
      and opacity.
- [ ] Trailer: 44×64 thumb @8px radius, 16px Fraunces
      (`'wght' 600,'SOFT' 60,'opsz' 24`) title, 13.5px `--color-pf-ink-700` sub,
      40px lime CTA @12px radius, 28px dismiss.
- [ ] Trailer copy verbatim: `Still quoting on weekends?` /
      `Find out what’s slowing you down.` (curly apostrophe) /
      `Take the quiz, 2 mins`.
- [ ] CTA bar: `padding: 6px 6px 6px 16px`, 16px/600 label, 34px ink button,
      **12px** rendered radius, `move-right` @16px.
- [ ] CTA bar copy verbatim: `Ready to win more work?` / `Get started free`.
- [ ] Dismissing the trailer permanently suppresses **both** bars for the session.
- [ ] Dismissal does **not** survive a reload.
- [ ] Tab order never reaches a hidden bar's controls.
- [ ] Bars are absent below 1024px.

### Mobile sticky bottom bar

- [ ] `sticky`, `bottom: 0`, `z-index: 70`, last child of the page.
- [ ] Visible from first paint, all the way down, and it does **not** cover the
      footer's last line at the document end.
- [ ] `border-top: 1px solid #dfd8c8`;
      `background: color-mix(in oklab, #fff 95%, transparent)`;
      `backdrop-filter: blur(14px)` **with** the `-webkit-` prefix.
- [ ] `padding: 11px 16px calc(14px + env(safe-area-inset-bottom))`; `gap: 7px`.
- [ ] CTA: 50px, radius 12px, lime-500 on forest-900, `16px/700`, `gap: 9px`,
      shadow `0 8px 20px -12px rgba(21,48,31,.5)`.
- [ ] Icon is Lucide `arrow-right` @**17px** with `strokeWidth={2.4}`.
- [ ] Copy verbatim: `Try Confyde free` and `90 seconds. No card.` (no asterisk).
- [ ] Caption 11.5px `--color-slate-500`, centred, wraps.
- [ ] Absent at ≥1024px.

### Fluid, 320 → 1023px

- [ ] No `max-width: 430px` on the nav or the bottom bar's *container*.
- [ ] At 320px the nav row fits with no wrap, truncation or overflow.
- [ ] At 430px both components match the artboard pixel for pixel.
- [ ] At 767→768px the gutter steps 16px → 24px on both.
- [ ] At 768px+ the nav's inner row caps at 720px and centres.
- [ ] At 1023px the bottom bar's CTA is 430px wide and centred, not full-bleed.
- [ ] At 1023 vs 1024px the correct layout swaps cleanly; no element from the
      other breakpoint is visible or focusable.

### Accessibility

- [ ] Skip link present, first in tab order, visible on focus.
- [ ] Exactly one `Main` navigation landmark exposed at any viewport.
- [ ] No `href="#"` anywhere in the built markup.
- [ ] All inert items are `<button type="button" aria-disabled="true">`,
      reachable by Tab, silent on activation, `cursor: default`.
- [ ] No `aria-haspopup` on the inert chevron items.
- [ ] Every icon has `aria-hidden="true"` and `focusable="false"`.
- [ ] `:focus-visible` ring present on all controls, cream on dark / forest-700
      on light, 2px with 2px offset, visible in both nav states.
- [ ] Dismiss button has `aria-label="Dismiss"` and a ≥44×44 hit area.
- [ ] `prefers-reduced-motion: reduce`: bar transform and menu fade off; nav
      colour flip still works.
- [ ] `backdrop-filter` fallback verified by disabling the feature.
- [ ] axe / Lighthouse: zero violations on the header and both bar systems, at
      320, 430, 768, 1023, 1024 and 1440px.
