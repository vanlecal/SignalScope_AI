import { fetchBusinessNews } from "../services/brightDataService.js";

export const getLiveFeed = async (req, res) => {
  try {
    const category =
      typeof req.query.category === "string" ? req.query.category : "All";

    const news = await fetchBusinessNews(category);

    res.status(200).json({
      success: true,
      news,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
