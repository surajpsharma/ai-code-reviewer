const express = require("express");
const router = express.Router();
const dbService = require("../db/dbService");
const authMiddleware = require("../middleware/auth"); // Ensure it's used for protected routes

// =======================
// SAVE REVIEW HISTORY
// =======================
router.post("/save-review-history", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "User not authenticated after token verification." });
  }

  const { code, review, language } = req.body;

  if (!code || !review || !language) {
    return res
      .status(400)
      .json({ error: "Code, review, and language are required." });
  }

  try {
    const reviewString = typeof review === "object" ? JSON.stringify(review) : review;
    
    await dbService.saveReview(userId, code, reviewString, language);

    console.log("Review history saved successfully for user:", userId);
    res.status(201).json({ message: "Review history saved successfully." });
  } catch (error) {
    console.error("Error saving review history:", error);
    res
      .status(500)
      .json({ error: "Server error while saving review history." });
  }
});

// =======================
// GET REVIEW HISTORY
// =======================
router.get("/get-review-history", authMiddleware, async (req, res) => {
  console.log("GET /api/get-review-history route hit!");
  const userId = req.user.id;

  if (!userId) {
    console.error("Error: userId not found after authMiddleware.");
    return res
      .status(401)
      .json({ message: "User not authenticated after token verification." });
  }

  try {
    const parsedHistory = await dbService.getReviewHistory(userId);
    res.status(200).json(parsedHistory);
  } catch (error) {
    console.error("Error fetching review history:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching review history." });
  }
});

// =======================
// DELETE REVIEW HISTORY
// =======================
router.delete(
  "/delete-review-history/:id",
  authMiddleware,
  async (req, res) => {
    const historyId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      console.error("Error: userId not found after authMiddleware.");
      return res
        .status(401)
        .json({ message: "User not authenticated after token verification." });
    }

    try {
      const success = await dbService.deleteReviewHistory(historyId, userId);
      if (!success) {
        return res
          .status(404)
          .json({ message: "History item not found or not authorized." });
      }

      console.log("History item deleted successfully:", historyId);
      res.status(200).json({ message: "History item deleted successfully." });
    } catch (error) {
      console.error("Error deleting review history item:", error);
      res
        .status(500)
        .json({ error: "Server error while deleting review history item." });
    }
  }
);

module.exports = router;
