# Bramble brand rules

Distilled from the design system shipped in the Claude Design export
(`_ds/bramble-design-system-<id>/readme.md`, 26 KB). These are the rules a
reviewer should check this site against. Tokens live in `app/globals.css`.

## Colour

**Decision rule:** default to forest. Forward motion is lime. Form focus is sage.
Warning is rust. Selected or completed is forest, never lime.

- **Forest** is the primary: dark panels, link and action text, the primary
  button, selected and completed states.
- **Lime** is the single accent and it means *forward motion*. Four roles only:
  one primary action per page, live happening-now markers, AI/Bramble surfaces,
  and the you-are-here marker. Nothing else. No lime selected states, role
  badges, decorative borders, completed checks or focus rings.
- **Sage** is form-field focus only. Never a fill, never a CTA.
- **Rust** is the one warning/destructive tone. **Umber** is a data tone only.
- **Cream** is the on-forest text tone, never a fill.

Retired, do not revive: butternut, plum, stone. No default Tailwind palette
colours (gray, zinc, slate-600, emerald, indigo).

> Naming note: the web artboard labels the bright chip `--pf-lime` and the dark
> olive `--pf-lime-500`, inverting the system's own scale. This codebase follows
> the system: `lime-500` is bright, `lime-700` is the dark olive used for
> uppercase eyebrows.

## Surfaces

> White = a thing you read or act on. Beige = the space between things.

`card` white sits on `canvas` beige. `well` is the recessed tone *inside* a white
card. `card-muted` is the one tile tone that sits *below* the canvas - reach for
it when something should recede, not separate.

**Cards carry no border and no shadow.** The beige/white value step is the whole
elevation story. Overlays are the exception: modals, dropdowns, toasts and
floating bars sit *above* the page, so they keep a warm-taupe hairline plus a
shadow. Never stack white on white; anything nested inside a card steps down to a
well.

## Radius

**4 / 6 / 8 / 12.** Less rounded, but never straight. 4 checkbox; 6 inputs,
badges, panels, inline rows; 8 buttons and menus; 12 cards, modals, upload zones.
Nested elements step down one notch. **16px+ radii are banned.**

## Type

Two systems are live on this page at once, and both are intentional:

- **Marketing layer** - Fraunces (display) + Nunito Sans (body).
- **Product mockups embedded in the page** - Hanken Grotesk + Source Serif 4,
  because those panels are recreations of the real app UI.
- **Asap 800 is the wordmark only.** The one sanctioned family/weight exception,
  because it is the logo, not type.

One serif element per band. The serif never states a status. A heading is a
heading through family, weight and size, **not colour** - titles and body share
the same ink. No italics in either family. Tabular numerals only in a column of
money.

## Motion

Restrained, entrance-only, and reserved for the brand fills.

- **Press is colour only.** Nothing scales or shifts.
- **Hover** lifts a well to white, or tints a greige surface. A clickable white
  card must not move and must not gain a shadow.
- **Closing unmounts instantly** - a slow exit reads as lag.
- Transitions are 150ms for colour, 200ms for a layout beat.
- **Everything is disabled under `prefers-reduced-motion`.** Every file in
  `styles/motion/` ends with that block, and it doubles as the resting state the
  visual-comparison harness screenshots against.

## Copy

- Headings Title Case, body sentence case.
- "You / your", not "users" or "accounts".
- **No em dashes. No exclamation marks** (except one at a milestone). **No emoji**
  - not in CTAs, not in UI, not part of the brand.
- No "Oops", no "Something went wrong".
- No sales hype: leverage, unlock, supercharge, game-changer, seamless,
  streamline, platform, workflow, insights.
- Use the user's vocabulary: margins, callouts, take-off, scope creep, subbies,
  variations.
- Personality lives in the chatbot. Marketing microcopy stays functional.

## Iconography

Lucide is the only icon system. No second set, no icon font, no PNG icons, no
emoji or unicode standing in for glyphs. Icons are `currentColor` so a glyph
cannot drift from its label. Leading icon only in a button, max one; the trailing
slot is for a chevron or an external-link affordance. An icon-only button carries
an `aria-label`.

The arrow character `→` in running copy and `▲ ▼` in a stat delta are the only
non-icon glyphs, and they are type, not iconography.
