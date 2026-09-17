type WordmarkProps = {
  className?: string;
};

/**
 * The logo. Asap 800 is the wordmark and nothing else - the one sanctioned
 * exception to the brand's two-family rule, because it is the logo, not type.
 *
 * `.wordmark` carries the desktop cut (24px / -0.02em). The mobile bar draws its
 * own 19px / -0.01em cut, which is a different composition rather than a scale
 * of this one, and overrides those two properties through `className`.
 */
export function Wordmark({ className }: WordmarkProps) {
  return <span className={className ? `wordmark ${className}` : "wordmark"}>Confyde</span>;
}
