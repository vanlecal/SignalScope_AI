// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import axios from "axios";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("SignalScope AI Backend Running");
// });


// // FAST AND RELIABLE (Access: http://localhost:5000/test-groq)

// app.get("/test-groq", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           {
//             role: "user",
//             content:
//               "Analyze this event: Oil prices rise globally. Which industries are affected?"
//           }
//         ]
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error(error.response?.data || error.message);

//     res.status(500).json({
//       error: error.response?.data || error.message
//     });
//   }
// });


// // Slow But RELIABLE (Access: http://localhost:5000/test-groq)

// app.get("/test-openrouter", async (req, res) => {
//     try {
//       const response = await axios.post(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           model: "openai/gpt-oss-120b:free",
//           messages: [
//             {
//               role: "user",
//               content:
//                 "Analyze this event: The US dollar strengthens globally. Which industries may be affected?"
//             }
//           ]
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//             "Content-Type": "application/json",
//             "HTTP-Referer": "http://localhost:5000",
//             "X-Title": "SignalScope AI"
//           }
//         }
//       );
  
//       res.json(response.data);
  
//     } catch (error) {
//       console.error(error.response?.data || error.message);
  
//       res.status(500).json({
//         error: error.response?.data || error.message
//       });
//     }
//   });

// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });