const { extractWithYtdlp } = require('./ytdlpService');
const { extractWithScraper } = require('./scraperService');
const { logger } = require('../utils/logger');

/**
 * Orchestrator — runs primary extraction then falls back.
 *
 * Pipeline:
 *   1. yt-dlp (with internal retries + backoff)
 *   2. Fallback → OG scraper (axios + cheerio)
 *   3. If both fail → throw consolidated error
 *
 * @param {string} url      — validated media URL
 * @param {string} platform — 'instagram' | 'facebook'
 * @returns {Promise<object>} — normalised media data
 */
async function extractMedia(url, platform) {
  logger.info(`[extraction] Starting extraction for ${platform}: ${url}`);

  let lastError = null;

  /* ── Stage 1: yt-dlp (primary) ─────────────────────────── */
  try {
    const result = await extractWithYtdlp(url);
    return result;
  } catch (err) {
    lastError = err;
    logger.warn(`[extraction] yt-dlp failed: ${err.message}`);
  }

  /* ── Stage 2: Scraper fallback ─────────────────────────── */
  try {
    logger.info('[extraction] Falling back to scraper…');
    const result = await extractWithScraper(url);
    return result;
  } catch (err) {
    logger.error(`[extraction] Scraper fallback also failed: ${err.message}`);
    lastError = err;
  }

  /* ── Both failed ───────────────────────────────────────── */
  const consolidated = new Error(
    `All extraction methods failed for ${platform} URL. Last error: ${lastError?.message || 'Unknown'}`
  );
  consolidated.code = 'EXTRACTION_FAILED';
  throw consolidated;
}

module.exports = { extractMedia };
