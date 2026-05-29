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

// IP allowlist settings are left in .env for reference, but access is open to all clients.
const configuredIps = [
  process.env.ALLOWED_IP_1,
  process.env.ALLOWED_IP_2,
  process.env.ALLOWED_IP_3,
].filter(Boolean);

if (configuredIps.length > 0) {
  console.log(
    "IP allowlist entries detected in .env, but they are not enforced:",
    configuredIps,
  );
} else {
  console.log(
    "No IP allowlist entries configured. Server accepts requests from all IPs.",
  );
}

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
