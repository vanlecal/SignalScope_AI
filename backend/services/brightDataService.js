import axios from "axios";

export const fetchBusinessNews = async () => {

  try {

    const response = await axios.post(
      "https://api.brightdata.com/request",

      {
        zone: process.env.BRIGHTDATA_SERP_ZONE,

        url: "https://www.google.com/search?q=latest+global+business+news&brd_json=1",

        format: "json",

        method: "GET",

        country: "us"
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

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

        method: "GET",

        country: "us"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse the body string into JSON
    const parsedBody = JSON.parse(response.data.body);

    console.log("Parsed Bright Data:", parsedBody);

    // Return only the news array
    return parsedBody.news || [];

  } catch (error) {
    console.log(
      "Bright Data Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};