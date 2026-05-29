# AI-Powered Financial News Monitoring Backend

Backend API for an AI-driven financial and business news monitoring platform built for the **Web Data UNLOCKED Hackathon**.  
The system fetches live business news using Bright Data SERP APIs, filters trusted sources, and generates AI-powered impact analysis for frontend consumption.

---

## Features

- Live financial & business news search
- Trusted-source filtering
- AI-generated market impact analysis
- Clean REST API architecture
- Bright Data SERP integration
- Express.js backend
- Axios-based external API handling
- Environment variable security

---

# Current MVP Scope

The backend currently focuses on:

## News Aggregation

Fetches real-time news related to:

- Companies
- Markets
- AI
- Finance
- Global business events

## Trusted Source Filtering

Only allows articles from reliable publishers such as:

- Reuters
- CNBC
- Bloomberg
- WSJ
- Financial Times
- TechCrunch
- The Verge

## AI Analysis

Returns:

- Affected industries
- Affected companies
- Opportunities
- Risks
- Severity level
- Short reasoning summary

## Optimized for Frontend Integration

Frontend receives:

- Lightweight JSON responses
- Article links
- Metadata
- Clean image URLs or `null`

---

# Tech Stack

## Backend

- Node.js
- Express.js

## APIs & Services

- Bright Data SERP API
- Bright Web Unlocker API
- GROQ

## Utilities

- Axios
- dotenv
- nodemon

---

# Project Structure

````bash
backend/
├── controllers/       # Handles API request logic
│   ├── agentController.js
│   ├── analysisController.js
│   └── liveFeedController.js
├── routes/            # Defines API routes
│   ├── agentRoutes.js
│   ├── analysisRoutes.js
│   └── liveFeedRoutes.js
├── services/          # Contains business logic and external API integrations
│   ├── agentService.js
│   ├── brightDataService.js
│   └── groqService.js
├── utils/             # Utility functions
│   └── newsSanitizer.js
├── Test/              # Test files
│   └── mcpTest.js
# SignalScope AI — Backend

This repository contains the backend for SignalScope AI: a small Express-based service that
aggregates live business/news data (via Bright Data), normalizes and filters results, and
returns AI-driven impact analysis (via Groq) for use by the frontend.

The README below documents how to run the service, required environment variables, exposed
endpoints, and implementation notes.

---

## Highlights

- Lightweight REST API using Express (ESM)
- Integrates Bright Data SERP + Web Unlocker for live news scraping
- Uses Groq Chat Completions to produce structured JSON analyses
- Simple caching for live-feed and resolved preview images
- Designed for frontend consumption (small JSON payloads)

---

## Quick Start

1. Install dependencies

```bash
cd backend
npm install
````

2. Create a `.env` file (see Environment Variables section)

3. Run in development

```bash
npm run dev
# (uses nodemon)
```

4. Production

```bash
# set environment variables, then:
node server.js
```

The server listens on the port set in `PORT` (defaults to `5000` in development).

---

## Environment Variables

Required for full functionality:

- `BRIGHTDATA_API_KEY` — Bright Data API key for SERP/Web Unlocker requests
- `BRIGHTDATA_ZONE` — Bright Data zone used for article page resolution requests
- `BRIGHTDATA_SERP_ZONE` — Bright Data zone used for SERP requests
- `GROQ_API_KEY` — API key for Groq chat completions
- `PORT` — server port (default: `5000`)

Optional / informational:

- `ALLOWED_IP_1`, `ALLOWED_IP_2`, `ALLOWED_IP_3` — legacy allowlist values read from `.env`; currently the server does not enforce an IP allowlist but logs any configured entries.

Note: Keep keys secret. Do not commit `.env` to version control.

---

## API Endpoints

All endpoints are prefixed with `/api`.

1. GET /api/live-feed/news

- Description: Returns a category-filtered list of normalized news items. Results are cached in-memory for a short TTL (default 2 minutes).
- Query params:
  - `category` (optional) — e.g., `Tech`, `Macro`, `Energy`, `All` (default `All`)

Example:

```bash
curl "http://localhost:5000/api/live-feed/news?category=Tech"
```

Response (200):

```json
{
  "success": true,
  "news": [
    {
      "title": "...",
      "link": "https://...",
      "source": "Reuters",
      "description": "...",
      "date": "...",
      "image": null,
      "global_rank": 1
    }
  ]
}
```

2. POST /api/agent/analyze

- Description: Given a short business event description, the agent fetches related live news
  (via Bright Data), summarizes the top results, and calls Groq to return structured analysis.
- Body (JSON): `{ "event": "<short event description>" }`

Example:

```bash
curl -X POST http://localhost:5000/api/agent/analyze \
  -H "Content-Type: application/json" \
  -d '{"event":"NVIDIA announces new AI chip"}'
```

Response (200):

```json
{
  "success": true,
  "data": {
    "event": "NVIDIA announces new AI chip",
    "live_news": [
      /* array of up to 5 news items */
    ],
    "ai_analysis": {
      "affected_industries": [],
      "affected_companies": [],
      "severity_level": "",
      "opportunities": [],
      "risks": [],
      "short_reasoning": ""
    }
  }
}
```

Notes:

- The `ai_analysis` JSON is produced by Groq and parsed into an object before being returned.

---

## Implementation Notes

- Bright Data integration: `backend/services/brightDataService.js` posts to Bright Data's request endpoint to fetch SERP results and optionally resolve article preview images when a direct URL is unavailable.
- Image handling: preview images are normalized by `backend/utils/newsSanitizer.js`. Base64 or invalid images are discarded and returned as `null` to the frontend.
- Caching: `backend/controllers/liveFeedController.js` caches live-feed responses per-category for 2 minutes to reduce Bright Data calls. Additionally, resolved preview images are cached in-memory for a short TTL.
- Groq: `backend/services/groqService.js` calls Groq's chat completions endpoint (`model: "llama-3.3-70b-versatile"`) and expects a JSON object response. The service strips optional code fences and parses the JSON.

Security & Operational Notes

- The server previously included logic to enforce an IP allowlist read from `ALLOWED_IP_*` variables. That enforcement was removed: the server will accept requests from any client by default but logs configured `ALLOWED_IP_*` entries if present. If you require strict IP allowlisting, re-enable or add middleware to validate `req.ip` against configured values.

---

## Troubleshooting

- Bright Data errors: verify `BRIGHTDATA_API_KEY`, `BRIGHTDATA_ZONE`, and `BRIGHTDATA_SERP_ZONE` are correct and the zones are active.
- Groq errors: ensure `GROQ_API_KEY` is set and has available quota.
- Unexpected or empty news arrays: Bright Data SERP responses vary by query. Try changing `category` or event text.

Logs: the server prints a small startup message indicating whether `ALLOWED_IP_*` entries were detected (informational only).

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request with tests or a short description of changes

---

## License

See the repository `LICENSE` file for license details.

---

If you'd like, I can also add a short OpenAPI-style spec for the two main endpoints or add example Postman requests.
{
