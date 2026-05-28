import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import analysisRoutes from "./routes/analysisRoutes.js";
import liveFeedRoutes from "./routes/liveFeedRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SignalScope AI Backend Running");
});

// app.use("/api/analysis", analysisRoutes);
app.use("/api/live-feed", liveFeedRoutes);
app.use("/api/agent", agentRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
