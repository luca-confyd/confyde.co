/* -----------------------------------------------------------------------------
   The four social marks.

   ESCALATION, not a quiet exception. The brand doc says Lucide is the only icon
   system, and §02 ruling 8 made that binding by replacing a hand-drawn play
   glyph with Lucide `Play`. That ruling worked because `Play` exists. These four
   do not: lucide-react 1.x ships no brand icons at all - `Twitter`, `X`,
   `Instagram`, `Linkedin` and `Youtube` were all removed from the set, and a
   grep of the installed package's 2102 icons returns zero matches for any of
   them. There is no Lucide glyph to use.

   The three ways out, and why this one:

   1. Substitute a generic Lucide glyph (`AtSign`, `Camera`, `Link`, `Play`).
      Rejected outright. The brief forbids it, and a camera does not mean
      Instagram - the label would be carrying the whole meaning while the glyph
      contradicted it.
   2. Drop the row. That deletes a piece of the design on our own authority.
   3. Carry the artboard's own paths, which is what this file does.

   These are the marks exactly as the desktop artboard draws them - they are
   third-party logos rather than iconography, which is the same reason `Asap`
   is allowed to be the wordmark and nothing else. They are `currentColor` and
   16px, so they obey the same rules as every Lucide glyph beside them, and they
   live in one file so that adopting an icon set that does cover brand marks is
   a single edit.

   The tech lead rules on whether this exception stands.
----------------------------------------------------------------------------- */

/* Every call site is an icon-only link that carries its own aria-label, so each
   mark is decorative and takes no props. */
const SIZE = { width: 16, height: 16, viewBox: "0 0 24 24", "aria-hidden": true, focusable: "false" } as const;

export function XMark() {
  return (
    <svg {...SIZE} fill="currentColor">
      <path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5-6.5L5.3 22H2l7.8-8.9L1 2h7l4.5 6z" />
    </svg>
  );
}

export function InstagramMark() {
  return (
    <svg {...SIZE} fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInMark() {
  return (
    <svg {...SIZE} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.1V21h-4v-6.1c0-1.46-.03-3.33-2.03-3.33-2.03 0-2.34 1.58-2.34 3.22V21h-4z" />
    </svg>
  );
}

export function YouTubeMark() {
  return (
    <svg {...SIZE} fill="currentColor">
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM10 15V9l5 3z" />
    </svg>
  );
}
