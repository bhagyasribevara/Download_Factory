const { validateUrl } = require('../services/urlValidator');
const { addDownloadJob, getJob } = require('../queue/downloadQueue');
const { successResponse, errorResponse } = require('../utils/helpers');
const { JOB_STATUS } = require('../config/constants');
const { logger } = require('../utils/logger');

/**
 * Initiates the download process by validating the URL and pushing a job to the queue.
 * Responds immediately with the Job ID. Non-blocking.
 */
async function extract(req, res) {
  try {
    const { url } = req.body;

    // 1. Validation
    const validationResult = validateUrl(url);
    if (!validationResult.valid) {
      return res.status(400).json(errorResponse(validationResult.error, 'INVALID_URL'));
    }

    // 2. Add to Queue
    const jobData = {
      url: validationResult.sanitizedUrl,
      platform: validationResult.platform,
    };
    
    const job = await addDownloadJob(jobData);

    // 3. Return Job ID instantly
    return res.status(202).json(successResponse({
      jobId: job.id,
      platform: jobData.platform,
      status: JOB_STATUS.QUEUED,
      message: 'Job added to queue. Poll /status/:jobId for updates.',
    }));

  } catch (error) {
    logger.error('Error in extract controller:', error);
    return res.status(500).json(errorResponse('Failed to initialize download queue', 'QUEUE_ERROR'));
  }
}

/**
 * Poll this endpoint to get the status of a download job.
 * Returns the extracted metadata if completed.
 */
async function status(req, res) {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json(errorResponse('Job ID is required', 'MISSING_JOB_ID'));
    }

    const job = await getJob(jobId);

    if (!job) {
      return res.status(404).json(errorResponse('Job not found or has expired', 'JOB_NOT_FOUND'));
    }

    const state = await job.getState();

    if (state === 'completed') {
      return res.json(successResponse({
        status: JOB_STATUS.COMPLETED,
        media: job.returnvalue
      }));
    }

    if (state === 'failed') {
      return res.status(500).json(errorResponse(job.failedReason || 'Extraction failed', 'EXTRACTION_ERROR', { status: JOB_STATUS.FAILED }));
    }

    // Pending, waiting, active, etc.
    return res.json(successResponse({
      jobId: job.id,
      status: JOB_STATUS.PROCESSING,
      progress: job.progress || 0,
    }));

  } catch (error) {
    logger.error(`Error checking status for job ${req.params?.jobId}:`, error);
    return res.status(500).json(errorResponse('Failed to retrieve job status', 'INTERNAL_ERROR'));
  }
}

module.exports = { extract, status };
