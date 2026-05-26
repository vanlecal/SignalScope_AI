import express from "express";

import {
  analyzeBusinessEvent
} from "../controllers/agentController.js";

const router = express.Router();

router.post(
  "/analyze",
  analyzeBusinessEvent
);

export default router;