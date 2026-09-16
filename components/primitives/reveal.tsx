import type { ElementType, ReactNode } from "react";

type RevealAnimation = "word" | "up-blur" | "up" | "scale" | "up-scale" | "pop" | "blur";

type RevealProps = {
  as?: ElementType;
  anim?: RevealAnimation;
  /** Seconds, matching the artboard's data-delay. */
  delay?: number;
  /** Seconds. Defaults to 0.5 via CSS. */
  duration?: number;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>;

/**
 * Marks a subtree as a scroll-triggered entrance. Renders server-side as plain
 * markup; useReveal (mounted once at the page root) does the rest, so this stays
 * a Server Component and costs nothing in the bundle.
 */
export function Reveal({
  as: Tag = "div",
  anim = "up-blur",
  delay,
  duration,
  className,
  children,
  ...rest
}: RevealProps) {
  return (
    <Tag
      data-anim={anim}
      data-delay={delay}
      data-duration={duration}
      className={className ? `reveal-idle ${className}` : "reveal-idle"}
      {...rest}
    >
      {children}
    </Tag>
  );
}
