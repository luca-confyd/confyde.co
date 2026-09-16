import Image from "next/image";
import { Check, Grab, User } from "lucide-react";

import {
  DRAFT_CARDS,
  LANES,
  NEGOTIATING_CARDS,
  SENT_CARDS,
  SETTLED_JOB,
  TOAST_MESSAGE,
  VIEW_QUOTE,
  WON_JOB,
  type BoardCard,
} from "@/content/playbook";

/**
 * The kanban board, and the 14-second won-job flight layered over it.
 *
 * THE FOUR LANE TONES are un-tokened one-offs and the ramp is deliberate:
 * #EFECDF -> #E6E0CC -> #DDD9C0 -> #D2D5C0, progressively deeper and cooler
 * left to right. They ship as commented local constants per RULINGS §02
 * ruling 5. The second one happens to equal `--color-card-muted`, and it takes
 * the token; the other three stay literal so the ramp reads as one set rather
 * than as three arbitrary hexes and a token.
 *
 * CONTRAST. Every lane count and the Closed blurb are `slate-400` in the
 * artboard, which measures 2.19-2.77:1 across the four tones - four separate AA
 * failures. They take `--color-slate-600`, an existing token, which clears on
 * all four (5.43-6.87, measured on composited pixels). The two well-surface
 * strings in the Closed lane take the same token for the same reason;
 * `slate-500` measures 4.40 there even after its own correction, which is the
 * failure RULINGS §06 ruled on and chapter 1 answered the same way.
 *
 * NOTHING HERE IS INTERACTIVE. `View quote →` and `See all closed →` are text:
 * a depiction of a control inside a depiction of an app. Rendering them as
 * links or buttons would add six inert tab stops to a region that is
 * `role="img"` and announces none of them. `→` is type, per docs/brand.md.
 */

/* The lane ramp. Only #E6E0CC exists in the system, as `card-muted`. */
const LANE_DRAFT = "#EFECDF";
const LANE_SENT = "var(--color-card-muted)";
const LANE_NEGOTIATING = "#DDD9C0";
const LANE_CLOSED = "#D2D5C0";

function LaneDot({ background, className }: { background: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`h-2 w-2 flex-none rounded-full ${className ?? ""}`}
      style={{ background }}
    />
  );
}

/**
 * The lane name. A `<span>`, not the artboard's `<h3>`: the whole stage is one
 * `role="img"`, so a heading here is announced to nobody and would sit in the
 * document outline between the panel's sub-head and the leaderboard's. Type
 * size and heading level are independent (RULINGS §03/04 ruling 8).
 *
 * THE VARIATION SETTINGS ARE NOT DECORATION. The artboard styles bare `h1`-`h3`
 * with the display face's axes, and `font-variation-settings` inherits and
 * outranks `font-weight`, so these four labels render in Hanken Grotesk at
 * `wght 420` despite their own `font-weight: 600` - visibly lighter than
 * semibold. Only `wght` is a real Hanken axis; `SOFT`, `WONK` and `opsz` are
 * Fraunces axes that the rule leaks onto a sans element and the face ignores.
 * Carried verbatim because it is the rendered result (principle 1), and because
 * dropping the `<h3>` is what otherwise loses it.
 */
const LANE_NAME_AXES = '"SOFT" 100, "WONK" 0, "opsz" 10, "wght" 420';

function LaneName({ children }: { children: string }) {
  return (
    <span
      className="font-ui text-[11.5px] font-semibold tracking-[0.1em] text-ink uppercase"
      style={{ fontVariationSettings: LANE_NAME_AXES }}
    >
      {children}
    </span>
  );
}

function LaneCount({ children }: { children: string }) {
  return <span className="font-ui text-[12px] text-slate-600">{children}</span>;
}

function LaneValue({ children }: { children: string }) {
  return (
    <span className="ml-auto font-ui text-[14px] font-medium text-slate-700">{children}</span>
  );
}

/** The three-row card shell: Draft, Sent and Negotiating all use it. */
function StandardCard({ card }: { card: BoardCard }) {
  return (
    <div className="rounded-lg bg-card p-3">
      <CardHead name={card.name} client={card.client} photo={card.photo} />
      {/* The flex wrapper stays. Its `justify-content` and `gap` are inert with
          one child and are dropped, but `display: flex` is not: it is what
          shrinks the figure's box to its text. As a plain block the box runs the
          card's full width, which measures as a 138px drift against the
          artboard even though the glyphs sit in the same place. */}
      <span className="mt-[9px] flex items-baseline">
        <span className="font-ui text-[15px] font-medium text-charcoal-900">{card.amount}</span>
      </span>
      {card.status ? (
        <span className="mt-[9px] block border-t border-slate-100 pt-[9px]">
          <span
            className={`block font-ui text-[12px] leading-[1.4] ${
              card.statusTone === "rust" ? "text-rust" : "text-slate-700"
            }`}
          >
            {card.status}
          </span>
        </span>
      ) : null}
      <span className="mt-[9px] block font-ui text-[13.5px] font-semibold text-forest-700">
        {VIEW_QUOTE}
      </span>
    </div>
  );
}

function CardHead({ name, client, photo }: { name: string; client: string; photo: string }) {
  return (
    <span className="flex items-center gap-[9px]">
      <Image
        src={photo}
        alt=""
        width={38}
        height={38}
        className="h-[38px] w-[38px] flex-none rounded-md object-cover"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="min-w-0 truncate font-ui text-[14px] font-medium text-charcoal-900">
          {name}
        </span>
        <span className="flex items-center gap-[5px] font-ui text-[12px] text-slate-500">
          <User aria-hidden="true" className="h-3 w-3 flex-none" strokeWidth={2} />
          <span className="truncate">{client}</span>
        </span>
      </span>
    </span>
  );
}

export function Board() {
  return (
    <div className="relative border-t border-pf-ink-200 bg-canvas p-4">
      {/*
        The toast. A sibling of the board rather than a child of the Closed
        lane, so it can sit in the board container's padding box regardless of
        which column the card lands in. It is z-20 against the flying card's
        z-30, so the card passes OVER it - which only matters below 1280px,
        where the card's path and the toast's corner can cross.
      */}
      <div className="won-toast absolute right-4 bottom-4 z-20 flex max-w-[320px] items-center gap-[11px] rounded-lg border border-hairline bg-card py-[11px] pr-[14px] pl-[11px] shadow-[0_18px_38px_-18px_rgb(21_48_31_/_0.5)]">
        <span
          aria-hidden="true"
          className="grid h-[30px] w-[30px] flex-none place-items-center rounded-md bg-lime-500"
        >
          <Check className="h-4 w-4 text-forest-900" strokeWidth={2.6} />
        </span>
        {/* [LOG] `12 this month` is contradicted by the Closed count (6 -> 7)
            and by the leaderboard, which sums to 25. The client's figures;
            flagged, not reconciled. */}
        <span className="min-w-0 font-ui text-[13px] leading-[1.45] text-charcoal-900">
          {TOAST_MESSAGE}
        </span>
      </div>

      <div className="board grid items-start gap-3">
        {/* Draft. */}
        <section
          className="flex flex-col gap-2.5 rounded-xl p-3"
          style={{ background: LANE_DRAFT }}
        >
          <header className="flex items-center gap-2 px-1">
            <LaneDot background="var(--color-slate-300)" />
            <LaneName>{LANES.draft.name}</LaneName>
            <LaneCount>{LANES.draft.count}</LaneCount>
            <LaneValue>{LANES.draft.value}</LaneValue>
          </header>
          <div className="flex flex-1 flex-col gap-2">
            {DRAFT_CARDS.map((card) => (
              <StandardCard key={card.name} card={card} />
            ))}
          </div>
        </section>

        {/* Sent - the rust lane. Two quotes going cold, and the chapter's only
            warning-toned text. */}
        <section
          className="flex flex-col gap-2.5 rounded-xl p-3"
          style={{ background: LANE_SENT }}
        >
          <header className="flex items-center gap-2 px-1">
            <LaneDot background="var(--color-forest-500)" />
            <LaneName>{LANES.sent.name}</LaneName>
            <LaneCount>{LANES.sent.count}</LaneCount>
            <LaneValue>{LANES.sent.value}</LaneValue>
          </header>
          <div className="flex flex-1 flex-col gap-2">
            {SENT_CARDS.map((card) => (
              <StandardCard key={card.name} card={card} />
            ))}
          </div>
        </section>

        {/* Negotiating - the lane the card leaves. */}
        <section
          className="flex flex-col gap-2.5 rounded-xl p-3"
          style={{ background: LANE_NEGOTIATING }}
        >
          <header className="flex items-center gap-2 px-1">
            {/* The one lime dot on the board: forward motion, a sanctioned lime
                role. It is also the only dot with a shadow, and the artboard
                gives it a 12px radius on an 8px box - which already clamps to a
                circle, so `rounded-full` is identical output (§02 ruling 6). */}
            <LaneDot
              background="var(--color-lime-500)"
              className="shadow-[0_8px_20px_-10px_rgb(21_48_31_/_0.4)]"
            />
            <LaneName>{LANES.negotiating.name}</LaneName>
            {/*
              Each swap pair is two spans sharing one grid cell inside an
              inline-grid, so the slot is always as wide as the wider of the two
              and neither the count nor the total column shifts as they cross
              over. Both halves are always in the DOM, which is one of the
              reasons the stage is role="img".
            */}
            <span className="inline-grid font-ui text-[12px] text-slate-600">
              <span className="won-swap-a won-lin [grid-area:1/1]">
                {LANES.negotiating.count}
              </span>
              <span className="won-swap-b won-lin [grid-area:1/1]">
                {LANES.negotiating.countAfter}
              </span>
            </span>
            <span className="ml-auto inline-grid justify-items-end font-ui text-[14px] font-medium text-slate-700">
              <span className="won-swap-a won-lin [grid-area:1/1]">
                {LANES.negotiating.value}
              </span>
              <span className="won-swap-b won-lin [grid-area:1/1]">
                {LANES.negotiating.valueAfter}
              </span>
            </span>
          </header>
          <div className="flex flex-1 flex-col gap-2">
            {/*
              The slot. `overflow-visible` is load-bearing and must never be
              "tidied" to hidden: it is what lets the card leave its own lane
              during the flight, and what lets the grab badge hang off the
              card's bottom-right corner. The slot collapses AFTER the card has
              gone (48% -> 54%), which is what makes Harcourt St slide up.
            */}
            <div className="won-slot overflow-visible">
              {/*
                The flying card. [LOG] `cursor: grabbing` is permanent in the
                artboard, not scoped to the 28-52% flight - a grab cursor on a
                non-interactive depiction for the whole cycle, and forever under
                reduced motion (D8). Shipped as drawn.

                It is the only board card with no status line and no divider.
                That is what keeps it inside the 150px max-height the slot and
                land keyframes are written against (D27).
              */}
              <div className="won-card relative z-30 cursor-grabbing rounded-lg bg-card p-3">
                <span
                  aria-hidden="true"
                  className="won-grab absolute right-[-9px] bottom-[-11px] z-[2] grid h-[26px] w-[26px] place-items-center rounded-full bg-forest-900 shadow-[0_6px_14px_-6px_rgb(21_48_31_/_0.7)]"
                >
                  <Grab className="h-[14px] w-[14px] text-white" strokeWidth={2} />
                </span>
                <CardHead name={WON_JOB.name} client={WON_JOB.client} photo={WON_JOB.photo} />
                <span className="mt-[9px] flex items-baseline">
                  <span className="font-ui text-[15px] font-medium text-charcoal-900">
                    {WON_JOB.amount}
                  </span>
                </span>
                <span className="mt-[9px] block font-ui text-[13.5px] font-semibold text-forest-700">
                  {VIEW_QUOTE}
                </span>
              </div>
            </div>
            {NEGOTIATING_CARDS.map((card) => (
              <StandardCard key={card.name} card={card} />
            ))}
          </div>
        </section>

        {/* Closed - a full-width second row below 1280px, a 236px fourth column
            at and above it. Both in styles/motion/chapter-3.css, beside the
            travel vector that has to match. */}
        <section
          className="board-closed flex flex-col gap-2.5 rounded-xl p-3"
          style={{ background: LANE_CLOSED }}
        >
          <header className="flex items-center gap-2 px-1">
            <LaneDot background="var(--color-slate-300)" />
            <LaneName>{LANES.closed.name}</LaneName>
            <span className="inline-grid font-ui text-[12px] text-slate-600">
              <span className="won-swap-a won-lin [grid-area:1/1]">{LANES.closed.count}</span>
              <span className="won-swap-b won-lin [grid-area:1/1]">
                {LANES.closed.countAfter}
              </span>
            </span>
          </header>
          {/* The only lane with a blurb, and the only one with no value total. */}
          <p className="m-0 px-1 font-ui text-[12px] leading-[1.45] text-slate-600">
            {LANES.closed.blurb}
          </p>

          {/*
            The landing wrapper. `overflow-hidden` is required here, the
            opposite of the slot: it is what lets the card grow out of zero
            height without spilling into the lane.
          */}
          <div className="won-land overflow-hidden">
            {/*
              [LOG] The 1.5px lime keyline is the banned decorative-lime border,
              the identical case to the hero's float cards (RULINGS §02
              ruling 2) and the identical call: build as drawn, log it.

              The shine span is first in DOM order and all three content spans
              carry `relative`, so the sweep passes UNDER the text. Lose that
              ordering and it washes over it.
            */}
            <div className="relative overflow-hidden rounded-lg bg-card p-3 shadow-[0_0_0_1.5px_var(--color-lime-500)]">
              <span
                aria-hidden="true"
                className="won-shine won-lin pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_20%,color-mix(in_oklab,#fff_78%,transparent)_50%,transparent_80%)]"
              />
              <span className="relative flex items-center gap-[9px]">
                <Image
                  src={WON_JOB.photo}
                  alt=""
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] flex-none rounded-md object-cover"
                />
                <span className="min-w-0 flex-1 truncate font-ui text-[13.5px] font-medium text-charcoal-900">
                  {WON_JOB.name}
                </span>
              </span>
              <span className="relative mt-0.5 flex items-center gap-[5px] font-ui text-[12px] text-slate-600">
                <User aria-hidden="true" className="h-3 w-3 flex-none" strokeWidth={2} />
                <span className="truncate">{`${WON_JOB.client} · ${WON_JOB.amount}`}</span>
              </span>
              {/* Fresh: lime dot, forest-800 label. The settled card below fades
                  every one of those a step - the same state at two ages. */}
              <span className="relative mt-2 flex items-center gap-[7px] font-ui text-[11.5px] font-semibold tracking-[0.05em] text-forest-800 uppercase">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 flex-none rounded-full bg-lime-500"
                />
                Won
              </span>
            </div>
          </div>

          {/* The settled card: a well fill, a faded photograph, forest rather
              than lime. A completed state in forest, per docs/brand.md. */}
          <div className="rounded-lg bg-well p-3">
            <span className="flex items-center gap-[9px]">
              <Image
                src={SETTLED_JOB.photo}
                alt=""
                width={30}
                height={30}
                className="h-[30px] w-[30px] flex-none rounded-md object-cover opacity-[0.72]"
              />
              <span className="min-w-0 flex-1 truncate font-ui text-[13.5px] font-medium text-slate-700">
                {SETTLED_JOB.name}
              </span>
            </span>
            <span className="mt-0.5 flex items-center gap-[5px] font-ui text-[12px] text-slate-600">
              <User aria-hidden="true" className="h-3 w-3 flex-none" strokeWidth={2} />
              <span className="truncate">{`${SETTLED_JOB.client} · ${SETTLED_JOB.amount}`}</span>
            </span>
            <span className="mt-2 flex items-center gap-[7px] font-ui text-[11.5px] font-semibold tracking-[0.05em] text-slate-600 uppercase">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 flex-none rounded-full bg-forest-700"
              />
              Won
            </span>
          </div>

          <span className="px-1 pt-0.5 font-ui text-[13.5px] font-semibold text-forest-700">
            {LANES.closed.link}
          </span>
        </section>
      </div>
    </div>
  );
}
