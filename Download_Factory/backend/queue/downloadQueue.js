const { v4: uuidv4 } = require('uuid');
const { extractMedia } = require('../services/extractionService');
const { JOB_STATUS } = require('../config/constants');
const { logger } = require('../utils/logger');

/**
 * In-memory job store — replaces BullMQ/Redis for local development.
 * Jobs are processed immediately in the background (no external dependencies).
 *
 * Jobs expire from memory after JOB_TTL_MS to prevent memory leaks.
 */

const JOB_TTL_MS = 30 * 60 * 1000; // 30 minutes
const jobs = new Map();

// Periodic cleanup of old jobs
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (now - job.createdAt > JOB_TTL_MS) {
      jobs.delete(id);
    }
  }
}, 5 * 60 * 1000); // Run cleanup every 5 minutes

/**
 * Add a download job and begin processing it immediately in the background.
 *
 * @param {object} jobData — { url, platform }
 * @returns {{ id: string }}
 */
async function addDownloadJob(jobData) {
  const id = uuidv4();

  const job = {
    id,
    data: jobData,
    status: JOB_STATUS.QUEUED,
    progress: 0,
    returnvalue: null,
    failedReason: null,
    createdAt: Date.now(),
  };

  jobs.set(id, job);
  logger.info(`📥  Job ${id} added to in-memory queue for ${jobData.platform}: ${jobData.url}`);

  // Process in the background (non-blocking)
  processJob(job);

  return job;
}

/**
 * Internal — processes a single job asynchronously.
 */
async function processJob(job) {
  try {
    job.status = JOB_STATUS.PROCESSING;
    job.progress = 10;

    logger.info(`🔄  Processing Job ${job.id} | Platform: ${job.data.platform}`);

    const mediaData = await extractMedia(job.data.url, job.data.platform);

    job.progress = 100;
    job.status = JOB_STATUS.COMPLETED;
    job.returnvalue = mediaData;

    logger.info(`✅  Job ${job.id} Completed successfully`);
  } catch (error) {
    job.status = JOB_STATUS.FAILED;
    job.failedReason = error.message || 'Unknown extraction failure';
    logger.error(`❌  Job ${job.id} Failed: ${error.message}`);
  }
}

/**
 * Retrieve a job by ID.
 *
 * Returns an object with a getState() method to keep the controller API compatible.
 *
 * @param {string} jobId
 * @returns {object|null}
 */
async function getJob(jobId) {
  const job = jobs.get(jobId);
  if (!job) return null;

  // Return a BullMQ-compatible shim so the controller doesn't need changes
  return {
    id: job.id,
    progress: job.progress,
    returnvalue: job.returnvalue,
    failedReason: job.failedReason,
    getState: async () => {
      if (job.status === JOB_STATUS.COMPLETED) return 'completed';
      if (job.status === JOB_STATUS.FAILED) return 'failed';
      return 'active';
    },
  };
}

module.exports = { addDownloadJob, getJob };
