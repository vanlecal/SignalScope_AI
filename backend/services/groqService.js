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
//   "severity_level": "",
//   "opportunities": [],
//   "risks": [],
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







import axios from "axios";

export const analyzeWithGroq = async (event) => {

  const prompt = `
Analyze the following business event.

Event:
${event}

Return ONLY raw valid JSON.

Do not use markdown.
Do not use backticks.
Do not explain anything.

Use this exact JSON structure:

{
  "affected_industries": [],
  "affected_companies": [
    {
      "name": "",
      "impact": "",
      "reason": ""
    }
  ],
  "severity_level": "",
  "opportunities": [],
  "risks": [],
  "short_reasoning": ""
}

Rules:
- impact must be either:
  "Positive"
  "Negative"
  or "Neutral"

- Include real-world companies when possible.
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

      temperature: 0.3
    },

    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
};