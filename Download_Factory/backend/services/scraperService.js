const axios = require('axios');
const cheerio = require('cheerio');
const { TIMEOUT_MS, EXTRACTION_SOURCE } = require('../config/constants');
const { getRandomUserAgent } = require('../utils/userAgents');
const { logger } = require('../utils/logger');

/**
 * Fallback scraper — fetches the page HTML and extracts OpenGraph tags.
 * Used when yt-dlp fails completely.
 *
 * Extracts: og:video, og:image, og:title, og:description
 *
 * @param {string} url — the media URL
 * @returns {Promise<object>} — normalised media data
 */
async function extractWithScraper(url) {
  logger.info(`[scraper] Fallback scraping: ${url}`);

  const userAgent = getRandomUserAgent();

  let html;
  try {
    const response = await axios.get(url, {
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    html = response.data;

    if (response.status === 403) {
      throw new Error('Access denied (403) — content may be private');
    }
    if (response.status === 429) {
      throw new Error('Rate limited (429) — too many requests');
    }
    if (response.status >= 400) {
      throw new Error(`HTTP ${response.status} — request failed`);
    }
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('Scraper request timed out');
    }
    throw err;
  }

  if (!html || typeof html !== 'string') {
    throw new Error('Scraper received empty or non-HTML response');
  }

  // Parse with Cheerio
  const $ = cheerio.load(html);

  const ogVideo = $('meta[property="og:video"]').attr('content')
    || $('meta[property="og:video:url"]').attr('content')
    || $('meta[property="og:video:secure_url"]').attr('content')
    || '';

  const ogImage = $('meta[property="og:image"]').attr('content')
    || $('meta[property="og:image:url"]').attr('content')
    || '';

  const ogTitle = $('meta[property="og:title"]').attr('content')
    || $('title').text()
    || 'Untitled';

  const ogDescription = $('meta[property="og:description"]').attr('content')
    || $('meta[name="description"]').attr('content')
    || '';

  const ogType = $('meta[property="og:type"]').attr('content') || '';
  const ogSiteName = $('meta[property="og:site_name"]').attr('content') || '';

  // Try to find video URLs in page source (embedded players)
  let embeddedVideoUrl = ogVideo;
  if (!embeddedVideoUrl) {
    // Scan for video src inside HTML
    const videoSrc = $('video source').attr('src') || $('video').attr('src') || '';
    if (videoSrc) embeddedVideoUrl = videoSrc;
  }

  if (!embeddedVideoUrl && !ogImage) {
    throw new Error('Scraper could not find any media on this page');
  }

  const result = {
    source: EXTRACTION_SOURCE.SCRAPER,
    title: ogTitle.trim(),
    description: ogDescription.trim(),
    thumbnail: ogImage,
    duration: 0,
    uploader: ogSiteName || 'Unknown',
    uploadDate: '',
    viewCount: 0,
    likeCount: 0,
    videoUrl: embeddedVideoUrl,
    formats: embeddedVideoUrl
      ? [{ formatId: 'og', ext: 'mp4', quality: 'default', url: embeddedVideoUrl, hasVideo: true, hasAudio: true }]
      : [],
    platform: ogSiteName.toLowerCase() || 'unknown',
    originalUrl: url,
  };

  logger.info(`[scraper] ✅ Extracted: "${result.title}" (video: ${!!embeddedVideoUrl})`);
  return result;
}

module.exports = { extractWithScraper };
