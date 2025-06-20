// routes/tokengetter.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Ensure dotenv is configured in your server.js,
// which makes process.env.JWT_SECRET available here.

router.post("/tokengetter", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token found", success: false });
    }

    // Verify the token using the consistent JWT_SECRET from your .env
    // This is the crucial line that needs to be changed:
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // <--- Make sure this line is exactly like this

    res.json({
      success: true,
      decode: decoded,
      token: true,
      message: "successfully get Token",
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
});

module.exports = router;
