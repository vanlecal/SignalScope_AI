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

import {
  normalizeImage,
  isTrustedSource,
} from "../utils/newsSanitizer.js";



export const fetchBusinessNews = async () => {

  try {

    const response = await axios.post(
      "https://api.brightdata.com/request",

      {
        zone: process.env.BRIGHTDATA_SERP_ZONE,

        url: "https://www.google.com/search?q=latest+global+business+news&tbm=nws&brd_json=1",

        format: "json",

        method: "GET",

        country: "us",
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse Bright Data body
    const parsed = JSON.parse(response.data.body);

    console.log("Parsed Bright Data:", parsed);

    // Clean + filter news
    const cleanedNews = (parsed.news || [])
      .filter((article) => isTrustedSource(article.link))
      .map((article) => ({
        title: article.title,
        link: article.link,
        source: article.source,
        source_logo: normalizeImage(article.source_logo),
        description: article.description,
        date: article.date,
        image: normalizeImage(article.image),
        rank: article.rank,
        global_rank: article.global_rank,
      }));

    return cleanedNews;

  } catch (error) {

    console.error(
      "Bright Data Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};



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
      }
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
      "Yahoo Finance"
    ];

    // Get raw news
    const rawNews = parsed.news || [];

    // Filter + clean
    const cleanedNews = rawNews
    .filter((article) => {
      const source = article.source?.toLowerCase() || "";
    
      return trustedSources.some((trusted) =>
        source.includes(trusted.toLowerCase())
      );
    })
      .map((article) => ({
        title: article.title,
        link: article.link,
        source: article.source,
        description: article.description,
        date: article.date,

        // ONLY return image URL if available
        image: article.image_link || null
      }));

    console.log("Cleaned News:", cleanedNews);

    return cleanedNews;

  } catch (error) {

    console.log(
      "Bright Data Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};