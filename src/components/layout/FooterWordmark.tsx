/**
 * Footer wordmark drawn as SVG text with textLength, so it spans exactly the
 * container width at every screen size: its left and right edges line up with
 * the footer columns, and it sits on its own baseline above the divider.
 *
 * The light sweep is an animated gradient fill on a second copy of the same
 * text (no hidden <text> inside a clipPath — browsers report those as the
 * page's Largest Contentful Paint, which corrupts the metric).
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
        <linearGradient id="footer-wm-sweep" gradientUnits="userSpaceOnUse" x1={-360} y1={0} x2={0} y2={0}>
          <stop offset="0%" stopColor="#A8D8FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#A8D8FF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#A8D8FF" stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; 1720 0; 1720 0"
            keyTimes="0; 0.6; 1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0 0 1 1"
            dur="9s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <text {...textProps} fill="none" stroke="rgb(168 216 255 / 0.3)" strokeWidth={1} vectorEffect="non-scaling-stroke">
        {text}
      </text>
      <text {...textProps} fill="url(#footer-wm-sweep)" className="wm-sweep-text">
        {text}
      </text>
    </svg>
  );
}
