import prisma from "../config/prisma.js";

export const getJobStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getJobResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.result.findUnique({
      where: { jobId: id },
    });

    if (!result) {
      return res.status(404).json({
        message: "Result not ready yet",
      });
    }

    res.json({
      jobId: result.jobId,
      wordCount: result.wordCount,
      paragraphCount: result.paragraphCount,
      topKeywords: result.keywords,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
