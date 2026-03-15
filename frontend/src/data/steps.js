export const steps = [
  {
    id: 1,
    title: "Capture & Context Intake",
    shortLabel: "Input Layer",
    description:
      "Users upload TXT or PDF files and attach their identity so every submission is traceable and ready for asynchronous processing.",
    outcome:
      "The API validates file constraints, links user metadata, and stores a source record for reliable downstream processing.",
    metric: "Validation + Metadata",
    tags: ["Multer", "File Rules", "User Context"],
  },
  {
    id: 2,
    title: "Queue Orchestration",
    shortLabel: "Dispatch Layer",
    description:
      "Every upload creates a pending job pushed to Redis through BullMQ, separating request handling from heavy processing work.",
    outcome:
      "The queue enables retry policies, controlled backoff, and parallel consumers without blocking user experience.",
    metric: "Retry + Backoff",
    tags: ["BullMQ", "Redis", "Async"],
  },
  {
    id: 3,
    title: "Worker Intelligence",
    shortLabel: "Compute Layer",
    description:
      "Background workers consume jobs concurrently, extract text, compute word/paragraph metrics, and derive frequent keywords.",
    outcome:
      "Progress transitions are persisted while workers process safely in parallel with deterministic completion and failure states.",
    metric: "Concurrency x5",
    tags: ["Workers", "Text Analysis", "Progress"],
  },
  {
    id: 4,
    title: "Insight Delivery",
    shortLabel: "Output Layer",
    description:
      "Clients poll job state in real time and fetch final analytics once processing completes, enabling a smooth feedback loop.",
    outcome:
      "Result endpoints expose structured metrics and keywords, turning raw uploads into actionable output for users.",
    metric: "Status + Results API",
    tags: ["Polling", "Result Retrieval", "UX Feedback"],
  },
];
