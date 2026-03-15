import prisma from "../config/prisma.js";
import { fileQueue } from "../config/queue.js";

export const uploadFile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File required" });
    }

    // create user if not exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name, email },
      });
    }

    // store file record
    const fileRecord = await prisma.file.create({
      data: {
        userId: user.id,
        filePath: req.file.path,
      },
    });

    // create job
    const job = await prisma.job.create({
      data: {
        fileId: fileRecord.id,
        status: "pending",
      },
    });

    // push job to queue
    await fileQueue.add("process-file", {
      jobId: job.id,
      filePath: req.file.path,
    });

    res.json({
      success: true,
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
