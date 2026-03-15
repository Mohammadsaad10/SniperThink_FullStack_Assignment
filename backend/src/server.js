import express from "express";
import cors from "cors";
import "dotenv/config";
import { fileQueue } from "./config/queue.js";
import prisma from "./config/prisma.js";

import uploadRoutes from "./routes/upload.route.js";
import jobRoutes from "./routes/job.route.js";
import interestRoutes from "./routes/interest.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin.split(",").map((origin) => origin.trim()),
  }),
);
app.use(express.json());

app.use("/api/", uploadRoutes);
app.use("/api/", jobRoutes);
app.use("/api/", interestRoutes);

app.get("/test-queue", async (req, res) => {
  const job = await fileQueue.add("test-job", {
    message: "Queue working",
  });

  res.json({
    success: true,
    jobId: job.id,
  });
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    success: true,
    users,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
