const aiService = require("../src/services/ai.service");
const express = require("express");
const router = express.Router();

// Route
router.post("/get-review", async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).send("Code is required");
  }

  try {
    const reviewResult = await aiService(code);
    res.json(reviewResult);
  } catch (error) {
    console.error("Error getting review:", error);
    res.status(500).send("Error generating review.");
  }
});

module.exports = router;
