require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { logger } = require('./utils/logger');
const downloadRoutes = require('./routes/download');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5001;

/* ── Middleware ────────────────────────────────────────────── */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Rate Limiting ────────────────────────────────────────── */
app.use('/api/', apiLimiter);

/* ── Routes ───────────────────────────────────────────────── */
app.use('/api/download', downloadRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ── 404 ──────────────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ── Global Error Handler ─────────────────────────────────── */
app.use(errorHandler);

/* ── Process-Level Safety ─────────────────────────────────── */
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Stay alive — never crash in production
});

/* ── Start ────────────────────────────────────────────────── */
app.listen(PORT, () => {
  logger.info(`🚀  API server listening on http://localhost:${PORT}`);
  logger.info(`📡  Accepting requests from ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
