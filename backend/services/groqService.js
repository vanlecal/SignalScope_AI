
// import axios from "axios";

// export const analyzeWithGroq = async (event) => {

//   const prompt = `
// Analyze the following business event.

// Event:
// ${event}

// Return ONLY raw valid JSON.

// Do not use markdown.
// Do not use backticks.
// Do not explain anything.

// Use this exact JSON structure:

// {
//   "affected_industries": [],
//   "affected_companies": [
//     {
//       "name": "",
//       "impact": "",
//       "reason": ""
//     }
//   ],
//   "severity_level": "",
//   "opportunities": [],
//   "risks": [],
//   "short_reasoning": ""
// }

// Rules:
// - impact must be either:
//   "Positive"
//   "Negative"
//   or "Neutral"

// - Include real-world companies when possible.
// `;

//   const response = await axios.post(
//     "https://api.groq.com/openai/v1/chat/completions",
//     {
//       model: "llama-3.3-70b-versatile",

//       messages: [
//         {
//           role: "user",
//           content: prompt
//         }
//       ],

//       temperature: 0.3
//     },

//     {
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   return response.data.choices[0].message.content;
// };




// import axios from "axios";

// export const analyzeWithGroq = async (
//   event,
//   liveNews
// ) => {

//   const prompt = `
// You are an AI business intelligence agent.

// EVENT:
// ${event}

// LIVE WEB DATA:
// ${liveNews}

// Analyze the situation and return ONLY valid JSON.

// Required JSON format:

// {
//   "affected_industries": [],
//   "affected_companies": [
//     {
//       "name": "",
//       "impact": "",
//       "reason": ""
//     }
//   ],
//   "severity_level": "",
//   "market_sentiment": "",
//   "opportunities": [],
//   "risks": [],
//   "recommendations": [],
//   "short_reasoning": ""
// }
// `;

//   const response = await axios.post(
//     "https://api.groq.com/openai/v1/chat/completions",
//     {
//       model: "llama-3.3-70b-versatile",

//       messages: [
//         {
//           role: "user",
//           content: prompt
//         }
//       ],

//       temperature: 0.2
//     },

//     {
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   return JSON.parse(
//     response.data.choices[0].message.content
//   );
// };


import axios from "axios";

export const analyzeWithGroq = async (event) => {

  const prompt = `
Analyze the following business event.

Event:
${event}

Return ONLY valid JSON.

Expected structure:
{
  "affected_industries": [],
  "affected_companies": [],
  "severity_level": "",
  "opportunities": [],
  "risks": [],
  "short_reasoning": ""
}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",

    {
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      temperature: 0.2
    },

    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  let content = response.data.choices[0].message.content;

  // Remove markdown code blocks if Groq adds them
  content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(content);
};
