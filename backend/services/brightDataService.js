// import axios from "axios";

// export const fetchBusinessNews = async () => {

//   try {

//     const response = await axios.post(
//       "https://api.brightdata.com/request",

//       {
//         zone: process.env.BRIGHTDATA_SERP_ZONE,

//         url: "https://www.google.com/search?q=latest+global+business+news&brd_json=1",

//         format: "json",

//         method: "GET",

//         country: "us"
//       },

//       {
//         headers: {
//           Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return response.data;

//   } catch (error) {

//     console.error(
//       "Bright Data Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// export const getBusinessNews = async (event) => {
//   try {
//     const encodedQuery = encodeURIComponent(event);

//     const response = await axios.post(
//       "https://api.brightdata.com/request",
//       {
//         zone: process.env.BRIGHTDATA_ZONE,

//         url: `https://www.google.com/search?q=${encodedQuery}&tbm=nws&brd_json=1`,

//         format: "json",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Parse the body string into JSON
//     const parsed = JSON.parse(response.data.body);

//     console.log("Parsed Bright Data:", parsed);

//     return parsed.news || [];

//   } catch (error) {

//     console.log(
//       "Bright Data Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

import axios from "axios";

import { normalizeImage } from "../utils/newsSanitizer.js";

const IMAGE_RESOLUTION_CACHE = new Map();
const IMAGE_RESOLUTION_TTL_MS = 30 * 60 * 1000;
const IMAGE_RESOLUTION_TIMEOUT_MS = 2500;

const CATEGORY_ALIASES = {
  macro: "Macro",
  "macro / rates": "Macro",
  rates: "Macro",
  tech: "Tech",
  "ai / tech": "Tech",
  energy: "Energy",
};

export const fetchBusinessNews = async (category = "All") => {
  try {
    const normalizedCategory = normalizeCategory(category);
    const searchQuery = buildSearchQuery(normalizedCategory);

    const response = await axios.post(
      "https://api.brightdata.com/request",

      {
        zone: process.env.BRIGHTDATA_SERP_ZONE,

        url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=nws&brd_json=1`,

        format: "json",

        method: "GET",

        country: "us",
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Parse Bright Data body
    const parsed = JSON.parse(response.data.body);

    // console.log("Parsed Bright Data:", parsed);

    // Return category-focused items, while still normalizing images
    const cleanedNews = (parsed.news || [])
      .filter((article) => article && article.title && article.link)
      .map((article) => mapFeedArticle(article, normalizedCategory));

    await Promise.all(
      cleanedNews.map((article) => hydrateArticleImage(article)),
    );

    return cleanedNews;
  } catch (error) {
    console.error("Bright Data Error:", error.response?.data || error.message);

    throw error;
  }
};

function normalizeCategory(category) {
  const normalized = String(category ?? "All")
    .trim()
    .toLowerCase();

  if (!normalized || normalized === "all") {
    return "All";
  }

  return CATEGORY_ALIASES[normalized] ?? "All";
}

function buildSearchQuery(category) {
  switch (category) {
    case "Macro":
      return "latest macroeconomics news fed rates inflation treasury yields";
    case "Tech":
      return "latest technology news AI semiconductor software cloud";
    case "Energy":
      return "latest energy news oil gas opec crude market";
    default:
      return "latest global business news";
  }
}

function classifyArticle(article) {
  const haystack =
    `${article.source ?? ""} ${article.title ?? ""} ${article.description ?? ""}`.toLowerCase();

  if (
    haystack.includes("oil") ||
    haystack.includes("energy") ||
    haystack.includes("gas") ||
    haystack.includes("brent") ||
    haystack.includes("opec") ||
    haystack.includes("crude") ||
    haystack.includes("bpd")
  ) {
    return "Energy";
  }

  if (
    haystack.includes("fed") ||
    haystack.includes("rates") ||
    haystack.includes("inflation") ||
    haystack.includes("pce") ||
    haystack.includes("treasury") ||
    haystack.includes("yield") ||
    haystack.includes("macro")
  ) {
    return "Macro";
  }

  if (
    haystack.includes("ai") ||
    haystack.includes("tech") ||
    haystack.includes("nvidia") ||
    haystack.includes("openai") ||
    haystack.includes("chip") ||
    haystack.includes("software") ||
    haystack.includes("cloud")
  ) {
    return "Tech";
  }

  return "Tech";
}

export const getBusinessNews = async (event) => {
  try {
    const encodedQuery = encodeURIComponent(event);

    const response = await axios.post(
      "https://api.brightdata.com/request",
      {
        zone: process.env.BRIGHTDATA_ZONE,

        url: `https://www.google.com/search?q=${encodedQuery}&tbm=nws&brd_json=1`,

        format: "json",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Parse Bright Data response
    const parsed = JSON.parse(response.data.body);

    const trustedSources = [
      "CNBC",
      "Reuters",
      "Bloomberg",
      "WSJ",
      "Financial Times",
      "TechCrunch",
      "The Verge",
      "BBC",
      "Yahoo Finance",
    ];

    // Get raw news
    const rawNews = parsed.news || [];

    // Filter + clean
    const cleanedNews = rawNews
      .filter((article) => {
        const source = article.source?.toLowerCase() || "";

        return trustedSources.some((trusted) =>
          source.includes(trusted.toLowerCase()),
        );
      })
      .map((article) => mapAnalysisArticle(article));

    await Promise.all(
      cleanedNews.map((article) => hydrateArticleImage(article)),
    );

    console.log("Cleaned News:", cleanedNews);

    return cleanedNews;
  } catch (error) {
    console.log("Bright Data Error:", error.response?.data || error.message);

    throw error;
  }
};

function mapFeedArticle(article, normalizedCategory) {
  return {
    title: article.title,
    link: article.link,
    source: article.source,
    source_logo: normalizeImage(article.source_logo),
    description: article.description,
    date: article.date,
    image:
      normalizeImage(article.image) ||
      normalizeImage(article.image_link) ||
      normalizeImage(article.source_logo),
    rank: article.rank,
    global_rank: article.global_rank,
    category:
      normalizedCategory === "All"
        ? classifyArticle(article)
        : normalizedCategory,
  };
}

function mapAnalysisArticle(article) {
  return {
    title: article.title,
    link: article.link,
    source: article.source,
    description: article.description,
    date: article.date,
    image:
      normalizeImage(article.image_link) ||
      normalizeImage(article.image) ||
      null,
  };
}

async function hydrateArticleImage(article) {
  if (normalizeImage(article.image)) {
    return article;
  }

  const cachedImage = getCachedImage(article.link);
  if (cachedImage) {
    article.image = cachedImage;
    return article;
  }

  const resolvedImage = await resolvePreviewImage(article.link);
  if (resolvedImage) {
    article.image = resolvedImage;
    setCachedImage(article.link, resolvedImage);
  }

  return article;
}

function getCachedImage(link) {
  const cached = IMAGE_RESOLUTION_CACHE.get(link);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    IMAGE_RESOLUTION_CACHE.delete(link);
    return null;
  }

  return cached.image;
}

function setCachedImage(link, image) {
  IMAGE_RESOLUTION_CACHE.set(link, {
    image,
    expiresAt: Date.now() + IMAGE_RESOLUTION_TTL_MS,
  });
}

async function resolvePreviewImage(link) {
  if (!link) {
    return null;
  }

  try {
    const response = await axios.get(link, {
      timeout: IMAGE_RESOLUTION_TIMEOUT_MS,
      responseType: "text",
      maxContentLength: 200_000,
      maxBodyLength: 200_000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const html = typeof response.data === "string" ? response.data : "";
    return extractPreviewImageFromHtml(html, link);
  } catch {
    return null;
  }
}

function extractPreviewImageFromHtml(html, pageUrl) {
  if (!html) {
    return null;
  }

  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return normalizeResolvedImageUrl(match[1], pageUrl);
    }
  }

  return null;
}

function normalizeResolvedImageUrl(candidate, pageUrl) {
  if (!candidate) {
    return null;
  }

  const trimmed = candidate.trim();

  if (!trimmed || trimmed.startsWith("data:image")) {
    return null;
  }

  try {
    return new URL(trimmed, pageUrl).toString();
  } catch {
    return normalizeImage(trimmed);
  }
}
