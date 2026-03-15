import express from "express";
import { getJobStatus, getJobResult } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/jobs/:id", getJobStatus);
router.get("/results/:id", getJobResult);

export default router;
