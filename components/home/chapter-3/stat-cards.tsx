import { Reveal } from "@/components/primitives/reveal";
import { STAT_CARDS } from "@/content/playbook";

/**
 * The three stat cards that sit above - and partly behind - the browser card.
 *
 * [LOG] THESE CARDS DO NOT RENDER TILTED, AND THAT IS THE ARTBOARD, NOT US.
 * The artboard writes `transform: rotate(-5deg)`, `translateX(-50%)` and
 * `rotate(5deg)` inline on these three divs and `docs/specs/10-chapter-3.md`
 * §2.4 records them - but the same elements carry the reveal entrance
 * (`data-anim="pop"`), whose keyframes animate `transform` with
 * `animation-fill-mode: both`. CSS animations outrank inline declarations, so
 * from the moment the cards enter the viewport all three are pinned to the
 * animation's final `translateY(0) scale(1)`: upright, and card 2's centring
 * offset gone with them. Measured in Chromium on the artboard at 1440px and
 * 1100px - all three compute `matrix(1, 0, 0, 1, 0, 0)`. Under
 * `prefers-reduced-motion` the reveal system pins `transform: none`, so there
 * is no width and no motion preference in which the artboard draws a tilt.
 * Worth the client's eye, because the intent is legible in the source and the
 * fix is one wrapper element: put the reveal on a parent and the rotation on
 * the card.
 *
 * THE DECLARATIONS STAY ANYWAY. They are written here exactly as the artboard
 * writes them, on the same elements, so the override happens identically on
 * both sides at every moment: while the entrance runs, after it, under reduced
 * motion, and in the idle frame before the reveal fires - which is the frame
 * the geometry harness measures, and where dropping them moved five elements by
 * up to 83px. They change no visible pixel; they only stop our build and the
 * artboard disagreeing about a frame neither of them paints.
 *
 * `.analytics-card` exists for one reason: under `prefers-reduced-motion` our
 * reveal hook removes the idle class and adds no animation class at all, so
 * nothing would override the inline transform and the cards would rest tilted -
 * where the artboard, whose own reduced-motion rule lands on the animation
 * class it always adds, rests upright. The resting block in
 * styles/motion/chapter-3.css pins them.
 *
 * The stack's rest-and-lift transform lives on the parent
 * (`.analytics-cards`, in styles/motion/chapter-3.css) and is unaffected by any
 * of this.
 */

/* The sparkline's gradient needs a document-unique id. The artboard's is
   `pfSpk`, a bare global that a second sparkline anywhere on the page would
   collide with (D28). `useId()` is the usual answer but it is a hook, and this
   is a Server Component; the stack renders exactly once, so a namespaced
   literal does the same job with no client boundary. */
const SPARK_GRADIENT_ID = "pb-spark-gradient";

export function StatCards() {
  return (
    <div className="analytics-cards absolute inset-x-0 top-0 z-[1] flex h-40 justify-center">
      {/* Card 1 - win rate, with a sparkline. */}
      <Reveal
        anim="pop"
        delay={0}
        duration={0.5}
        className="analytics-card shadow-border-strong absolute top-[26%] left-[17%] flex w-[174px] flex-col gap-[7px] rounded-xl bg-card px-[14px] py-[13px]"
        /* `transform`, not Tailwind's `rotate-*`: v4 emits the independent
           `rotate` property, which the reveal's transform keyframes would not
           override - the card would then stay tilted where the artboard does
           not. See the note above. */
        style={{ transform: "rotate(-5deg)" }}
      >
        <span className="font-ui text-[10.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">
          {STAT_CARDS.winRate.label}
        </span>
        {/* The wrapper's `gap` is inert with one child and is dropped, but its
            `display: flex` is not - it is what shrinks the figure's box to its
            text rather than letting it run the card's width. */}
        <span className="flex items-baseline">
          <span className="font-ui-serif text-[26px] leading-none font-semibold text-ink tabular-nums">
            {STAT_CARDS.winRate.figure}
          </span>
        </span>
        <svg viewBox="0 0 120 34" aria-hidden="true" className="block h-[30px] w-full">
          <defs>
            <linearGradient id={SPARK_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4D8F6C" stopOpacity=".3" />
              <stop offset="100%" stopColor="#4D8F6C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M2 28 L22 24 L42 26 L62 17 L82 19 L102 8 L118 4 L118 34 L2 34 Z"
            fill={`url(#${SPARK_GRADIENT_ID})`}
          />
          <path
            d="M2 28 L22 24 L42 26 L62 17 L82 19 L102 8 L118 4"
            fill="none"
            stroke="#2C5539"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Reveal>

      {/* Card 2 - quotes sent, with the seven-bar set. */}
      <Reveal
        anim="pop"
        delay={0.12}
        duration={0.5}
        className="analytics-card shadow-border-strong absolute top-[6%] left-[50%] flex w-[174px] flex-col gap-[7px] rounded-xl bg-card px-[14px] py-[13px]"
        /* The artboard's `rotate(0deg)` is genuinely inert and is dropped; the
           centring offset is not. */
        style={{ transform: "translateX(-50%)" }}
      >
        <span className="font-ui text-[10.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">
          {STAT_CARDS.quotesSent.label}
        </span>
        <span className="flex items-baseline gap-2">
          <span className="font-ui-serif text-[26px] leading-none font-semibold text-ink tabular-nums">
            {STAT_CARDS.quotesSent.figure}
          </span>
          {/* `▲` is type, not iconography - docs/brand.md sanctions it for a
              stat delta and for nothing else. */}
          <span className="inline-flex items-center gap-1 rounded-md bg-lime-100 px-[7px] py-0.5 font-ui text-[11px] font-bold whitespace-nowrap text-forest-800">
            {STAT_CARDS.quotesSent.delta}
          </span>
        </span>
        {/* Bar 6 is the one lime bar - the you-are-here marker, one of lime's
            four sanctioned roles. Note it is not the tallest-is-last shape:
            bar 7 comes back down to 74%. */}
        <span aria-hidden="true" className="flex h-[30px] items-end gap-1">
          {["38%", "52%", "44%", "66%", "58%", "82%", "74%"].map((height, i) => (
            <span
              key={height + i}
              className="flex-1 rounded-[2px]"
              style={{
                height,
                background:
                  i === 5
                    ? "var(--color-lime-500)"
                    : "color-mix(in oklab, #4D8F6C 32%, transparent)",
              }}
            />
          ))}
        </span>
      </Reveal>

      {/* Card 3 - margin, with the donut. */}
      <Reveal
        anim="pop"
        delay={0.24}
        duration={0.5}
        className="analytics-card shadow-border-strong absolute top-[24%] right-[16%] flex w-[174px] items-center gap-3 rounded-xl bg-card px-[14px] py-[13px]"
        style={{ transform: "rotate(5deg)" }}
      >
        {/* 2π × 26 = 163.36, so 50.6 / 163.36 = 30.98% - the dash array encodes
            the 31% beside it. The gap term exceeds the remainder, which is what
            stops a second dash appearing; it has to stay larger. */}
        <svg viewBox="0 0 64 64" aria-hidden="true" className="block h-[52px] w-[52px]">
          <g transform="rotate(-90 32 32)" fill="none" strokeWidth="9" strokeLinecap="round">
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="color-mix(in oklab, #4D8F6C 22%, transparent)"
            />
            <circle cx="32" cy="32" r="26" stroke="#2C5539" strokeDasharray="50.6 163.4" />
          </g>
        </svg>
        <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="font-ui text-[10.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">
            {STAT_CARDS.margin.label}
          </span>
          <span className="font-ui-serif text-[26px] leading-none font-semibold text-ink tabular-nums">
            {STAT_CARDS.margin.figure}
          </span>
          <span className="font-ui text-[11px] text-slate-500">{STAT_CARDS.margin.sub}</span>
        </span>
      </Reveal>
    </div>
  );
}
