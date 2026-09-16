/**
 * The artboard's own number formatter, ported whole from the count-up script.
 *
 * It lives in its own module, without a `"use client"` directive, because both
 * sides need it: the client hook writes frames with it, and the Server
 * Component that renders each figure uses it to write the visually-hidden final
 * value at build time. Importing it from the hook's module would have made it a
 * client reference the server cannot call.
 *
 * Only `int`, `percent0` and `moneyKwhole` are reachable from chapter 3; the
 * rest of the switch is carried because it is one function in the source and
 * splitting it would invite the two halves to drift.
 */
export function fmt(kind: string, n: number): string {
  switch (kind) {
    case "thousands1":
      return `${(n / 1000).toFixed(1)}K`;
    case "millions2":
      return `${(n / 1e6).toFixed(2)}M`;
    case "money1":
      return `$${(n / 1000).toFixed(1)}K`;
    case "moneyKwhole":
      return `$${Math.round(n / 1000)}K`;
    case "dollars":
      return `$${Math.round(n).toLocaleString("en-US")}`;
    case "percent":
      return `${n.toFixed(1)}%`;
    case "percent0":
      return `${Math.round(n)}%`;
    case "kwhole":
      return `${Math.round(n / 1000)}K`;
    case "mwhole":
      return `${Math.round(n / 1e6)}M`;
    default:
      return String(Math.round(n));
  }
}
