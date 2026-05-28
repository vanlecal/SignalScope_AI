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

// IP whitelist: read up to three allowed IPs from environment variables.
// If none are provided, the server remains open (useful for local dev).
const allowedIps = [
  process.env.ALLOWED_IP_1,
  process.env.ALLOWED_IP_2,
  process.env.ALLOWED_IP_3,
]
  .filter(Boolean)
  .flatMap((s) => expandAllowedIp(s.trim()));

if (allowedIps.length > 0) {
  console.log("IP whitelist enabled. Allowed IPs:", allowedIps);
} else {
  console.log(
    "IP whitelist is empty. Server will reject all requests until ALLOWED_IP_1..3 are configured in .env",
  );
}

// Middleware to strictly allow only configured IPs. If none configured, block all requests.
app.use((req, res, next) => {
  // Respect X-Forwarded-For if present (proxies/load balancers)
  const xff = (req.headers["x-forwarded-for"] || "")
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const remote =
    xff[0] ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip;
  const clientIp = normalizeClientIp(remote);

  // Only allow if the client IP exactly matches one of the configured allowed IPs
  if (allowedIps.length > 0 && allowedIps.includes(clientIp)) {
    return next();
  }

  console.warn(`Blocked request from disallowed or missing IP: ${clientIp}`);
  res.status(403).json({ success: false, error: "Forbidden: IP not allowed" });
});

function normalizeClientIp(value) {
  const raw = (value || "").toString().trim();

  if (!raw) {
    return "";
  }

  if (raw === "::1" || raw === "127.0.0.1" || raw === "localhost") {
    return "127.0.0.1";
  }

  return raw.replace(/^::ffff:/, "");
}

function expandAllowedIp(value) {
  const normalized = normalizeClientIp(value);

  if (!normalized) {
    return [];
  }

  if (normalized === "127.0.0.1") {
    return ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
  }

  return [normalized];
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
