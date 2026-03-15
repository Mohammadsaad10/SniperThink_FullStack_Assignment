import { Worker } from "bullmq";
import redis from "../config/redis.js";
import prisma from "../config/prisma.js";
import fs from "fs";

const worker = new Worker(
  "file-processing",
  async (job) => {
    const { jobId, filePath } = job.data;

    try {
      console.log("Processing job:", jobId);
      // update job status -> processing
      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "processing",
          progress: 10,
        },
      });

      // read file
      const content = fs.readFileSync(filePath, "utf-8");

      // word count
      const words = content.split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      // paragraph count
      const paragraphs = content.split(/\n+/).filter(Boolean);
      const paragraphCount = paragraphs.length;

      // keyword frequency
      const freq = {};

      words.forEach((word) => {
        const clean = word.toLowerCase().replace(/[^\w]/g, "");

        if (!freq[clean]) freq[clean] = 0;
        freq[clean]++;
      });

      // get top 5 keywords
      const keywords = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((item) => item[0]);

      // update progress
      await prisma.job.update({
        where: { id: jobId },
        data: {
          progress: 70,
        },
      });

      // store results
      await prisma.result.create({
        data: {
          jobId,
          wordCount,
          paragraphCount,
          keywords,
        },
      });

      // mark job completed
      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "completed",
          progress: 100,
        },
      });

      console.log("Job completed:", jobId);
    } catch (error) {
      console.error("Worker error:", error);

      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "failed",
        },
      });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed:`, err.message);
});

console.log("Worker running...");
