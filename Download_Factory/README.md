# Download Factory 🚀

A production-grade Instagram and Facebook media downloader system using Node.js, Express, BullMQ, Redis, and React.

## 🏗️ Architecture

- **Frontend**: React (Vite) + Framer Motion + Lucide Icons + Vanilla CSS (Premium Cosmic Theme).
- **Backend API**: Node.js & Express (Validation, Job Queuing, Non-blocking).
- **Queue System**: BullMQ + Redis (Concurrency, Retries, Exponential Backoff).
- **Worker Engine**: Extraction pipeline using `yt-dlp` with a Cheerio scraper fallback.

## 🛠️ Prerequisites

1.  **Node.js**: v18+ recommended.
2.  **Redis**: Required for BullMQ (Download Queue).
3.  **yt-dlp**: Must be installed and available in your system PATH.

## 🚀 Getting Started

### 1. Prerequisites Check

Ensure Redis is running:
```bash
# On Windows, start your Redis server (e.g., Memurai or Redis-on-WSL)
redis-cli ping # Should return PONG
```

Ensure yt-dlp is installed:
```bash
yt-dlp --version
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev:all  # Starts both API and Queue Worker concurrently
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Starts Vite on http://localhost:3000
```

## 🛡️ Key Features

- **Non-blocking API**: Requests are offloaded to a background queue instantly.
- **Self-Healing Extraction**: If `yt-dlp` fails (rate limits/updates), the system automatically falls back to a raw HTML scraper.
- **Anti-Block**: Rotates User-Agents and implements request delays.
- **Premium UI**: Dark mode, cosmic animations, and real-time polling for job status.
- **Fail-Safe**: Never crashes on errors; always returns structured JSON responses.
