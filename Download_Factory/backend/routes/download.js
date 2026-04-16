const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

// POST /api/download/extract
// Body: { url: '...' }
// Returns: { jobId, status }
router.post('/extract', downloadController.extract);

// GET /api/download/status/:jobId
// Returns: { status, media?, progress? }
router.get('/status/:jobId', downloadController.status);

module.exports = router;
