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

```bash
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
├── server.js          # Entry point for the backend server
├── package.json       # Project metadata and dependencies
├── README.md          # Documentation for the backend
├── LICENSE            # License for the project
└── .env               # Environment variables (not included in version control)
```

---

# Installation

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000

QROQ_API_KEY
OPENROUTER_API_KEY  (Optional)
BRIGHTDATA_API_KEY=your_api_key
BRIGHTDATA_ZONE=your_zone_name
BRIGHTDATA_SERP_ZONE=your_serp_zone
```

---

# Running the Server

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

---

# API Endpoints

## Get Live Business Feed

### Endpoint

```
POST http://localhost:5000/api/live-feed
```

### Response Example

```json
{
  "success": true,
  "data": {
    "event": "NVIDIA AI chip news",
    "live_news": [
      {
        "title": "Nvidia says its forecast for $200 billion CPU market includes China",
        "link": "https://www.reuters.com/world/china/nvidia-says-its-forecast-200-billion-cpu-market-includes-china-2026-05-23/",
        "source": "Reuters",
        "description": "CEO Jensen Huang aimed to assure investors that it can keep up its growth.",
        "date": "1 day ago",
        "image": null
      }
    ],
    "ai_analysis": {
      "affected_industries": [
        "Technology",
        "Artificial Intelligence"
      ],
      "affected_companies": [
        "NVIDIA",
        "Huawei"
      ],
      "severity_level": "Moderate",
      "opportunities": [
        "Potential growth in global CPU market"
      ],
      "risks": [
        "Increased competition"
      ],
      "short_reasoning": "NVIDIA faces increasing pressure in the China AI chip market."
    }
  }
}
```

---

# Trusted News Sources

The backend filters out suspicious or low-quality domains and only accepts articles from trusted publishers.

Current whitelist includes:

```js
const TRUSTED_SOURCES = [
  "Reuters",
  "CNBC",
  "Bloomberg",
  "WSJ",
  "Financial Times",
  "TechCrunch",
  "The Verge"
];
```

---

# Image Handling

To keep responses lightweight and frontend-friendly:

- Base64 images are removed
- Only valid image URLs are returned
- If no valid image exists, image is returned as:

```json
"image": null
```

---

# Bright Data Integration

This project uses the Bright Data SERP API to scrape live Google News results and Bright Web Unlocker API for handling proxy rotation, anti-bot challenges and CAPTCHA solving

Example query format:

```js
https://www.google.com/search?q=NVIDIA+AI+chip+news&tbm=nws&brd_json=1
```

---

# Future Improvements

After the MVP frontend is completed:

- AI sentiment scoring
- Real-time websocket updates
- User watchlists
- Personalized alerts
- News categorization
- Market trend visualizations
- Authentication system
- News caching layer

---

# MVP Development Philosophy

Current priority is:

1. Finish stable backend MVP
2. Build frontend quickly
3. Connect APIs
4. Prepare working demo
5. Add advanced features later if time permits

This helps avoid overengineering during the hackathon timeline.

---

# Author

Built by Mark Drah for the **Web Data UNLOCKED Hackathon** using:
- Bright Data
- Node.js
- Express.js
- AI-powered analysis workflows