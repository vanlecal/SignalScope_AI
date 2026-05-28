export type NewsItem = {
  id: string;
  source: string;
  sourceColor: string;
  headline: string;
  summary: string;
  time: string;
  category: string;
  sentiment: "bullish" | "bearish" | "neutral";
  severity: "low" | "moderate" | "high";
  industries: string[];
  companies: string[];
  opportunities: string[];
  risks: string[];
  reasoning: string;
  link?: string;
  image?: string | null;
};

export const NEWS: NewsItem[] = [
  {
    id: "1",
    source: "Reuters",
    sourceColor: "#FF8000",
    headline: "NVIDIA unveils next-gen Blackwell AI chips, slashing inference cost by 40%",
    summary:
      "Jensen Huang's keynote reveals a generational leap in AI accelerator efficiency, putting pressure on AMD and Intel as hyperscalers commit billions in pre-orders.",
    time: "2m ago",
    category: "AI Hardware",
    sentiment: "bullish",
    severity: "high",
    industries: ["Semiconductors", "Artificial Intelligence", "Cloud Infrastructure"],
    companies: ["NVIDIA", "AMD", "Intel", "TSMC", "Microsoft"],
    opportunities: [
      "Long NVDA on confirmed hyperscaler demand cycle through FY26",
      "Upstream beneficiaries: TSMC (CoWoS capacity), SK Hynix (HBM3e)",
      "AI infrastructure ETFs likely to outperform broad tech",
    ],
    risks: [
      "AMD MI400 roadmap may compress margins in 2H26",
      "Export-control expansion to China could clip 12-15% revenue",
    ],
    reasoning:
      "Blackwell's 40% inference cost reduction structurally reinforces NVIDIA's CUDA moat. The pre-order book (≈$87B disclosed) front-loads FY26 revenue and crowds out competitor design wins. Treat this as a sector-defining event, not an incremental product cycle.",
  },
  {
    id: "2",
    source: "Bloomberg",
    sourceColor: "#FA8500",
    headline: "Fed signals two more rate cuts in 2026 as core PCE eases to 2.1%",
    summary:
      "Powell strikes dovish tone in Jackson Hole follow-up, citing labor market normalization. Two-year yields plunge 18bps; risk assets rally globally.",
    time: "14m ago",
    category: "Macro / Rates",
    sentiment: "bullish",
    severity: "high",
    industries: ["Banking", "Real Estate", "Growth Tech"],
    companies: ["JPMorgan", "Goldman Sachs", "Blackstone"],
    opportunities: [
      "Duration trade: long 10Y treasuries before pricing-in completes",
      "Small-caps (Russell 2000) historically lead in cutting cycles",
    ],
    risks: [
      "Sticky services inflation could force a hawkish pivot",
      "Dollar weakness pressures USD-denominated EM debt holders",
    ],
    reasoning:
      "A confirmed cutting path with cooling core PCE removes the primary overhang on risk assets. The bond market is already discounting ~55bps of cuts; equities have room to extend the rally, particularly in rate-sensitive sectors.",
  },
  {
    id: "3",
    source: "CNBC",
    sourceColor: "#005594",
    headline: "Tesla recalls 1.2M vehicles over FSD edge-case failure",
    summary:
      "NHTSA-mandated recall covers Model 3 and Y units after autopilot misidentifies emergency vehicles in low-light conditions. OTA fix promised within 30 days.",
    time: "38m ago",
    category: "Auto / EV",
    sentiment: "bearish",
    severity: "moderate",
    industries: ["Electric Vehicles", "Autonomous Driving", "Insurance"],
    companies: ["Tesla", "Mobileye", "Waymo"],
    opportunities: [
      "Mobileye (MBLY) — safety-first ADAS narrative strengthened",
      "Lidar suppliers (LAZR, OUST) regain credibility",
    ],
    risks: [
      "Tesla brand equity erosion ahead of Robotaxi launch",
      "Regulatory tightening could delay FSD v13 wide release",
    ],
    reasoning:
      "OTA-fixable, so financial impact is limited (~$180M). However, the recall undermines Tesla's vision-only thesis at a critical moment for the Robotaxi narrative. Watch for institutional positioning shifts in next 13F filings.",
  },
  {
    id: "4",
    source: "Financial Times",
    sourceColor: "#FFF1E5",
    headline: "Oil surges 6% on OPEC+ surprise 1.5M bpd production cut",
    summary:
      "Saudi-led coalition extends voluntary cuts through Q2 2026, citing demand uncertainty. Brent crude breaks $92/bbl resistance.",
    time: "1h ago",
    category: "Commodities",
    sentiment: "bullish",
    severity: "moderate",
    industries: ["Oil & Gas", "Airlines", "Shipping"],
    companies: ["Saudi Aramco", "ExxonMobil", "Chevron", "Delta Air Lines"],
    opportunities: [
      "Integrated majors (XOM, CVX) — operating leverage above $85/bbl",
      "Oilfield services (SLB, HAL) on capex re-acceleration",
    ],
    risks: [
      "Airline margin compression Q1 2026 (jet fuel +18% YoY)",
      "Inflation reacceleration could delay Fed cuts",
    ],
    reasoning:
      "The cut size exceeded consensus (1.0M bpd expected). Combined with depleted SPR reserves and resilient demand, this sets up a structurally tighter market. Energy sector likely to outperform through Q2.",
  },
  {
    id: "5",
    source: "Wall Street Journal",
    sourceColor: "#0080C3",
    headline: "OpenAI closes $40B funding round at $500B valuation",
    summary:
      "SoftBank leads with $25B; Microsoft re-ups commitment. Largest private capital raise in tech history; secondaries open for early employees.",
    time: "2h ago",
    category: "AI / Private Markets",
    sentiment: "bullish",
    severity: "moderate",
    industries: ["Artificial Intelligence", "Cloud Computing", "Enterprise SaaS"],
    companies: ["OpenAI", "Microsoft", "SoftBank", "NVIDIA"],
    opportunities: [
      "Microsoft (MSFT) — privileged compute economics through 2030",
      "AI infrastructure plays: NVDA, AVGO, VRT continue to benefit",
    ],
    risks: [
      "Valuation discipline concerns in AI private markets",
      "Anthropic / xAI competitive funding response likely",
    ],
    reasoning:
      "The valuation crystallizes OpenAI as the AI category leader and underwrites years of capex. Direction is strongly bullish for the AI supply chain, though late-stage AI valuations are increasingly stretched relative to revenue multiples.",
  },
  {
    id: "6",
    source: "Reuters",
    sourceColor: "#FF8000",
    headline: "EU passes landmark Digital Markets Act amendments targeting AI gatekeepers",
    summary:
      "New rules force interoperability on foundation model APIs; potential €50B+ compliance cost across Big Tech. Effective Q3 2026.",
    time: "3h ago",
    category: "Regulation",
    sentiment: "bearish",
    severity: "moderate",
    industries: ["Big Tech", "AI Platforms", "Cloud Services"],
    companies: ["Google", "Microsoft", "Meta", "Apple"],
    opportunities: [
      "European AI startups gain distribution access",
      "Compliance tech vendors (now, OneTrust analogues)",
    ],
    risks: [
      "Margin compression for hyperscalers in EU revenue",
      "Compliance overhang could delay product launches",
    ],
    reasoning:
      "Implementation timeline (Q3 2026) gives Big Tech runway to adapt, but margin pressure is real. Expect a 1-2% EBIT drag for affected names. Watch for legal challenges that could delay enforcement.",
  },
];

export const MARKET_CARDS = [
  {
    label: "Trending Event",
    value: "NVIDIA Blackwell",
    sub: "Semiconductor breakthrough",
    delta: "+12.4%",
    trend: "up" as const,
    accent: "electric" as const,
  },
  {
    label: "Risk Severity",
    value: "Moderate",
    sub: "Global aggregate index",
    delta: "5.7 / 10",
    trend: "flat" as const,
    accent: "warning" as const,
  },
  {
    label: "Most Mentioned",
    value: "NVIDIA",
    sub: "1,847 mentions / 24h",
    delta: "+318%",
    trend: "up" as const,
    accent: "ai" as const,
  },
  {
    label: "Market Sentiment",
    value: "Bullish",
    sub: "AI-weighted across 14 sectors",
    delta: "+0.62",
    trend: "up" as const,
    accent: "success" as const,
  },
];

export const TICKERS = [
  { sym: "S&P 500", val: "5,847.21", chg: "+0.84%", up: true },
  { sym: "NASDAQ", val: "19,432.67", chg: "+1.42%", up: true },
  { sym: "BTC", val: "$94,210", chg: "+2.18%", up: true },
  { sym: "10Y", val: "4.21%", chg: "-0.08", up: false },
  { sym: "WTI", val: "$87.40", chg: "+5.92%", up: true },
  { sym: "DXY", val: "103.42", chg: "-0.31%", up: false },
  { sym: "VIX", val: "14.67", chg: "-3.10%", up: false },
  { sym: "GOLD", val: "$2,684", chg: "+0.42%", up: true },
];
