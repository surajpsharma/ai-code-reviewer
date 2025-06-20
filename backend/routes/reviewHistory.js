// routes/reviewHistory.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SearchHistory = require("../models/SearchHistory"); // Ensure this path is correct

// Middleware to verify JWT and get user ID
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  console.log("Token received in cookies:", token);
  if (!token) {
    console.log("No token found, sending 401.");
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    // --- ADD THIS CONSOLE.LOG HERE ---
    console.log("JWT_SECRET used for VERIFYING:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Assuming your token stores user ID as 'id'
    console.log("Token decoded, userId:", req.userId);
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message); // This is what you're seeing
    res.status(401).json({ message: "Token is not valid." });
  }
};
// @route   POST /api/save-review-history
// @desc    Save a user's code review to history
// @access  Private
router.post("/save-review-history", verifyToken, async (req, res) => {
  const { code, review, language, timestamp } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const newHistoryEntry = new SearchHistory({
      userId,
      searchQuery: JSON.stringify({ code, review, language, timestamp }), // Store as stringified JSON
    });
    await newHistoryEntry.save();
    res.status(201).json({ message: "Review history saved successfully." });
  } catch (error) {
    console.error("Error saving review history:", error);
    res
      .status(500)
      .json({ error: "Server error while saving review history." });
  }
});

// @route   GET /api/get-review-history
// @desc    Get a user's code review history
// @access  Private
router.get("/get-review-history", verifyToken, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    // Find history entries for the user, sort by timestamp descending
    const history = await SearchHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10); // Limit to last 10 reviews as per frontend logic

    // Parse the searchQuery back into an object
    const parsedHistory = history
      .map((entry) => {
        try {
          const data = JSON.parse(entry.searchQuery);
          return {
            id: entry._id, // Use _id from MongoDB as id
            code: data.code,
            review: data.review,
            language: data.language,
            timestamp: new Date(data.timestamp).toLocaleString(), // Ensure consistent timestamp format
          };
        } catch (e) {
          console.error("Error parsing history entry:", e);
          return null; // Handle malformed entries
        }
      })
      .filter((entry) => entry !== null); // Filter out any null entries from parsing errors

    res.status(200).json(parsedHistory);
  } catch (error) {
    console.error("Error fetching review history:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching review history." });
  }
});

// @route   DELETE /api/delete-review-history/:id
// @desc    Delete a specific review history item
// @access  Private
router.delete("/delete-review-history/:id", verifyToken, async (req, res) => {
  const historyId = req.params.id;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const result = await SearchHistory.deleteOne({
      _id: historyId,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "History item not found or not authorized." });
    }

    res.status(200).json({ message: "History item deleted successfully." });
  } catch (error) {
    console.error("Error deleting review history item:", error);
    res
      .status(500)
      .json({ error: "Server error while deleting review history item." });
  }
});

module.exports = router;
