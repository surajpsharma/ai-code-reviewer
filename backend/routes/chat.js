const express = require("express");
const router = express.Router();
const chatService = require("../src/services/chat.service");

// Protected Route for follow-up chat reviews
router.post("/chat-review", async (req, res) => {
  const { code, reviewContext, messages } = req.body;

  if (!code) {
    return res.status(400).send("Code is required");
  }
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).send("Messages history is required");
  }

  try {
    const chatResult = await chatService(code, reviewContext, messages);
    res.json({ response: chatResult });
  } catch (error) {
    console.error("Error in chat-review:", error);
    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
      return res.status(429).send("Gemini API Rate Limit / Daily Quota Exceeded. Please wait a minute and retry.");
    }
    res.status(500).send("Error generating chat response.");
  }
});

module.exports = router;
