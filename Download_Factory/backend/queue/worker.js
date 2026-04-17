/**
 * Worker is now embedded in the in-memory queue (downloadQueue.js).
 * This file is kept as a no-op for backward compatibility with npm scripts.
 * Jobs are processed automatically when added — no separate worker process needed.
 */

const { logger } = require('../utils/logger');
require('dotenv').config();

logger.info('ℹ️  Worker mode is disabled — jobs are processed in-process via the in-memory queue.');
logger.info('ℹ️  No Redis or external queue dependency is required.');
