const { Queue } = require('bullmq');
const { createRedisConnection } = require('../config/redis');
const { QUEUE_NAME } = require('../config/constants');
const { logger } = require('../utils/logger');

let downloadQueue = null;

/**
 * Lazily initialise the BullMQ queue.
 * Returns the singleton queue instance.
 */
function getQueue() {
  if (!downloadQueue) {
    const connection = createRedisConnection();
    downloadQueue = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 3600, count: 200 },   // Keep last 200 / 1 hr
        removeOnFail: { age: 7200, count: 100 },       // Keep last 100 / 2 hr
        attempts: 1,                                     // Worker handles its own retries
      },
    });

    downloadQueue.on('error', (err) => {
      logger.error('Queue error:', err.message);
    });

    logger.info('📦  BullMQ queue initialised');
  }
  return downloadQueue;
}

/**
 * Add a download job to the queue.
 *
 * @param {object} jobData — { url, platform }
 * @returns {Promise<import('bullmq').Job>}
 */
async function addDownloadJob(jobData) {
  const queue = getQueue();
  const job = await queue.add('extract-media', jobData, {
    priority: 1,
  });
  logger.info(`📥  Job ${job.id} added to queue for ${jobData.platform}: ${jobData.url}`);
  return job;
}

/**
 * Retrieve a job by ID.
 *
 * @param {string} jobId
 * @returns {Promise<import('bullmq').Job|null>}
 */
async function getJob(jobId) {
  const queue = getQueue();
  return queue.getJob(jobId);
}

module.exports = { getQueue, addDownloadJob, getJob };
