import type { NewsItem } from "@/lib/mock-data";
import { extractKeywords } from "@/lib/extractors";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

type BackendArticle = {
  title: string;
  link: string;
  source?: string;
  source_logo?: string | null;
  description?: string;
  date?: string;
  image?: string | null;
  rank?: number;
  global_rank?: number;
  category?: string;
};

type AgentAnalysis = {
  affected_industries?: string[];
  affected_companies?: Array<string | { name?: string }>;
  severity_level?: string;
  opportunities?: string[];
  risks?: string[];
  short_reasoning?: string;
};

type AgentResponse = {
  success: boolean;
  data?: {
    event?: string;
    live_news?: BackendArticle[];
    ai_analysis?: AgentAnalysis;
  };
};

const SOURCE_COLORS = ["#FF8000", "#0080C3", "#005594", "#00C2A8", "#A855F7", "#F97316"];

export type MarketCardData = {
  label: string;
  value: string;
  sub: string;
  delta: string;
  trend: "up" | "flat" | "down";
  accent: "electric" | "ai" | "success" | "warning";
};

export type TickerData = {
  sym: string;
  val: string;
  chg: string;
  up: boolean;
};

export type DashboardMetrics = {
  headline: string;
  description: string;
  cards: MarketCardData[];
  tickers: TickerData[];
  liveCount: number;
  sourceCount: number;
  keywords?: string[];
};

export async function fetchLiveNews(category = "All"): Promise<NewsItem[]> {
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.set("category", category);
  }

  const query = params.toString();
  const requestUrl = `${BACKEND_BASE_URL}/api/live-feed/news${query ? "?" + query : ""}`;
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`Live feed request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { success?: boolean; news?: BackendArticle[] };
  const articles = payload.news ?? [];

  return articles.map((article, index) => mapArticleToNewsItem(article, index));
}

export async function analyzeEvent(event: string): Promise<AgentAnalysis> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/agent/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event }),
  });

  if (!response.ok) {
    throw new Error(`Analysis request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AgentResponse;
  return payload.data?.ai_analysis ?? {};
}

export function applyAnalysisToItem(item: NewsItem, analysis: AgentAnalysis): NewsItem {
  const companies = (analysis.affected_companies ?? [])
    .map((company) => {
      if (typeof company === "string") {
        return company;
      }

      return company.name?.trim() ?? "";
    })
    .filter(Boolean);

  return {
    ...item,
    industries: analysis.affected_industries ?? item.industries,
    companies: companies.length > 0 ? companies : item.companies,
    severity: mapSeverity(analysis.severity_level) ?? item.severity,
    opportunities: analysis.opportunities ?? item.opportunities,
    risks: analysis.risks ?? item.risks,
    reasoning: analysis.short_reasoning ?? item.reasoning,
  };
}

export function deriveDashboardMetrics(items: NewsItem[]): DashboardMetrics {
  const liveCount = items.length;
  const sourceCounts = countBy(items.map((item) => item.source));
  const categoryCounts = countBy(items.map((item) => item.category));
  const severityCounts = countBy(items.map((item) => item.severity));
  const sentimentCounts = countBy(items.map((item) => item.sentiment));

  const topSource = pickTopEntry(sourceCounts) ?? "Live feed";
  const topCategory = pickTopEntry(categoryCounts) ?? "Market overview";
  const sourceCount = Object.keys(sourceCounts).length;

  const bullishCount = sentimentCounts.bullish ?? 0;
  const bearishCount = sentimentCounts.bearish ?? 0;
  const neutralCount = sentimentCounts.neutral ?? 0;
  const severityIndex =
    (severityCounts.high ?? 0) * 3 + (severityCounts.moderate ?? 0) * 2 + (severityCounts.low ?? 0);
  const severityScore = liveCount > 0 ? Math.min(10, Math.max(0, severityIndex / liveCount)) : 0;
  const bullishShare = liveCount > 0 ? Math.round((bullishCount / liveCount) * 100) : 0;
  const bearishShare = liveCount > 0 ? Math.round((bearishCount / liveCount) * 100) : 0;
  const neutralShare = liveCount > 0 ? Math.round((neutralCount / liveCount) * 100) : 0;

  const topSourceShare =
    liveCount > 0 ? Math.round(((sourceCounts[topSource] ?? 0) / liveCount) * 100) : 0;

  const keywords = extractKeywords(items, 5);

  const cards: MarketCardData[] = [
    {
      label: "Trending Event",
      value: topCategory,
      sub: `${liveCount} live headlines tracked`,
      delta: liveCount > 0 ? `+${liveCount}` : "0",
      trend: liveCount > 0 ? "up" : "flat",
      accent: "electric",
    },
    {
      label: "Risk Severity",
      value: severityScore > 7 ? "High" : severityScore > 4 ? "Moderate" : "Low",
      sub: `${severityScore.toFixed(1)} / 10 aggregate score`,
      delta: severityScore > 0 ? `${severityScore.toFixed(1)}` : "0",
      trend: severityScore > 4 ? "up" : "flat",
      accent: severityScore > 7 ? "warning" : "success",
    },
    {
      label: "Most Mentioned",
      value: topSource,
      sub: `${sourceCount} unique sources`,
      delta: liveCount > 0 ? `${topSourceShare}%` : "0%",
      trend: "up",
      accent: "ai",
    },
    {
      label: "Market Sentiment",
      value:
        bullishCount > bearishCount
          ? "Bullish"
          : bearishCount > bullishCount
            ? "Bearish"
            : "Neutral",
      sub: `${bullishShare}% bullish · ${bearishShare}% bearish · ${neutralShare}% neutral`,
      delta:
        bullishCount > bearishCount
          ? `+${bullishShare}`
          : bearishCount > bullishCount
            ? `-${bearishShare}`
            : "0",
      trend: bullishCount > bearishCount ? "up" : bearishCount > bullishCount ? "down" : "flat",
      accent:
        bullishCount > bullishCount
          ? "success"
          : bearishCount > bullishCount
            ? "warning"
            : "electric",
    },
  ];

  // Top Companies card removed — not needed in the current UI

  const tickers: TickerData[] = [
    {
      sym: "LIVE",
      val: `${liveCount}`,
      chg: `${liveCount > 0 ? "Active" : "Idle"}`,
      up: liveCount > 0,
    },
    {
      sym: "SOURCES",
      val: `${sourceCount}`,
      chg: `${sourceCount > 0 ? "Tracked" : "None"}`,
      up: sourceCount > 0,
    },
    {
      sym: "BULLISH",
      val: `${bullishShare}%`,
      chg: `+${bullishCount}`,
      up: bullishCount >= bearishCount,
    },
    { sym: "BEARISH", val: `${bearishShare}%`, chg: `-${bearishCount}`, up: false },
    { sym: "TOP", val: topSource, chg: topCategory, up: true },
    {
      sym: "MIX",
      val: `${bullishShare}/${bearishShare}`,
      chg: `${neutralShare}% neutral`,
      up: bullishCount >= bearishCount,
    },
  ];

  return {
    headline: topCategory,
    description:
      liveCount > 0
        ? `Tracking ${liveCount} live headlines across ${sourceCount} sources. ${topSource} is currently leading the feed.`
        : "Waiting for live headlines to populate the market summary.",
    cards,
    tickers,
    keywords,
    liveCount,
    sourceCount,
  };
}

function mapArticleToNewsItem(article: BackendArticle, index: number): NewsItem {
  const source = article.source?.trim() || "Live Source";
  const text = `${article.title} ${article.description ?? ""}`.toLowerCase();
  const mood = inferMood(text);

  return {
    id: article.link || `${source}-${index}`,
    source,
    sourceColor: pickSourceColor(source, index),
    headline: article.title,
    summary: article.description || article.title,
    time: article.date || "Just now",
    category: article.category ?? inferCategory(source, article.title),
    sentiment: mood.sentiment,
    severity: mood.severity,
    industries: [],
    companies: [],
    opportunities: [],
    risks: [],
    reasoning: "Live analysis will load after selection.",
    link: article.link,
    image: article.image ?? null,
  };
}

function inferCategory(source: string, title: string): string {
  const haystack = `${source} ${title}`.toLowerCase();

  if (
    haystack.includes("ai") ||
    haystack.includes("nvidia") ||
    haystack.includes("openai") ||
    haystack.includes("chip")
  ) {
    return "AI / Tech";
  }

  if (haystack.includes("oil") || haystack.includes("energy") || haystack.includes("gas")) {
    return "Energy";
  }

  if (haystack.includes("fed") || haystack.includes("rates") || haystack.includes("inflation")) {
    return "Macro / Rates";
  }

  if (haystack.includes("trade") || haystack.includes("tariff") || haystack.includes("policy")) {
    return "Policy / Trade";
  }

  return source;
}

function inferMood(text: string): {
  sentiment: NewsItem["sentiment"];
  severity: NewsItem["severity"];
} {
  const positiveHits = [
    "surge",
    "rally",
    "beat",
    "beats",
    "growth",
    "record",
    "funding",
    "approval",
    "cut",
  ];
  const negativeHits = [
    "recall",
    "lawsuit",
    "drop",
    "falls",
    "fall",
    "probe",
    "tariff",
    "warning",
    "loss",
    "cuts",
  ];

  const positiveScore = positiveHits.reduce(
    (score, keyword) => score + (text.includes(keyword) ? 1 : 0),
    0,
  );
  const negativeScore = negativeHits.reduce(
    (score, keyword) => score + (text.includes(keyword) ? 1 : 0),
    0,
  );

  if (positiveScore > negativeScore) {
    return { sentiment: "bullish", severity: "moderate" };
  }

  if (negativeScore > positiveScore) {
    return { sentiment: "bearish", severity: "moderate" };
  }

  return { sentiment: "neutral", severity: "low" };
}

function pickSourceColor(source: string, index: number): string {
  const normalized = source.toLowerCase();
  const preset = SOURCE_COLOR_MAP[normalized];

  if (preset) {
    return preset;
  }

  return SOURCE_COLORS[index % SOURCE_COLORS.length];
}

function mapSeverity(severityLevel?: string): NewsItem["severity"] | null {
  const normalized = severityLevel?.toLowerCase() ?? "";

  if (normalized.includes("high")) {
    return "high";
  }

  if (normalized.includes("moderate") || normalized.includes("medium")) {
    return "moderate";
  }

  if (normalized.includes("low")) {
    return "low";
  }

  return null;
}

function countBy(values: Array<string | undefined>): Record<string, number> {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    const key = value?.trim() || "Unknown";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

function pickTopEntry(counts: Record<string, number>): string | null {
  const entries = Object.entries(counts);

  if (entries.length === 0) {
    return null;
  }

  entries.sort((a, b) => b[1] - a[1]);

  return entries[0][0];
}

const SOURCE_COLOR_MAP: Record<string, string> = {
  reuters: "#FF8000",
  bloomberg: "#FA8500",
  cnbc: "#005594",
  "financial times": "#FFF1E5",
  "wall street journal": "#0080C3",
  wsj: "#0080C3",
  bbc: "#B80000",
  "yahoo finance": "#6D28D9",
  techcrunch: "#0EA5A4",
  "the verge": "#A855F7",
};
