# Build rulings

Decisions on the defects and open questions the section specs raise. The engineer
follows these; the QA agent checks against them. Anything marked **log** goes in
`PULL_REQUEST.md` so the client can reverse it.

## Standing principles

1. **The rendered artboard is the acceptance test.** Our gate is a visual diff
   against the artboard as it actually renders. So where a class is inert because
   something later overrides it, we reproduce the *rendered result* and delete the
   inert class from our markup - we do not "restore" the intent, because that
   would make the build differ from the design it is meant to be.
2. **Functional defects get fixed, visual authoring choices do not.** Dead
   animations, mis-stepped carousels, missing ARIA and overflow traps are bugs.
   A shadow that is weaker than the author perhaps meant is the design.
3. **We do not edit the client's copy.** Wording, punctuation and tone are theirs.
   We flag; they decide. Typographic normalisation (quote marks) is not a copy
   edit.
4. **The brand doc outranks the artboard on anything the artboard left blank**
   (focus rings, reduced motion), and the artboard outranks the brand doc on
   anything it explicitly drew (the lime headline).

## Focus styles — resolved, not an open question

`docs/brand.md` already specifies this and no new decision is needed:

- On dark forest surfaces: a **2px cream ring** (`cream/30` per the brand system).
- Everywhere else: a **2px forest ring**.
- Form fields, if any appear: 2px sage plus a sage/15 ring.

Sage is correctly rejected for the hero - it is a field-focus tone and has no
contrast against the dark scrim. Lime stays banned as a focus colour.

## Reduced motion — a hard gate, not a nice-to-have

Every animation system gets a `prefers-reduced-motion: reduce` block in its own
file in `styles/motion/`, pinned to a defined resting state. This is both a WCAG
2.3.3 obligation and the mechanism the comparison harness depends on: the
structural diff is only deterministic because both sides settle to a known frame.

An infinite loop with no reduced-motion rule - the hero's 24s float-card flip is
the first of several - fails QA outright.

## Section 02, hero

| # | Spec's flag | Ruling |
|---|---|---|
| 1 | Lime headline contradicts the brand doc | **Build as drawn.** The design is the deliverable. **Log.** |
| 2 | Lime keyline on float cards is a banned decorative border | **Build as drawn. Log.** |
| 3 | `.shadow-overlay` / `.btn-glass` hairline are inert | **Reproduce the rendered result**; drop the inert class from our markup so the code says what it does. **Log** as an observation, not a fix. |
| 4 | `white-space:nowrap` on stat labels, <15px slack at 1024px | **Fix.** Drop nowrap on the labels, keep it on the figures. Subgrid holds alignment if one wraps. This is an overflow trap at exactly our switch width. |
| 5 | `#ACAFB1` one-off grey | **Keep as drawn**, as a commented local constant. Not a token - it has no role in the system. |
| 6 | `border-radius:12px` on a 6px dot | **Use `rounded-full`.** A 12px radius on a 6px box already clamps to a circle, so this is identical output and clearer code. |
| 7 | Font vars undeclared, cards falling back to browser defaults | **Incorrect reading - no defect.** The web artboard links `tokens/fonts.css` in its `<helmet>`, which declares `--font-sans` as Hanken Grotesk and `--font-serif` as Source Serif 4. The cards render in the app faces by design. Map them to `--font-ui` and `--font-ui-serif`. |
| 8 | Non-Lucide play glyph on the secondary CTA | **Fix.** Lucide is the only icon system. Use Lucide `Play`. |
| 9 | `!` in the sub-paragraph | **Keep.** Client copy. **Log** for their call. |
| 10 | Mixed straight and curly apostrophes | **Fix.** Normalise to curly. Typographic, not editorial. |
| 11 | 56px image inset against a 64px nav leaves an 8px seam | **Keep as drawn. Log.** It is in the render. |
| 12 | Desktop `See how it works` vs mobile `Book a demo` | **Preserve both. Log.** Two different moments; not ours to unify. |
| 13 | Fine print 10px desktop, 12.5px mobile | **Preserve both. Log.** |
| 14 | Desktop `complete`, mobile drops it | **Preserve both. Log.** |
| 15 | No focus styles | **Fix**, per the brand rule above. |

## Section 01, nav and floating bars

| Spec's question | Ruling |
|---|---|
| Component split: two headers, two bar systems, mutually exclusive by breakpoint | **Approved as specified.** |
| Inert destinations built as `<button type="button" aria-disabled="true">` behind one `<NavItem inert>` | **Approved.** This is the right call: keyboard-reachable, announced honestly, no `#` in the URL bar, and a one-prop switch when real routes land. |
| "Does a real signup URL exist?" | **No, and it is out of scope.** The client scoped this to the homepage and explicitly declined wiring the CTAs to a destination. Everything stays inert. **Log** it in the PR as the single thing to wire the moment they have a URL. |
| The hamburger has no designed menu; recommendation is a non-modal dropdown sheet | **Approved.** The button exists in the design, so it has to be honest; a non-modal sheet is the smallest thing that achieves that, and it is built entirely from tokens already on the page. **Log** clearly as an addition, not a port - the artboard does not draw it. |
| Desktop and mobile use different scroll thresholds; do not unify | **Agreed.** They are measuring different things (viewport height vs the hero's own box) because the two heroes are different heights. Unifying would break one of them. |

### Section 01 defect calls

| # | Finding | Ruling |
|---|---|---|
| 1 | `.pf-btn-ink` carries `border-radius:12px!important`, beating the CTA bar's inline `8px`, so the artboard **renders 12px** | **Ship 12px.** Principle 1. A naive port using `rounded-lg` would be visibly wrong. |
| 2 | Pill dividers are `rgba(255,255,255,.3)` inline with no `.on-light` variant, so they vanish on the white pill | **Fix** with `--color-hairline` on light. A divider that disappears in one of two states is a defect, not a choice. **Log.** |
| 3 | The bars wrapper transitions `transform` only, so it pops in opacity then glides | **Fix.** Add `opacity` to the transition list. |
| 4 | The hidden bars wrapper uses only `pointer-events:none`, leaving its CTA and dismiss tabbable while invisible | **Fix** with `inert`. A real focus leak. |
| 5 | The `cta` bar has no dismiss control (WCAG 2.2 §2.4.11) | **Keep as drawn**, but ensure the page carries enough bottom clearance that the bar never obscures content. The dismiss state is shared and the trailer bar - which does have a dismiss - always appears first on the way down, so the user always has an escape. **Log** the observation rather than inventing a control the design does not draw. |
| 6 | Mobile bottom bar omits `-webkit-backdrop-filter` while the nav has it | **Fix.** iOS would otherwise lose the blur. |
| 7 | Mobile wordmark is 19px/-0.01em, not the 24px `.wordmark` utility | **Ship as drawn.** Do not "correct" it to the utility. |
| 8 | 10px radii on the mobile CTA and hamburger sit off the 4/6/8/12 scale | **Ship as drawn. Log.** |
| 9 | `var(--font-sans)` in the trailer bar claimed to be undefined | **Incorrect - measured and disproved.** The artboard links `tokens/fonts.css`, so `--font-sans` resolves to Hanken Grotesk and `--font-serif` to Source Serif 4. Verified in the browser: the trailer's sub-line and CTA compute to `"Hanken Grotesk", system-ui, sans-serif`, and the float cards' figures to `"Source Serif 4", Georgia, serif`. Map both to `--font-ui` / `--font-ui-serif`. |
| 10 | Desktop flip fires at `scrollY < vh - 80`, later than the hero's dark area actually ends; mobile is late for the same class of reason | **Fix. Measured and confirmed as a real defect** - see below. |

#### Ruling 10, resolved by measurement

Measured on the artboard at 1280x900:

```
hero panel bottom   800px
nav bottom edge      58.5px
true clear point    741.5px   (hero bottom - nav bottom)
artboard flips at   820px     (innerHeight - 80)
lateness             78.5px
```

Screenshotting the nav at `scrollY = 810` - ten pixels before the artboard's own
flip point - shows the nav still in `on-dark`: white wordmark and white links
sitting on the cream marquee band. "Book a Demo", "Login" and "Get started" are
effectively invisible. Evidence: `review/_ref/navflip-810.png`.

So this is not a timing preference, it is ~78px of scroll during which the
primary navigation cannot be read. Fix it.

**Implementation:** a zero-height sentinel at the foot of the hero's dark region
plus an IntersectionObserver with `rootMargin` set to the nav's own height. That
lands the flip at the true boundary and stays correct when the viewport height,
the hero height or the nav height changes - none of which `innerHeight - 80`
survives. Apply the same treatment to the mobile nav, whose threshold is late by
the hero section's 20px of bottom padding for the same class of reason.

**Log** in the PR with the measurement above.

Mobile, measured the same way at 430x900: nav height 64px, the hero's dark inner
block ends at 636px, but the hero `<section>` the artboard measures ends at 656px
because of its 20px of beige bottom padding. So the mobile flip is 20px late -
the same class of error, an order of magnitude less severe than desktop's 78.5px,
and fixed by the same sentinel.

## Sections 03 (marquee) and 04 (social proof)

| # | Finding | Ruling |
|---|---|---|
| 1 | The `-50%` marquee loop does not close. The track is `A + gap + A`, so `-50%` travels `A + gap/2` where a seamless loop needs `A + gap`. Desktop snaps back 40px every 60s, mobile 14px every 26s | **Fix.** Principle 2 - this is a broken animation, not an authoring choice. It is invisible in a screenshot only because the inner and outer gaps happen to match, which is also why it survived review. Use outer `gap:0` plus a per-copy `padding-right`: identical rendering at rest, so the visual diff stays clean, and the loop actually closes. **Log.** |
| 2 | `sizes` string for the four photos, max rendered width 296px | **Approved as specified.** Keep it in one exported constant alongside the 560px column cap, since the `592px` term is derived from that cap and the two must move together. |
| 3 | Desktop social-proof cards and pills render in Hanken Grotesk / Source Serif 4 (the product faces); mobile renders the same content in Nunito Sans / Fraunces | **Reproduce as rendered.** Principle 1. This is marketing chrome, so §02 ruling 7 does not cover it and it does look like an authoring slip - but the artboard is the acceptance test, and overriding it here means overriding the design on an inference about intent, in the exact section we are diffing. Build desktop in the product faces, mobile in the marketing faces, and **log it prominently** as a question for the client. Their call, not ours. |
| 4 | Desktop marquee has no `prefers-reduced-motion` rule (the existing block covers `.pf-logo-track`, a different class) | **Fix.** Hard gate. Principle 4 - the artboard is blank here, so the brand doc governs. |
| 5 | WCAG 2.2.2: desktop pause is `:hover` only, mobile has no pause and its scroll strip is keyboard-inaccessible | **Partial fix.** Add `:focus-within` pause and make the region focusable, and ensure reduced-motion stops it outright. Do **not** invent a visible pause control - that is a design element the artboard does not draw. **Log the residual gap honestly**: touch users still have no mechanism. |
| 6 | Mobile's duplicate marquee track lacks `aria-hidden` (desktop's has it) | **Fix.** Terms are otherwise announced twice. |
| 7 | `aria-hidden=""` on all four avatars and both tick badges | **Fix** to `aria-hidden="true"`. The empty string is not a valid value, so screen readers currently read "AR Adam Robinson". |
| 8 | Heading-level skips - marquee is `<h4>`, mobile outline runs h1 → h4 → h2 | **Fix the semantics, keep the visuals.** Heading level and type size are independent; that is what the `.display-*` classes are for. |
| 9 | The 3px white avatar ring is inert (white on white, nothing overlaps) | **Reproduce the rendered result**, drop the inert declaration. Same class as §02 ruling 3. **Log** - it looks like a leftover from a layout where the avatar straddled the photo edge. |
| 10 | `#7E9A2B` mobile eyebrow is an un-tokened one-off | **Keep as drawn** as a commented local constant. |
| 11 | Desktop org lines may ellipsis at 1024px (~168px of text in ~148px) | **Verify in the browser before ruling.** Arithmetic is not evidence. I will measure. |
| 12 | Our own `.eyebrow` in `styles/base.css` matches neither artboard, and its comment says 11.5px where the value is 12.5px | **Our defect - fix.** No call site matches it. Removing it is better than keeping a utility nothing uses correctly. |
| 13 | Card shadow asymmetry: mobile cards carry a shadow where the value step already works, desktop cards have none where it barely does | **Reproduce as drawn. Log.** |
| 14 | `.m-h2` / `.m-h3` do not map onto `.display-*` (opsz, line-height and tracking all differ) | **Local override classes, as specified.** Do not bend the shared classes to fit. |
| 15 | `.pf-mq`'s 768px branch is dead in our build | **Flat 30px**, per principle 1. Record the dead 26px value in the spec only. |
| 16 | Mobile social proof uses a 16px gutter where the hero and marquee use 20px, leaving a 4px ragged edge below 640px | **Reproduce as drawn. Log.** It is in the render, and harmonising it is a design change. |

### Escalated to the client, not ruled here

**Contrast.** Both eyebrows fail WCAG AA (desktop ~2.3:1, mobile ~2.9:1) and so do
both sets of marquee terms (~2.0:1, ~2.9:1). This is not a section defect - the
brand system names `lime-700` as *the* eyebrow colour, so fixing it is a
brand-level change with page-wide consequences, and it directly conflicts with the
100/100 accessibility target set for this build. Escalated.

---

## Client decisions

Asked with measurements in hand; answered by the client. These are settled.

### Contrast — fix all four

All four failing text colours are darkened to the minimum that clears WCAG AA.
Measured on the rendered artboards, corrected values computed as the smallest
darkening that reaches the threshold:

| Where | Was | Now | Ratio | Threshold |
|---|---|---|---|---|
| Desktop eyebrow | `#95B225` | `#657919` | 2.26 → 4.54 | 4.5 |
| Desktop marquee terms | `#A4A39D` | `#8D8C87` | 2.27 → 3.02 | 3.0 (large text) |
| Mobile eyebrow | `#7E9A2B` | `#607521` | 2.81 → 4.53 | 4.5 |
| Mobile marquee terms | `#8A9082` | `#6A6F64` | 2.88 → 4.53 | 4.5 |

These become their own semantic tokens rather than edits to `lime-700`,
`pf-ink-400` or `slate-400`, because those three are used elsewhere at sizes and
on surfaces where they already pass and darkening them would be an unrequested
change. **Log** with the before/after ratios.

### Fonts — the product faces are correct, apply them on both

The desktop artboard sets social-proof names, org lines and accreditation pills
in Hanken Grotesk / Source Serif 4. The client confirms that is intended, so
**mobile changes to match desktop**, not the other way round. This supersedes
§03/04 ruling 3: build both breakpoints in `--font-ui` / `--font-ui-serif`, and
the mobile artboard's Nunito Sans / Fraunces is the side that was wrong.

### Section 01, resolved conflict

The spec's §4.4 says the trailer bar's sub-line and CTA are Nunito Sans; ruling 9
says Hanken Grotesk. **Ruling 9 is correct and the engineer was right to follow
it** - measured in the browser, those two elements compute to
`"Hanken Grotesk", system-ui, sans-serif`. The spec is wrong; no change needed.

---

## Section 05, before / after

| # | Finding | Ruling |
|---|---|---|
| 1 | The unclosed `@media (min-width:1280px)` leaves the `pg-*` keyframes defined globally but every *driver* inside the query, so below 1280 nothing animates: all five unread counts render superimposed in one pill and all ten cards render flush | **Fix, using the recommended approach.** The two artboards are different compositions (10 cards vs 3), so two components are forced regardless. Gate them with `hidden desk:block` / `desk:hidden` and the motion CSS needs no breakpoint at all. Simpler than hoisting and it removes the class of bug entirely. **Log.** |
| 2 | `.pf-oneline`'s nested `@media (min-width:1120px)` is load-bearing: at 1120px the panel gives 992px to a ~1130px nowrap headline, so hoisting to the authored breakpoint would clip the H2 | **Keep at ≥1280, as rendered.** Good catch. **Measure it in the browser before sign-off** rather than trusting the arithmetic. |
| 3 | The artboard's own reduced-motion block is broken: `.pg` sits on four kinds of element, so `opacity:1!important` forces all ten halo rings visible and all five unread counts superimposed | **Fix, with the replacement as specified.** Pinning to `t = 15360ms` showing `31 unread` is the right frame - it is the peak, it holds longest, and it is exactly what the mobile artboard draws statically, so the two breakpoints agree. **Consequence for QA:** our reduced-motion frame will deliberately differ from the artboard's, so the structural diff for this section must be run with `--motion none --freeze <t>` at matched `t` values on both sides instead. Note it in the section's QA run. |
| 4 | Duplicate keyframe block; only `pg-n3/n4/n5` differ and the later copy wins | **Keep the later copy** (handovers at 42%/72%), drop the dead one. |
| 5 | Contrast, measured against composited pixels: the suspected rust badge **passes** at 7.51:1. Three real failures - greeting 2.78:1, channel labels 3.61:1, notification times 4.49:1 | **Fix to AA.** The client's standing preference is established from the section 03/04 escalation: correct contrast failures with the smallest change that clears the threshold. Note the spec's preferred gradient-stop fix reaches only **4.46:1, which still fails** - so use whichever minimal change actually measures ≥4.5, and **verify by measuring the composited pixels, not by arithmetic**. **Log** with before/after ratios. |
| 6 | Do not apply `--color-eyebrow` here - this eyebrow is lime-500 on forest at 10.24:1 | **Correct, agreed.** Same point the hero engineer raised. The corrected tokens exist for lime-700-on-light only. |
| 7 | Accessibility: `role="img"` plus a written `aria-label` per phone frame, with everything outside the frames fully readable | **Approved.** Ten fake notification cards is ~120 words of fiction that a sighted reader takes in as texture in under a second, but silencing the phones entirely would lose the device metaphor, which is itself the argument. The four strings outside the frames carry the section's whole point and stay readable. |
| 8 | 23 catalogued defects, mostly narrative: the unread count *falls* 31 → 23 while cards are still arriving; the clock reads 12:06 am but seven notifications are timestamped after it; the pill blanks for a frame at each handover and shows nothing for the first 480ms of each cycle | **Ship as drawn. Log the notable ones.** These are content and choreography choices in the client's design, not defects in our port. Three dead keyframe sets (`pf-clock-late`, `pg-still`, `pf-done-rest`) and the unread `data-calm=""` attribute are dropped as dead code. |
| 9 | The mobile H2's hard `<br>` is tuned for a 398px measure and orphans at 320px | **Fix** with `text-wrap: balance`. A rendering fix, not a copy edit - the words are unchanged. |
| 10 | D21: ten cards clipping inside a 493px box is intentional | **Noted - QA must not file this as a bug.** |

### Body face: Nunito vs Nunito Sans

Caught by the geometry harness at 430px. The two artboards do not use the same
body face: **the desktop homepage loads Nunito Sans, the mobile homepage loads
Nunito.** They are different typefaces, not two names for one - Nunito is the
rounded cut.

**Ruling: Nunito Sans everywhere**, matching the desktop artboard. Two body faces
split across breakpoints is a brand defect rather than a design, and it follows
the client's own call on the section 04 font mismatch, where they chose the
desktop artboard as authoritative.

**Log this one prominently and note the counter-evidence**: two of the three
artboards in the export (mobile homepage and the product page) use Nunito, so it
is arguable that the desktop homepage is the outlier and Nunito is the intended
marketing face. Neither is blessed by the design system, which names Inter and
Fraunces for the marketing site. It is a one-line change in `app/layout.tsx` if
the client prefers Nunito.

Consequence: the mobile hero measures 3-4px of vertical drift against its
artboard, because the two faces have different vertical metrics. That is the
cost of the unification, not a layout bug.

### Section 03: the marquee belongs inside the hero card

Raised by the engineer during the build. In the desktop artboard the logo
marquee is **the last child of the hero's `shadow-border-strong` card**, not a
band of its own - so the card's bottom hairline and its layered shadow fall
*below* the strip, not above it. Building the marquee as a sibling reproduces
the surface tone but not that edge, and it is exactly the kind of one-hairline
difference that reads as "close but not right".

They composed it as a sibling because `components/home/hero/` was outside the
scope I gave them, which was the correct call - better to flag a scope boundary
than to quietly cross it.

**Ruling: move it inside the hero card.** The marquee component was written to be
portable for this (it carries its own `bg-pf-surface-500`), so this is a
composition change, not a rewrite. I will do it during section 03 review rather
than hand it back, and verify with the geometry harness that the card's bottom
edge lands below the strip.

---

## Page-wide conventions discovered during the build

Every engineer from section 05 on must know these.

### `sm:` beats `desk:` at desktop widths — use `sm-only:`

Tailwind emits the 64rem `desk` block **before** its own 40rem `sm` block, so on
any element that sets the same property at both, `sm:` wins at 1440px. It is not
a bug we can order around; it is how the variants are generated.

`@custom-variant sm-only (640px–1023px)` is declared in `app/globals.css` and is
disjoint from `desk`. **Use `sm-only:` for any mobile-range tweak on an element
that also has a `desk:` value for the same property.** Plain `sm:` is only safe
inside a subtree that is already `desk:hidden`.

This bit the social-proof band, whose `max-w` and `px` landed on their 640px
values at 1440px.

### The page surface differs by breakpoint

`body` is canvas beige below 1024 and `pf-surface-300` above, because the two
artboards genuinely do not share a page surface. Set on the page, not per band -
tinting individual bands would draw a seam the artboards do not have.

### Contrast headroom is thin by design

The corrected tokens clear AA by roughly 0.13 (`--color-eyebrow` measures
≈4.63:1 against a 4.5 requirement) because the client asked for the smallest
darkening that clears. Anything that composites them through an opacity - a
fade, an overlay, a tinted parent - will fail. Do not put them behind one.

---

## Scope changes from the client (mid-build)

### The inline CTA section is cut entirely

All three instances are removed from the homepage:

- "Build a bigger business. Start free" (brambie-leaning)
- "Create and send a quote within 30mins. Get started now, free" (brambie-peering)
- "Run your next job with Bramble, get started free!" (brambie-pointing)

Consequences handled: the three mascot images were referenced by nothing else on
the page and are deleted from `public/images/`, and `scripts/optimize-assets.mjs`
no longer lists them, so a re-run cannot quietly reintroduce them. That takes the
committed image payload from 2.3 MB to 2.0 MB and the asset count from 12 to 9.

The page still has plenty of conversion surface without them: the hero's two CTAs,
the nav's "Get started", the desktop floating bars, the mobile sticky bottom bar
and the pinned CTA stage.

### Spec depth is proportional to section complexity

Not every section earns a thousand-line spec. The deep treatment is reserved for
the sections with real choreography - chapters 1, 2 and 3, the before/after
phones, and the pinned CTA stage. Simple bands (FAQ, integrations, customer
stories, the mid-page pull quotes, the footer) go straight to an engineer working
from the artboard, with the same verification gate at the end.

The gate never changes: geometry to zero drift, axe and console clean at three
widths in both motion preferences, its own commit.

---

## Section 14, customer stories

| Finding | Ruling |
|---|---|
| Studio name on the photograph measures 3.76 / 4.15 / 6.08 : 1 (worst glyph pixel per card) | **Passes, ship as drawn.** At 26px the name is large text under WCAG, where the threshold is 3.0 rather than 4.5, so the worst card clears it. Darkening the veil to force 4.5 would visibly alter three photographs for no conformance gain. **Log the measurements** so the margin on the Occo card is on record. |
| Em dashes in two blurbs, which `docs/brand.md` bans | **Keep. Log for the client.** Client copy is not ours to edit; the brand rule is theirs to apply. |
| The section does not exist in the mobile artboard | **Approved as an addition**, built in the mobile language the committed sections already establish. Hiding three real customer stories below 1024px would have been the worse call. Log clearly as an addition, not a port. |
| Three inert declarations dropped (a `gap` with one child, an `overflow: hidden` with nothing overflowing, a radius on an element with no background) | **Correct**, principle 1. |
| Blurb and title inks kept on the desktop tones at both breakpoints | **Fine.** The mobile layout is our addition, so it has no artboard tones to match. Consistency with the desktop section is the better default. |

---

## Section 09, integrations

| Finding | Ruling |
|---|---|
| Three partner lettermarks fail AA on their own brand colours: QuickBooks 3.41, Google Drive 1.93, WhatsApp 1.98 | **Ship as drawn. No change, and no escalation needed.** WCAG 1.4.3 exempts "text that is part of a logo or brand name" from contrast requirements, and that is exactly what these are - a partner's initial set on that partner's brand colour, standing in for their mark. The discs are `aria-hidden`, the full partner name sits beside each one in passing ink, and nothing is conveyed by the letter alone. Recolouring them would mean altering three other companies' marks to fix a rule that does not apply to them. **Log the measurements** so the reasoning is on record. Worth noting the engineer was right that QuickBooks could not have been fixed by darkening anyway - nothing in the palette clears 4.5 on `#2CA01C`. |
| This section's eyebrow sits on `card-muted`, where the corrected tokens drop to 3.70 / 3.91 | **Real failure, fixed properly.** Added `--color-eyebrow-muted` `#596A16` (4.55) and `--color-eyebrow-muted-mobile` `#576A1E` (4.56). The engineer correctly refused to patch it with a local hex - that would have put a colour outside the system into a component. This is page-wide: **any corrected eyebrow placed on `card-muted` needs the muted pair.** |
| Partner names truncate below 430px - two at 360-390px, five at 320px | **Fix: let them wrap.** 390px and 360px are among the commonest real phone widths, so unlike section 04 this is not a hypothetical edge. Losing "Google Calendar" to an ellipsis on a phone is content loss. |
| Desktop tile shadow re-spelled inline because `.shadow-border-default` could not take a `desk:` variant | **Root cause fixed instead.** The four elevation recipes are now `@utility` rather than plain classes in `@layer components`, so they accept variants. The section can use `desk:shadow-border-default` and drop the second spelling. |
| Both sub-paragraphs shipped, gated by breakpoint, because the artboards write different copy | **Correct**, matching the §02 rulings 12-14 precedent. Client's to unify. |
| Gmail & Outlook's disc written as `forest-700` rather than a literal | **Right call.** `#2C5539` is Bramble's own forest, not a partner colour - neither Gmail nor Outlook is green. |

---

## Section 06, chapter 1

| # | Finding | Ruling |
|---|---|---|
| D1 | The scan sweep does not sweep. Desktop `tk-scan` ends at `translateY(104%)` on a `height:16%` element, so it travels 16.6% of the plan and never reaches either revealed annotation. Mobile writes `560%` for the same element | **Fix to 560%.** The sweep exists to read the plan as the measurements appear; one that covers a sixth of it and never reaches the annotations is not doing its job. Mobile proves the intent, so this is a desktop typo, and it is the same class as the marquee loop - a broken animation, principle 2. It moves the frozen visual diff for that band, so note it in the section's QA rather than treating the difference as a regression. |
| D5/D6 | Reduced motion is broken on both breakpoints: `.tk { opacity: 1 !important }` lands on the covers, the scan band and all five clock spans, so at rest both annotations stay hidden, a lime bar lies across the plan and five timestamps print on top of each other | **Fix, with the replacement blocks as specified**, pinned to `t = 11250ms` and `t = 7680ms`. Same as §05 ruling 3. This is a hard gate - it is both the accessible resting state and what the harness measures. |
| D3 | `.canvas-botanical` comes from the linked design-system sheet, not any artboard `<style>` block | **Not a defect - a porting trap, and we already avoided it.** It exists in `styles/base.css`. Flagged so QA does not file it. |
| — | On-photo masthead fails: `Laurence Landscapes` 2.83, `Q-1042 · Coogee` 3.14, `LIC# 284119C` 3.74 | **Fix**, moving the 24° gradient's last stop from 6% to 40%. The scrim exists precisely to make that masthead legible against the photograph; at 2.83:1 it is simply underpowered at its own job. This is not a design change, it is the design working. |
| — | `--color-eyebrow` measures 4.40 on the `canvas-botanical` column, because the wash multiplies at `opacity:.5` and drops the surface to `#F5F3ED` | **Use the `--color-eyebrow-muted` pair on any botanical panel.** No fourth token needed - the muted tone was computed against a darker surface and clears comfortably here. Generalise the rule: **an eyebrow takes the muted pair whenever it sits on `card-muted` or on a botanical wash.** |
| — | Four more flat-colour failures inside the product mockups: row sub-lines 3.29, slate-500 labels on `well` 4.28, type chips 4.30 | **Fix to ≥4.5, measured.** Prefer the existing `--color-slate-600` over minting new tokens, and only introduce one if the visual step is too large - measure and say which you chose. |
| — | The lime "Quote ready" bar measures 10.27:1 | **Passes. Leave it.** |
| — | The proposal card's five scope lines sum to $41,720 against a $48,200 "inc. GST" total, and mobile drops the Irrigation row entirely | **Ship as drawn. Log prominently for the client.** These are their numbers, not ours to reconcile - but on a quoting product, a proposal whose line items do not add up to its total is the one detail a landscaper would notice first. Worth them knowing. |
| — | `then and rewrites it` in the desktop body copy, where mobile's version of the same sentence is grammatical | **Ship as drawn. Log.** Client copy. |
| — | The ingest loop never clears: files 2-4 exit at 12.0/12.5/13.0s while file 1 has already restarted | **Assess and report.** If it can be closed without changing the resting composition - as the marquee fix was - close it. If closing it would move the static frame, leave it and log. |
| — | Eight dead `tk-pop*` / `tk-fill*` keyframes | **Drop.** |

### Unreset paragraph margins — check this in every section

The artboards never reset `<p>` margins, so **every paragraph in them carries the
browser's default `margin-bottom: 1em`** - 14px at 14px, 16px at 16px, 18px at
18px. Our Tailwind reset removes it, so any gap that the artboard got for free
comes out of our build and everything after it rides up.

It has now bitten twice:

- **Hero**: the CTA row's declared `margin-top: 44px` renders as 60px, because
  the paragraph above contributes 16. Fixed by shipping 60.
- **Chapter 1**: a uniform -18px through the take-off card, accumulating to -36px
  by the proposal card, from two 18px paragraphs.

**Every engineer must check for this**, and the geometry harness finds it
instantly: a constant vertical offset that *accumulates* down a section is
almost always this and nothing else.

Reproduce the **rendered** gap as a real value on our side, per principle 1. Do
not add a blanket `p { margin-bottom: 1em }` - the artboards' spacing is only
accidentally uniform, and a global rule would fix the places it happens to match
while silently breaking the places it does not.

### D4 reversed on measurement — the 1150px query is live

I ruled the artboard's `@media (max-width:1150px){.tk-grid{grid-template-columns:minmax(0,1fr)!important}}`
dead, following the spec's reasoning that the 1000px content cap already governs
that range. **The premise was wrong, and the engineer disproved it by measuring
the artboard rather than reasoning about it.**

The cap governs *width*; the query governs *tracks*. They are independent.
Measured on the artboard:

```
1024px   .tk-grid columns: 848px          panes STACKED
1149px   .tk-grid columns: 973px          panes STACKED
1151px   .tk-grid columns: 546px 429px    side by side
1280px   .tk-grid columns: 560px 440px    side by side
```

So across 1024-1150px - 127px of our own desktop range, starting at exactly the
width we switch layouts - the artboard draws the plan **above** the priced lines.
Shipping the grid flat put the card in the wrong composition at the switch width.

**Reproduced**, per principle 1. Implemented as `min-[1151px]:` on a
single-column base rather than `max-[1150px]:` on a two-column base, so the two
declarations sit in disjoint ranges and neither depends on Tailwind's variant
emission order - the same reasoning that produced `sm-only`.

**Bounded**: this is the only `max-width` query in the web artboard, so chapters
2 and 3 carry no version of this trap.

### The harness was serving a stale build

Found while fixing the above: `next start` serves whatever is in `.next`, so a
server left running from an earlier build serves stale output - and a
verification run against stale output is worse than none, because it reports a
pass. It reproduced an already-fixed 62-node drift exactly.

`scripts/lib/site-server.mjs` now compares `.next/BUILD_ID`'s mtime against the
newest file in the source tree, rebuilds when it is behind, and kills any server
that predates the rebuild. Every runner shares that helper, so the guard covers
the geometry harness, the comparison harness and the audit at once.

### Verifying a section whose artboard reduced-motion rule is broken

Chapter 2, chapter 1, the before/after phones and the marquee all have artboard
reduced-motion blocks that are wrong - chapter 2's opens **all six** accordions at
once, where the corrected resting state opens one. Our build is right and the
artboard is not, so `--motion reduce` compares two different compositions and
reports drift that is really the defect we fixed.

**Run those sections with `--motion none --freeze <t>`**, which pins both sides to
the same instant of the same animation. On chapter 2 that took the reported drift
from 51 to 5, and the 5 that remained were real.

The rule generalises: if a section's artboard reduced-motion block is on the
defect list, its geometry run needs motion enabled.

### The geometry harness measures leaf elements, and the artboard wraps text in spans

Chapter 2's three reported drifts turned out to be one thing, and it is worth
knowing before anyone chases a similar set.

`scripts/geometry.mjs` only measures elements with no element children. The
artboard puts a `<span>` inside its `<h1>` and inside its card `<h3>`s, so the
heading blocks are never measured - their inner spans are. Markup without an
equivalent child therefore gets compared *block box against inline box*, which
differs in both width (an inline box shrink-wraps to its widest line) and `y`
(an inline box is measured from the font's ascent, not the line box).

That explained a reported `w 769 -> 820` and `y 148 -> 152` where the build was
in fact correct: 820 was the right `max-width` and the artboard's 769 was its
span shrink-wrapping.

**It also surfaced a real fidelity finding.** The artboard's card titles carry
`.pf-h3`, which sets `font-variation-settings: "wght" 420, …`, and an inline
`font-weight: 600`. Variation settings beat `font-weight`, so those titles render
at **wght 420, not 600** - the declared 600 is inert, the same class as the dead
`.shadow-overlay` and the blur-destroyed `.pf-sticker`. Because the settings
inherit, a nested medallion that only overrides the family also renders at 420.
Building to the declared weight would have been visibly wrong.

**Practical rule:** when a heading reports a width or `y` drift and nothing else
around it moves, check whether the artboard wraps it in a span before changing
any value. Matching the artboard's own structure fixes the measurement and
usually inherits the type correctly at the same time.

### Mobile geometry drift is expected, and it is fully accounted for

After the line-height and shell-gutter corrections, every remaining drift on a
mobile geometry run decomposes into exactly two client decisions and their
consequences:

- `font Nunito -> Nunito Sans` - the body-face unification (desktop is
  authoritative).
- `font Nunito -> Hanken Grotesk` / `Fraunces -> Source Serif 4` - the product
  faces inside the depictions, on both breakpoints.
- Small `y` deltas that follow from those faces' differing vertical metrics, plus
  the documented `clamp()` on headings below the artboard's fixed 430px column.

None of it accumulates into a layout defect and none of it is a section's to fix.
**A mobile run reporting only these classes is a pass.** Anything else - an
accumulating offset, a missing node, a width that is not the fluid range - is
real and should be chased.

### Chapter 3 cannot be compared at 1024px

Its artboard is broken there: the unclosed `@media (min-width:1280px)` means the
whole `.pf-won` driver is missing below 1280, so the artboard's landed card is
stuck open at 99px with `animation-duration: 0s` and its toast sits at opacity 1.
Our build animates correctly, so the two compositions legitimately differ across
the entire 1024-1279 range. **Compare chapter 3 at 1280 and 1440 only.**

### `--freeze` also freezes the entrance reveals

`document.getAnimations()` returns every running animation, including the
`.reveal-*` entrances. Freezing at `t = 0` therefore pins those at their first
keyframe - `translateY(8px)` for `up-blur`, `scale(.95)` for `scale` - and the
section reads as uniformly displaced or slightly small.

It cost one false hero regression (the CTA row reporting 8px low) and one false
board measurement (992px reading as 942.4px). **Freeze only where the section has
a looping system to pin, and use a `t` inside that loop rather than 0.** For a
section whose only motion is the entrance, run without `--freeze` at all.
