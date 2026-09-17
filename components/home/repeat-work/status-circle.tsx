/**
 * The status circle at the end of a client row.
 *
 * WHAT IT DEPICTS. Confyde working through the list: each row starts as a
 * spinner and resolves to a tick, one row at a time, top to bottom. It is a
 * depiction of the app doing the chasing the heading says you no longer have to
 * do - which is why it runs on its own rather than on hover or on click. There
 * is nothing to interact with here.
 *
 * It runs ONCE, when the card reaches the viewport, and the trigger is the
 * `Reveal` already wrapping the grid - no observer of our own and no client
 * component. See styles/motion/repeat-work.css.
 *
 * WHY BOTH STATES ARE ALWAYS IN THE DOM. The spinner and the tick are two
 * stacked layers and the sequence crossfades between them in CSS. Swapping the
 * markup instead would mean a timer in a client component, re-rendering five
 * rows on a loop, for something that is pure decoration - and it would put the
 * sequence in two places, JS and CSS, instead of one.
 *
 * `index` only sets the stagger. Every row is otherwise identical, so a row
 * does not know or care whether it is "done": see styles/motion/repeat-work.css
 * for the whole timeline, including what happens under reduced motion.
 *
 * `aria-hidden`, and no live region. A screen reader gets the row's title and
 * detail, which say what happened; a spinner that resolves every few seconds
 * forever would be noise at best and an interruption at worst.
 */
export function StatusCircle({ index, size = 30 }: { index: number; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="rw-status relative block flex-none"
      style={{
        width: size,
        height: size,
        /* The stagger, as a custom property rather than an inline
           `animationDelay`: both layers below need the same offset, and one
           value on the parent cannot drift from the other. */
        ["--rw-delay" as string]: `${index * 0.55}s`,
      }}
    >
      {/* The spinner: a full ring in the page's hairline tone with one petrol
          arc riding it. `strokeDasharray` is a quarter of the circumference
          (2*pi*13 = 81.7), so the arc covers 90 degrees. */}
      <svg viewBox="0 0 30 30" className="rw-spin absolute inset-0 size-full">
        <circle cx="15" cy="15" r="13" fill="none" stroke="var(--color-hairline)" strokeWidth="2" />
        <circle
          className="rw-spin-arc"
          cx="15"
          cy="15"
          r="13"
          fill="none"
          stroke="var(--color-forest-700)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="20.4 61.3"
        />
      </svg>

      {/* The resolved state: a filled petrol disc with a white tick. */}
      <svg viewBox="0 0 30 30" className="rw-tick absolute inset-0 size-full">
        <circle cx="15" cy="15" r="15" fill="var(--color-forest-700)" />
        <path
          d="m9.5 15.4 3.6 3.5 7.4-7.4"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
