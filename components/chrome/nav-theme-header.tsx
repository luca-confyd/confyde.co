"use client";

import type { ReactNode } from "react";

import { useDesktopNavTheme, useMobileNavTheme } from "@/lib/use-nav-theme";

type NavThemeHeaderProps = {
  className: string;
  children: ReactNode;
};

/**
 * The only part of either header that runs on the client.
 *
 * It renders the `<header>` element and one attribute on it; everything inside
 * arrives already rendered from the server and every state-dependent style hangs
 * off `group-data-[nav-state=…]` in the markup, so the nav's flip costs one
 * attribute write and no client-side markup.
 *
 * `data-nav-state` replaces the artboards' hand-toggled `.on-dark` / `.on-light`
 * classnames. The server render is `dark`, matching the artboards' initial
 * `class="on-dark"`.
 */
export function DesktopNavHeader({ className, children }: NavThemeHeaderProps) {
  const theme = useDesktopNavTheme();
  return (
    <header data-nav-state={theme} className={className}>
      {children}
    </header>
  );
}

export function MobileNavHeader({ className, children }: NavThemeHeaderProps) {
  const theme = useMobileNavTheme();
  return (
    <header data-nav-state={theme} className={className}>
      {children}
    </header>
  );
}
