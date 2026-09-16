# 05 — Before / After ("A week in Marcus's pocket")

Source:

- Desktop — `Bramble Home Web.dc.html`, `<!-- ===== BEFORE / AFTER ===== -->`,
  lines 578–803. CSS in the `<style>` block: keyframes at lines 102–131
  (`pg-in*` / `pg-ring*` / `pg-jolt*`, global) and lines 142–213 (everything
  else, trapped inside an unclosed `@media (min-width:1280px)` — see §5).
- Mobile — `Bramble Home Mobile.dc.html`, lines 184–271. A completely different
  composition: two *stacked* phones with three rows each, no animation at all.

This is the most animation-heavy section on the page: a 16-second, ten-element
choreography on the left phone, a five-card staggered entrance on the right, plus
four smaller loops. §4 is the load-bearing part of this document. §5 is the
defect that has to be fixed before any of it runs at our breakpoint.

Two components, mutually exclusive by breakpoint:

- `<BeforeAfterDesktop>` — `hidden desk:block`
- `<BeforeAfterMobile>` — `desk:hidden`

They cannot be one component. Ten notification cards vs three, five calm cards vs
three, different copy on six of them, photographs on desktop and none on mobile,
and an entire animation system on one side only. `desk` = 1024px.

Because the two are gated by `display:none`, **the animation CSS needs no media
query of its own.** That is the whole fix for §5.

---

## 1. Panel shell

### 1.1 Section and panel — desktop

```
section: margin:0 auto; width:100%; max-width:1280px; padding:0 24px 96px
panel:   overflow:hidden; border-radius:12px;
         background:var(--color-forest-900,#15301F);
         padding:64px 40px 56px
```

Tailwind: `mx-auto w-full max-w-[1280px] px-6 pb-24` on the section;
`overflow-hidden rounded-xl bg-forest-900 pt-16 px-10 pb-14` on the panel.

`12px` is `--radius-xl`, on-scale. The panel has no shadow and no border — the
forest/cream value step is the elevation, per `brand.md`. Panel content width at
≥1280px is **1152px** (1280 − 48 section padding − 80 panel padding).

### 1.2 Header block — desktop

```
display:flex; flex-direction:column; align-items:center; gap:14px;
max-width:660px; margin:0 auto 48px; text-align:center
```

Carries `data-anim="up-blur" data-duration="0.5"` with **no delay**. Use
`<Reveal anim="up-blur" duration={0.5}>`.

**Eyebrow** — `<span>`:

```
font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
color:var(--color-lime-500,#C8E84A)
```

No `font-family`, so it inherits `.pf-page` → Nunito Sans → our `--font-body`.
Copy, verbatim:

> `A week in Marcus's pocket`

**Do not apply `--color-eyebrow` (`#657919`) here.** That token exists for
`lime-700` eyebrows on *light* surfaces. This eyebrow is `lime-500` on
`forest-900` and measures **10.24:1** — it already passes AA comfortably.
Substituting the corrected token would be a visible, unrequested darkening.

**H2** — `class="pf-h2 pf-oneline"`, `margin:0; color:#fff; text-wrap:balance`.

`.pf-h2` = `2rem/1.2/-.008em`, → `2.5rem` at ≥768px, → `3rem` at ≥1024px, in
Fraunces at `"wght" 420, "SOFT" 100, "WONK" 0, "opsz" 10`. That is our
`.display .display-2`. Copy, verbatim, one line, no `<br>`:

> `You're on the tools. Bramble's running the office.`

On `.pf-oneline`, see §5.4 — it is **not** part of the motion hoist.

**Body** — `<p>`:

```
margin:0; max-width:54ch; font-size:16px; line-height:1.6;
color:var(--color-forest-200,#B9C7B0)
```

Copy, verbatim:

> `Quoting, chasing, variations, invoices. It all lands on you, at night, after a
> full day on the tools. Bramble runs the lot from first enquiry to final
> payment, so the job moves forward while you sleep.`

(The mobile artboard truncates the last clause — see §6.2. Preserve both.)

### 1.3 The two-up grid — desktop

```
display:grid;
grid-template-columns:repeat(2,minmax(0,340px));
justify-content:center;
gap:24px;
align-items:start
```

Total 704px, centred in the 1152px panel. Each column:

```
display:flex; flex-direction:column; align-items:center; gap:22px
```

Left column: `data-anim="up-blur" data-delay="0.1" data-duration="0.5"`.
Right column: `data-anim="up-blur" data-delay="0.18" data-duration="0.5"`.

Note the caption `<p>` in each column is a **sibling of the phone frame**, not a
child of it — the artboard's indentation is misleading but the nesting is
correct.

### 1.4 The two state pills

**Before Bramble** — one `<span>` child, no icon:

```
display:inline-flex; align-items:center; gap:9px; border-radius:9999px;
background:color-mix(in oklab,var(--color-rust,#96602B) 22%,transparent);
padding:6px 16px;
box-shadow:0 0 0 1px color-mix(in oklab,var(--color-rust,#96602B) 45%,transparent) inset
```

Inner label:

```
font-family:var(--font-sans); font-size:11.5px; font-weight:800;
letter-spacing:.12em; text-transform:uppercase; color:#E9C9A6
```

Copy: `Before Bramble`. `--font-sans` is Hanken Grotesk (RULINGS §01 ruling 9)
→ `--font-ui`. The `gap:9px` is inert with one child — drop it (RULINGS
principle 1 + §02 ruling 3). `#E9C9A6` is an un-tokened one-off; keep it as a
commented local constant, same treatment as §02 ruling 5.

**With Bramble** — Lucide `Sprout` + label:

```
display:inline-flex; align-items:center; gap:8px; border-radius:9999px;
background:var(--color-lime-500,#C8E84A); padding:6px 16px 6px 13px
```

SVG `15×15`, `stroke:var(--color-forest-900,#15301F)`, `stroke-width:2.2`,
`stroke-linecap/linejoin:round`, `flex:none`. Label as above but
`color:var(--color-forest-900,#15301F)`. Copy: `With Bramble`.

---

## 2. The "Before Bramble" phone

### 2.1 Frame and screen

```
frame:  position:relative; width:100%; max-width:280px; aspect-ratio:9/18.5;
        border-radius:34px; background:#10160F; padding:9px;
        box-shadow:0 30px 60px -30px rgba(21,48,31,.7),
                   0 0 0 1px rgba(255,255,255,.06) inset

screen: position:relative; display:flex; height:100%; width:100%;
        flex-direction:column; overflow:hidden; border-radius:26px;
        background:#101A14
```

Computed at `max-width:280px` (`box-sizing:border-box` is global): frame
**280 × 575.56px**, screen **262 × 557.56px**.

Notch/speaker slit, `aria-hidden="true"`:

```
position:absolute; left:50%; top:8px; transform:translateX(-50%);
height:5px; width:62px; border-radius:9999px;
background:rgba(255,255,255,.16); z-index:3
```

`34px` and `26px` are off the 4/6/8/12 radius scale. Ship as drawn and log —
same call as RULINGS §01 ruling 8. They are a device depiction, not a UI surface.

### 2.2 Screen treatment

Two stacked layers below the content:

```
<div style="position:absolute;inset:0">
  <img src="/images/photo-3.webp" alt=""
       style="width:100%;height:100%;object-fit:cover;opacity:.22">
</div>
<span aria-hidden="true" style="position:absolute;inset:0;
  background:linear-gradient(to bottom,#101A14 0%,rgba(16,26,20,.86) 100%)">
```

Photograph at **opacity .22**, then a near-opaque forest wash that goes from
100% at the top to 86% at the bottom. Net photo contribution to the rendered
pixel is 3–22%; it reads as texture, not image. All content above it carries
`position:relative` to sit on top.

The artboard writes `assets/photo-3.png`; our asset is `/images/photo-3.webp`.
Use `next/image` with `fill` + `object-cover`, `alt=""`.

### 2.3 Status bar

```
position:relative; display:flex; align-items:center;
justify-content:space-between; gap:8px; padding:22px 16px 10px
```

Clock: `font-family:var(--font-sans); font-size:11px; font-weight:600;
color:rgba(255,255,255,.6)` — copy `12:06 am`.

Unread pill — carries `.pf-buzz`:

```
display:inline-grid; place-items:center; border-radius:9999px;
background:var(--color-rust,#96602B); padding:3px 9px
```

Five superimposed `<span class="pg pg-lin">` children, each
`grid-area:1/1; font-family:var(--font-sans); font-size:10.5px;
font-weight:700; color:#fff; white-space:nowrap`, with `animation-name` set to
`pg-n1`…`pg-n5` and copy, in DOM order:

| n | Copy |
|---|---|
| 1 | `4 unread` |
| 2 | `9 unread` |
| 3 | `16 unread` |
| 4 | `31 unread` |
| 5 | `23 unread` |

Because all five share `grid-area:1/1`, the pill's width is the widest of them
(`16 unread` / `31 unread` / `23 unread`) at all times — the pill does **not**
resize as the count changes. That is correct and intentional.

### 2.4 The feed container

```
position:relative; display:flex; min-height:0; flex:1; flex-direction:column;
justify-content:flex-end; overflow:hidden; padding:6px 12px 10px;
-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 14%,#000 100%);
        mask-image:linear-gradient(to bottom,transparent 0%,#000 14%,#000 100%)
```

`justify-content:flex-end` is what makes the choreography read: the stack is
**bottom-anchored**, so each new card lands at the bottom and pushes the whole
column up and out through the masked top edge. `overflow:hidden` + the 14% mask
dissolve the cards leaving the top.

Usable feed height ≈ **493px** (557.56 − ~49px status row − 16px padding). Ten
cards at ~71px plus 7px margin total ~780px, so at full extension **six cards are
visible and four are clipped above the mask**. This is by design; QA should not
file it. See §9, D21.

### 2.5 Card shell

Outer wrapper, the animated one:

```
class="pg"  style="animation-name:pg-inN; overflow:hidden; flex:none"
```

Inner card, also animated:

```
class="pg"  style="animation-name:pg-joltN; display:flex; gap:10px;
  border-radius:12px; background:rgba(255,255,255,.1);
  backdrop-filter:blur(10px); padding:10px 11px;
  box-shadow:0 0 0 1px rgba(255,255,255,.09) inset"
```

Ship `-webkit-backdrop-filter` alongside `backdrop-filter` (RULINGS §01 ruling 6
precedent — iOS loses the blur otherwise).

Icon tile:

```
position:relative; display:grid; place-items:center; flex:none;
height:26px; width:26px; border-radius:7px; background:<tile hex>
```

Ring, a child of the tile:

```
class="pg pg-lin" style="animation-name:pg-ringN; position:absolute;
  inset:-3px; border-radius:9px; border:1.5px solid <tile hex>; opacity:0"
```

The inline `opacity:0` is the ring's resting value and must survive to the
reduced-motion state (§4.7).

Icon SVG: `14×14`, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="#fff"`,
`stroke-width="2.2"`, round caps and joins.

Text stack: `display:flex; min-width:0; flex:1; flex-direction:column; gap:2px`.
The `min-w-0` is load-bearing — it is what lets the sender name ellipsis.

```
row:     display:flex; min-width:0; align-items:baseline;
         justify-content:space-between; gap:8px
sender:  min-width:0; overflow:hidden; text-overflow:ellipsis;
         white-space:nowrap; font-family:var(--font-sans);
         font-size:12.5px; font-weight:600; color:#fff
time:    flex:none; font-family:var(--font-sans); font-size:10.5px;
         color:rgba(255,255,255,.5)
message: font-family:var(--font-sans); font-size:11.5px; line-height:1.4;
         color:rgba(255,255,255,.76)
channel: margin-top:1px; font-family:var(--font-sans); font-size:10px;
         font-weight:700; letter-spacing:.06em; text-transform:uppercase;
         color:rgba(255,255,255,.42)
```

### 2.6 All ten notifications, verbatim

Source these from one exported constant, `content/before-after.ts`, so the QA
diff has a single place to check.

| # | Sender | Time | Message | Channel | Tile bg | Lucide icon |
|---|---|---|---|---|---|---|
| 1 | `Sarah Whitcombe` | `11:42 pm` | `Any update on that quote?` | `SMS` | `#96602B` | `MessageSquare` |
| 2 | `Mark Deakin` | `11:44 pm` | `Did you get my email about the paving change?` | `Email` | `#6E4119` | `Mail` |
| 3 | `Jo Harcourt` | `11:51 pm` | `Can you look at the retaining wall this week?` | `WhatsApp` | `#8A6A2F` | `MessageCircle` |
| 4 | `Unknown number` | `12:06 am` | `Still waiting on that variation price` | `SMS` | `#96602B` | `MessageSquare` |
| 5 | `Trent — Voltaic Electrical` | `12:11 am` | `Where's the switchboard? Can't price the garden lighting without it.` | `Email` | `#6E4119` | `Mail` |
| 6 | `Dan — Stonemason` | `12:14 am` | `Need the paver count before I order` | `WhatsApp` | `#8A6A2F` | `MessageCircle` |
| 7 | `Dave — Plumbers Inc` | `12:26 am` | `Price attached for the pool plumbing. Need it back by Tues.` | `Email` | `#6E4119` | `Mail` |
| 8 | `Priya Raman` | `12:31 am` | `Following up again. Is the quote coming?` | `Email` | `#6E4119` | `Mail` |
| 9 | `Kingsley job` | `12:48 am` | `3 missed calls` | `Missed call` | `#96602B` | `PhoneMissed` |
| 10 | `Tony Alvarez` | `1:02 am` | `Any chance of a price by Friday?` | `SMS` | `#96602B` | `MessageSquare` |

All three em-dashes are U+2014 with a space either side, exactly as drawn.
Card 5's apostrophes in `Where's` / `Can't` are curly (U+2019) in the source;
per RULINGS §02 ruling 10 normalise the *whole section* to curly — see §9, D15.

Tile colours map to channel, except card 9: `Missed call` takes `#96602B`, the
SMS colour, not a colour of its own. That is as drawn.

Raw path data, for verification against `lucide-react`:

- `MessageSquare` — `M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z`
- `Mail` — `rect x="2" y="4" width="20" height="16" rx="2"` +
  `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7`
- `MessageCircle` — `M7.9 20A9 9 0 1 0 4 16.1L2 22Z`
- `PhoneMissed` — `m22 2-6 6` + `m16 2 6 6` + the `Phone` body path

### 2.7 Caption

Sibling of the frame, inside the column:

```
margin:0; max-width:34ch; text-align:center; font-family:var(--font-sans);
font-size:14px; line-height:1.55; color:var(--color-forest-200,#B9C7B0)
```

> `Everyone wants an answer, and they all want it from you, now. You reply when
> you can and the quotes wait until Sunday.`

---

## 3. The "With Bramble" phone

### 3.1 Frame and screen

Frame: **identical** to §2.1, character for character. Screen: identical except

```
background:#F3F0E6
```

The notch keeps `background:rgba(255,255,255,.16)` — white at 16% over a cream
screen, so it is all but invisible on this side. As drawn; do not "correct" it.

### 3.2 Screen treatment

```
<div style="position:absolute;inset:0">
  <img src="/images/photo-1.webp" alt=""
       style="width:100%;height:100%;object-fit:cover;opacity:.3">
</div>
<span aria-hidden="true" style="position:absolute;inset:0;
  background:linear-gradient(to bottom,
    rgba(21,48,31,.82) 0%,
    rgba(243,240,230,.97) 22%,
    #F3F0E6 100%)">
```

The inverse of the left phone: photo at **.3**, and the wash goes *dark to light*
over the top 22% (≈123px of the 557.56px screen). The status bar and greeting sit
in the dark band; everything below 22% is flat cream. This is the whole visual
argument of the section — the same device, one screen full of night, one full of
morning.

### 3.3 Status bar

Same geometry as §2.3 (`padding:22px 16px 10px`).

Clock: `font-family:var(--font-sans); font-size:11px; font-weight:600;
color:rgba(255,255,255,.86)` — copy `7:05 am`.

Badge — carries `.pf-badge`:

```
display:inline-flex; align-items:center; gap:6px; border-radius:9999px;
background:rgba(255,255,255,.2); backdrop-filter:blur(8px);
padding:3px 10px; font-family:var(--font-sans); font-size:10.5px;
font-weight:700; color:#fff;
box-shadow:0 0 0 1px rgba(255,255,255,.28) inset
```

Copy: `All handled`. Again, add `-webkit-backdrop-filter`.

Live pip — three nested spans:

```
wrapper: aria-hidden="true"; position:relative; display:grid;
         place-items:center; flex:none; height:6px; width:6px
base:    position:absolute; inset:0; border-radius:9999px;
         background:var(--color-lime-500,#C8E84A)
pulse:   class="pf-livepip"; position:absolute; inset:0;
         border-radius:9999px; background:var(--color-lime-500,#C8E84A)
```

Per RULINGS §02 ruling 6, `border-radius:9999px` on a 6px box → `rounded-full`.

### 3.4 Greeting

```
row:  position:relative; padding:0 14px 6px
text: font-family:var(--font-serif); font-weight:600; font-size:14px; color:#fff
```

`--font-serif` is Source Serif 4 (RULINGS §01 ruling 9) → `--font-ui-serif`.

> `Morning, Marcus. Here's your day.`

**This is the section's worst contrast failure — measured 2.78:1.** See §8.3.

### 3.5 Calm stack

```
position:relative; display:flex; min-height:0; flex:1; flex-direction:column;
gap:6px; overflow:hidden; padding:2px 12px 12px
```

No mask, no `justify-content` — the five cards sit top-aligned with a real 6px
gap, against the left phone's bottom-anchored overflowing pile. Five cards at
~62px + 4 gaps = ~334px in a ~480px box, so the right phone has **visible empty
space at the bottom**. That is the point.

Card shell:

```
class="pf-calm" style="animation-delay:<d>; display:flex; gap:9px;
  border-radius:10px; background:#fff; padding:8px 9px;
  box-shadow:0 5px 14px -10px rgba(21,48,31,.4)"
```

Icon tile:

```
aria-hidden="true"; display:grid; place-items:center; flex:none;
height:23px; width:23px; border-radius:6px;
background:var(--color-lime-500,#C8E84A)
```

SVG `14×14`, `stroke:var(--color-forest-900,#15301F)`, `stroke-width:2.4`.

Text stack: `display:flex; min-width:0; flex:1; flex-direction:column; gap:3px`.

```
title:  font-family:var(--font-sans); font-size:12px; font-weight:600;
        line-height:1.25; color:var(--color-ink,#16321E)
sub:    font-family:var(--font-sans); font-size:11px; line-height:1.35;
        color:var(--color-slate-500,#6E7669)
action: margin-top:1px; font-family:var(--font-sans); font-size:10.5px;
        font-weight:700; color:var(--color-forest-700,#2C5539)
```

The action label is **text, not a button** — no hit area, no hover, no focus
ring. It is a depiction of a button inside a depiction of a phone. Do not render
it as a `<button>` or `<a>`; that would put five inert controls in the tab order.

### 3.6 All five calm cards, verbatim

| # | Lucide icon | Title | Sub | Action | `animation-delay` |
|---|---|---|---|---|---|
| 1 | `Phone` | `Sarah opened your quote three times today` | `She keeps going back to the paving. Worth a call.` | `Call Sarah` | `.4s` |
| 2 | `Check` | `Variation priced and sent to Mark` | `Extra bluestone and base. $2,840, from your own rates.` | `Sent 4:12 pm` | `1.3s` |
| 3 | `Receipt` | `Ana's invoice cleared, $21,400` | `Mosman retaining and steps. Paid overnight, job closed off.` | `View receipt` | `2.2s` |
| 4 | `Sprout` | `Jo Harcourt wraps Friday` | `Get the after shots and ask her for a review while you're there.` | `Remind me Friday` | `3.1s` |
| 5 | `HardHat` | `Dave from Plumbers Inc` | `Pool plumbing Bronte job, $4,180.` | `Review all 3 plumber quotes` | `4s` |

Path data for the two less obvious ones:

- `Receipt` — `M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z`
  + `M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8` + `M12 17.5v-11`
- `HardHat` — `M10 10V5a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2v5` + `M14 6a6 6 0 0 1 6 6v3`
  + `M4 15v-3a6 6 0 0 1 6-6` + `rect x="2" y="15" width="20" height="5" rx="1"`

Card 4's `Sprout` is the same glyph as the "With Bramble" pill.

Cards 1, 2, 4 and 5 carry a `data-calm=""` attribute; card 3 does not. Nothing in
the artboard's CSS or JS reads it. **Drop it** — §9, D8.

### 3.7 Caption

Identical geometry to §2.7 but `color:#fff`:

> `Bramble priced the variation and managed the contractors' prices. Marcus opens
> his phone already knowing who to call first.`

---

## 4. The animation system

Ship as `styles/motion/before-after.css`, imported from `app/globals.css` after
`chrome.css`. Keyframes prefixed `bb-`, classes unprefixed, everything in
`@layer components`, reduced-motion block last — the `hero.css` convention.

**No media query.** `<BeforeAfterDesktop>` is `hidden desk:block`, so below
1024px these elements are `display:none` and their animations never compose.
That replaces the artboard's broken `@media (min-width:1280px)` wrapper entirely
(§5).

### 4.1 The `.pg` driver

Verbatim from the artboard:

```css
.pg   { animation-duration:16s;
        animation-timing-function:cubic-bezier(.19,1,.22,1);
        animation-iteration-count:infinite;
        animation-fill-mode:both }
.pg-lin { animation-timing-function:linear }
```

`cubic-bezier(.19,1,.22,1)` is easeOutExpo. `.pg-lin` overrides it to linear and
is applied to exactly two things: the ten `pg-ringN` spans and the five
`pg-nN` unread spans — i.e. to everything that is a pure opacity crossfade.
Anything that *moves* keeps the expo curve.

**1% of this cycle = 160ms.** Every number below converts with that.

Our names: `.ping-item` (wrapper, `bb-ping-in-N`), `.ping-card` (inner,
`bb-ping-jolt-N`), `.ping-ring` (`bb-ping-ring-N`, plus `.ping-lin`),
`.unread` (`bb-unread-N`, plus `.ping-lin`).

### 4.2 The ten-element choreography

Each notification is a **triplet** firing on one trigger percentage `p`:

1. `pg-inN` — the wrapper opens. Verbatim shape, with `p` substituted:

   ```css
   @keyframes pg-in1 {
     0%,2.8% { max-height:0; opacity:0;
               transform:translateX(20px) scale(.96); margin-bottom:0 }
     3%      { max-height:0; opacity:0; margin-bottom:0 }
     5.5%,96%{ max-height:150px; opacity:1;
               transform:translateX(0) scale(1); margin-bottom:7px }
     100%    { max-height:0; opacity:0;
               transform:translateX(20px) scale(.96); margin-bottom:0 }
   }
   ```

   The `p−0.2%` stop and the bare `p%` stop exist to drop `transform` from the
   interpolation for one 32ms slice, so the slide-in starts from a clean
   `translateX(20px)` rather than from wherever the expo curve left it. Keep
   both stops — flattening them changes the entrance.

2. `pg-ringN` — a halo scales out of the icon tile:

   ```css
   @keyframes pg-ring1 {
     0%,3%    { opacity:0;   transform:scale(.5) }
     4.2%     { opacity:.85; transform:scale(1) }
     9%,100%  { opacity:0;   transform:scale(2.1) }
   }
   ```

3. `pg-joltN` — the card shudders sideways as it lands:

   ```css
   @keyframes pg-jolt1 {
     0%,3%     { transform:translateX(0) }
     3.6%      { transform:translateX(-3px) }
     4.2%      { transform:translateX(3px) }
     4.8%      { transform:translateX(-2px) }
     5.6%,100% { transform:translateX(0) }
   }
   ```

   Offsets from `p` are fixed: `+0.6`, `+1.2`, `+1.8`, settle at `+2.6`.

**The full trigger table.** `in` is the wrapper's `p−0.2 / p` pair, `open` is when
the card is fully landed, `ring` is the halo peak, `jolt settle` is when the
shudder stops.

| N | `p` | `p` (ms) | `in` stops | `open` | `ring` peak | `ring` gone | `jolt settle` |
|---|---|---|---|---|---|---|---|
| 1 | 3% | 480 | 2.8 / 3 | 5.5% (880ms) | 4.2% (672ms) | 9% (1440ms) | 5.6% (896ms) |
| 2 | 9% | 1440 | 8.8 / 9 | 11.5% (1840ms) | 10.2% (1632ms) | 15% (2400ms) | 11.6% (1856ms) |
| 3 | 15% | 2400 | 14.8 / 15 | 17.5% (2800ms) | 16.2% (2592ms) | 21% (3360ms) | 17.6% (2816ms) |
| 4 | 21% | 3360 | 20.8 / 21 | 23.5% (3760ms) | 22.2% (3552ms) | 27% (4320ms) | 23.6% (3776ms) |
| 5 | 32% | 5120 | 31.8 / 32 | 34.5% (5520ms) | 33.2% (5312ms) | 38% (6080ms) | 34.6% (5536ms) |
| 6 | 42% | 6720 | 41.8 / 42 | 44.5% (7120ms) | 43.2% (6912ms) | 48% (7680ms) | 44.6% (7136ms) |
| 7 | 52% | 8320 | 51.8 / 52 | 54.5% (8720ms) | 53.2% (8512ms) | 58% (9280ms) | 54.6% (8736ms) |
| 8 | 62% | 9920 | 61.8 / 62 | 64.5% (10320ms) | 63.2% (10112ms) | 68% (10880ms) | 64.6% (10336ms) |
| 9 | 72% | 11520 | 71.8 / 72 | 74.5% (11920ms) | 73.2% (11712ms) | 78% (12480ms) | 74.6% (11936ms) |
| 10 | 82% | 13120 | 81.8 / 82 | 84.5% (13520ms) | 83.2% (13312ms) | 88% (14080ms) | 84.6% (13536ms) |

Every millisecond value above is `percentage × 160`. Recompute rather than trust
the table if anything looks off by a factor.

**Every card's `96%` and `100%` stops are shared.** All ten collapse together
between 15360ms and 16000ms.

### 4.3 What the choreography is supposed to look like

In plain terms, so an engineer can tell when it is wrong:

- **0–480ms.** Empty screen. The rust pill is present but shows no number (all
  five counts are at opacity 0 — see §9, D4).
- **480ms → 3360ms.** Four notifications arrive in quick succession, **960ms
  apart**. Each slides 20px in from the right, scales from .96 to 1, the icon
  halo flashes once and expands to 2.1× while fading, and the card shudders
  −3 / +3 / −2 px and settles. The stack grows *upward* from the bottom.
- **3360ms → 5120ms.** A **1760ms** pause — the only breath in the loop. The
  count has already jumped to `16 unread`.
- **5120ms → 13120ms.** Six more arrive at a flat **1600ms** metronome. From
  about card 7 the earliest cards are being pushed out through the masked top
  edge, so the feed is visibly *scrolling* even though nothing scrolls.
- **13120ms → 15360ms.** Everything holds. Ten cards, six visible, `23 unread`.
  This is the frame the section is arguing for, and it is the frame the
  reduced-motion state pins to.
- **15360ms → 16000ms.** All ten collapse to `max-height:0` simultaneously,
  slide 20px right and fade. Hard cut back to empty.

**It is wrong if:** cards appear at the top; the gaps are even (they are not —
960 / 960 / 960 / 1760 / 1600 × 5); the halo is still visible when the next card
lands; the collapse is staggered rather than simultaneous; or the `margin-bottom`
does not animate with the height, which shows up as a 7px gap snapping in after
the card has already opened.

### 4.4 The unread-count crossfade

Both the effective keyframes (artboard lines 177–181, the second copy) and the
dead ones are listed in §5.2. **Effective, verbatim:**

```css
@keyframes pg-n1 { 0%,3%  {opacity:0} 4.5%,7.5%  {opacity:1} 9%,100% {opacity:0} }
@keyframes pg-n2 { 0%,9%  {opacity:0} 10.5%,19.5%{opacity:1} 21%,100%{opacity:0} }
@keyframes pg-n3 { 0%,21% {opacity:0} 22.5%,40.5%{opacity:1} 42%,100%{opacity:0} }
@keyframes pg-n4 { 0%,42% {opacity:0} 43.5%,70.5%{opacity:1} 72%,100%{opacity:0} }
@keyframes pg-n5 { 0%,72% {opacity:0} 73.5%,98.5%{opacity:1} 100%    {opacity:0} }
```

All five carry `.pg .pg-lin` → 16s, **linear**, infinite, `both`.

| Count | Full from | Full to | Handover out |
|---|---|---|---|
| `4 unread` | 4.5% (720ms) | 7.5% (1200ms) | 9% (1440ms) |
| `9 unread` | 10.5% (1680ms) | 19.5% (3120ms) | 21% (3360ms) |
| `16 unread` | 22.5% (3600ms) | 40.5% (6480ms) | 42% (6720ms) |
| `31 unread` | 43.5% (6960ms) | 70.5% (11280ms) | 72% (11520ms) |
| `23 unread` | 73.5% (11760ms) | 98.5% (15760ms) | 100% (16000ms) |

Handovers land on card arrivals: `9` with card 2, `16` with card 4, `31` with
card 6, `23` with card 9. Each handover has a **hard zero** — the outgoing count
reaches 0 at exactly the percentage the incoming one starts from 0 — so the pill
blanks for roughly one frame at 9%, 21%, 42% and 72%. Reproduce it (principle 1)
and flag it (§9, D4).

The `31 → 23` drop at 11520ms is in the copy, not the timing. Flag, do not fix
(principle 3).

### 4.5 `pf-calm-in` — the five calm cards

```css
@keyframes pf-calm-in {
  0%,3%   { opacity:0; transform:translateY(14px) }
  11%,96% { opacity:1; transform:translateY(0) }
  100%    { opacity:0; transform:translateY(10px) }
}
.pf-calm { animation:pf-calm-in 16s cubic-bezier(.19,1,.22,1) infinite both }
```

Delays are **inline longhands** (`animation-delay:.4s` etc.), which beat the
shorthand's `0s` because they are inline. They are **positive**, not negative, so
each card runs its own 16s timeline offset from page load — the five never
re-synchronise.

| Card | Delay | Starts to fade in | Fully up | Starts to fade out | Gone | Next appearance |
|---|---|---|---|---|---|---|
| 1 | 0.4s | 0.88s | 2.16s | 15.76s | 16.40s | 18.56s |
| 2 | 1.3s | 1.78s | 3.06s | 16.66s | 17.30s | 19.46s |
| 3 | 2.2s | 2.68s | 3.96s | 17.56s | 18.20s | 20.36s |
| 4 | 3.1s | 3.58s | 4.86s | 18.46s | 19.10s | 21.26s |
| 5 | 4.0s | 4.48s | 5.76s | 19.36s | 20.00s | 22.16s |

Read: each card rises 14px and fades in over 1.28s, holds for **13.6s**, drops
10px and fades out over 0.64s, then is absent for **2.8s**. The 900ms stagger
means at least three are always on screen and the two phones never blank
together. `both` + positive delay is what holds card 5 invisible for its first
4s rather than flashing.

### 4.6 The three small loops

**`pf-badge-climb`** — "All handled":

```css
@keyframes pf-badge-climb {
  0%,6%   { opacity:0; transform:scale(.5) }
  12%     { opacity:1; transform:scale(1.2) }
  16%,74% { opacity:1; transform:scale(1) }
  84%,100%{ opacity:0; transform:scale(.9) }
}
.pf-badge { animation:pf-badge-climb 16s cubic-bezier(.19,1,.22,1) infinite both }
```

0.96s start → 1.92s overshoot at 1.2× → 2.56s settled → holds to 11.84s → gone by
13.44s → absent for the last 2.56s of every cycle. See §9, D10.

**`pf-ping-buzz`** — the unread pill:

```css
@keyframes pf-ping-buzz {
  0%,4%   { transform:translate(0,0) }
  5%      { transform:translate(-2px,1px) }
  6%      { transform:translate(2px,-1px) }
  7%      { transform:translate(-1px,0) }
  8%,100% { transform:translate(0,0) }
}
.pf-buzz { animation:pf-ping-buzz 16s ease-in-out infinite both }
```

Note the timing function here is **`ease-in-out`, not the expo curve**. Fires
once per cycle, 640ms → 1280ms. See §9, D9.

**`pf-livepip`** — the badge's pulse ring:

```css
@keyframes pf-livepip {
  0%       { opacity:.8; transform:scale(1) }
  70%,100% { opacity:0;  transform:scale(2.6) }
}
.pf-livepip { animation:pf-livepip 2.4s cubic-bezier(.19,1,.22,1) infinite }
```

**2.4s, not 16s** — the only loop in the section on its own clock, and the only
one with **no fill mode** (`none`). It expands to 2.6× and is fully gone by
1.68s, then holds invisible for 720ms. Over the 16s cycle it fires 6⅔ times, so
it deliberately never lines up with anything. It is the only thing on the right
phone that reads as "live".

### 4.7 The reduced-motion resting state  **[Designer decision]**

The artboard's own block is inside the broken media query *and* is itself wrong:

```css
/* artboard, line 194 — do NOT port this */
.pg,.pf-calm,.pf-badge,.pf-buzz{
  animation:none!important; opacity:1!important; transform:none!important;
  max-height:none!important; margin-bottom:7px!important }
```

`.pg` is on four different kinds of element. `opacity:1!important` therefore
forces **all ten halo rings visible** as coloured outlines and **all five unread
counts visible superimposed** in one pill; `margin-bottom:7px!important` lands on
the jolt divs, the rings and the unread spans as well as the wrappers. It is the
same smear as the sub-1280 bug in §5.3 — and it is the frame the comparison
harness screenshots.

**The resting state is the `t = 15360ms` frame**, with `31 unread` in the pill:

- It is the argument the section makes — ten cards against five.
- `31 unread` is the **peak** count, it holds longest in the live loop (42% → 72%,
  4.8s), and it is **exactly what the mobile artboard draws statically**. Pinning
  to it makes the two breakpoints agree, which is worth more than matching the
  live loop's final `23`.

Ship:

```css
@media (prefers-reduced-motion: reduce) {
  .ping-item,
  .ping-card,
  .calm-card,
  .calm-badge,
  .ping-buzz {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  /* The wrapper is the only thing that carries the open box. */
  .ping-item {
    max-height: none !important;
    margin-bottom: 7px !important;
  }
  .ping-card {
    margin-bottom: 0 !important;
  }

  /* Halos are a transient. Their resting value is the inline opacity:0. */
  .ping-ring {
    animation: none !important;
    opacity: 0 !important;
  }

  /* One count, not five. */
  .unread {
    animation: none !important;
    opacity: 0 !important;
  }
  .unread[data-rest="true"] {
    opacity: 1 !important;
  }

  /* The pulse ring sits exactly on the solid dot; hiding it leaves the dot. */
  .live-pip {
    animation: none !important;
    opacity: 0 !important;
  }
}
```

`data-rest="true"` goes on the `31 unread` span only. The last `.ping-item`
still carries its 7px bottom margin, matching the live 96% frame exactly.

---

## 5. The unclosed-media-query defect

**Ruled: the fix ships.** This is RULINGS principle 2 — a dead animation system
is a bug, not an authoring choice.

### 5.1 What is broken

Line **141** of the desktop artboard opens

```css
@media (min-width:1280px){
```

and nothing closes it until line **214**. Everything on lines 142–213 is
therefore scoped to viewports ≥1280px, including this section's entire animation
system. Specifically, **inside** the accidental scope:

| Rule | Line(s) | Effect of the trap |
|---|---|---|
| `.pg`, `.pg-lin` | 202–203 | the whole 16s driver is missing below 1280 |
| `pf-ping-buzz` + `.pf-buzz` | 204, 210 | missing |
| `pf-calm-in` + `.pf-calm` | 205, 208 | missing |
| `pf-badge-climb` + `.pf-badge` | 206, 209 | missing |
| `pf-livepip` + `.pf-livepip` + its RM block | 161–163, 192–194 | missing |
| `pg-n1`…`pg-n5` | 164–168 **and** 195–199 | missing, and duplicated (§5.2) |
| the RM block for `.pg,.pf-calm,.pf-badge,.pf-buzz` | 211–213 | missing |
| `@media (min-width:1120px){.pf-oneline{…}}` | 160, 188 | nested, so it fires at 1280 not 1120 (§5.4) |
| `pf-clock-late`, `pg-still`, `pf-done-rest` | 207, 200, 201 | dead code either way (§9 D6, D7) |

**Outside** the scope, and therefore already global: `pg-in1`…`pg-in10`,
`pg-ring1`…`pg-ring10`, `pg-jolt1`…`pg-jolt10` (lines 102–131). The keyframes
exist at every width; only the driver that makes them run is missing.

### 5.2 The duplicated block

Lines 142–168 and 170–199 declare the same nineteen keyframes twice. Later wins,
so the **second** copy is effective. Only `pg-n3/n4/n5` differ:

| Keyframe | Dead (142–168) | **Effective** (170–199) |
|---|---|---|
| `pg-n3` | `0%,21%{0} 22.5%,50.5%{1} 52%,100%{0}` | `0%,21%{0} 22.5%,40.5%{1} 42%,100%{0}` |
| `pg-n4` | `0%,52%{0} 53.5%,78.5%{1} 80%,100%{0}` | `0%,42%{0} 43.5%,70.5%{1} 72%,100%{0}` |
| `pg-n5` | `0%,80%{0} 81.5%,98.5%{1} 100%,100%{0}` | `0%,72%{0} 73.5%,98.5%{1} 100%,100%{0}` |

The dead copy handed over at 52 / 80; the live one at 42 / 72, which is what
aligns the counts with cards 6 and 9. `pf-won-fly` is declared **three** times
(once globally at 133–140 with a different, mobile-ish transform path, twice
inside) — it belongs to another section, but the engineer will see it while
untangling this and should not be surprised.

De-duplicate to the effective copy only. Nothing else in the block differs.

### 5.3 What the section looks like below 1280px today

At 1024–1279px — **the entire desktop range our `desk` breakpoint opens at** —
the desktop composition renders with no animation at all, and two of the
consequences are ugly:

1. **The unread pill is an illegible smear.** All five `pg-nN` spans share
   `grid-area:1/1` and none of them is hidden by anything other than its
   animation. With no `animation-duration`, `4 unread` / `9 unread` /
   `16 unread` / `31 unread` / `23 unread` render **superimposed at full
   opacity** in one rust lozenge. This is the symptom anyone will spot first.
2. **All ten notifications are visible at once, flush, with no 7px gaps.** The
   wrappers have no `max-height` and no `margin-bottom` without the animation, so
   the stack is ~700px of cards in a ~493px box. `justify-content:flex-end` plus
   `overflow:hidden` means the bottom six survive and the top four are clipped —
   so it does not *look* catastrophic, but the rhythm is gone and the cards touch.

Three consequences are benign, which is why this survived review:

3. The halo rings stay invisible — their inline `opacity:0` is doing the work.
4. The five calm cards render static at full opacity. That is the resting state
   and it looks correct.
5. `.pf-livepip` renders at its static value: a solid lime dot at scale 1,
   sitting exactly on top of the identical base dot. Visually indistinguishable.

And the "All handled" badge and the unread pill sit still rather than climbing
and buzzing — a loss, not a bug you can see in one frame.

### 5.4 `.pf-oneline` is the one rule NOT to hoist

```css
@media (min-width:1120px){ .pf-oneline{ white-space:nowrap; text-wrap:nowrap } }
```

Nested inside the 1280 block, so it currently fires at **≥1280px**. Hoisting it
to its authored ≥1120px would make things *worse*: the panel's content box is
`viewport − 48 − 80`, i.e. **992px at 1120px** and **1152px at 1280px**, and the
headline at 48px Fraunces measures ~1130px. At 1120–1279 a nowrap headline would
overflow the panel and be clipped by `overflow:hidden`; at ≥1280 it fits, which
is presumably why nobody noticed.

**Ruling: hoist the motion rules only.** Leave `.pf-oneline` at ≥1280px, which is
what the artboard renders (principle 1). **Then measure**, in the browser, at
1280px and 1440px: screenshot the headline and confirm neither end is clipped. If
it clips at 1280, delete `.pf-oneline` from this element entirely and let
`text-wrap:balance` do the job it already does at 1024–1279. Arithmetic is not
evidence (RULINGS §03/04 ruling 11).

Note also that `text-wrap:balance` and `white-space:nowrap` are contradictory
declarations on the same element; at ≥1280 `balance` is inert. §9, D23.

### 5.5 The corrected, de-duplicated rule set

This is the whole of `styles/motion/before-after.css` minus the ten `bb-ping-*`
triplets, which expand mechanically from §4.2 and the table there.

```css
/* ---------------------------------------------------------------------------
   The before/after phones.

   One 16s loop drives the left phone's ten-notification pile-up and the unread
   counter; the right phone's five cards run the same 16s length on five
   positive delays, so they never re-synchronise; the live pip runs on its own
   2.4s clock so that it never lines up with anything.

   The artboard declared all of this inside an @media (min-width:1280px) that
   was never closed (docs/specs/05-before-after.md §5). There is no media query
   here: <BeforeAfterDesktop> is `hidden desk:block`, so below 1024px these
   elements are display:none and none of this composes.
--------------------------------------------------------------------------- */

/* ... @keyframes bb-ping-in-1 .. -10, bb-ping-ring-1 .. -10,
       bb-ping-jolt-1 .. -10, per §4.2 ... */

@keyframes bb-unread-1 { 0%,3%  {opacity:0} 4.5%,7.5%  {opacity:1} 9%,100% {opacity:0} }
@keyframes bb-unread-2 { 0%,9%  {opacity:0} 10.5%,19.5%{opacity:1} 21%,100%{opacity:0} }
@keyframes bb-unread-3 { 0%,21% {opacity:0} 22.5%,40.5%{opacity:1} 42%,100%{opacity:0} }
@keyframes bb-unread-4 { 0%,42% {opacity:0} 43.5%,70.5%{opacity:1} 72%,100%{opacity:0} }
@keyframes bb-unread-5 { 0%,72% {opacity:0} 73.5%,98.5%{opacity:1} 100%   {opacity:0} }

@keyframes bb-ping-buzz {
  0%,4%    { transform: translate(0, 0) }
  5%       { transform: translate(-2px, 1px) }
  6%       { transform: translate(2px, -1px) }
  7%       { transform: translate(-1px, 0) }
  8%,100%  { transform: translate(0, 0) }
}

@keyframes bb-calm-in {
  0%,3%    { opacity: 0; transform: translateY(14px) }
  11%,96%  { opacity: 1; transform: translateY(0) }
  100%     { opacity: 0; transform: translateY(10px) }
}

@keyframes bb-badge-climb {
  0%,6%    { opacity: 0; transform: scale(.5) }
  12%      { opacity: 1; transform: scale(1.2) }
  16%,74%  { opacity: 1; transform: scale(1) }
  84%,100% { opacity: 0; transform: scale(.9) }
}

@keyframes bb-live-pip {
  0%       { opacity: .8; transform: scale(1) }
  70%,100% { opacity: 0;  transform: scale(2.6) }
}

@layer components {
  /* The shared 16s driver. animation-name is set per element. */
  .ping-item,
  .ping-card,
  .ping-ring,
  .unread {
    animation-duration: 16s;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }

  /* Pure opacity crossfades get a linear curve; anything that moves keeps expo. */
  .ping-lin {
    animation-timing-function: linear;
  }

  .ping-buzz {
    animation: bb-ping-buzz 16s ease-in-out infinite both;
  }

  .calm-card {
    animation: bb-calm-in 16s cubic-bezier(0.19, 1, 0.22, 1) infinite both;
  }

  .calm-badge {
    animation: bb-badge-climb 16s cubic-bezier(0.19, 1, 0.22, 1) infinite both;
  }

  .live-pip {
    animation: bb-live-pip 2.4s cubic-bezier(0.19, 1, 0.22, 1) infinite;
  }
}

/* The resting state: the t = 15360ms frame, pinned to "31 unread" (§4.7). This
   is also what the visual-comparison harness screenshots against. */
@media (prefers-reduced-motion: reduce) {
  /* ... exactly the block in §4.7 ... */
}
```

Dropped as dead: `pf-clock-late`, `pg-still`, `pf-done-rest`, the first copy of
`pg-n3/n4/n5`, and all three copies of the `pf-won-*` set (another section).

---

## 6. Mobile composition (<1024px)

A different composition, not a reflow. Two phones **stacked vertically** with
**three rows each**, no photographs, no gradients, no animation, and the captions
moved *inside* the phone screens.

### 6.1 Shell

```
section: padding:0 16px 34px
panel:   overflow:hidden; border-radius:12px; background:var(--m-forest,#15301F);
         padding:28px 16px 24px
```

`--m-*` are the mobile artboard's re-declaration of the same palette; map them
straight onto our tokens (`--m-forest` → `forest-900`, `--m-lime` → `lime-500`,
`--m-rust` → `rust`, `--m-bg` → `canvas`, `--m-ink` → `ink`, `--m-ink-500` →
`slate-500`, `--m-serif` → the display face).

### 6.2 Header block

Left-aligned here, not centred.

Eyebrow — `.m-eyebrow` (`font-size:11px; font-weight:700; letter-spacing:.14em;
uppercase`) with `color:var(--m-lime)`. Copy: `A week in Marcus's pocket`.

**Note:** this eyebrow is `lime-500` on forest (10.24:1) — it is **not** the
`#7E9A2B` mobile eyebrow that RULINGS corrected to `--color-eyebrow-mobile`. Do
not apply that token here.

H2 — `.m-h2` (`Fraunces; wght 600, SOFT 60, opsz 32; letter-spacing:-.005em;
line-height:1.14`), `margin:10px 0 8px; font-size:26px; color:#fff`, with a hard
`<br>`:

> `You're on the tools.` `<br>` `Bramble's running the office.`

See §7 for the `<br>` decision.

Body — `margin:0 0 20px; font-size:14.5px; line-height:1.55; color:#B9C7B0`:

> `Quoting, chasing, variations, invoices. It all lands on you, at night, after a
> full day on the tools. Bramble runs the lot from first enquiry to final
> payment.`

**Shorter than desktop** — the mobile artboard drops `, so the job moves forward
while you sleep.` Preserve both, per the §02 ruling 12/13/14 precedent. Log.

Stack wrapper: `display:flex; flex-direction:column; gap:12px`.

### 6.3 Both phones, mobile

Pills: `align-self:center`, `padding:5px 14px` (`5px 14px 5px 11px` on the lime
one), label `font-size:10.5px` (desktop is 11.5px), Sprout SVG `13×13` (desktop
15). Same copy, same colours.

Frame: `margin:0 auto; width:min(100%,300px); border-radius:34px;
background:#10160F; padding:8px;
box-shadow:0 26px 50px -28px rgba(21,48,31,.7), 0 0 0 1px rgba(255,255,255,.06) inset`.

Screen: `position:relative; overflow:hidden; border-radius:27px`, background
`#101A14` (left) / `var(--m-bg,#F3F0E6)` (right). Inner padding `26px 12px 14px`.

**No `aspect-ratio`.** The mobile phones are content-height — they are as tall as
their three cards plus the caption. **No `<img>` and no gradient overlay on
either side.** The notch is the same 5px slit but `width:58px`.

Left status row: `padding:0 2px 10px`, clock `12:06 am`, and a **static** pill —
`background:var(--m-rust,#96602B); padding:3px 9px; font-size:10.5px;
font-weight:700; color:#fff` — reading `31 unread`. One count, no crossfade.

Right status row: `padding:0 2px 4px`, clock `7:05 am` in `var(--m-ink-500)`
(not white — there is no dark band to sit on), and a badge with
`background:var(--m-forest)` (a **solid forest pill**, not the desktop's
`rgba(255,255,255,.2)` glass), `gap:6px; padding:3px 10px`, a plain 6px lime dot
with **no pulse ring**, and copy `All handled`.

Right greeting is a `<p>`, `margin:0 2px 10px; font-family:var(--m-serif);
font-weight:600; font-size:15px; color:var(--m-ink)` — 15px not 14px, and **ink
on cream**, which is why it has none of the desktop greeting's contrast problem.

Card lists: `display:flex; flex-direction:column; gap:7px`.

Left cards: `gap:9px; border-radius:10px; background:rgba(255,255,255,.1);
backdrop-filter:blur(10px); padding:9px 10px;
box-shadow:0 0 0 1px rgba(255,255,255,.09) inset`. Icon tile `24×24`,
`border-radius:6px`, SVG `13×13`. Channel label is **9.5px** here, not 10px.

Right cards: `gap:9px; border-radius:10px; background:#fff; padding:9px 10px;
box-shadow:0 5px 14px -10px rgba(21,48,31,.4)`. Icon tile `23×23`,
`border-radius:6px`, SVG `13×13`, lime background.

### 6.4 The three rows each, verbatim

**Before Bramble** — a different three, in a different order, with one shortened
message:

| # | Sender | Time | Message | Channel | Tile bg | Icon |
|---|---|---|---|---|---|---|
| 1 | `Sarah Whitcombe` | `11:42 pm` | `Any update on that quote?` | `SMS` | `#96602B` | `MessageSquare` |
| 2 | `Dave — Plumbers Inc` | `12:26 am` | `Price attached for the pool plumbing.` | `Email` | `#6E4119` | `Mail` |
| 3 | `Dan — Stonemason` | `12:14 am` | `Need the paver count before I order` | `WhatsApp` | `#8A6A2F` | `MessageCircle` |

Row 2 drops desktop's ` Need it back by Tues.`; rows are **not** in time order
(12:26 before 12:14). Both as drawn.

Left caption, **inside the screen**, after the cards:

```
margin:12px 2px 0; font-size:12px; line-height:1.45; color:rgba(255,255,255,.55)
```

> `They keep coming, and the quotes wait until Sunday.`

Entirely different copy from desktop's caption, and shorter.

**With Bramble** — three of the desktop five, reordered, retitled, **and with no
action labels at all**:

| # | Icon | Title | Sub |
|---|---|---|---|
| 1 | `Phone` | `Sarah opened your quote three times` | `She keeps going back to the paving. Worth a call.` |
| 2 | `HardHat` | `Dave from Plumbers Inc sent his price` | `Pool plumbing Bronte job, $4,180.` |
| 3 | `Receipt` | `Ana's invoice cleared, $21,400` | `Mosman retaining and steps. Paid overnight.` |

Row 1 drops ` today`; row 2 gains ` sent his price`; row 3's sub drops
`, job closed off.`. The `Check`/`Variation priced` and `Sprout`/`Jo Harcourt`
cards do not appear on mobile. Text stack is `gap:3px` with only two children —
no third `<span>`.

Right caption, inside the screen:

```
margin:12px 2px 0; font-size:12px; line-height:1.45; color:var(--m-ink-500)
```

> `Marcus opens his phone and already knows where every job is at, and who to call
> first.`

Again wholly different from desktop's caption.

### 6.5 How the mobile animation set differs

**There isn't one.** No element in the mobile section carries `.pg`, `.pf-calm`,
`.pf-badge`, `.pf-buzz`, `.pf-livepip` or any other animated class. Mobile is a
single still frame of the same story:

| Desktop | Mobile |
|---|---|
| ten cards arriving over 13.1s | three, static |
| five counts crossfading `4→9→16→31→23` | one, `31 unread` |
| halo + jolt on every arrival | none |
| `pf-calm-in`, five cards on 900ms stagger | three, static |
| `pf-badge-climb` on "All handled" | static, and a solid forest pill |
| `pf-livepip`, 2.4s | no pulse ring at all |
| `pf-ping-buzz` on the unread pill | none |

The consequence for us is good: the reduced-motion resting state (§4.7) pinned to
`31 unread` and to all cards open **is the mobile composition**, at a smaller
card count. The two agree.

---

## 7. The 320→1023px fluid behaviour  **[Designer decision]**

The mobile artboard is a fixed 430px column with zero media queries. Everything
not listed holds its artboard px value at every width.

**Outer gutter.** `16px` from 320px, stepping to `32px` at ≥640px.
The artboard draws 16px and the neighbouring social-proof band also draws 16px,
which RULINGS §03/04 ruling 16 settled as "reproduce as drawn" — so 16px stands
below 640px even though the hero uses 20px. The 4px ragged edge is already logged
there and this section inherits it rather than creating a new inconsistency. The
step to 32px at 640px is the house convention for the half of the range the
artboard says nothing about; without it the forest panel hugs the edge of a
tablet in a way the design never proposes. **Log** the 16 vs 20 mismatch again
with a pointer to ruling 16.

**Content cap.** The panel's contents are `width:100%; max-width:560px;
margin-inline:auto`. Same 560px cap as every other section. Above ~600px the
14.5px body paragraph would otherwise run 90+ characters, which the artboard
never proposes.

**Panel padding.** `28px 16px 24px`, stepping the horizontal to `24px` at
≥560px. Below 560px the panel is narrower than the cap and 16px is exactly what
is drawn; at and above it, 16px leaves the 300px phone sitting tight against a
now-wide panel edge. Vertical padding never changes.

**H2.** `font-size: clamp(22px, 6.05vw, 26px)`. 6.05vw is exactly 26.0px at
430px (the artboard value); it holds at 26px above 430px and clamps to 22px at
320px. `line-height:1.14`, `letter-spacing:-.005em` and the mobile Fraunces axes
(`wght 600, SOFT 60, opsz 32`) are unchanged at every width below 1024.

**Drop the artboard's hard `<br>`, use `text-wrap:balance`.** The `<br>` is tuned
for a 398px measure. At 320px it leaves `Bramble's running the office.` running
288px against a 256px column, forcing an ugly three-line shape with an orphan; at
560px it wastes half a line. `balance` reproduces the artboard's two-line break at
430px and does the right thing at both ends. This is a rendering fidelity fix, not
a copy edit — the text nodes are identical. **Log.**

**Body copy, captions and every card's type stay fixed** at their artboard px
(14.5 / 12 / 12.5 / 11.5 / 11 / 10.5 / 9.5). They are already at the floor of
comfortable; scaling them down at 320px trades a solvable width problem for an
unsolvable legibility one, and the 560px cap handles the top of the range.

**Phone.** `width: min(100%, 300px); margin-inline: auto`, unchanged. At 320px
the phone measures **256px** (320 − 32 gutter − 32 panel padding), 44px narrower
than drawn. Verified to fit: the text column inside a card is then 163px, the
widest sender/time row (`Sarah Whitcombe` + `11:42 pm`) measures ~145px, and the
longest message wraps to two lines with no overflow. No change needed.

**Frame and screen radii (34px / 27px), the 8px frame padding, the 26/12/14px
screen padding, the 5px×58px notch and the 7px card gap do not scale.** They are
a device depiction; scaling them makes the phone read as a different phone.

**Stack gap** stays `12px` at every width.

**At exactly 1024px the desktop composition takes over whole.** There is no
intermediate composition, there is no width at which four to nine notifications
appear, and there is no width below 1024px at which anything animates.

---

## 8. Accessibility

### 8.1 How much of this reaches a screen reader  **[Designer decision]**

**Recommendation: each phone is one `role="img"` with an `aria-label`. Everything
outside the two phone frames stays in the accessibility tree untouched.**

What stays, unchanged and fully readable:

- the eyebrow, the `<h2>`, and the header paragraph;
- both state pills, `Before Bramble` and `With Bramble` — these are the labels
  for the two halves of the comparison and they carry it;
- both captions. On desktop they are 40 and 32 words and they *are* the argument:
  "Everyone wants an answer, and they all want it from you, now…" against
  "Bramble priced the variation and managed the contractors' prices…". A screen
  reader user who reads only the header, the two pills and the two captions gets
  the entire point of the section.

What collapses to one string: the two phone frames and everything inside them.

The reasoning, both ways:

- **Against reading it all.** Ten notification cards is roughly 120 words of
  invented names, timestamps, channels and messages. A sighted user takes it in
  as *texture* — "that is a lot, and it is the middle of the night" — in well
  under a second, and never reads card 7. Serialised, it is a 45-second recital
  of fiction that buries the caption that follows it. Worse, the DOM is changing
  on a 16s loop: a virtual cursor can land on a card that is at `max-height:0`
  and `opacity:0`, or on four of the five unread counts that are invisible, and
  read them out as though they were on screen. That is not a hypothetical; it is
  what `opacity:0` does to `getComputedStyle` traversal but not to the a11y tree.
- **Against hiding it entirely.** `aria-hidden="true"` would leave a user with
  "Before Bramble … Everyone wants an answer" and no indication that a phone is
  being shown at all, which is a real loss of narrative — the *device* is the
  metaphor, and "same phone, two mornings" is information.
- **`role="img"` + `aria-label` is the right granularity**, and it is the same
  treatment RULINGS already approved for the hero's float stack (§02: "the entire
  `.pf-float-stack` is `aria-hidden` … decorative repetition"). Here the content
  is *not* pure repetition, so it earns a label rather than silence.

Ship these two labels:

> Left: `A phone at 12:06 am showing 31 unread messages — ten SMS, email,
> WhatsApp and missed-call notifications from clients and trades, every one
> asking for a price or an update.`
>
> Right: `The same phone at 7:05 am with Bramble running — a short, calm list:
> Sarah has opened your quote three times, the variation is priced and sent,
> Ana's invoice has cleared, Jo wraps Friday, and Dave's plumbing price is in.`

Mechanics:

- `role="img"` + `aria-label` goes on the **frame** div (§2.1 / §3.1), so the
  whole subtree including both photographs collapses.
- Both `<img>`s keep `alt=""`. They are decorative regardless and are ignored
  inside `role="img"`, but leave them correct.
- Change every `aria-hidden=""` in this section to `aria-hidden="true"` — 17 of
  them (the two notches, the two gradient washes, the ten notification icon
  tiles, the five calm icon tiles, the pip wrapper, the `Sprout` in the With
  Bramble pill). The empty string is not a valid value; RULINGS §03/04 ruling 7
  already fixed the identical mistake on the social-proof avatars.
- Card action labels are **not** interactive (§3.5). Nothing inside either phone
  is focusable, so the section adds zero tab stops and needs no focus styles.
- Exactly one `<h2>` here. The state pills are labels, not headings — do not
  promote them to `<h3>`.
- The two phones must exist once each in the DOM. `hidden desk:block` is
  `display:none`, which removes them from the a11y tree; `opacity-0` or `sr-only`
  would not.

### 8.2 Reduced motion and WCAG 2.2.2

The resting state is specified in full in §4.7 and pinned at `t = 15360ms` with
`31 unread`. That is a hard gate per RULINGS: an infinite loop without one fails
QA outright, and the harness's structural diff is only deterministic because both
sides settle to that frame.

**WCAG 2.2.2 (Pause, Stop, Hide) residual gap.** The left phone animates
continuously, well beyond 5 seconds, with no pause control. Same class of issue
as the marquee, and the same ruling applies (§03/04 ruling 5): reduced motion
stops it outright; **do not invent a visible pause button the artboard does not
draw**; log the residual honestly — a user who has not set the OS preference has
no mechanism. Unlike the marquee this content is `role="img"` and conveys nothing
a reader needs, which softens the impact but does not discharge the criterion.

**WCAG 2.3.1 (flashes)** passes with room to spare. The fastest transition in the
section is the jolt, four keyframes across 416ms — a 3px translate, not a
luminance flash. Nothing changes state more than about once per second.

### 8.3 Contrast — measured, not estimated

All ratios computed against the actual composited pixel: photograph average
sampled from the shipped `.webp` (`photo-3` `#787E65`, `photo-1` `#8C7F62`),
composited at the drawn opacity, then the gradient wash over that, then the
card's own `rgba(255,255,255,.1)`. Left-phone card background resolves to
**`#28312C`** at the top of the feed and **`#2B342E`** at the bottom; ratios are
quoted at the worse (bottom) end.

| Element | Colour | On | Ratio | Needs | |
|---|---|---|---|---|---|
| Eyebrow, 12px/800 | `#C8E84A` | `#15301F` | **10.24** | 4.5 | pass |
| H2, 48px | `#FFFFFF` | `#15301F` | **14.24** | 3.0 | pass |
| Header body, 16px | `#B9C7B0` | `#15301F` | **8.04** | 4.5 | pass |
| Left caption, 14px | `#B9C7B0` | `#15301F` | **8.04** | 4.5 | pass |
| Right caption, 14px | `#FFFFFF` | `#15301F` | **14.24** | 4.5 | pass |
| **`Before Bramble`, 11.5px/800** | `#E9C9A6` | `#313B22` | **7.51** | 4.5 | **pass** |
| `With Bramble`, 11.5px/800 | `#15301F` | `#C8E84A` | **10.24** | 4.5 | pass |
| Left clock `12:06 am`, 11px/600 | `rgba(255,255,255,.6)` | `#111B15` | **6.98** | 4.5 | pass |
| `N unread`, 10.5px/700 | `#FFFFFF` | `#96602B` | **5.24** | 4.5 | pass |
| Sender, 12.5px/600 | `#FFFFFF` | `#2B342E` | **12.86** | 4.5 | pass |
| Message, 11.5px | `rgba(255,255,255,.76)` | `#2B342E` | **8.13** | 4.5 | pass |
| **Notification time, 10.5px** | `rgba(255,255,255,.5)` | `#2B342E` | **4.49** | 4.5 | **fail (0.01)** |
| **Channel label, 10px/700** | `rgba(255,255,255,.42)` | `#2B342E` | **3.61** | 4.5 | **fail** |
| Right clock `7:05 am`, 11px/600 | `rgba(255,255,255,.86)` | `#374C3C` | **7.39** | 4.5 | pass |
| **Greeting, 14px/600 serif** | `#FFFFFF` | `#949E90` | **2.78** | 4.5 | **fail** |
| `All handled`, 10.5px/700 | `#FFFFFF` | `#5F7063` | **5.27** | 4.5 | pass |
| Live pip (non-text) | `#C8E84A` | `#5F7063` | **3.79** | 3.0 | pass |
| Calm title, 12px/600 | `#16321E` | `#FFFFFF` | **13.92** | 4.5 | pass |
| Calm sub, 11px | `#6E7669` | `#FFFFFF` | **4.71** | 4.5 | pass |
| Calm action, 10.5px/700 | `#2C5539` | `#FFFFFF` | **8.52** | 4.5 | pass |

**The rust badge is clean.** `color-mix(in oklab, #96602B 22%, transparent)` over
`forest-900` resolves to `#313B22`, and `#E9C9A6` on it is 7.51:1. The suspected
candidate measures fine — the failures are elsewhere.

Three real failures, escalated rather than fixed, matching how RULINGS handled the
eyebrows. My recommended minimum corrections:

1. **Greeting, 2.78:1 — the worst by a wide margin.** `#FFFFFF` at 14px on
   `#949E90`, because the gradient's `rgba(243,240,230,.97)` stop sits at 22% and
   the greeting sits at ~11%, i.e. exactly in the middle of the wash. Two fixes:
   - move the light stop from `22%` to `38%` → the greeting's background becomes
     `#6D7B6D` and white reaches **4.46:1**; at `42%` it is **4.73:1**. This keeps
     white text and only deepens the morning gradient. **Preferred** — it is the
     smaller visual change and it makes the greeting sit clearly in the dark band
     alongside the clock and badge, which is what the composition intends;
   - or recolour the greeting to `--color-ink` `#16321E` at the drawn 22% stop →
     **5.00:1**. Cheaper, but a dark serif floating on a mid-tone wash looks like
     a mistake.
2. **Channel labels, 3.61:1.** Raise `rgba(255,255,255,.42)` to
   **`rgba(255,255,255,.55)`** → **5.09:1**. `.50` gives 4.49 and misses by 0.01,
   so `.55` is the smallest safe step. Ten instances.
3. **Notification times, 4.49:1.** Raise `rgba(255,255,255,.5)` to
   **`rgba(255,255,255,.53)`** → **4.84:1**. This is a rounding-width miss, but it
   is on the wrong side of the line and the fix is invisible.

All three are inside the `role="img"` subtree, so one could argue WCAG 1.4.3's
"incidental" exemption for text that is part of a picture. I would not lean on
it: the copy is set as live text, it is fully legible, and a reader will read it.
Escalate with these numbers and let the client decide, exactly as with the
eyebrows.

---

## 9. Defects in the source — flagged, not fixed

Except D1/D2 (ruled: fix, §5), D11 and D15 (existing RULINGS precedent), and D18
(hard gate).

| # | Finding | Recommendation |
|---|---|---|
| D1 | Unclosed `@media (min-width:1280px)` at line 141, closing at 214, traps the whole animation system | **Fix.** §5. Ruled. |
| D2 | Nineteen keyframes declared twice (142–168 / 170–199), `pg-n3/n4/n5` conflicting; later wins | **Fix.** De-duplicate to the effective copy. §5.2. |
| D3 | Unread counts run `4 → 9 → 16 → 31 → 23`. The count **falls** at 11.5s while cards 9 and 10 are still arriving | Flag. It is copy/data, principle 3. `31 → 23` with nothing dismissed contradicts the section's own argument. Client's call. |
| D4 | Every count handover has a hard zero (9%, 21%, 42%, 72%), and the pill shows **no number at all** for the first 480ms of every cycle | Flag. Reproduce as drawn (principle 1). A 1.5% overlap on each handover would remove it. |
| D5 | Status bar reads `12:06 am` but seven of the ten notifications are timestamped **after** it (12:06 → 1:02 am) | Flag. The phone's clock is behind its own feed. |
| D6 | `@keyframes pf-clock-late{0%,40%{opacity:1}46%,100%{opacity:1}}` — used by nothing, and every stop is identical so it is a no-op even if it were | Drop. |
| D7 | `@keyframes pg-still` and `@keyframes pf-done-rest` declared in the same block, applied to no element in this section | Drop. |
| D8 | `data-calm=""` on calm cards 1, 2, 4, 5 but **not** 3; read by no CSS and no JS | Drop all five. Dead attribute, inconsistently applied. |
| D9 | `.pf-buzz` fires **once** per 16s cycle (640→1280ms) while ten notifications arrive. Ten pings, one buzz. At 16s a 1% step is 160ms, so it reads as a slow wobble rather than a buzz | Flag. Fixing it means re-choreographing, which is a design change. |
| D10 | `.pf-badge` ("All handled") fades out at 13.44s and is **absent for the last 2.56s** of every cycle — 16% of the loop — with nothing on the right phone motivating it | Flag. Probably a leftover from a longer sequence this badge once belonged to. |
| D11 | `aria-hidden=""` (empty string) on 17 elements | **Fix** to `"true"`. §03/04 ruling 7 precedent. |
| D12 | `gap:9px` on the `Before Bramble` pill, which has exactly one child | Drop the inert declaration, reproduce the render. §02 ruling 3 precedent. |
| D13 | Radii off the 4/6/8/12 scale: 34 (frame), 26/27 (screen), 10 (calm card), 9 (halo ring), 7 (notification tile) | Ship as drawn, log. §01 ruling 8 precedent. |
| D14 | The same 34px frame with the same padding gets a **26px** screen on desktop and a **27px** screen on mobile. One is a typo | Ship both as drawn, log. |
| D15 | Mixed apostrophes: curly in `Where’s`, `Can’t`, `you’re`; straight in `Marcus's`, `You're`, `Bramble's`, `Here's`, `Ana's`, `contractors'` | **Fix** — normalise to curly. Typographic, not editorial. §02 ruling 10. |
| D16 | Sources are `assets/photo-3.png` / `assets/photo-1.png`; the repo ships `.webp` | Map to `/images/photo-3.webp` and `/images/photo-1.webp`. |
| D17 | `.pf-livepip` declares no `animation-fill-mode`. Harmless while running (0% and 100% are both declared) but it is why the pulse renders as a solid dot, not a ghost, when the animation is absent | Note only. Our resting state sets `opacity:0` explicitly (§4.7). |
| D18 | The artboard's reduced-motion block forces `opacity:1` on all ten halo rings and all five unread counts, and `margin-bottom:7px` onto jolt divs, rings and count spans — and is itself trapped inside the broken media query | **Fix.** Hard gate. Replace wholesale with §4.7. |
| D19 | Infinite >5s animation with no pause mechanism (WCAG 2.2.2) | Partial: reduced motion stops it; do not invent a control; log the residual. §03/04 ruling 5 precedent. |
| D20 | Contrast: greeting 2.78:1, channel labels 3.61:1, notification times 4.49:1 | Escalate with §8.3's numbers and recommended corrections. |
| D21 | Ten cards (~780px) in a ~493px feed: four are permanently clipped above the mask at full extension | **Not a defect.** `flex-end` + `overflow:hidden` + the 14% mask are what make the pile-up read. Documented so QA does not file it. |
| D22 | `max-height:150px` on the open frame gives ~79px of headroom over the tallest current card. A message that wrapped to three lines would clip | Note. No current message does. Any copy change must be re-checked against 150px. |
| D23 | `text-wrap:balance` and `.pf-oneline`'s `white-space:nowrap` are contradictory on the same `<h2>`; nowrap wins at ≥1280 and `balance` is inert there | Flag, and measure per §5.4 before shipping. |

---

## 10. QA checklist

### Structure

- [ ] Two components, `hidden desk:block` and `desk:hidden`. Both phones exist
      once each in the DOM; neither is hidden with `opacity-0` or `sr-only`.
- [ ] Desktop section: `mx-auto w-full max-w-[1280px] px-6 pb-24`; panel
      `rounded-xl bg-forest-900 pt-16 px-10 pb-14 overflow-hidden`.
- [ ] Mobile section: `px-4 pb-[34px]`, panel `pt-7 px-4 pb-6`, content capped at
      560px and centred (§7).
- [ ] Exactly one `<h2>`; document outline unbroken from the section above.
- [ ] All notification and calm-card data comes from one
      `content/before-after.ts`, desktop and mobile arrays both.

### Copy — character for character

- [ ] Ten desktop notifications match §2.6: senders, times, messages, channel
      labels, including all three U+2014 em-dashes with spaces.
- [ ] Five desktop calm cards match §3.6, including the action labels.
- [ ] Three mobile notifications match §6.4, including the **shortened** row 2
      message and the **out-of-order** 12:26 / 12:14.
- [ ] Three mobile calm cards match §6.4 and have **no** action label `<span>`.
- [ ] Desktop header paragraph ends `…while you sleep.`; mobile ends
      `…final payment.` Both present, neither harmonised.
- [ ] The two desktop captions and the two mobile captions are four **different**
      strings. None is reused across breakpoints.
- [ ] Every apostrophe in the section is U+2019 (D15).

### Geometry

- [ ] Desktop frame measures **280 × 575.56px**, screen **262 × 557.56px**.
- [ ] Desktop grid is `repeat(2, minmax(0, 340px))`, `gap:24px`,
      `justify-content:center` — total 704px, centred.
- [ ] Left screen `border-radius:26px`, mobile `27px` (D14 — both as drawn).
- [ ] Left feed has `justify-content:flex-end`, `overflow:hidden` and the
      `transparent 0% → #000 14%` mask; right stack has none of these.
- [ ] Photos: `photo-3.webp` at `opacity:.22` left, `photo-1.webp` at
      `opacity:.3` right; both `alt=""`, `fill`, `object-cover`.
- [ ] Mobile phones have **no** `<img>`, **no** gradient overlay and **no**
      `aspect-ratio`.
- [ ] `-webkit-backdrop-filter` ships beside every `backdrop-filter` (three of
      them: notification cards desktop and mobile, the All-handled badge).

### Animation — freeze the clock

Freeze with, in the page console or the Playwright harness:

```js
const T = 15360;                       // ms into the 16s cycle
document.getAnimations().forEach(a => { a.pause(); a.currentTime = T; });
```

`currentTime` is measured from the animation's own start, i.e. **it includes
`animation-delay`**. For the five calm cards, whose delays are positive, the
frame you want at cycle time `t` is `currentTime = t + delay`. For `.live-pip`,
which is on a 2.4s clock, use `t % 2400`.

Check these frames on the left phone:

- [ ] `t = 0` — feed empty; rust pill present but **showing no number** (D4).
- [ ] `t = 480` — card 1 begins; halo 1 begins.
- [ ] `t = 672` — halo 1 at peak, `opacity:.85`, `scale(1)`.
- [ ] `t = 720` — `4 unread` at full opacity, alone.
- [ ] `t = 880` — card 1 fully open: `max-height:150px`, `margin-bottom:7px`,
      `translateX(0) scale(1)`.
- [ ] `t = 1440` — card 2 begins **and** the pill is blank (D4). Both counts at 0.
- [ ] `t = 2400` / `3360` — cards 3 and 4. Confirm the gaps measure **960ms**.
- [ ] `t = 3600` — `16 unread`, alone.
- [ ] `t = 5120` — card 5. Confirm the preceding gap measures **1760ms**, the
      only irregular one in the loop.
- [ ] `t = 6720` / `8320` / `9920` / `11520` / `13120` — cards 6–10 at a flat
      **1600ms** metronome.
- [ ] `t = 6960` — `31 unread`. `t = 11760` — `23 unread`.
- [ ] `t = 13520` — card 10 open. Ten wrappers at `max-height:150px`.
- [ ] `t = 15360` — **the reference frame.** Six cards visible, four clipped above
      the mask, `23 unread`, every `margin-bottom` at 7px.
- [ ] `t = 15680` — all ten mid-collapse **together**. Any stagger here is a bug.
- [ ] Every halo has reached `opacity:0` before the next card begins (compare the
      `ring gone` and next `p` columns in §4.2 — they are equal by construction).
- [ ] `.ping-ring` and `.unread` compute to `linear`; everything else to
      `cubic-bezier(0.19, 1, 0.22, 1)`; `.ping-buzz` to `ease-in-out`.

Right phone:

- [ ] Calm card N is invisible before `delay + 480ms` and fully up at
      `delay + 1760ms`. Spot-check card 1 at 2160ms and card 5 at 5760ms.
- [ ] At no cycle time are fewer than three calm cards visible.
- [ ] `.calm-badge` is at `scale(1.2)` at 1920ms, settled at 2560ms, and
      **absent** between 13440ms and 16000ms (D10).
- [ ] `.ping-buzz` fires once and only once per 16s, between 640 and 1280ms (D9).
- [ ] `.live-pip` reaches `opacity:0, scale(2.6)` at 1680ms of its own 2.4s clock
      and holds invisible to 2400ms; the solid base dot never moves.

### Reduced motion

- [ ] With `prefers-reduced-motion: reduce`, every animation in the section
      reports `animation-name: none`. Nothing is left running.
- [ ] Exactly **one** unread count is visible, and it reads **`31 unread`** —
      not five superimposed, not `23`, not blank (§4.7, D18).
- [ ] **Zero** halo rings are visible. This is the single fastest way to spot the
      artboard's broken block having been ported verbatim.
- [ ] All ten notification wrappers are open with `margin-bottom:7px`; the inner
      `.ping-card` divs have `margin-bottom:0`.
- [ ] `.live-pip` is at `opacity:0` and the badge shows one solid lime dot.
- [ ] All five calm cards are visible, `opacity:1`, `transform:none`.
- [ ] Screenshot this state and confirm it is the same composition as the
      `t = 15360ms` live frame apart from the count.

### The media-query fix

- [ ] `styles/motion/before-after.css` contains **no** `@media (min-width:…)` —
      only the reduced-motion block.
- [ ] `pf-clock-late`, `pg-still`, `pf-done-rest` and the dead `pg-n3/n4/n5` copy
      are not in the build. Grep for them.
- [ ] At **1024px**, the full 16s choreography runs. This is the regression the
      whole fix exists for — check it before anything else.
- [ ] At 1024, 1279 and 1280px the unread pill shows exactly one legible count.
- [ ] `.pf-oneline` / headline: screenshot the `<h2>` at 1024, 1279, 1280 and
      1440px. Neither end may be clipped by the panel's `overflow:hidden` (§5.4,
      D23). Record the measurement before the lead rules.

### Accessibility

- [ ] Each phone frame is `role="img"` with the `aria-label` from §8.1.
- [ ] Both `<img>`s are `alt=""`.
- [ ] No `aria-hidden=""` remains anywhere in the section — all 17 are `"true"`.
- [ ] The section adds **zero** tab stops. Tab from the section above lands on
      whatever follows; the five action labels are not `<button>` or `<a>`.
- [ ] VoiceOver: the section reads eyebrow → heading → paragraph → `Before
      Bramble` → left label → left caption → `With Bramble` → right label →
      right caption, and no individual notification is announced.
- [ ] Contrast spot-checks against §8.3: `Before Bramble` on the rust pill must
      measure **7.51:1** (it passes — do not "fix" it). The greeting, channel
      labels and notification times are the escalation.

### Fluid range (§7)

- [ ] 320px: gutter 16px, panel padding 16px, phone 256px, no horizontal
      overflow, H2 at 22px, no orphaned word.
- [ ] 430px: identical to the artboard. H2 measures exactly 26.0px; the H2
      breaks after `You're on the tools.`
- [ ] 560px: panel horizontal padding steps to 24px.
- [ ] 640px: gutter steps to 32px.
- [ ] 768px and 1023px: content capped at 560px and centred; phones still 300px;
      still zero animation.
- [ ] 1023 → 1024px: the composition swaps whole. No width shows nine cards, no
      width shows a photograph on mobile, no width animates below 1024.
