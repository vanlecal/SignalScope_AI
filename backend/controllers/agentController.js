import { runBusinessAgent } from "../services/agentService.js";

export const analyzeBusinessEvent = async (
  req,
  res
) => {

  try {

    const { event } = req.body;

    if (!event) {
      return res.status(400).json({
        success: false,
        error: "Event is required"
      });
    }

    const result = await runBusinessAgent(event);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};