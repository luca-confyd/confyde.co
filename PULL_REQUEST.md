# Confyde homepage

Rebuilds the Confyde marketing homepage from the Claude Design artboards as a
statically prerendered Next.js site.

Every section was taken off the artboards value by value, then verified against
them by measurement rather than by eye. Sixteen sections, sixteen commits, one
branch.

---

## How to read this PR

The commits are the story. Each one is a section, and each commit message records
what was built, what was measured, and what was decided. If you only read one
thing, read the **Defects we found** section below - the artboards are strong
work, and the things that turned out to be broken in them are the parts worth
your attention.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build; the route prerenders static
npm run audit          # axe + console, three widths, both motion preferences
npm run geometry 1280 -- --scope hero    # measure a section against its artboard
```

---

## What is in it

| Section | Desktop | Mobile |
|---|---|---|
| Nav | fixed 1320px capsule, theme flip | sticky glass bar + dropdown sheet |
| Hero | 88svh stage, word-reveal headline, four flipping cards, stat strip | 620px plate, 38px headline |
| Trades marquee | 60s scroll inside the hero card | 26s band |
| Social proof | four landscapers, two accreditations | 2-col grid |
| Before / after | two phones, 16s ten-card choreography | two stacked phones |
| Chapter 1 | 15s take-off demo, 12s file ingest, proposal card | reordered, same three blocks |
| Chapter 2 | 20s replay synced to an accordion, close-the-deal, get-paid | 14s mini replay |
| Integrations | eight partner tiles | 2-col |
| Chapter 3 | count-ups, kanban, 14s won-job flight, leaderboard | stacked groups + leaderboard |
| Mid-page proof | two pull quotes | same |
| Repeat work | CRM panel + forest stat card | same |
| What you get back | three cards | stacked |
| Testimonials | snap scroller with scroll-linked drift | 3-card scroller |
| CTA stage | 200vh pinned scroll-scrub | static band (addition) |
| Customer stories | three story cards | stacked (addition) |
| FAQ | 11 items, single-open | 12 items, native disclosure |
| Footer | 660px photo footer | two columns |

---

## What we cut, at your request

The three inline CTA bars. That also removed the only uses of the three Brambie
mascot illustrations, so those images came out of the repo and out of the asset
pipeline.

The page still has the hero's two CTAs, the nav, the desktop floating bars, the
mobile sticky bottom bar and the pinned CTA stage.

---

## How it was verified

Two harnesses, both in `scripts/`, both reusable.

**`npm run geometry`** renders the original artboard and our build side by side,
matches every text node between the two documents by its content, and compares
position, size, weight and font family. This is the acceptance test. A pixel diff
over a page like this is mostly noise - the photographs fill the frame and are
re-encoded twice on our side, so tens of thousands of pixels differ by a value or
two and tell you nothing. What matters is whether the type and the boxes land in
the same places.

**`npm run audit`** runs axe and captures console output at three widths in both
motion preferences.

Both harnesses learned things during the build and now guard against them: they
rebuild when the build is older than the source tree (a stale server reports a
*pass* against old output, which is worse than no check), they normalise the
artboard's unreset body margin, they can freeze both sides' animation clocks to
the same instant, and they can match scroll progress for the scrubbed section.

---

## Defects we found in the artboards

These are the reason the build took the shape it did. Each was found by
measurement, and each is fixed unless noted.

### Broken animations

- **The marquee loop never closed.** The track is two copies with a gap between
  them, so `translateX(-50%)` travels one copy plus *half* a gap where a seamless
  loop needs a whole one. Desktop snapped back 40px every 60 seconds, mobile 14px
  every 26. Invisible in a still, which is how it survived review.
- **The take-off scan never swept.** Desktop ends at `translateY(104%)` on a 16%
  tall element, so it covered a sixth of the plan and never reached either
  measurement it exists to reveal. The mobile artboard writes `560%` for the same
  element, which is how we know it is a typo.
- **The file-ingest loop never cleared.** A 12s cycle with 0/0.5/1/1.5s delays
  means the last file exits at 13.02s, after the first has already restarted.
- **An unclosed media query disabled a whole section below 1280px.** The
  before/after keyframes are defined globally but every driver sits inside an
  `@media (min-width:1280px)` that is never closed. Below 1280 all five unread
  badges render superimposed in one pill and all ten notification cards stack
  flush.

### Broken reduced-motion states

Four sections define a reduced-motion resting state that is wrong. Chapter 2's
opens all six accordions at once; chapter 1's hides both plan annotations behind
their covers, lays the scan band across the plan and prints five timestamps on
top of each other; the before/after block forces all ten halo rings visible. Each
now has a correct resting state, which is both the accessible state and what the
comparison harness measures against.

### Contrast

Fourteen text colours failed WCAG AA and are corrected to the smallest value that
clears the threshold. The notable ones:

| Where | Was | Now |
|---|---|---|
| Eyebrows, desktop and mobile | 2.26 / 2.81 | 4.54 / 4.53 |
| Marquee terms | 2.27 / 2.88 | 3.02 / 4.53 |
| Chapter headings over the photograph | 2.75 | 3.07 - 3.83 |
| Proposal masthead | 2.69 - 4.48 | 4.63 - 9.48 |
| CTA stage's unrevealed words | 1.58 | 3.0+ |
| Testimonial and CTA avatar discs | 3.85 | 8.52 |
| "What you get back" body copy | 2.87 | 4.62 |

Two of these are worth a note. `slate-500` was corrected at the token rather than
per call site - it passed on white at 4.71 and failed on the desktop page surface
at 4.39, and two percent darker is imperceptible while fixing every use at once.
And `forest-500` carrying white text cannot be rescued by any ink in the system
(white 3.85, forest-900 3.70, cream 3.01), so the *tone* moved rather than the
text on it.

### Accessibility

- `aria-hidden=""` is not a valid value, so screen readers were announcing every
  avatar's initials before the name.
- The FAQ accordion had no `aria-expanded` or `aria-controls`.
- The floating bars stayed keyboard-focusable while invisible, relying on
  `pointer-events` alone.
- Heading levels skipped h1 to h4.
- Neither artboard defines a focus style anywhere. The build uses the brand's own
  rule: cream on dark surfaces, forest elsewhere.
- Neither artboard has a skip link.

### Layout

- **Three of four organisation lines truncated at exactly 1024px** - the width we
  switch layouts. "Adam Robinson Design, Sydney" needs 174px against 148px of
  room, so real company names would have silently ellipsised.
- **Partner names truncated below 430px**, clipping five of eight at 320px.
- **Nav pill dividers were pure white with no light-state variant**, so they
  vanished against the white pill.
- **The testimonial carousel scrolled 504px per click against 404px cards.**
- **The nav's dark/light flip fired 78.5px late**, leaving a white wordmark and
  white links on the cream band. Both navs now observe the boundary itself rather
  than approximating it with arithmetic.

---

## Things we did not fix, and why

These are in the build exactly as drawn. They need a decision from you, not from
us.

### Your content

- **The proposal's line items do not sum to its total.** Five scope lines make
  $41,720 against a printed $48,200 inc. GST; mobile drops the Irrigation row and
  makes $36,400 against the same total. On a quoting product this is the detail a
  landscaper notices first.
- **Chapter 2's milestones sum to $62,800** against the same $48,200 quote, and
  four of six accordion groups' line items do not sum to their own headers.
- **The before/after phone's unread count falls** from 31 to 23 while two more
  notifications are still arriving, and the status clock reads 12:06 am while
  seven of the ten messages are timestamped later.
- **`then and rewrites it`** in chapter 1's desktop paragraph. The mobile
  artboard's version of the same sentence is grammatical.
- **Em dashes and an exclamation mark** appear in several strings, both of which
  `docs/brand.md` bans. We do not edit your copy.
- **Desktop and mobile write genuinely different sentences** in at least five
  places - the hero's secondary CTA is "See how it works" on desktop and "Book a
  demo" on mobile, and three chapter paragraphs differ outright. All preserved.

### Your design

- **The three stat cards in chapter 3 are not tilted, because the artboard does
  not render them tilted.** The inline `rotate(-5deg)` sits on the same element
  as the reveal animation, and an animation with `fill-mode: both` outranks an
  inline style - so from the moment they enter the viewport all three compute to
  no rotation. Verified on the artboard at two widths and by screenshot. If you
  want the tilt, it is one wrapper element: reveal on the parent, rotation on the
  card.
- **The CTA stage's chips have no white keyline or shadow**, because the inline
  blur on each chip destroys the `filter` that draws them. A white pill on the
  near-white page is then a 1.07:1 edge. Restoring it means a permanent filter on
  eleven render surfaces.
- **The proposal card's title renders at weight 420, not the 600 its own style
  declares** - `font-variation-settings` beats `font-weight`, and the class sets
  the axis. Building to the declared value would have been visibly wrong.
- **Three partner lettermarks fail AA on their own brand colours** - QuickBooks
  3.41, Google Drive 1.93, WhatsApp 1.98. WCAG exempts text that is part of a
  logo or brand name, so they ship unchanged; recolouring them would mean
  altering three other companies' marks. QuickBooks could not be fixed anyway:
  nothing in the palette clears 4.5 on that green.
- **Nine static heat blobs collapse the replay document's group headers to
  1.08:1** at their centres. This is inside a `role="img"` depiction and is in the
  artboard too.
- **The two artboards use different body typefaces** - desktop loads Nunito Sans,
  mobile loads Nunito, which is the rounded cut. We unified on Nunito Sans,
  following your "desktop is authoritative" call. Worth knowing that two of the
  three artboards in the export use Nunito, so it is arguable the desktop
  homepage is the outlier. It is one line in `app/layout.tsx`.

### Known differences we chose

- **The mobile page runs at `line-height: 1.5`** where the mobile artboard leaves
  it at `normal`, which accumulates roughly 17-24px down a long mobile section.
  Our mobile composition is already an authored adaptation rather than a port -
  the artboard is a fixed 430px column with no media queries, so the entire
  responsive range is ours - and nothing fails or overflows. Changing a page-wide
  typographic default at the end of the build would have invalidated every mobile
  verification for no defect.
- **A marquee that a touch user cannot pause.** Hover and keyboard focus pause it
  and reduced motion stops it outright, but a touch user has no mechanism, which
  leaves WCAG 2.2.2 partly unmet. The only fix is a visible control the artboards
  do not draw.
- **Two sections have no mobile design at all** - the CTA stage and customer
  stories. Rather than drop real content on phones, both are adapted into the
  mobile language the rest of the page establishes. They are additions, not
  ports.
- **Every CTA is inert.** No destination exists yet. They are keyboard-focusable
  and announced honestly, and adding an `href` to one record turns each back into
  a real link.

---

## Decisions you made during the build

- Fix all four of the original contrast failures rather than ship them.
- The product typefaces in social proof are correct, and mobile should match
  desktop rather than the other way round.
- Cut all three inline CTA bars.
- Spec depth proportional to section complexity.

---

## Performance

The export ships every photograph as a 2-3 MB PNG, which is the worst possible
container for photographic content. `scripts/optimize-assets.mjs` re-encodes them
from the pristine originals:

```
23.3 MB of PNG  ->  2.0 MB of WebP        before next/image runs at all
```

Only the nine images the page actually references are committed. The other ~46 MB
of the export is referenced by nothing.

Nothing from the export ships as JavaScript. Its canvas runtime (`support.js`,
69 KB, which pulls React *and Babel* off a CDN at page load) and its compiled
component bundle (161 KB) are both discarded. The only real logic in it was two
small classes of plain DOM code, rewritten as hooks.

The scroll-scrubbed CTA stage deserves a note. The artboard writes 72 inline
styles per scroll tick - eleven of them percentage insets, so that is layout on
eleven absolutely positioned boxes every frame - plus a 300-character gradient
string rebuilt and re-rasterised across 1.3 megapixels. The rebuild writes one
custom property and derives everything else in static CSS. Measured over a
151-frame scrub: 7 layouts against a control baseline of 2, no long tasks, zero
dropped frames.

---

## Architecture

- **Next.js 16 App Router, TypeScript, Tailwind v4.** The route prerenders to
  static HTML; there is no `output: 'export'`, which keeps `next/image`
  optimisation available on Vercel - and this page renders the same four
  photographs eighty times.
- **Server Components throughout**, with `'use client'` on five leaves that
  genuinely need scroll or interaction state.
- **One token set** in `app/globals.css`, replacing the three hand-copied prefix
  sets the artboards carry.
- **One motion file per animation system** in `styles/motion/`, each ending in its
  reduced-motion resting state.
- **All copy and every figure in `content/`**, so the numbers the page repeats
  across sections cannot drift.
- **One breakpoint**, 1024px. Below it the mobile artboard's design runs and
  widens fluidly; at and above it the desktop artboard's runs.

`docs/specs/` holds the per-section build specs and `docs/specs/RULINGS.md`
records every decision, with the measurement behind it. `docs/brand.md` is the
distilled brand doctrine the site is reviewed against.
