const express = require("express");
const cors = require("cors");
const { scrapeGoogleShopping } = require("./scraper");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const results = await scrapeGoogleShopping(query);
  res.json({ results });
});

// Start the server locally (not needed for Vercel)
if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

module.exports = app;
