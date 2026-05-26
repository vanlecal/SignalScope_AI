// import { analyzeWithGroq }
// from "../services/groqService.js";

// export const analyzeEvent = async (req, res) => {

//   try {

//     const { event } = req.body;

//     if (!event) {
//       return res.status(400).json({
//         message: "Event is required"
//       });
//     }

//     const analysis =
//       await analyzeWithGroq(event);

//     res.status(200).json({
//       success: true,
//       event,
//       analysis
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       error: error.message
//     });

//   }
// };




import { analyzeWithGroq }
from "../services/groqService.js";

export const analyzeEvent = async (req, res) => {

  try {

    const { event } = req.body;

    if (!event) {
      return res.status(400).json({
        message: "Event is required"
      });
    }

    const analysisText =
      await analyzeWithGroq(event);

    const analysis =
      JSON.parse(analysisText);

    res.status(200).json({
      success: true,
      event,
      analysis
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};