import type { NewsItem } from "@/lib/mock-data";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "are",
  "was",
  "were",
  "will",
  "has",
  "have",
  "its",
  "but",
  "not",
  "you",
  "your",
  "our",
  "in",
  "on",
  "at",
  "by",
  "of",
  "a",
  "an",
  "to",
  "is",
]);

export function extractKeywords(items: NewsItem[], topN = 6): string[] {
  const freq = new Map<string, number>();

  for (const item of items) {
    const text = `${item.headline} ${item.summary}`.toLowerCase();
    // remove punctuation
    const cleaned = text.replace(/[.,()/\-:;"'?!\[\]]/g, " ");
    for (const token of cleaned.split(/\s+/)) {
      if (!token) continue;
      if (token.length < 4) continue; // skip short words
      if (/^\d+$/.test(token)) continue;
      if (STOPWORDS.has(token)) continue;
      freq.set(token, (freq.get(token) ?? 0) + 1);
    }
  }

  const entries = Array.from(freq.entries());
  entries.sort((a, b) => b[1] - a[1]);
  return entries.slice(0, topN).map((e) => e[0]);
}

// `extractCompanies` was removed — company extraction is not used in current UI.
