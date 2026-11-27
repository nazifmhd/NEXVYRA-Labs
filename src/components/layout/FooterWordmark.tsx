/**
 * Footer wordmark drawn as SVG text with textLength, so it spans exactly the
 * container width at every screen size: its left and right edges line up with
 * the footer columns, and it sits on its own baseline above the divider.
 * The light sweep is a gradient band clipped to the same text, so the outline
 * and the sweep can never drift apart.
 */
export function FooterWordmark({ text }: { text: string }) {
  const W = 1000;
  const H = 122; // baseline sits at the bottom edge; caps fill the height
  // Optical correction: glyphs carry side bearings (N ≈ 14 units left, A ≈ 4 right),
  // so the text box is widened slightly so the visible ink — not the box — meets the edges.
  const BEAR_L = 14;
  const BEAR_R = 4;
  const textProps = {
    x: -BEAR_L,
    y: H - 2,
    textLength: W + BEAR_L + BEAR_R,
    lengthAdjust: "spacingAndGlyphs" as const,
    style: { fontFamily: "var(--font-space), sans-serif", fontWeight: 600, fontSize: 168 },
  };
  return (
    <svg viewBox={`0 -2 ${W} ${H + 4}`} className="block h-auto w-full select-none" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="footer-wm-clip">
          <text {...textProps}>{text}</text>
        </clipPath>
        <linearGradient id="footer-wm-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A8D8FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#A8D8FF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#A8D8FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text {...textProps} fill="none" stroke="rgb(168 216 255 / 0.3)" strokeWidth={1} vectorEffect="non-scaling-stroke">
        {text}
      </text>
      <g clipPath="url(#footer-wm-clip)">
        <rect className="wm-sweep" x={-360} y={-2} width={360} height={H + 4} fill="url(#footer-wm-sweep)" />
      </g>
    </svg>
  );
}
