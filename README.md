# SniperThink

SniperThink is a full-stack assignment project with two major flows:

1. Interactive frontend strategy flow + interest capture.
2. Async file-processing pipeline using queue + worker.

## Project Structure

```text
SniperThink/
	backend/   # Express API, Prisma, BullMQ worker
	frontend/  # React + Vite UI
```

## Tech Stack

- Frontend: React, Vite, Tailwind, Framer Motion, Axios
- Backend: Node.js, Express, Prisma, PostgreSQL
- Queue: BullMQ
- Queue transport: Redis (Upstash-compatible URL)

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm 9+
- PostgreSQL running locally or in the cloud
- Redis connection URL (Upstash or local Redis)

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sniperthink
UPSTASH_REDIS_URL=redis://localhost:6379
```

Notes:

- `DATABASE_URL` is required by Prisma and the API server.
- `UPSTASH_REDIS_URL` is required by both API and worker.
- If using Upstash, paste the full URL they provide.

Optional: create `.env` in `frontend/` only if backend is not running on default URL.

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

From project root, install dependencies for both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database Setup (Prisma)

Run from `backend/`:

```bash
npx prisma generate
npx prisma migrate deploy
```

For local development, you can also use:

```bash
npx prisma migrate dev
```

Useful optional command:

```bash
npx prisma studio
```

## Run Project Locally

Use 3 terminals.

### Terminal 1: Start Backend API

```bash
cd backend
npm run dev
```

API runs at:

- `http://localhost:5000`
- API base: `http://localhost:5000/api`

### Terminal 2: Start Worker (Queue Consumer)

```bash
cd backend
npm run worker
```

This process consumes jobs from queue `file-processing` and writes results into PostgreSQL.

### Terminal 3: Start Frontend

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in terminal (usually `http://localhost:5173`).

## Queue / Worker Configuration

Current setup in backend:

- Queue name: `file-processing`
- Retry attempts: `3`
- Backoff: exponential, `5000ms`
- `removeOnComplete: true`
- `removeOnFail: false`
- Worker concurrency: `5`

Processing flow:

1. `POST /api/upload` validates upload and creates DB records.
2. API enqueues job (`process-file`) in Redis.
3. Worker picks job and updates status/progress.
4. Worker computes:
   - `wordCount`
   - `paragraphCount`
   - `topKeywords` (top 5)
5. Worker stores result and marks job complete.

## API Endpoints

Core endpoints:

- `POST /api/interest`
- `POST /api/upload`
- `GET /api/jobs/:id`
- `GET /api/results/:id`

Health helpers:

- `GET /test-queue` (queue connectivity)
- `GET /test-db` (database connectivity)

For request/response examples, see `backend/API.md`.

## Quick Verification Checklist

1. Backend starts without env errors.
2. Worker logs `Worker running...`.
3. Frontend loads and strategy flow opens.
4. Submit interest form -> success response.
5. Upload TXT/PDF (max 10MB) -> receive `jobId`.
6. Poll `/api/jobs/:id` until `completed`.
7. Fetch `/api/results/:id` and confirm analytics output.

## Common Issues

### `DATABASE_URL is not defined`

Add `DATABASE_URL` to `backend/.env` and restart API + worker.

### `UPSTASH_REDIS_URL is not defined`

Add `UPSTASH_REDIS_URL` to `backend/.env` and restart API + worker.

### Jobs stay `pending`

Worker is not running or Redis is unreachable. Start `npm run worker` and recheck Redis URL.

### `Result not ready yet`

Worker has not finished processing. Keep polling `/api/jobs/:id` until `status` is `completed`.

## Notes

- Uploaded files are stored under `backend/src/uploads`.
- Allowed upload types: `.txt`, `.pdf`.
- Maximum file size: 10MB.
