/**
 * Application-wide constants — single source of truth.
 */
module.exports = {
  /* ── Timeouts ──────────────────────────────────────────── */
  TIMEOUT_MS: parseInt(process.env.TIMEOUT_MS, 10) || 8000,
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES, 10) || 2,

  /* ── Queue ─────────────────────────────────────────────── */
  QUEUE_NAME: 'media-download',
  QUEUE_CONCURRENCY: parseInt(process.env.QUEUE_CONCURRENCY, 10) || 3,

  /* ── Platforms ─────────────────────────────────────────── */
  PLATFORMS: {
    INSTAGRAM: 'instagram',
    FACEBOOK: 'facebook',
    UNKNOWN: 'unknown',
  },

  /* ── Job Statuses ──────────────────────────────────────── */
  JOB_STATUS: {
    QUEUED: 'queued',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },

  /* ── Extraction Sources ────────────────────────────────── */
  EXTRACTION_SOURCE: {
    YTDLP: 'yt-dlp',
    SCRAPER: 'scraper-fallback',
  },

  /* ── Supported URL Patterns ────────────────────────────── */
  URL_PATTERNS: {
    INSTAGRAM: [
      /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[\w-]+/i,
      /^https?:\/\/(www\.)?instagram\.com\/stories\/[\w.]+\/\d+/i,
    ],
    FACEBOOK: [
      /^https?:\/\/(www\.|m\.|web\.)?facebook\.com\/.+\/(videos|posts|watch|reel)\//i,
      /^https?:\/\/(www\.|m\.)?facebook\.com\/watch\/?\?v=\d+/i,
      /^https?:\/\/(www\.|m\.)?facebook\.com\/reel\/\d+/i,
      /^https?:\/\/fb\.watch\/[\w-]+/i,
    ],
  },
};
