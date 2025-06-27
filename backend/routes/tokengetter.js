const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/tokengetter", async (req, res) => {
  // --- Enhanced Debugging Logs ---
  console.log("Backend: /tokengetter endpoint hit.");
  console.log("Backend: Received cookies:", req.cookies);
  console.log("Backend: Request headers:", req.headers);
  console.log("Backend: User-Agent:", req.get("User-Agent"));
  console.log("Backend: Origin:", req.get("Origin"));

  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("Backend: Token not found in cookies.");
      return res
        .status(200)
        .json({
          message: "No token found",
          success: false,
          authenticated: false,
        });
    }

    console.log("Backend: Token found in cookies:", token);
    // --- New Debugging Log ---
    console.log(
      "Backend: JWT_SECRET for verification:",
      process.env.JWT_SECRET
    );

    // Check if JWT_SECRET is actually available
    if (!process.env.JWT_SECRET) {
      console.error(
        "Backend: JWT_SECRET is not defined in environment variables!"
      );
      return res.status(500).json({
        message: "Server configuration error: JWT secret missing.",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Backend: Token successfully decoded:", decoded); // Log the decoded payload

    res.json({
      success: true,
      decode: decoded,
      token: true, // You might send `decoded` directly if `token` is just a boolean flag
      message: "Successfully got Token",
    });
  } catch (error) {
    console.error("Backend: Token verification error:", error.message);

    // Provide more specific error messages based on JWT error types
    if (error.name === "TokenExpiredError") {
      return res
        .status(200)
        .json({
          message: "Token expired",
          success: false,
          authenticated: false,
        });
    } else if (error.name === "JsonWebTokenError") {
      // This covers invalid signature, malformed token, etc.
      return res
        .status(200)
        .json({
          message: "Invalid token",
          success: false,
          authenticated: false,
        });
    } else {
      // Catch any other unexpected errors during verification
      return res.status(200).json({
        message: "Token verification failed unexpectedly",
        success: false,
        authenticated: false,
      });
    }
  }
});

module.exports = router;
