const { Worker } = require('bullmq');
const { createRedisConnection } = require('../config/redis');
const { QUEUE_NAME, QUEUE_CONCURRENCY } = require('../config/constants');
const { extractMedia } = require('../services/extractionService');
const { logger } = require('../utils/logger');
require('dotenv').config();

logger.info(`⚙️  Starting Worker Process - Concurrency: ${QUEUE_CONCURRENCY}`);

const connection = createRedisConnection();

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { url, platform } = job.data;
    logger.info(`🔄  Processing Job ${job.id} | Platform: ${platform}`);

    try {
      // 1. We pass the job reference to update progress (optional, but good for UI)
      await job.updateProgress(10);

      // 2. Extract media
      const mediaData = await extractMedia(url, platform);
      
      await job.updateProgress(90);

      // 3. Return the result which BullMQ stores in job.returnvalue
      return mediaData;
    } catch (error) {
      logger.error(`❌  Job ${job.id} Failed: ${error.message}`);
      // Throwing error marks the job as 'failed' in BullMQ
      throw error;
    }
  },
  {
    connection,
    concurrency: QUEUE_CONCURRENCY,
    lockDuration: 30000, 
  }
);

worker.on('completed', (job) => {
  logger.info(`✅  Job ${job.id} Completed successfully`);
});

worker.on('failed', (job, err) => {
  logger.info(`🛑  Job ${job?.id} Failed permanently: ${err.message}`);
});

worker.on('error', (err) => {
  logger.error('Worker error:', err);
});

// Process-Level Safety
process.on('unhandledRejection', (reason) => {
  logger.error('Worker Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Worker Uncaught Exception:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down worker...');
  await worker.close();
  process.exit(0);
});
