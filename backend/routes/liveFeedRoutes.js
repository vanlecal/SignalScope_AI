import express from "express";

import {
  getLiveFeed
} from "../controllers/liveFeedController.js";

const router = express.Router();

router.get("/news", getLiveFeed);

export default router;