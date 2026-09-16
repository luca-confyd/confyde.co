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
  "before-after": {
    title: "Before / after",
    site: null,
    // The only web section whose panel is a forest-900 div wrapping a centred
    // header block and a two-column grid; `.pf-oneline` pins it to this one
    // headline, which no other band carries.
    web: "#dc-root section:has(h2.pf-oneline)",
    // The mobile board's only section containing a phone frame - the 34px
    // radius plus the #10160F body is unique to these two devices.
    mobile: "#dc-root section:has(div[style*='#10160F'])",
    // Two compositions shipped as siblings; the harness picks whichever one is
    // laid out at the width being shot.
    siteWeb: "[data-section='before-after-desktop']",
    siteMobile: "[data-section='before-after-mobile']",
  },
  "chapter-1": {
    title: "Chapter 1 - meet Bramble",
    site: null,
    // #pf-prices is the price-library card's inner wrapper and appears exactly
    // once in the web artboard, so it pins this section and nothing else.
    web: "#dc-root section:has(#pf-prices)",
    // The take-off plan is the only image of its kind in the mobile artboard.
    mobile: "#dc-root section:has(img[src*='takeoff-plan'])",
    siteWeb: "[data-section='chapter-1-desktop']",
    siteMobile: "[data-section='chapter-1-mobile']",
  },
  "chapter-2": {
    title: "Chapter 2 - sales assistant",
    site: null,
    // #pf-radar is the two-card row's own id and the web artboard's only
    // occurrence, so it pins this section and nothing else.
    web: "#dc-root section:has(#pf-radar)",
    // The mini replay's document track is the mobile artboard's only
    // .m-doc-track; the eyebrow/heading pairs alone match four sections.
    mobile: "#dc-root section:has(.m-doc-track)",
    siteWeb: "[data-section='chapter-2-desktop']",
    siteMobile: "[data-section='chapter-2-mobile']",
  },
  integrations: {
    title: "Integrations",
    site: null,
    web: "#pf-qb",
    // The Xero mark is the only image in the mobile band and appears nowhere
    // else on that page; the eyebrow + h2 pair alone matches four sections.
    mobile: "#dc-root section:has(img[src*='xero-mark'])",
    siteWeb: "[data-section='integrations']",
    siteMobile: "[data-section='integrations']",
  },
  "customer-stories": {
    title: "Customer stories",
    site: null,
    web: "#pf-stories",
    // Not drawn in the mobile artboard at all - our below-1024 layout is an
    // addition, so there is no mobile side to diff against.
    mobile: null,
    siteWeb: "[data-section='customer-stories']",
    siteMobile: "[data-section='customer-stories']",
  },
  "cta-stage": {
    title: "CTA stage (pinned)",
    site: null,
    web: "#pf-cta-stage",
    // Not drawn in the mobile artboard - the below-1024 band is an addition, so
    // there is no mobile side to diff against.
    mobile: null,
    siteWeb: "[data-section='cta-stage']",
    siteMobile: "[data-section='cta-band-mobile']",
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
