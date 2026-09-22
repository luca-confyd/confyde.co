"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";

/* Forest on a light surface, per docs/brand.md - matching the testimonial
   arrows, which are the page's other focusable control. */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-700";

/**
 * STUB CONTENT. One line per tab, standing in until the real panels are
 * written. The labels are drawn from the chapter's own subtext - operations,
 * team, roadmap - so the strip reads as the discovery call's three angles
 * rather than as lorem; expect all six strings to be replaced.
 */
const TABS = [
  {
    id: "operations",
    label: "Map your operations",
    line: "Where the work actually goes, and which parts of it a machine should never touch.",
  },
  {
    id: "team",
    label: "Brief your team",
    line: "Who ends up owning the change, and what they need to be able to run it without you.",
  },
  {
    id: "roadmap",
    label: "Shape the roadmap",
    line: "The handful of changes worth doing next quarter, in the order that compounds.",
  },
] as const;

/**
 * Panel A's tab strip: three centred tabs over a single line of copy, replacing
 * the take-off demo that used to sit here.
 *
 * THE UNDERLINE IS A SIBLING, NOT A BORDER. Each tab is a label with a 3px bar
 * beneath it, and both states paint that bar - dark for the selected tab, a
 * hairline tone for the other two. That is what stops the strip shifting by
 * 3px as the selection moves, and it is how the reference draws it: the
 * unselected tabs keep their rule, they just lose their weight.
 *
 * ROVING TABINDEX. Only the selected tab is reachable by Tab; the other two are
 * reached with the arrow keys, which is the tablist pattern rather than three
 * buttons in a row. Home/End jump to the ends.
 *
 * One component for both breakpoints. The strip is three short labels that wrap
 * to two rows on a narrow phone and need no second composition, unlike the two
 * cards below it.
 */
export function DiscoveryTabs() {
  const [selected, setSelected] = useState(0);
  const baseId = useId();
  const stripRef = useRef<HTMLDivElement>(null);

  function focusTab(index: number) {
    setSelected(index);
    const tabs = stripRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    tabs?.[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = TABS.length - 1;
    if (event.key === "ArrowRight") focusTab(selected === last ? 0 : selected + 1);
    else if (event.key === "ArrowLeft") focusTab(selected === 0 ? last : selected - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(last);
    else return;
    event.preventDefault();
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={stripRef}
        role="tablist"
        aria-label="What the discovery call covers"
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-start justify-center gap-x-14 gap-y-6"
      >
        {TABS.map((tab, i) => {
          const isSelected = i === selected;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(i)}
              className={
                "flex cursor-pointer flex-col items-center gap-1.5 border-0 bg-transparent p-0 " +
                FOCUS_RING
              }
            >
              <span
                className={
                  "font-ui text-[17px] transition-colors duration-150 " +
                  (isSelected ? "font-bold text-pf-ink-900" : "font-semibold text-pf-ink-400")
                }
              >
                {tab.label}
              </span>
              <span
                aria-hidden="true"
                className={
                  "h-[3px] w-full rounded-full transition-colors duration-150 " +
                  (isSelected ? "bg-pf-ink-900" : "bg-hairline")
                }
              />
            </button>
          );
        })}
      </div>

      {/* The panel is one line of stub copy. `min-h` is deliberately absent:
          while every line is one line long there is nothing to stabilise, and a
          guessed height would only have to be re-measured once the real panels
          land. */}
      {TABS.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={i !== selected}
          className="mt-8 max-w-[60ch] text-center text-[18px] text-pf-ink-900"
        >
          {tab.line}
        </div>
      ))}
    </div>
  );
}
