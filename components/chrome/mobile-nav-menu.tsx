"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CASE_STUDIES, caseStudyPath } from "@/content/case-studies";
import { NavItem } from "./nav-item";

const SHEET_ID = "m-nav-menu";

/* The first group mirrors the desktop nav, which is now the three case studies
   and nothing else: Product, Customers and Pricing went with the desktop pill's
   inert items. There is no dropdown here - a sheet inside a sheet - so the three
   are listed flat, under the label the desktop trigger carries. The second group
   is verbatim from the mobile footer, and `Get started` is not here because it
   is already in the bar. */
const SECONDARY = ["About", "Help centre", "Contact"];

const ROW =
  "flex h-12 w-full items-center rounded-lg px-3 text-left text-[16px] font-semibold text-ink hover:bg-well";

/*
 * The 10px radius matches the CTA beside it. It is off the brand's 4/6/8/12
 * scale; it is what the artboard draws, and it ships as drawn.
 */
const BUTTON =
  "grid h-10 w-10 place-items-center rounded-[10px] border transition-[background,border-color,color] duration-[250ms] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "group-data-[nav-state=dark]:border-white/28 group-data-[nav-state=dark]:bg-white/14 group-data-[nav-state=dark]:text-white " +
  "group-data-[nav-state=dark]:focus-visible:outline-cream " +
  "group-data-[nav-state=light]:border-hairline group-data-[nav-state=light]:bg-card group-data-[nav-state=light]:text-ink " +
  "group-data-[nav-state=light]:focus-visible:outline-forest-700";

/**
 * The hamburger and what it opens.
 *
 * [ADDITION - not in the artboard.] The artboard draws the button and gives it
 * nothing to do. A non-modal dropdown sheet is the smallest thing that makes it
 * honest: no focus trap, no scroll lock, no backdrop, and built entirely from
 * tokens already on the page. Nine inert items do not justify a modal.
 *
 * Everything inside the sheet is inert for the same reason the desktop nav is -
 * the homepage is the only page in scope.
 */
export function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeAndRefocus = () => {
      setOpen(false);
      buttonRef.current?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndRefocus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (sheetRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      // Pulling focus back would steal it from whatever was just clicked, so an
      // outside click only returns focus if it was inside the sheet to start
      // with.
      if (sheetRef.current?.contains(document.activeElement)) closeAndRefocus();
      else setOpen(false);
    };

    const onScroll = () => setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Menu"}
        aria-expanded={open}
        aria-controls={SHEET_ID}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className={BUTTON}
      >
        {open ? (
          <X size={18} strokeWidth={2} aria-hidden="true" focusable="false" />
        ) : (
          <Menu size={18} strokeWidth={2} aria-hidden="true" focusable="false" />
        )}
      </button>

      {/* Unmounting on close is the brand's "closing unmounts instantly"; the
          open fade lives in styles/motion/chrome.css. The sheet is a child of
          the header, which is the positioned ancestor it hangs from. */}
      {open ? (
        <div
          ref={sheetRef}
          id={SHEET_ID}
          className="nav-sheet shadow-overlay absolute inset-x-0 top-full z-[59] rounded-b-xl border-t border-hairline bg-card px-4 pt-2 pb-4"
          onClick={() => {
            setOpen(false);
            buttonRef.current?.focus();
          }}
        >
          <span className="block px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-[0.14em] text-eyebrow uppercase">
            Case studies
          </span>

          {CASE_STUDIES.map((study) => (
            <NavItem
              key={study.slug}
              href={caseStudyPath(study.slug)}
              tone="light"
              className={ROW}
            >
              {study.client}
            </NavItem>
          ))}

          <hr className="my-2 border-0 border-t border-hairline" />

          {SECONDARY.map((label) => (
            <NavItem key={label} tone="light" className={ROW}>
              {label}
            </NavItem>
          ))}
        </div>
      ) : null}
    </>
  );
}
