import express from "express";
import { submitInterest } from "../controllers/interest.controller.js";

const router = express.Router();

router.post("/interest", submitInterest);

export default router;
