import type { NewsItem } from "@/lib/mock-data";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

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

export async function fetchLiveNews(): Promise<NewsItem[]> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/live-feed/news`);

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
    category: inferCategory(source, article.title),
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
