#!/usr/bin/env node

(async () => {
  try {
    if (typeof fetch === "undefined") {
      // Node 18+ should have fetch; if not, fail with a helpful message
      throw new Error(
        "Global fetch is not available in this Node runtime. Please run with Node 18+ or install node-fetch.",
      );
    }

    const res = await fetch("http://localhost:5000/api/live-feed/news");
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(text);
    }
  } catch (err) {
    console.error("Error fetching live feed:", err.message);
    process.exit(1);
  }
})();
