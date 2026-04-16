const { URL_PATTERNS, PLATFORMS } = require('../config/constants');

/**
 * Validates and classifies a media URL.
 *
 * @param {string} url — raw URL string from the user
 * @returns {{ valid: boolean, platform: string, sanitizedUrl: string, error?: string }}
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, platform: PLATFORMS.UNKNOWN, sanitizedUrl: '', error: 'URL is required' };
  }

  const trimmed = url.trim();

  // Basic URL format check
  try {
    new URL(trimmed);
  } catch {
    return { valid: false, platform: PLATFORMS.UNKNOWN, sanitizedUrl: trimmed, error: 'Invalid URL format' };
  }

  // Must be HTTPS (or HTTP)
  if (!/^https?:\/\//i.test(trimmed)) {
    return { valid: false, platform: PLATFORMS.UNKNOWN, sanitizedUrl: trimmed, error: 'URL must start with http:// or https://' };
  }

  // Check Instagram patterns
  for (const pattern of URL_PATTERNS.INSTAGRAM) {
    if (pattern.test(trimmed)) {
      return { valid: true, platform: PLATFORMS.INSTAGRAM, sanitizedUrl: trimmed };
    }
  }

  // Check Facebook patterns
  for (const pattern of URL_PATTERNS.FACEBOOK) {
    if (pattern.test(trimmed)) {
      return { valid: true, platform: PLATFORMS.FACEBOOK, sanitizedUrl: trimmed };
    }
  }

  // Broad fallback — allow anything from instagram.com or facebook.com
  if (/instagram\.com/i.test(trimmed)) {
    return { valid: true, platform: PLATFORMS.INSTAGRAM, sanitizedUrl: trimmed };
  }
  if (/facebook\.com|fb\.watch/i.test(trimmed)) {
    return { valid: true, platform: PLATFORMS.FACEBOOK, sanitizedUrl: trimmed };
  }

  return {
    valid: false,
    platform: PLATFORMS.UNKNOWN,
    sanitizedUrl: trimmed,
    error: 'URL must be from Instagram or Facebook. Supported: posts, reels, videos.',
  };
}

module.exports = { validateUrl };
