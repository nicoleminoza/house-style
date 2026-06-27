// The House Style brand mark — the plum "H" monogram, a sibling of Nicole's
// personal "N". Inline SVG so it stays crisp at any size and needs no asset fetch.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="House Style"
    >
      <rect width="64" height="64" rx="12" fill="#6b2c41" />
      {/* Baseline placed by cap-height so the H is optically centered in all
          renderers (avoids dominant-baseline, which centers the em box and
          drops the cap low). y = (64 + capHeight≈30.5) / 2 ≈ 47.25 */}
      <text
        x="32"
        y="47.25"
        fill="#faf6f1"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="600"
        fontSize="44"
        textAnchor="middle"
      >
        H
      </text>
    </svg>
  )
}
