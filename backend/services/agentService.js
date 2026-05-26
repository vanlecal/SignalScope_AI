import { getBusinessNews } from "./brightDataService.js";
import { analyzeWithGroq } from "./groqService.js";

export const runBusinessAgent = async (event) => {
  try {

    // 1. Fetch live web/news data
    const liveNews = await getBusinessNews(event);

    // 2. Extract useful snippets
    const organicResults = liveNews.organic || [];

    const summarizedNews = organicResults
      .slice(0, 5)
      .map(
        (item, index) =>
          `${index + 1}. ${item.title} - ${item.description}`
      )
      .join("\n");

    // 3. Send both event + live data into Groq
    const aiAnalysis = await analyzeWithGroq(
      event,
      summarizedNews
    );

    return {
      event,
      live_news: organicResults.slice(0, 5),
      ai_analysis: aiAnalysis
    };

  } catch (error) {
    console.log("Agent Error:", error.message);

    throw error;
  }
};