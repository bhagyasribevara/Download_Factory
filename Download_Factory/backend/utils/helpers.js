/**
 * General-purpose helpers used across the backend.
 */

/**
 * Async sleep — useful for exponential back-off.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate a string to a max length, appending '…' if cut.
 */
function truncate(str, maxLen = 200) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/**
 * Build a standardised success response.
 */
function successResponse(data, meta = {}) {
  return { success: true, data, ...meta };
}

/**
 * Build a standardised error response.
 */
function errorResponse(message, code = 'UNKNOWN_ERROR', details = null) {
  const res = { success: false, error: { code, message } };
  if (details) res.error.details = details;
  return res;
}

/**
 * Calculate exponential back-off delay with jitter.
 */
function backoffDelay(attempt, baseMs = 1000) {
  const exp = Math.pow(2, attempt) * baseMs;
  const jitter = Math.random() * baseMs;
  return exp + jitter;
}

module.exports = { sleep, truncate, successResponse, errorResponse, backoffDelay };
