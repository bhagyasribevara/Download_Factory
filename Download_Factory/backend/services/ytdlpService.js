const { execFile } = require('child_process');
const { TIMEOUT_MS, MAX_RETRIES, EXTRACTION_SOURCE } = require('../config/constants');
const { getRandomUserAgent } = require('../utils/userAgents');
const { sleep, backoffDelay } = require('../utils/helpers');
const { logger } = require('../utils/logger');

/**
 * Primary extraction engine — wraps yt-dlp as a child process.
 *
 * Execution flow:
 *   1. Spawn yt-dlp with --dump-json
 *   2. Parse JSON output
 *   3. Normalise into standard schema
 *   4. Retry with exponential backoff on failure
 *
 * @param {string} url  — the media URL
 * @param {number} attempt — current attempt (1-indexed)
 * @returns {Promise<object>} — normalised media data
 */
async function extractWithYtdlp(url, attempt = 1) {
  logger.info(`[yt-dlp] Attempt ${attempt}/${MAX_RETRIES + 1} for ${url}`);

  const userAgent = getRandomUserAgent();

  const args = [
    '--dump-json',
    '--no-download',
    '--no-playlist',
    '--no-warnings',
    '--no-check-certificates',
    '--socket-timeout', '8',
    '--user-agent', userAgent,
    '--geo-bypass',
    url,
  ];

  return new Promise((resolve, reject) => {
    const child = execFile('python', ['-m', 'yt_dlp', ...args], {
      timeout: TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024, // 10 MB
      windowsHide: true,
    }, async (error, stdout, stderr) => {
      if (error) {
        const errMsg = error.killed
          ? `yt-dlp timed out after ${TIMEOUT_MS}ms`
          : `yt-dlp error: ${error.message}`;

        logger.warn(`[yt-dlp] ${errMsg}`);

        if (stderr) {
          logger.debug(`[yt-dlp] stderr: ${stderr.slice(0, 500)}`);
        }

        // Retry with backoff
        if (attempt <= MAX_RETRIES) {
          const delay = backoffDelay(attempt);
          logger.info(`[yt-dlp] Retrying in ${Math.round(delay)}ms…`);
          await sleep(delay);
          try {
            const result = await extractWithYtdlp(url, attempt + 1);
            return resolve(result);
          } catch (retryErr) {
            return reject(retryErr);
          }
        }

        return reject(new Error(errMsg));
      }

      // Parse output
      if (!stdout || !stdout.trim()) {
        return reject(new Error('yt-dlp returned empty output'));
      }

      try {
        const raw = JSON.parse(stdout);
        const normalised = normaliseYtdlpData(raw);
        logger.info(`[yt-dlp] ✅ Extracted: "${normalised.title}"`);
        resolve(normalised);
      } catch (parseErr) {
        reject(new Error(`Failed to parse yt-dlp output: ${parseErr.message}`));
      }
    });
  });
}

/**
 * Normalises raw yt-dlp JSON into our standard media schema.
 */
function normaliseYtdlpData(raw) {
  // Pick best formats
  const formats = (raw.formats || [])
    .filter((f) => f.url)
    .map((f) => ({
      formatId: f.format_id || 'unknown',
      ext: f.ext || 'mp4',
      quality: f.format_note || f.quality || 'unknown',
      width: f.width || null,
      height: f.height || null,
      filesize: f.filesize || f.filesize_approx || null,
      url: f.url,
      hasVideo: f.vcodec !== 'none',
      hasAudio: f.acodec !== 'none',
    }));

  // yt-dlp sorts from worst to best. We reverse it to be best to worst.
  formats.reverse();

  // Pick the highest quality format that contains BOTH video and audio
  const bestFormat = formats.find((f) => f.hasVideo && f.hasAudio)
    || formats.find((f) => f.hasVideo)
    || formats[0]
    || null;

  return {
    source: EXTRACTION_SOURCE.YTDLP,
    title: raw.title || raw.fulltitle || 'Untitled',
    description: raw.description || '',
    thumbnail: raw.thumbnail || raw.thumbnails?.[0]?.url || '',
    duration: raw.duration || 0,
    uploader: raw.uploader || raw.channel || raw.uploader_id || 'Unknown',
    uploadDate: raw.upload_date || '',
    viewCount: raw.view_count || 0,
    likeCount: raw.like_count || 0,
    // Use the combined format URL. If none exists, fallback to raw.url
    videoUrl: bestFormat?.url || raw.url || '',
    formats: formats.slice(0, 10), // Cap at 10 best formats
    platform: raw.extractor_key || raw.extractor || 'unknown',
    originalUrl: raw.webpage_url || raw.original_url || '',
  };
}

module.exports = { extractWithYtdlp };
