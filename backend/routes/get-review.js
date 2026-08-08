const aiService = require("../src/services/ai.service");
const express = require("express");
const router = express.Router();

// Route
router.post("/get-review", async (req, res) => {
  const { code, language, focus } = req.body;

  if (!code) {
    return res.status(400).send("Code is required");
  }

  try {
    const reviewResult = await aiService(code, language, focus);
    
    // Parse the result to ensure it is valid JSON
    try {
      const parsedReview = JSON.parse(reviewResult);
      res.json(parsedReview);
    } catch (parseError) {
      console.warn("Gemini output was not valid JSON, returning raw text:", parseError);
      res.json({
        language: language || "auto",
        scores: { quality: 50, security: 50, performance: 50, readability: 50 },
        summary: "Review completed, but response format was raw text.",
        issues: [],
        fixedCode: code,
        improvements: ["Unable to parse AI improvements structured data."],
        testCases: "// Test cases generation failed due to format error.",
        rawMarkdown: reviewResult
      });
    }
  } catch (error) {
    console.error("Error getting review:", error);
    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
      return res.status(429).send("Gemini API Rate Limit / Daily Quota Exceeded. Please wait a minute and retry.");
    }
    res.status(500).send("Error generating review.");
  }
});

module.exports = router;

