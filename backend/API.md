# SniperThink API Documentation

This document describes the implemented backend APIs for both assignment parts:

- Part 1 integration endpoint: interest capture
- Part 2 system: distributed file processing with queue and worker

## Base URL

- Local server: `http://localhost:5000`
- API prefix: `/api`
- Core API base: `http://localhost:5000/api`

## System Overview

The backend currently provides two flows:

1. **Interest submission flow (Part 1):** frontend sends user details when user clicks "I'm Interested".
2. **File processing flow (Part 2):** file upload creates an async queue job, worker processes file, client polls status and retrieves result.

## Technology Stack

- Node.js + Express
- Prisma + PostgreSQL
- BullMQ + Redis
- Multer for file uploads

## Authentication

No authentication is currently implemented.

## Conventions

- IDs are UUID strings.
- Job statuses:
  - `pending`
  - `processing`
  - `completed`
  - `failed`
- Job progress is an integer percentage from `0` to `100`.

---

## 1) Submit Interest (Part 1)

Captures user intent from the interactive strategy flow section.

- **Endpoint:** `POST /api/interest`
- **Content-Type:** `application/json`

### Request Body

| Field | Type   | Required | Description            |
| ----- | ------ | -------- | ---------------------- |
| name  | string | Yes      | User's name            |
| email | string | Yes      | User's email           |
| step  | string | Yes      | Selected strategy step |

### Example Request

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "step": "Step 2 - Audience Insights"
}
```

### Success Response

- **Status:** `200 OK`

```json
{
  "success": true,
  "message": "Interest submitted successfully",
  "data": {
    "id": "dcf866cb-3af1-4f3f-81ff-2f5ea7fce8fe",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "step": "Step 2 - Audience Insights",
    "createdAt": "2026-03-15T11:22:33.000Z"
  }
}
```

### Error Responses

- **Status:** `400 Bad Request`

```json
{
  "error": "Missing required fields"
}
```

- **Status:** `500 Internal Server Error`

```json
{
  "error": "<error message>"
}
```

---

## 2) Upload File

Uploads file metadata and creates an async processing job.

- **Endpoint:** `POST /api/upload`
- **Content-Type:** `multipart/form-data`

### Request Fields

| Field | Type | Required | Description                       |
| ----- | ---- | -------- | --------------------------------- |
| name  | text | Yes      | User name                         |
| email | text | Yes      | User email (unique user identity) |
| file  | file | Yes      | TXT or PDF file, max 10 MB        |

### Success Response

- **Status:** `200 OK`

```json
{
  "success": true,
  "jobId": "f2b56a36-2dd1-4cf8-a28b-65d8f18f7ad2"
}
```

### Error Responses

- **Status:** `400 Bad Request`

```json
{
  "error": "File required"
}
```

- **Status:** `500 Internal Server Error`

```json
{
  "error": "<error message>"
}
```

### What Happens Internally

1. API validates uploaded file.
2. API creates or finds user by email.
3. API stores file metadata.
4. API creates job with `pending` status.
5. API pushes job to Redis queue.

---

## 3) Get Job Status

Returns current job status and progress.

- **Endpoint:** `GET /api/jobs/:id`
- **Path Param:** `id` = job UUID

### Success Response

- **Status:** `200 OK`

```json
{
  "jobId": "f2b56a36-2dd1-4cf8-a28b-65d8f18f7ad2",
  "status": "processing",
  "progress": 70
}
```

### Error Responses

- **Status:** `404 Not Found`

```json
{
  "error": "Job not found"
}
```

- **Status:** `500 Internal Server Error`

```json
{
  "error": "<error message>"
}
```

---

## 4) Get Processed Result

Returns processed analytics when job completes.

- **Endpoint:** `GET /api/results/:id`
- **Path Param:** `id` = job UUID

### Success Response

- **Status:** `200 OK`

```json
{
  "jobId": "f2b56a36-2dd1-4cf8-a28b-65d8f18f7ad2",
  "wordCount": 1200,
  "paragraphCount": 35,
  "topKeywords": ["system", "data", "process", "queue", "worker"]
}
```

### Error Responses

- **Status:** `404 Not Found`

```json
{
  "message": "Result not ready yet"
}
```

- **Status:** `500 Internal Server Error`

```json
{
  "error": "<error message>"
}
```

---

## Utility Endpoints

These are helper routes for local verification.

### Queue Check

- **Endpoint:** `GET /test-queue`
- **Purpose:** confirms queue connectivity by adding a test job

### Database Check

- **Endpoint:** `GET /test-db`
- **Purpose:** confirms database connectivity by reading users

---

## Queue and Worker Design

### Queue Configuration

- Queue name: `file-processing`
- Retry attempts: `3`
- Backoff: exponential, delay `5000ms`
- Remove completed jobs: `true`
- Keep failed jobs: `true`

### Worker Behavior

- Worker queue: `file-processing`
- Concurrency: `5`
- Progress updates:
  - Starts at `processing` with `progress = 10`
  - Mid-processing sets `progress = 70`
  - Completion sets `status = completed`, `progress = 100`
  - Failure sets `status = failed`

### File Processing Logic

1. Read file content.
2. Calculate word count.
3. Calculate paragraph count.
4. Extract top 5 keywords by frequency.
5. Save result in database.

---

## Database Entities

### User

- `id`, `name`, `email`, `createdAt`

### File

- `id`, `userId`, `filePath`, `uploadedAt`

### Job

- `id`, `fileId`, `status`, `progress`, `createdAt`

### Result

- `id`, `jobId`, `wordCount`, `paragraphCount`, `keywords`

### Interest

- `id`, `name`, `email`, `step`, `createdAt`

---

## End-to-End Processing Flow

### Interest Flow (Part 1)

1. User clicks I'm Interested in frontend.
2. Frontend sends `name`, `email`, and `step` to `POST /api/interest`.
3. Backend validates required fields.
4. Backend stores the record in `Interest` table.
5. Frontend displays success or error feedback.

### File Processing Flow (Part 2)

1. Client uploads file through `POST /api/upload`.
2. Backend stores user and file metadata.
3. Backend creates a `pending` job and pushes it to queue.
4. Worker consumes job and processes file asynchronously.
5. Worker saves result and marks job complete.
6. Client polls `GET /api/jobs/:id` for progress.
7. Client fetches final output from `GET /api/results/:id`.

---

## Postman Testing Evidence

This section contains actual API testing data captured from Postman.

### 1) Upload File

- **Action:** `POST http://localhost:5000/api/upload`
- **Request Type:** `multipart/form-data`

#### Form Data

- `name` (text): `John`
- `email` (text): `john@gmail.com`
- `file` (file): `REACT JS.txt`

#### Response

```json
{
  "success": true,
  "jobId": "d3dbe06d-4400-478c-a97d-6cc876223848"
}
```

### 2) Get Job

- **Action:** `GET http://localhost:5000/api/jobs/d3dbe06d-4400-478c-a97d-6cc876223848`

#### Response

```json
{
  "jobId": "d3dbe06d-4400-478c-a97d-6cc876223848",
  "status": "completed",
  "progress": 100
}
```

### 3) Get Result

- **Action:** `GET http://localhost:5000/api/results/20869667-62ec-48bc-ac38-26c3f180bce9`

#### Response

```json
{
  "jobId": "20869667-62ec-48bc-ac38-26c3f180bce9",
  "wordCount": 248,
  "paragraphCount": 22,
  "topKeywords": ["", "we", "coupon", "in", "the"]
}
```

### 4) Submit Interest

- **Action:** `POST http://localhost:5000/api/interest`
- **Request Type:** `application/json`

#### Request Body

```json
{
  "name": "Saad",
  "email": "saad@test.com",
  "step": "Processing"
}
```

#### Response

```json
{
  "success": true,
  "message": "Interest submitted successfully",
  "data": {
    "id": "08842208-2ac0-4616-b4f1-c7f3ab3b03a0",
    "name": "Saad",
    "email": "saad@test.com",
    "step": "Processing",
    "createdAt": "2026-03-15T06:03:47.780Z"
  }
}
```
