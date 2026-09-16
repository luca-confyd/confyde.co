/**
 * The comparison manifest.
 *
 * One entry per build section. `site` is the selector in our port; `web` and
 * `mobile` are the matching selectors in the two artboards. A null selector
 * means "shoot the whole page".
 *
 * Widths: 1280 is the width the desktop artboard was authored at and is the
 * only one it claims to be correct at. 1440 and 1024 verify the fluid behaviour
 * we are adding on top. 768 and 390 compare against the mobile artboard, which
 * is a fixed 430px column with no media queries of its own.
 */
export const DESKTOP_WIDTHS = [1440, 1280, 1024];
export const MOBILE_WIDTHS = [768, 390];

export const SECTIONS = {
  hero: {
    title: "Hero",
    site: null,
    web: "#pf-hero-panel",
    mobile: "#dc-root section:has(> div > img[src*='hero-mobile'])",
    // Our build ships the two heroes as siblings; the harness picks whichever
    // one is laid out at the width being shot.
    siteWeb: "[data-section='hero-desktop']",
    siteMobile: "[data-section='hero-mobile']",
  },
  marquee: {
    title: "Logo marquee",
    site: null,
    // The artboard puts `pf-marquee` on both the band and the inner clipper;
    // only the band is a <section>.
    web: "#dc-root section.pf-marquee",
    // `.m-scroll` alone also matches the testimonial carousel further down the
    // page, so the track class is what pins this to the marquee.
    mobile: "#dc-root section:has(> .m-scroll > .m-mq-track)",
    // Two compositions shipped as siblings, like the hero: the harness picks
    // whichever one is laid out at the width being shot.
    siteWeb: "[data-section='marquee-desktop']",
    siteMobile: "[data-section='marquee-mobile']",
  },
  "social-proof": {
    title: "Social proof",
    site: null,
    // The only web section whose heading block - eyebrow span then h2 - is a
    // direct grandchild; the other pf-h2 bands nest theirs a level deeper.
    web: "#dc-root section:has(> div > span + h2.pf-h2)",
    // The eyebrow-then-heading pair also opens the "What you get back" band;
    // the photo grid is what distinguishes this one.
    mobile: "#dc-root section:has(> .m-eyebrow + h2.m-h2 + div img)",
    // One composition at both scales, so both sides point at the same root.
    siteWeb: "[data-section='social-proof']",
    siteMobile: "[data-section='social-proof']",
  },
  page: {
    title: "Whole page",
    site: null,
    web: null,
    mobile: null,
    fullPage: true,
  },
};

export const ARTBOARDS = {
  web: "/Bramble%20Home%20Web.dc.html",
  mobile: "/Bramble%20Home%20Mobile.dc.html",
};

/** The artboards render into #dc-root once support.js has booted React. */
export const ARTBOARD_READY = "#dc-root";
