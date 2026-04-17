/**
 * Strategic ad placement container.
 * Replace the inner content with actual ad network scripts (Adsterra, etc.)
 * when ready to monetize.
 *
 * Variants:
 *   - "banner"    → 728x90 leaderboard (top / between sections)
 *   - "inline"    → fluid within content
 *   - "sticky"    → sticky bottom bar on mobile
 */
export default function AdPlaceholder({ variant = 'banner', id }) {
  // During development, render an invisible container.
  // In production, replace with real ad scripts.
  return (
    <div
      className={`ad-slot ad-slot-${variant}`}
      id={id || `ad-${variant}`}
      data-ad-slot={variant}
      aria-hidden="true"
    >
      {/* Ad network script will be injected here */}
    </div>
  );
}
