# Bramble homepage

The Bramble marketing homepage, rebuilt from the Claude Design artboards in
`design-source/` as a statically prerendered Next.js site.

```bash
npm run dev            # http://localhost:3000
npm run build          # production build; every route prerenders
npm run compare page   # visual diff of the build against the original artboards
```

## Layout

| Path | What's in it |
|---|---|
| `app/` | Route, root layout, tokens (`globals.css`) |
| `components/chrome/` | Nav, floating bars, footer, the shared inline CTA |
| `components/home/` | One directory per page section |
| `components/primitives/` | Shared building blocks (Reveal, CountUp, Phone, ...) |
| `styles/base.css` | Type scale, elevation recipes, texture washes |
| `styles/motion/` | One file per animation system, each ending in its reduced-motion resting state |
| `content/` | All copy and the figures the page repeats |
| `lib/` | The hooks that drive scroll-linked behaviour |
| `docs/brand.md` | The brand rules this site is reviewed against |
| `docs/specs/` | Per-section build specs taken off the artboards |
| `scripts/` | Asset optimisation and the visual-comparison harness |

## Design source

`design-source/` holds the original 74 MB export and is gitignored - it is an
input, not a build artefact. The 12 images the page actually uses are committed
under `public/images/`, re-encoded from the originals by
`npm run optimize-assets` (23.3 MB of PNG down to 2.3 MB of WebP before
`next/image` does anything).

Nothing from the export ships as JavaScript. Its canvas runtime (`support.js`,
69 KB, which pulls React and Babel off a CDN at page load) and its compiled
component bundle (161 KB) are both discarded; the only real logic in the export
is two small classes of plain DOM code, rewritten as hooks in `lib/`.

## Responsive strategy

The artboards cover two widths and nothing between them: the desktop board has no
layout breakpoint below 1150px, and the mobile board is a fixed 430px column with
no media queries at all. So there is one switch, at **1024px** (`desk:` in
Tailwind). Below it the mobile artboard's layouts run and widen fluidly; at and
above it the desktop artboard's layouts take over.
