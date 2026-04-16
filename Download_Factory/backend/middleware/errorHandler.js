const { logger } = require('../utils/logger');

/**
 * Global Express error handler.
 * Catches ALL unhandled errors — the server NEVER crashes.
 */
function errorHandler(err, _req, res, _next) {
  logger.error('Global error handler caught:', err);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Build safe response — never leak stack traces in production
  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { errorHandler };
