"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { CASE_STUDIES, caseStudyPath } from "@/content/case-studies";

/**
 * The nav's one dropdown: "Case studies", opening the three studies.
 *
 * THE SHEET IS A DISCLOSURE, NOT A MENU. Its contents are links to pages, so it
 * is a button with `aria-expanded` over a plain list, not `role="menu"` with
 * menuitems - a menu would promise arrow-key semantics the browser's own link
 * handling does not provide, and would take the links out of the reading order
 * a screen reader walks. `aria-haspopup` is left off for the same reason
 * <NavItem> leaves it off its chevrons: it names a widget this is not.
 *
 * OPEN ON HOVER AND ON CLICK. Hover alone strands keyboard and touch, click
 * alone makes a wide sheet feel stiff on a pointer. So the wrapper opens on
 * pointer enter and closes on leave, the trigger toggles on click, Escape
 * closes and returns focus to the trigger, and `focusout` past the wrapper
 * closes it - which is what carries a keyboard reader out through the last link
 * without trapping them.
 *
 * THE ROWS CARRY THE STUDY'S OWN WORDS. Title and blurb are `study.card`, the
 * same pair the homepage tiles and the foot of each study draw, so the nav
 * cannot describe a study differently from everything else on the site.
 */
export function NavCaseStudies({ triggerClassName }: { triggerClassName: string }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const sheetId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div
      ref={wrapper}
      className="relative"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={sheetId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className={`${triggerClassName} gap-1.5 px-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 group-data-[nav-state=dark]:focus-visible:outline-cream group-data-[nav-state=light]:focus-visible:outline-forest-700`}
      >
        Case studies
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden="true"
          focusable="false"
          className={`transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
        />
      </button>

      {/* TWO ELEMENTS, AND THE OUTER ONE IS THE POINT. The sheet sits 10px below
          the trigger, and with that gap as empty page the pointer left the
          wrapper on its way down and the sheet closed under the cursor. So the
          gap is `pt-2.5` on a positioned wrapper that starts at `top-full`:
          the same 10px of air, but inside the element the pointer is tracked
          against, so travelling to the sheet never leaves it.

          Always rendered, hidden with `invisible` rather than unmounted: the
          sheet fades and lifts, and a node that does not exist cannot
          transition. `invisible` (not opacity alone) is what takes the links
          out of the tab order while it is closed, and `pointer-events-none`
          stops the closed wrapper's 10px strip from sitting over the page. */}
      <div
        className={
          "absolute top-full left-0 w-[680px] pt-2.5 " + (open ? "" : "pointer-events-none")
        }
      >
        <div
          id={sheetId}
          className={
            "w-full origin-top-left rounded-xl bg-white p-2.5 " +
            "shadow-overlay transition-[opacity,transform] duration-200 " +
            (open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0")
          }
        >
          <div className="grid grid-cols-[minmax(0,1fr)_240px] gap-2.5">
            <ul className="m-0 flex list-none flex-col p-0">
              {CASE_STUDIES.map((study) => (
                <li key={study.slug}>
                  <Link
                    href={caseStudyPath(study.slug)}
                    tabIndex={open ? undefined : -1}
                    className="flex flex-col gap-1 rounded-lg px-3.5 py-3 no-underline transition-colors duration-150 hover:bg-pf-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
                  >
                    <span className="text-[11px] font-extrabold tracking-[0.14em] text-eyebrow uppercase">
                      {study.client}
                    </span>
                    <span className="text-[16px] font-semibold text-pf-ink-900">
                      {study.card.title}
                    </span>
                    <span className="text-[14px] leading-[1.5] text-slate-600">
                      {study.card.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* The design's illustration panel. No artwork here, so it is the
              petrol ramp fading into itself: forest-700 to forest-900 across the
              diagonal, in srgb because both stops are brand hex values and
              oklab bends the midpoint somewhere neither of them is - the same
              call the case study pull quote makes. Decorative, so it is out of
              the accessibility tree entirely. */}
            <span
              aria-hidden="true"
              className="rounded-lg bg-linear-to-br/srgb from-forest-700 to-forest-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
