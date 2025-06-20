const aiService = require("../src/services/ai.service");
const express = require("express");
const router = express.Router();
router.post("/get-review", (req, res) => {
  console.log("Received code:", req.body.code);

  const code = req.body.code;
  if (code == "") {
    return res.send("Prompt is required");
  }
  const getReview = async () => {
    const response = await aiService(code);

    res.send(response);
  };
  getReview();
});

module.exports = router;
