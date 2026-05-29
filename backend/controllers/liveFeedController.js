import { fetchBusinessNews } from "../services/brightDataService.js";

const LIVE_FEED_CACHE = new Map();
const LIVE_FEED_CACHE_TTL_MS = 2 * 60 * 1000;

export const getLiveFeed = async (req, res) => {
  try {
    const category =
      typeof req.query.category === "string" ? req.query.category : "All";

    const cached = getCachedLiveFeed(category);
    if (cached) {
      return res.status(200).json(cached);
    }

    const news = await fetchBusinessNews(category);

    const payload = {
      success: true,
      news,
      category,
    };

    setCachedLiveFeed(category, payload);

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

function getCachedLiveFeed(category) {
  const cached = LIVE_FEED_CACHE.get(category);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    LIVE_FEED_CACHE.delete(category);
    return null;
  }

  return cached.payload;
}

function setCachedLiveFeed(category, payload) {
  LIVE_FEED_CACHE.set(category, {
    payload,
    expiresAt: Date.now() + LIVE_FEED_CACHE_TTL_MS,
  });
}
