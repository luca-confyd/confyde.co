import { READING_SECTIONS } from "@/content/home";

/**
 * The section-timing table: five rows ranked longest-first, beside the replay.
 *
 * THIS IS THE EVIDENCE, NOT THE DEPICTION, which is why it sits outside the
 * frame's `role="img"` and is announced in full. Every figure the section
 * claims lives here - `2m 40s` against `1m 12s`, `48s`, `22s` and a dash - and
 * the Paving row's 2m 40s is what the accordion's 4200ms dwell is arguing.
 *
 * WCAG 1.4.1. Rank is encoded three times over: the swatch tone, the printed
 * duration and the row order. The gradient legend is a fourth reading of the
 * same thing and is `aria-hidden` on the bar only - `Least time` and `Most
 * time` are real text and stay.
 *
 * [LOG] Rows 1 and 2 share one forest-900 swatch despite different times, so
 * the five-step legend beneath them only ever shows four distinct values; and
 * every <li> carries a bottom hairline INCLUDING the last, so the list ends on
 * a rule with nothing under it. Both in the render (D11).
 */

/** The forest ramp, darkest = most time. Mobile ramps umber instead - see
    ./mini-replay.tsx for why the two breakpoints disagree (D18). */
const SWATCHES = [
  "var(--color-forest-900)",
  "var(--color-forest-900)",
  "var(--color-forest-500)",
  "var(--color-forest-300)",
  "var(--color-forest-100)",
];

export function TimingTable() {
  return (
    <div className="min-w-[138px] flex-[1_1_146px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-hairline pb-2 text-[11.5px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
          <span className="whitespace-nowrap">Section</span>
          <span className="whitespace-nowrap">Time</span>
        </div>

        <ul className="m-0 list-none p-0">
          {READING_SECTIONS.map((row, i) => (
            <li
              key={row.label}
              className="flex items-center gap-2.5 border-b border-b-[color-mix(in_oklab,var(--color-hairline)_45%,transparent)] py-[9px]"
            >
              <span
                aria-hidden="true"
                className="h-[9px] w-[9px] flex-none rounded-[2px]"
                style={{ background: SWATCHES[i] }}
              />
              {/* The winner row is the only bold label and the only one whose
                  time is set in the darker ink. */}
              <span
                className={
                  "min-w-0 flex-1 text-[14px] text-slate-700" + (i === 0 ? " font-semibold" : "")
                }
              >
                {row.label}
              </span>
              <span
                className={
                  "flex-none text-[13px] tabular-nums " +
                  (i === 0 ? "text-slate-700" : "text-slate-500")
                }
              >
                {row.time}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3.5 flex items-center gap-2 text-[12px] text-slate-500">
          Least time
          <span
            aria-hidden="true"
            className="h-2 min-w-0 flex-1 rounded-full bg-[linear-gradient(to_right,var(--color-forest-100),var(--color-forest-500),var(--color-forest-900))]"
          />
          Most time
        </div>
      </div>
    </div>
  );
}
