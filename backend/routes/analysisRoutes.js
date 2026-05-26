import express from "express";

import {
  analyzeEvent
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/analyze-event", analyzeEvent);

export default router;