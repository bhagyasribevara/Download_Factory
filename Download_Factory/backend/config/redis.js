const IORedis = require('ioredis');
const { logger } = require('../utils/logger');

/**
 * Creates a resilient Redis connection with automatic reconnection.
 * BullMQ requires IORedis — we configure maxRetriesPerRequest: null
 * as required by BullMQ for blocking commands.
 */
function createRedisConnection() {
  const connection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,        // Required by BullMQ
    enableReadyCheck: true,
    retryStrategy(times) {
      const delay = Math.min(times * 500, 5000);
      logger.warn(`Redis reconnecting — attempt ${times}, delay ${delay}ms`);
      return delay;
    },
    reconnectOnError(err) {
      const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
      return targetErrors.some((e) => err.message.includes(e));
    },
  });

  connection.on('connect', () => logger.info('✅  Redis connected'));
  connection.on('error', (err) => logger.error('Redis error:', err.message));
  connection.on('close', () => logger.warn('Redis connection closed'));

  return connection;
}

module.exports = { createRedisConnection };
