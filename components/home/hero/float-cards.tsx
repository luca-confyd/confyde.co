import Image from "next/image";

import { QUOTE, READING, SCOPE } from "@/content/home";

/* -----------------------------------------------------------------------------
   Figures.

   Everything numeric on these cards is the same job the rest of the page tells:
   one quote, one client, one set of section read-times. The artboard types each
   figure at its call site; content/home.ts exists so they cannot drift, and this
   file reads from it rather than retyping.
----------------------------------------------------------------------------- */

type ScopeLabel = (typeof SCOPE)[number]["label"];

/**
 * The cards show three of the five scope lines, in their own order, so they are
 * picked by label rather than by index. A miss throws during the prerender,
 * which is the loudest place for a content rename to surface.
 */
function scopeLine(label: ScopeLabel) {
  const line = SCOPE.find((item) => item.label === label);
  if (!line) throw new Error(`Hero float cards: no scope line named "${label}"`);
  return line;
}

const PAVING = scopeLine("Paving & Stonework");
const RETAINING = scopeLine("Retaining & Structures");
const PLANTING = scopeLine("Turf, Soil & Planting");

/** Card 3 abbreviates the quote total. Derived, so the two cannot disagree. */
const TOTAL_ABBREVIATED = `$${(Number(QUOTE.total.replace(/[^\d.]/g, "")) / 1000).toFixed(1)}k`;

/** "Call Sarah today" - the card is on first-name terms with the client. */
const CLIENT_FIRST_NAME = QUOTE.client.split(" ")[0];

/* -----------------------------------------------------------------------------
   Shared card type.

   The cards are recreations of the real app's UI rather than marketing chrome,
   so they are set in the product faces - Hanken Grotesk and Source Serif 4 -
   not in Nunito Sans and Fraunces (RULINGS.md §02 ruling 7). The artboard writes
   these as var(--font-sans) / var(--font-serif), which resolve through its own
   linked token file to exactly those two.
----------------------------------------------------------------------------- */

const CARD_EYEBROW =
  "font-ui text-[11.5px] font-semibold tracking-[0.1em] text-slate-500 uppercase";

/** grid-area: 1/1 - all four cards occupy one square and take turns in it. */
const CARD = "float-card col-start-1 row-start-1 w-72 self-end rounded-xl bg-card";

/* A 24deg gradient, not the hero scrim's vertical one: the card's photo is
   lit from its bottom-right corner and the header text sits top-left. */
const CARD_PHOTO_SCRIM =
  "absolute inset-0 bg-[linear-gradient(24deg,color-mix(in_oklab,var(--color-forest-900)_90%,transparent)_4%,color-mix(in_oklab,var(--color-forest-900)_42%,transparent)_52%,color-mix(in_oklab,var(--color-forest-900)_6%,transparent))]";

/* -----------------------------------------------------------------------------
   Card 0 - Estimate drafted
----------------------------------------------------------------------------- */

const ESTIMATE_ROWS = [PAVING, RETAINING, PLANTING];

function EstimateDraftedCard() {
  return (
    <div data-fc="0" className={`${CARD} px-[18px] py-4`}>
      <div className={CARD_EYEBROW}>Estimate drafted</div>
      <div className="mt-2 font-ui-serif text-[26px] leading-none font-semibold text-ink">
        {QUOTE.total}
      </div>

      <ul className="mt-2.5 list-none p-0">
        {ESTIMATE_ROWS.map((row, index) => (
          <li
            key={row.label}
            className={`flex items-baseline gap-3 py-1.5 ${index > 0 ? "border-t border-slate-100" : ""}`}
          >
            <span className="min-w-0 flex-1 font-ui text-[12.5px] text-slate-700">{row.label}</span>
            <span className="flex-none font-ui-serif text-[12.5px] font-semibold tabular-nums text-ink">
              {row.amount}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-2.5 flex items-center gap-2">
        {/* The artboard draws a 6px box at border-radius:12px, which already
            clamps to a circle. rounded-full is the same pixels and says so
            (RULINGS.md §02 ruling 6). */}
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-lime-500 shadow-[0_8px_20px_-10px_rgb(21_48_31/0.4)]"
        />
        <span className="font-ui text-[12px] text-slate-500">{"Ready to send · 14 minutes"}</span>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Card 1 - Proposal built
----------------------------------------------------------------------------- */

function ProposalBuiltCard() {
  return (
    <div data-fc="1" className={`${CARD} overflow-hidden`}>
      {/* The proposal's cover. Padding lives on this block rather than on the
          card, so the photograph can run to all four edges behind it. */}
      <div className="relative overflow-hidden bg-forest-900 px-4 pt-3 pb-3.5">
        <Image
          src="/images/photo-1.webp"
          alt=""
          fill
          /* 288px is the card's layout width; the group's scale() shrinks the
              painted result, never the box the browser lays out. */
          sizes="288px"
          className="object-cover"
        />
        <span aria-hidden="true" className={CARD_PHOTO_SCRIM} />

        <div className="relative">
          <div className="flex items-center justify-between gap-2.5 border-b border-white/22 pb-[9px]">
            <span className="font-ui-serif text-[11.5px] leading-none font-semibold tracking-[0.16em] whitespace-nowrap text-white uppercase">
              {QUOTE.studio}
            </span>
            <span className="font-ui text-[11.5px] leading-[1.5] text-cream [text-shadow:0_1px_3px_rgb(0_0_0/0.55)]">
              {QUOTE.licence}
            </span>
          </div>

          <div className="pt-[11px]">
            <div className="font-ui text-[11.5px] tracking-[0.16em] text-cream uppercase [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
              {`${QUOTE.reference} · ${QUOTE.suburb}`}
            </div>
            <div className="mt-1 font-ui-serif text-[22px] leading-[0.98] font-semibold tracking-[-0.01em] text-white [text-shadow:0_2px_18px_rgb(0_0_0/0.45)]">
              {QUOTE.address}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-3.5">
        <div className={CARD_EYEBROW}>Proposal built</div>
        <div className="mt-[7px] font-ui text-[12.5px] leading-[1.45] text-slate-700">
          Branded cover, scope of works and inclusions, straight off the estimate.
        </div>
        <div className="mt-[11px] flex items-baseline justify-between gap-2.5">
          <span className="font-ui text-[12px] text-slate-500">Total inc. GST</span>
          <span className="font-ui-serif text-[19px] font-semibold tabular-nums text-ink">
            {QUOTE.total}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Card 2 - How they read it
----------------------------------------------------------------------------- */

/** The proposal thumbnail's seven text bars, top to bottom. */
const THUMBNAIL_BARS = [
  { width: "w-[58%]", tone: "bg-slate-100" },
  { width: "w-[86%]", tone: "bg-cat-retaining" },
  { width: "w-[72%]", tone: "bg-cat-retaining" },
  { width: "w-[90%]", tone: "bg-cat-paving" },
  { width: "w-[64%]", tone: "bg-cat-paving" },
  { width: "w-[80%]", tone: "bg-cat-planting" },
  { width: "w-[44%]", tone: "bg-slate-100" },
];

/** Where her attention pooled on the page, as blurred multiply blobs. */
const HEAT_BLOBS = [
  { top: "top-[26%]", height: "h-[9%]", tone: "bg-forest-300", opacity: "opacity-25" },
  { top: "top-[40%]", height: "h-[11%]", tone: "bg-forest-500", opacity: "opacity-55" },
  { top: "top-[54%]", height: "h-[13%]", tone: "bg-forest-900", opacity: "opacity-80" },
  { top: "top-[76%]", height: "h-[16%]", tone: "bg-forest-900", opacity: "opacity-80" },
];

/*
 * Every dot on this card is a scope category from the app's own taxonomy except
 * this one - "Totals & acceptance" is not a scope line, so it has no category
 * colour. #ACAFB1 is the artboard's one-off cool grey and the only cool pixel in
 * the hero. It stays a local literal rather than becoming a token, because it
 * has no role in the system to name (RULINGS.md §02 ruling 5).
 */
const TOTALS_DOT = "bg-[#ACAFB1]";

const ATTENTION_ROWS = [
  {
    dot: "bg-cat-paving",
    label: PAVING.label,
    time: READING.longestTime,
    fill: "w-full",
    fillTone: "bg-forest-900",
  },
  {
    dot: TOTALS_DOT,
    label: "Totals & acceptance",
    time: "1m 12s",
    fill: "w-[45%]",
    fillTone: "bg-forest-900",
  },
  {
    dot: "bg-cat-retaining",
    label: RETAINING.label,
    time: "48s",
    fill: "w-[30%]",
    fillTone: "bg-forest-500",
  },
  {
    dot: "bg-cat-planting",
    label: PLANTING.label,
    time: "22s",
    fill: "w-[14%]",
    fillTone: "bg-forest-300",
  },
];

function HowTheyReadItCard() {
  return (
    <div data-fc="2" className={`${CARD} px-[18px] py-4`}>
      <div className={CARD_EYEBROW}>How they read it</div>
      <div className="mt-2 font-ui-serif text-[19px] leading-[1.15] font-semibold text-ink">
        {QUOTE.address}
      </div>
      <div className="mt-0.5 font-ui text-[12px] text-slate-500">
        {`Opened ${READING.opens} times, mostly after 8 pm.`}
      </div>

      <div className="mt-3 flex items-start gap-3">
        {/* The proposal, at 84px: a photo strip, seven bars standing in for its
            copy, and the heatmap laid over both. */}
        <div className="relative w-21 flex-none overflow-hidden rounded-md bg-card shadow-[0_0_0_1px_var(--color-hairline)]">
          <div className="relative h-[26px] overflow-hidden bg-forest-900">
            <Image
              src="/images/photo-1.webp"
              alt=""
              fill
              sizes="84px"
              className="object-cover opacity-85"
            />
          </div>

          <div className="flex flex-col gap-[5px] px-[7px] pt-[7px] pb-[9px]">
            {THUMBNAIL_BARS.map((bar, index) => (
              <span
                key={index}
                className={`block h-1 rounded-full ${bar.width} ${bar.tone}`}
              />
            ))}
          </div>

          {HEAT_BLOBS.map((blob, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`absolute right-[3px] left-[3px] rounded-sm blur-[3px] mix-blend-multiply ${blob.top} ${blob.height} ${blob.tone} ${blob.opacity}`}
            />
          ))}
        </div>

        <ul className="w-full list-none p-0">
          {ATTENTION_ROWS.map((row) => (
            <li key={row.label} className="py-1">
              <div className="flex items-center gap-[7px]">
                <span aria-hidden="true" className={`h-2 w-2 flex-none rounded-full ${row.dot}`} />
                <span className="min-w-0 flex-1 truncate font-ui text-[11.5px] text-slate-700">
                  {row.label}
                </span>
                <span className="flex-none font-ui text-[11.5px] tabular-nums text-slate-500">
                  {row.time}
                </span>
              </div>
              {/* 15px of left margin lines the track up with the label, not the
                  dot. */}
              <span className="mt-1 ml-[15px] block h-1 rounded-full bg-card-muted">
                <span className={`block h-full rounded-full ${row.fill} ${row.fillTone}`} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[11px] font-ui text-[12px] leading-[1.4] text-slate-500">
        She keeps going back to the paving.
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Card 3 - Your next move
----------------------------------------------------------------------------- */

function YourNextMoveCard() {
  return (
    <div data-fc="3" className={`${CARD} px-[18px] py-4`}>
      <div className={CARD_EYEBROW}>Your next move</div>
      <div className="mt-2 font-ui-serif text-[19px] leading-[1.15] font-semibold text-ink">
        {`Call ${CLIENT_FIRST_NAME} today`}
      </div>
      <div className="mt-1.5 font-ui text-[12.5px] leading-[1.45] text-slate-700">
        {"She’s read the paving section three times and hasn’t replied in six days."}
      </div>
      <div className="mt-3 flex items-baseline gap-2.5">
        <span className="font-ui-serif text-[26px] leading-none font-semibold text-ink">
          {TOTAL_ABBREVIATED}
        </span>
        <span className="font-ui text-[12px] text-slate-500">still on the table</span>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   The stack
----------------------------------------------------------------------------- */

/*
 * The group hangs off the top-left corner of the stat strip: `bottom` is
 * measured from the strip's own top edge, and `origin-bottom-left` means the
 * scale shrinks toward that same corner, so the left edge and the gap above the
 * strip hold at every step.
 *
 * On short viewports it steps down and then out of the way entirely, because the
 * stat strip and the CTAs win the space. See the hero-h* variants in globals.css.
 *
 * The artboard's .pf-float-group and .pf-float-stack carry no rule our utilities
 * do not, so neither class name survives the port; only .float-card does,
 * because the keyframe system in styles/motion/hero.css keys off it.
 */
const GROUP =
  "absolute bottom-[calc(100%+24px)] left-0 flex w-72 max-w-[calc(100vw-56px)] origin-bottom-left scale-[0.78] flex-col gap-3 hero-h900:bottom-[calc(100%+18px)] hero-h900:scale-[0.66] hero-h760:bottom-[calc(100%+12px)] hero-h760:scale-[0.55] hero-h620:hidden";

/**
 * The four cards that flip through above the stat strip.
 *
 * The whole stack is `aria-hidden` and every photograph in it is `alt=""`:
 * every figure the cards show is decorative repetition of content that appears
 * in full further down the page, and a screen reader announcing four cards that
 * cross-fade on a timer would be noise.
 *
 * `perspective` on the stack, not on the cards, is what makes the keyframe's
 * rotateY read as a card turning in space rather than squashing horizontally.
 */
export function FloatCards() {
  return (
    <div className={GROUP}>
      <div aria-hidden="true" className="grid [perspective:1100px]">
        <EstimateDraftedCard />
        <ProposalBuiltCard />
        <HowTheyReadItCard />
        <YourNextMoveCard />
      </div>
    </div>
  );
}
