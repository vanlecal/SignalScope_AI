import { fetchBusinessNews }
from "../services/brightDataService.js";

export const getLiveFeed = async (req, res) => {

  try {

    const news =
      await fetchBusinessNews();

    res.status(200).json({
      success: true,
      news
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};