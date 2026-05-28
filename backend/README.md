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
POST http://localhost:5000/api/agent/analyze
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
      "affected_industries": ["Technology", "Artificial Intelligence"],
      "affected_companies": ["NVIDIA", "Huawei"],
      "severity_level": "Moderate",
      "opportunities": ["Potential growth in global CPU market"],
      "risks": ["Increased competition"],
      "short_reasoning": "NVIDIA faces increasing pressure in the China AI chip market."
    }
  }
}
```

```
GET http://localhost:5000/api/live-feed/news
```

### Response Example

```json
{
  "success": true,
  "news": [
    {
      "title": "Why fintech infrastructure is the next frontier for global business payments",
      "link": "https://techfundingnews.com/why-fintech-infrastructure-is-the-next-frontier-for-global-business-payments/",
      "source": "Tech Funding News",
      "source_logo": null,
      "description": "Explore the role of fintech in simplifying international payments and enhancing financial tracking across multiple currencies.",
      "date": "2 hours ago",
      "image": null,
      "global_rank": 1
    },
    {
      "title": "Donald Trump attempts to ease global financial market panic via Truth Social post",
      "link": "https://www.abc.net.au/news/2026-03-03/global-stock-markets-tumble-middle-east-war/106412262",
      "source": "Australian Broadcasting Corporation",
      "source_logo": null,
      "description": "Donald Trump has posted on Truth Social the US navy is prepared to start escorting oil and gas tankers through the Strait of Hormuz in an...",
      "date": "3 Mar 2026",
      "image": null,
      "global_rank": 2
    },
    {
      "title": "Top 50 English-language news sites in the world in April: Just three newsbrands grow traffic in past month",
      "link": "https://pressgazette.co.uk/media-audience-and-business-data/media_metrics/most-popular-websites-news-world-monthly-2/",
      "source": "Press Gazette",
      "source_logo": null,
      "description": "Press Gazette lists the top 50 most popular news websites in the world. Monthly updated top 50 listing based on data provided by SimilarWeb.",
      "date": "3 weeks ago",
      "image": null,
      "global_rank": 3
    },
    {
      "title": "2026 News items - Middle East conflict weighs further on slowing trade outlook",
      "link": "https://www.wto.org/english/news_e/news26_e/stat_19mar26_329_e.htm",
      "source": "World Trade Organization",
      "source_logo": null,
      "description": "World trade is set to slow in 2026 following stronger than expected growth in 2025 on the back of surging trade in AI-enabling products.",
      "date": "19 Mar 2026",
      "image": null,
      "global_rank": 4
    },
    {
      "title": "Stock markets stumble as global trade faces more Trump tariff uncertainty",
      "link": "https://www.theguardian.com/us-news/2026/feb/23/stock-markets-stumble-global-trade-trump-tariff-uncertaintytariff-uncertainty",
      "source": "The Guardian",
      "source_logo": null,
      "description": "US president's international trade war spooks investors, with drops in US share prices after European losses.",
      "date": "23 Feb 2026",
      "image": null,
      "global_rank": 5
    },
    {
      "title": "Discover this week's must-read finance stories",
      "link": "https://www.weforum.org/stories/2026/04/imf-downgrades-global-growth-and-other-finance-news-to-know/",
      "source": "The World Economic Forum",
      "source_logo": null,
      "description": "After a year dominated by trade and uncertainty shocks, the global economy is now facing a major new test from war in the Middle East,...",
      "date": "1 month ago",
      "image": null,
      "global_rank": 6
    },
    {
      "title": "Reforming global trade rules key to supporting developing economies",
      "link": "https://unctad.org/news/reforming-global-trade-rules-key-supporting-developing-economies",
      "source": "UN Trade and Development (UNCTAD)",
      "source_logo": null,
      "description": "The rules governing global trade are under increasing strain, raising questions about whether the international trading system can continue...",
      "date": "17 Mar 2026",
      "image": null,
      "global_rank": 7
    },
    {
      "title": "How fraud became a global business at scale",
      "link": "https://www.ftm.eu/articles/how-fraud-became-a-global-business-at-scale",
      "source": "Follow the Money - Platform for investigative journalism",
      "source_logo": null,
      "description": "Dear readers,. As Donald Trump plunges the Middle East – and the global economy – into chaos (it seems that Qatar's gift of a luxury plane...",
      "date": "25 Mar 2026",
      "image": null,
      "global_rank": 8
    },
    {
      "title": "Why global stocks keep heading into orbit",
      "link": "https://www.abc.net.au/news/2026-04-18/why-the-stock-market-is-surging-and-ignoring-the-economy/106573058",
      "source": "Australian Broadcasting Corporation",
      "source_logo": null,
      "description": "Nothing, it seems, can dent the almost inexplicable optimism coursing through financial markets. Where once, years ago, stock markets would...",
      "date": "1 month ago",
      "image": null,
      "global_rank": 9
    },
    {
      "title": "10 trends shaping global trade in 2026",
      "link": "https://unctad.org/news/10-trends-shaping-global-trade-2026",
      "source": "UN Trade and Development (UNCTAD)",
      "source_logo": null,
      "description": "Slower growth, rising protectionism and structural shifts in value chains, services and regulation are redefining trade flows, creating new...",
      "date": "15 Jan 2026",
      "image": null,
      "global_rank": 10
    }
  ]
}
```

---

# Trusted News Sources

The backend filters out suspicious or low-quality domains and only accepts articles from trusted publishers [CURENTLY DISABLED].

Current whitelist includes:

```js
const TRUSTED_SOURCES = [
  "Reuters",
  "CNBC",
  "Bloomberg",
  "WSJ",
  "Financial Times",
  "TechCrunch",
  "The Verge",
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
